import os
from dotenv import load_dotenv
from fastapi import FastAPI

# APP_ENV に応じて環境固有の .env ファイルを上書きロードする
# 有効値: dev | stg | prod
# 優先順位: .env（ベース） → .env.{APP_ENV}（上書き）
app_env = os.getenv("APP_ENV", "dev")
load_dotenv(".env")
load_dotenv(f".env.{app_env}", override=True)
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import todos

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Todo API")

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(todos.router, prefix="/todos", tags=["todos"])
