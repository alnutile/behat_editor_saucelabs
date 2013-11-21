<?php

use Drupal\BehatEditor,
    Drupal\BehatEditorSauceLabs;

/**
 * @file to get sl settings
 *
 */

function behat_editor_saucelabs_os() {
    composer_manager_register_autoloader();
    if (!class_exists('Drupal\BehatEditorSauceLabs\Wrapper')) {
        $message = t('SauceLabs Wrapper not found.');
        drupal_json_output(array('error' => 1, 'message' => $message));
        exit();
    }

    $username = variable_get('behat_editor_saucelabs_username', '');
    $api_key = variable_get('behat_editor_saucelabs_api', '');
    $getOs = new Drupal\BehatEditorSauceLabs\Wrapper($username, $api_key);
    $summary = $getOs->getOs();
    drupal_json_output($summary);
    exit();
}

function behat_editor_saucelabs_browser($os) {
    composer_manager_register_autoloader();
    if (!class_exists('Drupal\BehatEditorSauceLabs\Wrapper')) {
        $message = t('SauceLabs Wrapper not found.');
        drupal_json_output(array('error' => 1, 'message' => $message));
        exit();
    }

    $username = variable_get('behat_editor_saucelabs_username', '');
    $api_key = variable_get('behat_editor_saucelabs_api', '');
    $getBrowser = new Drupal\BehatEditorSauceLabs\Wrapper($username, $api_key);
    $summary = $getBrowser->getBrowser($os);
    drupal_json_output($summary);
    exit();
}