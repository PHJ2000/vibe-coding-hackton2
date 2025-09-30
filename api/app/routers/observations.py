from fastapi import APIRouter, HTTPException

from app.schemas.base import ObservationPayload, ObservationResponse
from app.services.beaches import get_beach, get_observation

router = APIRouter(prefix="/beaches/{beach_id}/observations", tags=["Observations"])


@router.get("", response_model=ObservationResponse)
def get_latest_observation(beach_id: str) -> ObservationResponse:
    if not get_beach(beach_id):
        raise HTTPException(status_code=404, detail="Beach not found")
    record, metadata = get_observation(beach_id)
    payload = ObservationPayload(**record)
    return ObservationResponse(data=payload, meta=metadata)
