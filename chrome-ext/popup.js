document.addEventListener('DOMContentLoaded', onLoad);


function onLoad() {

    loadPlugin();
}


function loadPlugin() {
    chrome.storage.sync.get(['customLinks', 'pluginEnabled' ,'preferences'], function(result) {
        console.log('Value customLinks = ' + result.customLinks);
        $('#custom_link_textarea').val(result.customLinks.join("\n"));

        console.log('Value pluginEnabled = ' + result.pluginEnabled);
        $('#plugin_status').text(result.pluginEnabled ? "Enabled" : "Disabled");

        if( result.preferences == undefined){
        	result.preferences =  {};
        }
        console.log('Value preferences = ' + result.preferences);
        $('#use_central_database').prop('checked', result.preferences.useCentralDatabase);

    });

    $('#custom_link_save_button').click(function() {
        saveCustomLinks();
    });

    $('#plugin_status_button').click(function() {
        chrome.storage.sync.get(['pluginEnabled'], function(result) {
            togglePlugin(!result.pluginEnabled);
        });
    });


    $('#use_central_database').change(function(){
    	savePreferences();
    });
}

function togglePlugin(pluginEnabled) {
    $('#plugin_status').text(pluginEnabled ? "Enabled" : "Disabled");

    chrome.storage.sync.set({ pluginEnabled: pluginEnabled }, function() {
        console.log('Set pluginEnabled = ' + pluginEnabled);
    });
}

function saveCustomLinks() {

    customLinks = $('#custom_link_textarea')
        .val()
        .split("\n")
        .map(s => s.trim())
        .filter(s => s.length > 0);
    $('#custom_link_textarea').val(customLinks.join("\n"));
    chrome.storage.sync.set({ customLinks: customLinks }, function() {
        console.log('Set customLinks = ' + customLinks);
        $('#custom_link_save_result').text("Saved");
        $('#custom_link_save_result').show().fadeOut(2000);
    });
}


function savePreferences() {

    preferences = {
        useCentralDatabase: $('#use_central_database').is(":checked")
    }

    chrome.storage.sync.set({ preferences: preferences }, function() {
        console.log('preferences ', preferences);
    });
}