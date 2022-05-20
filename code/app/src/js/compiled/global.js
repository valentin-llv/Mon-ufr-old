"use strict";
import Page from './navigation/page/page.js';
import BackButton from './navigation/buttons/backButton.js';
import GotoButton from './navigation/buttons/gotoButton.js';
import BottomMenuButton from './navigation/buttons/bottomMenuButton.js';
import InformationsBox from './pages/informations/information-box.js';
import { createApp } from '../../libs/petite-vue/petite-vue.js';
import PageNavigator from './navigation/pageNavigator/pageNavigator.js';
import DataManager from './data/data-manager/data-manager.js';
import Store from './petite-vue/store/store.js';
function infosBoxClicked(index) {
    let informations = Store.getInstance().informations;
    informations.currentInformation = informations.infos[index];
    PageNavigator.getInstance().goto("notification-content-page");
    setTimeout(() => {
        if (informations.infos[index].isUnseen) {
            informations.infos[index].isUnseen = false;
            DataManager.getInstance().data.news.newsRead.push(informations.infos[index].id);
            informations.infosUnseen--;
        }
    }, 300);
}
;
function openShareMenu() {
    if (navigator.share) {
        navigator.share({
            title: 'Mon UFR',
            text: 'Mon UFR la meilleur application pour  acceder à tous les services des UFR.',
            url: 'https://ufr-planning.com/',
        });
    }
}
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
    initPetiteVue();
}
window.onload = () => {
    main();
};
