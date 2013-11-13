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
            'drush brs module_name view.feature' => 'This will use the path of the module_name to run that test'
        ),
        'bootstrap' => DRUSH_BOOTSTRAP_DRUPAL_FULL,
        'arguments' => array(
            'module' => 'The module name that the test file is in',
            'filename' => 'The file name to test. Should be in present folder',
        ),
    );

    $items['behat-run-sauce-folder'] = array(
        'description' => 'Pass a module name to run all tests in it\'s behat_features folder and decide to turn on Javascript',
        'allow-additional-options' => TRUE,
        'aliases' => array('brsf'),
        'examples' => array(
            'drush brsf module_name 1' => 'This will use the path of the module_name to run that test and 1 means you want to include Javascript'
        ),
        'bootstrap' => DRUSH_BOOTSTRAP_DRUPAL_FULL,
        'arguments' => array(
            'module' => 'The module name that the test files are in',
            'javascript' => '1 if you want to run javascript based tests 0 if not. Javascript means you are running this locally.',
            'subfolder' => '(Optional) if this is a folder in the behat_features folder',
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
    return  drush_html_to_text("\n\r" . $results);
}

//@todo add profile switch as well
function drush_behat_editor_behat_run_sauce_folder() {
    print "Running Tests...\n";
    module_load_include('inc', 'behat_editor', 'helpers/behat_helpers_app');
    composer_manager_register_autoloader();
    //@todo validate args
    $module = func_get_arg(0);
    if(func_num_args() > 1) {
        $javascript = func_get_arg(1);
    } else {
        $javascript = 0;
    }

    $fileObject = Drupal\BehatEditorSauceLabs\BehatEditorSauceLabsRun::fileObjecBuilder();
    $path = drupal_get_path('module', $module);
    $file_tests_folder = variable_get('behat_editor_default_folder', BEHAT_EDITOR_DEFAULT_FOLDER);
    $path = drupal_realpath($path) . '/' . $file_tests_folder;
    if(func_num_args() > 2) {
        $path = $path . '/' . func_get_arg(2);
    }
    $fileObject->absolute_file_path = $path;
    $run = new Drupal\BehatEditorSauceLabs\BehatEditorSauceLabsRun($fileObject);
    print "Running Tests in folder  {$fileObject['filename']}...\n";
    $output = $run->exec($javascript);
    $results = implode("\n\r", $output['output_array']);
    drush_print($results);

    return "All Tests ran for module $module";
}
