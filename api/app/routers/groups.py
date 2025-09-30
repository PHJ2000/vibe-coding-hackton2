from datetime import datetime

from fastapi import APIRouter, HTTPException, status

from app.schemas.base import GroupPayload, GroupResponse
from app.services.beaches import get_beach, get_mock_groups

router = APIRouter(prefix="/groups", tags=["Groups"])


@router.get("", response_model=GroupResponse)
def list_groups() -> GroupResponse:
    groups = [GroupPayload(**group) for group in get_mock_groups()]
    return GroupResponse(data=groups, meta={"count": len(groups)})


@router.post("", response_model=GroupPayload, status_code=status.HTTP_201_CREATED)
def create_group(payload: GroupPayload) -> GroupPayload:
    if payload.beachId and not get_beach(payload.beachId):
        raise HTTPException(status_code=404, detail="Beach not found")
    created = payload.model_copy(update={"id": int(datetime.utcnow().timestamp())})
    return created
