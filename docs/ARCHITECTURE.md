# BeachHub MVP Architecture

이 문서는 해수욕장 종합 정보 허브(BeachHub) MVP 구현을 위한 공통 레퍼런스입니다. 본 문서와 저장소 구조를 항상 참고하여 기능을 확장합니다.

## 1. 비전
- 기상, 안전, 행사, 커뮤니티 정보를 한 곳에서 제공하는 **원스톱 해수욕장 허브** 구축
- 실시간성, 안전 중심 UX, 액티비티 결합, 개인화 추천을 핵심 가치로 삼음

## 2. 사용자 페르소나 & 시나리오
| 페르소나 | 요구사항 | 핵심 지표 |
| --- | --- | --- |
| 가족 여행객 | 안전 정보, 혼잡도, 편의시설 | 위험도, 수온, 혼잡도 |
| 서퍼/스포츠 | 파고·풍속, 경보, 장비/동호회 | 파고, 풍속, 경보 |
| 커플/친구 | 당일 추천, 행사, 사진 스팟 | 추천 점수, 이벤트 |
| 로컬 주민 | 지역 행사, 커뮤니티 | 이벤트, 모임 |

사용자 여정은 홈 추천 → 상세 지표 → 모임/행사 참여 흐름을 따른다.

## 3. 시스템 개요
```
Client (React Web / React Native)
        ↓
FastAPI BFF (api/)
        ↓                   ↘
Service & Adapter Layer      Cache/DB (PostgreSQL + PostGIS, Redis)
        ↑
Scheduler/Worker (Celery)
```

- 외부 데이터 어댑터는 Mock 구현을 기본으로 제공하고, 환경변수로 실서비스 전환을 지원한다.
- 모든 관측/경보 데이터는 신뢰도, 갱신시각, 출처를 함께 제공한다.

## 4. 저장소 구조
```
api/      FastAPI 애플리케이션, 모델, 라우터, 서비스, 어댑터
worker/   Celery 작업자, 데이터 수집 및 스케줄러
web/      React(Vite) 프런트엔드
infra/    Docker Compose, 데이터베이스 마이그레이션 설정, 환경 예시
docs/     아키텍처 및 운영 문서
```

## 5. 핵심 도메인 모델
- **Beach**: id, 이름, 위치, 편의시설, 운영시즌, 기본 안전등급
- **Observation**: 실시간 관측치(수온, 파고, 풍속, 조석), 신뢰도, 출처, 갱신시각
- **SafetyAlert**: 경보 종류(이안류, 해파리, 적조 등), 심각도, 메시지, 시간 범위
- **Event**: 지역 행사/체험 정보, 태그, 위치, 비용, 출처
- **Group**: 같이 놀 사람 구하기/동호회 모임, 모집 조건, 상태
- **Recommendation**: 사용자 선호를 반영한 해변 추천 점수와 사유

## 6. API 계약 (요약)
- `GET /beaches`: 검색 및 근처 해변 조회
- `GET /beaches/{id}`: 상세 정보
- `GET /beaches/{id}/observations`: 최신 관측 데이터
- `GET /beaches/{id}/alerts`: 안전 경보
- `GET /events`: 행사/체험
- `GET /recommendations`: 개인화 추천
- `GET /groups`, `POST /groups`: 모임 조회/생성
- 모든 응답은 `{ data, meta }` 컨테이너 내에서 제공하고 오류는 `{ "error": { code, message, traceId } }` 포맷을 따른다.

## 7. 서비스 계층 책임
- `services/scoring.py`: 위험도 및 추천 점수 계산 로직 구현. 사용자 선호를 입력으로 받아 0~100 위험도, 0~1 추천 점수 산출.
- `services/beaches.py`: 어댑터 및 DB를 통합하여 해변 정보를 제공.
- `services/events.py`: 이벤트 검색 및 필터링.
- `services/groups.py`: 모임 생성/검증/상태 변경.

## 8. 데이터 수집 & 시드
- `worker/` 내 Celery beat 스케줄러가 외부 API에서 데이터를 수집해 DB에 저장.
- MVP 단계에서는 `scripts/seed_mock_data.py`(추가 예정)를 통해 부산·강릉·제주 등 5개 해변과 24시간치 관측 데이터를 삽입.

## 9. 품질 & 테스트
- `pytest` 기반 단위 테스트 (스코어러, 어댑터 mock, 서비스 로직)
- OpenAPI 계약 테스트를 통해 응답 스키마 검증
- `ruff`, `black` 포맷터/린터 적용

## 10. 실행 방법 요약
1. `cp infra/.env.example .env`로 환경변수 구성
2. `docker compose up --build` 실행 (infra/ 디렉터리 기준)
3. FastAPI: http://localhost:8000, Swagger: `/docs`
4. React Web: http://localhost:5173

## 11. 향후 로드맵
- 실제 공공/민간 API 연결
- 혼잡도 모델링 및 실시간 이벤트 피드
- 커뮤니티 안전 가드 강화 및 신고 자동화
- 추천 엔진 고도화 (랭킹 학습, A/B 테스트)
- 오프라인 캐싱 및 약전파 대응

> 본 문서는 지속적으로 업데이트하며 개발 전반에 참고한다.
