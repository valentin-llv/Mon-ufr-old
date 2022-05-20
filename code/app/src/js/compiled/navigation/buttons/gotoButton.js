"use strict";
import PageNavigator from '../pageNavigator/pageNavigator.js';
export default function GotoButton(props) {
    return {
        pageName: props.pageName,
        clicked() {
            PageNavigator.getInstance().goto(this.pageName);
        },
    };
}
