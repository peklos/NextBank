import os
from sqlalchemy.orm import Session
from db import models
from passlib.context import CryptContext
from dotenv import load_dotenv

load_dotenv()

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


def hash_password(password: str):
    return pwd_context.hash(password)


def init_roles(db: Session):
    """Инициализация основных ролей для банка"""
    roles_data = [
        {"name": "SuperAdmin"},      # 🆕 Супер-администратор - только один в системе
        {"name": "Manager"},         # Менеджер - управление процессами и клиентами
        {"name": "Support"},         # Поддержка - просмотр информации о клиентах
        {"name": "Cashier"},         # Кассир - работа со счетами клиентов
        {"name": "Loan_Officer"},    # Кредитный специалист - работа с кредитами
    ]

    for role_data in roles_data:
        existing_role = db.query(models.Role).filter(
            models.Role.name == role_data["name"]
        ).first()

        if not existing_role:
            new_role = models.Role(**role_data)
            db.add(new_role)
            print(f"✅ Создана роль: {role_data['name']}")
        else:
            print(f"ℹ️  Роль уже существует: {role_data['name']}")

    db.commit()


def init_branches(db: Session):
    """Инициализация отделений в Брянске"""
    branches_data = [
        {
            "name": "Центральное отделение",
            "address": "г. Брянск, пр-т Ленина, д. 45",
            "phone": "+7 (4832) 123-45-67"
        },
        {
            "name": "Бежицкое отделение",
            "address": "г. Брянск, ул. Советская, д. 12А",
            "phone": "+7 (4832) 234-56-78"
        },
        {
            "name": "Фокинское отделение",
            "address": "г. Брянск, ул. Красноармейская, д. 89",
            "phone": "+7 (4832) 345-67-89"
        }
    ]

    for branch_data in branches_data:
        existing_branch = db.query(models.Branch).filter(
            models.Branch.name == branch_data["name"]
        ).first()

        if not existing_branch:
            new_branch = models.Branch(**branch_data)
            db.add(new_branch)
            print(f"✅ Создано отделение: {branch_data['name']}")
        else:
            print(f"ℹ️  Отделение уже существует: {branch_data['name']}")

    db.commit()


def create_superadmin(db: Session):
    """
    🆕 Автоматическое создание SuperAdmin из .env

    Учетные данные берутся из переменных окружения:
    - SUPERADMIN_EMAIL
    - SUPERADMIN_PASSWORD
    """
    # Получаем учетные данные из .env
    superadmin_email = os.getenv("SUPERADMIN_EMAIL", "superadmin@nextbank.ru")
    superadmin_password = os.getenv("SUPERADMIN_PASSWORD")

    if not superadmin_password:
        print("❌ ОШИБКА: SUPERADMIN_PASSWORD не найден в .env файле!")
        return

    # Проверяем, есть ли роль SuperAdmin
    superadmin_role = db.query(models.Role).filter(
        models.Role.name == "SuperAdmin"
    ).first()

    if not superadmin_role:
        print("❌ Роль SuperAdmin не найдена!")
        return

    # Проверяем, существует ли уже SuperAdmin
    existing_superadmin = db.query(models.Employee).filter(
        models.Employee.role_id == superadmin_role.id
    ).first()

    if existing_superadmin:
        print(f"ℹ️  SuperAdmin уже существует: {existing_superadmin.email}")
        return

    # Получаем первое отделение
    first_branch = db.query(models.Branch).first()
    if not first_branch:
        print("❌ Отделения не найдены! Сначала создайте отделения.")
        return

    # 🆕 Создаем SuperAdmin автоматически
    print("\n" + "="*60)
    print("👑 Создание SuperAdmin...")
    print("="*60)

    try:
        # Хешируем пароль
        hashed_password = hash_password(superadmin_password)

        # Создаем сотрудника
        superadmin = models.Employee(
            first_name="Супер",
            last_name="Админ",
            patronymic="Администраторович",
            email=superadmin_email,
            hashed_password=hashed_password,
            is_active=True,
            role_id=superadmin_role.id,
            branch_id=first_branch.id
        )

        db.add(superadmin)
        db.commit()
        db.refresh(superadmin)

        print(f"✅ SuperAdmin успешно создан!")
        print(f"📧 Email: {superadmin_email}")
        print(f"🔑 Пароль: {superadmin_password}")
        print("⚠️  ВАЖНО: Смените пароль после первого входа!")
        print("="*60 + "\n")

    except Exception as e:
        print(f"❌ Ошибка при создании SuperAdmin: {e}")
        db.rollback()


def initialize_database(db: Session):
    """Основная функция инициализации"""
    print("\n" + "="*50)
    print("🚀 Инициализация базы данных...")
    print("="*50 + "\n")

    print("📋 Создание ролей...")
    init_roles(db)

    print("\n🏢 Создание отделений...")
    init_branches(db)

    print("\n👑 Создание SuperAdmin...")
    create_superadmin(db)

    print("="*50)
    print("✅ Инициализация завершена!")
    print("="*50 + "\n")
