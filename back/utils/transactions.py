"""
Утилиты для безопасной работы с транзакциями
"""
from sqlalchemy.orm import Session
from db import models
from fastapi import HTTPException


def safe_create_transaction(
    db: Session,
    client_id: int,
    transaction_type: str,
    amount: float,
    description: str,
    from_card_id: int = None,
    to_card_id: int = None,
    loan_id: int = None
) -> models.Transaction:
    """
    Безопасное создание транзакции с обработкой ошибок
    """
    try:
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
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при создании транзакции: {str(e)}"
        )


def safe_transfer(
    db: Session,
    from_card: models.Card,
    to_card: models.Card,
    amount: float,
    client_id: int
) -> dict:
    """
    Безопасный перевод между картами с rollback при ошибке
    """
    try:
        # Начинаем транзакцию
        from_card.account.balance -= amount
        to_card.account.balance += amount

        # Создаём запись транзакции для отправителя
        safe_create_transaction(
            db=db,
            client_id=client_id,
            transaction_type="transfer",
            amount=amount,
            description=f"Перевод на карту •••• {to_card.card_number[-4:]}",
            from_card_id=from_card.id,
            to_card_id=to_card.id
        )

        # Создаём запись для получателя (если другой клиент)
        if to_card.client_id != client_id:
            safe_create_transaction(
                db=db,
                client_id=to_card.client_id,
                transaction_type="deposit",
                amount=amount,
                description=f"Получен перевод от карты •••• {from_card.card_number[-4:]}",
                from_card_id=from_card.id,
                to_card_id=to_card.id
            )

        db.commit()

        return {
            "success": True,
            "message": f"Переведено {amount} ₽ на карту {to_card.card_number}",
            "new_balance": from_card.account.balance
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при переводе: {str(e)}"
        )
