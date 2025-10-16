from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth as auth_router
from routers import personal_info as pers_inf_router
from routers import accounts as accounts_router
from routers import cards as cards_router
from routers import loans as loans_router
from routers import processes as processes_router
from routers import transactions as transactions_router

from db.database import engine, Base

app = FastAPI(
    title="NextBank API",
    description="API для банковского приложения NextBank",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

# Подключаем роутеры
app.include_router(auth_router.router)
app.include_router(pers_inf_router.router)
app.include_router(accounts_router.router)
app.include_router(cards_router.router)
app.include_router(loans_router.router)
app.include_router(processes_router.router)
app.include_router(transactions_router.router)


@app.get("/", tags=["Главная"])
def root():
    return {
        "message": "NextBank API работает",
        "version": "1.0.0",
        "docs": "/docs"
    }


# uvicorn main:app --host 0.0.0.0 --port 8000 --reload
# http://192.168.1.135:8000/docs
