"use strict"

// Imports

import GotoButton from "./gotoButton.js";

// Component

export default function SettingsButton(props) {
    // Default props
    let defaultProps = {
        pageName: props.pageName,
    };

    // Extends from page
    let extension = GotoButton(defaultProps);

    // Mix the current component data and the data from the extended component
    return {...{
        $template: "#settings-button-template",

        pageTitle: props.pageTitle,
        icon: document.getElementById(props.iconName).innerHTML,
    }, ...extension};
}