"use strict"

/* Importing code */

import PageNavigator from '../singleton/page-navigator.js';

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