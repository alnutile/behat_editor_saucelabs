 @javascript
 Feature: Example Test for WikiPedia
 
   Scenario: WikiPedia
     Given I am on "http://en.wikipedia.org/wiki/Main_Page"
     And I wait
     And I wait
     Then the element "#mp-tfa" should have style "10px"
     Then the element "#mp-tfa" should have style "5px"
     Then I should see "WikiPedia"
     And I follow "Donate to Wikipedia"
     Given I wait for "5" seconds
     Then I should see "Thanks"
     And I follow "Contents"
     Given I wait for "5" seconds
     Then I should see "Portal:Contents"
