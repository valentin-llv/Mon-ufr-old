"use strict";
import Page from './navigation/page/page.js';
import Store from './petite-vue/store/store.js';
import BackButton from './navigation/buttons/backButton.js';
import GotoButton from './navigation/buttons/gotoButton.js';
import BottomMenuButton from './navigation/buttons/bottomMenuButton.js';
import InformationsBox from './pages/informations/information-box.js';
import PlanningBox from './pages/planning/planning.js';
import infosBoxClicked from './petite-vue/dom-functions/infos-box-clicked.js';
import openShareMenu from './petite-vue/dom-functions/open-share-menu.js';
import { createApp } from '../../libs/petite-vue/petite-vue.js';
function initPetiteVue() {
    createApp({
        store: Store.getInstance(),
        infosBoxClicked,
        openShareMenu,
        Page,
        BottomMenuButton,
        GotoButton,
        BackButton,
    }).mount();
}
function main() {
    InformationsBox.getInstance();
    PlanningBox.getInstance();
    initPetiteVue();
}
window.onload = () => {
    main();
};
