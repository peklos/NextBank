from passlib.context import CryptContext

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

password = "nbadmin1337"
hashed = pwd_context.hash(password)

print("\n" + "="*60)
print("🔐 Хеш пароля для SuperAdmin")
print("="*60)
print(f"Пароль: {password}")
print(f"Хеш: {hashed}")
print("="*60 + "\n")

# Проверка, что хеш работает
verification = pwd_context.verify(password, hashed)
print(f"✅ Проверка хеша: {'SUCCESS' if verification else 'FAILED'}")
print("\n📋 Скопируйте этот хеш и вставьте в init_data.py в переменную password_hash\n")
