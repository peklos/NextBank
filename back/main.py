from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth as auth_router
from routers import personal_info as pers_inf_router
from routers import accounts as accounts_router
from routers import cards as cards_router

from db.database import engine, Base

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

app.include_router(auth_router.router)
app.include_router(pers_inf_router.router)
app.include_router(accounts_router.router)
app.include_router(cards_router.router)

# uvicorn main:app --host 0.0.0.0 --port 8000 --reload
# http://192.168.1.135:8000/docs
