Feature: Customer registration

  Background:
    Given I am on the Register page

  Scenario: New customer registers
    When I register as a new customer
    Then I see the welcome message for the new customer

  Scenario Outline: Registration fails without <field>
    When I register as a new customer without <field>
    Then I see the "<error>" error under <field>

    Examples:
      | field      | error                   |
      | First Name | First name is required. |
      | Last Name  | Last name is required.  |
      | Username   | Username is required.   |
