<?php

namespace Drupal\BehatEditorSauceLabs;
use Drupal\BehatEditor\BehatEditorRun;

class BehatEditorSauceLabsRun extends BehatEditorRun {

    public function __construct($file_object) {
        parent::__construct($file_object);
        $path = drupal_get_path('module', 'behat_editor_saucelabs');
        $this->yml_path = drupal_realpath($path) . '/behat/behat.yml';
    }
//
//    public function exec() {
//        exec("cd $this->behat_path && ./bin/behat --config=\"$this->yml_path\" --no-paths  --profile=Webdriver-saucelabs  $this->absolute_file_path", $output);
//        $this->file_array = $output;
//        $response = is_array($output) ? 0 : 1;
//        parent::saveResults($output);
//        return array('response' => $response, 'output_file' => $this->output_file, 'output_array' => $output);
//    }
//

    public function exec($javascript = FALSE) {
        if($javascript == TRUE) {
            $tags = '';
        } else {
            $tags = "--tags '~@javascript'";
        }
        $command = "cd $this->behat_path && ./bin/behat --config=\"$this->yml_path\" --no-paths  --profile=Webdriver-saucelabs  $this->absolute_file_path";
        $context1 = 'behat_run_saucelabs';
        drupal_alter('behat_editor_command', $command, $context1);
        exec($command, $output, $return_var);
        $this->file_array = $output;
        $response = is_array($output) ? 0 : 1;
        self::saveResults($output, $return_var);
        return array('response' => $response, 'output_file' => $this->output_file, 'output_array' => $output);
    }

//
//    public function execDrush() {
//        exec("cd $this->behat_path && ./bin/behat --config=\"$this->yml_path\" --no-paths  --profile=Webdriver-saucelabs  $this->absolute_file_path", $output);
//        parent::saveResults($output);
//        return $output;
//    }

}