import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("I want to login to the application", (user, password) => {
  cy.visit("/")
});

When("I login with valid username and password", () => {
  cy.get("[data-test=username]").type("standard_user")
  cy.get("[data-test=password]").type("secret_sauce")
  
  cy.get("[data-test=login-button]").click()
});

When("I login with invalid username and password", () => {
  cy.get("[data-test=username]").type("not_registred")
  cy.get("[data-test=password]").type("secret_sauce")
  
  cy.get("[data-test=login-button]").click()
});

Then("I should be redirected to the products page.", () => {
  cy.url().should('contain', '/inventory.html')
});

Then("I should see the following error message: {string}", (message) => {
  cy.get("[data-test=error]").contains(message)
});