(function ($) {
    Drupal.behat_editor_saucelabs = Drupal.behat_editor_saucelabs || {};


    var os_browser =
        {
            'win12r2': {
                'os': 'Windows 8.1',
                'browsers':
                    [
                        {
                            'nicename': 'IE 11',
                            'saucename': 'internet explorer|11'
                        },
                        {
                            'nicename': 'Firefox 26',
                            'saucename': 'firefox|26'
                        },
                        {
                            'nicename': 'Firefox 25',
                            'saucename': 'firefox|25'
                        }
                    ]
            },
            'win12': {
                'os': 'Windows 8',
                'browsers':
                    [
                        {
                        'nicename': 'IE 10',
                        'saucename': 'internet explorer|10'
                        }
                    ]
            },
            'win2008': {
                'os': 'Windows 7',
                'browsers':
                    [
                        {
                            'nicename': 'IE 9',
                            'saucename': 'internet explorer|9'
                        }
                    ]
            },
            'mac10': {
                'os': 'Mac 10.8',
                'browsers':
                    [
                        {
                            'nicename': 'iPad - 6.1',
                            'saucename': 'ipad|6.1'
                        },
                        {
                            'nicename': 'iPhone - 6.1',
                            'saucename': 'iphone|6.1'
                        },
                        {
                            'nicename': 'Safari 6',
                            'saucename': 'safari|6'
                        }
                    ]
            },
            'linux': {
                'os': 'Linux',
                'browsers': [
                    {
                        'nicename': 'Google Chrome - 30',
                        'saucename': 'chrome|30'
                    },
                    {
                        'nicename': 'Android 4.3',
                        'saucename': 'android|4.3'
                    },
                    {
                        'nicename': 'Firefox 26',
                        'saucename': 'firefox|26'
                    },
                    {
                        'nicename': 'Firefox 25',
                        'saucename': 'firefox|25'
                    }
                ]
            }
        };

    Drupal.behat_editor_saucelabs.getOsSlimmedList = function() {
        $('#edit-os').empty();
        for (var key in os_browser) {
            $('#edit-os').append($("<option />").val(os_browser[key].os).text(os_browser[key].os));
        };

        $('#edit-os option[value="Windows 8.1"]').attr('selected', 'selected');
    };

    Drupal.behat_editor_saucelabs.getBrowserSlimmed = function(selectedOs) {
        $('#edit-browser').empty();
        for (var key in os_browser) {
            if(os_browser[key].os == selectedOs) {
                var selectedOsKey = key;
                var browsers = os_browser[key].browsers;
            }
        };
        for( var key in browsers) {
            var nicename = os_browser[selectedOsKey].browsers[key].nicename;
            var saucename = os_browser[selectedOsKey].browsers[key].saucename;
            $('#edit-browser').append($("<option />").val(saucename).text(nicename));
        };
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
                if($('#edit-multi-os-browser optgroup[label="'+os_name+'"] option[value="'+api_name+'|'+short_version+'"').val() === undefined) {
                    $('#edit-multi-os-browser optgroup[label="'+os_name+'"]').append($("<option />").val(api_name+'|'+short_version).text(browser_name + ' - ' + short_version + ' (selenium_name: '+api_name+')'));
                    if(os_name == 'Windows 2012' && browser_name == 'Internet Explorer') {
                        $('#edit-multi-os-browser optgroup[label="'+os_name+'"] option[value="'+api_name+'|'+short_version+'"]').attr('selected', 'selected');
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
        if($('#edit-multi-os-browser').length) {
            $('#edit-multi-os-browser').empty();
            Drupal.behat_editor_saucelabs.getOsMulti();
        }

        Drupal.behat_editor_saucelabs.getOsSlimmedList();
        Drupal.behat_editor_saucelabs.getBrowserSlimmed('Windows 8.1');

        $('#edit-os').on('change', function(){
            var selectedOs = $("option:selected", this).val();
            Drupal.behat_editor_saucelabs.getBrowserSlimmed(selectedOs);
        });
    }



})(jQuery);

