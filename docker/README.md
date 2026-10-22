# docker

- `docker-compose.yml`: ParaBank stand (`parabank`, pinned by digest, port bound to `127.0.0.1:8080`, healthcheck) and the test container (`tests`, profile `tests`).
- `Dockerfile`: test image based on the official `mcr.microsoft.com/playwright` image of the same version as `@playwright/test`, runs as `pwuser`.

```powershell
npm run stand:up      # stand only, for local runs
npm run test:docker   # build the test image and run all tests against the stand
npm run stand:down
```

The test container reaches the stand as `http://parabank:8080/parabank` and writes Allure results to `../allure-results` through a volume.
A fresh stand has an empty database; the Playwright global setup opens `index.htm` once, which makes ParaBank create its tables.
