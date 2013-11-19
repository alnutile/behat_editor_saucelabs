<?php

namespace Drupal\BehatEditorSauceLabs;
use Drupal\BehatEditor;

class BehatEditorSauceLabsRun extends BehatEditor\BehatEditorRun {

    public function __construct($file_object) {
        parent::__construct($file_object);
        $path = drupal_get_path('module', 'behat_editor_saucelabs');
        $this->yml_path = drupal_realpath($path) . '/behat/behat.yml';
    }

    public function exec($javascript = FALSE, $settings = array()) {
        composer_manager_register_autoloader();
        if($javascript == TRUE) {
            $tags = '';
        } else {
            $tags = "--tags '~@javascript'";
        }
        $command = parent::behatCommandArray($tags);
        $behat_yml_path = new BehatEditor\GenerateBehatYml($settings);
        $behat_yml = $behat_yml_path->writeBehatYmlFile();
        $saved_settings['behat_yml'] = $behat_yml_path->behat_yml;
        $saved_settings['sid'] = $settings;

        $command['config'] = "--config=\"$behat_yml\"";
        $command['tags'] = '';
        $command['profile'] = "--profile=saucelabs";

        $command = implode(' ', $command);
        exec($command, $output, $return_var);
        $this->file_array = $output;
        $behat_yml_path->deleteBehatYmlFile();
        $rid = self::saveResults($output, $return_var, $saved_settings);
        return array('response' => $return_var, 'output_file' => $this->output_file, 'output_array' => $output, 'rid' => $rid);
    }

    /**
     * @todo merge this into exec
     *
     * @param bool $javascript
     * @param bool $tag_include
     * @param string $profile
     * @return array
     */
    public function execDrush($javascript = FALSE, $tag_include = FALSE, $profile = 'default', $settings = array()) {
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
        //@todo remove tag arg in behatCommandArray
        $command = parent::behatCommandArray($tags_exclude);
        $behat_yml_path = new BehatEditor\GenerateBehatYml($settings);
        $behat_yml = $behat_yml_path->writeBehatYmlFile();
        $saved_settings['behat_yml'] = $behat_yml_path->behat_yml;
        $saved_settings['sid'] = $settings;

        $command['config'] = "--config=\"$behat_yml\"";
        $command['tags'] = '';
        $command['profile'] = "--profile=saucelabs";

        $command = implode(' ', $command);
        exec($command, $output, $return_var);
        $this->file_array = $output;
        $behat_yml_path->deleteBehatYmlFile();
        $rid = self::saveResults($output, $return_var, $saved_settings);
        return array('response' => $return_var, 'output_file' => $this->output_file, 'output_array' => $output, 'rid' => $rid);
    }

}
