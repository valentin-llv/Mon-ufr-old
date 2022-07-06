"use strict"

// Imports

import Page from "./page.js";
import PageNavigator from "../singleton/page-navigator.js";
import PlanningDownloader from "../singleton/planning-downloader.js";
import DataManager from "../singleton/data-manager.js";
import PlanningBox from "../singleton/planning.js";
import Store from "../singleton/store.js";

// Page data

export default function AddPlanningPage(props) {
    // Default props
    let defaultProps = {
        pageName: props,
        pageAnimation: 'slide',
    };

    // Extends from page
    let extension = Page(defaultProps);

    // Mix the current component data and the data from the extended component
    return {...{
        mountedCallback: "load",

        displayLoader: false,
        errorMessage: "",

        url: "",

        cameraAutorized: false,
        cameraVideoSource: null,

        cameraError: "",

        load() {
            PageNavigator.getInstance().registerCloseCallback(this.pageName, this.closeScannPage);
        },

        async addPlanning(url, page = "url") {
            this.displayLoader = true;
    
            if(!this.checkUrlValidity(url)) {
                this.errorMessage = "L'url n'est pas valide";
                this.displayLoader = false;
                return false;
            }
    
            if(DataManager.getInstance().data.planning.urls.includes(url)) {
                this.errorMessage = "Ce planning a déjà été ajouté";
                this.displayLoader = false;
                return false;
            }
    
            let result = await new PlanningDownloader([url]).download("addPlanning");
            
            if(result.errorMessage) {
                this.errorMessage = result.errorMessage;
                this.displayLoader = false;
                return false;
            }
    
            this.errorMessage = "";
            this.displayLoader = false;
            this.cameraError = "";
            this.url = "";
            PlanningBox.getInstance().planning.showAddPlanningButton = false;
    
            DataManager.getInstance().data.planning.urls.push(url);
    
            if(page == "qrcode") PageNavigator.getInstance().goto("planning-page");
            else PageNavigator.getInstance().back();
    
            PlanningBox.getInstance().loadPlannings();
        },

        checkUrlValidity(url) {
            if(url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)) return true;
            else return false;
        },

        startScanning() {
            this.cameraError = "";

            if("mediaDevices" in navigator && "ImageCapture" in window && "BarcodeDetector" in window) {
                navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: {
                        facingMode: "environment",
                    },
                }).then((stream) => {
                    this.cameraAutorized = true;
                    this.cameraVideoSource = stream;
                }).catch(() => {
                    this.cameraError = "Vous devez accepter l'utilisation de la caméra pour lire le QR code.";
                });
            } else {
                this.cameraError = "Cette fonction n'est pas disponible sur votre appareil.";
            }
        },

        async scan() {
            let stream = this.cameraVideoSource;

            if(this.cameraAutorized) {
                let track = stream.getVideoTracks()[0];

                // @ts-ignore: Unreachable code error
                let imageCapture = new ImageCapture(track);
                let blobPhoto = await imageCapture.grabFrame();

                // @ts-ignore: Unreachable code error
                new BarcodeDetector({formats: ['qr_code']}).detect(blobPhoto).then(async (barcodes) => {
                    if(barcodes.length > 1) {
                        this.cameraError = "Trop d'éléments présent sur la photo.";
                        return false;
                    }

                    if(barcodes.length == 0) {
                        this.cameraError = "Aucun QR conde détécté";
                        return false;
                    }

                    if(barcodes[0].rawValue.includes('http://')) {
                        await this.addPlanning(barcodes[0].rawValue, "qrcode");
                        this.cameraError = this.errorMessage;
                        
                        if(this.cameraError == "") {
                            setTimeout(() => {
                                this.closeScannPage();
                            }, 300);
                        }
                    } else {
                        this.cameraError = "QR code invalide !";
                        return false;
                    }
                }).catch((err) => {
                    this.cameraError = "Une erreur s'est produite. Veuillez réessayer plus tard.";
                });
            }
        },

        closeScannPage() {
            setTimeout(() => {
                if(this.cameraVideoSource) {
                    this.cameraVideoSource.getTracks().forEach((track) => {
                        track.stop();
                    });

                    this.cameraAutorized = false;
                }
            }, 300);
        },
    }, ...extension};
}