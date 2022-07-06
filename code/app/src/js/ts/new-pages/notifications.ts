"use strict"

// Imports

import Page from "./page.js";
import CacheManager from "../singleton/cache-manager.js";
import Server from "../singleton/server-manager.js";
import DataManager from "../singleton/data-manager.js";
import FetchManager from "../singleton/fetch-manager.js";
import Store from "../singleton/store.js";

// Page data

export default function NotificationPage(props) {
    // Default props
    let defaultProps = {
        pageName: 'notification-page',
        pageAnimation: 'slide',
    };

    // Extends from page
    let extension = Page(defaultProps);

    // Mix the current component data and the data from the extended component
    return {...{
        mountedCallback: "load",

        store: Store.getInstance().notifications,

        targetServer: "serverBaseUrl",
        ressourcesPath: "data/informations/informations.json",

        errorMessages: {
            head1: "La connexion a internet n'est pas disponible",
            head2: "La connexion au serveur a échoué.",

            messageEnd: "Impossible de récupérer les informations.",
        },

        async load() {
            // Check if internet connexion is available
            if(!Server.getInstance().isInternetConnected) {
                this.loadWithoutInternet(this.errorMessages.head1);
                return false;
            }
            
            // Get the requested ressources
            let result = await FetchManager.getInstance().fetch(this.ressourcesPath, this.targetServer);

            // Check if result is valid
            if(!result) {
                this.loadWithoutInternet(this.errorMessages.head2);
                return false;
            }

            // Fill the page with the result data
            this.succes(result);
        },

        async loadWithoutInternet(reason: string): Promise<any> {
            let result = await CacheManager.getInstance().checkCache(Server.getInstance()[this.targetServer] + this.ressourcesPath);

            if(!result) {
                this.store.errorMessage = reason + " " + this.errorMessages.messageEnd;
                this.store.displayLoader = false;
            } else this.succes(result);
        },

        succes(result) {
            [this.store.infos, this.store.infosUnseen] = this.parse(result.news);
            this.store.displayLoader = false;
        },

        parse(news) {
            let newsRead = DataManager.getInstance().data.news.newsRead;
            let unSeen = [];

            for(let i = 0; i < news.length; i++) {
                if(newsRead.includes(news[i].id)) news[i].isUnseen = false;
                else {
                    news[i].isUnseen = true;
                    unSeen.push(news[i].id);
                }
            }

            return [news, unSeen];
        }
    }, ...extension};
}