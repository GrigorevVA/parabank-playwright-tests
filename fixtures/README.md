# fixtures

- `base.fixture.ts`: framework setup only: `test` (page + request) and `apiTest` (request only). Test-specific data is created in the spec's `beforeEach`.
- `global-setup.ts`: runs once before the tests: empties `allure-results/` and opens `index.htm` so a fresh ParaBank creates its database tables.
