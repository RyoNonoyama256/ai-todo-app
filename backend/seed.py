"""
シードスクリプト: テスト・開発用の初期データを投入する

使い方:
  Docker 経由: docker compose exec backend python seed.py
  ローカル直接: cd backend && python seed.py
"""

from dotenv import load_dotenv

load_dotenv(".env")
load_dotenv(f".env.{__import__('os').getenv('APP_ENV', 'dev')}", override=True)

from app.database import SessionLocal, engine, Base
from app.models import Todo

SEED_DATA = [
    {"text": "Figma MCP を Claude Code に設定する", "completed": True},
    {"text": "Todo コンポーネントを作成する", "completed": True},
    {"text": "デザインを刷新する", "completed": False},
    {"text": "FastAPI バックエンドを構築する", "completed": False},
    {"text": "Vercel にデプロイする", "completed": False},
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    app_env = __import__('os').getenv('APP_ENV', 'dev')
    try:
        if app_env == "prod":
            # prod は既存データを守る
            if db.query(Todo).count() > 0:
                print("prod: Already seeded, skipping.")
                return
        else:
            # dev / stg は既存レコードを削除して入れ直す
            deleted = db.query(Todo).delete()
            db.commit()
            print(f"{app_env}: Deleted {deleted} existing records.")

        for data in SEED_DATA:
            db.add(Todo(**data))
        db.commit()
        print(f"Seeded {len(SEED_DATA)} todos.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
