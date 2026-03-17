# Figma キャプチャで日本語テキストが表示されない問題

## 問題

`mcp__figma__generate_figma_design` を使って Next.js アプリを Figma に送ったとき、日本語テキストがすべて空白になる。

## 原因

Figma の HTML キャプチャツール（html-to-design）は、CSS の `font-family` に書かれた**先頭のフォント**を強制的に適用する。

通常のブラウザはフォントが文字に対応していなければ次のフォントにフォールバックするが、**Figma キャプチャはフォールバックを行わない**。先頭フォントが日本語非対応（例: `Geist`, `Arial`）だと、日本語文字がすべて描画されない。

## 解決策

日英両対応のフォントを `font-family` の先頭に置く。

```css
/* macOS */
font-family: "Hiragino Sans", "Hiragino Kaku Gothic ProN", sans-serif;
```

Windowsでは `"Yu Gothic"` など日英両対応のシステムフォントを先頭に置くことで同様に解決できると考えられるが、未検証。

## 経緯

Claude Code の Figma MCP（`mcp__figma__generate_figma_design`）を使って、Next.js で実装した アプリの UI を Figma に取り込もうとしていた。キャプチャ自体は成功したが、Figma 上で日本語テキストがすべて空白になる問題に遭遇した。

以下の Figma フォーラムの投稿から原因（先頭フォントの強制適用）を把握し、試行した。
https://forum.figma.com/report-a-problem-6/japanese-text-not-displayed-when-capturing-designs-via-claude-code-to-figma-51025?utm_source=chatgpt.com

1. Noto Sans JP（Google Fonts）を `font-family` 先頭に設定 → **失敗**（日本語は表示されず）
2. `Hiragino Sans`（macOS システムフォント）を先頭に変更 → **成功**

## まとめ・気づき

- Figma キャプチャは `font-family` の先頭フォントのみを使う（ブラウザのようなフォールバックは起きない）
- 日本語を含む UI を Figma に送る際は、日英両対応フォントを先頭に置くこと
- Figma キャプチャと日本語フォントの相性がある可能性がある
