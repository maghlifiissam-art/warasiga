# TESTS - Warasiga

Honest test evidence only. Each entry says what was actually run.

## 2026-11-25 - photo-mode run on the rebuilt source (localhost, App Check debug token)

Build: this repo at the commit that adds this file, served from 127.0.0.1 with a local copy of
app.js that honors a pre-set debug token (the repo's app.js is unchanged). One synthetic receipt
image (4 items, total 39.00 DH), uploaded through the app's file input in headless Chrome.

Observed:
- Two generateContent calls to gemini-3.5-flash-lite, both HTTP 200.
- Engine line: cloud via Firebase AI Logic, 2.3 s. On-device (Gemini Nano) was NOT exercised.
- Output listed the 4 items one per line with prices and the 39.00 DH total, and contained no
  item-count wording. This is one run on one fixture, not a general accuracy claim.
- CSS: list items render with 4 px gaps (measured), tight bullets in the result screenshot.
- Plan stayed Spark (no cost). The temporary debug token was deleted afterwards
  (console showed "Aucun jeton enregistre").

Not verified: Nano on-device path, behavior for real visitors on the deployed site after
redeploy, other receipts or languages.
