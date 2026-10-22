# ParaBank Playwright tests

[![tests](https://github.com/GrigorevVA/parabank-playwright-tests/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/GrigorevVA/parabank-playwright-tests/actions/workflows/tests.yml)
[![Allure report](https://img.shields.io/badge/Allure-report-orange)](https://grigorevva.github.io/parabank-playwright-tests/)

Training test automation framework on Playwright + TypeScript for [ParaBank](https://parabank.parasoft.com/parabank), a demo bank by Parasoft.

Coverage: REST API, SOAP, UI via BDD (playwright-bdd).
The test environment runs locally in Docker. The public site rate-limits requests (HTTP 429) and is not suitable for test runs.

CI runs the API and BDD suites in parallel on every pull request and push to `main`; the [Allure report](https://grigorevva.github.io/parabank-playwright-tests/) from `main` is published to GitHub Pages with run history.

## Quick start

```powershell
npm ci
npm run stand:up
npx playwright install chromium
copy .env.example .env
npm test
```

| Script | What it does |
|---|---|
| `npm run stand:up` | start ParaBank in Docker (`127.0.0.1:8080`) and wait until it is healthy |
| `npm run stand:down` | stop and remove the stand |
| `npm test` | all tests |
| `npm run test:docker` | all tests in a container against the Docker stand, results in `allure-results/` |
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
