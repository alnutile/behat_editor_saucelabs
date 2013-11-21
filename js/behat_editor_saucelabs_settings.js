(function ($) {

    Drupal.behat_editor_saucelabs.getOs = function() {
        $( "#edit-os" ).load( "/admin/behat/saucelabs/os", function(data) {
            var option_list = jQuery.parseJSON(data);
            $('body').data("sauce_options", option_list);
            for(var i = 0; i < option_list['os'].length; i++) {
                var os_name = option_list['os'][i]['os'];
                if($('#edit-os option[value="'+os_name+'"').val() === undefined) {
                    $('#edit-os').append($("<option />").val(os_name).text(os_name));
                }
            }
            Drupal.behat_editor_saucelabs.getBrowser('Windows 2012');
        });
    };

    Drupal.behat_editor_saucelabs.getBrowser = function(os) {
        $('#edit-browser').empty();
        var option_list = $('body').data("sauce_options", option_list);
        for(var i = 0; i < option_list['os'].length; i++) {
            var os_name = option_list['os'][i]['os'];
            if(os_name == os) {
                var browser_name = option_list['os'][i]['long_name'];
                if($('#edit-browser option[value="'+browser_name+'"').val() === undefined) {
                    $('#edit-browser').append($("<option />").val(browser_name).text(browser_name));
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

