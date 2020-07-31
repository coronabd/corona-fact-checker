// constants and flags

const user_study_api = 'http://coronafactcheck.herokuapp.com/covid19/api/user_study_news'
const user_feedback_api = 'https://coronafactcheck.herokuapp.com/covid19/api/user_feedback'
var uid = ''

$(document).ready(function() {
    var IS_FACEBOOK = false;

    /* ----------------------------------------------------------
        facebook DOM Classes containing posts
    ---------------------------------------------------------- */

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



    //for mobile
    var facebook_link_post_container = '._55wo._5rgr._5gh8';
    var facebook_link_post_container_link = '._4qxt';
    var facebook_link_post_container_text = '._2rbw._5tg_';
    var misinfo_marker_container_fb = '._5rgt._5nk5._5msi';

    /**
     * Gets user id from DOM.
     * @returns {string} userid
     */

    function get_uid() {
        var re = new RegExp('/\/[a-zA-Z0-9]{3,}')
        var user_info = document.querySelector('._5xu4 a').href;
        if (user_info) {
            it = user_info.matchAll('\/[a-zA-Z0-9]{3,}')
            return it.next().value[0];

        } else {
            return 'unnamed'
        }
    }
    /**
     * Sends feed back to Flask API using jQuery. 
     * @param {string} action - what the user has done. {'click','negative'}
     * @param {object} fbpost_id - global post id for the post.
     */

    function send_feedback(action, fbpost_id) {
        // unix time
        time = parseInt(Date.now() / 1000)
        var tmp = {
            'uid': uid, // uid is globally set
            'action': action,
            'post_id': fbpost_id,
            'time': time
        }
        var tmpdata = JSON.stringify(tmp)
        $.post(user_feedback_api, {
            data: tmpdata
        }, function(data) {
            console.log('Feedback sent');
        });
    }


    var _handleClickbairReport = function(postData) {

        //alert("Feedback received. Thanks!!");
        //will handle this API call later. Currently only alert.
        // postData.feedback = 'dislike';
        //console.log(postData);
        console.log(fbpostId)
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

    /**
    * Handles user's feedback
    *
    *
    */
    var _handlefeedbackButtonClick = function(postData, fbpostId) {
        alert(" আপনার মতামতের জন্যে ধন্যবাদ।");
        send_feedback('negative', fbpostId);
    };
    //
    //
    var _getmisinfoInfoElement = function(data, id, postData, fbpostId) {
        var element = $("<div class='misinfo-marker-info-wrapper' style='font-size: 15px;'></div>");
        element.attr('id', _getmisinfoPopupId(id));
        console.log(fbpostId)

        var str = '';
        // if (data.matched_ngram && data.matched_ngram.length > 0) {
        //     str += '<b>misinfoy Language Pattern:</b>&nbsp;' + data.matched_ngram.join(", ") + "<br/>";
        // }


        //str += '<b>Decision Confidence:</b>&nbsp;' + data.confidence + "<br/>";

        str += '<div class="mis-info-text-font"><b> এই তথ্যটি ভুল হবার সম্ভাবনা:&nbsp;' + Math.round(data.confidence * 100) + "%</b><br/></div>";

        // if (data.similarity && data.similarity.length > 0){
        //     str += '<b>Similarity:</b>&nbsp;' + data.similarity + "<br/>" + "<hr/>"
        // }

        //str += '<b>Explanation:</b><br/>' + data.explanation + "<br/>";
        str += '<div><b> সঠিক তথ্য:</b><br/>' + data.explanation + "<br/></div>";
        //str += '<b>Verified By:</b><br/>' + data.verified_by + "<br/>";

        //str += '<b>Verification Link:</b><br/><a href="' + data.verification_link + '">'+ data.verification_link+'</a>';

        str += '<div><b>তথ্যসূত্র:</b><br/><a href="' + data.verification_link + '">' + 'বিশ্ব স্বাস্থ্য সংস্থা' + '</a></div>';

        var info = $('<div></div>').html(str);

        // reportButtonWrapper.find('a').html('Report misinfo');
        // reportButtonWrapper.find('a').css('color', '#ff9022');

        var feedbackButton = $('<div><a></a></div>');
        feedbackButton.attr('misinfoId', id)
        // feedbackButton.html('This should not be a Misinfo')
        feedbackButton.html('আমি মনে করি না এই তথ্যটি ভুয়া')
        feedbackButton.css('color', 'rgb(235, 28, 28)')

        feedbackButton.click(function(e) {
            _handlefeedbackButtonClick(postData, fbpostId);
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

        
        _handlemisinfoApiSuccess(misinfo_result.data, node, postData);
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

    // click counter
    var click_count = 0;


    //After clicking the 'Possible misinfo" bar, show the information block
    var _showMisinfoMarker = function(title, text, linkUrl, post, shared_post, node, fbpost_id) {
        var postData = {
            title: title,
            text: text,
            url: linkUrl,
            post: post,
            sharedPost: shared_post,
            fbpostID: fbpost_id
        };

        misinfoCount = misinfoCount + 1;

        //var ismisinfo = misinfo_result.decision === 'misinfo';

        var misinfoMarker = $("<div class='misinfo-marker1'><div class='misinfo-marker1-heading1'>এটি একটি ভুয়া তত্থ্য </div><div class='misinfo-marker1-heading2'> বিশেষজ্ঞরা এটাকে ফেক নিউজ হিসেবে নিশ্চিত করেছেন </div></div><div class='misinfo-marker-span'><div class='misinfo-marker1-heading1'>বিস্তারিত জানুন</div><div class='misinfo-marker1-heading2'>তথ্যটি কেন ভুয়া, সে সম্পর্কিত তথ্য প্রমাণ জানতে ক্লিক করুন</div></div>");

        misinfoMarker.attr('id', _getmisinfoLabelId(misinfoCount));


        misinfoMarker.addClass('misinfo-marker-is-misinfo');
        //misinfoMarker.text('িস্তারিত জানুন');
        var misinfoMarkerWrapper = $("<div class='misinfo-marker-wrapper'></div>");
        misinfoMarkerWrapper.attr('id', _getmisinfoWrapperId(misinfoCount));
        misinfoMarkerWrapper.append(misinfoMarker);


        //var nodeToFind = $("div[class='_1dwg _1w_m _q7o']"); // look for div with only class = mtm; other posts had two classes --> mtm _5pco or mtm xxxx which caused multiple addition of the wrapper
        var nodeToFind = $("div[class='story_body_container']"); //for mobile
        //var nodeToFind = $("header[class='_7om2 _1o88 _77kd _5qc1']");
        node.find(nodeToFind).after(misinfoMarkerWrapper); // change mtm to _1dwg _1w_m _q7o


        /* --------------------------------------------
            USER CLICK ON BISTARITO JANUN
        -----------------------------------------------*/
        misinfoMarker.click(function(e) {
            console.log("CLICK" + title + text + linkUrl + post + shared_post + node + fbpost_id)
            var misinfo_wrapper_id = this.id;
            var matches = misinfo_wrapper_id.match(/(\d+)/);
            var misinfo_popupid = matches[0];

            //count number of the click
            click_count = click_count + 1;

            //Print facebook post id
            //console.log(fbpost_id)
            var xmlhttp = new XMLHttpRequest();
            var url = "https://coronafactcheck.herokuapp.com/covid19/api/get_related_misinfo?claim=" + postData.post;
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    serverData = JSON.parse(this.responseText);
                    //console.log(serverData[0]['data'])
                };
            };
            xmlhttp.open("POST", url, false);
            xmlhttp.send();

            var sim_score = serverData[0]['similarity']
            if (sim_score > 0.1) {

                var misinfo_result = {
                    "data": {
                        "decision": serverData[0]['data']['misinfo'],
                        "confidence": serverData[0]['similarity'],
                        "explanation": serverData[0]['data']['truth'],
                        "verified_by": serverData[0]['data']['verified_by'],
                        "verification_link": serverData[0]['data']['truth_link']
                    }
                };



                var infoElement = _getmisinfoInfoElement(misinfo_result.data, misinfo_popupid, postData, fbpost_id);


                var closeButton = $("<div class='misinfo-marker-info-close-btn'>Close</div>");
                infoElement.append(closeButton);

                closeButton.click(function(e) {
                    infoElement.fadeOut('medium');
                });

                infoElement.hide();
                misinfoMarkerWrapper.append(infoElement);

                infoElement.fadeIn('medium');

                /* --------------------------------------
                    START send click info to server
                ----------------------------------------- */
                send_feedback("click", fbpost_id);

                /* --------------------------------
                   END send click info to server
                --------------------------------  */

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

            //facebook post Id
            fbpost_id = JSON.parse(nodeObj.attr('data-store')).feedback_target;
            uid = JSON.parse(nodeObj.attr('data-store')).actor_name; // future plan: move out of this function

            // title is the headline of a news article or video
            // text is the subtitle or thumbnail text
            var text = nodeObj.find(facebook_link_post_container_text).text();
            var title = nodeObj.find(facebook_link_post_container_title).text();


            // if (link) console.log('link', link);
            // if (text) console.log('text', text);
            // if (title) console.log('title', title);
            linkObj.mouseleave();
            //_callmisinfoApi(title, text, link, post, shared_post, nodeObj);
            if (post.includes('Coronavirus') || post.includes('করোনা') || post.includes('corona') ||
                post.includes('covid19') || post.includes('Covid19') || post.includes("করোনা ভাইরাস")) {
                _showMisinfoMarker(title, text, link, post, shared_post, nodeObj, fbpost_id);
            }
        });
    };


    /**
     * Builds and show the model.
     * @param {bool} cache - cache exist or not.
     * @param {object} result - json object containing the cache.
     */
    function modalShow(cache = 0, result = null) { // cache true of false
        console.log('Modal Building' + cache)
        var modalTitle = "করোনা সংক্রান্ত ভুয়া খবর থেকে সতর্ক থাকুন"
        var labelMoreButton = "আরও জানুন"
        var labelCloseButton = "বন্ধ করুন"
        var labelFake = "গুজব"
        var labelTrue = "সঠিক"
        if (cache == 0) {
            $.post(user_study_api)
                .done(function onSuccess(result) {

                    var top = '<div id="myModal" class="modal"><div class="modal-content"><div class="title-background"><div id="closeBtn" class="close">x</div><p class="title-text">নিচের ভুয়া তথ্যগুলো থেকে সতর্ক থাকুন</p></div>'
                    result = JSON.parse(result)
                    for (i = 0; i < result.length; i++) {

                        fake = result[i].misinfo;
                        truth = result[i].truth;
                        source = result[i].truth_link;
                        temp_li_grp_item = '<div class="list-group-item"><div class="rumor-title">গুজব</div><div id="fake" class="rumor">' + fake + '</div><div class="truth-title">সত্য</div><div id="truth" class="truth">' + truth + '</div></div>'
                        top += temp_li_grp_item;
                    }
                    var bottom = '<div class="title-background green-bg"><a class="title-text">আরও জানতে এখানে ক্লিক করুন</a></div></div></div>'
                    var modal = top + bottom;

                    $("body").append(modal)
                    // $('#misinfomodal').modal({
                    //     keyboard: true
                    // })
                })
                .fail(function onError(xhr, status, error) {
                    console.log(error)
                })
        } else {
            var top = '<div id="myModal" class="modal"><div class="modal-content"><div class="title-background"><div id="closeBtn" class="close">&times</div><p class="title-text">নিচের ভুয়া তথ্যগুলো থেকে সতর্ক থাকুন</p></div>'
            result = JSON.parse(result)
            for (i = 0; i < result.length; i++) {

                fake = result[i].misinfo;
                truth = result[i].truth;
                source = result[i].truth_link;
                temp_li_grp_item = '<div class="list-group-item"><div class="rumor-title">গুজব</div><div id="fake" class="rumor">' + fake + '</div><div class="truth-title">সত্য</div><div id="truth" class="truth">' + truth + '</div></div>'
                top += temp_li_grp_item;
            }
            var bottom = '<div class="footer"><a href="https://coronafactcheck.net" target="_blank">আরও জানতে এখানে ক্লিক করুন</a></div></div></div>'
            var modal = top + bottom;
            $("body").append(modal)
        }

        $("#myModal").toggle();
        $("#closeBtn").click(function() {
            $("#myModal").toggle();
        });
    }

    (function init() {

        // message listener for whole content script
        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
                if (jQuery.isEmptyObject(request.msg) == false) { // cache found
                    console.log("Old Cache Found")

                    if ($('#myModal').length) {
                        console.log($('#myModal').length)
                        $("#myModal").toggle();
                    } else {
                        modalShow(1, request.msg);
                    }


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
                } else if (response.msg == 'notshown') {
                    console.log('will show now')
                    port.postMessage({
                        msg: 'checkcache'
                    });
                    port.postMessage({
                        msg: 'setcookie'
                    });
                } else {
                    console.log('cache found');

                    if ($('#myModal').length) {
                        console.log($('#myModal').length)
                        $("#myModal").toggle();
                    } else {
                        modalShow(1, response.msg);
                    }
                }
            });

        }

        if (IS_FACEBOOK) {
            console.log("Covid19 Misinfo Tracker Active on Facebook");
            document.onscroll = loop;
            loop();
        }
    })();
});