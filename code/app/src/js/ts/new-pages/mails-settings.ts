"use strict"

// Imports

import Page from "./page.js";
import DataManager from "../singleton/data-manager.js";
import PageNavigator from "../singleton/page-navigator.js";

// Page data

export default function MailsSettingsPage(props) {
    // Default props
    let defaultProps = {
        pageName: 'mails-settings-page',
        pageAnimation: 'slide',
    };

    // Extends from page
    let extension = Page(defaultProps);

    // Mix the current component data and the data from the extended component
    return {...{
        mountedCallback: "load",
        displayDeleteData: false,

        load() {
            PageNavigator.getInstance().registerCloseCallback(this.pageName, this.resetPage);
        },
        
        deleteData() {
            DataManager.getInstance().data.mail = {
                userId: "",
                password: "",

                hierarchy: {
                    "Réception": [],
                },
            };
            location.reload();
        },

        resetPage() {
            this.displayDeleteData = false;
        },
    }, ...extension};
}