"use strict"

import DataManager from "../singleton/data-manager.js";
// Imports

import Page from "./page.js";
import Store from "../singleton/store.js";

// Page data

export default function PersonalizationPage(props) {
    // Default props
    let defaultProps = {
        pageName: 'personalization-page',
        pageAnimation: 'slide',
    };

    // Extends from page
    let extension = Page(defaultProps);

    // Mix the current component data and the data from the extended component
    return {...{
        themeColor: DataManager.getInstance().data.settings.themeColor,
        lowPerfMode: DataManager.getInstance().data.settings.lowPerfMode,

        toggleThemeColor(element) {
            this.themeColor = element.checked == true ? "dark" : "light";
            DataManager.getInstance().data.settings.themeColor = this.themeColor;
            this.update();
        },

        update() {
            let shade = [900, 800, 700, 600, 300, 200, 100];
            for(let i = 0; i < shade.length; i++) {
                document.documentElement.style.setProperty('--color-' + shade[i], getComputedStyle(document.documentElement).getPropertyValue('--color-' + shade[i] + "-" + DataManager.getInstance().data.settings.themeColor));
            }
        },

        toggleAccentColor(index) {
            DataManager.getInstance().data.settings.accentColor = Store.getInstance().accentColor.colors[index];
            document.documentElement.style.setProperty('--color-accent', Store.getInstance().accentColor.colors[index]);
        },

        toggleLowPerfMode(element) {
            this.lowPerfMode = element.checked;
            DataManager.getInstance().data.settings.lowPerfMode = this.lowPerfMode;
            this.updateLowPerfMode();
        },

        updateLowPerfMode() {
            let transitionDuration = this.lowPerfMode == true ? 0 : 300;
            document.documentElement.style.setProperty('--transition-duration', transitionDuration + "ms");
        },
    }, ...extension};
}