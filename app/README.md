# app

ParaBank module on top of `core/`.

- `pages/`: static page classes (elements are static arrow fields, actions are static methods wrapped in `step()`).
- `components/`: reusable blocks (`LeftMenu`).
- `api/rest/`: one file per endpoint (URL + call + types), `builders/` build the data, `helpers/` make the call, check success and return JSON.
- `api/soap/`: envelope templates and SOAP operation calls.
- `data/`: DDT data sets and reference data, no locators or random data.
