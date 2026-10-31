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
4.  The TweetXer panel appears in the top right corner
5.  In the **With export file** tab, choose or drop your tweet-headers.js or tweets.js file
6.  Wait for all your Tweets to vanish. The panel shows progress, failures, speed and the estimated time left.

You can select several files at once (e.g. `tweet-headers.js` and `tweet-headers-part1.js`) or drop them on the panel. The panel can be minimized with the `–` button.

If the process is interrupted at any time, you can use the advanced options to enter how many Tweets have been deleted in the previous run to not start at zero again. When you press **Stop**, the panel tells you which number to enter. The script will try to automatically detect if it was run before by calculating the difference between Tweets in the file and the Tweet count on the profile. If there is a difference it will try to automatically skip that amount (+5% buffer). If you want it to start from the beginning, open 'More options' and enter 0. It will then not skip anything.

Requests that fail permanently (e.g. Tweets that no longer exist) are counted as failed. When the run is finished you can retry them or download their IDs.

## More options

- **Items to skip**: how many items of the file to skip. Leave it empty for the automatic calculation (Tweets only).
- **Parallel requests**: how many Tweets are deleted at the same time (1–10, default 3). Higher is faster but hits rate limits sooner. Likes and DMs are always deleted one at a time because of their strict rate limits.
- **Delete DMs one by one**: delete each message instead of whole conversations.

Rate limits are handled automatically: the script pauses until X lifts the limit and then continues.

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

Because bookmarks aren't included in the Twitter data export, there is a button under "More options" to export them.

# Bonus: Tweet deletion without data export

If for some reason you can't use your data export or it missed some Tweets, open the **Without file** tab and select what to delete (at least one is required):

- **Posts**: your own posts (Posts tab of your profile)
- **Replies**: your replies (Replies tab). If Posts is not selected, only Tweets that look like replies are deleted (they show "Replying to" or the parent Tweet of someone else above them).
- **Reposts**: undoes your reposts (Reposts tab, or the Posts tab on older layouts). Some old reposts are "ghosts": X lists them as "You reposted" but shows them as not reposted. The script reposts them again and undoes that right away, which removes them.
- **Likes**: removes your likes. X removed the Likes tab, so the script opens your likes page directly and also removes the likes of every Tweet it comes across in the other tabs (e.g. the like on each repost).

Be warned, it is slow because it has to load the Tweets on your profile first and there are various request limits for that. When X stops loading the timeline, the script scrolls again, clicks "Retry" and reloads the tab before it gives up.

# Bonus: Delete Direct Messages

To delete DMs, you select the direct-message-header.js file instead of the tweet-headers.js file. Once it's done, reload the page, paste TweetXer into the console again and select the direct-message-group-headers.js file to remove message groups. If the process gets interrupted for whatever reason, you can enter how many messages were deleted before under "More options" before selecting the file. To delete each message individually instead of whole conversations, enable "Delete DMs one by one".

[According to former engineers](https://bsky.app/profile/triketora.com/post/3lcbmqzo4uk25), DMs are removed from the server if all sides remove them from their inbox.

# Bonus: Unfollow everyone

Under "More options" you can automatically unfollow everyone. You may need to rerun with some time in between because of rate limits.

# Known issues and solutions

- I can't paste the script.

  Your browser tries to protect you from pasting some random script you found. Type "allow pasting" (Firefox) or "allow pasting" (Chrome) and hit enter to confirm that you know what you are doing.

- X Corp doesn't send me my data export.

Try requesting it through their [Privacy Form](https://help.x.com/en/forms/privacy/request-account-info/me).

- Not all Tweets got removed.

Check if the ID of the remaining Tweet is in your data export. The script can only remove what's in the file. There is an option to remove remaining Tweets in the "Without file" tab but it is very slow. If there are many Tweets, re-run the script. Maybe request a new export.

- No Tweets are visible on the profile, but Tweet count shows there are still Tweets left.

In most cases those are Retweets from Tweets from accounts that got deactivated or banned. Sometimes the Tweets reappear once the accounts come back, sometimes they don't. There is nothing you can do.

- Likes aren't removed.

Only the last few hundred can be removed. Even by hand. There is nothing you can do other than deleting your whole account. Or reliking Tweets to unlike them afterwards which will probably get your account locked for spamming.

- Browser crashes

  This happens more often with Chrome and Chrome-based browsers. Especially when removing more than 15 k Tweets. The script no longer keeps response objects in the console, which was the main source of memory growth. If it still happens, close the browser console while it runs and lower "Parallel requests".

- It worked and you are thankful.

Awesome. Share the script on whatever platform you are using now to give others the option to delete their Tweets. Support me to keep creating things like this: [buymeacoffee.com/lucahammer](https://www.buymeacoffee.com/lucahammer)
