from pydantic import BaseModel, EmailStr, field_validator, Field
from datetime import datetime


class ClientCreateSchema(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    password: str

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError('Пароль должен быть не менее 6 символов')
        if not any(char.isdigit() for char in v):
            raise ValueError('Пароль должен содержать хотя бы одну цифру')
        return v


class ClientResponseSchema(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: str
    created_at: datetime

    model_config = {
        'from_attributes': True,
        'populate_by_name': True
    }


class ClientLoginSchema(BaseModel):
    email: EmailStr
    password: str

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError('Пароль должен быть не менее 6 символов')
        if not any(char.isdigit() for char in v):
            raise ValueError('Пароль должен содержать хотя бы одну цифру')
        return v
