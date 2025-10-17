from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from db.database import get_db
from db import models
from schemas.employee import EmployeeResponse, EmployeeUpdateSchema
from routers.employee_auth import get_current_employee, check_permission, hash_password

router = APIRouter(
    prefix="/employees",
    tags=["Сотрудники"]
)


@router.get("/", response_model=list[EmployeeResponse], summary="Получить всех сотрудников")
def get_all_employees(
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Получить список всех сотрудников"""
    check_permission(current_employee, ["Admin", "Manager"])
    
    employees = (
        db.query(models.Employee)
        .options(
            joinedload(models.Employee.role),
            joinedload(models.Employee.branch)
        )
        .all()
    )
    return employees


@router.get("/{employee_id}", response_model=EmployeeResponse, summary="Получить сотрудника по ID")
def get_employee_by_id(
    employee_id: int,
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Получить информацию о конкретном сотруднике"""
    check_permission(current_employee, ["Admin", "Manager"])
    
    employee = (
        db.query(models.Employee)
        .options(
            joinedload(models.Employee.role),
            joinedload(models.Employee.branch)
        )
        .filter(models.Employee.id == employee_id)
        .first()
    )
    
    if not employee:
        raise HTTPException(status_code=404, detail="Сотрудник не найден")
    
    return employee


@router.patch("/{employee_id}", response_model=EmployeeResponse, summary="Обновить сотрудника")
def update_employee(
    employee_id: int,
    employee_data: EmployeeUpdateSchema,
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Обновить информацию о сотруднике"""
    check_permission(current_employee, ["Admin"])
    
    employee = db.query(models.Employee).filter(
        models.Employee.id == employee_id
    ).first()
    
    if not employee:
        raise HTTPException(status_code=404, detail="Сотрудник не найден")
    
    # Обновление полей
    if employee_data.first_name is not None:
        employee.first_name = employee_data.first_name
    if employee_data.last_name is not None:
        employee.last_name = employee_data.last_name
    if employee_data.patronymic is not None:
        employee.patronymic = employee_data.patronymic
    if employee_data.email is not None:
        # Проверка уникальности email
        existing = db.query(models.Employee).filter(
            models.Employee.email == employee_data.email,
            models.Employee.id != employee_id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email уже используется")
        employee.email = employee_data.email
    
    if employee_data.role_id is not None:
        role = db.query(models.Role).filter(models.Role.id == employee_data.role_id).first()
        if not role:
            raise HTTPException(status_code=404, detail="Роль не найдена")
        employee.role_id = employee_data.role_id
    
    if employee_data.branch_id is not None:
        branch = db.query(models.Branch).filter(models.Branch.id == employee_data.branch_id).first()
        if not branch:
            raise HTTPException(status_code=404, detail="Отделение не найдено")
        employee.branch_id = employee_data.branch_id
    
    if employee_data.is_active is not None:
        employee.is_active = employee_data.is_active
    
    db.commit()
    db.refresh(employee)
    
    # Загружаем связи
    employee = (
        db.query(models.Employee)
        .options(
            joinedload(models.Employee.role),
            joinedload(models.Employee.branch)
        )
        .filter(models.Employee.id == employee_id)
        .first()
    )
    
    return employee


@router.delete("/{employee_id}", summary="Удалить сотрудника")
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Удалить сотрудника (только Admin)"""
    check_permission(current_employee, ["Admin"])
    
    if employee_id == current_employee.id:
        raise HTTPException(
            status_code=400, 
            detail="Нельзя удалить собственный аккаунт"
        )
    
    employee = db.query(models.Employee).filter(
        models.Employee.id == employee_id
    ).first()
    
    if not employee:
        raise HTTPException(status_code=404, detail="Сотрудник не найден")
    
    db.delete(employee)
    db.commit()
    
    return {"message": "Сотрудник успешно удалён", "deleted_employee_id": employee_id}


@router.patch("/{employee_id}/toggle-active", summary="Активировать/деактивировать сотрудника")
def toggle_employee_active(
    employee_id: int,
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Изменить статус активности сотрудника"""
    check_permission(current_employee, ["Admin"])
    
    if employee_id == current_employee.id:
        raise HTTPException(
            status_code=400,
            detail="Нельзя изменить статус собственного аккаунта"
        )
    
    employee = db.query(models.Employee).filter(
        models.Employee.id == employee_id
    ).first()
    
    if not employee:
        raise HTTPException(status_code=404, detail="Сотрудник не найден")
    
    employee.is_active = not employee.is_active
    db.commit()
    
    status = "активирован" if employee.is_active else "деактивирован"
    return {
        "message": f"Сотрудник успешно {status}",
        "employee_id": employee_id,
        "is_active": employee.is_active
    }


@router.get("/stats/overview", summary="Статистика по сотрудникам")
def get_employees_stats(
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Получить общую статистику по сотрудникам"""
    check_permission(current_employee, ["Admin", "Manager"])
    
    total_employees = db.query(models.Employee).count()
    active_employees = db.query(models.Employee).filter(
        models.Employee.is_active == True
    ).count()
    
    # Статистика по ролям
    roles_stats = db.query(
        models.Role.name,
        models.func.count(models.Employee.id)
    ).join(models.Employee).group_by(models.Role.name).all()
    
    # Статистика по отделениям
    branches_stats = db.query(
        models.Branch.name,
        models.func.count(models.Employee.id)
    ).join(models.Employee).group_by(models.Branch.name).all()
    
    return {
        "total_employees": total_employees,
        "active_employees": active_employees,
        "inactive_employees": total_employees - active_employees,
        "by_role": {role: count for role, count in roles_stats},
        "by_branch": {branch: count for branch, count in branches_stats}
    }