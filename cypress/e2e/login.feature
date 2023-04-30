Feature: Login

  Scenario: Successfully login
    Given I want to login to the application
    When I login with valid username and password
    Then I should be redirected to the products page.

  Scenario: unsuccessful login scenario
    Given I want to login to the application
    When I login with invalid username and password
    Then I should see the following error message: "Epic sadface: Username and password do not match any user in this service"
