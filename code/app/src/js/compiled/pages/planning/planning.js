"use strict";
import DataManager from '../../data/data-manager/data-manager.js';
export default class PlanningBox {
    static _instance = null;
    dataLoaded = false;
    static getInstance() {
        if (!PlanningBox._instance)
            PlanningBox._instance = new PlanningBox();
        return PlanningBox._instance;
    }
    constructor() {
        this.load();
    }
    async load() {
        if (this.dataLoaded)
            return false;
        if (DataManager.getInstance().data) {
        }
    }
}
