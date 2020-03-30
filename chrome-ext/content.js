
//TODO: identify key words, use regex etc to capture certain content from facebook page
//TODO: search bangla font?
//the following method detects one instance and alerts, TODO: multiple instance of the same keyword?

if($("*:contains('Corona')").length > 0)
    alert('found Covid-19 related news');
