from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class LoanApplicationSchema(BaseModel):
    """Схема для подачи заявки на кредит"""
    amount: float = Field(..., gt=0, description="Сумма кредита")
    interest_rate: float = Field(..., gt=0, le=100,
                                 description="Процентная ставка")
    term_months: int = Field(..., gt=0, le=360,
                             description="Срок кредита в месяцах")


class LoanResponse(BaseModel):
    """Схема ответа с информацией о кредите"""
    id: int
    amount: float
    interest_rate: float
    term_months: int
    issued_at: datetime
    is_paid: bool
    paid_amount: float  # 🆕 Добавляем поле
    client_id: int

    class Config:
        from_attributes = True


class LoanPaymentSchema(BaseModel):
    """Схема для оплаты кредита"""
    payment_amount: float = Field(..., gt=0, description="Сумма платежа")
    card_id: int = Field(..., description="ID карты для списания")


class LoanScheduleItem(BaseModel):
    """Элемент графика платежей"""
    month: int
    payment_date: datetime
    monthly_payment: float
    principal_payment: float
    interest_payment: float
    remaining_balance: float


class LoanScheduleResponse(BaseModel):
    """Полный график платежей"""
    loan_id: int
    total_amount: float
    monthly_payment: float
    total_interest: float
    schedule: list[LoanScheduleItem]
