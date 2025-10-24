from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request
from fastapi.responses import JSONResponse

# ========================================
# Настройка Rate Limiter
# ========================================
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["60/minute"]
)


# ========================================
# Обработчик ошибок Rate Limit
# ========================================
async def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    """Кастомный обработчик для превышения лимита"""
    return JSONResponse(
        status_code=429,
        content={
            "detail": "Слишком много запросов. Пожалуйста, подождите и попробуйте снова.",
            "retry_after": exc.detail,
            "type": "rate_limit_exceeded"
        }
    )
