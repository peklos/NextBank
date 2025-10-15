from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class ProcessCreateSchema(BaseModel):
    """Схема создания процесса"""
    process_type: str = Field(
        ..., description="Тип процесса: loan_application, card_issue, account_opening")
    branch_id: Optional[int] = Field(
        None, description="ID отделения (опционально)")


class ProcessResponse(BaseModel):
    """Схема ответа процесса"""
    id: int
    process_type: str
    status: str
    created_at: datetime
    client_id: int
    employee_id: Optional[int]
    branch_id: Optional[int]

    class Config:
        from_attributes = True


class ProcessUpdateStatusSchema(BaseModel):
    """Схема обновления статуса процесса"""
    status: str = Field(...,
                        description="Новый статус: in_progress, approved, rejected, completed")
