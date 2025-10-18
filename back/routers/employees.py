from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from db.database import get_db
from db import models
from schemas.employee import EmployeeResponse, EmployeeUpdateSchema
from routers.employee_auth import get_current_employee, check_superadmin, hash_password

router = APIRouter(
    prefix="/employees",
    tags=["Сотрудники"]
)


@router.get("/", response_model=list[EmployeeResponse], summary="Получить всех сотрудников")
def get_all_employees(
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Получить список всех сотрудников (только SuperAdmin)"""
    check_superadmin(current_employee)

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
    """Получить информацию о конкретном сотруднике (только SuperAdmin)"""
    check_superadmin(current_employee)

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
    """
    Обновить информацию о сотруднике (только SuperAdmin)

    ⚠️ ВАЖНО: Нельзя изменить роль на SuperAdmin!
    """
    check_superadmin(current_employee)

    employee = db.query(models.Employee).filter(
        models.Employee.id == employee_id
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Сотрудник не найден")

    # 🆕 Защита от изменения роли на SuperAdmin
    if employee_data.role_id is not None:
        superadmin_role = db.query(models.Role).filter(
            models.Role.name == "SuperAdmin"
        ).first()

        if superadmin_role and employee_data.role_id == superadmin_role.id:
            # Проверяем, не является ли этот сотрудник уже SuperAdmin
            if employee.role_id != superadmin_role.id:
                raise HTTPException(
                    status_code=403,
                    detail="Нельзя назначить роль SuperAdmin! В системе может быть только один SuperAdmin."
                )

        role = db.query(models.Role).filter(
            models.Role.id == employee_data.role_id).first()
        if not role:
            raise HTTPException(status_code=404, detail="Роль не найдена")
        employee.role_id = employee_data.role_id

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
            raise HTTPException(
                status_code=400, detail="Email уже используется")
        employee.email = employee_data.email

    if employee_data.branch_id is not None:
        branch = db.query(models.Branch).filter(
            models.Branch.id == employee_data.branch_id).first()
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
    """
    Удалить сотрудника (только SuperAdmin)

    ⚠️ ВАЖНО: Нельзя удалить SuperAdmin!
    """
    check_superadmin(current_employee)

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

    # 🆕 Запрет на удаление SuperAdmin
    if employee.role.name == "SuperAdmin":
        raise HTTPException(
            status_code=403,
            detail="Нельзя удалить SuperAdmin! Это единственный администратор системы."
        )

    db.delete(employee)
    db.commit()

    return {"message": "Сотрудник успешно удалён", "deleted_employee_id": employee_id}


@router.patch("/{employee_id}/toggle-active", summary="Активировать/деактивировать сотрудника")
def toggle_employee_active(
    employee_id: int,
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """
    Изменить статус активности сотрудника (только SuperAdmin)

    ⚠️ ВАЖНО: Нельзя деактивировать SuperAdmin!
    """
    check_superadmin(current_employee)

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

    # 🆕 Запрет на деактивацию SuperAdmin
    if employee.role.name == "SuperAdmin":
        raise HTTPException(
            status_code=403,
            detail="Нельзя деактивировать SuperAdmin!"
        )

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
    """Получить общую статистику по сотрудникам (только SuperAdmin)"""
    check_superadmin(current_employee)

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
