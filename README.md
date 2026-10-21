# ParaBank Playwright tests

Учебный фреймворк автотестов на Playwright + TypeScript для [ParaBank](https://parabank.parasoft.com/parabank), демо-банка от Parasoft.

Что покрываем: REST API, SOAP, UI через BDD (playwright-bdd).
Стенд поднимается локально в Docker. Публичный сайт ограничивает частоту запросов (HTTP 429) и для прогонов не подходит.

> README будет дописан на шаге 12 (CI, отчёты, бейджи).

## Быстрый старт

```powershell
docker run -d --name parabank -p 8080:8080 parasoft/parabank
npm ci
npx playwright install chromium
copy .env.example .env
npm test
```

| Скрипт | Что делает |
|---|---|
| `npm test` | все тесты |
| `npm run test:api` | REST и SOAP |
| `npm run test:bdd` | BDD-сценарии UI |
| `npm run typecheck` | проверка типов |
| `npm run report` | HTML-отчёт |

## Структура

```
core/            ядро: holders, step(), обёртки элементов, проверки API, env, таймауты
app/
  pages/         страницы (static-классы)
  components/    общие блоки (LeftMenu)
  api/rest/      эндпоинты, builders, helpers
  api/soap/      SOAP-вызовы
  data/          DDT-наборы
fixtures/        base.fixture.ts
tests/
  e2e/api/rest   REST-тесты
  e2e/api/soap   SOAP-тесты
  bdd/           features + steps
docker/          Dockerfile и compose
.github/         CI
```
