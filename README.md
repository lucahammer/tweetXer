# tweetXer

You can use this script (https://github.com/lucahammer/tweetXer/blob/main/tweetXer.js) to delete all your Tweets. Even if they don't show up on your profile. But you need your Data Export for it to work.
Because this automates the deletion, it may get your account banned. Not that bad. Copies of your Tweets may still exist on backups and so on.

# Video tutorial 
English: https://www.youtube.com/watch?v=jB1-z6LbX5w 
German: https://www.youtube.com/watch?v=HmQ7_ZgVNxg

 # Usage
 1. Log into your Twitter account
 2. Open the browser console (F12)
 3. Paste the whole script into the console and press enter
 4. A light blue bar appears at the top of the window
 5. Use the file picker to select your tweet-headers.js or tweets.js file
 6. Wait for all your Tweets to vanish (about 5 Tweets per second)

 If the process is interrupted at any time, you can use the advanced options to enter how many Tweets have been deleted in the previous run to not start at zero again.

 # How it works
 Never use something like this from an untrusted source. The script intercepts requests from your browser to Twitter and replaces the Tweet-IDs
 with IDs from your tweets.js file. This allows it to access the old Tweets and delete them.

 XHR interception inspired by https://github.com/ttodua/Tamper-Request-Javascript-Tool
 Faster deletion inspired by https://github.com/Lyfhael/DeleteTweets

X all your Tweets for free. Video tutorial: https://www.youtube.com/watch?v=jB1-z6LbX5w (German: https://www.youtube.com/watch?v=HmQ7_ZgVNxg) 

# Bonus: Export your bookmarks
Because bookmarks aren't included in the Twitter data export, there is a button under advanced options to export them.
