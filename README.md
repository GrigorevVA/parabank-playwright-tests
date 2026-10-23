# ParaBank Playwright tests

[![tests](https://github.com/GrigorevVA/parabank-playwright-tests/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/GrigorevVA/parabank-playwright-tests/actions/workflows/tests.yml)
[![Allure report](https://img.shields.io/badge/Allure-report-orange)](https://grigorevva.github.io/parabank-playwright-tests/)

Training test automation framework on Playwright + TypeScript for [ParaBank](https://parabank.parasoft.com/parabank), a demo bank by Parasoft: REST API, SOAP and UI tests written as BDD scenarios.

The tests run against a local ParaBank in Docker. The public site rate-limits requests (HTTP 429) and is not suitable for test runs.

## Coverage

| Suite | Scenarios | Tests |
|---|---|---|
| REST | login (valid / wrong password), customer (read, update, unknown customer), accounts (new customer, open CHECKING / SAVINGS, unknown account), balance (deposit, withdrawal, unknown account), transfer, transactions (bill payment, read by id, find by amount, unknown transaction), positions (buy, partial sale, full sale, unknown position), loan requests (approved / denied, data-driven), known defects (4, expected to fail) | 30 |
| SOAP | login (valid / fault), customer (read, update, fault), accounts (new customer, open SAVINGS, fault for unknown account), balance (deposit, withdrawal, fault), transfer, positions (buy, partial sale, full sale), loan requests (approved / denied, data-driven) | 19 |
| UI (BDD) | registration (success, taken username, password mismatch, required fields), login (valid, wrong password, log out), profile update, accounts (open CHECKING / SAVINGS, bill payment, transfer funds) | 14 |

Tests follow CRUD per entity: every create or update is confirmed by a separate read, through the API or by reopening the page in the UI. REST and SOAP cover the same operations, except bill payment, which is REST and UI only.

| Entity | Create | Read | Update | Delete |
|---|---|---|---|---|
| Customer | registration, taken username | by id, unknown id | REST update, Update Profile form | not supported by ParaBank (405) |
| Account | open CHECKING / SAVINGS | by id, customer accounts, overview | balance via deposit, withdrawal, transfer and bill payment | not supported |
| Transaction | bill payment, transfer, deposit, withdrawal | by account, by id, by amount, account activity | not supported | not supported |
| Position (shares) | buy | by id, customer positions | partial sale | full sale |

## Known defects

[`known-defects.spec.ts`](tests/e2e/api/rest/known-defects.spec.ts) describes the correct behaviour for four ParaBank defects and marks the tests with `test.fail()`, so CI stays green while the defects stay visible in the report:

- withdrawal above the balance is accepted (the balance goes negative);
- a negative deposit is accepted;
- buying shares above the balance is accepted;
- selling more shares than the position has is accepted (shares go negative).

When ParaBank fixes a defect, Playwright reports "expected to fail, but passed" and the `test.fail()` mark has to be removed.

Every test registers its own customer with Faker data, so tests do not share state.

## Stack

Playwright, TypeScript 6, [playwright-bdd](https://github.com/vitalets/playwright-bdd), Faker, fast-xml-parser, Allure 3, ESLint (typescript-eslint, eslint-plugin-playwright), Prettier, Docker, GitHub Actions.

## Quick start

Requires Node.js 20+ and Docker.

```shell
npm ci
npx playwright install chromium
cp .env.example .env      # Windows: copy .env.example .env
npm run stand:up
npm test
```

| Script | What it does |
|---|---|
| `npm run stand:up` | start ParaBank in Docker (`127.0.0.1:8080`) and wait until it is healthy |
| `npm run stand:down` | stop and remove the stand |
| `npm test` | all tests |
| `npm run test:api` | REST and SOAP |
| `npm run test:bdd` | UI BDD scenarios |
| `npm run test:docker` | all tests in a container against the Docker stand, results in `allure-results/` |
| `npm run typecheck` | type check |
| `npm run lint` | ESLint: TypeScript, Playwright and project code rules |
| `npm run format` / `format:check` | Prettier: format the code / check the format |
| `npm run report` | Playwright HTML report |
| `npm run allure:generate` | Allure report from the last run (`allure-report/`) |
| `npm run allure:open` | open the Allure report |

## How it is built

- **Layers.** `core/` does not know about ParaBank: page and request holders, `step()`, element wrappers, status assertions, env and timeouts. `app/` describes ParaBank on top of it. `tests/` contains only tests.
- **Page objects** are static classes: elements are static arrow fields returning an element wrapper, actions are static methods wrapped in `step()`. Pages are named the way the user sees them (`AccountsOverviewPage`, `TransferFundsPage`).
- **Element wrappers** (`HtmlElement`, `Input`, `Select`) wrap every action in a named step, so reports read as user actions: `Fill Amount input`, `Click Transfer button`.
- **API layer:** one file per endpoint (URL, call and types), builders only build data, helpers call the endpoint, check success and return JSON. Soft or hard checks are chosen with an options argument.
- **BDD:** declarative use-case steps, custom parameter types (`{accountType}`, `{registerField}`), Scenario Outlines for data sets. API calls in UI scenarios are used only to prepare data.
- **Linting** turns review rules into errors: `expect` without a message, `waitForTimeout`, `waitForURL` / `waitForResponse`, a missing `await`, `test.only` / `test.skip`.
- **Checks** always carry a message. UI checks verify what the user sees (visible elements and text), API checks verify status codes and response bodies.

## CI and reports

[`tests.yml`](.github/workflows/tests.yml) runs on every pull request and push to `main`:

- `lint` runs the type check, ESLint and the Prettier check;
- `tests (api)` and `tests (bdd)` run in parallel in the official Playwright image, each with its own ParaBank service container;
- `report` merges the results into one Allure report;
- on `main`, `publish` deploys the report to [GitHub Pages](https://grigorevva.github.io/parabank-playwright-tests/) with run history.

The report tree is grouped by epic (REST API, SOAP API, UI (BDD)) and feature; every test has a severity. API specs get the labels from `allureLabels()` on `test.describe`, BDD scenarios from a `Before` hook (feature title and an optional `@severity:` tag). Known defects have their own category.

Pull requests to `main` require `lint` and both test jobs to pass. Actions and images are pinned by SHA / digest, and only the publish job has write permissions.

## Stand quirks handled by the framework

- **Fresh database.** A new ParaBank container has no tables until `index.htm` is opened once; the Playwright global setup does that.
- **City length.** Registration fails with a misleading "This username already exists." when the city is longer than 20 characters; the customer builder trims it.
- **Password in URL.** REST login passes the password in the path, so generated passwords are alphanumeric.
- **One worker.** Tests run in a single worker against one stand; CI parallelises by project instead.

## Structure

```
core/            holders, step(), element wrappers, status assertions, env, timeouts
app/
  pages/         page objects (static classes)
  components/    shared blocks (LeftMenu)
  api/rest/      endpoints, builders, helpers
  api/soap/      SOAP operations and helpers
  data/          reference data and DDT sets
fixtures/        Playwright fixtures and global setup
tests/
  e2e/api/rest   REST tests
  e2e/api/soap   SOAP tests
  bdd/           features and step definitions
docker/          Dockerfile and docker compose
.github/         CI workflow
```
