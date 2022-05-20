"use strict";
import PageNavigator from '../pageNavigator/pageNavigator.js';
import Store from '../../petite-vue/store/store.js';
export default function BottomMenuButton(props) {
    return {
        pageName: props.pageName,
        dasharray: props.dasharray,
        index: props.index,
        currentDasharray: props.dasharray,
        currentDashoffset: 0,
        baseTransitionSpeed: "1s",
        transitionSpeed: 0,
        clicked() {
            this.transitionSpeed = "0s";
            this.currentDashoffset = this.dasharray;
            setTimeout(() => {
                this.transitionSpeed = this.baseTransitionSpeed;
                this.currentDashoffset = 0;
            }, 0);
            PageNavigator.getInstance().restartTo(this.pageName);
            Store.getInstance().home.menuSelected = ["var(--color-100)", "var(--color-100)", "var(--color-100)", "var(--color-100)"];
            Store.getInstance().home.menuSelected[this.index] = "var(--color-accent)";
        },
    };
}
