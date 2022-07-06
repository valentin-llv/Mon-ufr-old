"use strict"

/* Importing code */

import Page from './new-pages/page.js';
import Store from './singleton/store.js';

import BackButton from './components/backButton.js';
import GotoButton from './components/gotoButton.js';
import BottomMenuButton from './components/bottomMenuButton.js';

import PlanningBox from './singleton/planning.js';

/* Importing Petite Vue */

import { createApp } from '../../libs/petite-vue/petite-vue.js';
import ClassEvent from './components/event.js';
import MailBox from './singleton/mails.js';
import MailMessage from './components/message.js';
import Popup from './components/popup.js';
import CacheCounter from './components/cache-counter.js';





// Pages

import HomePage from './new-pages/home.js';
import ClassEventLoader from './components/class-event-loader.js';
import Notification from './components/notification.js';
import NotificationPage from './new-pages/notifications.js';
import NotificationLoader from './components/notification-loader.js';
import FeedbackPage from './new-pages/feedback.js';
import SettingsButton from './components/settings-button.js';
import PageHeader from './components/page-header.js';
import ShareAppPage from './new-pages/share-app.js';
import PersonalizationPage from './new-pages/personalization.js';
import StorageManager from './new-pages/storage-manager.js';
import AddPlanningPage from './new-pages/add-planning.js';

/* Petite vue intialisation */

function initPetiteVue(): void {
    createApp({
        store: Store.getInstance(),

        MailMessage,

        CacheCounter,

        Popup,





        // Pages
        HomePage,
        NotificationPage,
        FeedbackPage,
        ShareAppPage,
        PersonalizationPage,
        StorageManager,
        AddPlanningPage,

        // Components
        Page,
        PageHeader,

        GotoButton,
        BackButton,
        SettingsButton,
        BottomMenuButton,

        Notification,
        NotificationLoader,

        ClassEvent,
        ClassEventLoader,
    }).mount();
}

/* Main function */

function main(): void {
    //InformationsBox.getInstance();
    PlanningBox.getInstance();
    MailBox.getInstance();

    initPetiteVue();
}

window.onload = async () => {
    main();
}

// http://ade.univ-tours.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?data=9101640d448493d466545be62dca3ab4f16bc99c1231ad75105654c3c757c8eb7620eb46444396bdf9e9eb1f96f57e6756c0259e9250fe3702f165b84e00ba5c,1