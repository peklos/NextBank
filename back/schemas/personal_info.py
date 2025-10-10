from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PersonalInfoSchema(BaseModel):
    passport_number: str
    address: Optional[str]
    birth_date: Optional[datetime]
    employment_status: Optional[str]

    class Config:
        from_attributes = True


class ClientResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    patronymic: Optional[str]
    email: str
    phone: Optional[str]
    created_at: datetime
    personal_info: Optional[PersonalInfoSchema]

    class Config:
        from_attributes = True


class PersonalInfoCreateSchema(BaseModel):
    passport_number: str
    address: Optional[str] = None
    birth_date: Optional[datetime] = None
    employment_status: Optional[str] = None
