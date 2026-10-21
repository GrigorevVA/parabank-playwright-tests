# core

Application-independent core. Changes rarely.

| Folder / file | Contents |
|---|---|
| `elements/` | `HtmlElement(locator, name)`, `Button`, `Input`, `Checkbox` |
| `api/` | request holder, `authorizeRequest`, API assertions (soft/hard via options) |
| `utils/` | `step()`, `TIMEOUT` (SHORT 5s, MEDIUM 10s, LONG 60s), env, logger, file utils, faker generators |
| `page-holder.ts` | `setPage()` / `getPage()` |
