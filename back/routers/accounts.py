# routers/accounts.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from db import models, database
from schemas.account import AccountResponse, AccountCreate

router = APIRouter(
    prefix="/accounts",
    tags=["Счета(аккаунты)"]
)


@router.post("/", response_model=AccountResponse, summary='Создать счет')
def create_account(account: AccountCreate, db: Session = Depends(database.get_db)):
    # Проверяем, что клиент существует
    client = db.query(models.Client).filter(
        models.Client.id == account.client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Клиент не найден")

    # Создаём новый счёт
    new_account = models.Account(
        client_id=account.client_id
    )
    db.add(new_account)
    db.commit()
    db.refresh(new_account)
    return new_account


@router.get("/client/{client_id}", response_model=list[AccountResponse], summary="Получить все счета клиента")
def get_client_accounts(client_id: int, db: Session = Depends(database.get_db)):
    accounts = db.query(models.Account).filter(
        models.Account.client_id == client_id).all()
    return accounts


@router.delete("/{account_id}")
def delete_account(account_id: int, db: Session = Depends(database.get_db)):
    account = db.query(models.Account).filter(
        models.Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Счёт не найден")

    db.delete(account)
    db.commit()
    return {"message": "Счёт успешно удалён"}
