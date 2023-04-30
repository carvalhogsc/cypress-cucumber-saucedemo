import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("I add the products to the cart", (table) => {
  const products = table.hashes();
  cy.wrap(products).as("lastProducts");

  cy.addProductsToCart();

  cy.getCartBadge().should("contain", products.length);
});

When("view the products add in the cart", () => {
  cy.getCartButton().should("be.visible").click();

  cy.validateCartItems();
});

When("complete checkout", () => {
  cy.getCheckoutButton().should("be.visible").click();

  cy.fixture("checkout_information").then((data) => {
    cy.fillFormCheckout(data);
  });

  cy.getContinueButton().should("be.visible").click();

  cy.validateOverviewItems();

  cy.validatePriceCalculation();

  cy.getFinishButton().should("be.visible").click();
});

Then("I should verify that the checkout was successful", () => {
  const header = "Thank you for your order!";
  const message =
    "Your order has been dispatched, and will arrive just as fast as the pony can get there!";
  cy.validateCheckout(header, message);
});
