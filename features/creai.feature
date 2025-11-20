Feature: CreAI.mx Site Integrity Validation

  Background:
    Given I start monitoring for console errors

  Scenario: Page Load Validation
    Given I navigate to the site "https://www.creai.mx"
    Then the site loads successfully and returns HTTP status 200
    And there are no visible errors in the console

  Scenario: Key Elements Presence
    Given I navigate to the site "https://www.creai.mx"
    Then validate that the brand logo is visible
    And validate that a contact button exists
    And verify that following sections load correctly
      | selector | description         |
      | header   | Main Header         |
      | footer   | Page Footer         |
      | h1       | Main Title          |

  Scenario: Navigation
    Given I navigate to the site "https://www.creai.mx"
    When I click on the link "About us"
    Then verify that it redirects correctly to the url "about-us"

  Scenario: Mobile Viewport
    Given simulate a test with mobile viewport "iPhone X"
    When I navigate to the site "https://www.creai.mx"
    Then verify that following sections load correctly
      | selector | description         |
      | header   | Main Header         |
      | footer   | Page Footer         |
      | h1       | Main Title          |