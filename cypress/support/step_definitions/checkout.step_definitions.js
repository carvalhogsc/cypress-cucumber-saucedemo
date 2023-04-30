import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given(
  "I am logged in to the application with username {string} and password {string}",
  (user, password) => {
    cy.visit("/");

    cy.get("[data-test=username]").type(user);
    cy.get("[data-test=password]").type(password);

    cy.get("[data-test=login-button]").click();
  }
);

When("I add the products to the cart", (table) => {
  const products = table.hashes();
  products.forEach(({ name, price }) => {
    const selectorProduct = name.toLowerCase().replaceAll(" ", "-");
    cy.get(`[data-test="add-to-cart-${selectorProduct}"]`)
      .siblings(".inventory_item_price")
      .should("contain", price);

    cy.get(`[data-test="add-to-cart-${selectorProduct}"]`)
      .should("contain", "Add to cart")
      .click();

    cy.get(`[data-test="remove-${selectorProduct}"]`)
      .should("contain", "Remove")
      .and("be.visible");
  });

  cy.get("#shopping_cart_container")
    .find(".shopping_cart_badge")
    .should("contain", 2);

  this.lastProductsAddToCart = products;
});

When("view the items in the cart", (table) => {
  cy.get("#shopping_cart_container").click();
  const products = table || this.lastProductsAddToCart;
  products.forEach(({ name, price }) => {
    const selectorProduct = name.toLowerCase().replaceAll(" ", "-");
    cy.get(`[data-test="remove-${selectorProduct}"]`)
      .siblings(".inventory_item_price")
      .should("contain", price)
      .parent()
      .parent()
      .find("a")
      .should("contain", name);
  });
  this.lastProductsAddToCart = products;
});

When("complete checkout", (table) => {
  const products = table || this.lastProductsAddToCart;
  cy.get("[data-test=checkout]").should("be.visible").click();
  cy.fixture("checkout_information").then(
    ({ firstName, lastName, postalCode }) => {
      cy.get("[data-test=firstName")
        .should("be.visible")
        .type(firstName)
        .should("have.value", firstName);
      cy.get("[data-test=lastName")
        .should("be.visible")
        .type(lastName)
        .should("have.value", lastName);
      cy.get("[data-test=postalCode")
        .should("be.visible")
        .type(postalCode)
        .should("have.value", postalCode);
    }
  );
  cy.get("[data-test=continue]").should("be.visible").click();
  let subTotal = 0;
  let total = 0;
  products.forEach(({ name, price }) => {
    cy.get(`.inventory_item_name`)
      .contains(name)
      .should("contain", name)
      .parent()
      .parent()
      .within(() => {
        cy.get(".inventory_item_price").should("contain", price);
      });
    subTotal += Number(price);
  });
  cy.get(".summary_subtotal_label").should("contain", subTotal);
  cy.get(".summary_tax_label").then((item) => {
    let text = item.text();
    let priceTax = text.match(/\d{1,2}.\d{2}/)[0];
    total += Number(priceTax) + subTotal;
    cy.get(".summary_total_label").should("contain", total);
  });

  cy.get("[data-test=finish]").should("be.visible").click();
});

Then("I should verify that the checkout was successful", () => {
  cy.get("#checkout_complete_container")
    .should("be.visible")
    .within(() => {
      cy.get("h2").should("contain", "Thank you for your order!");
      cy.get("div").should(
        "contain",
        "Your order has been dispatched, and will arrive just as fast as the pony can get there!"
      );
    });
});
