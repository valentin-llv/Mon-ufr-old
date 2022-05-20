"use strict"

/* Importing code */

import PageNavigator from '../pageNavigator/pageNavigator.js';

/* Back button */

export default function BackButton(): any {
    return {
        clicked() {
            PageNavigator.getInstance().back();
        },
    };
}