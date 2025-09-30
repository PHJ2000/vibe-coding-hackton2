from celery import Celery

celery_app = Celery(
    "beachhub",
    broker="redis://redis:6379/0",
    backend="redis://redis:6379/0",
)


@celery_app.task
def sync_observations() -> str:
    return "mock-sync-complete"
