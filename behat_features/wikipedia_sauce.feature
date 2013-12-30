@sauces
Feature: Example Test for WikiPedia

  Scenario: WikiPedia Sauce
    Given I am on "http://en.wikipedia.org/wiki/Main_Page"
    Then I should see "Wiki"
    And I follow "Donate to Wikipedia"
    Then I should see "Thanks"
