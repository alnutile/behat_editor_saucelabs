 
 Feature: Example Test for WikiPedia

   @javascript
   Scenario: WikiPedia
     Given I am on "http://en.wikipedia.org/wiki/Main_Page"
     Then I should see "WikiPedia"
     Given I hover over the "Test" menu item
