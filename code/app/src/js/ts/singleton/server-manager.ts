"use strict"

/* Server */

export default class Server {
    private static _instance: Server = null;

    private serverUrl: string;
    private proxyUrl: string;
    private mailsUrl: string;
    private mailSenderUrl: string;

    private isServerConnected: boolean;
    private internetConnectivityStatus: boolean;

    private internetConnectivityObservers:Array<any> = [];

    public static getInstance(): Server {
        if(!Server._instance) Server._instance = new Server();
        return Server._instance;
    };

    constructor() {
        this.setServerUrl();
        this.listenConnectivityStatusEvents();
    };

    private setServerUrl(): void {
        this.serverUrl = (window.location.href == "http://127.0.0.1:5500/code/app/src/" || window.location.href == "http://192.168.1.4:5500/code/app/src/") ? "http://192.168.1.4:5500/code/server/" : "https://test.valentin-lelievre.com/server/";
        this.proxyUrl = (window.location.href == "http://127.0.0.1:5500/code/app/src/" || window.location.href == "http://172.25.11.57:5500/code/app/src/") ? "http://192.168.1.4:3000" : "https://server.valentin-lelievre.com";
        this.mailsUrl = (window.location.href == "http://127.0.0.1:5500/code/app/src/" || window.location.href == "http://172.25.11.57:5500/code/app/src/") ? "http://192.168.1.4:8090" : "https://test.valentin-lelievre.com:8090";
        this.mailSenderUrl = (window.location.href == "http://127.0.0.1:5500/code/app/src/" || window.location.href == "http://172.25.11.57:5500/code/app/src/") ? "http://192.168.1.4:9000" : "https://test.valentin-lelievre.com:9000";
    };

    private listenConnectivityStatusEvents(): void {
        window.addEventListener('online', this.updateInternetConnectivityStatus);
        window.addEventListener('offline', this.updateInternetConnectivityStatus);

        this.updateInternetConnectivityStatus();
    };

    private updateInternetConnectivityStatus = (): void => {
        this.internetConnectivityStatus = navigator.onLine;
        this.informObservers();
    };

    private informObservers(): void {
        for(let i = 0; i < this.internetConnectivityObservers.length; i++) {
            this.internetConnectivityObservers[i]();
        }
    };

    public registerInternetConnectivityStatusUpdate(callback): void {
        this.internetConnectivityObservers.push(callback);
    };

    get isInternetConnected() {
        return this.internetConnectivityStatus;
    };

    get serverBaseUrl() {
        return this.serverUrl;
    };

    get proxyBaseUrl() {
        return this.proxyUrl;
    };
}