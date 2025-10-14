# schemas/card.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from schemas.account import AccountResponse   # 🆕 импортируем


class CardBase(BaseModel):
    card_type: str
    account_id: int


class CardCreate(CardBase):
    pass


class CardResponse(BaseModel):
    id: int
    card_number: str
    card_type: str
    expiration_date: datetime
    is_active: bool
    account_id: int

    # 🆕 Добавляем вложенный объект счёта
    account: Optional[AccountResponse] = None

    class Config:
        from_attributes = True


class CardDeleteResponse(BaseModel):
    success: bool
    deleted_card_id: int
