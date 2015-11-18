// ==UserScript==
// @name         Scrape Facebook timeline
// @namespace    neeme.praks.net
// @homepage     https://github.com/nemecec/scrape-facebook-timeline
// @version      1.0
// @description  Post messages from Facebook timeline feed straight to Slack
// @author       Neeme Praks
// @include      https://www.facebook.com/Cafe-Noir-113131625390885/*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';
    var slackWebhookUrl = "<insert your Slack webhook URL here>";
    var icon_emoji = ":fork_and_knife:";
    var channel = "@neeme";

    var pageTitle = document.getElementsByTagName("h2")[0].textContent;
    var wrappers = document.getElementsByClassName("userContentWrapper");
    Array.prototype.forEach.call(wrappers, function(wrapper) {
        var message = wrapper.getElementsByClassName("userContent")[0];
        var time = wrapper.getElementsByTagName("abbr")[0];
        var action = wrapper.getElementsByClassName("comment_link")[0].parentElement;
        var btn = document.createElement("BUTTON");
        var t = document.createTextNode("Post message");
        btn.appendChild(t);
        var resultElement = document.createElement("DIV");
        var exportMsg = document.createElement("DIV");
        var copyChildNodes = function(from, to) {
            var children = from.childNodes;
            for(var i=0; i < children.length; i++) {
                var child = children[i];
                if (child.nodeType == Node.ELEMENT_NODE) {
                    var childClass = child.getAttribute('class');
                    if (!childClass || childClass.indexOf("hide") == -1) {
                        //copy everything except hidden nodes
                        var exportNode;
                        if (child.nodeName == "SPAN" || child.nodeName == "DIV") {
                            //in case of <span>, we keep on adding to the same node
                            exportNode = to;
                        } else {
                            exportNode = child.cloneNode(false);
                            to.appendChild(exportNode);
                        }
                        if (from != child) {
                            copyChildNodes(child, exportNode);
                        }
                    }
                } else {
                    to.appendChild(child.cloneNode(true));
                }
            }
        };
        var convertHtmlToText = function(from) {
            var children = from.childNodes;
            var result = "";
            for(var i=0; i < children.length; i++) {
                var child = children[i];
                if (child.nodeType == Node.ELEMENT_NODE) {
                    if (child.nodeName == "P") {
                        result = result + convertHtmlToText(child) + "\n";
                    }
                    else if (child.nodeName == "BR") {
                        result = result + "\n";
                    }
                } else if (child.nodeType == Node.TEXT_NODE) {
                    result = result + child.nodeValue;
                }
            }
            return result;
        };
        copyChildNodes(message, exportMsg);
        var msgText = convertHtmlToText(exportMsg);

        var postToSlack = function(event) {
            event.preventDefault();
            var sourceUrl = window.location.origin + time.parentElement.getAttribute('href');
            console.log({shortTime: time.textContent, 
                         longTime: time.getAttribute('title'), 
                         url: sourceUrl,
                         messageText: msgText,
                         message: exportMsg.innerHTML });
            resultElement.innerHTML = "Posting message...";
            GM_xmlhttpRequest({
                method: "POST",
                url: slackWebhookUrl,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    username: pageTitle,
                    icon_emoji: icon_emoji,
                    channel: channel,
                    text: msgText
                    //text: msgText + "\n" + "<" + sourceUrl + "|Source>"
                }),
                onload: function(response) {
                    if (response.status === 200) {
                        resultElement.innerHTML = "Message posted!";
                    } else {
                        resultElement.innerHTML = "Error: " + response.responseText;
                    }
                }
            });
            return false;
        };

        if (btn.addEventListener) {
            btn.addEventListener("click", postToSlack, false);
        } else if (btn.attachEvent) {
            btn.attachEvent('onclick', postToSlack);
        }
        action.appendChild(btn);
        action.appendChild(resultElement);
    });

}());

