from dotenv import load_dotenv
import os
from passlib.context import CryptContext
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timedelta, timezone
from jose import jwt
from schemas.employee import EmployeeCreateSchema, EmployeeLoginSchema
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
    prefix='/admin/auth',
    tags=['Аутентификация сотрудников']
)


def verify_password(plain_pass, hashed_pass):
    return pwd_context.verify(plain_pass, hashed_pass)


def create_access_token(data: dict, expires_minutes: int = 480):  # 8 часов для сотрудников
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    to_encode.update({'exp': expire, 'type': 'employee'})  # Тип токена
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_employee(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(database.get_db)
):
    """Получить текущего авторизованного сотрудника"""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        employee_id: str = payload.get('sub')
        token_type: str = payload.get('type')

        if employee_id is None or token_type != 'employee':
            raise HTTPException(status_code=401, detail='Невалидный токен')
    except Exception:
        raise HTTPException(status_code=401, detail='Невалидный токен')

    employee = (
        db.query(models.Employee)
        .options(
            joinedload(models.Employee.role),
            joinedload(models.Employee.branch)
        )
        .filter(models.Employee.id == employee_id)
        .first()
    )

    if employee is None:
        raise HTTPException(status_code=401, detail='Сотрудник не найден')

    if not employee.is_active:
        raise HTTPException(
            status_code=403, detail='Аккаунт сотрудника деактивирован')

    return employee


def check_permission(employee: models.Employee, allowed_roles: list[str]):
    """Проверка прав доступа"""
    if employee.role.name not in allowed_roles:
        raise HTTPException(
            status_code=403,
            detail=f'Недостаточно прав. Требуется роль: {", ".join(allowed_roles)}'
        )


@router.get('/me', summary='Автологин сотрудника (токен)')
def read_employee_me(current_employee: models.Employee = Depends(get_current_employee)):
    return {
        'id': current_employee.id,
        'first_name': current_employee.first_name,
        'last_name': current_employee.last_name,
        'patronymic': current_employee.patronymic,
        'email': current_employee.email,
        'is_active': current_employee.is_active,
        'created_at': current_employee.created_at,
        'role': {
            'id': current_employee.role.id,
            'name': current_employee.role.name
        } if current_employee.role else None,
        'branch': {
            'id': current_employee.branch.id,
            'name': current_employee.branch.name,
            'address': current_employee.branch.address
        } if current_employee.branch else None
    }


@router.post('/login', summary='Логин сотрудника')
def login(data: EmployeeLoginSchema, db: Session = Depends(database.get_db)):
    employee = (db.query(models.Employee)
                .options(
                    joinedload(models.Employee.role),
                    joinedload(models.Employee.branch)
    )
        .filter(models.Employee.email == data.email)
        .first()
    )

    if not employee or not verify_password(data.password, employee.hashed_password):
        raise HTTPException(
            status_code=401, detail='Неверная почта или пароль'
        )

    if not employee.is_active:
        raise HTTPException(
            status_code=403, detail='Аккаунт деактивирован. Обратитесь к администратору'
        )

    token = create_access_token({'sub': str(employee.id)})

    return {
        'access_token': token,
        'employee_id': employee.id,
        'first_name': employee.first_name,
        'last_name': employee.last_name,
        'patronymic': employee.patronymic,
        'email': employee.email,
        'is_active': employee.is_active,
        'created_at': employee.created_at,
        'role': {
            'id': employee.role.id,
            'name': employee.role.name
        } if employee.role else None,
        'branch': {
            'id': employee.branch.id,
            'name': employee.branch.name,
            'address': employee.branch.address
        } if employee.branch else None,
        'token_type': 'bearer'
    }


@router.post('/register', summary='Регистрация сотрудника (только Admin)')
def create_employee(
    data: EmployeeCreateSchema,
    db: Session = Depends(database.get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Создание нового сотрудника (только для Admin)"""
    check_permission(current_employee, ["Admin"])

    if db.query(models.Employee).filter(models.Employee.email == data.email).first():
        raise HTTPException(
            status_code=400, detail='Email уже зарегистрирован')

    # Проверка существования роли
    role = db.query(models.Role).filter(models.Role.id == data.role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail='Роль не найдена')

    # Проверка существования отделения
    branch = db.query(models.Branch).filter(
        models.Branch.id == data.branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail='Отделение не найдено')

    db_employee = models.Employee(
        first_name=data.first_name,
        last_name=data.last_name,
        patronymic=data.patronymic,
        email=data.email,
        hashed_password=hash_password(data.password),
        role_id=data.role_id,
        branch_id=data.branch_id,
        is_active=True
    )

    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)

    return {
        'employee_id': db_employee.id,
        'first_name': db_employee.first_name,
        'last_name': db_employee.last_name,
        'patronymic': db_employee.patronymic,
        'email': db_employee.email,
        'role_id': db_employee.role_id,
        'branch_id': db_employee.branch_id,
        'created_at': db_employee.created_at,
        'message': 'Сотрудник успешно зарегистрирован'
    }
