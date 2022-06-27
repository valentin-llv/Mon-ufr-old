"use strict"

/* Importing code */

import Page from './navigation/page/page.js';
import Store from './petite-vue/store/store.js';

import BackButton from './navigation/buttons/backButton.js';
import GotoButton from './navigation/buttons/gotoButton.js';
import BottomMenuButton from './navigation/buttons/bottomMenuButton.js';

import InformationsBox from './pages/informations/information-box.js';
import PlanningBox from './pages/planning/planning.js';

import infosBoxClicked from './petite-vue/dom-functions/infos-box-clicked.js';
import openShareMenu from './petite-vue/dom-functions/open-share-menu.js';

/* Importing Petite Vue */

import { createApp } from '../../libs/petite-vue/petite-vue.js';
import ClassEvent from './pages/planning/event.js';
import MailBox from './pages/mails/mails.js';
import MailMessage from './pages/mails/message.js';
import Popup from './utils/popup.js';

/* Petite vue intialisation */

function initPetiteVue(): void {
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

/* Main function */

function main(): void {
    InformationsBox.getInstance();
    PlanningBox.getInstance();
    MailBox.getInstance();

    initPetiteVue();
}

window.onload = async () => {
    main();

    // navigator.mediaDevices.getUserMedia({
    //     audio: false,
    //     video: {
    //         facingMode: "environment",
    //     },
    // }).then((stream) => {
    //     let video = document.getElementById('qr-reader') as any;  
    //     video.srcObject = stream;
    //     video.play();
    // });
}

// http://ade.univ-tours.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?data=9101640d448493d466545be62dca3ab4f16bc99c1231ad75105654c3c757c8eb7620eb46444396bdf9e9eb1f96f57e6756c0259e9250fe3702f165b84e00ba5c,1