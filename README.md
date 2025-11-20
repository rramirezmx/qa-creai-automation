# qa-creai-automation

## Description

Automation exercise on the creai.mx website using cucumber, playwright and typescript.

## Prerequistes

* Node.js
* Visual Studio Code
  * Extensions:
    * Cucumber for Visual Studio Code
    * Cucumber (Gherkin) Full Support
    * Playwright Test for VS Code

## Project setup for running from VS Code

1. Clone project
```   
git clone https://github.com/rramirezmx/qa-creai-automation.git
```
2. Open the project folder from VS Code.

3. Install dependences
```   
npm install
```
4. Install Playwright web browsers :
```
npx playwright install chromium
```
5. Add the following code to your VS Code Settings.json file to tell the editor where Cucumber can find features and steps:
```
    "cucumber.features": [
                "features/*.feature"                
    ],
    "cucumber.glue": [
                "features/steps/*.ts"
    ],
```

## Execution in headless mode
```
npm test
```

## Execution in headed mode
```
npm test:headed
```
