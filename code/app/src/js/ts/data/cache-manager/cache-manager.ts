"use strict"

/* Cache manager */

export default class CacheManager {
    private static _instance: CacheManager = null;

    private cacheStorageName = "data-cache";
    private timeoutTime = 1000 * 60 * 60; // 1 hour

    public static getInstance(): CacheManager {
        if(!CacheManager._instance) CacheManager._instance = new CacheManager();
        return CacheManager._instance;
    };

    constructor() {};

    public async checkCache(url: string, timeoutCheck: boolean): Promise<any> {
        if('serviceWorker' in navigator) {
            return caches.open(this.cacheStorageName).then((cache) => {
                return cache.match(url).then(async (data) => {
                    if(!data) {
                        return false;
                    }

                    let jsonData = await data.json();
                    if(timeoutCheck && jsonData.date + this.timeoutTime < Date.now()) {
                        return false;
                    }

                    return jsonData.data;
                }).catch(() => {
                    return false;
                });
            }).catch(() => {
                return false;
            });
        } else return false;
    };

    public async cacheData(url: string, data: Object): Promise<boolean> {
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
    };

    private createFakeResponse(url: string, data: Object): Response {
        let warpedData = {
            date: Date.now(),
            data: data,
        };

        let jsonData = JSON.stringify(warpedData);
        let blob = new Blob([jsonData], {type: "application/json"});

        let responseStatus = {"status": 200 , "statusText": url};
        return new Response(blob, responseStatus);
    };
}