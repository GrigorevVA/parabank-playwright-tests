# core

Application-independent core. Changes rarely.

| Folder / file | Contents |
|---|---|
| `elements/` | `HtmlElement(locator, name)` and subclasses for real HTML behaviour: `Input`, `Select` |
| `api/` | `expectStatus` (soft / hard via options), SOAP envelope builder (values are XML-escaped) and response parser |
| `utils/` | `step()`, `TIMEOUT` (SHORT 5s, MEDIUM 10s, LONG 60s), `ENV` |
| `page-holder.ts`, `request-holder.ts` | `setPage()` / `getPage()`, `setRequest()` / `getRequest()` |
