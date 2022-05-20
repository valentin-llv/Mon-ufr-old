"use strict"

/* Importing code */

import PageNavigator from '../pageNavigator/pageNavigator.js';

/* Goto button */

interface GotoButtonProps {
    pageName: string;
}

export default function GotoButton(props: GotoButtonProps): any {
    return {
        pageName: props.pageName,

        clicked() {
            PageNavigator.getInstance().goto(this.pageName);
        },
    };
}