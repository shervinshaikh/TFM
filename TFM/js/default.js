// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var articlesList;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            var articlelistElement = document.getElementById("articlelist");
            articlelistElement.addEventListener("iteminvoked", itemInvoked);
            backbutton.addEventListener("click", backButtonClick);

            articlesList = new WinJS.Binding.List();
            var publicMembers = { ItemList: articlesList };
            WinJS.Namespace.define("TFMData", publicMembers);

            args.setPromise(WinJS.UI.processAll().then(downloadTFMBlogFeed));
            initializeSettings();
        }
    };

    function backButtonClick(e) {
        articlecontent.style.display = "none";
        articlelist.style.display = "";
        WinJS.UI.Animation.enterPage(articlelist);
    }

    function itemInvoked(e) {
        var currentArticle = articlesList.getAt(e.detail.itemIndex);
        WinJS.Utilities.setInnerHTMLUnsafe(articlecontent, currentArticle.content);
        articlelist.style.display = "none";
        articlecontent.style.display = "";
        WinJS.UI.Animation.enterPage(articlecontent);
    }

    function downloadTFMBlogFeed() {
        WinJS.xhr({ url: "http://feeds.feedburner.com/TFM-Wall", responseType: 'responseXML' }).then(function (rss) {
            var items = rss.responseXML.querySelectorAll("item");

            for (var n = 0; n < items.length; n++) {
                var article = {};
                article.title = items[n].querySelector("title").textContent;
                var imageStart = items[n].textContent.indexOf('<img src="') + 10;
                var imageEnd = items[n].textContent.indexOf('"', imageStart + 1);

                article.thumbnail = items[n].textContent.substring(imageStart, imageEnd);
                article.content = items[n].textContent;
                articlesList.push(article);
            }
        });
    }

    function initializeSettings() {
        WinJS.Application.onsettings = function (e) {
            e.detail.applicationcommands = {
                "privacy": {
                    title: "Privacy",
                    href: "/html/privacy.html"
                }
            };
            WinJS.UI.SettingsFlyout.populateSettings(e);
        };
        // Make sure the following is called after the DOM has initialized. 
        // Typically this would be part of app initialization
        // WinJS.Application.start();
    }

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();
})();
