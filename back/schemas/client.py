from pydantic import BaseModel, EmailStr, field_validator, Field
from datetime import datetime
from typing import Optional
from utils.validators import validate_strong_password


class ClientCreateSchema(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    patronymic: Optional[str] = Field(None, max_length=50)
    email: EmailStr
    phone: str
    password: str

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        # ✅ Используем усиленную валидацию
        is_valid, message = validate_strong_password(v)
        if not is_valid:
            raise ValueError(message)
        return v

    @field_validator('first_name', 'last_name', 'patronymic')
    @classmethod
    def validate_name(cls, v: str) -> str:
        if v is not None and not v.replace(' ', '').replace('-', '').isalpha():
            raise ValueError(
                'Имя, фамилия и отчество должны содержать только буквы')
        return v


class ClientResponseSchema(BaseModel):
    id: int
    first_name: str
    last_name: str
    patronymic: Optional[str]
    email: EmailStr
    phone: str
    created_at: datetime

    model_config = {
        'from_attributes': True,
        'populate_by_name': True
    }


class ClientLoginSchema(BaseModel):
    """✅ Схема для логина клиента"""
    email: EmailStr
    password: str
