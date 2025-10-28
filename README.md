# 🏦 NextBank - Интернет-банкинг

<div align="center">

![NextBank Logo](https://img.shields.io/badge/NextBank-Online%20Banking-4F46E5?style=for-the-badge&logo=bank&logoColor=white)

**Полнофункциональная система интернет-банкинга с административной панелью**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-success?style=for-the-badge)](https://visionary-cocada-e5805c.netlify.app)
[![API Docs](https://img.shields.io/badge/📚_API-Documentation-blue?style=for-the-badge)](https://nextbank-ar13.onrender.com/docs)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://nextbank-ar13.onrender.com)

</div>

---

## 📋 О проекте

NextBank - это комплексная система интернет-банкинга, разработанная с нуля для демонстрации навыков fullstack-разработки. Проект включает клиентскую часть для управления личными финансами и административную панель для управления банковскими операциями.

**Разработка:** ~1 месяц (2-4 часа в день)  
**Назначение:** Учебный проект, портфолио, курсовая работа

---

## ✨ Ключевые возможности

### 👤 Для клиентов:
- 🔐 Регистрация и аутентификация с JWT токенами
- 💳 Управление банковскими картами (создание, активация/деактивация)
- 💰 Операции со счетами (пополнение, снятие, переводы между картами)
- 🏦 Подача заявок на кредиты с расчетом процентов
- 📊 Детальная история транзакций с фильтрацией
- 👤 Управление профилем и персональными данными

### 🛡️ Для администраторов:
- 👥 Управление сотрудниками с ролевым доступом (RBAC)
- 🏢 Управление отделениями банка
- 📝 Обработка заявок клиентов (одобрение/отклонение)
- 👨‍💼 Просмотр и управление клиентами
- 📈 Аналитика и статистика в реальном времени
- 🎯 5 ролей: SuperAdmin, Manager, Support, Cashier, Loan Officer

---

## 🖼️ Скриншоты

<details>
<summary>📸 Посмотреть интерфейс</summary>

### Страница входа
![Login Page](https://i.imgur.com/login.png)

### Дашборд клиента
![Client Dashboard](https://i.imgur.com/dashboard.png)

### Управление кредитами
![Loans Page](https://i.imgur.com/loans.png)

### Профиль пользователя
![Profile Page](https://i.imgur.com/profile.png)

### Административная панель
![Admin Panel](https://i.imgur.com/admin.png)

</details>

---

## 🛠️ Технологический стек

### Frontend
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.5-764ABC?style=flat&logo=redux&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.0-CA4245?style=flat&logo=react-router&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.7-5A29E4?style=flat&logo=axios&logoColor=white)

### Backend
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat&logo=fastapi&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-D71F00?style=flat&logo=sqlalchemy&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=flat&logo=postgresql&logoColor=white)
![Pydantic](https://img.shields.io/badge/Pydantic-2.10-E92063?style=flat&logo=pydantic&logoColor=white)

### Безопасность
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat&logo=json-web-tokens&logoColor=white)
![Bcrypt](https://img.shields.io/badge/Bcrypt-Password_Hashing-red?style=flat)
![Rate Limiting](https://img.shields.io/badge/SlowAPI-Rate_Limiting-orange?style=flat)

### Deployment
![Netlify](https://img.shields.io/badge/Netlify-Frontend-00C7B7?style=flat&logo=netlify&logoColor=white)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=flat&logo=render&logoColor=white)
![Neon](https://img.shields.io/badge/Neon-Database-00E699?style=flat&logo=postgresql&logoColor=white)

---

## 🗄️ Архитектура базы данных

**10 таблиц с полной нормализацией:**

- `roles` - Роли сотрудников
- `branches` - Отделения банка
- `employees` - Сотрудники с ролевым доступом
- `clients` - Клиенты банка
- `personal_info` - Персональные данные клиентов
- `accounts` - Банковские счета
- `cards` - Банковские карты
- `loans` - Кредиты
- `transactions` - История транзакций
- `processes` - Заявки и процессы

**Оптимизация:**
- ✅ Индексы на всех внешних ключах
- ✅ Составные индексы для частых запросов
- ✅ Connection pooling для производительности

---

## 🚀 Быстрый старт

### Предварительные требования
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+

### Локальная установка

#### Backend
```bash
cd back
pip install -r requirements.txt

# Создай .env файл
DATABASE_URL=postgresql://user:password@localhost:5432/nextbank
SECRET_KEY=your-secret-key
ENCRYPTION_KEY=your-encryption-key
SUPERADMIN_EMAIL=admin@nextbank.ru
SUPERADMIN_PASSWORD=YourStrongPassword123

# Запуск
uvicorn main:app --reload
```

#### Frontend
```bash
cd front
npm install

# Создай .env файл
VITE_API_URL=http://localhost:8000

# Запуск
npm run dev
```

Приложение будет доступно по адресу: `http://localhost:5173`

---

## 📡 API Documentation

Интерактивная документация API доступна после запуска backend:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Основные эндпоинты:

**Аутентификация:**
- `POST /auth/register` - Регистрация клиента
- `POST /auth/login` - Вход клиента
- `POST /admin/auth/login` - Вход сотрудника

**Счета и карты:**
- `GET /accounts/me` - Мои счета
- `POST /cards/` - Создать карту
- `POST /cards/transfer` - Перевод между картами

**Кредиты:**
- `POST /loans/apply` - Подать заявку на кредит
- `GET /loans/me` - Мои кредиты
- `POST /loans/{id}/pay` - Оплатить кредит

**Администрирование:**
- `GET /admin/clients/` - Список клиентов
- `GET /employees/` - Список сотрудников
- `PATCH /admin/processes/{id}/approve` - Одобрить заявку

---

## 🔒 Безопасность

- 🔐 **JWT аутентификация** с refresh tokens
- 🛡️ **Bcrypt хеширование** паролей
- 🚦 **Rate limiting** (100 req/min глобально, 5 req/min для аутентификации)
- 🔒 **CORS политика** для защиты от XSS
- 🔑 **Шифрование CVV** карт с Fernet
- ✅ **SQL injection защита** через SQLAlchemy ORM
- 👮 **RBAC** (Role-Based Access Control) для сотрудников

---

## 🎯 Технические челленджи

### Архитектура
Одной из главных сложностей было **проектирование масштабируемой архитектуры** с учетом:
- Разделения бизнес-логики и слоя данных
- Ролевой модели доступа с несколькими уровнями прав
- Связей между 10 таблицами БД без циклических зависимостей

### Производительность
- Оптимизация запросов к БД через индексирование
- Connection pooling для предотвращения утечек соединений
- Кеширование данных на frontend с Redux

### Deployment
- Настройка serverless БД (Neon) с session pooler
- Решение проблем с CORS и Rate Limiting в production
- Настройка SPA routing на Netlify

---

## 📊 Статистика проекта

```
📁 Структура:
├── Backend (FastAPI)
│   ├── 10 моделей БД
│   ├── 30+ API эндпоинтов
│   ├── 12 роутеров
│   └── Полная валидация через Pydantic
│
├── Frontend (React)
│   ├── 25+ компонентов
│   ├── Redux state management
│   ├── Protected routes
│   └── Адаптивный дизайн
│
└── Database (PostgreSQL)
    ├── 10 таблиц
    ├── 15+ индексов
    └── Внешние ключи и ограничения
```

---

## 🌐 Live Demo

**Frontend:** https://visionary-cocada-e5805c.netlify.app  
**Backend API:** https://nextbank-ar13.onrender.com  
**API Docs:** https://nextbank-ar13.onrender.com/docs

### Тестовые аккаунты:

**SuperAdmin:**
- Email: `superadmin@nextbank.ru`
- Password: `SuperAdmin123!`

**Клиент:** Зарегистрируйтесь сами! 😊

---

## 📝 Структура проекта

```
NextBank/
├── back/                      # Backend (FastAPI)
│   ├── db/
│   │   ├── database.py       # Подключение к БД
│   │   ├── models.py         # SQLAlchemy модели
│   │   └── init_data.py      # Начальные данные
│   ├── routers/              # API endpoints
│   ├── schemas/              # Pydantic схемы
│   ├── utils/                # Вспомогательные функции
│   ├── main.py               # Точка входа
│   └── requirements.txt
│
├── front/                     # Frontend (React)
│   ├── src/
│   │   ├── api/              # API интеграция
│   │   ├── app/              # Redux store
│   │   ├── components/       # React компоненты
│   │   ├── features/         # Redux slices
│   │   ├── pages/            # Страницы приложения
│   │   └── App.jsx
│   ├── public/
│   │   └── _redirects        # Netlify SPA config
│   └── package.json
│
└── README.md
```

---

## 🤝 Контакты

**Автор:** Владислав Александрович  
**Email:** vlaoserov727@mail.ru  
**Telegram:** [@swslt1616](https://t.me/swslt1616)  
**GitHub:** [github.com/peklos](https://github.com/peklos)

---

## 📄 Лицензия

Этот проект создан в учебных целях и для портфолио.

---

<div align="center">

### ⭐ Если проект понравился - поставьте звезду!

**Made with ❤️ and lots of ☕**

![Views](https://komarev.com/ghpvc/?username=nextbank&label=Project%20Views&color=blueviolet&style=flat)

</div>
