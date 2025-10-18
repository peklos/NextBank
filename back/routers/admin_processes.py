from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from db.database import get_db
from db import models
from schemas.process import ProcessResponse
from routers.employee_auth import get_current_employee, check_permission

router = APIRouter(
    prefix="/admin/processes",
    tags=["Управление процессами (Admin)"]
)


@router.get("/", response_model=list[ProcessResponse], summary="Получить все процессы")
def get_all_processes(
    status: str = None,
    process_type: str = None,
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Получить список всех процессов с фильтрацией"""
    # 🆕 Теперь доступ есть у SuperAdmin и Manager
    check_permission(current_employee, ["SuperAdmin", "Manager"])

    query = db.query(models.Process)

    if status:
        query = query.filter(models.Process.status == status)
    if process_type:
        query = query.filter(models.Process.process_type == process_type)

    processes = query.order_by(models.Process.created_at.desc()).all()
    return processes


@router.get("/pending", response_model=list[ProcessResponse], summary="Получить ожидающие процессы")
def get_pending_processes(
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Получить все процессы ожидающие обработки"""
    check_permission(current_employee, ["SuperAdmin", "Manager", "Support"])

    processes = db.query(models.Process).filter(
        models.Process.status == "in_progress"
    ).order_by(models.Process.created_at.asc()).all()

    return processes


@router.get("/{process_id}", response_model=ProcessResponse, summary="Получить процесс по ID")
def get_process_by_id(
    process_id: int,
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Получить детали конкретного процесса"""
    check_permission(current_employee, ["SuperAdmin", "Manager", "Support"])

    process = db.query(models.Process).filter(
        models.Process.id == process_id
    ).first()

    if not process:
        raise HTTPException(status_code=404, detail="Процесс не найден")

    return process


@router.patch("/{process_id}/approve", response_model=ProcessResponse, summary="Одобрить процесс")
def approve_process(
    process_id: int,
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Одобрить процесс (изменить статус на approved)"""
    check_permission(current_employee, ["SuperAdmin", "Manager"])

    process = db.query(models.Process).filter(
        models.Process.id == process_id
    ).first()

    if not process:
        raise HTTPException(status_code=404, detail="Процесс не найден")

    if process.status != "in_progress":
        raise HTTPException(
            status_code=400,
            detail=f"Процесс уже обработан. Текущий статус: {process.status}"
        )

    process.status = "approved"
    process.employee_id = current_employee.id
    process.branch_id = current_employee.branch_id

    db.commit()
    db.refresh(process)

    return process


@router.patch("/{process_id}/reject", response_model=ProcessResponse, summary="Отклонить процесс")
def reject_process(
    process_id: int,
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Отклонить процесс (изменить статус на rejected)"""
    check_permission(current_employee, ["SuperAdmin", "Manager"])

    process = db.query(models.Process).filter(
        models.Process.id == process_id
    ).first()

    if not process:
        raise HTTPException(status_code=404, detail="Процесс не найден")

    if process.status != "in_progress":
        raise HTTPException(
            status_code=400,
            detail=f"Процесс уже обработан. Текущий статус: {process.status}"
        )

    process.status = "rejected"
    process.employee_id = current_employee.id
    process.branch_id = current_employee.branch_id

    db.commit()
    db.refresh(process)

    return process


@router.patch("/{process_id}/complete", response_model=ProcessResponse, summary="Завершить процесс")
def complete_process(
    process_id: int,
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Завершить процесс (изменить статус на completed)"""
    check_permission(current_employee, ["SuperAdmin", "Manager"])

    process = db.query(models.Process).filter(
        models.Process.id == process_id
    ).first()

    if not process:
        raise HTTPException(status_code=404, detail="Процесс не найден")

    if process.status not in ["in_progress", "approved"]:
        raise HTTPException(
            status_code=400,
            detail=f"Нельзя завершить процесс со статусом: {process.status}"
        )

    process.status = "completed"
    if not process.employee_id:
        process.employee_id = current_employee.id
        process.branch_id = current_employee.branch_id

    db.commit()
    db.refresh(process)

    return process


@router.get("/stats/overview", summary="Статистика по процессам")
def get_processes_stats(
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Получить статистику по процессам"""
    check_permission(current_employee, ["SuperAdmin", "Manager"])

    total_processes = db.query(models.Process).count()

    # Статистика по статусам
    status_stats = db.query(
        models.Process.status,
        models.func.count(models.Process.id)
    ).group_by(models.Process.status).all()

    # Статистика по типам
    type_stats = db.query(
        models.Process.process_type,
        models.func.count(models.Process.id)
    ).group_by(models.Process.process_type).all()

    pending_count = db.query(models.Process).filter(
        models.Process.status == "in_progress"
    ).count()

    return {
        "total_processes": total_processes,
        "pending_processes": pending_count,
        "by_status": {status: count for status, count in status_stats},
        "by_type": {ptype: count for ptype, count in type_stats}
    }
