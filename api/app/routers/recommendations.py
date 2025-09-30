from fastapi import APIRouter

from app.schemas.base import RecommendationResponse
from app.services.beaches import get_recommendations

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.get("", response_model=RecommendationResponse)
def list_recommendations() -> RecommendationResponse:
    return get_recommendations()
