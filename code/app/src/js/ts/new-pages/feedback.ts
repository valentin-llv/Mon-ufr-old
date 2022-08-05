"use strict"

// Imports

import Page from "./page.js";
import FetchManager from "../singleton/fetch-manager.js";
import PageNavigator from "../singleton/page-navigator.js";
import Store from "../singleton/store.js";

// Page data

export default function FeedbackPage(props) {
    // Default props
    let defaultProps = {
        pageName: 'app-idea-page',
        pageAnimation: 'slide',
    };

    // Extends from page
    let extension = Page(defaultProps);

    // Mix the current component data and the data from the extended component
    return {...{
        feedbackFrom: "",
        feedbackMessage: "",

        feedbackFromBorderColor: "transparent",
        feedbackMessageBorderColor: "transparent",

        sendMail() {
            if(this.feedbackFrom && this.feedbackMessage) {
                FetchManager.getInstance().fetch("?from=" + this.feedbackFrom + "&message=" + this.feedbackMessage, "mailSenderUrl", {
                    cache: false,
                });

                PageNavigator.getInstance().back();

                this.feedbackFrom = "";
                this.feedbackMessage = "";

                this.feedbackFromBorderColor = "transparent";
                this.feedbackMessageBorderColor = "transparent";

                Store.getInstance().popup.usePopup("Merci pour votre message", null, false);
            } else {
                this.feedbackFromBorderColor = "rgba(255, 0, 0, 0.5)";
                this.feedbackMessageBorderColor = "rgba(255, 0, 0, 0.5)";
            }
        },
    }, ...extension};
}