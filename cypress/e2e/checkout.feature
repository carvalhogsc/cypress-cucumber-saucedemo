Feature: Checkout

  Scenario: Validate that it is possible to checkout with 2 products
    Given I am logged in to the application with username "standard_user" and password "secret_sauce"
    When I add the products to the cart
      | name                              | price |
      | Sauce Labs Backpack               | 29.99 |
      | Test.allTheThings() T-Shirt (Red) | 15.99 |
    And view the products add in the cart
    And complete checkout
    Then I should verify that the checkout was successful
