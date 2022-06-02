"use strict"

/* Importing code */

import Store from '../../petite-vue/store/store.js';
import DataManager from '../../data/data-manager/data-manager.js';
import DateManager from '../../utils/date-manager.js';
import PlanningDownloader from './planning-downloader.js';

/* Informations box */

export default class PlanningBox {
    private static _instance: PlanningBox = null;

    private planning = Store.getInstance().planning;

    public static getInstance(): PlanningBox {
        if(!PlanningBox._instance) PlanningBox._instance = new PlanningBox();
        return PlanningBox._instance;
    }

    constructor() {
        this.calcWeekTabDays();
        this.loadPlannings();
    }

    async loadPlannings() {
        // ------> remove later
        DataManager.getInstance().data.planning.urls = ["http://ade.univ-tours.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?data=9101640d448493d466545be62dca3ab4f16bc99c1231ad75105654c3c757c8eb7620eb46444396bdf9e9eb1f96f57e6756c0259e9250fe3702f165b84e00ba5c,1"];

        // Check if the use has planning urls registered
        if(DataManager.getInstance().data.planning.urls.length == 0) this.userHasNoPlanning();

        let result = await new PlanningDownloader(DataManager.getInstance().data.planning.urls).download();
        if(result.errorMessage) {
            this.planning.errorMessage = result.errorMessage;
            this.planning.displayLoader = false;
            return false;
        }

        if(result.popupMessage) {
            // ------> todo
        }

        this.planning.events = result.planning;
        this.planning.displayLoader = false;
        this.planning.errorMessage = "";

        this.calcClassToday();

        this.calcWeekTabContent();
    }

    userHasNoPlanning() {
        this.planning.errorMessage = "Vous n'avez pas encore ajouté d'emploi du temps, ajoutez en un pour le voir apparaitre ici.";
        this.planning.showAddPlanningButton = true;
        this.planning.displayLoader = false;
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
}