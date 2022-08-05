"use strict";
import Page from './new-pages/page.js';
import Store from './singleton/store.js';
import BackButton from './components/back-button.js';
import GotoButton from './components/goto-button.js';
import BottomMenuButton from './components/bottom-menu-button.js';
import PlanningBox from './singleton/planning.js';
import { createApp } from '../../libs/petite-vue/petite-vue.js';
import ClassEvent from './components/event.js';
import MailBox from './singleton/mails.js';
import MailMessage from './components/message.js';
import Popup from './components/popup.js';
import CacheCounter from './components/cache-counter.js';
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
import PageNavigator from './singleton/page-navigator.js';
import PlanningSettingsPage from './new-pages/planning-settings.js';
import MailsSettingsPage from './new-pages/mails-settings.js';
function initPetiteVue() {
    createApp({
        store: Store.getInstance(),
        HomePage,
        NotificationPage,
        FeedbackPage,
        ShareAppPage,
        PersonalizationPage,
        StorageManager,
        AddPlanningPage,
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
        PlanningSettingsPage,
        MailMessage,
        MailsSettingsPage,
        Popup,
        CacheCounter,
    }).mount();
}
function main() {
    PlanningBox.getInstance();
    MailBox.getInstance();
    initPetiteVue();
    window.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        PageNavigator.getInstance().back();
    });
}
window.onload = () => {
    main();
};
