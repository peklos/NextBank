"""
Утилиты для шифрования чувствительных данных (CVV)
"""
from cryptography.fernet import Fernet
import os
from dotenv import load_dotenv

load_dotenv()

# Получаем ключ шифрования из переменных окружения
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")

if not ENCRYPTION_KEY:
    raise ValueError("ENCRYPTION_KEY не найден в .env файле!")

cipher_suite = Fernet(ENCRYPTION_KEY.encode())


def encrypt_cvv(cvv: str) -> str:
    """Шифрует CVV перед сохранением в БД"""
    return cipher_suite.encrypt(cvv.encode()).decode()


def decrypt_cvv(encrypted_cvv: str) -> str:
    """Расшифровывает CVV при чтении из БД"""
    return cipher_suite.decrypt(encrypted_cvv.encode()).decode()
