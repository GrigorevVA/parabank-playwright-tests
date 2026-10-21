# ParaBank Playwright tests

Training test automation framework on Playwright + TypeScript for [ParaBank](https://parabank.parasoft.com/parabank), a demo bank by Parasoft.

Coverage: REST API, SOAP, UI via BDD (playwright-bdd).
The test environment runs locally in Docker. The public site rate-limits requests (HTTP 429) and is not suitable for test runs.

> CI, reports and badges will be added to this README later.

## Quick start

```powershell
docker run -d --name parabank -p 127.0.0.1:8080:8080 parasoft/parabank@sha256:f41126b4c1a293643ef86dfc2b29955c0d59e1dc992797f48f00298c68a717ab
npm ci
npx playwright install chromium
copy .env.example .env
npm test
```

| Script | What it does |
|---|---|
| `npm test` | all tests |
| `npm run test:api` | REST and SOAP |
| `npm run test:bdd` | UI BDD scenarios |
| `npm run typecheck` | type check |
| `npm run report` | HTML report |
| `npm run allure:generate` | Allure report from the last run (`allure-report/`) |
| `npm run allure:open` | open the Allure report |

## Structure

```
core/            core: holders, step(), element wrappers, API assertions, env, timeouts
app/
  pages/         pages (static classes)
  components/    shared blocks (LeftMenu)
  api/rest/      endpoints, builders, helpers
  api/soap/      SOAP calls
  data/          DDT data sets
fixtures/        base.fixture.ts
tests/
  e2e/api/rest   REST tests
  e2e/api/soap   SOAP tests
  bdd/           features + steps
docker/          Dockerfile and compose
.github/         CI
```
