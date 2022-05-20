"use strict"

/* Importing code */

import Page from './navigation/page/page.js';

import BackButton from './navigation/buttons/backButton.js';
import GotoButton from './navigation/buttons/gotoButton.js';
import BottomMenuButton from './navigation/buttons/bottomMenuButton.js';
import InformationsBox from './pages/informations/information-box.js';

/* Importing Petite Vue */

import { createApp } from '../../libs/petite-vue/petite-vue.js';
import PageNavigator from './navigation/pageNavigator/pageNavigator.js';
import DataManager from './data/data-manager/data-manager.js';
import Store from './petite-vue/store/store.js';
import Server from './data/server-manager/server.js';

/* DOM function */

function infosBoxClicked(index) {
    let informations = Store.getInstance().informations;

    informations.currentInformation = informations.infos[index];
    PageNavigator.getInstance().goto("notification-content-page");

    setTimeout(() => {
        if(informations.infos[index].isUnseen) {
            informations.infos[index].isUnseen = false;
            DataManager.getInstance().data.news.newsRead.push(informations.infos[index].id);
            informations.infosUnseen --;
        }
    }, 300);
};

function openShareMenu() {
    if(navigator.share) {
        navigator.share({
            title: 'Mon UFR',
            text: 'Mon UFR la meilleur application pour  acceder à tous les services des UFR.',
            url: 'https://ufr-planning.com/',
        });
    }
}

/* Planning box */

// class PlanningBox {
//     private static _instance: PlanningBox = null;

//     private dataLoaded = false;

//     public static getInstance(): PlanningBox {
//         if(!PlanningBox._instance) PlanningBox._instance = new PlanningBox();
//         return PlanningBox._instance;
//     };

//     constructor() {
//         this.load();
//     }

//     load() {
//         // // Data is alreay loaded, no need to load data again
//         // if(this.dataLoaded) return false;

//         // // Check if internet connexion is available
//         // if(!Server.getInstance().isInternetConnected) {
//         //     this.loadWithoutInternet(this.errorMessages.head1);

//         //     Server.getInstance().registerInternetConnectivityStatusUpdate(this.load);
//         //     return false;
//         // }
//         // // Get the requested ressources
//         // let result = await FetchManager.getInstance().fetch(this.ressourcesPath, "serverBaseUrl");

//         // // Check if result is valid
//         // if(!result) {
//         //     this.loadWithoutInternet(this.errorMessages.head2);
//         //     return false;
//         // }

//         // // Fill the page with the result data
//         // this.succes(result);

//         // Data is alreay loaded, no need to load data again
//         if(this.dataLoaded) return false;

//         // Check if internet connexion is available
//         if(!Server.getInstance().isInternetConnected) {
//             this.loadWithoutInternet(this.errorMessages.head1);

//             Server.getInstance().registerInternetConnectivityStatusUpdate(this.load);
//             return false;
//         }
//         // Get the requested ressources
//         let result = await FetchManager.getInstance().fetch(this.ressourcesPath, "serverBaseUrl");
//     };

//     private async loadWithoutInternet(reason: string): Promise<any> {
//         let result = await CacheManager.getInstance().checkCache(this.ressourcesPath, false);
//         if(!result) {
//             this.informations.errorMessage = reason + " " + this.errorMessages.messageEnd;
//             this.informations.displayLoader = false;

//             return false;
//         }
        
//         this.succes(result);
//     };
// }

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
    }).mount();
}

/* Main function */

function main(): void {
    InformationsBox.getInstance();
    //PlanningBox.getInstance();

    initPetiteVue();
}

window.onload = () => {
    main();
}

// http://ade.univ-tours.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?data=9101640d448493d466545be62dca3ab4f16bc99c1231ad75105654c3c757c8eb7620eb46444396bdf9e9eb1f96f57e6756c0259e9250fe3702f165b84e00ba5c,1