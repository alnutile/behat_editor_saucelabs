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
        Drupal.behat_editor_saucelabs.getOs();
        $('#edit-os').on('change', function(){
            var selectedOs = $("option:selected", this).val();
            Drupal.behat_editor_saucelabs.getBrowser(selectedOs);
        });
    }



})(jQuery);

