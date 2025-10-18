from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from db.database import get_db
from db import models
from routers.employee_auth import get_current_employee, check_permission

router = APIRouter(
    prefix="/admin/clients",
    tags=["Управление клиентами (Admin)"]
)


@router.get("/", summary="Получить всех клиентов")
def get_all_clients(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Получить список всех клиентов с пагинацией"""
    # 🆕 Доступ для SuperAdmin, Manager и Support
    check_permission(current_employee, ["SuperAdmin", "Manager", "Support"])

    clients = (
        db.query(models.Client)
        .options(joinedload(models.Client.personal_info))
        .offset(skip)
        .limit(limit)
        .all()
    )

    return clients


@router.get("/search", summary="Поиск клиентов")
def search_clients(
    query: str,
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Поиск клиентов по имени, email или телефону"""
    check_permission(current_employee, ["SuperAdmin", "Manager", "Support"])

    clients = (
        db.query(models.Client)
        .options(joinedload(models.Client.personal_info))
        .filter(
            (models.Client.first_name.ilike(f"%{query}%")) |
            (models.Client.last_name.ilike(f"%{query}%")) |
            (models.Client.email.ilike(f"%{query}%")) |
            (models.Client.phone.ilike(f"%{query}%"))
        )
        .all()
    )

    return clients


@router.get("/{client_id}", summary="Получить клиента по ID")
def get_client_by_id(
    client_id: int,
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Получить детальную информацию о клиенте"""
    check_permission(current_employee, ["SuperAdmin", "Manager", "Support"])

    client = (
        db.query(models.Client)
        .options(
            joinedload(models.Client.personal_info),
            joinedload(models.Client.accounts),
            joinedload(models.Client.cards),
            joinedload(models.Client.loans)
        )
        .filter(models.Client.id == client_id)
        .first()
    )

    if not client:
        raise HTTPException(status_code=404, detail="Клиент не найден")

    # Подсчёт статистики клиента
    total_balance = sum(account.balance for account in client.accounts)
    total_loans = sum(loan.amount for loan in client.loans if not loan.is_paid)

    return {
        "client": client,
        "statistics": {
            "total_accounts": len(client.accounts),
            "total_cards": len(client.cards),
            "total_balance": total_balance,
            "active_loans": len([l for l in client.loans if not l.is_paid]),
            "total_loan_debt": total_loans
        }
    }


@router.get("/{client_id}/accounts", summary="Получить счета клиента")
def get_client_accounts(
    client_id: int,
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Получить все счета конкретного клиента"""
    check_permission(current_employee, [
                     "SuperAdmin", "Manager", "Support", "Cashier"])

    client = db.query(models.Client).filter(
        models.Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Клиент не найден")

    accounts = db.query(models.Account).filter(
        models.Account.client_id == client_id
    ).all()

    return accounts


@router.get("/{client_id}/transactions", summary="Получить транзакции клиента")
def get_client_transactions(
    client_id: int,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Получить последние транзакции клиента"""
    check_permission(current_employee, ["SuperAdmin", "Manager", "Support"])

    client = db.query(models.Client).filter(
        models.Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Клиент не найден")

    transactions = (
        db.query(models.Transaction)
        .filter(models.Transaction.client_id == client_id)
        .order_by(models.Transaction.created_at.desc())
        .limit(limit)
        .all()
    )

    return transactions


@router.get("/stats/overview", summary="Статистика по клиентам")
def get_clients_stats(
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Получить общую статистику по клиентам"""
    check_permission(current_employee, ["SuperAdmin", "Manager"])

    total_clients = db.query(models.Client).count()
    total_accounts = db.query(models.Account).count()
    total_cards = db.query(models.Card).count()
    total_loans = db.query(models.Loan).count()
    active_loans = db.query(models.Loan).filter(
        models.Loan.is_paid == False).count()

    # Общий баланс по всем счетам
    total_balance = db.query(models.func.sum(
        models.Account.balance)).scalar() or 0

    # Общий долг по кредитам
    total_debt = db.query(
        models.func.sum(models.Loan.amount *
                        (1 + models.Loan.interest_rate / 100))
    ).filter(models.Loan.is_paid == False).scalar() or 0

    return {
        "total_clients": total_clients,
        "total_accounts": total_accounts,
        "total_cards": total_cards,
        "total_loans": total_loans,
        "active_loans": active_loans,
        "total_balance": round(total_balance, 2),
        "total_debt": round(total_debt, 2)
    }
