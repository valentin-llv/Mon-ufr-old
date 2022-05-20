"use strict"

/* Data manager */

export default class DataManager {
    private static _instance: DataManager = null;

    private reactive;
    private userData;

    private localSotrageName = "user-preference";

    public static getInstance(): DataManager {
        if(!DataManager._instance) DataManager._instance = new DataManager();
        return DataManager._instance;
    }

    constructor() {
        this.userData = this.loadData();
        this.saveData();

        this.listenVarChange();
    }

    private loadData()  {
        // Get data
        let data = localStorage.getItem(this.localSotrageName);

        if(data == undefined || data == "") {
            // Data does not exist, user is complitely new and has no data to migrate
            return this.createBaseDataStructure();
        } else data = JSON.parse(data);

        return this.correctData(data, this.createBaseDataStructure());
    }

    private correctData(data, structure) {
        let structureKeys = Object.keys(structure);
        let dataKeys = Object.keys(data);

        for(let i = 0; i < structureKeys.length; i++) {
            if(dataKeys.includes(structureKeys[i]) == false) {
                data[structureKeys[i]] = structure[structureKeys[i]];
            } else {
                if(typeof data[structureKeys[i]] === "object" && Array.isArray(data[structureKeys[i]]) == false) {
                    data[structureKeys[i]] = this.correctData(data[structureKeys[i]], structure[structureKeys[i]]);
                }
            }
        }

        return data;
    }

    private createBaseDataStructure() {
        // Return the default data tree
        return {
            news: {
                newsRead: [],
            },

            settings: {
                themeColor: "dark",
                accentColor: "#49b583",
            },
        };
    }

    saveData = () => {
        localStorage.setItem(this.localSotrageName, JSON.stringify(this.userData));
    }

    listenVarChange() {
        let manager = {
            get(target, key) {
                if (typeof target[key] === 'object' && target[key] !== null) return new Proxy(target[key], manager);
                else return target[key];
            },

            set: (target, key, value) => {
                Reflect.set(target, key, value);
                this.saveData();

                return true;
            }
        }

        this.reactive = new Proxy(this.userData, manager);
    }

    get data() {
        return this.reactive;
    }
}