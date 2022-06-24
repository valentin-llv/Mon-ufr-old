"use strict";
export default class DataManager {
    static _instance = null;
    reactive;
    userData;
    localSotrageName = "user-preference";
    static getInstance() {
        if (!DataManager._instance)
            DataManager._instance = new DataManager();
        return DataManager._instance;
    }
    constructor() {
        this.userData = this.loadData();
        this.saveData();
        this.listenVarChange();
    }
    loadData() {
        let data = localStorage.getItem(this.localSotrageName);
        if (data == undefined || data == "") {
            return this.createBaseDataStructure();
        }
        else
            data = JSON.parse(data);
        return this.correctData(data, this.createBaseDataStructure());
    }
    correctData(data, structure) {
        let structureKeys = Object.keys(structure);
        let dataKeys = Object.keys(data);
        for (let i = 0; i < structureKeys.length; i++) {
            if (dataKeys.includes(structureKeys[i]) == false) {
                data[structureKeys[i]] = structure[structureKeys[i]];
            }
            else {
                if (typeof data[structureKeys[i]] === "object" && Array.isArray(data[structureKeys[i]]) == false) {
                    data[structureKeys[i]] = this.correctData(data[structureKeys[i]], structure[structureKeys[i]]);
                }
            }
        }
        return data;
    }
    createBaseDataStructure() {
        return {
            news: {
                newsRead: [],
            },
            planning: {
                urls: [],
                eventNotes: {},
                elementsToHide: [],
                eventColors: {},
            },
            settings: {
                themeColor: "dark",
                accentColor: "#49b583",
                lowPerfMode: false,
                planning: {
                    planningTemplate: 1,
                },
            },
            mail: {
                hierarchy: {
                    "Réception": [],
                },
            },
        };
    }
    saveData = () => {
        localStorage.setItem(this.localSotrageName, JSON.stringify(this.userData));
    };
    listenVarChange() {
        let manager = {
            get(target, key) {
                if (typeof target[key] === 'object' && target[key] !== null)
                    return new Proxy(target[key], manager);
                else
                    return target[key];
            },
            set: (target, key, value) => {
                Reflect.set(target, key, value);
                this.saveData();
                return true;
            }
        };
        this.reactive = new Proxy(this.userData, manager);
    }
    get data() {
        return this.reactive;
    }
}
