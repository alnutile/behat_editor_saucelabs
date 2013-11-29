(function ($) {


    Drupal.behat_editor_saucelabs = Drupal.behat_editor_saucelabs || {};

    Drupal.behat_editor_saucelabs.cleanup = function() {
        if($('div.sl-running')) {
            $('div.saving-tests').fadeOut().remove();
            $('div.sl-running').fadeOut();
            $('div.sl-progress').fadeOut().remove();
            $('div.sl-video-block').fadeOut().remove();
            $('a#download-video').fadeOut().remove();
            $('div.modal-iframe').fadeOut().remove();
        }
    };

    Drupal.behat_editor_saucelabs.saucelabs_check = function(tries, starting_job_id) {
        var max_tries = 10;
        tries = typeof tries !== 'undefined' ? tries : 1;
        starting_job_id = typeof starting_job_id !== 'undefined' ? starting_job_id : 0;
        $.ajax(
            {
                url: '/admin/behat/saucelabs/jobs',
                success: function(data) { Drupal.behat_editor_saucelabs.getStatus(data, tries, max_tries, starting_job_id); }
            }
        );
    };

    Drupal.behat_editor_saucelabs.getStatus = function(data, tries, max_tries, starting_job_id) {
        if(starting_job_id == 0) {
            starting_job_id = data.latest_id;
            Drupal.behat_editor.renderMessageCustom('Connecting to Saucelabs and waiting for job feedback try '+ tries + ' of ' + max_tries, 'info');
            tries++;
            Drupal.behat_editor_saucelabs.saucelabs_check(tries, starting_job_id);
        } else if (tries < max_tries && starting_job_id === data.latest_id) {
            if(tries === 1) {
                if($('div.sl-running').length) {
                    $('div.sl-running').fadeOut().remove();
                }
                var message = "<div class='alert alert-info sl-running'>";
                message += '<div>Connecting to Saucelabs and waiting for job feedback try <span class="tries">'+ tries + '</span> of ' + max_tries + '</div>';
                message += '</div>';
                $('#messages-behat').append(message);
            } else {
                $('div.sl-running span.tries').text(tries);
            }
            tries++;
            Drupal.behat_editor_saucelabs.saucelabs_check(tries, starting_job_id);
        } else {
            if(starting_job_id != data.latest_id) {
                var id = data.latest_id;
                var url = '<a href="https://saucelabs.com/tests/'+ id + '" target="_blank" class="btn btn-success">Job is here</a>';
                var status = data.latest_job.status;
                //Drupal.behat_editor.renderMessageCustom('New SauceLabs job info id ' +id+ ' @ ' +url+ '. Status of the job is "' +status+'"', 'success');
                Drupal.behat_editor_saucelabs.getJobInfo(id, 0);
            } else {
                Drupal.behat_editor.renderMessageCustom('We have reached the mx tries  '+ tries + ' of ' + max_tries + '<br>' +
                    'SauceLabs has not responded with a new ID. That does not mean the test did not work though. ' +
                    'Please review your account <a href="https://saucelabs.com/account" target="_blank">Dashboard</a>' +
                    ' for SauceLabs.', 'info');
            }
        }
    };


    Drupal.behat_editor_saucelabs.getJobInfo = function(job_id, run) {
        $.getJSON('/admin/behat/saucelabs/job/' + job_id, function(data){
            var progress = new Array();
            progress["new"] = '25';
            progress["queued"] = '50';
            progress["in progress"] = '75';
            progress["complete"] = '100';
            var status = progress[data.job.status];
            var api_info = Drupal.behat_editor_saucelabs.api_info(id);
            console.log(api_info);
            if(run === 0) {
                var id = data.job.id;

                if($('div.sl-progress').length) {
                    $('div.sl-progress').fadeOut().remove();
                }

                //Setup iframe modal
                var iframe_url = 'https://saucelabs.com/tests/'+ id;
                $('#slIframe iframe').attr('src', iframe_url);
                //$('#messages-behat').append('<br><button class="btn btn-primary btn-md" data-toggle="modal" data-target="#slIframeModal">watch video</button>');
                var iframe_button = '<div class="alert alert-info center-block modal-iframe"><a id="sl-modal-iframe-button" href="#">watch video</a></div>';

                //Setup progress bar
                var url = '<a href="https://saucelabs.com/tests/'+ id + '" target="_blank" class="btn btn-success">here</a>';
                var message = "<div class='alert alert-default sl-progress'>";
                message += "<h3>Your Saucelabs job is in progress</h3><br>";
                message += '<div class="progress progress-striped active">';
                message += '<div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="'+status+'" aria-valuemin="0" aria-valuemax="100" style="width: '+status+'%">';
                message += '</div>';
                //message += iframe_button;
                message += '</div>';
                //message += '<a id="watch-video" href="#" data-toggle="modal" data-target="#slVideo" data-job-id="'+id+'">watch the video</a>';
                message += '</div>';

                $('#messages-behat').append(message);

                $('#messages-behat').append(iframe_button);



            } else {
                $('div.sl-progress div.progress-bar-info').attr('aria-valuenow', status);
                $('div.sl-progress div.progress-bar-info').css('width', status +'%');
            }


            if(data.job.status != 'complete') {
                window.setTimeout(function() { Drupal.behat_editor_saucelabs.getJobInfo(job_id, 1); },2000);
            };

            if(data.job.status == 'complete') {
                $('div.sl-progress h3').fadeOut('slow').text("SauceLabs is now 100% complete").fadeIn('slow');
                //@todo oops this was not suppose to be left here. There is a settings call above to get these to use here
                //  remove and clean up by moving settings function into settings js file
                //var video_url = "https://saucelabs.com/video-embed/"+job_id+".js?username="+api_info.user_name+"&access_key="+api_info.token+"";
                var video_url = "https://saucelabs.com/jobs/"+job_id+"/video.flv?username="+api_info.user_name+"&access_key="+api_info.token+"";
                var video = '<div class="center-block sl-video-block">' +
                              '<a href="'+video_url+'" style="display:block;width:520px;height:330px" id="sl-video"></a>' +
                            '</div>';
                $('#messages-behat').append(video);
                //data.job.video_url
                $('#messages-behat').append('<br><a class="btn btn-success btn-md btn-block"  role="button" id="download-video" href="'+data.job.video_url+'" target="_blank" data-job-id="'+id+'">download video</a>');
                flowplayer("sl-video", Drupal.settings.behat_editor_saucelabs.flow_path);
            };
        });
    }

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
                //Drupal.behat_editor.buttons('disable');
                e.preventDefault();
                if(!$(this).hasClass('disabled')) {
                    Drupal.behat_editor_saucelabs.cleanup();
                    var method = 'view-mode';
                    if ($('ul.scenario').attr('data-mode')) {
                        method = $('ul.scenario').data('mode');
                    }
                    var scenario = $('ul.scenario:eq(0) > li').not('.ignore');
                    var scenario_array = Drupal.behat_editor.make_scenario_array(scenario);
                    var base_url_usid = $('select#edit-users option:selected').val();
                    var base_url_gsid = $('select#edit-group option:selected').val();
                    var os_version = $('select#edit-os option:selected').val();
                    var browser_version = $('select#edit-browser option:selected').val();
                    var parameters = {
                        "method": method,
                        "scenario[]": scenario_array,
                        "settings": {
                            "base_url_usid": base_url_usid,
                            "base_url_gsid": base_url_gsid,
                            "os_version": os_version,
                            "browser_version": browser_version
                        }
                    };
                    var url = $(this).attr('href');
                    var filename = $('input[name=filename]').val();
                    var urlFilename = url + filename;
                    var latestId = '';
                    var data = {};
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