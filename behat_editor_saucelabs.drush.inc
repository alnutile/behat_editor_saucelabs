<?php

use Drupal\BehatEditorSauceLabs,
    Drupal\BehatEditor;

/**
 * @file
 * Drush hook implementations for BehatEditor
 */

/**
 * Implements hook_drush_command().
 */
function behat_editor_saucelabs_drush_command() {
    $items = array();

    $items['behat-run-sauce'] = array(
        'description' => 'Pass a module name and filename to run on SauceLabss',
        'allow-additional-options' => TRUE,
        'aliases' => array('brs'),
        'examples' => array(
            'drush run module_name view.feature' => 'This will use the path of the module_name to run that test'
        ),
        'bootstrap' => DRUSH_BOOTSTRAP_DRUPAL_FULL,
        'arguments' => array(
            'module' => 'The module name that the test file is in',
            'filename' => 'The file name to test. Should be in present folder',
        ),
    );

    return $items;
}


function drush_behat_editor_saucelabs_behat_run_sauce() {
    $module = func_get_arg(0);
    $filename = func_get_arg(1);
    //@todo get composer to load this
    composer_manager_register_autoloader();
    module_load_include('inc', 'behat_editor', 'helpers/behat_helpers_app');

    $file = new Drupal\BehatEditor\File(array(), $module, $filename, FALSE);
    $file_object = $file->get_file_info();

    $run = new Drupal\BehatEditorSauceLabs\BehatEditorSauceLabsRun($file_object);
    print "Running Tests...\n";
    $output = $run->execDrush();
    $results = implode("\n\r", $output);
    return $results;
}