"use strict";
export default class CacheManager {
    static _instance = null;
    cacheStorageName = "data-cache";
    timeoutTime = 1000 * 60 * 60;
    static getInstance() {
        if (!CacheManager._instance)
            CacheManager._instance = new CacheManager();
        return CacheManager._instance;
    }
    constructor() { }
    async checkCache(url, timeoutCheck) {
        if ('serviceWorker' in navigator) {
            return caches.open(this.cacheStorageName).then((cache) => {
                return cache.match(url).then(async (data) => {
                    if (!data) {
                        return false;
                    }
                    let jsonData = await data.json();
                    if (timeoutCheck && jsonData.date + this.timeoutTime < Date.now()) {
                        return false;
                    }
                    return jsonData.data;
                }).catch(() => {
                    return false;
                });
            }).catch(() => {
                return false;
            });
        }
        else
            return false;
    }
    async cacheData(url, data) {
        let fakeResponse = this.createFakeResponse(url, data);
        return await new Promise((resolve) => {
            caches.open(this.cacheStorageName).then((cache) => {
                return cache.put(url, fakeResponse);
            }).then(() => {
                resolve(true);
            }).catch(() => {
                resolve(false);
            });
        });
    }
    createFakeResponse(url, data) {
        let warpedData = {
            date: Date.now(),
            data: data,
        };
        let jsonData = JSON.stringify(warpedData);
        let blob = new Blob([jsonData], { type: "application/json" });
        let responseStatus = { "status": 200, "statusText": url };
        return new Response(blob, responseStatus);
    }
}
