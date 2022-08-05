"use strict";
import { reactive } from '../../../../libs/petite-vue/petite-vue.js';
import DataManager from '../../data/data-manager/data-manager.js';
import FetchManager from '../../data/fetch-manager/fetch-manager.js';
import PageNavigator from '../../navigation/pageNavigator/pageNavigator.js';
import MailBox from '../../pages/mails/mails.js';
import PlanningBox from '../../pages/planning/planning.js';
export default class Store {
    static _instance = null;
    store;
    static getInstance() {
        if (!Store._instance)
            Store._instance = new Store();
        return Store._instance.store;
    }
    constructor() {
        this.initialiseStore();
    }
    initialiseStore() {
        this.store = reactive({
            home: {
                menuSelected: ["var(--color-accent)", "var(--color-100)", "var(--color-100)", "var(--color-100)"],
            },
            notifications: {
                displayLoader: true,
                errorMessage: "",
                infos: [],
                infosUnseen: [],
                currentNotification: null,
            },
            accentColor: {
                colors: ["#49b583", "#fd6868", "#5575e7", "#FFBD69", "#118AB2", "#4F5D75", "#631A86", "#EE6C4D", "red"],
            },
            popup: {
                text: "",
                callback: null,
                showCancel: true,
                usePopup(text, callback = () => { }, showCancel = true) {
                    this.text = text;
                    this.callback = callback;
                    this.showCancel = showCancel;
                },
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
                        if (this.selectedWeek > 0)
                            this.selectedWeek -= 1;
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
            eventContent: {
                event: "",
                hasNote: false,
                noteContent: "",
                showInput: false,
                openPage(event) {
                    this.event = event;
                    if (PlanningBox.getInstance().hasEventNote(event)) {
                        this.hasNote = true;
                        this.noteContent = PlanningBox.getInstance().getNote(event);
                    }
                    else {
                        this.hasNote = false;
                        this.noteContent = "";
                    }
                    this.showInput = false;
                    PageNavigator.getInstance().goto("event-content-page");
                },
                addNote() {
                    if (this.noteContent == "") {
                        if (this.hasNote)
                            this.deleteNote();
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
                displayLogin: false,
                refreshDashoffset: 0,
                changeSelectedTab(index) {
                    this.tabsDisplay = index;
                    if (index != -1)
                        this.tabName = this.tabNames[this.tabsDisplay];
                    else
                        this.tabName = "";
                },
                sortBoxes() {
                    return this.tabNames.sort((el1, el2) => {
                        if (el1 == "Réception")
                            return -1;
                        if (el1 == "Corbeille")
                            return 1;
                        if (el1 == "Envoyé") {
                            if (el2 != "Corbeille")
                                return 1;
                            else
                                return -1;
                        }
                        if (el2 == "Réception")
                            return 1;
                        if (el2 == "Corbeille")
                            return -1;
                        if (el2 == "Envoyé") {
                            if (el1 != "Corbeille")
                                return -1;
                            else
                                return 1;
                        }
                        return 0;
                    });
                },
                async refresh() {
                    this.refreshDashoffset = 900;
                    await MailBox.getInstance().loadMails();
                    this.refreshDashoffset = 0;
                },
                deleteAccount() {
                    let userId = DataManager.getInstance().data.mail.userId;
                    let password = DataManager.getInstance().data.mail.password;
                    let hierarchy = DataManager.getInstance().data.mail.hierarchy;
                    DataManager.getInstance().data.mail.userId = "";
                    DataManager.getInstance().data.mail.password = "";
                    DataManager.getInstance().data.mail.hierarchy = {
                        "Réception": [],
                    };
                    this.tabsDisplay = 0;
                    this.tabNames = Object.keys(DataManager.getInstance().data.mail.hierarchy);
                    this.hierarchy = DataManager.getInstance().data.mail.hierarchy;
                    MailBox.getInstance().loadMails();
                    PageNavigator.getInstance().back();
                    Store.getInstance().popup.usePopup("Compte supprimé", () => {
                        DataManager.getInstance().data.mail.userId = userId;
                        DataManager.getInstance().data.mail.password = password;
                        DataManager.getInstance().data.mail.hierarchy = hierarchy;
                        MailBox.getInstance().loadMails();
                    });
                },
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
                    for (let i = 0; i < DataManager.getInstance().data.mail.hierarchy[this.message.messageBox].length; i++) {
                        if (DataManager.getInstance().data.mail.hierarchy[this.message.messageBox][i].id == this.message.messageId.id) {
                            DataManager.getInstance().data.mail.hierarchy[this.message.messageBox].splice(i, 1);
                        }
                    }
                    let tab = Store.getInstance().mail.tabsDisplay;
                    Store.getInstance().mail.changeSelectedTab(-1);
                    setTimeout(() => {
                        Store.getInstance().mail.changeSelectedTab(tab);
                    }, 100);
                    PageNavigator.getInstance().back();
                }
            },
            mailLogin: {
                userId: "",
                password: "",
                borderColor: "var(--color-100)",
                errorMessage: "",
                displayLoader: false,
                showPass: true,
                async login() {
                    if (!this.userId || !this.password) {
                        this.borderColor = "red";
                        this.errorMessage = "Les champs ne sont pas correctement remplis.";
                        return false;
                    }
                    this.displayLoader = true;
                    let result = await FetchManager.getInstance().fetch("/?query=login&mail=" + this.userId + "&pass=" + this.password, "mailsUrl", {
                        cache: false,
                    });
                    if (result.succes) {
                        DataManager.getInstance().data.mail.userId = this.userId;
                        DataManager.getInstance().data.mail.password = this.password;
                        MailBox.getInstance().loadMails();
                        PageNavigator.getInstance().back();
                    }
                    else {
                        this.borderColor = "red";
                        this.errorMessage = "Vos identifiants sont incorrect.";
                    }
                    this.displayLoader = false;
                },
            },
            scrollPage(pageId) {
                setTimeout(() => {
                    document.getElementById(pageId).scroll({
                        top: 10000,
                        left: 0,
                        behavior: 'smooth'
                    });
                }, 600);
            },
        });
    }
}
