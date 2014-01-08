<?php

namespace Drupal\BehatEditorSauceLabs;
use Drupal\BehatEditor;

class BehatEditorSauceLabsRun extends BehatEditor\BehatEditorRun {

    public function __construct($file_object) {
        parent::__construct($file_object);
        $path = drupal_get_path('module', 'behat_editor_saucelabs');
        $this->yml_path = drupal_realpath($path) . '/behat/behat.yml';
    }


    /**
     * @todo
     *  this might not be needed any more if it could just use the parent::exec
     *  since the rewrite of the yml work it might be possible now
     *
     * @param bool $javascript
     * @param array $settings
     * @param string $context1
     * @return array
     */
    public function exec($javascript = FALSE, $settings = array(), $context1 = 'behat_run_saucelabs') {
        composer_manager_register_autoloader();
        if($javascript == TRUE) {
            $tags = '';
        } else {
            $tags = "--tags '~@javascript'";
        }
        $this->tags = $tags;
        $this->settings = $settings;

        $command = parent::behatCommandArray();

        //@todo move this into a shared method for exec and execDrush
        $this->settings['context'] = $context1;

        $behat_yml_path = new BehatEditor\GenerateBehatYml($this->settings);
        $this->behat_yml = $behat_yml_path->writeBehatYmlFile();

        $saved_settings['behat_yml'] = $behat_yml_path->behat_yml;
        $saved_settings['sid'] = $this->settings;

        $command['config'] = "--config=\"$this->behat_yml\"";
        $command['tags'] = '';
        $command['profile'] = "--profile=saucelabs";
        drupal_alter('behat_editor_command', $command, $context1);
        $command = implode(' ', $command);

        exec($command, $output, $return_var);
        $behat_yml_path->deleteBehatYmlFile();

        $results = new BehatEditor\Results();
        $output = $results->prepareResultsAndInsert($output, $return_var, $settings, $this->filename, $this->module);
        $this->clean_results = $output['clean_results'];
        $this->rid = $output['rid'];

        return array('response' => $return_var, 'output_file' => $this->clean_results, 'output_array' =>  $this->clean_results, 'rid' => $this->rid);
    }

    /**
     * @todo merge this into exec
     *
     * @param bool $javascript
     * @param bool $tag_include
     * @param string $profile
     * @return array
     */
    public function execDrush($javascript = FALSE, $tag_include = FALSE, $profile = 'default', $settings = array(), $context1 = 'behat_run_saucelabs') {
        if($javascript == TRUE) {
            $tags_exclude = '';
        } else {
            $tags_exclude = "--tags '~@javascript'";
        }

        if($tag_include) {
            $tag_include = "--tags '" . $tag_include . "'";
        } else {
            $tag_include = '';
        }
        $this->tags = "$tag_include $tags_exclude";
        $this->settings = $settings;

        $command = self::behatCommandArray();

        //@todo move this into a shared method for exec and execDrush
        $this->settings['context'] = $context1;
        $behat_yml_path = new BehatEditor\GenerateBehatYml($this->settings);
        $this->behat_yml = $behat_yml_path->writeBehatYmlFile();


        $saved_settings['behat_yml'] = $behat_yml_path->behat_yml;
        $saved_settings['sid'] = $this->settings;
        $command['config'] = "--config=\"$this->behat_yml\"";
        $context1 = 'behat_run_saucelabs';
        drupal_alter('behat_editor_command', $command, $context1);
        //$command['format'] = '--format=pretty';

        //Since this is drush I am assuming
        //  the user passed a profile
        if($profile !== 0) {
            $command['profile'] = "--profile=$profile";
        }
        //Forcing this to be SL
        $command['profile'] = "--profile=saucelabs";
        $command = implode(' ', $command);
        exec($command, $output, $return_var);

        $behat_yml_path->deleteBehatYmlFile();

        $results = new BehatEditor\Results();
        $output = $results->prepareResultsAndInsert($output, $return_var, $settings, $this->filename, $this->module);
        $this->clean_results = $output['clean_results'];
        $this->rid = $output['rid'];

        return array('response' => $return_var, 'output_file' => $this->clean_results, 'output_array' =>  $this->clean_results, 'rid' => $this->rid);
    }

}
