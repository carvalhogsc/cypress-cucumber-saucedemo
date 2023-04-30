import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("I want to login to the application", (user, password) => {
  cy.visit("/");
});

Given(
  "I am logged in to the application with username {string} and password {string}",
  (user, password) => {
    cy.login(user, password);
  }
);

When("I login with valid username and password", () => {
  cy.login("standard_user", "secret_sauce");
});

When("I login with invalid username and password", () => {
  cy.login("not_registred", "secret_sauce");
});

Then("I should be redirected to the products page.", () => {
  cy.url().should("contain", "/inventory.html");
});

Then("I should see the following error message: {string}", (message) => {
  cy.getErrorMessage().should("be.visible").should("contain", message);
});
