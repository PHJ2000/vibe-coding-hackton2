from fastapi import APIRouter, HTTPException

from app.schemas.base import BeachDetail, PaginatedResponse
from app.services.beaches import get_beach, list_beaches

router = APIRouter(prefix="/beaches", tags=["Beaches"])


@router.get("", response_model=PaginatedResponse)
def list_beaches_endpoint() -> PaginatedResponse:
    beaches = list_beaches()
    return PaginatedResponse(data=beaches, meta={"count": len(beaches)})


@router.get("/{beach_id}", response_model=BeachDetail)
def get_beach_endpoint(beach_id: str) -> BeachDetail:
    beach = get_beach(beach_id)
    if not beach:
        raise HTTPException(status_code=404, detail="Beach not found")
    return beach
