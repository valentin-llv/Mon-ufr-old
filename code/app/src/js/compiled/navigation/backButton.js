"use strict";
import PageNavigator from '../pageNavigator/pageNavigator.js';
export default function BackButton() {
    return {
        clicked() {
            PageNavigator.getInstance().back();
        },
    };
}
