from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random

from db.database import get_db
from schemas import card as card_schemas
from db import models
from routers.auth import get_current_user
from utils.encryption import encrypt_cvv, decrypt_cvv
from utils.transactions import safe_create_transaction, safe_transfer

router = APIRouter(
    prefix="/cards",
    tags=["Карты"]
)


def generate_card_number():
    """Генерация случайного 16-значного номера карты"""
    return ''.join(str(random.randint(0, 9)) for _ in range(16))


def generate_cvv():
    """Генерация случайного CVV (3 цифры)"""
    return ''.join(str(random.randint(0, 9)) for _ in range(3))


def generate_expiration_date():
    """Срок действия карты — 4 года с момента выпуска"""
    return datetime.utcnow() + timedelta(days=365 * 4)


@router.post("/", response_model=card_schemas.CardResponse, summary="Выпустить новую карту")
def create_card(
    card_data: card_schemas.CardCreate,
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
    """Выпуск новой карты с шифрованием CVV"""
    allowed_types = ["DEBIT", "CREDIT"]
    if card_data.card_type.upper() not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Неверный тип карты. Разрешено только: {', '.join(allowed_types)}"
        )

    account = db.query(models.Account).filter(
        models.Account.id == card_data.account_id,
        models.Account.client_id == current_client.id
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="Счёт не найден")

    # ✅ Генерируем CVV и сразу шифруем
    cvv_plain = generate_cvv()
    cvv_encrypted = encrypt_cvv(cvv_plain)

    try:
        new_card = models.Card(
            card_number=generate_card_number(),
            card_type=card_data.card_type.upper(),
            expiration_date=generate_expiration_date(),
            cvv=cvv_encrypted,  # ✅ Сохраняем зашифрованный CVV
            is_active=True,
            client_id=current_client.id,
            account_id=card_data.account_id
        )

        db.add(new_card)
        db.commit()
        db.refresh(new_card)

        # ✅ Возвращаем расшифрованный CVV только один раз при создании
        return {
            **card_schemas.CardResponse.model_validate(new_card).model_dump(),
            "cvv_plain": cvv_plain  # Только при создании!
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при создании карты: {str(e)}"
        )


@router.get("/me", response_model=list[card_schemas.CardResponse], summary="Получить все мои карты")
def get_my_cards(
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
    """Получение карт БЕЗ CVV (CVV не показываем в списках)"""
    cards = db.query(models.Card).filter(
        models.Card.client_id == current_client.id
    ).all()
    return cards


@router.post("/{card_id}/deposit", summary="Пополнить карту")
def deposit_to_card(
    card_id: int,
    amount: float,
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
    """Пополнение карты с безопасной транзакцией"""
    if amount <= 0:
        raise HTTPException(
            status_code=400, detail="Сумма должна быть положительной")

    card = db.query(models.Card).filter(
        models.Card.id == card_id,
        models.Card.client_id == current_client.id,
        models.Card.is_active == True
    ).first()

    if not card:
        raise HTTPException(
            status_code=404, detail="Карта не найдена или неактивна")

    try:
        card.account.balance += amount

        safe_create_transaction(
            db=db,
            client_id=current_client.id,
            transaction_type="deposit",
            amount=amount,
            description=f"Пополнение карты •••• {card.card_number[-4:]}",
            to_card_id=card.id
        )

        db.commit()
        return {
            "message": f"Баланс карты пополнен на {amount} ₽",
            "new_balance": card.account.balance
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при пополнении: {str(e)}"
        )


@router.post("/{card_id}/withdraw", summary="Снять деньги с карты")
def withdraw_from_card(
    card_id: int,
    amount: float,
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
    """Снятие денег с безопасной транзакцией"""
    if amount <= 0:
        raise HTTPException(
            status_code=400, detail="Сумма должна быть положительной")

    card = db.query(models.Card).filter(
        models.Card.id == card_id,
        models.Card.client_id == current_client.id,
        models.Card.is_active == True
    ).first()

    if not card:
        raise HTTPException(
            status_code=404, detail="Карта не найдена или неактивна")

    if card.account.balance < amount:
        raise HTTPException(status_code=400, detail="Недостаточно средств")

    try:
        card.account.balance -= amount

        safe_create_transaction(
            db=db,
            client_id=current_client.id,
            transaction_type="withdraw",
            amount=amount,
            description=f"Снятие с карты •••• {card.card_number[-4:]}",
            from_card_id=card.id
        )

        db.commit()
        return {
            "message": f"С карты списано {amount} ₽",
            "new_balance": card.account.balance
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при снятии: {str(e)}"
        )


@router.post("/transfer", summary="Перевести с одной карты на другую")
def transfer_between_cards(
    from_card_id: int,
    to_card_number: str,
    amount: float,
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
    """Перевод между картами с безопасной транзакцией и rollback"""
    if amount <= 0:
        raise HTTPException(
            status_code=400, detail="Сумма должна быть положительной")

    from_card = db.query(models.Card).filter(
        models.Card.id == from_card_id,
        models.Card.client_id == current_client.id,
        models.Card.is_active == True
    ).first()

    if not from_card:
        raise HTTPException(
            status_code=404, detail="Карта отправителя не найдена или неактивна")

    to_card = db.query(models.Card).filter(
        models.Card.card_number == to_card_number,
        models.Card.is_active == True
    ).first()

    if not to_card:
        raise HTTPException(
            status_code=404, detail="Карта получателя не найдена или неактивна")

    if from_card.account.balance < amount:
        raise HTTPException(status_code=400, detail="Недостаточно средств")

    # ✅ Используем безопасную функцию перевода
    result = safe_transfer(
        db=db,
        from_card=from_card,
        to_card=to_card,
        amount=amount,
        client_id=current_client.id
    )

    return result


@router.patch("/{card_id}/deactivate", summary="Деактивировать карту")
def deactivate_card(
    card_id: int,
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
    """Деактивация карты (установка is_active = False)"""
    card = db.query(models.Card).filter(
        models.Card.id == card_id,
        models.Card.client_id == current_client.id
    ).first()

    if not card:
        raise HTTPException(
            status_code=404, detail="Карта не найдена или не принадлежит вам")

    if not card.is_active:
        raise HTTPException(
            status_code=400, detail="Карта уже деактивирована")

    card.is_active = False
    db.commit()
    db.refresh(card)

    return {
        "message": "Карта успешно деактивирована",
        "card": card
    }


@router.delete("/{card_id}", summary="Удалить карту")
def delete_card(
    card_id: int,
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
    """Удаление карты"""
    card = db.query(models.Card).filter(
        models.Card.id == card_id,
        models.Card.client_id == current_client.id
    ).first()

    if not card:
        raise HTTPException(
            status_code=404, detail="Карта не найдена или не принадлежит вам")

    db.delete(card)
    db.commit()

    return {
        "message": "Карта успешно удалена",
        "deleted_card_id": card_id
    }
