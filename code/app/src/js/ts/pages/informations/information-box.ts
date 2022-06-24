"use strict"

/* Importing code */

import Store from '../../petite-vue/store/store.js';
import Server from '../../data/server-manager/server.js';

import FetchManager from '../../data/fetch-manager/fetch-manager.js';
import CacheManager from '../../data/cache-manager/cache-manager.js';
import DataManager from '../../data/data-manager/data-manager.js';

/* Informations box */

export default class InformationsBox {
    private static _instance: InformationsBox = null;

    private dataLoaded = false;
    private ressourcesPath = "data/informations/informations.json";

    private informations = Store.getInstance().informations;

    private errorMessages = {
        head1: "La connexion a internet n'est pas disponible",
        head2: "La connexion au serveur a échoué.",

        messageEnd: "Impossible de récupérer les informations.",
    }

    public static getInstance(): InformationsBox {
        if(!InformationsBox._instance) InformationsBox._instance = new InformationsBox();
        return InformationsBox._instance;
    }

    constructor() {
        this.load();
    }

    public async load() {
        // Data is alreay loaded, no need to load data again
        if(this.dataLoaded) return false;

        // Check if internet connexion is available
        if(!Server.getInstance().isInternetConnected) {
            this.loadWithoutInternet(this.errorMessages.head1);

            Server.getInstance().registerInternetConnectivityStatusUpdate(this.load);
            return false;
        }
        
        // Get the requested ressources
        let result = await FetchManager.getInstance().fetch(this.ressourcesPath, "serverBaseUrl");

        // Check if result is valid
        if(!result) {
            this.loadWithoutInternet(this.errorMessages.head2);
            return false;
        }

        // Fill the page with the result data
        this.succes(result);
    }

    private async loadWithoutInternet(reason: string): Promise<any> {
        let result = await CacheManager.getInstance().checkCache(Server.getInstance()["serverBaseUrl"] + this.ressourcesPath, false);
        if(!result) {
            this.informations.errorMessage = reason + " " + this.errorMessages.messageEnd;
            this.informations.displayLoader = false;

            return false;
        }
        
        this.succes(result);
    }

    private succes(result) {
        [this.informations.infos, this.informations.infosUnseen] = this.parse(result.news);

        this.informations.displayLoader = false;
        this.informations.errorMessage = "";
    }

    private parse(news) {
        let newsRead = DataManager.getInstance().data.news.newsRead;
        let unseen = 0;

        let parsed = [];
        for(let i = 0; i < news.length; i++) {
            if(newsRead.includes(news[i].id)) news[i].isUnseen = false;
            else {
                news[i].isUnseen = true;
                unseen ++;
            }
        
            parsed.push(news[i]);
        }

        return [parsed, unseen];
    }
}