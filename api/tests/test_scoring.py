from app.services.scoring import SafetyContext, compute_recommendation_score, compute_safety_score


def test_compute_safety_score_penalizes_wave_height():
    score, _ = compute_safety_score(
        SafetyContext(
            wave_height=2.0,
            sea_surface_temp=24.0,
            wind_speed=4.0,
            alerts=[],
            user_wave_max=1.0,
        )
    )
    assert score < 100


def test_compute_recommendation_score_boosts_events():
    score_without_event = compute_recommendation_score(80, travel_distance_km=50, has_events=False)
    score_with_event = compute_recommendation_score(80, travel_distance_km=50, has_events=True)
    assert score_with_event > score_without_event
