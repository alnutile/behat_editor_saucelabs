<?php

/**
 * Implements hook_form().
 *
 * Create the form to add your Saucelab info
 *
 * @param $form
 * @param $form_state
 * @return mixed
 */
function behat_editor_saucelabs_admin_form($form, &$form_state) {
        $form['behat_editor_saucelabs_username'] = array(
            '#type' => 'textfield',
            '#title' => t('SauceLabs Username'),
            '#description' => t('This is your username. Not your email'),
            '#default_value' => variable_get('behat_editor_saucelabs_username', ''),
        );

        $form['behat_editor_saucelabs_api'] = array(
            '#type' => 'textfield',
            '#title' => t('SauceLabs API Key'),
            '#description' => t('You can see on this on the left lower side of the Dashboard or Account Page'),
            '#default_value' => variable_get('behat_editor_saucelabs_api', ''),
        );

        $form['behat_editor_saucelabs_hide_run'] = array(
            '#type' => 'checkbox',
            '#title' => t('Hide default Run Test button from user?'),
            '#description' => t('This will force the user to always run on Saucelabs'),
            '#default_value' => variable_get('behat_editor_saucelabs_hide_run', 0),
        );

        return system_settings_form($form);
}