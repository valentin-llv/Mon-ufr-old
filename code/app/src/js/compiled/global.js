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
import ClassEvent from './pages/planning/event.js';
import MailBox from './pages/mails/mails.js';
import MailMessage from './pages/mails/message.js';
import Popup from './utils/popup.js';
function initPetiteVue() {
    createApp({
        store: Store.getInstance(),
        infosBoxClicked,
        openShareMenu,
        Page,
        BottomMenuButton,
        GotoButton,
        BackButton,
        ClassEvent,
        MailMessage,
        Popup,
    }).mount();
}
function main() {
    InformationsBox.getInstance();
    PlanningBox.getInstance();
    MailBox.getInstance();
    initPetiteVue();
}
window.onload = async () => {
    main();
};
