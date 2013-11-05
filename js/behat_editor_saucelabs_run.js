(function ($) {
    Drupal.behat_editor_saucelabs = {};
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
                Drupal.behat_editor.renderMessageCustom('New SauceLabs job info id ' +id+ ' @ ' +url+ '. Status of the job is "' +status+'"');
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
            console.log(data.job);
            var status = progress[data.job.status];
            if(run === 0) {
                if($('div.sl-progress').length) {
                    $('div.sl-progress').fadeOut().remove();
                }
                var message = "<div class='alert alert-info sl-progress'>";
                message += "<h3>Your Saucelabs job is in progress</h3>";
                message += '<div class="progress progress-striped active">';
                message += '<div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="'+status+'" aria-valuemin="0" aria-valuemax="100" style="width: '+status+'%">';
                message += '</div></div></div>';
                $('#messages-behat').append(message);
            } else {
                $('div.sl-progress div.progress-bar-info').attr('aria-valuenow', status);
                $('div.sl-progress div.progress-bar-info').css('width', status +'%');
            }


            if(data.job.status != 'complete') {
                window.setTimeout(function() { Drupal.behat_editor_saucelabs.getJobInfo(job_id, 1); },2000);
            };
            if(data.job.status == 'complete') {
                $('div.sl-progress h3').fadeOut('slow').text("SauceLabs is now 100% complete").fadeIn('slow');
            };
        });
    }

    Drupal.behaviors.behat_editor_saucelabs_run = {
        attach: function (context) {
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
                    var parameters = {
                        "method": method,
                        "scenario[]": scenario_array
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
                            Drupal.behat_editor.renderMessage(data);
                        }, "json");
                    });
                }
            });
        }
    };


})(jQuery);