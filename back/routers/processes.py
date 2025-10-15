from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from db import models
from schemas.process import (
    ProcessCreateSchema,
    ProcessResponse,
    ProcessUpdateStatusSchema
)
from routers.auth import get_current_user

router = APIRouter(
    prefix="/processes",
    tags=["Процессы оформления"]
)


# ==============================
# 🆕 Создать процесс
# ==============================
@router.post("/", response_model=ProcessResponse, summary="Создать новый процесс")
def create_process(
    process_data: ProcessCreateSchema,
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
    """
    Создание нового процесса оформления.
    Доступные типы: loan_application, card_issue, account_opening
    """
    allowed_types = ["loan_application", "card_issue", "account_opening"]

    if process_data.process_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Неверный тип процесса. Доступны: {', '.join(allowed_types)}"
        )

    # Проверяем отделение, если указано
    if process_data.branch_id:
        branch = db.query(models.Branch).filter(
            models.Branch.id == process_data.branch_id
        ).first()
        if not branch:
            raise HTTPException(status_code=404, detail="Отделение не найдено")

    new_process = models.Process(
        process_type=process_data.process_type,
        status="in_progress",
        client_id=current_client.id,
        employee_id=None,
        branch_id=process_data.branch_id
    )

    db.add(new_process)
    db.commit()
    db.refresh(new_process)

    return new_process


# ==============================
# 📜 Получить все процессы клиента
# ==============================
@router.get("/me", response_model=list[ProcessResponse], summary="Получить все мои процессы")
def get_my_processes(
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
    """
    Возвращает список всех процессов оформления текущего клиента.
    """
    processes = db.query(models.Process).filter(
        models.Process.client_id == current_client.id
    ).order_by(models.Process.created_at.desc()).all()

    return processes


# ==============================
# 🔍 Получить детали конкретного процесса
# ==============================
@router.get("/{process_id}", response_model=ProcessResponse, summary="Получить детали процесса")
def get_process_details(
    process_id: int,
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
    """
    Возвращает детальную информацию о конкретном процессе.
    """
    process = db.query(models.Process).filter(
        models.Process.id == process_id,
        models.Process.client_id == current_client.id
    ).first()

    if not process:
        raise HTTPException(status_code=404, detail="Процесс не найден")

    return process


# ==============================
# ✏️ Обновить статус процесса (для сотрудников)
# ==============================
@router.patch("/{process_id}/status", response_model=ProcessResponse, summary="Обновить статус процесса")
def update_process_status(
    process_id: int,
    status_data: ProcessUpdateStatusSchema,
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
    """
    Обновление статуса процесса.
    Доступные статусы: in_progress, approved, rejected, completed

    Примечание: В будущем это должно быть доступно только сотрудникам.
    Пока доступно клиенту для демонстрации.
    """
    allowed_statuses = ["in_progress", "approved", "rejected", "completed"]

    if status_data.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Неверный статус. Доступны: {', '.join(allowed_statuses)}"
        )

    process = db.query(models.Process).filter(
        models.Process.id == process_id,
        models.Process.client_id == current_client.id
    ).first()

    if not process:
        raise HTTPException(status_code=404, detail="Процесс не найден")

    process.status = status_data.status
    db.commit()
    db.refresh(process)

    return process


# ==============================
# 🗑️ Удалить процесс
# ==============================
@router.delete("/{process_id}", summary="Удалить процесс")
def delete_process(
    process_id: int,
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
    """
    Удаление процесса.
    Можно удалить только свои процессы.
    """
    process = db.query(models.Process).filter(
        models.Process.id == process_id,
        models.Process.client_id == current_client.id
    ).first()

    if not process:
        raise HTTPException(status_code=404, detail="Процесс не найден")

    db.delete(process)
    db.commit()

    return {"message": "Процесс успешно удален", "deleted_process_id": process_id}


# ==============================
# 📊 Статистика по процессам
# ==============================
@router.get("/me/stats", summary="Статистика по моим процессам")
def get_my_processes_stats(
    db: Session = Depends(get_db),
    current_client=Depends(get_current_user)
):
    """
    Возвращает статистику по процессам клиента:
    - Общее количество
    - По статусам
    - По типам
    """
    processes = db.query(models.Process).filter(
        models.Process.client_id == current_client.id
    ).all()

    # Подсчет по статусам
    status_count = {}
    type_count = {}

    for process in processes:
        status_count[process.status] = status_count.get(process.status, 0) + 1
        type_count[process.process_type] = type_count.get(
            process.process_type, 0) + 1

    return {
        "total_processes": len(processes),
        "by_status": status_count,
        "by_type": type_count
    }
