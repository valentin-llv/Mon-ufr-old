"use strict";
import PageNavigator from '../pageNavigator/pageNavigator.js';
export default function BackButton(props) {
    return {
        callback: props ? props.callback : null,
        clicked() {
            if (this.callback)
                this.callback();
            PageNavigator.getInstance().back();
        },
    };
}
