"use strict"

// Imports

import Page from "./page.js";
import DataManager from "../singleton/data-manager.js";
import Store from "../singleton/store.js";
import PageNavigator from "../singleton/page-navigator.js";

// Page data

export default function PlanningSettingsPage(props) {
    // Default props
    let defaultProps = {
        pageName: 'planning-settings-page',
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

        planningTemplateToggle(element) {
            Store.getInstance().planningSettings.planningTemplate = element.checked == true ? 2 : 1;
            DataManager.getInstance().data.settings.planning.planningTemplate = this.planningTemplate;
        },

        deleteData() {
            DataManager.getInstance().data.planning = {
                urls: [],

                eventNotes: {},
                elementsToHide: [],
                eventColors: {},
            };
            location.reload();
        },

        resetPage() {
            this.displayDeleteData = false;
        },
    }, ...extension};
}