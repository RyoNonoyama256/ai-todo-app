# TODO

## Figma × Claude Code でTodo UI を実装する

### ① Figma MCP を Claude Code に設定
- [ ] Figma アカウントを用意する
- [ ] Figma の Personal Access Token を取得する
  - Figma → Settings → Security → Personal access tokens → Generate new token
- [x] Claude Code に Figma MCP を追加する
- [x] MCP の接続を確認する

### ② Claude Code でベースUI をコーディング
- [x] `frontend/components/` に Todo コンポーネントを作成する
- [x] `frontend/app/page.tsx` に組み込む
- [x] `npm run dev` でローカル確認

### ③ Code to Canvas で Figma に取り込む
- [x] `npm run dev` で開発サーバーを起動した状態で Claude Code に「Send this to Figma」と伝える
- [x] Figma キャンバスに編集可能なレイヤーとして取り込まれたことを確認する

### ④ Figma 上でデザイン調整
- [x] 色・フォント・余白などを Figma 上で調整する

### ⑤ 調整済みデザインをコードに反映
- [x] Figma の URL を Claude Code に渡してコードを更新してもらう
- [x] `npm run dev` でデザインと実装のズレを確認・修正する

### ⑥ Vercel へデプロイ
- [ ] Vercel アカウントを用意する
- [ ] GitHub リポジトリと Vercel を連携する
- [ ] デプロイして本番 URL を確認する
