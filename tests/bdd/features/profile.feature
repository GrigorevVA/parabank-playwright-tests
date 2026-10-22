Feature: Customer profile

  Background:
    Given a registered customer
    And I am logged in

  Scenario: Customer updates contact info
    When I open my contact info
    Then I see my registered contact info
    When I update my contact info
    Then I see the profile updated confirmation
    When I open my contact info
    Then I see my new contact info
