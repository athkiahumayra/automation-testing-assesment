# Automation Testing Assessment

This starter project covers the SauceDemo UI tasks using Playwright and the ReqRes API tasks using a Postman collection.

## Tools
- Node.js (LTS)
- VS Code
- Playwright Test (UI automation)
- Postman (edit/import the API collection)
- Newman + htmlextra (run the exported collection from a terminal and generate an HTML report)
- Git + GitHub

## 1. Install and open the project
1. Install Node.js LTS from https://nodejs.org/.
2. Install VS Code from https://code.visualstudio.com/.
3. Extract this ZIP to a folder, for example `C:\Users\YourName\Documents\automation_testing_assessment`.
4. In VS Code, choose **File > Open Folder** and select that folder.
5. In VS Code choose **Terminal > New Terminal**.
6. Run `npm install`.
7. Run `npx playwright install chromium`.

## 2. Run the UI tests
Run one test at a time:
- `npm run test:q1`
- `npm run test:q2`
- `npm run test:q3`

Run all UI tests sequentially:
- `npm run test:ui`

The browser is configured to open visibly. Playwright creates an HTML report after each run in `playwright-report/`.
Open the latest report with `npm run report:ui`.

## 3. API testing in Postman
1. Create a free ReqRes account/API key at https://app.reqres.in/ or follow the current instructions at https://reqres.in/docs.
2. Open Postman and import `postman/reqres-automation.collection.json`.
3. Import `postman/reqres-environment.template.json` as an environment.
4. Select that environment in Postman and replace `PASTE_YOUR_REQRES_API_KEY_HERE` with your own API key.
5. Select the collection and click **Run** to execute all requests in order.
6. The collection saves the login response's `token` into the collection variable `authToken`.

ReqRes changes its authentication and demo behavior over time. If the classic `/api/login` or `/api/users` endpoints reject the key or credentials, follow the current ReqRes documentation and ask your teacher whether the assignment expects the classic demo endpoints. Do not commit your real API key to a public GitHub repository.

## 4. Run the Postman collection from the command line
The template environment intentionally contains a placeholder. Create a local copy named `postman/reqres-environment.json`, add your key there, and run:

`npx newman run postman/reqres-automation.collection.json -e postman/reqres-environment.json --reporters cli,htmlextra --reporter-htmlextra-export reports/api-report.html`

Create the `reports` folder first if it does not exist:
- PowerShell: `New-Item -ItemType Directory -Force reports`
- macOS/Linux: `mkdir -p reports`

Newman runs the exported Postman collection locally. The HTML report is saved to `reports/api-report.html`.

## 5. What each UI test does
- Q1: enters `locked_out_user` and asserts the lockout error is visible.
- Q2: logs in as `standard_user`, resets app state, adds the first three products, verifies product names and subtotal/total, finishes checkout, verifies success, resets state and logs out.
- Q3: logs in as `performance_glitch_user`, resets app state, sorts product names Z to A, adds the first product, verifies checkout names/prices and success, resets state and logs out.

## 6. GitHub submission
From the VS Code terminal:
1. `git init`
2. `git add .`
3. `git commit -m "Complete UI and API automation assessment"`
4. Create a **Public** repository on https://github.com/new. Do not add a README there if you already have one locally.
5. Follow GitHub's instructions to connect the local repository and push it.

Before pushing, confirm your real API key is not in any file being committed. Do not upload `node_modules`, reports, or real secrets.

## Notes
- UI tests depend on SauceDemo's current page selectors and site behavior.
- ReqRes is a third-party testing API and may change authentication requirements. The collection is a starter template; verify it with your own API key before submission.
- The test report shows actual results from your machine. Do not claim tests passed until you have run them.
