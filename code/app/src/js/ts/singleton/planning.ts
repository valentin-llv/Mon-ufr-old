"use strict"

import DataManager from './data-manager.js';
import Store from './store.js';
/* Importing code */

import DateManager from './date-manager.js';
import PlanningDownloader from './planning-downloader.js';

/* Informations box */

export default class PlanningBox {
    private static _instance: PlanningBox = null;

    public planning = Store.getInstance().planning;

    public static getInstance(): PlanningBox {
        if(!PlanningBox._instance) PlanningBox._instance = new PlanningBox();
        return PlanningBox._instance;
    }

    constructor() {
        this.calcWeekTabDays();
        this.loadPlannings();
    }

    async loadPlannings() {
        // Check if the use has planning urls registered
        if(DataManager.getInstance().data.planning.urls.length == 0) {
            this.userHasNoPlanning();
            return false;
        }

        let result = await new PlanningDownloader(DataManager.getInstance().data.planning.urls).download();

        if(result.popupMessage) {
            this.planning.popMessage.title = result.popupMessage.title;
            this.planning.popMessage.content = result.popupMessage.content;
        }

        if(result.errorMessage) {
            this.planning.errorMessage = result.errorMessage;
            this.planning.displayLoader = false;
            return false;
        }

        this.planning.events = this.filterEvents(result.planning);
        this.planning.displayLoader = false;
        this.planning.errorMessage = "";

        this.calcClassToday();
        this.calcWeekTabContent();
        
        this.calcTimeBeforeNextClass();
        setInterval(this.calcTimeBeforeNextClass, 60000);
    }

    userHasNoPlanning() {
        this.planning.errorMessage = "Vous n'avez pas encore ajouté d'emploi du temps, ajoutez en un pour le voir apparaitre ici.";
        this.planning.showAddPlanningButton = true;
        this.planning.displayLoader = false;
    }

    filterEvents(planning) {
        let filteredPlanning = planning;
        for(let j = 0; j < filteredPlanning.length; j++) {
            for(let i = 0; i < filteredPlanning[j].length; i++) {
                if(DataManager.getInstance().data.planning.elementsToHide.includes(filteredPlanning[j][i].uid) == true || DataManager.getInstance().data.planning.elementsToHide.includes(filteredPlanning[j][i].categoryId) == true) {
                    filteredPlanning[j].splice(i, 1);
                    i -= 1;

                    if(filteredPlanning[j].length == 0) {
                        filteredPlanning.splice(j, 1);
                        j -= 1;

                        break;
                    }
                }
            }
        }

        return filteredPlanning;
    }

    calcWeekTabDays() {
        let currentDayNumber = DateManager.getDayNumber();
        let firstWeekDay = new Date().getDate() - currentDayNumber;

        for(let i = 0; i < 7; i ++) {
            let newDate = new Date();
            newDate.setDate(this.planning.week.selectedWeek * 7 + firstWeekDay + i);
            this.planning.week.daysNumber[i] = newDate.getDate();
        }

        let newDate = new Date();
        newDate.setDate(this.planning.week.selectedWeek * 7 + firstWeekDay);
        this.planning.week.monthName = DateManager.getMonths()[newDate.getMonth()] + " " + newDate.getFullYear();

        if(this.planning.week.selectedDay == false) {
            this.planning.week.selectedDay = currentDayNumber;
        }
    }

    calcClassToday() {
        let todayFullDate = DateManager.getFullDate();

        let dayFound = false;
        for(let i = 0; i < this.planning.events.length; i++) {
            let fullDate2 = DateManager.convertDateIntoNumber(this.planning.events[i][0]);

            if(todayFullDate == fullDate2) {
                let classToday = 0;
                let date = new Date();
                let fullHour = date.getHours() * 100 + date.getMinutes() * 1;

                for(let j = 0; j < this.planning.events[i].length; j++) {
                    let fullHour2 = this.planning.events[i][j].eventStart.time.hour * 100 + this.planning.events[i][j].eventStart.time.minute * 1;
                
                    if(fullHour <= fullHour2) {
                        classToday += 1;
                    }
                }

                this.planning.classToday = classToday + " cours";
                dayFound = true;
                break;
            }
        }

        if(dayFound == false) {
            this.planning.classToday = "0 cours"; 
        }
    }

    calcTimeBeforeNextClass = () => {
        let date = new Date();
        let todayFullDate = date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate() * 1;

        let dayFound = false;
        for(let i = 0; i < this.planning.events.length; i++) {
            let fullDate2 = DateManager.convertDateIntoNumber(this.planning.events[i][0]);

            if(todayFullDate == fullDate2) {
                let fullHour = date.getHours() * 100 + date.getMinutes() * 1;

                for(let j = 0; j < this.planning.events[i].length; j++) {
                    let fullHour2 = this.planning.events[i][j].eventEnd.time.hour * 100 + this.planning.events[i][j].eventEnd.time.minute * 1;

                    this.planning.nextClass = this.planning.events[i][j];
                    if(fullHour <= fullHour2) {
                        let date2 = null;
                        let fullHour3 = this.planning.events[i][j].eventStart.time.hour * 100 + this.planning.events[i][j].eventStart.time.minute * 1;
                        if(fullHour >= fullHour3) {
                            if(this.planning.events[i][j + 1]) {
                                date2 = {
                                    time: {
                                        minute: this.planning.events[i][j + 1].eventStart.time.minute,
                                        hour: this.planning.events[i][j + 1].eventStart.time.hour,
                                    },
                                }
                            }
                        } else {
                            date2 = {
                                time: {
                                    minute: this.planning.events[i][j].eventStart.time.minute,
                                    hour: this.planning.events[i][j].eventStart.time.hour,
                                },
                            }
                        }
    
                        let date1 = {
                            time: {
                                minute: date.getMinutes(),
                                hour: date.getHours(),
                            },
                        }
                        
                        if(date2) {
                            let time = DateManager.calcDuration(date1, date2);
                            this.planning.nextClassTime = time.text;
                        }
    
                        dayFound = true;
                        break;
                    }
                }
            }
        }

        if(dayFound == false) {
            this.planning.nextClassTime = "";
        }
    }

    calcWeekTabContent() {
        let currentDayNumber = DateManager.getDayNumber();
        let date = new Date();
        date.setDate(date.getDate() - currentDayNumber + this.planning.week.selectedDay + this.planning.week.selectedWeek * 7);

        let fullDate1 = date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate() * 1;
        let classDay = [];
        for(let i = 0; i < this.planning.events.length; i++) {
            let fullDate2 = DateManager.convertDateIntoNumber(this.planning.events[i][0]);;
            if(fullDate1 == fullDate2) {
                classDay = this.planning.events[i];
            }
        }

        this.planning.week.weekDisplay = classDay;
    }

    fillSearchTab(search) {
        let searchResult = JSON.parse(JSON.stringify(this.planning.events));

        for(let j = 0; j < searchResult.length; j++) {
            for(let i = 0; i < searchResult[j].length; i++) {
                if(searchResult[j][i].summary.toLowerCase().includes(search) != true) {
                    searchResult[j].splice(i, 1);
                    i -= 1;

                    if(searchResult[j].length == 0) {
                        searchResult.splice(j, 1);
                        j -= 1;
                        break;
                    }
                }
            }
        }

        this.planning.search.events = searchResult;
    }

    hasEventNote(event) {
        return DataManager.getInstance().data.planning.eventNotes[event.uid] != undefined ? true : false;
    }

    getNote(event) {
        return DataManager.getInstance().data.planning.eventNotes[event.uid];
    }
}