from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas.profile import (
    UpdateProfileSchema,
    ChangePasswordSchema,
    ChangeEmailSchema,
    ChangePhoneSchema,
    ProfileResponse
)
from routers.auth import get_current_user, hash_password, verify_password
from pydantic import BaseModel

router = APIRouter(
    prefix='/profile',
    tags=['Профиль пользователя']
)


# ==============================
# 📋 Получить полный профиль
# ==============================
@router.get('/me', response_model=ProfileResponse, summary='Получить мой профиль')
def get_my_profile(
    current_user: models.Client = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    """Получить полную информацию о профиле текущего пользователя"""
    return {
        'id': current_user.id,
        'first_name': current_user.first_name,
        'last_name': current_user.last_name,
        'patronymic': current_user.patronymic,
        'email': current_user.email,
        'phone': current_user.phone,
        'created_at': current_user.created_at,
        'personal_info': {
            'passport_number': current_user.personal_info.passport_number if current_user.personal_info else None,
            'address': current_user.personal_info.address if current_user.personal_info else None,
            'birth_date': current_user.personal_info.birth_date if current_user.personal_info else None,
            'employment_status': current_user.personal_info.employment_status if current_user.personal_info else None
        } if current_user.personal_info else None
    }


# ==============================
# ✏️ Обновить основную информацию профиля
# ==============================
@router.patch('/update', response_model=ProfileResponse, summary='Обновить профиль')
def update_profile(
    data: UpdateProfileSchema,
    current_user: models.Client = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    """Обновить основную информацию профиля (имя, фамилия, отчество)"""

    # Обновляем только переданные поля
    if data.first_name is not None:
        current_user.first_name = data.first_name

    if data.last_name is not None:
        current_user.last_name = data.last_name

    if data.patronymic is not None:
        current_user.patronymic = data.patronymic

    db.commit()
    db.refresh(current_user)

    return {
        'id': current_user.id,
        'first_name': current_user.first_name,
        'last_name': current_user.last_name,
        'patronymic': current_user.patronymic,
        'email': current_user.email,
        'phone': current_user.phone,
        'created_at': current_user.created_at,
        'personal_info': {
            'passport_number': current_user.personal_info.passport_number if current_user.personal_info else None,
            'address': current_user.personal_info.address if current_user.personal_info else None,
            'birth_date': current_user.personal_info.birth_date if current_user.personal_info else None,
            'employment_status': current_user.personal_info.employment_status if current_user.personal_info else None
        } if current_user.personal_info else None
    }


# ==============================
# 🔐 Изменить пароль
# ==============================
@router.post('/change-password', summary='Изменить пароль')
def change_password(
    data: ChangePasswordSchema,
    current_user: models.Client = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    """Изменить пароль пользователя"""

    # Проверяем текущий пароль
    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=400,
            detail='Неверный текущий пароль'
        )

    # Проверяем, что новый пароль отличается от старого
    if verify_password(data.new_password, current_user.hashed_password):
        raise HTTPException(
            status_code=400,
            detail='Новый пароль должен отличаться от текущего'
        )

    # Обновляем пароль
    current_user.hashed_password = hash_password(data.new_password)
    db.commit()

    return {
        'message': 'Пароль успешно изменен',
        'success': True
    }


# ==============================
# 📧 Изменить email
# ==============================
@router.post('/change-email', response_model=ProfileResponse, summary='Изменить email')
def change_email(
    data: ChangeEmailSchema,
    current_user: models.Client = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    """Изменить email пользователя"""

    # Проверяем пароль
    if not verify_password(data.password, current_user.hashed_password):
        raise HTTPException(
            status_code=400,
            detail='Неверный пароль'
        )

    # Проверяем, что новый email отличается от текущего
    if data.new_email.lower() == current_user.email.lower():
        raise HTTPException(
            status_code=400,
            detail='Новый email совпадает с текущим'
        )

    # Проверяем, не занят ли новый email
    existing_user = db.query(models.Client).filter(
        models.Client.email == data.new_email,
        models.Client.id != current_user.id
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail='Этот email уже используется другим пользователем'
        )

    # Обновляем email
    current_user.email = data.new_email
    db.commit()
    db.refresh(current_user)

    return {
        'id': current_user.id,
        'first_name': current_user.first_name,
        'last_name': current_user.last_name,
        'patronymic': current_user.patronymic,
        'email': current_user.email,
        'phone': current_user.phone,
        'created_at': current_user.created_at,
        'personal_info': {
            'passport_number': current_user.personal_info.passport_number if current_user.personal_info else None,
            'address': current_user.personal_info.address if current_user.personal_info else None,
            'birth_date': current_user.personal_info.birth_date if current_user.personal_info else None,
            'employment_status': current_user.personal_info.employment_status if current_user.personal_info else None
        } if current_user.personal_info else None
    }


# ==============================
# 📱 Изменить телефон
# ==============================
@router.post('/change-phone', response_model=ProfileResponse, summary='Изменить телефон')
def change_phone(
    data: ChangePhoneSchema,
    current_user: models.Client = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    """Изменить номер телефона пользователя"""

    # Проверяем пароль
    if not verify_password(data.password, current_user.hashed_password):
        raise HTTPException(
            status_code=400,
            detail='Неверный пароль'
        )

    # Очищаем номер от форматирования для сравнения
    clean_new_phone = ''.join(filter(str.isdigit, data.new_phone))
    clean_current_phone = ''.join(filter(str.isdigit, current_user.phone))

    # Проверяем, что новый телефон отличается от текущего
    if clean_new_phone == clean_current_phone:
        raise HTTPException(
            status_code=400,
            detail='Новый номер телефона совпадает с текущим'
        )

    # Проверяем, не занят ли новый номер
    existing_user = db.query(models.Client).filter(
        models.Client.phone == data.new_phone,
        models.Client.id != current_user.id
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail='Этот номер телефона уже используется другим пользователем'
        )

    # Обновляем телефон
    current_user.phone = data.new_phone
    db.commit()
    db.refresh(current_user)

    return {
        'id': current_user.id,
        'first_name': current_user.first_name,
        'last_name': current_user.last_name,
        'patronymic': current_user.patronymic,
        'email': current_user.email,
        'phone': current_user.phone,
        'created_at': current_user.created_at,
        'personal_info': {
            'passport_number': current_user.personal_info.passport_number if current_user.personal_info else None,
            'address': current_user.personal_info.address if current_user.personal_info else None,
            'birth_date': current_user.personal_info.birth_date if current_user.personal_info else None,
            'employment_status': current_user.personal_info.employment_status if current_user.personal_info else None
        } if current_user.personal_info else None
    }
