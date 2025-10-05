from dotenv import load_dotenv
import os
from passlib.context import CryptContext
from fastapi.security import HTTPBearer
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timedelta, timezone
from jose import jwt
from schemas.client import ClientCreateSchema, ClientResponseSchema, ClientLoginSchema
from sqlalchemy.orm import Session
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
    print("ФВЫВЫФЫФВЫФВФЫВФЫВФЫВ321123213321312213231plain_pass:", plain_pass)
    print("hashed_pass:", hashed_pass)
    return pwd_context.verify(plain_pass, hashed_pass)


def create_access_token(data: dict, expires_minutes: int = 60):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    to_encode.update({'exp': expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@router.post('/login', summary=['Логин'])
def login(data: ClientLoginSchema, db: Session = Depends(database.get_db)):

    client = db.query(models.Client).filter(
        models.Client.email == data.email).first()
    if not client or not verify_password(data.password, client.hashed_password):
        raise HTTPException(
            status_code=401, detail='Неверная почта или пароль'
        )
    token = create_access_token({'sub': str(client.id)})

    return {'access_token': token, 'client_id': client.id, 'full_name': client.full_name, 'email': client.email, 'created_at': client.created_at, 'token_type': 'bearer'}


@router.post('/register', response_model=ClientResponseSchema, summary=['Регистрация'])
def create_client(data: ClientCreateSchema, db: Session = Depends(database.get_db)):

    if db.query(models.Client).filter(models.Client.email == data.email).first():
        raise HTTPException(
            status_code=400, detail='Email уже зарегистрирован')

    if db.query(models.Client).filter(models.Client.phone == data.phone).first():
        raise HTTPException(
            status_code=400, detail='Телефон уже зарегистрирован')

    db_client = models.Client(
        full_name=data.full_name,
        email=data.email,
        phone=data.phone,
        hashed_password=hash_password(data.password)
    )

    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client


@router.get('/allusers', summary=['Получить всех юзеров'])
def get_users(db: Session = Depends(database.get_db)):
    users = db.query(models.Client).all()
    return users
