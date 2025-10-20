from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime
from typing import Optional


class UpdateProfileSchema(BaseModel):
    """Схема для обновления основной информации профиля"""
    first_name: Optional[str] = Field(None, min_length=2, max_length=50)
    last_name: Optional[str] = Field(None, min_length=2, max_length=50)
    patronymic: Optional[str] = Field(None, max_length=50)

    @field_validator('first_name', 'last_name', 'patronymic')
    @classmethod
    def validate_name(cls, v: str) -> str:
        if v is not None and v.strip():
            # Проверяем, что содержит только буквы, пробелы и дефисы
            if not all(c.isalpha() or c.isspace() or c == '-' for c in v):
                raise ValueError('Поле должно содержать только буквы, пробелы и дефисы')
        return v


class ChangePasswordSchema(BaseModel):
    """Схема для изменения пароля"""
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=6)

    @field_validator('new_password')
    @classmethod
    def validate_new_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError('Новый пароль должен содержать минимум 6 символов')
        if not any(char.isdigit() for char in v):
            raise ValueError('Новый пароль должен содержать хотя бы одну цифру')
        if not all(char.isalnum() for char in v):
            raise ValueError('Новый пароль должен содержать только латинские буквы и цифры')
        return v


class ChangeEmailSchema(BaseModel):
    """Схема для изменения email"""
    new_email: EmailStr
    password: str = Field(..., min_length=1)


class ChangePhoneSchema(BaseModel):
    """Схема для изменения телефона"""
    new_phone: str = Field(..., min_length=11, max_length=18)
    password: str = Field(..., min_length=1)

    @field_validator('new_phone')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        # Убираем все нецифровые символы для валидации
        digits = ''.join(filter(str.isdigit, v))
        
        if len(digits) != 11:
            raise ValueError('Номер телефона должен содержать 11 цифр')
        
        if not digits.startswith('7'):
            raise ValueError('Номер телефона должен начинаться с 7')
        
        return v


class PersonalInfoResponse(BaseModel):
    """Схема для персональной информации в ответе"""
    passport_number: Optional[str]
    address: Optional[str]
    birth_date: Optional[datetime]
    employment_status: Optional[str]

    class Config:
        from_attributes = True


class ProfileResponse(BaseModel):
    """Схема ответа с полной информацией о профиле"""
    id: int
    first_name: str
    last_name: str
    patronymic: Optional[str]
    email: EmailStr
    phone: str
    created_at: datetime
    personal_info: Optional[PersonalInfoResponse]

    class Config:
        from_attributes = True