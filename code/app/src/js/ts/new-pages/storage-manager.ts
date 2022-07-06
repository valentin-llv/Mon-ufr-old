"use strict"

// Imports

import Page from "./page.js";
import Utils from "../singleton/utils.js";

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
        displayDeleteDataConfirm: false,
        usedDataStorage: Utils.calcUsedDataStorage(),

        displayDeleteCacheConfirm: false,

        deleteData() {
            localStorage.clear();
            location.reload();
        },

        deleteCache() {
            if('serviceWorker' in navigator) caches.delete("data-cache");
            location.reload();
        },
    }, ...extension};
}