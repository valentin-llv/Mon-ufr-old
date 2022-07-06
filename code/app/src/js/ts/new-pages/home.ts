"use strict"

// Imports

import Page from "./page.js";
import Utils from "../singleton/utils.js";

// Page data

export default function HomePage(props) {
    // Default props
    let defaultProps = {
        pageName: 'home-page',
        pageAnimation: 'fade',
        hidden: false,
    };

    // Extends from page
    let extension = Page(defaultProps);

    // Mix the current component data and the data from the extended component
    return {...{
        mountedCallback: "load",

        todayDate: Utils.getDateString(new Date()),
        currentHour: Utils.getHourString(new Date()),
        menuSelected: ["var(--color-accent)", "var(--color-100)", "var(--color-100)", "var(--color-100)"],

        load() {
            setInterval(() => {
                this.updateCurrentTime();
            }, 1000 * 30);
        },

        updateCurrentTime() {
            this.currentHour = Utils.getHourString(new Date());
        },
    }, ...extension};
}