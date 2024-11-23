// ==UserScript==
// @name         TweetXer
// @namespace    https://github.com/lucahammer/tweetXer/
// @version      0.8.2
// @description  Delete all your Tweets for free.
// @author       Luca,dbort,pReya,Micolithe,STrRedWolf
// @license      NoHarm-draft
// @match        https://x.com/*
// @match        https://mobile.x.com/*
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @grant        none
// @run-at       document-idle
// @downloadURL  https://update.greasyfork.org/scripts/476062/TweetXer.user.js
// @updateURL    https://update.greasyfork.org/scripts/476062/TweetXer.meta.js
// @supportURL   https://github.com/lucahammer/tweetXer/issues
// ==/UserScript==

(function () {
    var TweetsXer = {
        version: '0.8.1',
        TweetCount: 0,
        dId: "exportUpload",
        tIds: [],
        tId: "",
        ratelimitreset: 0,
        more: '[data-testid="tweet"] [data-testid="caret"]',
        skip: 0,
        total: 0,
        dCount: 0,
        deleteURL: '/i/api/graphql/VaenaVgh5q5ih7kvyVjgtg/DeleteTweet',
        unfavURL: '/i/api/graphql/ZYKSe-w7KEslx3JhSIk5LA/UnfavoriteTweet',
        username: '',
        action: '',
        bookmarksURL: '/i/api/graphql/L7vvM2UluPgWOW4GDvWyvw/Bookmarks?',
        bookmarks: [],
        bookmarksNext: '',
        baseUrl: 'https://x.com',
        authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
        ct0: false,
        transaction_id: '',

        async init() {
            this.baseUrl = 'https://' + window.location.hostname
            this.updateTransactionId()
            await this.getTweetCount()
            this.ct0 = this.getCookie('ct0')
            this.username = document.location.href.split('/')[3].replace('#', '')
        },

        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms))
        },

        getCookie(name) {
            let a = `; ${document.cookie}`.match(`;\\s*${name}=([^;]+)`);
            return a ? a[1] : false;
        },

        updateTransactionId() {
            this.transaction_id = [...crypto.getRandomValues(new Uint8Array(95))]
                .map((x, i) => (i = x / 255 * 61 | 0, String.fromCharCode(i + (i > 9 ? i > 35 ? 61 : 55 : 48)))).join``
            this.createUploadForm()
        },

        updateTitle(text) {
            document.getElementById('tweetsXer_title').textContent = text
        },

        updateInfo(text) {
            document.getElementById("info").textContent = text
        },

        createProgressBar() {
            let progressbar = document.createElement("progress")
            progressbar.setAttribute('id', "progressbar")
            progressbar.setAttribute('value', this.dCount)
            progressbar.setAttribute('max', this.total)
            progressbar.setAttribute('style', 'width:100%')
            document.getElementById(this.dId).appendChild(progressbar)
        },

        updateProgressBar(verb = 'deleted') {
            document.getElementById('progressbar').setAttribute('value', this.dCount)
            this.updateInfo(`${this.dCount} ${verb}`)
        },

        processFile() {
            let tn = document.getElementById(`${TweetsXer.dId}_file`)
            if (tn.files && tn.files[0]) {
                let fr = new FileReader()
                fr.onloadend = function (evt) {
                    // window.YTD.tweet_headers.part0
                    // window.YTD.tweets.part0
                    // window.YTD.like.part0
                    let cutpoint = evt.target.result.indexOf('= ')
                    let filestart = evt.target.result.slice(0, cutpoint)
                    let json = JSON.parse(evt.target.result.slice(cutpoint + 1))

                    if (filestart.includes('.tweet_headers.')) {
                        console.log('File contains Tweets.')
                        TweetsXer.action = 'untweet'
                        TweetsXer.tIds = json.map((x) => x.tweet.tweet_id)
                    } else if (filestart.includes('.tweets.') || filestart.includes('.tweet.')) {
                        console.log('File contains Tweets.')
                        TweetsXer.action = 'untweet'
                        TweetsXer.tIds = json.map((x) => x.tweet.id_str)
                    } else if (filestart.includes('.like.')) {
                        console.log('File contains Favs.')
                        TweetsXer.action = 'unfav'
                        TweetsXer.tIds = json.map((x) => x.like.tweetId)
                    } else {
                        console.log('File content not recognized. Please use a file from the Twitter data export.')
                    }

                    TweetsXer.total = TweetsXer.tIds.length
                    document.getElementById(`${TweetsXer.dId}_file`).remove()
                    TweetsXer.createProgressBar()

                    TweetsXer.skip = document.getElementById('skipCount').value

                    if (TweetsXer.action == 'untweet') {
                        if (TweetsXer.skip == 0) {
                            // If there is no amount set to skip, automatically try to skip the amount
                            // that has been deleted already. Difference of Tweeets in file to count on profile
                            // 5% tolerance to prevent skipping too much
                            TweetsXer.skip = TweetsXer.total - TweetsXer.TweetCount - parseInt(TweetsXer.total / 20)
                            TweetsXer.skip = Math.max(0, TweetsXer.skip)
                        }
                        console.log(`Skipping oldest ${TweetsXer.skip} Tweets. Use advanced options to manually set how many to skip. Enter 1 to prevent the automatic calculation.`)
                        TweetsXer.tIds.reverse()
                        TweetsXer.tIds = TweetsXer.tIds.slice(TweetsXer.skip)
                        TweetsXer.dCount = TweetsXer.skip
                        TweetsXer.tIds.reverse()
                        TweetsXer.updateTitle(`TweetXer: Deleting ${TweetsXer.total} Tweets`)

                        TweetsXer.deleteTweets()
                    } else if (TweetsXer.action == 'unfav') {
                        console.log(`Skipping oldest ${TweetsXer.skip} Tweets`)
                        TweetsXer.tIds = TweetsXer.tIds.slice(TweetsXer.skip)
                        TweetsXer.dCount = TweetsXer.skip
                        TweetsXer.tIds.reverse()
                        TweetsXer.updateTitle(`TweetXer: Deleting ${TweetsXer.total} Favs`)
                        TweetsXer.deleteFavs()
                    } else {
                        TweetsXer.updateTitle(`TweetXer: Please try a different file`)
                    }

                }
                fr.readAsText(tn.files[0])
            }
        },

        createUploadForm() {
            var h2_class = document.querySelectorAll("h2")[1]?.getAttribute("class") || ""
            var div = document.createElement("div")
            div.id = this.dId
            if (document.getElementById(this.dId)) { document.getElementById(this.dId).remove() }
            div.innerHTML = `<style>#${this.dId}{ z-index:99999; position: sticky; top:0px; left:0px; width:auto; margin:0 auto; padding: 20px 10%; background:#87CEFA; opacity:0.9; } #${this.dId} > *{padding:5px;}</style>
                <div style="color:black">
                    <h2 class="${h2_class}" id="tweetsXer_title">TweetXer</h2>
                    <p id="info">Select your tweet-headers.js from your Twitter Data Export to start the deletion of all your Tweets. </p>
                    <p id="start">
                        <input type="file" value="" id="${this.dId}_file"  />
                        <a style="color:blue" href="#" id="toggleAdvanced">Advanced Options</a>
                    <div id="advanced" style="display:none">
                        <label for="skipCount">Enter how many Tweets to skip before selecting a file. If 0, the script will try to automatically detect how many Tweets to skip by calcualting the difference between Tweets in the file and on the profile.</label>
                        <input id="skipCount" type="number" value="0" />
                        <p>To delete your Favs (aka Likes), select your like.js file. Unfaving is limited by X Corp to 500 unfavs per 15 minutes.</p>
                        <p><strong>Export bookmarks</strong><br>
                            Bookmarks are not included in the official data export. You can export them here.
                            <input id="exportBookmarks" type="button" value="Export Bookmarks" />
                        </p>
                        <p><strong>No tweet-headers.js?</strong><br>
                            If you are unable to get your data export, you can use the following option.<br>
                            This option is much slower and less reliable. It can remove at most 4000 Tweets per hour.<br>
                            <input id="slowDelete" type="button" value="Slow delete without file" />
                        </p>
                        <p><strong>Unfollow everyone</strong><br>
                            It's time to let go. This will unfollow everyone you follow.<br>
                            <input id="unfollowEveryone" type="button" value="Unfollow everyone" />
                        </p>
                        <p><a id="removeTweetXer" style="color:blue" href="#">Remove TweetXer</a></p>
                        <p><small>${TweetsXer.version}</small></p>
                    </div>
                </div>
                `
            document.body.insertBefore(div, document.body.firstChild)
            document.getElementById("toggleAdvanced").addEventListener("click", (() => {
                let adv = document.getElementById('advanced')
                if (adv.style.display == 'none') {
                    adv.style.display = 'block'
                } else {
                    adv.style.display = 'none'
                }
            }))
            document.getElementById(`${this.dId}_file`).addEventListener("change", this.processFile, false)
            document.getElementById("exportBookmarks").addEventListener("click", this.exportBookmarks, false)
            document.getElementById("slowDelete").addEventListener("click", this.slowDelete, false)
            document.getElementById("unfollowEveryone").addEventListener("click", this.unfollow, false)
            document.getElementById("removeTweetXer").addEventListener("click", this.removeTweetXer, false)

        },

        async exportBookmarks() {
            TweetsXer.updateTitle('TweetXer: Exporting bookmarks')
            let variables = ''
            while (TweetsXer.bookmarksNext.length > 0 || TweetsXer.bookmarks.length == 0) {
                if (TweetsXer.bookmarksNext.length > 0) {
                    variables = `{"count":20,"cursor":"${TweetsXer.bookmarksNext}","includePromotedContent":true}`
                } else variables = '{"count":20,"includePromotedContent":false}'
                let response = await fetch(TweetsXer.baseUrl + TweetsXer.bookmarksURL + new URLSearchParams({
                    variables: variables,
                    features: '{"graphql_timeline_v2_bookmark_timeline":true,"rweb_tipjar_consumption_enabled":true,"responsive_web_graphql_exclude_directive_enabled":true,"verified_phone_label_enabled":false,"creator_subscriptions_tweet_preview_api_enabled":true,"responsive_web_graphql_timeline_navigation_enabled":true,"responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,"communities_web_enable_tweet_community_results_fetch":true,"c9s_tweet_anatomy_moderator_badge_enabled":true,"articles_preview_enabled":true,"responsive_web_edit_tweet_api_enabled":true,"graphql_is_translatable_rweb_tweet_is_translatable_enabled":true,"view_counts_everywhere_api_enabled":true,"longform_notetweets_consumption_enabled":true,"responsive_web_twitter_article_tweet_consumption_enabled":true,"tweet_awards_web_tipping_enabled":false,"creator_subscriptions_quote_tweet_preview_enabled":false,"freedom_of_speech_not_reach_fetch_enabled":true,"standardized_nudges_misinfo":true,"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":true,"rweb_video_timestamps_enabled":true,"longform_notetweets_rich_text_read_enabled":true,"longform_notetweets_inline_media_enabled":true,"responsive_web_enhance_cards_enabled":false}'
                }), {
                    "headers": {
                        "authorization": TweetsXer.authorization,
                        "content-type": "application/json",
                        "x-client-transaction-id": TweetsXer.transaction_id,
                        "x-csrf-token": TweetsXer.ct0,
                        "x-twitter-active-user": "yes",
                        "x-twitter-auth-type": "OAuth2Session",
                    },
                    "referrer": `${TweetsXer.baseUrl}/i/bookmarks`,
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "method": "GET",
                    "mode": "cors",
                    "credentials": "include"
                })

                if (response.status == 200) {
                    let data = await response.json()
                    data.data.bookmark_timeline_v2.timeline.instructions[0].entries.forEach((item) => {

                        if (item.entryId.includes('tweet')) {
                            TweetsXer.dCount++
                            TweetsXer.bookmarks.push(item.content.itemContent.tweet_results.result)
                        } else if (item.entryId.includes('cursor-bottom')) {
                            if (TweetsXer.bookmarksNext != item.content.value) {
                                TweetsXer.bookmarksNext = item.content.value
                            } else {
                                TweetsXer.bookmarksNext = ''
                            }
                        }
                    })
                    //document.getElementById('progressbar').setAttribute('value', TweetsXer.dCount)
                    TweetsXer.updateInfo(`${TweetsXer.dCount} Bookmarks collected`)
                } else {
                    console.log(response)
                }

                if (response.headers.get('x-rate-limit-remaining') < 1) {
                    console.log('rate limit hit')
                    let ratelimitreset = response.headers.get('x-rate-limit-reset')
                    let sleeptime = ratelimitreset - Math.floor(Date.now() / 1000)
                    while (sleeptime > 0) {
                        sleeptime = ratelimitreset - Math.floor(Date.now() / 1000)
                        TweetsXer.updateInfo(`Ratelimited. Waiting ${sleeptime} seconds. ${TweetsXer.dCount} deleted.`)
                        await TweetsXer.sleep(1000)
                    }
                }
            }
            let download = new Blob([JSON.stringify(TweetsXer.bookmarks)], {
                type: 'text/plain'
            })
            let bookmarksDownload = document.createElement("a")
            bookmarksDownload.id = 'bookmarksDownload'
            bookmarksDownload.innerText = 'Download bookmarks'
            bookmarksDownload.href = window.URL.createObjectURL(download)
            bookmarksDownload.download = 'twitter-bookmarks.json'
            document.getElementById('advanced').appendChild(bookmarksDownload)
            TweetsXer.updateTitle('TweetXer')
        },

        async deleteFavs() {
            TweetsXer.updateTitle('TweetXer: Deleting Favs')
            // 500 unfavs per 15 Minutes
            // x-rate-limit-remaining
            // x-rate-limit-reset

            while (this.tIds.length > 0) {
                this.tId = this.tIds.pop()
                let response = await fetch(this.baseUrl + this.unfavURL, {
                    "headers": {
                        "authorization": this.authorization,
                        "content-type": "application/json",
                        "x-client-transaction-id": this.transaction_id,
                        "x-csrf-token": this.ct0,
                        "x-twitter-active-user": "yes",
                        "x-twitter-auth-type": "OAuth2Session",
                    },
                    "referrer": `${TweetsXer.baseUrl}/${this.username}/likes`,
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": `{\"variables\":{\"tweet_id\":\"${this.tId}\"},\"queryId\":\"${this.baseUrl + this.unfavURL.split('/')[6]}\"}`,
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                })

                if (response.status == 200) {
                    TweetsXer.dCount++
                    TweetsXer.updateProgressBar()
                } else {
                    console.log(response)
                }

                if (response.headers.get('x-rate-limit-remaining') < 1) {
                    console.log('rate limit hit')
                    let ratelimitreset = response.headers.get('x-rate-limit-reset')
                    let sleeptime = ratelimitreset - Math.floor(Date.now() / 1000)
                    while (sleeptime > 0) {
                        sleeptime = ratelimitreset - Math.floor(Date.now() / 1000)
                        TweetsXer.updateInfo(`Ratelimited. Waiting ${sleeptime} seconds. ${TweetsXer.dCount} deleted.`)
                        await TweetsXer.sleep(1000)
                    }
                }
            }
            TweetsXer.updateTitle('TweetXer')
        },

        async deleteTweets() {
            while (this.tIds.length > 0) {
                this.tId = this.tIds.pop()
                try {
                    let response = await fetch(this.baseUrl + this.deleteURL, {
                        "headers": {
                            "authorization": this.authorization,
                            "content-type": "application/json",
                            "x-client-transaction-id": this.transaction_id,
                            "x-csrf-token": this.ct0,
                            "x-twitter-active-user": "yes",
                            "x-twitter-auth-type": "OAuth2Session"
                        },
                        "referrer": `${TweetsXer.baseUrl}/${this.username}/with_replies`,
                        "referrerPolicy": "strict-origin-when-cross-origin",
                        "body": `{\"variables\":{\"tweet_id\":\"${this.tId}\",\"dark_request\":false},\"queryId\":\"${this.baseUrl + this.deleteURL.split('/')[6]}\"}`,
                        "method": "POST",
                        "mode": "cors",
                        "credentials": "include",
                        "signal": AbortSignal.timeout(5000)
                    })
                    if (response.status == 200) {
                        TweetsXer.dCount++
                        TweetsXer.updateProgressBar()
                    }
                    else if (response.status == 429) {
                        this.tIds.push(this.tId)
                        console.log('Received status code 429. Waiting for 1 second before trying again.')
                        await TweetsXer.sleep(1000)
                    }
                    else {
                        console.log(response)
                    }

                } catch (error) {
                    if (error.Name === 'AbortError') {
                        this.tIds.push(this.tId)
                        console.log('Request timeout.')
                        let sleeptime = 15
                        while (sleeptime > 0) {
                            sleeptime--
                            TweetsXer.updateInfo(`Ratelimited. Waiting ${sleeptime} seconds. ${TweetsXer.dCount} deleted.`)
                            await TweetsXer.sleep(1000)
                        }
                    }
                }
            }
        },

        async getTweetCount() {
            await waitForElemToExist('header')
            await TweetsXer.sleep(1000)
            if (!document.querySelector('[data-testid="UserName"]')) {
                if (document.querySelector('[aria-label="Back"]')) {
                    await TweetsXer.sleep(200)
                    document.querySelector('[aria-label="Back"]').click()
                    await TweetsXer.sleep(1000)
                }
                else if (document.querySelector('[data-testid="app-bar-back"]')) {
                    document.querySelector('[data-testid="app-bar-back"]').click()
                    await TweetsXer.sleep(1000)
                }

                if (document.querySelector('[data-testid="AppTabBar_Profile_Link"]')) {
                    await TweetsXer.sleep(200)
                    document.querySelector('[data-testid="AppTabBar_Profile_Link"]').click()
                }
                else if (document.querySelector('[data-testid="DashButton_ProfileIcon_Link"]')) {
                    await TweetsXer.sleep(100)
                    document.querySelector('[data-testid="DashButton_ProfileIcon_Link"]').click()
                    await TweetsXer.sleep(1000)
                    document.querySelector('[data-testid="icon"').nextElementSibling.click()
                }

                await waitForElemToExist('[data-testid="UserName"]')
            }
            await TweetsXer.sleep(1000)

            try {
                TweetsXer.TweetCount = document.querySelector('[data-testid="primaryColumn"]>div>div>div')
                    .textContent.match(/((\d|,|\.|K)+) (\w+)$/)[1]
                    .replace(/\.(\d+)K/, '$1'.padEnd(4, '0'))
                    .replace('K', '000')
                    .replace(',', '')
                    .replace('.', '')
            } catch (error) {
                try {
                    TweetsXer.TweetCount = document.querySelector('[data-testid="TopNavBar"]>div>div')
                        .textContent.match(/((\d|,|\.|K)+) (\w+)$/)[1]
                        .replace(/\.(\d+)K/, '$1'.padEnd(4, '0'))
                        .replace('K', '000')
                        .replace(',', '')
                        .replace('.', '')
                }
                catch (error) {
                    console.log("Wasn't able to find Tweet count on profile. Setting it to 1 million.")
                    TweetsXer.TweetCount = 1000000 // prevents Tweets from being skipped because of tweet count of 0
                }
            }
            console.log(TweetsXer.TweetCount + " Tweets on profile.")
            console.log("You can close the console now to reduce the memory usage.")
            console.log("Reopen the console if there are issues to see if an error shows up.")
        },

        async slowDelete() {
            //document.getElementById("toggleAdvanced").click()
            document.getElementById('start').remove()
            TweetsXer.total = TweetsXer.TweetCount
            TweetsXer.createProgressBar()

            document.querySelectorAll('[data-testid="ScrollSnap-List"] a')[1].click()
            await TweetsXer.sleep(2000)

            let unretweet, confirmURT, caret, menu, confirmation

            const more = '[data-testid="tweet"] [data-testid="caret"]'
            while (document.querySelectorAll(more).length > 0) {

                // give the Tweets a chance to load; increase/decrease if necessary
                // afaik the limit is 50 requests per minute
                await TweetsXer.sleep(1200)

                // hide recommended profiles and stuff
                document.querySelectorAll('section [data-testid="cellInnerDiv"]>div>div>div').forEach(x => x.remove())
                document.querySelectorAll('section [data-testid="cellInnerDiv"]>div>div>[role="link"]').forEach(x => x.remove())
                document.querySelector(more).scrollIntoView({
                    'behavior': 'smooth'
                })

                // if it is a Retweet, unretweet it
                unretweet = document.querySelector('[data-testid="unretweet"]')
                if (unretweet) {
                    unretweet.click()
                    confirmURT = await waitForElemToExist('[data-testid="unretweetConfirm"]')
                    confirmURT.click()
                }

                // delete Tweet
                else {
                    caret = await waitForElemToExist(more)
                    caret.click()


                    menu = await waitForElemToExist('[role="menuitem"]')
                    if (menu.textContent.includes('@')) {
                        // don't unfollow people (because their Tweet is the reply tab)
                        caret.click()
                        document.querySelector('[data-testid="tweet"]').remove()
                    } else {
                        menu.click()
                        confirmation = await waitForElemToExist('[data-testid="confirmationSheetConfirm"]')
                        if (confirmation) confirmation.click()
                    }
                }

                TweetsXer.dCount++
                TweetsXer.updateProgressBar()

                // print to the console how many Tweets already got deleted
                // Change the 100 to how often you want an update.
                // 10 for every 10th Tweet, 1 for every Tweet, 100 for every 100th Tweet
                if (TweetsXer.dCount % 100 == 0) console.log(`${new Date().toUTCString()} Deleted ${TweetsXer.dCount} Tweets`)

            }

            console.log('No Tweets left. Please reload to confirm.')
        },

        async unfollow() {
            //document.getElementById("toggleAdvanced").click()
            let unfollowCount = 0
            let next_unfollow, menu

            document.querySelector('[href$="/following"]').click()
            await TweetsXer.sleep(1200)

            const accounts = '[data-testid="UserCell"]'
            while (document.querySelectorAll('[data-testid="UserCell"] [data-testid$="-unfollow"]').length > 0) {
                next_unfollow = document.querySelectorAll(accounts)[0]
                next_unfollow.scrollIntoView({
                    'behavior': 'smooth'
                })

                next_unfollow.querySelector('[data-testid$="-unfollow"]').click()
                menu = await waitForElemToExist('[data-testid="confirmationSheetConfirm"]')
                menu.click()
                next_unfollow.remove()
                unfollowCount++
                if (unfollowCount % 10 == 0) console.log(`${new Date().toUTCString()} Unfollowed ${unfollowCount} accounts`)
                await TweetsXer.sleep(Math.floor(Math.random() * 200))
            }

            console.log('No accounts left. Please reload to confirm.')
        },
        removeTweetXer() {
            document.getElementById('exportUpload').remove()
        }
    }

    const waitForElemToExist = async (selector) => {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector))
            }

            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector))
                    observer.disconnect()
                }
            })

            observer.observe(document.body, {
                subtree: true,
                childList: true,
            })
        })
    }

    TweetsXer.init()
})()
