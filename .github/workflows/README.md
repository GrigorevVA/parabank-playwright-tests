# GitHub Actions

`tests.yml` runs on pull requests to `main`, pushes to `main` and manually.

- `tests (api)`, `tests (bdd)`: matrix jobs in the official Playwright image (same digest as `docker/Dockerfile`), each with its own ParaBank service container. Upload `allure-results-<project>` and, on failure, `playwright-report-<project>`.
- `report`: merges the results of both jobs, restores the Allure history from GitHub Pages and uploads the `allure-report` artifact.
- `publish`: on `main` only, deploys the report to GitHub Pages. The only job with write permissions (`pages`, `id-token`).

npm downloads are cached by the `package-lock.json` hash. Third-party actions are pinned by commit SHA, the workflow token is read-only by default.
