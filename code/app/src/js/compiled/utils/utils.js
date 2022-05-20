"use strict";
export default class Utils {
    static getDateString(date) {
        let day = date.getDate();
        let month = date.getMonth();
        return day + " " + Utils.getMonthsName()[month];
    }
    ;
    static getMonthsName() {
        return ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    }
    ;
}
