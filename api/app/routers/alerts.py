from fastapi import APIRouter, HTTPException

from app.schemas.base import SafetyAlertResponse
from app.services.beaches import get_alerts, get_beach

router = APIRouter(prefix="/beaches/{beach_id}/alerts", tags=["Alerts"])


@router.get("", response_model=SafetyAlertResponse)
def list_alerts(beach_id: str) -> SafetyAlertResponse:
    if not get_beach(beach_id):
        raise HTTPException(status_code=404, detail="Beach not found")
    alerts, metadata = get_alerts(beach_id)
    return SafetyAlertResponse(data=alerts, meta=metadata)
