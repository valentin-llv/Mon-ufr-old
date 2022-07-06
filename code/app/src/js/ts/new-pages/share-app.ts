"use strict"

// Imports

import Page from "./page.js";

// Page data

export default function ShareAppPage(props) {
    // Default props
    let defaultProps = {
        pageName: 'app-share-page',
        pageAnimation: 'slide',
    };

    // Extends from page
    let extension = Page(defaultProps);

    // Mix the current component data and the data from the extended component
    return {...{
        openShareMenu() {
            if(navigator.share) {
                navigator.share({
                    title: 'Mon UFR',
                    text: 'Mon UFR la meilleur application pour  acceder à tous les services des UFR.',
                    url: 'https://ufr-planning.com/',
                });
            }
        },
    }, ...extension};
}