# CLAUDE.md

Claude Code がこのリポジトリで作業する際の指針です。

## プロジェクト概要

AI Todo App — Vercel へのデプロイと Figma + Claude Code 連携を体験するプロジェクト。

- **Frontend**: Next.js (App Router, TypeScript) → Vercel
- **Backend**: Python → AWS

## ディレクトリ構成

```
ai-todo-app/
├── CLAUDE.md          # このファイル
├── README.md
├── frontend/          # Next.js アプリ
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── ...
└── backend/           # Python API (今後追加予定)
```

## 開発コマンド

```bash
# フロントエンド
cd frontend
npm run dev       # 開発サーバー起動 (localhost:3000)
npm run build     # 本番ビルド
npm run lint      # Lint 実行
```

## コーディング規約

- **言語**: TypeScript (strict モード)
- **スタイル**: Tailwind CSS
- **コンポーネント**: `frontend/components/` に配置
- **ユーティリティ**: `frontend/lib/` に配置
- **命名規則**:
  - コンポーネント: PascalCase (`TodoItem.tsx`)
  - 関数・変数: camelCase
  - 定数: UPPER_SNAKE_CASE

## 作業フロー

- 複数ステップの作業を始める前に必ず TodoWrite でタスク一覧を作成すること
- 各タスク完了時に即座に完了マークをつけること
- プロジェクトの実行計画・進捗は [TODO.md](TODO.md) で管理する
- タスクが完了したら TODO.md の該当項目を `- [ ]` から `- [x]` に更新すること

## Claude Code への指示

- コードを変更する前に必ず該当ファイルを読むこと
- 不要なファイルを作成しないこと
- 変更は最小限にとどめること（オーバーエンジニアリング禁止）
- セキュリティ上の問題（XSS, SQLi など）を絶対に混入させないこと
- コミットは明示的に指示されたときのみ行うこと
