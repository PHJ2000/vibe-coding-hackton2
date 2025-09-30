from collections.abc import Callable

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings


async def request_logging_middleware(request: Request, call_next: Callable):
    response = await call_next(request)
    response.headers["X-Trace-Id"] = request.headers.get("X-Trace-Id", request.state.trace_id)
    return response


def setup_middlewares(app: FastAPI) -> None:
    settings = get_settings()

    @app.middleware("http")
    async def assign_trace_id(request: Request, call_next: Callable):  # type: ignore[override]
        request.state.trace_id = request.headers.get("X-Trace-Id", request.state.__dict__.get("trace_id", request.headers.get("X-Request-ID", "trace-unknown")))
        return await call_next(request)

    app.middleware("http")(request_logging_middleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
