"use strict";
export default class Server {
    static _instance = null;
    serverUrl;
    proxyUrl;
    mailsUrl;
    isServerConnected;
    internetConnectivityStatus;
    internetConnectivityObservers = [];
    static getInstance() {
        if (!Server._instance)
            Server._instance = new Server();
        return Server._instance;
    }
    ;
    constructor() {
        this.setServerUrl();
        this.listenConnectivityStatusEvents();
    }
    ;
    setServerUrl() {
        this.serverUrl = (window.location.href == "http://127.0.0.1:5500/code/app/src/" || window.location.href == "http://127.0.0.1:5500/code/app/src/") ? "http://127.0.0.1:5500/code/server/" : "";
        this.proxyUrl = (window.location.href == "http://127.0.0.1:5500/code/app/src/" || window.location.href == "http://127.0.0.1:5500/code/app/src/") ? "http://127.0.0.1:8080" : "";
        this.mailsUrl = (window.location.href == "http://127.0.0.1:5500/code/app/src/" || window.location.href == "http://127.0.0.1:5500/code/app/src/") ? "http://127.0.0.1:8090" : "";
    }
    ;
    listenConnectivityStatusEvents() {
        window.addEventListener('online', this.updateInternetConnectivityStatus);
        window.addEventListener('offline', this.updateInternetConnectivityStatus);
        this.updateInternetConnectivityStatus();
    }
    ;
    updateInternetConnectivityStatus = () => {
        this.internetConnectivityStatus = navigator.onLine;
        this.informObservers();
    };
    informObservers() {
        for (let i = 0; i < this.internetConnectivityObservers.length; i++) {
            this.internetConnectivityObservers[i]();
        }
    }
    ;
    registerInternetConnectivityStatusUpdate(callback) {
        this.internetConnectivityObservers.push(callback);
    }
    ;
    get isInternetConnected() {
        return this.internetConnectivityStatus;
    }
    ;
    get serverBaseUrl() {
        return this.serverUrl;
    }
    ;
    get proxyBaseUrl() {
        return this.proxyUrl;
    }
    ;
}
