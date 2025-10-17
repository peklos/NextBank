from pydantic import BaseModel, Field
from typing import Optional


class BranchCreate(BaseModel):
    """Схема создания отделения"""
    name: str = Field(..., min_length=2, max_length=100,
                      description="Название отделения")
    address: str = Field(..., min_length=5, max_length=255,
                         description="Адрес отделения")
    phone: Optional[str] = Field(
        None, max_length=20, description="Телефон отделения")


class BranchUpdate(BaseModel):
    """Схема обновления отделения"""
    name: Optional[str] = Field(
        None, min_length=2, max_length=100, description="Новое название")
    address: Optional[str] = Field(
        None, min_length=5, max_length=255, description="Новый адрес")
    phone: Optional[str] = Field(
        None, max_length=20, description="Новый телефон")


class BranchResponse(BaseModel):
    """Схема ответа отделения"""
    id: int
    name: str
    address: str
    phone: Optional[str]

    class Config:
        from_attributes = True
