"use strict";
import CacheManager from '../cache-manager/cache-manager.js';
import Server from '../server-manager/server.js';
export default class FetchManager {
    static _instance = null;
    requestTimeout = 1000 * 15;
    retryDelay = 1000 * 3;
    static getInstance() {
        if (!FetchManager._instance)
            FetchManager._instance = new FetchManager();
        return FetchManager._instance;
    }
    ;
    constructor() { }
    ;
    async fetch(url, server) {
        let result = await CacheManager.getInstance().checkCache(url, true);
        if (result)
            return result;
        return new Promise(async (resolve) => {
            let result = false;
            let i = 0;
            while (!result && i < 3) {
                if (i != 0) {
                    result = await new Promise((bottomResolve) => {
                        setTimeout(async () => {
                            bottomResolve(await this.get(url, server));
                        }, this.retryDelay);
                    });
                }
                else
                    result = await this.get(url, server);
                i++;
            }
            resolve(result);
        });
    }
    ;
    async get(url, server) {
        return new Promise(async (resolve) => {
            await fetch(Server.getInstance()[server] + url).then((data) => {
                return data.json();
            }).then((data) => {
                CacheManager.getInstance().cacheData(Server.getInstance()[server] + url, data);
                resolve(data);
            }).catch(() => {
                resolve(false);
            });
            setTimeout(() => {
                resolve(false);
            }, this.requestTimeout);
        });
    }
    ;
}
