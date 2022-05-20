"use strict"

/* Utils */

export default class Utils {
    static getDateString(date):string {
        let day = date.getDate();
        let month = date.getMonth();

        return day + " " + Utils.getMonthsName()[month];
    };

    static getMonthsName(): Array<string> {
        return ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    };
}