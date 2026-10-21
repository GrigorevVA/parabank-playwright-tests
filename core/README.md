# core

Ядро, не зависящее от приложения. Меняется редко.

| Папка / файл | Что лежит |
|---|---|
| `elements/` | `HtmlElement(locator, name)`, `Button`, `Input`, `Checkbox` |
| `api/` | request holder, `authorizeRequest`, api assertions (soft/hard через options) |
| `utils/` | `step()`, `TIMEOUT` (SHORT 5s, MEDIUM 10s, LONG 60s), env, logger, file utils, faker-генераторы |
| `page-holder.ts` | `setPage()` / `getPage()` |
