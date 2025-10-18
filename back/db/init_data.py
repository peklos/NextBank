from sqlalchemy.orm import Session
from db import models
from passlib.context import CryptContext

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
    🆕 Создание SuperAdmin через SQL

    ВАЖНО: Этот супер-администратор создается только один раз
    и только через прямой SQL запрос в базу данных
    """
    # Проверяем, есть ли уже SuperAdmin
    superadmin_role = db.query(models.Role).filter(
        models.Role.name == "SuperAdmin"
    ).first()

    if not superadmin_role:
        print("❌ Роль SuperAdmin не найдена!")
        return

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

    print("\n" + "="*60)
    print("⚠️  ВНИМАНИЕ: SuperAdmin НЕ СОЗДАН автоматически!")
    print("="*60)
    print("\n📝 Для создания SuperAdmin выполните SQL запрос в вашей БД:\n")
    print("--- НАЧАЛО SQL ---")
    print(f"""
INSERT INTO employees (
    first_name, 
    last_name, 
    patronymic, 
    email, 
    hashed_password, 
    is_active, 
    role_id, 
    branch_id
)
VALUES (
    'Супер',
    'Админ',
    'Администраторович',
    'superadmin@nextbank.ru',
    '{hash_password("SuperAdmin2024!")}',
    true,
    {superadmin_role.id},
    {first_branch.id}
);
    """.strip())
    print("--- КОНЕЦ SQL ---\n")
    print("📧 Email: superadmin@nextbank.ru")
    print("🔑 Пароль: SuperAdmin2024!")
    print("\n⚠️  После создания ОБЯЗАТЕЛЬНО смените пароль!\n")
    print("="*60 + "\n")


def initialize_database(db: Session):
    """Основная функция инициализации"""
    print("\n" + "="*50)
    print("🚀 Инициализация базы данных...")
    print("="*50 + "\n")

    print("📋 Создание ролей...")
    init_roles(db)

    print("\n🏢 Создание отделений...")
    init_branches(db)

    print("\n👑 Инструкция по созданию SuperAdmin...")
    create_superadmin(db)

    print("="*50)
    print("✅ Инициализация завершена!")
    print("="*50 + "\n")
