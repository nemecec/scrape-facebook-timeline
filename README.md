# Scrape Facebook timeline feed (send to Slack webhook)

Motivation
----------

Every day, before noon, there starts a discussion about the place to go for lunch. And, 
almost every day, I go to the Facebook page of a local cafe
([Cafe Noir](https://www.facebook.com/Cafe-Noir-113131625390885/), great place BTW)
and copy-paste their daily offer to the local office chat.

That chat is hosted on [Slack](https://slack.com/) and Slack has a very easy-to-use [Webhook API](https://api.slack.com/incoming-webhooks)
for sending messages to chats. Now, wouldn't it be cool, if there would be a button on
that Facebook timeline feed, that would allow me to "forward" the lunch offer straight from
Facebook to Slack?

Unfortunately, Facebook does not offer easy access to the timeline feed, so I figured it
would be easiest to scrape the message directly from the DOM, using [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) or other [equivalent](http://appcrawlr.com/app/uberGrid/652164) (I used Tampermonkey).

Also, this was a perfect excuse for me to write some JavaScript.

Quick Start
-----------

Grab the script from `scrape-facebook-timeline.js`, add it to Tampermonkey and customize it for your needs.


You Need More Help?
-------------------

1. Install [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)
2. Open up Tampermonkey and create a new script
3. Copy paste the script from `scrape-facebook-timeline.js` or link it with `@requires` from your userscript definition.
4. **Modify @include URL in the header to match the URL of the Facebook page that you want to scrape**
5. Update the constants at the top of the script:

        var slackWebhookUrl = "<insert your Slack webhook URL here>";
        var icon_emoji = ":fork_and_knife:";
        var channel = "@neeme";
6. Navigate to the Facebook page and there should be [Post message] buttons next to the [Share] link on each status update.
