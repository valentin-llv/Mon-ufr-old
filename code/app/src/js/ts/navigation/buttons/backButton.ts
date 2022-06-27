"use strict"

/* Importing code */

import PageNavigator from '../pageNavigator/pageNavigator.js';

/* Back button */

export default function BackButton(props): any {
    return {
        callback: props ? props.callback : null,

        clicked() {
            if(this.callback) this.callback();
            PageNavigator.getInstance().back();
        },
    };
}