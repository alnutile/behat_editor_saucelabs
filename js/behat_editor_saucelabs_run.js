(function ($) {


    Drupal.behat_editor_saucelabs = Drupal.behat_editor_saucelabs || {};
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
                Drupal.behat_editor.renderMessageCustom('New SauceLabs job info id ' +id+ ' @ ' +url+ '. Status of the job is "' +status+'"', 'success');
                Drupal.behat_editor_saucelabs.getJobInfo(id, 0);
            } else {
                Drupal.behat_editor.renderMessageCustom('We have reached the mx tries  '+ tries + ' of ' + max_tries + '<br>' +
                    'SauceLabs has not responded with a new ID. That does not mean the test did not work though. ' +
                    'Please review your account <a href="https://saucelabs.com/account" target="_blank">Dashboard</a>' +
                    ' for SauceLabs.', 'info');
            }
        }
    };

    Drupal.behat_editor_saucelabs.video = function(job_id) {
        var session_id = job_id;
        var user_name = 'alfrednutile2';
        var api_key = '3e3289cc-b519-43c3-8393-d61438bb20f2';
        //http://saucelabs.com/video-embed/a09c982f3dcb43459d658a35da21266b.js?username=alfrednutile2&access_key=3e3289cc-b519-43c3-8393-d61438bb20f2
        //var video_script = '<script type="text/javascript" src="http://saucelabs.com/video-embed/'+session_id+'.js?username='+user_name+'&access_key='+api_key+'"/></script>';
        //return video_script;
    };

    Drupal.behat_editor_saucelabs.getJobInfo = function(job_id, run) {
        $.getJSON('/admin/behat/saucelabs/job/' + job_id, function(data){
            var progress = new Array();
            progress["new"] = '25';
            progress["queued"] = '50';
            progress["in progress"] = '75';
            progress["complete"] = '100';
            var status = progress[data.job.status];

            if(run === 0) {
                var id = data.job.id;
                var script_video = Drupal.behat_editor_saucelabs.video(id);
                if($('div.sl-progress').length) {
                    $('div.sl-progress').fadeOut().remove();
                }
                var url = '<a href="https://saucelabs.com/tests/'+ id + '" target="_blank" class="btn btn-success">here</a>';

                var message = "<div class='alert alert-info sl-progress'>";
                message += "<h3>Your Saucelabs job is in progress</h3>" +
                    "<small>a video will be available on this page when done</small><br>" +
                    "<small>but you can see the job "+url+" as if you have an account</small>";
                message += '<div class="progress progress-striped active">';
                message += '<div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="'+status+'" aria-valuemin="0" aria-valuemax="100" style="width: '+status+'%">';
                message += '</div>';
                message += '</div>';
                //message += '<a id="watch-video" href="#" data-toggle="modal" data-target="#slVideo" data-job-id="'+id+'">watch the video</a>';
                message += '</div>';
                $('#messages-behat').append(message);

            } else {
                $('div.sl-progress div.progress-bar-info').attr('aria-valuenow', status);
                $('div.sl-progress div.progress-bar-info').css('width', status +'%');
            }

            console.log(data);

            if(data.job.status != 'complete') {
                window.setTimeout(function() { Drupal.behat_editor_saucelabs.getJobInfo(job_id, 1); },2000);
            };

            if(data.job.status == 'complete') {
                $('div.sl-progress h3').fadeOut('slow').text("SauceLabs is now 100% complete").fadeIn('slow');
                var video_url = "https://saucelabs.com/video-embed/"+job_id+".js?username=alfrednutile2&access_key=3e3289cc-b519-43c3-8393-d61438bb20f2";
                var video_url = "https://saucelabs.com/jobs/"+job_id+"/video.flv?username=alfrednutile2&access_key=3e3289cc-b519-43c3-8393-d61438bb20f2";
                var video = '<a href="'+video_url+'" ' +
                    'style="display:block;width:520px;height:330px"' +
                    'id="sl-video"></a>';
                $('#messages-behat').append(video);
                //data.job.video_url
                $('#messages-behat').append('<br></a><a class="btn btn-warning btn-lg"  role="button" id="download-video" href="'+data.job.video_url+'" target="_blank" data-job-id="'+id+'">download video</a>');
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

            $('a.sauce').click(function(e){
                //Drupal.behat_editor.buttons('disable');
                e.preventDefault();
                if(!$(this).hasClass('disabled')) {
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