#!/usr/bin/env python3
"""Todo MCP Server — FastAPI バックエンドをラップして MCP ツールとして公開する."""

import os
import httpx
from mcp.server.fastmcp import FastMCP

API_URL = os.getenv("API_URL", "http://localhost:8000")

mcp = FastMCP("todo-server")


@mcp.tool()
async def list_todos() -> str:
    """全てのTodoを取得します。"""
    async with httpx.AsyncClient(follow_redirects=True) as client:
        res = await client.get(f"{API_URL}/todos/")
        return res.text


@mcp.tool()
async def create_todo(text: str) -> str:
    """新しいTodoを作成します。

    Args:
        text: Todoのテキスト内容
    """
    async with httpx.AsyncClient(follow_redirects=True) as client:
        res = await client.post(f"{API_URL}/todos/", json={"text": text})
        return res.text


@mcp.tool()
async def update_todo(id: int, text: str | None = None, completed: bool | None = None) -> str:
    """Todoを更新します（テキストや完了状態の変更）。

    Args:
        id: 更新するTodoのID
        text: 新しいテキスト（省略可）
        completed: 完了状態（省略可）
    """
    body: dict = {}
    if text is not None:
        body["text"] = text
    if completed is not None:
        body["completed"] = completed
    async with httpx.AsyncClient(follow_redirects=True) as client:
        res = await client.patch(f"{API_URL}/todos/{id}/", json=body)
        return res.text


@mcp.tool()
async def delete_todo(id: int) -> str:
    """指定したTodoを削除します。

    Args:
        id: 削除するTodoのID
    """
    async with httpx.AsyncClient(follow_redirects=True) as client:
        await client.delete(f"{API_URL}/todos/{id}/")
        return f"Todo {id} を削除しました"


if __name__ == "__main__":
    mcp.run()
