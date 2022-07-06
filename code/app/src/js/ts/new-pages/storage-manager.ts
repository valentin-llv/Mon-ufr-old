"use strict"

// Imports

import Page from "./page.js";
import Utils from "../singleton/utils.js";
import PageNavigator from "../singleton/page-navigator.js";

// Page data

export default function StorageManager(props) {
    // Default props
    let defaultProps = {
        pageName: 'storage-management-page',
        pageAnimation: 'slide',
    };

    // Extends from page
    let extension = Page(defaultProps);

    // Mix the current component data and the data from the extended component
    return {...{
        mountedCallback: "load",

        displayDeleteDataConfirm: false,
        usedDataStorage: Utils.calcUsedDataStorage(),

        displayDeleteCacheConfirm: false,

        cacheErrorMessage: "",

        load() {
            PageNavigator.getInstance().registerCloseCallback(this.pageName, this.resetPage);
        },

        deleteData() {
            localStorage.clear();
            location.reload();
        },

        deleteCache() {
            if('serviceWorker' in navigator) {
                caches.delete("data-cache");
                location.reload();
            } else this.cacheErrorMessage = "Le cache n'est pas disponible sur votre appareil.";
        },

        resetPage() {
            this.displayDeleteDataConfirm = false;
            this.displayDeleteCacheConfirm = false;
        },
    }, ...extension};
}