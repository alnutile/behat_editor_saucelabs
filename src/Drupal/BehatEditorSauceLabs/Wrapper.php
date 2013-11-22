<?php

namespace Drupal\BehatEditorSauceLabs;
use WebDriver\SauceLabs\SauceRest;

class Wrapper {
    public $username = '';
    public $api = '';

    public function __construct($username, $api) {
        $this->username = $username;
        $this->api = $api;
    }

    public function connect() {
        $res = new SauceRest($this->username, $this->api);
        return $res;
    }

    public function connectTest() {
        $res = self::connect();
        return $res->getAccountDetails($this->username);
    }

    public function jobsSummary() {
        $res = self::connect();
        $jobs = $res->getJobs(1);
        $jobs_trimmed = array_slice($jobs, 0, 5);
        $latest_id = $jobs[0]['id'];
        $latest_job = $jobs[0];
        return array('count' => count($jobs), 'latest_id' => $latest_id, 'jobs' => $jobs_trimmed, 'latest_job' => $latest_job);
    }

    public function job($job_id) {
        $res = self::connect();
        $job = $res->getJob($job_id);
        return array('job' => $job);
    }

    public function getOs() {
        $res = self::connect();
        $browsers = $res->getBrowsers('webdriver');
        return array('os' => $browsers);
    }

    public function getBrowser($os){
        return drupal_map_assoc(array(1, 2, 3));
    }
}