"use strict";
export default class Server {
    static _instance = null;
    serverUrl;
    proxyUrl;
    mailsUrl;
    mailSenderUrl;
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
        this.serverUrl = (window.location.href == "http://127.0.0.1:5500/code/app/src/" || window.location.href == "http://172.25.11.57:5500/code/app/src/") ? "http://172.25.11.57:5500/server/data/" : "https://test.valentin-lelievre.com/server/";
        this.proxyUrl = (window.location.href == "http://127.0.0.1:5500/code/app/src/" || window.location.href == "http://172.25.11.57:5500/code/app/src/") ? "http://172.25.11.57:8080" : "https://server.valentin-lelievre.com";
        this.mailsUrl = (window.location.href == "http://127.0.0.1:5500/code/app/src/" || window.location.href == "http://172.25.11.57:5500/code/app/src/") ? "http://172.25.11.57:8090" : "https://test.valentin-lelievre.com:8090";
        this.mailSenderUrl = (window.location.href == "http://127.0.0.1:5500/code/app/src/" || window.location.href == "http://172.25.11.57:5500/code/app/src/") ? "http://172.25.11.57:9000" : "https://test.valentin-lelievre.com:9000";
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
