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
            'javascript' => '1 if you want to run javascript based tests 0 if not. Javascript means you are running this locally.',
            'tag' => 'Add tag to only run test on. Eg @anonymous',
            'profile' => 'The behat.yml file has profiles. Default etc. You can call one here or blank = default',
            'user settings sid' => 'The user settings sid you would like to run.',
            'pass fails output' => 'Instead of a report pass 1 for fail 0 for pass',
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
    if(func_num_args() > 2) {
        $javascript = func_get_arg(2);
    } else {
        $javascript = 0;
    }

    if(func_num_args() > 3) {
        $tag = func_get_arg(3);
    } else {
        $tag = '';
    }

    if(func_num_args() > 4) {
        $profile = func_get_arg(4);
    } else {
        $profile = 'default';
    }

    if(func_num_args() > 5) {
        $usid = func_get_arg(5);
    } else {
        $usid = 0;
    }

    if(func_num_args() > 6) {
        $pass_fail = func_get_arg(6);
    } else {
        $pass_fail = 0;
    }
    composer_manager_register_autoloader();

    $file = new Drupal\BehatEditor\File(array(), $module, $filename, FALSE);
    $file_object = $file->get_file_info();

    $run = new Drupal\BehatEditorSauceLabs\BehatEditorSauceLabsRun($file_object);
    print "Running Tests...\n";
    //set default browser and os

    $output = $run->execDrush($javascript, $tag, $profile, array('base_url_usid' => $usid, 'base_url_gsid' => 0, 'os_version' => 'Windows 2012', 'browser_version' => 'firefox'));
    $results = str_replace(array("    ", "---- Feature", "::: Scenario", "::: Background"), array("\n", "\n---- Feature", "\n::: Scenario", "\n::: Background"), drush_html_to_text($output['output_array']));
    //@todo
    //working on a way to pass fails or pass
    //to CI client
    if($pass_fail) {
            drush_print("This is the 0/1 result " . $output['response']);
        if($output['response'] == 1) {
            drush_print($results);
            exit(1);
        } else {
            drush_print($results);
            return $output['response'];
        }
    } else {
        return drush_print($results);
    }
}

//@todo add profile switch as well
//@todo fix this it has fell behind other code
function drush_behat_editor_behat_run_sauce_folder() {
    print "Running Tests...\n";
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
