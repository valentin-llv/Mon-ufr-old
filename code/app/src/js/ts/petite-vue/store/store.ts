"use strict"

/* Importing Petite Vue */

import { reactive } from '../../../../libs/petite-vue/petite-vue.js';
import DataManager from '../../data/data-manager/data-manager.js';
import FetchManager from '../../data/fetch-manager/fetch-manager.js';
import PageNavigator from '../../navigation/pageNavigator/pageNavigator.js';
import PlanningBox from '../../pages/planning/planning.js';
import DateManager from '../../utils/date-manager.js';
import Utils from '../../utils/utils.js';

/* Reactive store */ 

export default class Store {
    private static _instance: Store = null;

    private store;

    public static getInstance(): any {
        if(!Store._instance) Store._instance = new Store();
        return Store._instance.store;
    }

    constructor() {
        this.initialiseStore();
    }

    initialiseStore() {
        this.store = reactive({
            home: {
                date: Utils.getDateString(new Date()),
                hour: Utils.getHourString(new Date()),
                menuSelected: ["var(--color-accent)", "var(--color-100)", "var(--color-100)", "var(--color-100)"],
            },

            themeColor: {
                color: DataManager.getInstance().data.settings.themeColor,

                toggle(element) {
                    this.color = element.checked == true ? "dark" : "light";
                    DataManager.getInstance().data.settings.themeColor = this.color;
                    this.update();
                },

                update() {
                    let shade = [900, 800, 700, 600, 300, 200, 100];
                    for(let i = 0; i < shade.length; i++) {
                        document.documentElement.style.setProperty('--color-' + shade[i], getComputedStyle(document.documentElement).getPropertyValue('--color-' + shade[i] + "-" + DataManager.getInstance().data.settings.themeColor));
                    }
                },
            },

            settings: {
                lowPerfMode: DataManager.getInstance().data.settings.lowPerfMode,

                toggleLowPerfMode(element) {
                    this.lowPerfMode = element.checked;
                    DataManager.getInstance().data.settings.lowPerfMode = this.lowPerfMode;
                    this.updateLowPerfMode();
                },

                updateLowPerfMode() {
                    let transitionDuration = this.lowPerfMode == true ? 0 : 300;
                    document.documentElement.style.setProperty('--transition-duration', transitionDuration + "ms");
                },

                feedbackFrom: "",
                feedbackMessage: "",

                feedbackFromBorderColor: "transparent",
                feedbackMessageBorderColor: "transparent",

                sendMail() {
                    if(this.feedbackFrom && this.feedbackMessage) {
                        FetchManager.getInstance().fetch("?from=" + this.feedbackFrom + "&message=" + this.feedbackMessage, "mailSenderUrl", {
                            cache: false,
                        });

                        PageNavigator.getInstance().back();

                        this.feedbackFrom = "";
                        this.feedbackMessage = "";

                        this.feedbackFromBorderColor = "transparent";
                        this.feedbackMessageBorderColor = "transparent";
                    } else {
                        this.feedbackFromBorderColor = "rgba(255, 0, 0, 0.5)";
                        this.feedbackMessageBorderColor = "rgba(255, 0, 0, 0.5)";
                    }
                },
            },

            accentColor: {
                colors: ["#49b583", "#fd6868", "#5575e7", "#FFBD69", "#118AB2", "#4F5D75", "#631A86", "#EE6C4D"],

                toggle(index) {
                    DataManager.getInstance().data.settings.accentColor = this.colors[index];
                    document.documentElement.style.setProperty('--color-accent', this.colors[index]);
                },
            },

            popup: {
                text: "",
                callback: null,

                usePopup(text, callback) {
                    this.text = text;
                    this.callback = callback;
                },
            },

            informations: {
                currentInformation: "",

                infos: [],
                infosUnseen: 0,

                errorMessage: "",
                displayLoader: true,
            },

            planningSettings: {
                planningTemplate: DataManager.getInstance().data.settings.planning.planningTemplate,

                planningTemplateToggle(element) {
                    this.planningTemplate = element.checked == true ? 2 : 1;
                    DataManager.getInstance().data.settings.planning.planningTemplate = this.planningTemplate;
                },
            },

            planning: {
                tabsDisplay: 0,

                changeSelectedTab(index) {
                    this.tabsDisplay = index;
                },

                events: [],
                eventNotes: DataManager.getInstance().data.planning.eventNotes,
                eventColors: DataManager.getInstance().data.planning.eventColors,

                week: {
                    daysName: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
                    daysNumber: [],
                    monthName: "",

                    selectedDay: false,
                    selectedWeek: 0,

                    weekDisplay: [],

                    selectPreviousWeek() {
                        if(this.selectedWeek > 0) this.selectedWeek -= 1;
                        PlanningBox.getInstance().calcWeekTabDays();
                        PlanningBox.getInstance().calcWeekTabContent();
                    },

                    selectNextWeek() {
                        this.selectedWeek += 1;
                        PlanningBox.getInstance().calcWeekTabDays();
                        PlanningBox.getInstance().calcWeekTabContent();
                    },

                    changeSelectedDay(index) {
                        this.selectedDay = index - 1;
                        PlanningBox.getInstance().calcWeekTabContent();
                    },
                },

                search: {
                    events: [],

                    search(element) {
                        PlanningBox.getInstance().fillSearchTab(element.value);
                    },
                },

                errorMessage: "",
                popMessage: {
                    title: "",
                    content: "",
                },

                classToday: "0 cours",
                nextClassTime: "",
                nextClass: {},

                showAddPlanningButton: false,
                displayLoader: true,
            },

            addPlanning: {
                displayLoader: false,
                errorMessage: "",

                url: "",

                add() {
                    PlanningBox.getInstance().addPlanning(this.url);
                },

                cameraAutorized: false,
                cameraVideoSource: null,

                cameraError: "",

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
                        new BarcodeDetector({formats: ['qr_code']}).detect(blobPhoto).then((barcodes) => {
                            if(barcodes.length > 1) {
                                this.cameraError = "Trop d'éléments présent sur la photo.";
                                return false;
                            }

                            if(barcodes.length == 0) {
                                this.cameraError = "Aucun QR conde détécté";
                                return false;
                            }

                            if(barcodes[0].rawValue.includes('http://')) {
                                PlanningBox.getInstance().addPlanning(barcodes[0].rawValue, "qrcode");
                                this.cameraError = this.errorMessage;
                                
                                setTimeout(() => {
                                    this.closeScannPage();
                                }, 300);
                            } else {
                                this.cameraError = "QR code invalide !";
                                return false;
                            }
                        }).catch(err => {
                            this.cameraError = "Une erreur s'est produite. Veuillez réessayer plus tard.";
                        });
                    }
                },

                closeScannPage() {
                    setTimeout(() => {
                        Store.getInstance().addPlanning.cameraVideoSource.getTracks().forEach((track) => {
                            track.stop();
                        });
    
                        Store.getInstance().addPlanning.cameraAutorized = false;
                    }, 300);
                },
            },

            eventContent: {
                event: "",
                eventColors: ["#49b583", "#fd6868", "#5575e7", "#FFBD69", "#118AB2", "#4F5D75", "#631A86", "#EE6C4D"],

                hasNote: false,
                noteContent: "",
                showInput: false,

                openPage(event) {
                    this.event = event;
                    
                    if(PlanningBox.getInstance().hasEventNote(event)) {
                        this.hasNote = true;
                        this.noteContent = PlanningBox.getInstance().getNote(event);
                    } else {
                        this.hasNote = false;
                        this.noteContent = "";
                    }

                    this.showInput = false;
                    PageNavigator.getInstance().goto("event-content-page");
                },

                addNote() {
                    console.log(this)
                    if(this.noteContent == "") {
                        if(this.hasNote) this.deleteNote();
                        this.showInput = false;

                        return false;
                    }

                    DataManager.getInstance().data.planning.eventNotes[this.event.uid] = this.noteContent;
                    this.syncNotes();

                    this.hasNote = true;
                    this.showInput = false;
                },

                deleteNote() {
                    let note = {
                        target: this.event.uid,
                        content: DataManager.getInstance().data.planning.eventNotes[this.event.uid],
                    };

                    delete DataManager.getInstance().data.planning.eventNotes[this.event.uid];
                    DataManager.getInstance().data.planning = DataManager.getInstance().data.planning;
                    this.syncNotes();

                    this.showInput = false;
                    this.hasNote = false;
                    this.noteContent = "";

                    Store.getInstance().popup.usePopup("Note supprimé", () => {
                        this.hasNote = true;
                        this.noteContent = note.content;

                        DataManager.getInstance().data.planning.eventNotes[note.target] = note.content;
                        this.syncNotes();
                    });
                },

                syncNotes() {
                    Store.getInstance().planning.eventNotes = DataManager.getInstance().data.planning.eventNotes;
                },

                hideElement() {
                    DataManager.getInstance().data.planning.elementsToHide.push(this.event.uid);

                    PlanningBox.getInstance().loadPlannings();

                    let tab = Store.getInstance().planning.tabsDisplay;
                    Store.getInstance().planning.tabsDisplay = -1;
                    setTimeout(() => {
                        Store.getInstance().planning.tabsDisplay = tab;
                    }, 100);

                    PageNavigator.getInstance().back();

                    Store.getInstance().popup.usePopup("Evénement caché", () => {
                        DataManager.getInstance().data.planning.elementsToHide.splice(DataManager.getInstance().data.planning.elementsToHide.indexOf(this.event.uid), 1);
                        
                        let tab = Store.getInstance().planning.tabsDisplay;
                        Store.getInstance().planning.tabsDisplay = -1;
                        setTimeout(() => {
                            Store.getInstance().planning.tabsDisplay = tab;
                        }, 100);

                        PlanningBox.getInstance().loadPlannings();
                    });
                },

                hideAllElements() {
                    DataManager.getInstance().data.planning.elementsToHide.push(this.event.categoryId);

                    PlanningBox.getInstance().loadPlannings();

                    let tab = Store.getInstance().planning.tabsDisplay;
                    Store.getInstance().planning.tabsDisplay = -1;
                    setTimeout(() => {
                        Store.getInstance().planning.tabsDisplay = tab;
                    }, 100);

                    PageNavigator.getInstance().back();

                    Store.getInstance().popup.usePopup("Catégorie caché", () => {
                        DataManager.getInstance().data.planning.elementsToHide.splice(DataManager.getInstance().data.planning.elementsToHide.indexOf(this.event.categoryId), 1);
                        
                        let tab = Store.getInstance().planning.tabsDisplay;
                        Store.getInstance().planning.tabsDisplay = -1;
                        setTimeout(() => {
                            Store.getInstance().planning.tabsDisplay = tab;
                        }, 100);

                        PlanningBox.getInstance().loadPlannings();
                    });
                },

                chooseEventColor(colorIndex) {
                    DataManager.getInstance().data.planning.eventColors[this.event.categoryId] = this.eventColors[colorIndex];
                    this.syncColors();
                },

                syncColors() {
                    Store.getInstance().planning.eventColors = DataManager.getInstance().data.planning.eventColors;
                },
            },

            mail: {
                tabsDisplay: 0,
                tabNames: Object.keys(DataManager.getInstance().data.mail.hierarchy),
                displayLoader: true,

                tabName: "Réception",
                hierarchy: DataManager.getInstance().data.mail.hierarchy,

                messages: [],
                isUnseen: false,
                unseenCounter: 0,

                changeSelectedTab(index) {
                    this.tabsDisplay = index;

                    if(index != -1) this.tabName = this.tabNames[this.tabsDisplay];
                    else this.tabName = "";
                },

                sortBoxes() {
                    return this.tabNames.sort((el1, el2) => {
                        if(el1 == "Réception") return -1;
                        if(el1 == "Corbeille") return 1;
                        if(el1 == "Envoyé") {
                            if(el2 != "Corbeille") return 1;
                            else return -1;
                        }

                        if(el2 == "Réception") return 1;
                        if(el2 == "Corbeille") return -1;
                        if(el2 == "Envoyé") {
                            if(el1 != "Corbeille") return -1;
                            else return 1;
                        }

                        return 0;
                    });
                }
            },

            mailContent: {
                message: false,
                showTextVersion: false,

                downloadAttachement(attachement) {
                    let dataArray = new Uint8Array(attachement.data.data);
                    let dataBlob = new Blob([dataArray]);

                    let downloadUrl = window.URL.createObjectURL(dataBlob);
                    let domElementLink = document.createElement('a');

                    domElementLink.href = downloadUrl;
                    domElementLink.setAttribute('download', attachement.filename);
                    document.body.appendChild(domElementLink);

                    domElementLink.style.display = "none";
                    domElementLink.click();
                },

                deleteMail() {
                    FetchManager.getInstance().fetch("/?query=moveMail&mail=22109034t&pass=8Gn5mt!U4!!E&box=" + this.message.messageBox + "&mailId=" + this.message.messageId.id + "&newBox=" + "Trash", "mailsUrl", {
                        cache: false,
                    });

                    let delIndex = 0;
                    let el = null;
                    for(let i = 0; i < DataManager.getInstance().data.mail.hierarchy[this.message.messageBox].length; i++) {
                        if(DataManager.getInstance().data.mail.hierarchy[this.message.messageBox][i].id == this.message.messageId.id) {
                            delIndex = i;
                            el = DataManager.getInstance().data.mail.hierarchy[this.message.messageBox][i];

                            DataManager.getInstance().data.mail.hierarchy[this.message.messageBox].splice(i, 1);
                        }
                    }

                    let tab = Store.getInstance().mail.tabsDisplay;
                    Store.getInstance().mail.changeSelectedTab(-1);
                    setTimeout(() => {
                        Store.getInstance().mail.changeSelectedTab(tab);
                    }, 100);

                    PageNavigator.getInstance().back();

                    // Store.getInstance().popup.usePopup("Message supprimé", () => {
                    //     console.log(this.message.messageId.id)
                    //     FetchManager.getInstance().fetch("/?query=moveMail&mail=22109034t&pass=8Gn5mt!U4!!E&box=" + "Trash" + "&mailId=" + this.message.messageId.id + "&newBox=" + this.message.messageBox, "mailsUrl", {
                    //         cache: false,
                    //     });

                    //     DataManager.getInstance().data.mail.hierarchy[this.message.messageBox].splice(delIndex, 0, el);
                        
                    //     let tab = Store.getInstance().mail.tabsDisplay;
                    //     Store.getInstance().mail.changeSelectedTab(-1);
                    //     setTimeout(() => {
                    //         Store.getInstance().mail.changeSelectedTab(tab);
                    //     }, 100);
                    // });
                }
            },
        });
    }
}