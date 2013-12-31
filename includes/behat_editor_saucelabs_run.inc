<?php
use Drupal\BehatEditorSauceLabs;

function behat_editor_saucelabs_run($module, $filename) {
    module_load_include('inc', 'behat_editor', 'includes/behat_editor_run');

    composer_manager_register_autoloader();

    if($_REQUEST['method'] == 'view-mode') {
        //@todo include these in autoloader
        //  since all functions are in a class now

        if (!class_exists('Drupal\BehatEditorSauceLabs\BehatEditorSauceLabsRun')) {
            $message = t('BehatEditorSauceLabsRun not found.');
            throw new \RuntimeException($message);
        }

        $settings = $_REQUEST['settings'];
        $file = new Drupal\BehatEditor\FileController();
        $params = array(
            'service_path' => $settings['path'],
            'module' => $settings['module'],
            'filename' => $settings['filename'],
            'action' => 'run'
        );

        $file_object = $file->show($params);
        $res = new Drupal\BehatEditorSauceLabs\BehatEditorSauceLabsRun($file_object);

        $run_test_response = $res->exec(FALSE, $settings);
        //Check the Response from Running the Tests
        if($run_test_response['rid']) {
            $results = $res->generateReturnPassOutput();
            drupal_json_output($results);
            exit();
        } else {
            $results = $res->generateReturnFailOutput();
            drupal_json_output($results);
            exit();
        }
    }
    if($_REQUEST['method'] == 'create-mode') {
        if (!class_exists('Drupal\BehatEditorSauceLabs\BehatEditorSauceLabsRun')) {
            $message = t('BehatEditorSauceLabsRun not found.');
            throw new \RuntimeException($message);
        }
        $settings = $_REQUEST['settings'];

        $file = new Drupal\BehatEditor\FileController();
        $action = 'save';
        if(isset($settings['action'])) {
            $action = $settings['action'];
        }

        $params = array(
            'service_path' => $settings['path'],
            'module' => $settings['module'],
            'filename' => $settings['filename'],
            'action' =>  $action,
            'scenario' => $_REQUEST['scenario'],
            'parse_type' => 'file',
        );
        $response = $file->save($params);

        if($response['file'] != FALSE){
            $res = new Drupal\BehatEditorSauceLabs\BehatEditorSauceLabsRun($file->show($params));
            $run_test_response = $res->exec(FALSE, $settings);
            if($run_test_response['rid']) {
                $results = $res->generateReturnPassOutput();
                drupal_json_output($results);
                exit();
            } else {
                $results = $res->generateReturnFailOutput();
                drupal_json_output($results);
                exit();
            }
            //Issue Creating File
        } else {
            drupal_json_output(array('message' => $response['message'], 'file' => array('message' => $response), 'error' => 1));
            exit();
        }
    }

}

