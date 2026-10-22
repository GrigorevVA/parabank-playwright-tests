# app

ParaBank module on top of `core/`.

- `pages/`: static page classes (elements are static arrow fields, actions are static methods wrapped in `step()`).
- `components/`: reusable blocks (`LeftMenu`) and `formRow`, which finds a form field by its table row label.
- `api/rest/`: one file per endpoint (URL + call + types), `builders/` build the data, `helpers/` make the call, check success and return JSON.
- `api/soap/`: one file per SOAP operation, `helpers/` like in REST.
- `data/`: DDT data sets and reference data, no locators or random data.
