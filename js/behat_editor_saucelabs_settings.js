(function ($) {
    Drupal.behat_editor_saucelabs = Drupal.behat_editor_saucelabs || {};
    Drupal.behat_editor_saucelabs.getOs = function() {
        $( "#edit-os" ).load( "/admin/behat/saucelabs/os", function(data) {
            var option_list = jQuery.parseJSON(data);
            var os_list_unique = [];
            $('body').data("sauce_options", option_list);
            for(var i = 0; i < option_list['os'].length; i++) {
                var os_name = option_list['os'][i]['os'];
                os_list_unique[os_name] = os_name;
            }
            for(var key in os_list_unique) {
                var nice_name = os_list_unique[key];
                $('#edit-os').append($("<option />").val(nice_name).text(nice_name));
                if(nice_name == 'Windows 2012') {
                    $('#edit-os option[value="Windows 2012"]').attr('selected', 'selected');
                    Drupal.behat_editor_saucelabs.getBrowser(nice_name);
                }
            }
        });
    };

    Drupal.behat_editor_saucelabs.getOsMulti = function() {
        $( "#edit-multi" ).load( "/admin/behat/saucelabs/os", function(data) {
            var option_list = jQuery.parseJSON(data);
            var os_list_unique = [];
            $('body').data("sauce_options", option_list);
            for(var i = 0; i < option_list['os'].length; i++) {
                var os_name = option_list['os'][i]['os'];
                os_list_unique[os_name] = os_name;
            }
            for(var key in os_list_unique) {
                var nice_name = os_list_unique[key];
                $('#edit-multi').append($("<optgroup label='"+nice_name+"' />").val(nice_name).text(nice_name));
                Drupal.behat_editor_saucelabs.getBrowserMulti(nice_name);
            }
        });
    };

    Drupal.behat_editor_saucelabs.api_info = function(job_id) {
        var session_id = job_id;
        var user_name,
            api_key;
        if(Drupal.settings.behat_editor_saucelabs) {
            user_name = Drupal.settings.behat_editor_saucelabs.user;
            api_key = Drupal.settings.behat_editor_saucelabs.token;
        }
        var api = {}
        api.user_name = user_name;
        api.token = api_key;
        return api;
    };

    Drupal.behat_editor_saucelabs.getBrowserMulti = function(os) {
        var option_list = $('body').data("sauce_options", option_list);
        for(var i = 0; i < option_list['os'].length; i++) {
            var os_name = option_list['os'][i]['os'];
            if(os_name == os) {
                var browser_name = option_list['os'][i]['long_name'];
                var api_name = option_list['os'][i]['api_name'];
                var short_version = option_list['os'][i]['short_version'];
                if($('#edit-multi optgroup[label="'+os_name+'"] option[value="'+api_name+'|'+short_version+'"').val() === undefined) {
                    $('#edit-multi optgroup[label="'+os_name+'"]').append($("<option />").val(api_name+'|'+short_version).text(browser_name + ' - ' + short_version + ' (selenium_name: '+api_name+')'));
                    if(os_name == 'Windows 2012' && browser_name == 'Internet Explorer') {
                        $('#edit-multi optgroup[label="'+os_name+'"] option[value="'+api_name+'|'+short_version+'"]').attr('selected', 'selected');
                    }
                }
            }
        }
    };

    Drupal.behat_editor_saucelabs.getBrowser = function(os) {
        $('#edit-browser').empty();
        var option_list = $('body').data("sauce_options", option_list);
        for(var i = 0; i < option_list['os'].length; i++) {
            var os_name = option_list['os'][i]['os'];
                if(os_name == os) {
                    var browser_name = option_list['os'][i]['long_name'];
                    var api_name = option_list['os'][i]['api_name'];
                    var short_version = option_list['os'][i]['short_version'];
                    if($('#edit-browser option[value="'+api_name+'|'+short_version+'"').val() === undefined) {
                        $('#edit-browser').append($("<option />").val(api_name+'|'+short_version).text(browser_name + ' - ' + short_version + ' (selenium_name: '+api_name+')'));
                    }
                }
        }
    };

    Drupal.behaviors.behat_editor_saucelabs = {};
    Drupal.behaviors.behat_editor_saucelabs.attach = function(context) {
        $('#edit-multi').empty();
        Drupal.behat_editor_saucelabs.getOsMulti();
        Drupal.behat_editor_saucelabs.getOs();
        $('#edit-os').on('change', function(){
            var selectedOs = $("option:selected", this).val();
            Drupal.behat_editor_saucelabs.getBrowser(selectedOs);
        });
    }



})(jQuery);

