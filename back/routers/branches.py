from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from db import models
from schemas.branch import BranchCreate, BranchResponse, BranchUpdate
from routers.employee_auth import get_current_employee, check_permission

router = APIRouter(
    prefix="/branches",
    tags=["Отделения"]
)


@router.get("/", response_model=list[BranchResponse], summary="Получить все отделения")
def get_all_branches(
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Получить список всех отделений"""
    check_permission(current_employee, ["Admin", "Manager"])

    branches = db.query(models.Branch).all()
    return branches


@router.get("/{branch_id}", response_model=BranchResponse, summary="Получить отделение по ID")
def get_branch_by_id(
    branch_id: int,
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Получить информацию о конкретном отделении"""
    check_permission(current_employee, ["Admin", "Manager"])

    branch = db.query(models.Branch).filter(
        models.Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Отделение не найдено")

    return branch


@router.post("/", response_model=BranchResponse, summary="Создать новое отделение")
def create_branch(
    branch_data: BranchCreate,
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Создать новое отделение (только Admin)"""
    check_permission(current_employee, ["Admin"])

    # Проверка на существование отделения с таким названием
    existing_branch = db.query(models.Branch).filter(
        models.Branch.name == branch_data.name
    ).first()

    if existing_branch:
        raise HTTPException(
            status_code=400,
            detail="Отделение с таким названием уже существует"
        )

    new_branch = models.Branch(
        name=branch_data.name,
        address=branch_data.address,
        phone=branch_data.phone
    )
    db.add(new_branch)
    db.commit()
    db.refresh(new_branch)

    return new_branch


@router.patch("/{branch_id}", response_model=BranchResponse, summary="Обновить отделение")
def update_branch(
    branch_id: int,
    branch_data: BranchUpdate,
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Обновить информацию об отделении"""
    check_permission(current_employee, ["Admin"])

    branch = db.query(models.Branch).filter(
        models.Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Отделение не найдено")

    if branch_data.name:
        # Проверка уникальности нового имени
        existing = db.query(models.Branch).filter(
            models.Branch.name == branch_data.name,
            models.Branch.id != branch_id
        ).first()
        if existing:
            raise HTTPException(
                status_code=400,
                detail="Отделение с таким названием уже существует"
            )
        branch.name = branch_data.name

    if branch_data.address:
        branch.address = branch_data.address

    if branch_data.phone:
        branch.phone = branch_data.phone

    db.commit()
    db.refresh(branch)
    return branch


@router.delete("/{branch_id}", summary="Удалить отделение")
def delete_branch(
    branch_id: int,
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Удалить отделение (только Admin)"""
    check_permission(current_employee, ["Admin"])

    branch = db.query(models.Branch).filter(
        models.Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Отделение не найдено")

    # Проверка, есть ли сотрудники в этом отделении
    employees_count = db.query(models.Employee).filter(
        models.Employee.branch_id == branch_id
    ).count()

    if employees_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Невозможно удалить отделение. Есть {employees_count} сотрудник(ов) в этом отделении"
        )

    db.delete(branch)
    db.commit()

    return {"message": "Отделение успешно удалено", "deleted_branch_id": branch_id}


@router.get("/stats/overview", summary="Статистика по отделениям")
def get_branches_stats(
    db: Session = Depends(get_db),
    current_employee: models.Employee = Depends(get_current_employee)
):
    """Получить общую статистику по отделениям"""
    check_permission(current_employee, ["Admin", "Manager"])

    total_branches = db.query(models.Branch).count()

    # Статистика по сотрудникам в каждом отделении
    branches_stats = db.query(
        models.Branch.name,
        models.func.count(models.Employee.id)
    ).outerjoin(models.Employee).group_by(models.Branch.name).all()

    return {
        "total_branches": total_branches,
        "employees_by_branch": {branch: count for branch, count in branches_stats}
    }
