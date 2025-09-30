FROM python:3.12-slim

WORKDIR /app

RUN pip install --no-cache-dir poetry==1.7.1
COPY pyproject.toml poetry.lock* ./
RUN poetry install --no-dev --no-root

COPY app ./app

CMD ["poetry", "run", "celery", "-A", "app.main:celery_app", "worker", "--loglevel=info"]
