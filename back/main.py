from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 🔒 Rate Limiting 
from rate_limit import limiter, rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

# Роутеры для клиентов
from routers import auth as auth_router
from routers import personal_info as pers_inf_router
from routers import accounts as accounts_router
from routers import cards as cards_router
from routers import loans as loans_router
from routers import processes as processes_router
from routers import transactions as transactions_router
from routers import profile as profile_router

# Роутеры для администраторов
from routers import employee_auth as employee_auth_router
from routers import roles as roles_router
from routers import branches as branches_router
from routers import employees as employees_router
from routers import admin_processes as admin_processes_router
from routers import admin_clients as admin_clients_router

from db.database import engine, Base, SessionLocal
from db.init_data import initialize_database

app = FastAPI(
    title="NextBank API",
    description="API для банковского приложения NextBank с административной панелью",
    version="2.0.0"
)

# Создание таблиц
Base.metadata.create_all(bind=engine)

# Инициализация начальных данных
db = SessionLocal()
try:
    initialize_database(db)
finally:
    db.close()

# 🔒 Rate Limiter 
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        'https://test1-140f.onrender.com',
        'http://localhost:5173',
        'https://nextbank123.netlify.app',
    ],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

# === КЛИЕНТСКИЕ РОУТЕРЫ ===
app.include_router(auth_router.router)
app.include_router(pers_inf_router.router)
app.include_router(accounts_router.router)
app.include_router(cards_router.router)
app.include_router(loans_router.router)
app.include_router(processes_router.router)
app.include_router(transactions_router.router)
app.include_router(profile_router.router)

# === АДМИНИСТРАТИВНЫЕ РОУТЕРЫ ===
app.include_router(employee_auth_router.router)
app.include_router(roles_router.router)
app.include_router(branches_router.router)
app.include_router(employees_router.router)
app.include_router(admin_processes_router.router)
app.include_router(admin_clients_router.router)


@app.get("/", tags=["Главная"])
def root():
    return {
        "message": "NextBank API работает",
        "version": "2.0.0",
        "docs": "/docs",
        "client_endpoints": "/auth, /accounts, /cards, /loans, /processes, /transactions, /profile",
        "admin_endpoints": "/admin/auth, /roles, /branches, /employees, /admin/processes, /admin/clients",
        "rate_limiting": "Enabled (100 req/min global)"
    }

@app.get("/health", tags=["Health"])
@app.head("/health")
def health_check():
    return {"status": "ok"}
