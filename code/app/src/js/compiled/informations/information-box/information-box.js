"use strict";
import Store from '../../store/store.js';
import Server from '../../server-manager/server.js';
import FetchManager from '../../fetch-manager/fetch-manager.js';
import CacheManager from '../../cache-manager/cache-manager.js';
import DataManager from '../../data-manager/data-manager.js';
export default class InformationsBox {
    static _instance = null;
    dataLoaded = false;
    ressourcesPath = "/data/informations/informations.json";
    informations = Store.getInstance().informations;
    errorMessages = {
        head1: "La connexion a internet n'est pas disponible",
        head2: "La connexion au serveur a échoué.",
        messageEnd: "Impossible de récupérer les informations.",
    };
    static getInstance() {
        if (!InformationsBox._instance)
            InformationsBox._instance = new InformationsBox();
        return InformationsBox._instance;
    }
    ;
    constructor() {
        this.load();
    }
    async load() {
        if (this.dataLoaded)
            return false;
        if (!Server.getInstance().isInternetConnected) {
            this.loadWithoutInternet(this.errorMessages.head1);
            Server.getInstance().registerInternetConnectivityStatusUpdate(this.load);
            return false;
        }
        let result = await FetchManager.getInstance().fetch(this.ressourcesPath, "serverBaseUrl");
        if (!result) {
            this.loadWithoutInternet(this.errorMessages.head2);
            return false;
        }
        this.succes(result);
    }
    ;
    async loadWithoutInternet(reason) {
        let result = await CacheManager.getInstance().checkCache(this.ressourcesPath, false);
        if (!result) {
            this.informations.errorMessage = reason + " " + this.errorMessages.messageEnd;
            this.informations.displayLoader = false;
            return false;
        }
        this.succes(result);
    }
    ;
    succes(result) {
        [this.informations.infos, this.informations.infosUnseen] = this.parse(result.news);
        this.informations.displayLoader = false;
        this.informations.errorMessage = "";
    }
    ;
    parse(news) {
        let newsRead = DataManager.getInstance().data.news.newsRead;
        let unseen = 0;
        let parsed = [];
        for (let i = 0; i < news.length; i++) {
            if (newsRead.includes(news[i].id))
                news[i].isUnseen = false;
            else {
                news[i].isUnseen = true;
                unseen++;
            }
            parsed.push(news[i]);
        }
        return [parsed, unseen];
    }
    ;
}
