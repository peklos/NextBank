from dotenv import load_dotenv
import os
from passlib.context import CryptContext
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timedelta, timezone
from jose import jwt
from schemas.client import ClientCreateSchema, ClientLoginSchema
from sqlalchemy.orm import Session, joinedload
from db import models, database

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')
if not SECRET_KEY:
    raise ValueError('SECRET_KEY не найден')

ALGORITHM = 'HS256'
pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

security = HTTPBearer()


def hash_password(password: str):
    return pwd_context.hash(password)


router = APIRouter(
    prefix='/auth',
    tags=['Аунтентификация']
)


def verify_password(plain_pass, hashed_pass):
    return pwd_context.verify(plain_pass, hashed_pass)


def create_access_token(data: dict, expires_minutes: int = 60):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    to_encode.update({'exp': expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(database.get_db)
):
    token = credentials.credentials  # тут токен из Swagger автоматически
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get('sub')
        if user_id is None:
            raise HTTPException(status_code=401, detail='Невалидный токен')
    except Exception:
        raise HTTPException(status_code=401, detail='Невалидный токен')

    user = (
        db.query(models.Client)
        .options(joinedload(models.Client.personal_info))
        .filter(models.Client.id == user_id)
        .first()
    )

    if user is None:
        raise HTTPException(status_code=401, detail='Пользователь не найден')

    return user


@router.get('/me', summary='Автологин(токен)')
def read_users_me(current_user: models.Client = Depends(get_current_user)):
    return {
        'id': current_user.id,
        'first_name': current_user.first_name,
        'last_name': current_user.last_name,
        'patronymic': current_user.patronymic,
        'email': current_user.email,
        'created_at': current_user.created_at,
        'personal_info': {
            'passport_number': current_user.personal_info.passport_number if current_user.personal_info else None,
            'address': current_user.personal_info.address if current_user.personal_info else None,
            'birth_date': current_user.personal_info.birth_date if current_user.personal_info else None,
            'employment_status': current_user.personal_info.employment_status if current_user.personal_info else None
        } if current_user.personal_info else None
    }


@router.post('/login', summary='Логин')
def login(data: ClientLoginSchema, db: Session = Depends(database.get_db)):

    client = (db.query(models.Client)
              .options(joinedload(models.Client.personal_info))
              .filter(models.Client.email == data.email)
              .first()
              )

    if not client or not verify_password(data.password, client.hashed_password):
        raise HTTPException(
            status_code=401, detail='Неверная почта или пароль'
        )

    token = create_access_token({'sub': str(client.id)})

    return {
        'access_token': token,
        'client_id': client.id,
        'first_name': client.first_name,
        'last_name': client.last_name,
        'patronymic': client.patronymic,
        'email': client.email,
        'created_at': client.created_at,
        'personal_info': {
            'passport_number': client.personal_info.passport_number if client.personal_info else None,
            'address': client.personal_info.address if client.personal_info else None,
            'birth_date': client.personal_info.birth_date if client.personal_info else None,
            'employment_status': client.personal_info.employment_status if client.personal_info else None
        } if client.personal_info else None,
        'token_type': 'bearer'
    }


@router.post('/register', summary='Регистрация')
def create_client(data: ClientCreateSchema, db: Session = Depends(database.get_db)):

    if db.query(models.Client).filter(models.Client.email == data.email).first():
        raise HTTPException(
            status_code=400, detail='Email уже зарегистрирован')

    if db.query(models.Client).filter(models.Client.phone == data.phone).first():
        raise HTTPException(
            status_code=400, detail='Телефон уже зарегистрирован')

    db_client = models.Client(
        first_name=data.first_name,
        last_name=data.last_name,
        patronymic=data.patronymic,
        email=data.email,
        phone=data.phone,
        hashed_password=hash_password(data.password)
    )

    db.add(db_client)
    db.commit()
    db.refresh(db_client)

    token = create_access_token({'sub': str(db_client.id)})

    return {
        'access_token': token,
        'client_id': db_client.id,
        'first_name': db_client.first_name,
        'last_name': db_client.last_name,
        'patronymic': db_client.patronymic,
        'email': db_client.email,
        'created_at': db_client.created_at,
        'token_type': 'bearer',
        'message': 'Регистрация прошла успешно'
    }


@router.get('/allusers', summary='Получить всех юзеров')
def get_users(db: Session = Depends(database.get_db)):
    users = db.query(models.Client).all()
    return users
