"use strict"

/* Importing code */

import Store from '../../petite-vue/store/store.js';
import Server from '../../data/server-manager/server.js';

import FetchManager from '../../data/fetch-manager/fetch-manager.js';
import CacheManager from '../../data/cache-manager/cache-manager.js';
import DataManager from '../../data/data-manager/data-manager.js';

/* Informations box */

export default class PlanningBox {
    private static _instance: PlanningBox = null;

    private dataLoaded = false;

    public static getInstance(): PlanningBox {
        if(!PlanningBox._instance) PlanningBox._instance = new PlanningBox();
        return PlanningBox._instance;
    }

    constructor() {
        this.load();
    }

    async load() {
        // Data is alreay loaded, no need to load data again
        if(this.dataLoaded) return false;

        // Check if the use has planning urls registered
        if(DataManager.getInstance().data) {

        }
    }
}