from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TransactionResponse(BaseModel):
    """Схема ответа транзакции"""
    id: int
    transaction_type: str
    amount: float
    description: Optional[str]
    created_at: datetime
    status: str
    from_card_id: Optional[int]
    to_card_id: Optional[int]
    loan_id: Optional[int]
    client_id: int

    class Config:
        from_attributes = True


class TransactionStatsResponse(BaseModel):
    """Статистика по транзакциям"""
    total_transactions: int
    total_deposits: float
    total_withdrawals: float
    total_transfers: float
    total_loan_payments: float