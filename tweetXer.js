/*
 TweetXer

 You can use this script to delete all your Tweets. Even if they don't show up on your profile. But you need your Data Export for it to work.
 Because this automates the deletion, it may get your account banned. Not that bad. Copies of your Tweets may still exist on backups and so on.

 # Usage
 0. Log into your Twitter account
 1. You must have at least one visible Tweet on your profile. Post a new one, if there isn't one.
 2. Open the browser console (F12)
 3. Paste the whole script into the console and press enter
 4. A light blue bar appears at the top of the window
 5. Use the file picker to select your tweets.js
 6. Wait a long time for all your Tweets to vanish

 If the process is interrupted at any time, you can enter how many Tweets have been deleted in the previous run to not start at zero again. 
 
 # How it works
 Never use something like this from an untrusted source. The script intercepts requests from your browser to Twitter and replaces the Tweet-IDs
 with IDs from your tweets.js file. This allows it to access the old Tweets and delete them.

 XHR interception inspired by https://github.com/ttodua/Tamper-Request-Javascript-Tool

 Copyright 2023 Nobody
 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var TweetsXer = {
  allowed_requests: [],
  dId: "exportUpload",
  tIds: [],
  tId: "",
  ratelimitreset: 0,
  more: '[data-testid="tweet"] [aria-label="More"][data-testid="caret"]',
  skip: 640,
  total: 0,
  dCount: 0,

  init() {
    document.querySelector('header>div>div').setAttribute('class', '')
    this.createUploadForm();
    this.waitForFile(this.dId);
  },

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
  async waitForElemToExist(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      var observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        subtree: true,
        childList: true,
      });
    });
  },

  initXHR() {
    if (typeof AjaxMonitoring_notfired == "undefined")
      var AjaxMonitoring_notfired = false;
    if (!AjaxMonitoring_notfired) {
      AjaxMonitoring_notfired = true;

      /* NOTE: XMLHttpRequest actions happen in this sequence: at first "open"[readyState=1] happens, then "setRequestHeader", then "send", then "open"[readyState=2] */

      var XHR_SendOriginal = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.send = function () {
        if (arguments[0] && arguments[0].includes("item_type")) {
          arguments[0] = arguments[0].replace(
            /id%22%3A%22\d+%22%2C%22author_id/,
            `id%22%3A%22${TweetsXer.tId}%22%2C%22author_id`
          );
        }
        XHR_SendOriginal.apply(this, arguments);
      };

      var XHR_OpenOriginal = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function () {
        if (arguments[1] && arguments[1].includes("focalTweetId")) {
          TweetsXer.tId = TweetsXer.tIds.pop();
          arguments[1] = arguments[1].replace(
            /focalTweetId%22%3A%22\d+/,
            `focalTweetId%22%3A%22${TweetsXer.tId}`
          );
        }
        this.addEventListener(
          "readystatechange",
          // eslint-disable-next-line no-unused-vars
          function (event) {
            if (this.readyState == 4) {
              //console.log(this)
              if (
                this.statusText == "OK" &&
                this.responseURL.includes("/TweetDetail?") &&
                this.responseText.includes('No status found with that ID.')
              ) {
                // Tweet doesn't exist anymore
                TweetsXer.dCount++;
                TweetsXer.updateProgressBar();
              }
              if (
                this.statusText != "OK"
              ) {
                // Deletion failed
                TweetsXer.tIds.push(TweetsXer.tId)
                TweetsXer.ratelimitreset = this.getResponseHeader("x-rate-limit-reset");
              }
              if (
                this.statusText == "OK" &&
                this.responseURL.includes("/DeleteTweet")
              ) {
                // Tweet got deleted
                TweetsXer.dCount++;
                TweetsXer.updateProgressBar();
              }
            }
          },
          false
        );
        XHR_OpenOriginal.apply(this, arguments);
      };
    }
  },

  updateProgressBar() {
    document.getElementById('progressbar').setAttribute('value', this.dCount)
  },

  async waitForFile(dId) {
    let file = false;
    while (file == false) {
      console.log("waiting for tweets.js from your data export");
      await TweetsXer.sleep(2000);
      let tn = document.getElementById(`${dId}_file`);
      if (tn.files && tn.files[0]) {
        file = true;
        let fr = new FileReader();
        fr.onloadend = function (evt) {
          TweetsXer.skip = document.getElementById('skipCount').value;
          console.log(`Skipping oldest ${TweetsXer.skip} Tweets`)
          let json = JSON.parse(evt.target.result.slice(26)); //24 chars was valid around year 2020
          TweetsXer.tIds = json.map((x) => x.tweet.id_str);
          TweetsXer.total = TweetsXer.tIds.length;
          TweetsXer.tIds.reverse();
          TweetsXer.tIds = TweetsXer.tIds.slice(TweetsXer.skip);
          TweetsXer.dCount = TweetsXer.skip;
          TweetsXer.tIds.reverse();
          document.getElementById('start').remove();
          document.getElementById(
            `${dId}_title`
          ).textContent = `Deleting ${TweetsXer.total} Tweets`;
          TweetsXer.createProgressBar()
          document
            .querySelector('[data-testid="AppTabBar_Profile_Link"]')
            .click();
          TweetsXer.initXHR();
          TweetsXer.deleteTweets();
        };
        fr.readAsText(tn.files[0]);
      }
    }
  },

  createUploadForm() {
    var h2_class = document.querySelectorAll("h2")[1].getAttribute("class");
    var div = document.createElement("div");
    div.id = this.dId;
    if (document.getElementById(this.dId))
      document.getElementById(this.dId).remove();
    div.innerHTML = `<style>#${this.dId}{ z-index:99999; position: sticky; top:0px; left:0px; width:auto; margin:0 auto; padding: 20px 10%; background:#87CEFA; opacity:0.9; } #${this.dId} > *{padding:5px;}</style> 
	  <div>
	  	<h2 class="${h2_class}" id="${this.dId}_title">TweetXer</h2>
		  <p id="info">Enter how many Tweets to skip (useful for reruns) and select your tweets.js from your Twitter Data Export to start. </p>
      <p id="start">
        <input id="skipCount" type="number" value="0" />
        <input type="file" value="" id="${this.dId}_file"  />
      </p>
	  </div>`;
    document.body.insertBefore(div, document.body.firstChild);
  },

  createProgressBar() {
    let progressbar = document.createElement("progress");
    progressbar.setAttribute('id', "progressbar");
    progressbar.setAttribute('value', this.dCount);
    progressbar.setAttribute('max', this.total);
    progressbar.setAttribute('style', 'width:100%');
    document.getElementById(this.dId).appendChild(progressbar)
  },

  async deleteTweets() {
    document.getElementById("info").textContent = `${this.dCount} Tweets deleted`;
    if (window.location.href.includes("/status/")) {
      await this.sleep(1200);
      while (document.querySelectorAll(this.more).length > 0) {
        // hide recommended profiles and stuff
        document
          .querySelectorAll(
            '[aria-label="Profile timelines"]+section [data-testid="cellInnerDiv"]>div>div>div'
          )
          .forEach((x) => x.remove());
        document
          .querySelectorAll(
            '[aria-label="Profile timelines"]+section [data-testid="cellInnerDiv"]>div>div>[role="link"]'
          )
          .forEach((x) => x.remove());

        // if it is a Fav, unfav it (only works if script is executed on Likes tab)
        let unfav = document.querySelector('[data-testid="unlike"]');
        if (unfav) {
          unfav.click();
          document.querySelector('[data-testid="tweet"]').remove();
        }

        // if it is a Retweet, unretweet it
        let unretweet = document.querySelector('[data-testid="unretweet"]');
        if (unretweet) {
          unretweet.click();
          let confirmURT = await this.waitForElemToExist(
            '[data-testid="unretweetConfirm"]'
          );
          confirmURT.click();
        }

        // delete Tweet
        else {
          let caret = await this.waitForElemToExist(this.more);
          caret.click();
          let menu = await this.waitForElemToExist('[role="menuitem"]');
          if (menu.textContent.includes("@")) {
            // don't unfollow people (because their Tweet is the reply tab)
            caret.click();
            document.querySelector('[data-testid="tweet"]').remove();
          } else {
            menu.click();
            let confirmation = document.querySelector(
              '[data-testid="confirmationSheetConfirm"]'
            );
            if (confirmation) confirmation.click();
          }
        }
      }
      document.querySelector('[data-testid="AppTabBar_Profile_Link"]').click();
    } else {
      await this.waitForElemToExist('[aria-label="Profile timelines"]');
      let tweet = await this.waitForElemToExist('[data-testid="tweet"]');
      tweet.click();
    }

    let sleeptime = TweetsXer.ratelimitreset - Math.round(Date.now() / 1000);
    if (sleeptime > 0) {
      while (sleeptime > 0) {
        document.getElementById("info").textContent = `Ratelimited. Waiting ${sleeptime} seconds. ${TweetsXer.dCount} Tweets deleted.`
        await this.sleep(1000);
        sleeptime = TweetsXer.ratelimitreset - Math.round(Date.now() / 1000);
      }
      document.querySelector('[data-testid="AppTabBar_Profile_Link"]').click();
      await this.sleep(1000);
    }

    this.deleteTweets();
  },
};

TweetsXer.init();
