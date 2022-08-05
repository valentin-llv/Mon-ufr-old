"use strict"

/* Importing code */

import Server from './server-manager.js';
import FetchManager from './fetch-manager.js';
import CacheManager from './cache-manager.js';
import DateManager from './date-manager.js';

/* Informations box */

export default class PlanningDownloader {
    private urls;

    private errorMessages = {
        noInternet: {
            title: "Internet indisponible",
            content: "Vous n'êtes pas connecté à internet. Votre planning n'a donc pas été mis à jour.",
        },

        serverError: {
            title: "Erreur de connexion au serveur",
            content: "Impossible de joindre le serveur, veuillez reéssayer dans quelques secondes.",
        },

        noCache: "Vous n'êtes pas connecté à internet. Impossible de charger votre emploi du temps.",
        planningsEmpty: "Tous vos emplois du temps sont vide.",
        planningParseError: "Cet url ne correspond pas à un emploi du temps.",
    }

    private returnStatement = {
        planning: [],
        errorMessage: "",

        popupMessage: {
            title: "",
            content: "",
        },
    }

    constructor(urls) {
        this.urls = urls;
    }

    async download(type = "normal") {
        if(!Server.getInstance().isInternetConnected) this.returnStatement.popupMessage = this.errorMessages.noInternet;

        let planning = await this.downloadPlanning(type);
        if(!planning.length) {
            this.returnStatement.popupMessage = this.errorMessages.serverError;
            planning = await this.getFromCache();

            if(!planning.length) {
                this.returnStatement.errorMessage = this.errorMessages.noCache;
                return this.returnStatement;
            }
        }

        let planningParsed = [];
        try {
            planningParsed = this.parsePlanning(planning);
        } catch(e) {
            this.returnStatement.errorMessage = this.errorMessages.planningParseError;
            return this.returnStatement;
        }

        if(!planningParsed.length && type == "addPlanning") {
            this.returnStatement.errorMessage = this.errorMessages.planningParseError;
            return this.returnStatement;
        }

        if(!planningParsed.length) {
            this.returnStatement.errorMessage = this.errorMessages.planningsEmpty;
            return this.returnStatement;
        }

        this.returnStatement.planning = planningParsed;
        return this.returnStatement;
    }

    async downloadPlanning(type = "normal") {
        // Fectch planning
        let plannings = [];
        for(let i = 0; i < this.urls.length; i++) {
            // Get the requested ressources
            let result;
            if(type == "addPlanning") {
                result = await FetchManager.getInstance().fetch("?query=" + this.urls[i], "proxyBaseUrl", {
                    cache: false,
                });
            } else {
                result = await FetchManager.getInstance().fetch("?query=" + this.urls[i], "proxyBaseUrl");
            }

            // Check if result is valid
            if(!result) return [];
            else plannings.push(result.response);
        }

        return plannings;
    }

    async getFromCache() {
        // Fectch planning
        let plannings = [];
        for(let i = 0; i < this.urls; i++) {
            // Get the requested ressources
            let result = await CacheManager.getInstance().checkCache(Server.getInstance()["proxyBaseUrl"] + "?query=" + this.urls[i], false);

            // Check if result is valid
            if(!result) return [];
            else plannings.push(result);
        }

        return plannings;
    }

    parsePlanning(planningString) {
        let events = this.parseString(planningString);
        if(!events.length) {
            return [];
        }

        let eventsComputed = this.computeData(events);
        return this.sortPlanning(eventsComputed);
    }

    parseString(planningString) {
        let planningsParsed = [];
        for(let i = 0; i < planningString.length; i++) {
            let clearedText = planningString[i].replaceAll('\n ', "");
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
}