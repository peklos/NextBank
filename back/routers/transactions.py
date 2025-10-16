from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_
from db.database import get_db
from db import models
from schemas.transaction import TransactionResponse, TransactionStatsResponse
from routers.auth import get_current_user
from typing import Optional

router = APIRouter(
    prefix="/transactions",
    tags=["Транзакции"]
)


# ==============================
# 📜 Получить все транзакции клиента
# ==============================
@router.get("/me", response_model=list[TransactionResponse], summary="Получить все мои транзакции")
def get_my_transactions(
    limit: Optional[int] = Query(50, description="Количество транзакций"),
    offset: Optional[int] = Query(0, description="Смещение"),
    transaction_type: Optional[str] = Query(
        None, description="Фильтр по типу: deposit, withdraw, transfer, loan_payment"),
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
    """
    Возвращает список всех транзакций текущего клиента.
    Можно фильтровать по типу и использовать пагинацию.
    """
    query = db.query(models.Transaction).filter(
        models.Transaction.client_id == current_client.id
    )

    if transaction_type:
        query = query.filter(
            models.Transaction.transaction_type == transaction_type)

    transactions = query.order_by(desc(models.Transaction.created_at)).limit(
        limit).offset(offset).all()

    return transactions


# ==============================
# 🔍 Получить детали конкретной транзакции
# ==============================
@router.get("/{transaction_id}", response_model=TransactionResponse, summary="Получить детали транзакции")
def get_transaction_details(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
    """
    Возвращает детальную информацию о конкретной транзакции.
    """
    transaction = db.query(models.Transaction).filter(
        models.Transaction.id == transaction_id,
        models.Transaction.client_id == current_client.id
    ).first()

    if not transaction:
        raise HTTPException(status_code=404, detail="Транзакция не найдена")

    return transaction


# ==============================
# 📊 Статистика по транзакциям
# ==============================
@router.get("/me/stats", response_model=TransactionStatsResponse, summary="Статистика по моим транзакциям")
def get_my_transactions_stats(
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
    """
    Возвращает статистику по транзакциям клиента.
    """
    transactions = db.query(models.Transaction).filter(
        models.Transaction.client_id == current_client.id,
        models.Transaction.status == "completed"
    ).all()

    stats = {
        "total_transactions": len(transactions),
        "total_deposits": sum(t.amount for t in transactions if t.transaction_type == "deposit"),
        "total_withdrawals": sum(t.amount for t in transactions if t.transaction_type == "withdraw"),
        "total_transfers": sum(t.amount for t in transactions if t.transaction_type == "transfer"),
        "total_loan_payments": sum(t.amount for t in transactions if t.transaction_type == "loan_payment")
    }

    return stats


# ==============================
# 🔎 Поиск транзакций
# ==============================
@router.get("/search/", response_model=list[TransactionResponse], summary="Поиск транзакций")
def search_transactions(
    query: str = Query(..., description="Поисковый запрос (сумма, описание)"),
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
    """
    Поиск транзакций по описанию или сумме.
    """
    transactions = db.query(models.Transaction).filter(
        models.Transaction.client_id == current_client.id,
        or_(
            models.Transaction.description.ilike(f"%{query}%"),
            models.Transaction.amount.cast(models.String).ilike(f"%{query}%")
        )
    ).order_by(desc(models.Transaction.created_at)).all()

    return transactions
