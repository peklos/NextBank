from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float, func
from sqlalchemy.orm import relationship
from .database import Base
import random


# === РОЛИ (например, админ, менеджер, кассир) ===
class Role(Base):
    __tablename__ = 'roles'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)

    employees = relationship('Employee', back_populates='role')


# === ОТДЕЛЕНИЯ БАНКА ===
class Branch(Base):
    __tablename__ = 'branches'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
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
    patronymic = Column(String(50))  # Optional
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    role_id = Column(Integer, ForeignKey('roles.id'))
    branch_id = Column(Integer, ForeignKey('branches.id'))

    role = relationship('Role', back_populates='employees')
    branch = relationship('Branch', back_populates='employees')
    processes = relationship('Process', back_populates='employee')


# === КЛИЕНТЫ ===
class Client(Base):
    __tablename__ = 'clients'

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    patronymic = Column(String(50))  # Optional
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    phone = Column(String(20))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    personal_info = relationship(
        'PersonalInfo', back_populates='client', uselist=False)
    accounts = relationship('Account', back_populates='client')
    cards = relationship('Card', back_populates='client')
    loans = relationship('Loan', back_populates='client')
    processes = relationship('Process', back_populates='client')


# === ПЕРСОНАЛЬНАЯ ИНФОРМАЦИЯ (1 к 1 с клиентом) ===
class PersonalInfo(Base):
    __tablename__ = 'personal_info'

    id = Column(Integer, primary_key=True, index=True)
    passport_number = Column(String(20), unique=True, nullable=False)
    address = Column(String(255))
    birth_date = Column(DateTime)
    employment_status = Column(String(100))

    client_id = Column(Integer, ForeignKey('clients.id'))
    client = relationship('Client', back_populates='personal_info')


def generate_account_number():
    return ''.join(str(random.randint(0, 9)) for _ in range(20))

# === СЧЕТА ===


class Account(Base):
    __tablename__ = 'accounts'

    id = Column(Integer, primary_key=True, index=True)
    account_number = Column(String(30), unique=True,
                            nullable=False, default=generate_account_number)
    balance = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    client_id = Column(Integer, ForeignKey('clients.id'))
    client = relationship('Client', back_populates='accounts')
    cards = relationship(
        'Card',
        back_populates='account',
        cascade='all, delete-orphan'
    )


# === КАРТОЧКИ ===
class Card(Base):
    __tablename__ = 'cards'

    id = Column(Integer, primary_key=True, index=True)
    card_number = Column(String(16), unique=True, nullable=False)
    card_type = Column(String(20))  # debit / credit
    expiration_date = Column(DateTime)
    cvv = Column(String(4))
    is_active = Column(Boolean, default=True)

    client_id = Column(Integer, ForeignKey('clients.id'))
    account_id = Column(Integer, ForeignKey('accounts.id'))

    client = relationship('Client', back_populates='cards')
    account = relationship('Account', back_populates='cards')


# === КРЕДИТЫ ===
class Loan(Base):
    __tablename__ = 'loans'

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    interest_rate = Column(Float, nullable=False)
    term_months = Column(Integer)
    issued_at = Column(DateTime(timezone=True), server_default=func.now())
    is_paid = Column(Boolean, default=False)

    client_id = Column(Integer, ForeignKey('clients.id'))
    client = relationship('Client', back_populates='loans')


# === ПРОЦЕССЫ ОФОРМЛЕНИЯ (кредитов, карт и т.д.) ===
class Process(Base):
    __tablename__ = 'processes'

    id = Column(Integer, primary_key=True, index=True)
    # "loan_application", "card_issue", "account_opening"
    process_type = Column(String(50))
    status = Column(String(30), default="in_progress")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    client_id = Column(Integer, ForeignKey('clients.id'))
    employee_id = Column(Integer, ForeignKey('employees.id'))
    branch_id = Column(Integer, ForeignKey('branches.id'))

    client = relationship('Client', back_populates='processes')
    employee = relationship('Employee', back_populates='processes')
    branch = relationship('Branch', back_populates='processes')
