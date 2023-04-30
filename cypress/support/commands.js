// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Selectors
Cypress.Commands.add("getUsernameInput", () => {
  cy.get("[data-test=username]");
});

Cypress.Commands.add("getPasswordInput", () => {
  cy.get("[data-test=password]");
});

Cypress.Commands.add("getLoginButton", () => {
  cy.get("[data-test=login-button]");
});

Cypress.Commands.add("getErrorMessage", () => {
  cy.get("[data-test=error]");
});

Cypress.Commands.add("getAddToCartByProductName", (productName) => {
  const selectorProduct = productName.toLowerCase().replaceAll(" ", "-");
  cy.get(`[data-test="add-to-cart-${selectorProduct}"]`);
});

Cypress.Commands.add("getRemoveToCartByProductName", (productName) => {
  const selectorProduct = productName.toLowerCase().replaceAll(" ", "-");
  cy.get(`[data-test="remove-${selectorProduct}"]`);
});

Cypress.Commands.add("getNameByProductName", (productName) => {
  cy.get(`.inventory_item_name`).contains(productName);
});

Cypress.Commands.add("getPriceByProductName", (productName) => {
  cy.getNameByProductName(productName)
    .parent()
    .parent()
    .parent()
    .within(() => {
      return cy.get(".inventory_item_price");
    });
});

Cypress.Commands.add("getDescriptionByProductName", (productName) => {
  cy.getNameByProductName(productName)
    .parent()
    .parent()
    .within(() => {
      return cy.get(".inventory_item_desc");
    });
});

Cypress.Commands.add("getCartButton", () => {
  cy.get("#shopping_cart_container");
});

Cypress.Commands.add("getCheckoutButton", () => {
  cy.get("[data-test=checkout]");
});

Cypress.Commands.add("getFirstNameInput", () => {
  cy.get("[data-test=firstName");
});

Cypress.Commands.add("getLastNameInput", () => {
  cy.get("[data-test=lastName");
});

Cypress.Commands.add("getPostalCodeInput", () => {
  cy.get("[data-test=postalCode");
});

Cypress.Commands.add("getContinueButton", () => {
  cy.get("[data-test=continue]");
});

Cypress.Commands.add("getFinishButton", () => {
  cy.get("[data-test=finish]");
});

Cypress.Commands.add("getCartBadge", () => {
  cy.getCartButton().find(".shopping_cart_badge");
});

Cypress.Commands.add("getSubTotalLabel", () => {
  cy.get(".summary_subtotal_label");
});

Cypress.Commands.add("getTaxLabel", () => {
  cy.get(".summary_tax_label");
});

Cypress.Commands.add("getTotalLabel", () => {
  cy.get(".summary_total_label");
});

Cypress.Commands.add("getCheckoutCompleteContainer", () => {
  cy.get("#checkout_complete_container");
});

Cypress.Commands.add("getCheckoutCompleteHeader", () => {
  cy.getCheckoutCompleteContainer().within(() => {
    return cy.get("h2");
  });
});

Cypress.Commands.add("getCheckoutCompleteMessage", () => {
  cy.getCheckoutCompleteContainer().within(() => {
    return cy.get("div");
  });
});

Cypress.Commands.add("getBackHome", () => {
  cy.get("[data-test=back-to-products]");
});

// Flows
Cypress.Commands.add("login", (user, password) => {
  cy.visit("/");
  cy.getUsernameInput().should("be.visible").type(user);
  cy.getPasswordInput().should("be.visible").type(password);
  cy.getLoginButton().should("be.visible").click();
});

Cypress.Commands.add("addProductsToCart", () => {
  cy.get("@lastProducts").then((products) => {
    products.forEach((product) => {
      cy.getPriceByProductName(product.name)
        .should("be.visible")
        .and("contain", product.price);
      cy.getAddToCartByProductName(product.name)
        .should("contain", "Add to cart")
        .and("be.visible")
        .click();
      cy.getRemoveToCartByProductName(product.name)
        .should("contain", "Remove")
        .and("be.visible");
    });
  });
});

Cypress.Commands.add("removeProductsToCart", (product) => {
  cy.get("@lastProducts").then((products) => {
    products.forEach((product) => {
      cy.getPriceByProductName(product.name)
        .should("be.visible")
        .and("contain", product.price);
      cy.getRemoveToCartByProductName(product.name)
        .should("be.visible")
        .and("contain", "Remove")
        .click();
      cy.getAddToCartByProductName(product.name)
        .should("be.visible")
        .and("contain", "Add to cart");
    });
  });
});

Cypress.Commands.add("fillFormCheckout", (data) => {
  cy.getFirstNameInput()
    .should("be.visible")
    .type(data.firstName)
    .should("have.value", data.firstName);
  cy.getLastNameInput()
    .should("be.visible")
    .type(data.lastName)
    .should("have.value", data.lastName);
  cy.getPostalCodeInput()
    .should("be.visible")
    .type(data.postalCode)
    .should("have.value", data.postalCode);
});

// Validates
Cypress.Commands.add("validateCartItems", () => {
  cy.get("@lastProducts").then((products) => {
    products.forEach((product) => {
      cy.getNameByProductName(product.name)
        .should("be.visible")
        .and("contain", product.name);
      cy.getPriceByProductName(product.name)
        .should("be.visible")
        .and("contain", product.price);
      cy.getRemoveToCartByProductName(product.name)
        .should("contain", "Remove")
        .and("be.visible");
    });
  });
});

Cypress.Commands.add("validateOverviewItems", () => {
  cy.get("@lastProducts").then((products) => {
    products.forEach((product) => {
      cy.getNameByProductName(product.name)
        .should("be.visible")
        .and("contain", product.name);
      cy.getPriceByProductName(product.name)
        .should("be.visible")
        .and("contain", product.price);
    });
  });
});

Cypress.Commands.add("validatePriceCalculation", () => {
  let subTotal = 0;
  let total = 0;
  cy.get("@lastProducts").then((products) => {
    products.forEach((product) => {
      subTotal += Number(product.price);
    });

    cy.getSubTotalLabel().should("be.visible").and("contain", subTotal);

    cy.getTaxLabel().then((item) => {
      let text = item.text();
      let priceTax = text.match(/\d{1,2}.\d{2}/)[0];
      total += Number(priceTax) + subTotal;
      cy.getTotalLabel().should("be.visible").and("contain", total);
    });
  });
});

Cypress.Commands.add("validateCheckout", (header, message) => {
  cy.getCheckoutCompleteHeader().should("be.visible").and("contain", header);
  cy.getCheckoutCompleteMessage().should("be.visible").and("contain", message);
});
