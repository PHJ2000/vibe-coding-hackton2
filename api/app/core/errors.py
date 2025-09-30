from fastapi import Request
from fastapi.responses import JSONResponse


def http_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    trace_id = getattr(request.state, "trace_id", "trace-unknown")
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "internal_error",
                "message": "예상치 못한 오류가 발생했습니다.",
                "traceId": trace_id,
            }
        },
    )
