Feature: Customer registration

  Background:
    Given I am on the Register page

  Scenario: New customer registers
    When I register as a new customer
    Then I see the welcome message for the new customer

  Scenario: Registration fails when passwords do not match
    When I register as a new customer with a mismatched password confirmation
    Then I see the "Passwords did not match." error under password confirmation

  Scenario Outline: Registration fails without <field>
    When I register as a new customer without <field>
    Then I see the "<error>" error under <field>

    Examples:
      | field      | error                   |
      | First Name | First name is required. |
      | Last Name  | Last name is required.  |
      | Username   | Username is required.   |
