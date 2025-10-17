from pydantic import BaseModel, Field
from typing import Optional


class RoleCreate(BaseModel):
    """Схема создания роли"""
    name: str = Field(..., min_length=2, max_length=50,
                      description="Название роли")


class RoleUpdate(BaseModel):
    """Схема обновления роли"""
    name: Optional[str] = Field(
        None, min_length=2, max_length=50, description="Новое название роли")


class RoleResponse(BaseModel):
    """Схема ответа роли"""
    id: int
    name: str

    class Config:
        from_attributes = True
