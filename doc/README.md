# doc/

Materials for the 15-minute presentation.

| File | What it is |
| ---- | ---------- |
| `outline.md` | The talk outline: timing, speaker notes, demo-recording script |
| `slides.md` | Slidev deck (single markdown file) |
| `package.json` | Minimal Slidev project setup |

## Run

```bash
cd doc
npm install
npm run dev      # http://localhost:3030
npm run build    # static export to dist/
```

## Demo recording

Record the 5-minute demo (see `outline.md` → "What the recording shows"), then place it at:

```
doc/public/demo/feature-demo.mp4
```

Slidev serves `public/` at `/`, so the slide embeds it via `src="/demo/feature-demo.mp4"`.
