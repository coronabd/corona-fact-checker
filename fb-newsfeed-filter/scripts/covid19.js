// constants and flags

const user_study_api = 'http://coronafactcheck.herokuapp.com/covid19/api/user_study_news'

$(document).ready(function() {
    var IS_FACEBOOK = false;

    var facebook_link_post_container_text_wrapper = '._6m2._1zpr.clearfix._dcs';
    //var facebook_link_post_container = '._5jmm._5pat';
    //var facebook_link_post_container_link = 'a._52c6';
    //var facebook_link_post_container_text = '._6m7._3bt9';
    var facebook_link_post_container_title = '.mbs._6m6._2cnj._5s6c';
    var facebook_link_post_container_base_url_div = '._59tj._2iau';
    //var misinfo_marker_container_fb = '._5pbx.userContent';

    var checked_link_tag = 'misinfo_checker_checked';
    var checked_link_tag_is_misinfo = 'checked_link_tag_is_misinfo';
    var checked_link_tag_not_misinfo = 'checked_link_tag_not_misinfo';
    var misinfoCount = 0;

    var misinfo_feedback_button_class = 'misinfo-checker-feedback-button';
    var facbook_shared_post_container_class = '.mtm._5pco';


    //for mobile
    var facebook_link_post_container = '._55wo._5rgr._5gh8';
    var facebook_link_post_container_link = '._4qxt';
    var facebook_link_post_container_text = '._2rbw._5tg_';
    var misinfo_marker_container_fb = '._5rgt._5nk5._5msi';


    var _handleClickbairReport = function(postData) {
        alert("Feedback received. Thanks!!");
        //will handle this API call later. Currently only alert.
        // postData.feedback = 'dislike';
        // console.log(postData);
        // $.post(API_FEEDBACK, postData)
        //     .done(function onSuccess(result) {
        //         // result = dummyData;
        //         alert("Thanks for your feedback");
        //         console.log('Feedback posted successfully');
        //     })
        //     .fail(function onError(xhr, status, error) {
        //         console.log(error);
        //     })
    };
    //
    var _getmisinfoLabelId = function(count) {
        return 'misinfoLabel_' + count;
    };
    var _getmisinfoPopupId = function(count) {
        return 'misinfoPopup_' + count;
    };
    var _getmisinfoWrapperId = function(count) {
        return 'misinfoMarkerWrapper_' + count;
    };
    //
    var _handlefeedbackButtonClick = function(postData) {
        alert("Feedback received. Thanks!!");
        // console.log(postData);
        // $.post(API_FEEDBACK, postData)
        //     .done(function onSuccess(result) {
        //         // result = dummyData;
        //         alert("Thanks for your feedback");
        //         console.log('Feedback posted successfully');
        //     })
        //     .fail(function onError(xhr, status, error) {
        //         console.log(error);
        //     })
    };
    //
    //
    var _getmisinfoInfoElement = function(data, id, postData) {
        var element = $("<div class='misinfo-marker-info-wrapper' style='font-size: 15px;'></div>");
        element.attr('id', _getmisinfoPopupId(id));

        var str = '';
        // if (data.matched_ngram && data.matched_ngram.length > 0) {
        //     str += '<b>misinfoy Language Pattern:</b>&nbsp;' + data.matched_ngram.join(", ") + "<br/>";
        // }

        str += '<b>Decision Confidence:</b>&nbsp;' + data.confidence + "<br/>";

        // if (data.similarity && data.similarity.length > 0){
        //     str += '<b>Similarity:</b>&nbsp;' + data.similarity + "<br/>" + "<hr/>"
        // }

        str += '<b>Explanation:</b><br/>' + data.explanation + "<br/>";

        str += '<b>Verified By:</b><br/>' + data.verified_by + "<br/>";

        str += '<b>Verification Link:</b><br/>' + data.verification_link;

        var info = $('<div></div>').html(str);

        // reportButtonWrapper.find('a').html('Report misinfo');
        // reportButtonWrapper.find('a').css('color', '#ff9022');

        var feedbackButton = $('<a></a>');
        feedbackButton.attr('misinfoId', id)
        feedbackButton.html('This should not be a Misinfo')
        feedbackButton.css('color', '#ff9022')

        feedbackButton.click(function(e) {
            _handlefeedbackButtonClick(postData);
        });


        var feedBackTile = $('<p>Provide Feedback</p>').addClass('provide_feedback_title');


        var likeDislikeButtons = $("<div class='light-padding-top' style='text-align: center'> </div>");


        likeDislikeButtons.append(feedBackTile);
        likeDislikeButtons.append(feedbackButton);

        info.append('<hr/>');
        info.append(likeDislikeButtons);
        element.append(info);

        return element;
    }

    var _handlemisinfoApiSuccess = function(result, node, postData) {
        misinfoCount = misinfoCount + 1;


        var ismisinfo = result.decision === 'misinfo';
        var misinfoMarker = $("<div class='misinfo-marker-span'></div>");
        misinfoMarker.attr('id', _getmisinfoLabelId(misinfoCount));

        if (ismisinfo) {
            misinfoMarker.addClass('misinfo-marker-is-misinfo');
            misinfoMarker.text('Potential Misinfo! - Click here to read more');
            var misinfoMarkerWrapper = $("<div class='misinfo-marker-wrapper'></div>");
            misinfoMarkerWrapper.attr('id', _getmisinfoWrapperId(misinfoCount));
            misinfoMarkerWrapper.append(misinfoMarker);

            var infoElement = _getmisinfoInfoElement(result, misinfoCount, postData);
            console.log("info", infoElement);

            var closeButton = $("<div class='misinfo-marker-info-close-btn'>Close</div>");
            infoElement.append(closeButton);

            closeButton.click(function(e) {
                infoElement.fadeOut('medium');
            });

            infoElement.hide();
            misinfoMarkerWrapper.append(infoElement);
            var nodeToFind = $("div[class='mtm']"); // look for div with only class = mtm; other posts had two classes --> mtm _5pco or mtm xxxx which caused multiple addition of the wrapper
            node.find(nodeToFind).before(misinfoMarkerWrapper);

            misinfoMarker.click(function(e) {
                infoElement.fadeIn('medium');
            });
        } else {
            var reportButtonWrapper = node.find('._42nr ._1mto').first().clone();
            reportButtonWrapper.attr('id', 'misinfoReportBtn');
            reportButtonWrapper.find('a').removeClass('UFILikeLink _4x9- _4x9_ _48-k');
            reportButtonWrapper.find('a').html('Report Misinfo');
            reportButtonWrapper.find('a').css('color', '#ff9022');
            reportButtonWrapper.click(function(e) {
                _handleClickbairReport(postData);
            });
            node.find('._42nr').append(reportButtonWrapper);
        }
    };


    // Function to prepare API call to the server and handle response
    var _callmisinfoApi = function(title, text, linkUrl, post, shared_post, node) {
        var postData = {
            title: title,
            text: text,
            url: linkUrl,
            post: post,
            sharedPost: shared_post
        };

        var misinfo_result = {
            "data": {
                "decision": "misinfo",
                "confidence": "0.90",
                "explanation": "Why it is misinfo?",
                "verified_by": "snoops.com",
                "verification_link": "www.verified.com"
            }
        };

        var non_misinfo_result = {
            "data": {
                "decision": "non_misinfo",
                "confidence": "0.90",
                "explanation": "Why it is misinfo?",
                "verified_by": "snoops.com",
                "verification_link": "www.verified.com"
            }
        };

        // will handle the API call later. Currently working with some dummy data.
        var random_boolean = Math.random() >= 0.7;
        _handlemisinfoApiSuccess(misinfo_result.data, node, postData);

        // if (random_boolean) {
        //   _handlemisinfoApiSuccess(misinfo_result.data, node, postData);
        // }
        // else {
        //   _handlemisinfoApiSuccess(non_misinfo_result.data, node, postData);
        // }


        // $.post(API_URL, postData)
        //     .done(function onSuccess(result) {
        //         // result = dummyData;
        //         _handlemisinfoApiSuccess(result.data, node, postData);
        //     })
        //     .fail(function onError(xhr, status, error) {
        //         console.log(error);
        //     })
    };
    //
    // var _getOriginalLinkFromFacebookLink = function(link) {
    //     var matchBegin = "php?u=";
    //     return link.substring(link.lastIndexOf(matchBegin) + matchBegin.length, link.lastIndexOf("&h="));
    // }
    //

     //After clicking the 'Possible misinfo" bar, show the information block
     var _showMisinfoMarker = function(title, text, linkUrl, post, shared_post, node) {

            var postData = {
            title: title,
            text: text,
            url: linkUrl,
            post: post,
            sharedPost: shared_post
        };

        misinfoCount = misinfoCount + 1;

        //var ismisinfo = misinfo_result.decision === 'misinfo';
        var misinfoMarker = $("<div class='misinfo-marker-span'></div>");
        misinfoMarker.attr('id', _getmisinfoLabelId(misinfoCount));


        misinfoMarker.addClass('misinfo-marker-is-misinfo');
        misinfoMarker.text('Potential Misinfo! - Click here to read more');
        var misinfoMarkerWrapper = $("<div class='misinfo-marker-wrapper'></div>");
        misinfoMarkerWrapper.attr('id', _getmisinfoWrapperId(misinfoCount));
        misinfoMarkerWrapper.append(misinfoMarker);


        //var nodeToFind = $("div[class='_1dwg _1w_m _q7o']"); // look for div with only class = mtm; other posts had two classes --> mtm _5pco or mtm xxxx which caused multiple addition of the wrapper
        var nodeToFind = $("div[class='story_body_container']");
        node.find(nodeToFind).after(misinfoMarkerWrapper);   // change mtm to _1dwg _1w_m _q7o

        misinfoMarker.click(function(e) {
            /*$.post("https://coronafactcheck.herokuapp.com/covid19/api/get_related_misinfo",{ claim: postData.post })
            .done(function onSuccess(result) {
                 console.log(result)
                 var result = result;
                 //_handlemisinfoApiSuccess(result, node, postData);
            })
            .fail(function onError(xhr, status, error) {
                   console.log(error)
            })*/
        var xmlhttp = new XMLHttpRequest();
        var url = "https://coronafactcheck.herokuapp.com/covid19/api/get_related_misinfo?claim="+postData.post;
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                serverData = JSON.parse(this.responseText);
                console.log(serverData[0]['data'])
                };
            };
        xmlhttp.open("POST", url, false);
        xmlhttp.send();

        var sim_score = serverData[0]['similarity']
        if(sim_score > 0.1){

        var misinfo_result = {
              "data": {
                "decision": serverData[0]['data']['misinfo'],
                "confidence": serverData[0]['similarity'],
                "explanation": serverData[0]['data']['truth'],
                "verified_by": serverData[0]['data']['verified_by'],
                "verification_link": serverData[0]['data']['truth_link']
              }
            };
        console.log(misinfo_result)
        var infoElement = _getmisinfoInfoElement(misinfo_result.data, misinfoCount, postData);
        console.log("info", infoElement);

        var closeButton = $("<div class='misinfo-marker-info-close-btn'>Close</div>");
        infoElement.append(closeButton);

            closeButton.click(function(e) {
                infoElement.fadeOut('medium');
            });

            infoElement.hide();
            misinfoMarkerWrapper.append(infoElement);

            infoElement.fadeIn('medium');
            }
            });

    };

    // Function to search Facebook and find all the links
    var loop = function() {
        $(facebook_link_post_container).each(function(obj) {
            var nodeObj = $(this);

            // if node has already been checked
            if (nodeObj.hasClass(checked_link_tag)) return;

            // add node checked class
            nodeObj.addClass(checked_link_tag);

            //post is the status posted by a user

            var post = nodeObj.find(misinfo_marker_container_fb).text();
            // if (post) console.log('Post', post);

            //shared post is the status user shared from another user

            var shared_post = nodeObj.find(facbook_shared_post_container_class).find('p').text();
            // if (shared_post) console.log('Shared Post', shared_post);

            var linkObj = nodeObj.find(facebook_link_post_container_link);
            linkObj.mouseenter();

            // link is the url of the shared content (news article, video etc.)
            var link = linkObj.attr('href');



            // title is the headline of a news article or video
            // text is the subtitle or thumbnail text
            var text = nodeObj.find(facebook_link_post_container_text).text();
            var title = nodeObj.find(facebook_link_post_container_title).text();


            // if (link) console.log('link', link);
            // if (text) console.log('text', text);
            // if (title) console.log('title', title);
            linkObj.mouseleave();
            //_callmisinfoApi(title, text, link, post, shared_post, nodeObj);
            if(post.includes('Coronavirus') || post.includes('করোনা')|| post.includes('corona')){
            _showMisinfoMarker(title, text, link, post, shared_post, nodeObj);
            }
        });
    };

    /**
     * Builds and show the model.
     * @param {bool} cache - cache exist or not.
     * @param {object} result - json object for cache.
     */
    function modalShow(cache = 0, result = null) { // cache true of false
        console.log('Modal Building'+ cache)
        var modalTitle = "Most Recent Fake-news about Covid19"
        if (cache == 0) {

            // getting data from
            $.post(user_study_api)
                .done(function onSuccess(result) {
                    var top = '<div class="modal fade" id="misinfomodal" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title" id="staticBackdropLabel">' + modalTitle + '</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
                    var bottom = '<div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button><a class="btn btn-primary" href="https://coronafactcheck.net/trueFalse" role="button">More on CORONAFACTCHECK.NET</a></div></div></div></div>'
                    var bodyTop = '<div class="modal-body"><ul class="list-group">'
                    var bodyBottom = '</ul></div>'
                    var i;
                    var tempDiv;
                    var fake;
                    var truth;
                    result = JSON.parse(result)
                    for (i = 0; i < result.length; i++) {

                        fake = result[i].misinfo;
                        truth = result[i].truth;
                        source = result[i].truth_link;
                        tempDiv = '<li class="list-group-item"><div id="fake"><strong class="text-danger">Fake-news:</strong> ' + fake + '</div><div id="truth"><strong class="text-success">Truth:</strong> ' + truth + '</div><div id="source"><strong class="text-secondary">Source: </strong> ' + source + '</div></li>';
                        bodyTop += tempDiv;
                    }
                    var modal = top + bodyTop + bodyBottom + bottom;

                    $("body").append(modal)
                    $('#misinfomodal').modal({
                        keyboard: true
                    })
                })
                .fail(function onError(xhr, status, error) {
                    console.log(error)
                })
        } else {

            var top = '<div class="modal fade" id="misinfomodal" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title" id="staticBackdropLabel">' + modalTitle + '</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
            var bottom = '<div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button><a class="btn btn-primary" href="https://coronafactcheck.net/trueFalse" role="button">More on CORONAFACTCHECK.NET</a></div></div></div></div>'
            var bodyTop = '<div class="modal-body"><ul class="list-group">'
            var bodyBottom = '</ul></div>'
            var i;
            var tempDiv;
            var fake;
            var truth;
            result = JSON.parse(result)
            for (i = 0; i < result.length; i++) {
                fake = result[i].misinfo;
                truth = result[i].truth;
                source = result[i].truth_link;
                tempDiv = '<li class="list-group-item"><div id="fake"><strong class="text-danger">Fake-news:</strong> ' + fake + '</div><div id="truth"><strong class="text-success">Truth:</strong> ' + truth + '</div><div id="source"><strong class="text-secondary">Source: </strong> ' + source + '</div></li>';
                bodyTop += tempDiv;
            }
            var modal = top + bodyTop + bodyBottom + bottom;

            $("body").append(modal)
            $('#misinfomodal').modal({
                keyboard: true
            })
        }

        $('#misinfomodal').modal("toggle");
    }

    // function modalAutoSetup() {
    //     var flag;
    //     chrome.runtime.sendMessage({ msg: "sendcookie" }, function (response) {
    //         flag = response.msg; // cookie
    //         console.log("GOT COOKIE: "+flag)
    //         if (flag == "shown") {
    //             console.log("COOKIE: shown\n Modal ran in past");
    //         }
    //         else {
    //             chrome.runtime.sendMessage({ msg: "checkcache" });
    //             console.log("Modal run now");
    //             chrome.runtime.sendMessage({ msg: "setcookie" });
    //         }
    //     });
    // }

    (function init() {

        // message listener for whole content script
        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");

                if (jQuery.isEmptyObject(request.msg) == false) { // cache found
                    console.log("Old Cache Found")
                    modalShow(1, request.msg); //

                } else if (jQuery.isEmptyObject(request.msg)) { // no cache found
                    console.log("Old Cache Not Found");
                    modalShow(0);

                }
            });


        if (document.URL.match("(www.|http:\/\/|https:\/\/|m.)(facebook|fb).com")) {
            IS_FACEBOOK = true;
            console.log('---------- NEW LOOP -----------')

            console.log("FACEBOOK")

            var port = chrome.runtime.connect({
                name: "cookie_comm"
            });
            port.postMessage({
                msg: "checkcookie"
            });
            // listener
            port.onMessage.addListener(function(response) {
                if (response.msg == 'shown') {
                    console.log('Already Shown')
                }
                 else if (response.msg == 'notshown'){
                    console.log('will show now')
                    port.postMessage({
                        msg: 'checkcache'
                    });
                    port.postMessage({
                        msg: 'setcookie'
                    });
                }
                else {
                    console.log('cache found');
                    modalShow(1, response.msg); //
                }

                // if (response.cache){
                //     console.log("Old Cache Found")
                //     modalShow(1, response.cache); //
                // }
            });

        }

        if (IS_FACEBOOK) {
            console.log("Covid19 Misinfo Tracker Active on Facebook");
            document.onscroll = loop;
            loop();
        }
    })();
});
