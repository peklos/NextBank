# schemas/account.py
from pydantic import BaseModel
from datetime import datetime


class AccountCreate(BaseModel):
    client_id: int  # ID клиента, к которому привязан счёт


class AccountResponse(BaseModel):
    id: int
    account_number: str
    balance: float
    created_at: datetime

    class Config:
        from_attributes = True
