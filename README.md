# qa-creai-automation

## Description

Automation exercise on the creai.mx website using cucumber, playwright and typescript.

## Prerequistes

* Node.js
* Visual Studio Code
  * Extensions:
    * Cucumber for Visual Studio Code
    * Playwright Test for VS Code

## Setup

1. Install dependences
```   
npm install
```
2. Install Playwright web browsers :
```
npx playwright install chromium
```
3. Add the following code to your VS Code Settings.json file to tell the editor where Cucumber can find features and steps:
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
