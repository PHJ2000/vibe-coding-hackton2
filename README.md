# BeachHub Monorepo

BeachHub는 해수욕장 관측/안전/행사/커뮤니티 정보를 통합 제공하기 위한 MVP 레퍼런스 구현입니다. FastAPI 기반 BFF, Celery 워커, React 웹 클라이언트로 구성되며 Docker Compose로 통합 구동됩니다.

## 구조
```
api/      FastAPI 애플리케이션 (Poetry)
worker/   Celery 스케줄러/ETL (Poetry)
web/      React + Vite 웹 클라이언트 (npm)
infra/    Docker Compose, 환경 변수 예시
docs/     설계 및 운영 문서
```

## 빠른 시작
1. `.env` 생성: `cp infra/.env.example .env`
2. Docker Compose 실행:
   ```bash
   cd infra
   docker compose up --build
   ```
3. 서비스 주소
   - API: http://localhost:8000 (Swagger: `/docs`)
   - Web: http://localhost:5173

## 로컬 개발
### API (FastAPI)
```bash
cd api
poetry install
poetry run uvicorn app.main:app --reload
```

### Web (React)
```bash
cd web
npm install
npm run dev
```

## 테스트
```bash
cd api
poetry run pytest
```

## OpenAPI
FastAPI 앱이 기동되면 `/openapi.json`에서 스키마를 내려받을 수 있습니다. 향후 계약 테스트는 `api/tests`에 추가합니다.

## 참고 문서
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): 전체 설계 문서
