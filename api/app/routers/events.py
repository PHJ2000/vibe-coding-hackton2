from fastapi import APIRouter, Query

from app.adapters.events import mock as events_adapter
from app.schemas.base import EventPayload, PaginatedResponse

router = APIRouter(prefix="/events", tags=["Events"])


@router.get("", response_model=PaginatedResponse)
def list_events(region: str | None = Query(default=None)) -> PaginatedResponse:
    events = [EventPayload(**event) for event in events_adapter.search_events(region=region)]
    return PaginatedResponse(data=events, meta={"count": len(events)})
