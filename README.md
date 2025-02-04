# tweetXer – eXterminate your Tweets

You can use [this script](https://raw.githubusercontent.com/lucahammer/tweetXer/refs/heads/main/tweetXer.js) to delete all your Tweets. Even if they don't show up on your profile. But you need your Data Export for it to work.
Because this automates the deletion, it may get your account banned. Not a bad outcome.

## Translations

[Portuguese (Brazil)](https://github.com/arielgmelo/tweetXer-ptbr)

## Video tutorial

[![Youtube player preview showing a screenrecording: Left half is a firefox with twitter.com open and and open console. Right side is a code editor with bullet points and a person looking at the viewer with animated blue birds flying around their head.](https://img.youtube.com/vi/jB1-z6LbX5w/0.jpg)](https://www.youtube.com/watch?v=jB1-z6LbX5w)

English: [youtube.com/watch?v=jB1-z6LbX5w](https://www.youtube.com/watch?v=jB1-z6LbX5w)

German: [youtube.com/watch?v=HmQ7_ZgVNxg](https://www.youtube.com/watch?v=HmQ7_ZgVNxg)

# Usage
0.  [Request](https://x.com/settings/your_twitter_data/data) (takes several days) and download your Data Export and unzip it
1.  Log into your Twitter account
2.  Open the browser console (F12 or cmd+option+i)
3.  Paste the [whole script](https://raw.githubusercontent.com/lucahammer/tweetXer/main/tweetXer.js) into the console and press enter
4.  A light blue bar appears at the top of the window
5.  Use the file picker to select your tweet-headers.js or tweets.js file
6.  Wait for all your Tweets to vanish (about 5-10 Tweets per second)

If the process is interrupted at any time, you can use the advanced options to enter how many Tweets have been deleted in the previous run to not start at zero again. The script will try to automatically detect if it was run before by calculating the difference between Tweets in the file and the Tweet count on the profile. If there is a difference it will try to automatically skip that amount (+5% buffer). If you want it to start from the beginning, open 'Advanced options' and enter 1 instead of 0. It will then skip exactly one Tweet and not try to calculate an amount.

# Alternative to copy & paste: userscript

Instead of copy-pasting the script, you can install it as a userscript: [greasyfork.org/en/scripts/476062-tweetxer](https://greasyfork.org/en/scripts/476062-tweetxer) (works with eg. [Violentmonkey](https://addons.mozilla.org/firefox/addon/violentmonkey/), [FireMonkey](https://addons.mozilla.org/firefox/addon/firemonkey/) or [tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/) browser addon)

The userscript works on smartphones as well.

## Android

1. Install [Firefox Mobile](https://www.mozilla.org/firefox/browsers/mobile/)
2. Install the [Tampermonkey addon](https://addons.mozilla.org/firefox/addon/tampermonkey/)
3. Install the [script from greasyfork](https://greasyfork.org/en/scripts/476062-tweetxer)
4. Open X com and the blue bar should show up. You may need to uninstall the X-App before.

[Video tutorial for Android](https://www.youtube.com/watch?v=Z-MeTaRq6xM)

## iOS (iPhone/iPad)

1. Install the safari extension [Userscripts](https://apps.apple.com/app/userscripts/id1463298887)
2. Enable userscripts in Safari
3. Add the TweetXer userscript: New remote https://update.greasyfork.org/scripts/476062/TweetXer.user.js
4. Visit X com
5. Allow the extension Userscripts to access X com

# How it works

Never use something like this from an untrusted source. The script intercepts requests from your browser to Twitter and replaces the Tweet-IDs
with IDs from your tweets.js file. This allows it to access the old Tweets and delete them.

XHR interception inspired by [github.com/ttodua/Tamper-Request-Javascript-Tool](https://github.com/ttodua/Tamper-Request-Javascript-Tool)

Faster deletion inspired by [github.com/Lyfhael/DeleteTweets](https://github.com/Lyfhael/DeleteTweets)

# Bonus: Export your bookmarks

Because bookmarks aren't included in the Twitter data export, there is a button under "Advanced options" to export them.

# Bonus: Tweet deletion without data export

If for some reason you can't use your data export or it missed some Tweets, you can use slow mode under "Advanced options". Be warned, it is very slow because it has to load the Tweets on your profile first to delete them and there are various request limits for that.

# Bonus: Delete Direct Messages

To delete DMs, you select the direct-message-header.js file instead of the tweet-headers.js file. Once it's done, reload the page, paste TweetXer into the console again and select the direct-message-group-headers.js file to remove message groups. If the process gets interrupted for whatever reason, you can enter how many messages where deleted before under "Advanced options" before selcting the file.

[According to former engineers](https://bsky.app/profile/triketora.com/post/3lcbmqzo4uk25), DMs are removed from the server if all sides remove them from their inbox.

# Bonus: Unfollow everyone

Under "Advanced options" you can automatically unfollow everyone. You may need to rerun with some time in between because of rate limits.

# Known issues and solutions

- I can't paste the script.

  Your browser tries to protect you from pasting some random script you found. Type "allow pasting" (Firefox) or "allow pasting" (Chrome) and hit enter to confirm that you know what you are doing.

- X Corp doesn't send me my data export.

Try requesting it through their [Privacy Form](https://help.x.com/en/forms/privacy/request-account-info/me).

- Not all Tweets got removed.

Check if the ID of the remaining Tweet is in your data export. The script can only remove what's in the file. There is a option to automatically remove remaining Tweets under "Advanced options" but it is very slow. If there are many Tweets, re-run the script. Maybe request a new export.

- No Tweets are visible on the profile, but Tweet count shows there are still Tweets left.

In most cases those are Retweets from Tweets from accounts that got deactivated or banned. Sometimes the Tweets reappear once the accounts come back, sometimes they don't. There is nothing you can do.

- Likes aren't removed.

Only the last few hundred can be be removed. Even by hand. There is nothing you can do other than deleting your whole account. Or reliking Tweets to unlike them afterwards which will probably get your account locked for spamming.

- Browser crashes

  This happens more often with Chrome and Chrome-based browsers. Especially when removing more than 15 k Tweets. Closing the browser console while it runs seems to reduce the crashes.

- It worked and you are thankful.

Awesome. Share the script on whatever platform you are using now to give others the option to delete their Tweets. Support me to keep creating things like this: [buymeacoffee.com/lucahammer](https://www.buymeacoffee.com/lucahammer)
