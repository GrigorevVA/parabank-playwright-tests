# GitHub Actions

`tests.yml` runs on pull requests to `main`, pushes to `main` and manually.

- `lint`: type check (`tsc`), ESLint and Prettier check in the same Playwright image.
- `tests (api)`, `tests (bdd)`: matrix jobs in the official Playwright image (same digest as `docker/Dockerfile`), each with its own ParaBank service container. Upload `allure-results-<project>` and, on failure, `playwright-report-<project>`.
- `report`: merges the results of both jobs, restores the Allure history from GitHub Pages and uploads the `allure-report` artifact.
- `publish`: on `main` only (push or a manual **Run workflow**), deploys the report to GitHub Pages. The only job with write permissions (`pages`, `id-token`).

npm downloads are cached by the `package-lock.json` hash. Third-party actions are pinned by commit SHA, the workflow token is read-only by default. The runner is pinned to `ubuntu-24.04` so a new `ubuntu-latest` image cannot change CI unexpectedly.

`../dependabot.yml` proposes weekly grouped updates for npm packages and GitHub Actions, 14 days after release. Updated by hand: Playwright (`package.json`, `docker/Dockerfile` and `tests.yml` must use the same version) and the ParaBank image digest, which has no version tags to track.
