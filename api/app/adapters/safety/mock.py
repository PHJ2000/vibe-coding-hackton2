from datetime import UTC, datetime, timedelta

from app.schemas.base import Metadata, SafetyAlertPayload


def _alert(**kwargs) -> SafetyAlertPayload:
    defaults = {
        "severity": "info",
        "message": "안전 안내",
        "starts_at": datetime.now(UTC) - timedelta(hours=1),
        "ends_at": datetime.now(UTC) + timedelta(hours=1),
    }
    defaults.update(kwargs)
    return SafetyAlertPayload(**defaults)


MOCK_ALERTS: dict[str, list[SafetyAlertPayload]] = {
    "haeundae": [
        _alert(
            alert_type="rip_current",
            severity="medium",
            message="이안류 주의, 안내 방송을 참고하세요.",
            starts_at=datetime.now(UTC) - timedelta(hours=1),
            ends_at=datetime.now(UTC) + timedelta(hours=2),
        ),
        _alert(
            alert_type="jellyfish",
            severity="low",
            message="작은 해파리 관측, 보호장구 착용 권장.",
            starts_at=datetime.now(UTC) - timedelta(hours=5),
            ends_at=None,
        ),
    ],
    "gwangalli": [
        _alert(
            alert_type="heat",
            severity="info",
            message="폭염주의보 발령, 그늘에서 휴식을 취하세요.",
            starts_at=datetime.now(UTC) - timedelta(hours=3),
            ends_at=datetime.now(UTC) + timedelta(hours=6),
        )
    ],
}


def get_alerts(beach_id: str) -> tuple[list[SafetyAlertPayload], Metadata]:
    alerts = MOCK_ALERTS.get(beach_id, [])
    metadata = Metadata(source="mock-safety", updatedAt=datetime.now(UTC), reliability=1)
    return alerts, metadata
