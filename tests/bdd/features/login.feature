Feature: Customer login

  Background:
    Given a registered customer
    And I am on the Home page

  Scenario: Customer logs in with valid password
    When I log in with a valid password
    Then I see the Accounts Overview page

  Scenario: Customer cannot log in with wrong password
    When I log in with a wrong password
    Then I see the login error "The username and password could not be verified."

  Scenario: Customer logs out
    Given I log in with a valid password
    When I log out
    Then I see the Customer Login form
