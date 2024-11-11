# tweetXer

You can use [this script](https://github.com/lucahammer/tweetXer/blob/main/tweetXer.js) to delete all your Tweets. Even if they don't show up on your profile. But you need your Data Export for it to work.
Because this automates the deletion, it may get your account banned. Not that bad. Copies of your Tweets may still exist on backups and so on.

# Video tutorial 
[![Youtube player preview showing a screenrecording: Left half is a firefox with twitter.com open and and open console. Right side is a code editor with bullet points and a person looking at the viewer with animated blue birds flying around their head.](https://img.youtube.com/vi/jB1-z6LbX5w/0.jpg)](https://www.youtube.com/watch?v=jB1-z6LbX5w)

English: [youtube.com/watch?v=jB1-z6LbX5w](https://www.youtube.com/watch?v=jB1-z6LbX5w)

German: [youtube.com/watch?v=HmQ7_ZgVNxg](https://www.youtube.com/watch?v=HmQ7_ZgVNxg)

 # Usage
 0. Use Firefox or Safari if possible
 1. Log into your Twitter account
 2. Open the browser console (F12)
 3. Paste the [whole script](https://raw.githubusercontent.com/lucahammer/tweetXer/main/tweetXer.js) into the console and press enter
 4. A light blue bar appears at the top of the window
 5. Use the file picker to select your tweet-headers.js or tweets.js file
 6. Wait for all your Tweets to vanish (about 5 Tweets per second)

 If the process is interrupted at any time, you can use the advanced options to enter how many Tweets have been deleted in the previous run to not start at zero again.

 https://github.com/lucahammer/tweetXer/blob/66d0a0f188afb72e445c5157670d604b25f962c3/tweetXer.js#L1-L532

 # Alternative to copy & paste: userscript
 Instead of copy-pasting the script, you can install it as a userscript: https://greasyfork.org/en/scripts/476062-tweetxer (works with eg. tampermonkey browser extension https://addons.mozilla.org/firefox/addon/tampermonkey/)

 The userscript works on smartphones as well. Android only. 1. Install [Firefox Mobile](https://www.mozilla.org/firefox/browsers/mobile/), 2. Install the [Tampermonkey addon](https://addons.mozilla.org/firefox/addon/tampermonkey/), 3. install the [script from greasyfork](https://greasyfork.org/en/scripts/476062-tweetxer). Open X com and the blue bar should show up. You may need to uninstall the X-App before.
 
 # How it works
 Never use something like this from an untrusted source. The script intercepts requests from your browser to Twitter and replaces the Tweet-IDs
 with IDs from your tweets.js file. This allows it to access the old Tweets and delete them.

 XHR interception inspired by [github.com/ttodua/Tamper-Request-Javascript-Tool](https://github.com/ttodua/Tamper-Request-Javascript-Tool)
 
 Faster deletion inspired by [github.com/Lyfhael/DeleteTweets](https://github.com/Lyfhael/DeleteTweets)

 # Bonus: Export your bookmarks
Because bookmarks aren't included in the Twitter data export, there is a button under advanced options to export them.

# Bonus: Tweet deletion without data export
If for some reason you can't use your data export or it missed some Tweets, you can use slow mode under "Advanced options". Be warned, it is very slow because it has to load the Tweets on your profile first to delete them and there are various request limits for that.

# Known issues and solutions
- Not all Tweets got removed.
  
Check if the ID of the remaining Tweet is in your data export. The script can only remove what's in the file. There is a option to automatically remove remaining Tweets under "Advanced options" but it is very slow. If there are many Tweets, re-run the script. Maybe request a new export.

- No Tweets are visible on the profile, but Tweet count shows there are still Tweets left.

In most cases those are Retweets from Tweets from accounts that got deactivated or banned. Sometimes the Tweets reappear once the accounts come back, sometimes they don't. There is nothing you can do.

- Likes aren't removed.

Only the last few hundred can be be removed. Even by hand. There is nothing you can do other than deleting your whole account. Or reliking Tweets to unlike them afterwards which will probably get your account locked for spamming.

- It worked and you are thankful.

Awesome. Share the script on whatever platform you are using now to give others the option to delete their Tweets. Support me to keep creating things like this: [buymeacoffee.com/lucahammer](https://www.buymeacoffee.com/lucahammer)
