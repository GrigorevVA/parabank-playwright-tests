@severity:critical
Feature: Customer accounts

  Background:
    Given a registered customer
    And I am logged in

  Scenario Outline: Customer opens <type> account
    When I open a new <type> account
    And I go to Accounts Overview
    Then I see the new account in the overview

    Examples:
      | type     |
      | CHECKING |
      | SAVINGS  |

  Scenario: Customer pays a bill
    When I pay a $12.50 bill
    Then I see the $12.50 bill payment confirmation
    When I open my account activity
    Then I see the $12.50 bill payment in the activity

  Scenario: Customer transfers money to own account
    Given I have a second SAVINGS account
    When I transfer $25 to my second account
    Then I see the $25 transfer confirmation
