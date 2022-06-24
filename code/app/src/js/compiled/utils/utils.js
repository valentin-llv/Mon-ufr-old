"use strict";
export default class Utils {
    static getDateString(date) {
        let day = date.getDate();
        let month = date.getMonth();
        return day + " " + Utils.getMonthsName()[month];
    }
    static getHourString(date) {
        let hour = date.getHours();
        let minutes = date.getMinutes();
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        return hour + "h" + minutes;
    }
    static getMonthsName() {
        return ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    }
}
