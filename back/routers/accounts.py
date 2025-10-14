# routers/accounts.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from db import models, database
from schemas.account import AccountResponse
from routers.auth import get_current_user  # твой авторизационный dependency

router = APIRouter(
    prefix="/accounts",
    tags=["Счета(аккаунты)"]
)


# ==============================
# 🆕 Создать счет для текущего пользователя
# ==============================
@router.post("/", response_model=AccountResponse, summary='Создать счет')
def create_account(
    db: Session = Depends(database.get_db),
    current_user=Depends(get_current_user)  # берем авторизованного клиента
):
    # Создаём новый счёт
    new_account = models.Account(
        client_id=current_user.id
    )
    db.add(new_account)
    db.commit()
    db.refresh(new_account)
    return new_account


# ==============================
# 📜 Получить все счета текущего пользователя
# ==============================
@router.get("/me", response_model=list[AccountResponse], summary="Получить все счета текущего пользователя")
def get_my_accounts(
    db: Session = Depends(database.get_db),
    current_user=Depends(get_current_user)
):
    accounts = db.query(models.Account).filter(
        models.Account.client_id == current_user.id
    ).all()
    return accounts


# ==============================
# 🗑️ Удалить счет (только свой)
# ==============================
@router.delete("/{account_id}", summary="Удалить свой счет")
def delete_account(
    account_id: int,
    db: Session = Depends(database.get_db),
    current_user=Depends(get_current_user)
):
    account = db.query(models.Account).filter(
        models.Account.id == account_id,
        models.Account.client_id == current_user.id
    ).first()
    if not account:
        raise HTTPException(
            status_code=404, detail="Счёт не найден или не принадлежит вам"
        )

    db.delete(account)
    db.commit()
    return {"message": "Счёт и все его карты успешно удалены"}
