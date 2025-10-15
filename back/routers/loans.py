from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from db.database import get_db
from db import models
from schemas.loan import (
    LoanApplicationSchema,
    LoanResponse,
    LoanPaymentSchema,
    LoanScheduleResponse,
    LoanScheduleItem
)
from routers.auth import get_current_user

router = APIRouter(
    prefix="/loans",
    tags=["Кредиты"]
)


# ==============================
# 🆕 Подать заявку на кредит
# ==============================
@router.post("/apply", response_model=LoanResponse, summary="Подать заявку на кредит")
def apply_for_loan(
    loan_data: LoanApplicationSchema,
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
    """
    Подача заявки на кредит.
    Автоматически создается процесс оформления.
    """
    # Проверяем, есть ли у клиента персональная информация
    if not current_client.personal_info:
        raise HTTPException(
            status_code=400,
            detail="Для подачи заявки на кредит необходимо заполнить персональные данные"
        )

    # Создаем кредит
    new_loan = models.Loan(
        amount=loan_data.amount,
        interest_rate=loan_data.interest_rate,
        term_months=loan_data.term_months,
        is_paid=False,
        client_id=current_client.id
    )
    db.add(new_loan)
    db.flush()

    # Создаем процесс оформления кредита
    process = models.Process(
        process_type="loan_application",
        status="in_progress",
        client_id=current_client.id,
        employee_id=None,
        branch_id=None
    )
    db.add(process)
    db.commit()
    db.refresh(new_loan)

    return new_loan


# ==============================
# 📜 Получить все кредиты клиента
# ==============================
@router.get("/me", response_model=list[LoanResponse], summary="Получить все мои кредиты")
def get_my_loans(
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
    """
    Возвращает список всех кредитов текущего клиента.
    """
    loans = db.query(models.Loan).filter(
        models.Loan.client_id == current_client.id
    ).all()
    return loans


# ==============================
# 🔍 Получить детали конкретного кредита
# ==============================
@router.get("/{loan_id}", response_model=LoanResponse, summary="Получить детали кредита")
def get_loan_details(
    loan_id: int,
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
    """
    Возвращает детальную информацию о конкретном кредите.
    """
    loan = db.query(models.Loan).filter(
        models.Loan.id == loan_id,
        models.Loan.client_id == current_client.id
    ).first()

    if not loan:
        raise HTTPException(status_code=404, detail="Кредит не найден")

    return loan


# ==============================
# 💰 Оплатить кредит 
# ==============================
@router.post("/{loan_id}/pay", summary="Оплатить кредит")
def pay_loan(
    loan_id: int,
    payment_data: LoanPaymentSchema,
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
    """
    Оплата кредита с указанной карты.
    Можно оплатить полностью или частично.
    """
    # Проверяем кредит
    loan = db.query(models.Loan).filter(
        models.Loan.id == loan_id,
        models.Loan.client_id == current_client.id
    ).first()

    if not loan:
        raise HTTPException(status_code=404, detail="Кредит не найден")

    if loan.is_paid:
        raise HTTPException(
            status_code=400, detail="Кредит уже полностью оплачен")

    # Проверяем карту
    card = db.query(models.Card).filter(
        models.Card.id == payment_data.card_id,
        models.Card.client_id == current_client.id,
        models.Card.is_active == True
    ).first()

    if not card:
        raise HTTPException(
            status_code=404, detail="Карта не найдена или неактивна")

    # Рассчитываем общую сумму к оплате (с процентами)
    total_amount = loan.amount * (1 + loan.interest_rate / 100)

    # 🆕 Рассчитываем оставшуюся сумму
    remaining_amount = total_amount - loan.paid_amount

    if payment_data.payment_amount > remaining_amount:
        raise HTTPException(
            status_code=400,
            detail=f"Сумма платежа превышает остаток по кредиту ({remaining_amount:.2f} ₽)"
        )

    # Проверяем баланс карты
    if card.account.balance < payment_data.payment_amount:
        raise HTTPException(
            status_code=400, detail="Недостаточно средств на карте")

    # Списываем средства
    card.account.balance -= payment_data.payment_amount

    # 🆕 Обновляем оплаченную сумму
    loan.paid_amount += payment_data.payment_amount

    # 🆕 Пересчитываем остаток
    new_remaining = total_amount - loan.paid_amount

    # Если оплачена полная сумма - помечаем кредит оплаченным
    if new_remaining <= 0.01:  # небольшая погрешность для float
        loan.is_paid = True
        new_remaining = 0
        message = f"Кредит полностью оплачен! Списано {payment_data.payment_amount:.2f} ₽"
    else:
        message = f"Частичная оплата кредита. Списано {payment_data.payment_amount:.2f} ₽"

    db.commit()

    return {
        "message": message,
        "paid_amount": payment_data.payment_amount,
        "total_paid": loan.paid_amount,
        "remaining_amount": new_remaining,
        "card_balance": card.account.balance
    }


# ==============================
# 📊 График платежей по кредиту
# ==============================
@router.get("/{loan_id}/schedule", response_model=LoanScheduleResponse, summary="Получить график платежей")
def get_loan_schedule(
    loan_id: int,
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
    """
    Возвращает график платежей по кредиту (аннуитетный метод).
    """
    loan = db.query(models.Loan).filter(
        models.Loan.id == loan_id,
        models.Loan.client_id == current_client.id
    ).first()

    if not loan:
        raise HTTPException(status_code=404, detail="Кредит не найден")

    # Расчет аннуитетного платежа
    P = loan.amount  # Сумма кредита
    r = loan.interest_rate / 100 / 12  # Месячная ставка
    n = loan.term_months  # Количество месяцев

    # Формула аннуитетного платежа
    if r > 0:
        monthly_payment = P * (r * (1 + r)**n) / ((1 + r)**n - 1)
    else:
        monthly_payment = P / n

    # Генерация графика
    schedule = []
    remaining_balance = P
    current_date = loan.issued_at

    for month in range(1, n + 1):
        interest_payment = remaining_balance * r
        principal_payment = monthly_payment - interest_payment
        remaining_balance -= principal_payment

        payment_date = current_date + timedelta(days=30 * month)

        schedule.append(LoanScheduleItem(
            month=month,
            payment_date=payment_date,
            monthly_payment=round(monthly_payment, 2),
            principal_payment=round(principal_payment, 2),
            interest_payment=round(interest_payment, 2),
            remaining_balance=round(max(0, remaining_balance), 2)
        ))

    total_interest = monthly_payment * n - P

    return LoanScheduleResponse(
        loan_id=loan.id,
        total_amount=round(P, 2),
        monthly_payment=round(monthly_payment, 2),
        total_interest=round(total_interest, 2),
        schedule=schedule
    )
