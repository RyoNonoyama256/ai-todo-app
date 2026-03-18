# AI Todo App — 仕様書

## 概要

シンプルな Todo 管理アプリ。Next.js (App Router) で実装し、Vercel にデプロイする。

---

## 画面構成

### `/` — メイン画面

唯一のページ。`app/page.tsx` が対応。

```
┌─────────────────────────────────┐
│ 3月17日 月曜日        (日付ラベル) │
│ 今日のタスク          (見出し)    │
│ 2 件残っています      (残件数)    │
│                                 │
│ [新しいタスクを追加...] [+]       │
│                                 │
│ [ ALL ][ 未完了 ][ 完了 ]        │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ○ タスク名                  │ │
│ │ ● タスク名（完了）           │ │
│ └─────────────────────────────┘ │
│                                 │
│      完了済みを削除              │
└─────────────────────────────────┘
```

---

## コンポーネント

### `TodoList` (`components/TodoList.tsx`)

メインのコンテナコンポーネント。状態管理はすべてここで行う。

**State**

| 名前 | 型 | 説明 |
|---|---|---|
| `todos` | `Todo[]` | Todo 一覧（初期値3件のダミーデータあり） |
| `input` | `string` | 入力フィールドの値 |
| `filter` | `Filter` | 現在のフィルター (`all` / `active` / `done`) |
| `dateLabel` | `string` | ヘッダーの日付文字列（クライアントサイドで生成） |

**操作**

| 操作 | 関数 | 説明 |
|---|---|---|
| 追加 | `addTodo()` | 入力値をトリムし、空でなければ追加。`crypto.randomUUID()` で ID 生成 |
| 完了トグル | `toggleTodo(id)` | `completed` を反転 |
| 削除 | `deleteTodo(id)` | 指定 ID を除外 |
| 完了済み一括削除 | inline | `completed: true` のものをすべて除外 |

**フィルター**

| 値 | 表示ラベル | 条件 |
|---|---|---|
| `all` | ALL | すべて表示 |
| `active` | 未完了 | `completed === false` |
| `done` | 完了 | `completed === true` |

---

### `TodoItem` (`components/TodoItem.tsx`)

1件分の Todo を表示する。

**Props**

| 名前 | 型 | 説明 |
|---|---|---|
| `id` | `string` | 一意のID |
| `text` | `string` | タスク本文 |
| `completed` | `boolean` | 完了状態 |
| `onToggle` | `(id: string) => void` | 完了トグルのコールバック |
| `onDelete` | `(id: string) => void` | 削除のコールバック |

**UI 仕様**

- チェックボタン: 円形。未完了=グレーの枠線、完了=青塗り+チェックアイコン
- テキスト: 完了時は取り消し線+グレー色
- 削除ボタン: ホバー時のみ表示（`group-hover`）、×アイコン、ホバーで赤色

---

## データモデル

```ts
interface Todo {
  id: string;       // crypto.randomUUID() で生成
  text: string;     // タスク本文
  completed: boolean;
}

type Filter = "all" | "active" | "done";
```

---

## データ永続化

現時点では**なし**。リロードするとデータはリセットされる（メモリ上のみ）。

---

## 技術スタック

| 項目 | 内容 |
|---|---|
| フレームワーク | Next.js (App Router) |
| 言語 | TypeScript (strict) |
| スタイル | Tailwind CSS |
| デプロイ | Vercel |
| バックエンド | 未実装（将来的に Python / AWS を予定） |
