# Test exercise for Unity - Search functionality of nopCommerce

## Deliverables

The other deliverables are available [here](https://docs.google.com/document/d/1nlCdTbAxSFzYZRr8h46gQM8vghMtgHGx773T_mWd9cU/edit?usp=sharing)

## Test code

The test code is contained in this single file: [cypress/integration/search_spec.js](cypress/integration/search_spec.js)

## Test execution instructions

(Make sure you have [git](https://git-scm.com/) installed)

Install [nodejs](https://nodejs.org/) version >= 10.0.0

Clone this repo and install dependencies:

```
git clone https://github.com/antlhe/unity_test.git
npm i
```

Run the tests on the command line (requires npm@5.2.0 or greater which you should have since nodejs >= 10.0.0 is required):

```
cd unity_test
npx cypress run --spec "cypress/integration/search_spec.js"
```

More Cypress command line execution information is available [here](https://docs.cypress.io/guides/guides/command-line.html#cypress-run)

You can select a browser by adding the option:

```
--browser chrome
```

or generate a mochawesome report by adding the option:

```
--reporter mochawesome
```

e.g.:
```
npx cypress run --browser chrome --reporter mochawesome --spec "cypress/integration/search_spec.js"
```




