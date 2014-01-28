@javascript @api
Feature: Test Saucelabs Run and View tests
  Background: Log In
    Given I am on "/user/logout"
    Then I am on "/user/login"
    And I fill in "Username" with "admin"
    And I fill in "Password" with "password"
    And I press "Log in"
    And I wait for "3" seconds
    Given I run drush "cache-clear drush"
    Given I run drush "gbs wikipedia_sauce.feature"

  Scenario: User Views a test and Runs it on Saucelabs
    Given I am on "/admin/behat/view/behat_editor_saucelabs/behat_features/wikipedia_sauce.feature"
    Then I should see "Scenario: WikiPedia Sauce"
    And I wait
    And I wait
    And I click "Run on Sauce Labs"
    And I wait for "10" seconds
    Then I should see "Connecting to Saucelabs and waiting"
    And I wait for "20" seconds
    Then I should see "SauceLabs is now 100% complete"
    And I should see "4 steps"

  @thisone
  Scenario: User Edits a test and Runs it on Saucelabs
    Given I am on "/admin/behat/edit/behat_tests/wikipedia_sauce.feature"
    Then I should see "Scenario: WikiPedia"
    And I wait
    And I wait
    Then I fill in "see_not_see_some_text" with "Test4"
    And I press "see_not_see"
    And I wait
    And I click "Run on Sauce Labs"
    And I wait for "10" seconds
    Then I should see "Connecting to Saucelabs and waiting"
    And I wait for "30" seconds
    Then I should see "SauceLabs is now 100% complete"
    And I should see "4 steps"
    And I am on "/sites/default/files/behat_tests/wikipedia_test.feature"
    And I wait
    Then I should see "Test4"
