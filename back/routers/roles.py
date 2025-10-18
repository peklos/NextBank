from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from db import models
from schemas.role import RoleCreate, RoleResponse, RoleUpdate
from routers.employee_auth import get_current_employee, check_superadmin

router = APIRouter(
    prefix="/roles",
    tags=["Роли"]
)


@router.get("/", response_model=list[RoleResponse], summary="Получить все роли")
def get_all_roles(
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Получить список всех ролей (только для SuperAdmin)"""
    check_superadmin(current_employee)

    roles = db.query(models.Role).all()
    return roles


@router.get("/{role_id}", response_model=RoleResponse, summary="Получить роль по ID")
def get_role_by_id(
    role_id: int,
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Получить информацию о конкретной роли"""
    check_superadmin(current_employee)

    role = db.query(models.Role).filter(models.Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Роль не найдена")

    return role


@router.post("/", response_model=RoleResponse, summary="Создать новую роль")
def create_role(
    role_data: RoleCreate,
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """
    Создать новую роль (только SuperAdmin)

    ⚠️ ВАЖНО: Нельзя создать роль SuperAdmin!
    """
    check_superadmin(current_employee)

    # 🆕 Запрет на создание роли SuperAdmin
    if role_data.name == "SuperAdmin":
        raise HTTPException(
            status_code=403,
            detail="Нельзя создать роль SuperAdmin! Эта роль зарезервирована системой."
        )

    # Проверка на существование роли с таким именем
    existing_role = db.query(models.Role).filter(
        models.Role.name == role_data.name
    ).first()

    if existing_role:
        raise HTTPException(
            status_code=400, detail="Роль с таким названием уже существует")

    new_role = models.Role(name=role_data.name)
    db.add(new_role)
    db.commit()
    db.refresh(new_role)

    return new_role


@router.patch("/{role_id}", response_model=RoleResponse, summary="Обновить роль")
def update_role(
    role_id: int,
    role_data: RoleUpdate,
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """
    Обновить информацию о роли

    ⚠️ ВАЖНО: Нельзя изменить название роли SuperAdmin!
    """
    check_superadmin(current_employee)

    role = db.query(models.Role).filter(models.Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Роль не найдена")

    # 🆕 Запрет на изменение роли SuperAdmin
    if role.name == "SuperAdmin":
        raise HTTPException(
            status_code=403,
            detail="Нельзя изменить роль SuperAdmin!"
        )

    # 🆕 Запрет на изменение названия на SuperAdmin
    if role_data.name == "SuperAdmin":
        raise HTTPException(
            status_code=403,
            detail="Нельзя переименовать роль в SuperAdmin!"
        )

    if role_data.name:
        # Проверка на уникальность нового имени
        existing = db.query(models.Role).filter(
            models.Role.name == role_data.name,
            models.Role.id != role_id
        ).first()
        if existing:
            raise HTTPException(
                status_code=400, detail="Роль с таким названием уже существует")

        role.name = role_data.name

    db.commit()
    db.refresh(role)
    return role


@router.delete("/{role_id}", summary="Удалить роль")
def delete_role(
    role_id: int,
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """
    Удалить роль (только SuperAdmin)

    ⚠️ ВАЖНО: Нельзя удалить роль SuperAdmin!
    """
    check_superadmin(current_employee)

    role = db.query(models.Role).filter(models.Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Роль не найдена")

    # 🆕 Запрет на удаление роли SuperAdmin
    if role.name == "SuperAdmin":
        raise HTTPException(
            status_code=403,
            detail="Нельзя удалить роль SuperAdmin!"
        )

    # Проверка, есть ли сотрудники с этой ролью
    employees_count = db.query(models.Employee).filter(
        models.Employee.role_id == role_id
    ).count()

    if employees_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Невозможно удалить роль. Есть {employees_count} сотрудник(ов) с этой ролью"
        )

    db.delete(role)
    db.commit()

    return {"message": "Роль успешно удалена", "deleted_role_id": role_id}
