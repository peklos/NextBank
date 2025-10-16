from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random

from db.database import get_db
from schemas import card as card_schemas
from db import models
from routers.auth import get_current_user

router = APIRouter(
    prefix="/cards",
    tags=["Карты"]
)

# ==============================
# 🔢 Утилиты генерации
# ==============================


def generate_card_number():
    """Генерация случайного 16-значного номера карты"""
    return ''.join(str(random.randint(0, 9)) for _ in range(16))


def generate_cvv():
    """Генерация случайного CVV (3 цифры)"""
    return ''.join(str(random.randint(0, 9)) for _ in range(3))


def generate_expiration_date():
    """Срок действия карты — 4 года с момента выпуска"""
    return datetime.utcnow() + timedelta(days=365 * 4)


def create_transaction(
    db: Session,
    client_id: int,
    transaction_type: str,
    amount: float,
    description: str,
    from_card_id: int = None,
    to_card_id: int = None,
    loan_id: int = None
):
    """Вспомогательная функция для создания транзакции"""
    transaction = models.Transaction(
        client_id=client_id,
        transaction_type=transaction_type,
        amount=amount,
        description=description,
        status="completed",
        from_card_id=from_card_id,
        to_card_id=to_card_id,
        loan_id=loan_id
    )
    db.add(transaction)
    return transaction

# ==============================
# 🆕 Выпуск карты
# ==============================


@router.post("/", response_model=card_schemas.CardResponse, summary="Выпустить новую карту")
def create_card(
    card_data: card_schemas.CardCreate,
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
    # ✅ Проверка типа карты
    allowed_types = ["DEBIT", "CREDIT"]
    if card_data.card_type.upper() not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Неверный тип карты. Разрешено только: {', '.join(allowed_types)}"
        )

    # Проверяем, что счёт принадлежит текущему клиенту
    account = db.query(models.Account).filter(
        models.Account.id == card_data.account_id,
        models.Account.client_id == current_client.id
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="Счёт не найден")

    # Создаём карту
    new_card = models.Card(
        card_number=generate_card_number(),
        card_type=card_data.card_type.upper(),
        expiration_date=generate_expiration_date(),
        cvv=generate_cvv(),
        is_active=True,
        client_id=current_client.id,
        account_id=card_data.account_id
    )

    db.add(new_card)
    db.commit()
    db.refresh(new_card)
    return new_card


# ==============================
# 📜 Получение всех карт клиента
# ==============================


@router.get("/me", response_model=list[card_schemas.CardResponse], summary="Получить все мои карты")
def get_my_cards(
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
    cards = db.query(models.Card).filter(
        models.Card.client_id == current_client.id
    ).all()
    return cards

# ==============================
# 🚫 Деактивация карты
# ==============================


@router.patch("/{card_id}/deactivate", response_model=card_schemas.CardResponse, summary="Деактивировать карту")
def deactivate_card(
    card_id: int,
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
    card = db.query(models.Card).filter(
        models.Card.id == card_id,
        models.Card.client_id == current_client.id
    ).first()

    if not card:
        raise HTTPException(status_code=404, detail="Карта не найдена")

    if not card.is_active:
        raise HTTPException(status_code=400, detail="Карта уже деактивирована")

    card.is_active = False
    db.commit()
    db.refresh(card)
    return card

# ==============================
# 🗑️ Удаление карты
# ==============================


@router.delete("/{card_id}", response_model=card_schemas.CardDeleteResponse, summary="Удалить карту")
def delete_card(
    card_id: int,
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
    card = db.query(models.Card).filter(
        models.Card.id == card_id,
        models.Card.client_id == current_client.id
    ).first()

    if not card:
        raise HTTPException(status_code=404, detail="Карта не найдена")

    db.delete(card)
    db.commit()

    # Возвращаем только ID или сообщение
    return {"success": True, "deleted_card_id": card_id}


# ==============================
# 💰 Пополнение карты
# ==============================

@router.post("/{card_id}/deposit", summary="Пополнить карту")
def deposit_to_card(
    card_id: int,
    amount: float,
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
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

    card.account.balance += amount

    # 🆕 Создаем транзакцию
    create_transaction(
        db=db,
        client_id=current_client.id,
        transaction_type="deposit",
        amount=amount,
        description=f"Пополнение карты •••• {card.card_number[-4:]}",
        to_card_id=card.id
    )

    db.commit()
    return {"message": f"Баланс карты пополнен на {amount} ₽", "new_balance": card.account.balance}


# ==============================
# 💸 Снятие денег с карты
# ==============================


@router.post("/{card_id}/withdraw", summary="Снять деньги с карты")
def withdraw_from_card(
    card_id: int,
    amount: float,
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
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

    card.account.balance -= amount

    # 🆕 Создаем транзакцию
    create_transaction(
        db=db,
        client_id=current_client.id,
        transaction_type="withdraw",
        amount=amount,
        description=f"Снятие с карты •••• {card.card_number[-4:]}",
        from_card_id=card.id
    )

    db.commit()
    return {"message": f"С карты списано {amount} ₽", "new_balance": card.account.balance}

# ==============================
# 🔁 Перевод между картами
# ==============================


@router.post("/transfer", summary="Перевести с одной карты на другую")
def transfer_between_cards(
    from_card_id: int,
    to_card_number: str,
    amount: float,
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
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

    from_card.account.balance -= amount
    to_card.account.balance += amount

    # 🆕 Создаем транзакцию для отправителя
    create_transaction(
        db=db,
        client_id=current_client.id,
        transaction_type="transfer",
        amount=amount,
        description=f"Перевод на карту •••• {to_card_number[-4:]}",
        from_card_id=from_card.id,
        to_card_id=to_card.id
    )

    # 🆕 Создаем транзакцию для получателя (если это другой клиент)
    if to_card.client_id != current_client.id:
        create_transaction(
            db=db,
            client_id=to_card.client_id,
            transaction_type="deposit",
            amount=amount,
            description=f"Получен перевод от карты •••• {from_card.card_number[-4:]}",
            from_card_id=from_card.id,
            to_card_id=to_card.id
        )

    db.commit()

    return {"message": f"Переведено {amount} ₽ на карту {to_card_number}"}
