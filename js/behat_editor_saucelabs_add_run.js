(function ($) {


    Drupal.behat_editor_saucelabs = Drupal.behat_editor_saucelabs || {};


    Drupal.behaviors.behat_editor_saucelabs_run = {
        attach: function (context) {
            $('a#watch-video', context).on('click', function(e){
                e.preventDefault();
                var job_id = $(this).data('job-id');
                Drupal.behat_editor_saucelabs.video(job_id);
                $('div#slPlayer div.video').empty();
                var player = $('a#player').html();
                $(player).appendTo('div#slPlayer div.video');
            });

            //@todo get live out and replace as it should be
            $('a#sl-modal-iframe-button', context).live('click', function(e){
                e.preventDefault();
                $('#slIframeModal', context).modal('toggle').css({'margin': 'auto'})
            });


            $('a.sauce').click(function(e){
                var token = Drupal.behat_editor.get_token();
                e.preventDefault();
                if(!$(this).hasClass('disabled')) {
                    Drupal.behat_editor_saucelabs.cleanup();
                    var scenario = $('ul.scenario:eq(0) > li').not('.ignore');
                    var url = $('a.run').attr('href');
                    var filename = $('input[name=filename]').val();
                    var action = 'create';
                    var module = $('a.add').data('module');
                    var service_path = [module, filename];
                    var base_url_usid = $('select#edit-users option:selected').val();
                    var base_url_gsid = $('select#edit-group option:selected').val();
                    var multi_browser_os = Drupal.behat_editor.get_selected_os_browser($('#edit-multi-os-browser'));
                    var os_version = $('select#edit-os option:selected').val();
                    var browser_version = $('select#edit-browser option:selected').val();
                    var scenario_array = Drupal.behat_editor.make_scenario_array(scenario);
                    var parameters = {
                        "scenario": scenario_array,
                        "settings": {
                            "base_url_usid": base_url_usid,
                            "base_url_gsid": base_url_gsid,
                            "os_version": os_version,
                            "browser_version": browser_version,
                            "path": service_path,
                            "filename": filename,
                            "module": module,
                            "action": action,
                            "context": 'behat_run_saucelabs',
                            "multi_browser_os": multi_browser_os
                        }
                    };

                    var latestId = '';
                    var data = {};
                    //@todo use the default run end point
                    var getID = $.getJSON('/admin/behat/saucelabs/jobs', function(data){
                        latestId = data.latest_id;
                        Drupal.behat_editor_saucelabs.saucelabs_check(1, latestId);
                        //Drupal.behat_editor.run_actions('POST', token, parameters, url, true, true, context);
                        //@TODO work this below code so it works in the above function like behat_editor_run.js does
                        Drupal.behat_editor_saucelabs.run_test(token, url, parameters, context);
                    });
                }
            });
        }
    };
})(jQuery);