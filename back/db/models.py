from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float, func, Index
from sqlalchemy.orm import relationship
from .database import Base
import random


# === РОЛИ ===
class Role(Base):
    __tablename__ = 'roles'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False, index=True)  # ✅ Индекс для поиска по имени

    employees = relationship('Employee', back_populates='role')


# === ОТДЕЛЕНИЯ БАНКА ===
class Branch(Base):
    __tablename__ = 'branches'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)  # ✅ Индекс для поиска
    address = Column(String(255), nullable=False)
    phone = Column(String(20))

    employees = relationship('Employee', back_populates='branch')
    processes = relationship('Process', back_populates='branch')


# === СОТРУДНИКИ ===
class Employee(Base):
    __tablename__ = 'employees'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    patronymic = Column(String(50))
    email = Column(String(100), unique=True, nullable=False, index=True)  # ✅ Индекс для логина
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True, index=True)  # ✅ Индекс для фильтрации
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    role_id = Column(Integer, ForeignKey('roles.id'), index=True)  # ✅ Индекс FK
    branch_id = Column(Integer, ForeignKey('branches.id'), index=True)  # ✅ Индекс FK

    role = relationship('Role', back_populates='employees')
    branch = relationship('Branch', back_populates='employees')
    processes = relationship('Process', back_populates='employee')

    # ✅ Составной индекс для частых запросов
    __table_args__ = (
        Index('ix_employee_role_active', 'role_id', 'is_active'),
        Index('ix_employee_branch_active', 'branch_id', 'is_active'),
    )


# === КЛИЕНТЫ ===
class Client(Base):
    __tablename__ = 'clients'

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False, index=True)  # ✅ Индекс для поиска
    last_name = Column(String(50), nullable=False, index=True)  # ✅ Индекс для поиска
    patronymic = Column(String(50))
    email = Column(String(100), unique=True, nullable=False, index=True)  # ✅ Индекс для логина
    hashed_password = Column(String, nullable=False)
    phone = Column(String(20), index=True)  # ✅ Индекс для поиска
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)  # ✅ Для сортировки

    personal_info = relationship('PersonalInfo', back_populates='client', uselist=False)
    accounts = relationship('Account', back_populates='client')
    cards = relationship('Card', back_populates='client')
    loans = relationship('Loan', back_populates='client')
    processes = relationship('Process', back_populates='client')
    transactions = relationship('Transaction', back_populates='client')

    # ✅ Составной индекс для полнотекстового поиска
    __table_args__ = (
        Index('ix_client_fullname', 'last_name', 'first_name'),
    )


# === ПЕРСОНАЛЬНАЯ ИНФОРМАЦИЯ ===
class PersonalInfo(Base):
    __tablename__ = 'personal_info'

    id = Column(Integer, primary_key=True, index=True)
    passport_number = Column(String(20), unique=True, nullable=False, index=True)  # ✅ Индекс для поиска
    address = Column(String(255))
    birth_date = Column(DateTime)
    employment_status = Column(String(100))

    client_id = Column(Integer, ForeignKey('clients.id'), index=True)  # ✅ Индекс FK
    client = relationship('Client', back_populates='personal_info')


def generate_account_number():
    return ''.join(str(random.randint(0, 9)) for _ in range(20))


# === СЧЕТА ===
class Account(Base):
    __tablename__ = 'accounts'

    id = Column(Integer, primary_key=True, index=True)
    account_number = Column(String(30), unique=True, nullable=False, index=True, default=generate_account_number)  # ✅ Индекс
    balance = Column(Float, default=0.0, index=True)  # ✅ Индекс для статистики
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    client_id = Column(Integer, ForeignKey('clients.id'), index=True)  # ✅ Индекс FK
    client = relationship('Client', back_populates='accounts')
    cards = relationship('Card', back_populates='account', cascade='all, delete-orphan')


# === КАРТОЧКИ ===
class Card(Base):
    __tablename__ = 'cards'

    id = Column(Integer, primary_key=True, index=True)
    card_number = Column(String(16), unique=True, nullable=False, index=True)  # ✅ Индекс для поиска по номеру
    card_type = Column(String(20), index=True)  # ✅ Индекс для фильтрации по типу
    expiration_date = Column(DateTime)
    cvv = Column(String(255))
    is_active = Column(Boolean, default=True, index=True)  # ✅ Индекс для фильтрации

    client_id = Column(Integer, ForeignKey('clients.id'), index=True)  # ✅ Индекс FK
    account_id = Column(Integer, ForeignKey('accounts.id'), index=True)  # ✅ Индекс FK

    client = relationship('Client', back_populates='cards')
    account = relationship('Account', back_populates='cards')

    # ✅ Составной индекс для частых запросов
    __table_args__ = (
        Index('ix_card_client_active', 'client_id', 'is_active'),
    )


# === КРЕДИТЫ ===
class Loan(Base):
    __tablename__ = 'loans'

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False, index=True)  # ✅ Индекс для статистики
    interest_rate = Column(Float, nullable=False)
    term_months = Column(Integer)
    issued_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)  # ✅ Для сортировки
    is_paid = Column(Boolean, default=False, index=True)  # ✅ Индекс для фильтрации
    paid_amount = Column(Float, default=0.0)

    client_id = Column(Integer, ForeignKey('clients.id'), index=True)  # ✅ Индекс FK
    client = relationship('Client', back_populates='loans')

    # ✅ Составной индекс для частых запросов
    __table_args__ = (
        Index('ix_loan_client_paid', 'client_id', 'is_paid'),
    )


# === ПРОЦЕССЫ ОФОРМЛЕНИЯ ===
class Process(Base):
    __tablename__ = 'processes'

    id = Column(Integer, primary_key=True, index=True)
    process_type = Column(String(50), index=True)  # ✅ Индекс для фильтрации
    status = Column(String(30), default="in_progress", index=True)  # ✅ Индекс для фильтрации
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)  # ✅ Для сортировки

    client_id = Column(Integer, ForeignKey('clients.id'), index=True)  # ✅ Индекс FK
    employee_id = Column(Integer, ForeignKey('employees.id'), index=True)  # ✅ Индекс FK
    branch_id = Column(Integer, ForeignKey('branches.id'), index=True)  # ✅ Индекс FK

    client = relationship('Client', back_populates='processes')
    employee = relationship('Employee', back_populates='processes')
    branch = relationship('Branch', back_populates='processes')

    # ✅ Составные индексы для частых запросов
    __table_args__ = (
        Index('ix_process_status_type', 'status', 'process_type'),
        Index('ix_process_client_status', 'client_id', 'status'),
    )


# === ТРАНЗАКЦИИ ===
class Transaction(Base):
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True, index=True)
    transaction_type = Column(String(50), nullable=False, index=True)  # ✅ Индекс для фильтрации
    amount = Column(Float, nullable=False, index=True)  # ✅ Индекс для статистики
    description = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)  # ✅ Для сортировки
    status = Column(String(30), default="completed", index=True)  # ✅ Индекс для фильтрации

    from_card_id = Column(Integer, ForeignKey('cards.id'), nullable=True, index=True)  # ✅ Индекс FK
    to_card_id = Column(Integer, ForeignKey('cards.id'), nullable=True, index=True)  # ✅ Индекс FK
    loan_id = Column(Integer, ForeignKey('loans.id'), nullable=True, index=True)  # ✅ Индекс FK
    client_id = Column(Integer, ForeignKey('clients.id'), index=True)  # ✅ Индекс FK

    client = relationship('Client', back_populates='transactions')
    from_card = relationship('Card', foreign_keys=[from_card_id], backref='transactions_sent')
    to_card = relationship('Card', foreign_keys=[to_card_id], backref='transactions_received')
    loan = relationship('Loan', backref='transactions')

    # ✅ Составные индексы для частых запросов
    __table_args__ = (
        Index('ix_transaction_client_type', 'client_id', 'transaction_type'),
        Index('ix_transaction_client_created', 'client_id', 'created_at'),
        Index('ix_transaction_status_created', 'status', 'created_at'),
    )