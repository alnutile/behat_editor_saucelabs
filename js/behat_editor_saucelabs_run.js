(function ($) {
    //@TODO see behat_editor_add_run.js for how this should be reworked.
    //  ideally it will just use the run endpoint behat offers passing
    //  the context behat_run_saucelabs as needed

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
                //Drupal.behat_editor.buttons('disable');
                e.preventDefault();
                if(!$(this).hasClass('disabled')) {
                    Drupal.behat_editor_saucelabs.cleanup();
                    var method = 'view-mode';
                    if ($('ul.scenario').attr('data-mode')) {
                        method = $('ul.scenario').data('mode');
                    }
                    if ( $('#test-textbox').length ) {
                        var scenario = Drupal.ace.editor.getValue();
                        var scenario_array = scenario.split("\n");
                    } else {
                        var scenario = $('ul.scenario:eq(0) > li').not('.ignore');
                        var scenario_array = Drupal.behat_editor.make_scenario_array(scenario);
                    }
                    var base_url_usid = $('select#edit-users option:selected').val();
                    var base_url_gsid = $('select#edit-group option:selected').val();
                    var multi_browser_os = Drupal.behat_editor.get_selected_os_browser($('#edit-multi-os-browser'));
                    var os_version = $('select#edit-os option:selected').val();
                    var browser_version = $('select#edit-browser option:selected').val();
                    var url_args = window.location.pathname;
                    var url_args_array = url_args.split('/');
                    var service_path = url_args_array.slice(4, url_args_array.length);
                    var module = url_args_array[4];
                    var filename = url_args_array[url_args_array.length - 1];
                    var parameters = {
                        "method": method,
                        "scenario[]": scenario_array,
                        "settings": {
                            "base_url_usid": base_url_usid,
                            "base_url_gsid": base_url_gsid,
                            "os_version": os_version,
                            "browser_version": browser_version,
                            "multi_browser_os": multi_browser_os,
                            "module": module,
                            "filename": filename,
                            "path": service_path,
                            "context": 'behat_run_saucelabs'
                        }
                    };
                    var url = $(this).attr('href');
                    var urlFilename = url + filename;
                    var latestId = '';
                    var data = {};
                    //@todo use the default run end point
                    var getID = $.getJSON('/admin/behat/saucelabs/jobs', function(data){
                        latestId = data.latest_id;
                        Drupal.behat_editor_saucelabs.saucelabs_check(1, latestId);
                        $.post(url + filename, parameters, function(data){
                            results = data;
                            if($('#past-results-table').length) {
                                callbacks = ["Drupal.behat_editor.output_results(results, 'row')", "Drupal.behat_editor.results_modal(context)"];
                                Drupal.behat_editor.get_results(context, callbacks);
                            };
                            Drupal.behat_editor.renderMessage(data);
                        }, "json");
                    });
                }
            });
        }
    };
})(jQuery);