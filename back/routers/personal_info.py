from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import database, models
from schemas.personal_info import PersonalInfoCreateSchema
from routers.auth import get_current_user

router = APIRouter(
    prefix='/personal_info',
    tags=['Персональная информация']
)


@router.post('/fill', summary='Добавить или обновить персональную информацию')
def fill_personal_info(
    data: PersonalInfoCreateSchema,
    current_user: models.Client = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    pers_info = db.query(models.PersonalInfo).filter(
        models.PersonalInfo.client_id == current_user.id
    ).first()

    if pers_info:
        pers_info.passport_number = data.passport_number
        pers_info.address = data.address
        pers_info.birth_date = data.birth_date
        pers_info.employment_status = data.employment_status
    else:
        pers_info = models.PersonalInfo(
            passport_number=data.passport_number,
            address=data.address,
            birth_date=data.birth_date,
            employment_status=data.employment_status,
            client_id=current_user.id
        )
        db.add(pers_info)

    db.commit()
    db.refresh(pers_info)

    return {
        "message": "Персональная информация успешно сохранена",
        "personal_info": {
            "passport_number": pers_info.passport_number,
            "address": pers_info.address,
            "birth_date": pers_info.birth_date,
            "employment_status": pers_info.employment_status
        }
    }
