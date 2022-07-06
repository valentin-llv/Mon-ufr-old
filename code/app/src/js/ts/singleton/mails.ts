"use strict"

import DataManager from './data-manager.js';
import FetchManager from './fetch-manager.js';
/* Importing code */

import Store from './store.js';

/* Informations box */

export default class MailBox {
    private static _instance: MailBox = null;

    private mail = Store.getInstance().mail;

    public static getInstance(): MailBox {
        if(!MailBox._instance) MailBox._instance = new MailBox();
        return MailBox._instance;
    }

    constructor() {
        this.checkForMailPreload();
        this.loadMails();
    }

    checkForMailPreload() {
        if(DataManager.getInstance().data.mail.hierarchy) {
            this.mail.displayLoader = false;
        }
    }

    async loadMails() {
        if(!DataManager.getInstance().data.mail.userId || !DataManager.getInstance().data.mail.password) {
            this.mail.displayLogin = true;
            this.mail.displayLoader = false;
            return false;
        } else {
            this.mail.displayLogin = false;
            this.mail.displayLoader = false;
        }

        let result = await FetchManager.getInstance().fetch("?query=getHierarchy&mail=22109034t&pass=8Gn5mt!U4!!E", "mailsUrl", {
            cache: false,
        });
    
        if(!result) {
            // An error occur
            console.log(result)
            return false;
        }

        if(!result.hierarchy) {
            // An error occur
            console.log(result)
            return false;
        }

        result.hierarchy = this.orderMails(result.hierarchy);
        this.updateMessages(result.hierarchy);

        if(Object.keys(result.hierarchy).length != this.mail.tabNames.length) {
            this.mail.tabNames = Object.keys(result.hierarchy)
        }

        DataManager.getInstance().data.mail.hierarchy = result.hierarchy;
        this.mail.unseenCounter = 0;
        this.mail.hierarchy = result.hierarchy;

        this.mail.displayLoader = false;
        this.mail.loading = false;
    }

    orderMails(hierarchy) {
        let keys = Object.keys(hierarchy);
        let result = {};

        for(let i = 0; i < keys.length; i++) {
            if(hierarchy[keys[i]].length > 0) result[keys[i]] = [];
            else continue;

            for(let j = hierarchy[keys[i]].length - 1; j > -1; j--) {
                result[keys[i]].push(hierarchy[keys[i]][j]);
            }
        }

        if(!result["Réception"]) {
            result["Réception"] = [];
        }

        if(!result["Corbeille"]) {
            result["Corbeille"] = [];
        }

        return result;
    }

    updateMessages(hierarchy) {
        for(let i = 0; i < this.mail.messages.length; i++) {
            if(hierarchy[this.mail.tabName]) {
                for(let j = 0; j < hierarchy[this.mail.tabName].length; j++) {
                    if(this.mail.messages[i].mailId.id == hierarchy[this.mail.tabName][j].id) {
                        this.mail.messages[i].update(hierarchy[this.mail.tabName][j]);
                    }
                }
            }
        }
    }
}