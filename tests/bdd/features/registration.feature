@severity:critical
Feature: Customer registration

  Background:
    Given I am on the Register page

  Scenario: New customer registers
    When I register as a new customer
    Then I see the welcome message for the new customer

  Scenario: Registration fails when passwords do not match
    When I register as a new customer with a mismatched password confirmation
    Then I see the "Passwords did not match." error under password confirmation

  Scenario: Registration fails for a taken username
    Given a registered customer
    When I register another customer with the same username
    Then I see the "This username already exists." error under Username

  Scenario Outline: Registration fails without <field>
    When I register as a new customer without <field>
    Then I see the "<error>" error under <field>

    Examples:
      | field      | error                   |
      | First Name | First name is required. |
      | Last Name  | Last name is required.  |
      | Username   | Username is required.   |
