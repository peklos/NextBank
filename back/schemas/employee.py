from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class EmployeeBase(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    patronymic: Optional[str] = Field(None, max_length=50)
    email: EmailStr


class EmployeeCreateSchema(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    patronymic: Optional[str] = Field(None, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role_id: int = Field(..., description="ID роли сотрудника")
    branch_id: int = Field(..., description="ID отделения")


class EmployeeLoginSchema(BaseModel):
    email: EmailStr
    password: str


class EmployeeUpdateSchema(BaseModel):
    first_name: Optional[str] = Field(None, min_length=1, max_length=50)
    last_name: Optional[str] = Field(None, min_length=1, max_length=50)
    patronymic: Optional[str] = Field(None, max_length=50)
    email: Optional[EmailStr] = None
    role_id: Optional[int] = None
    branch_id: Optional[int] = None
    is_active: Optional[bool] = None


class RoleInfo(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class BranchInfo(BaseModel):
    id: int
    name: str
    address: str

    class Config:
        from_attributes = True


class EmployeeResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    patronymic: Optional[str]
    email: EmailStr
    is_active: bool
    created_at: datetime
    role_id: int
    branch_id: int
    role: Optional[RoleInfo] = None
    branch: Optional[BranchInfo] = None

    class Config:
        from_attributes = True
