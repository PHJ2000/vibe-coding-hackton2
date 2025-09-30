from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse

from app.core.config import get_settings
from app.core.errors import http_exception_handler
from app.middlewares import setup_middlewares
from app.routers import alerts, beaches, events, groups, observations, recommendations

settings = get_settings()
app = FastAPI(title=settings.app_name)

setup_middlewares(app)
app.add_exception_handler(Exception, http_exception_handler)

app.include_router(beaches.router)
app.include_router(observations.router)
app.include_router(alerts.router)
app.include_router(events.router)
app.include_router(recommendations.router)
app.include_router(groups.router)


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.exception_handler(HTTPException)
async def http_exception_handler_override(request: Request, exc: HTTPException) -> JSONResponse:
    trace_id = getattr(request.state, "trace_id", "trace-unknown")
    detail = exc.detail if isinstance(exc.detail, str) else "http_error"
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": detail,
                "message": detail,
                "traceId": trace_id,
            }
        },
    )
