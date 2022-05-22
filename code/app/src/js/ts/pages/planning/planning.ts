"use strict"

/* Importing code */

import Store from '../../petite-vue/store/store.js';
import Server from '../../data/server-manager/server.js';

import FetchManager from '../../data/fetch-manager/fetch-manager.js';
import CacheManager from '../../data/cache-manager/cache-manager.js';
import DataManager from '../../data/data-manager/data-manager.js';
import DateManager from '../../utils/date-manager.js';

/* Informations box */

export default class PlanningBox {
    private static _instance: PlanningBox = null;

    private dataLoaded = false;

    private planning = Store.getInstance().planning;

    private errorMessages = {
        head1: "La connexion a internet n'est pas disponible",
        head2: "La connexion au serveur a échoué.",

        messageEnd: "Impossible de télécharger l'emploi du temps.",
    }

    public static getInstance(): PlanningBox {
        if(!PlanningBox._instance) PlanningBox._instance = new PlanningBox();
        return PlanningBox._instance;
    }

    constructor() {
        this.load();
    }

    async load() {
        // Data is alreay loaded, no need to load data again
        if(this.dataLoaded) return false;

        // ------> remove later
        DataManager.getInstance().data.planning.urls = ["http://ade.univ-tours.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?data=9101640d448493d466545be62dca3ab4f16bc99c1231ad75105654c3c757c8eb7620eb46444396bdf9e9eb1f96f57e6756c0259e9250fe3702f165b84e00ba5c,1"];

        // Check if the use has planning urls registered
        if(DataManager.getInstance().data.planning.urls.length == 0) {
            this.planning.errorMessage = "Vous n'avez pas encore ajouté d'emploi du temps, ajoutez en un pour le voir apparaitre ici.";
            this.planning.showAddPlanningButton = true;
            this.planning.displayLoader = false;
        }

        // Check if internet connexion is available
        if(!Server.getInstance().isInternetConnected) {
            this.loadWithoutInternet(this.errorMessages.head1);
            return false;
        }

        // Fectch planning
        let plannings = [];
        for(let i = 0; i < DataManager.getInstance().data.planning.urls.length; i++) {
            // Get the requested ressources
            let result = await FetchManager.getInstance().fetch("?query=" + DataManager.getInstance().data.planning.urls[i], "proxyBaseUrl");

            // Check if result is valid
            if(!result) {
                this.loadWithoutInternet(this.errorMessages.head2);
                return false;
            }
            
            plannings.push(result.response);
        }

        // Parse plannings
        let eventsUnsorted = this.parsePlannings(plannings);
        let eventsUnsortedComputed = this.computeData(eventsUnsorted);
        this.planning.events = this.sortPlanning(eventsUnsortedComputed);

        this.succes();
    }

    parsePlannings(plannings) {
        let planningsParsed = [];
        for(let i = 0; i < plannings.length; i++) {
            let clearedText = plannings[i].replaceAll('\n ', "");
            clearedText = clearedText.replaceAll('\n', "");
            clearedText = clearedText.replaceAll('\r', "");

            let splitedText = clearedText.split('BEGIN:VEVENT').slice(1, clearedText.split('BEGIN:VEVENT').length);

            for(let j = 0; j < splitedText.length; j++) {
                let event = splitedText[j];

                let dateStart = event.split('DTSTART:')[1];
                dateStart = dateStart.split('DTEND:')[0];

                let dateEnd = event.split('DTEND:')[1];
                dateEnd = dateEnd.split('SUMMARY:')[0];

                let summary = event.split('SUMMARY:')[1];
                summary = summary.split('LOCATION:')[0];

                let location = event.split('LOCATION:')[1];
                location = location.split('DESCRIPTION:')[0];

                let description = event.split('DESCRIPTION:')[1];
                description = description.split('UID:')[0];
                description = description.replaceAll('\\n', "||");

                let uid = event.split('UID:')[1];
                uid = uid.split('CREATED:')[0];

                planningsParsed.push({
                    dateStart: dateStart,
                    dateEnd: dateEnd,
                    summary: summary,
                    location: location,
                    description: description,
                    uid: uid,
                });
            }
        }

        return planningsParsed;
    }

    computeData(events) {
        for(let i = 0; i < events.length; i++) {
            let eventStart = DateManager.parseDate(events[i].dateStart);
            let eventEnd = DateManager.parseDate(events[i].dateEnd);

            let duration = DateManager.calcDuration(eventStart, eventEnd);

            let descriptionParsed = events[i].description.split('||');
            let teacher = "";
            for(let k = 0; k < descriptionParsed.length; k ++) {
                if(descriptionParsed[k].toUpperCase() == descriptionParsed[k] && descriptionParsed[k] != "") {
                    teacher = descriptionParsed[k];
                    break;
                }
            }

            if(events[i].location == undefined || events[i].location == "") {
                events[i].location = "???";
            }

            events[i] = {
                eventStart: eventStart,
                eventEnd: eventEnd,
                duration: duration,
                summary: events[i].summary,
                location: events[i].location,
                uid: events[i].uid,
                teacher: teacher,
                categoryId: duration.text + events[i].summary + teacher,
            }
        }

        return events;
    }

    sortPlanning(eventsList) {
        // Sort event list into planning days
        let sortedByDatePlanning = [];
        let sortedByDayPlanning = [];

        for(let i = 0; i < eventsList.length; i++) {
            let event = eventsList[i];
    
            if(sortedByDatePlanning.length == 0) {
                sortedByDatePlanning.push(event);
            } else {
                for(let j = 0; j <= sortedByDatePlanning.length; j++) {
                    if(j == sortedByDatePlanning.length) {
                        sortedByDatePlanning.push(event);
                        break;
                    } else {
                        let fullDate = DateManager.convertDateIntoNumber(event);
                        let fullDate2 = DateManager.convertDateIntoNumber(sortedByDatePlanning[j]);

                        if(fullDate <= fullDate2) {   
                            if(fullDate == fullDate2) {
                                let fullHour = event.eventStart.time.hour * 100 + event.eventStart.time.minute * 1;
                                let fullHour2 = sortedByDatePlanning[j].eventStart.time.hour * 100 + sortedByDatePlanning[j].eventStart.time.minute * 1;

                                if(fullHour <= fullHour2) {
                                    sortedByDatePlanning.splice(j, 0, event);
                                    break;
                                }
                            } else {
                                sortedByDatePlanning.splice(j, 0, event);
                                break;
                            }
                        }
                    }
                }
            }
        }
    
        for(let k = 0; k < sortedByDatePlanning.length; k++) {
            let event = sortedByDatePlanning[k];
    
            if(k == 0) {
                sortedByDayPlanning.push([event]);
            } else {
                let fullDate = DateManager.convertDateIntoNumber(event);
                let fullDate2 = DateManager.convertDateIntoNumber(sortedByDatePlanning[k - 1]);

                if(fullDate == fullDate2) {
                    sortedByDayPlanning[sortedByDayPlanning.length - 1].push(event);
                } else {
                    sortedByDayPlanning.push([event]);
                }
            }
        }

        return sortedByDayPlanning;
    }

    loadWithoutInternet(reason: string) {
        console.log("load without internet")
    }

    succes() {
        this.planning.dataLoaded = true;
        this.planning.displayLoader = false;
        this.planning.errorMessage = "";

        this.selectEventsToView();
    }

    selectEventsToView() {
        
    }
}