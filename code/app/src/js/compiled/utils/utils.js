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
    static calcUsedDataStorage() {
        let _lsTotal = 0, _xLen, _x;
        for (_x in localStorage) {
            if (!localStorage.hasOwnProperty(_x))
                continue;
            _xLen = (localStorage[_x].length + _x.length) * 2;
            _lsTotal += _xLen;
        }
        return (_lsTotal / 1024).toFixed(2);
    }
    static async clacCacheStorage() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            let { usage, quota } = await navigator.storage.estimate();
            let usageInMib = Math.round(usage / (1024 * 1024));
            let quotaInMib = Math.round(quota / (1024 * 1024));
            return {
                usageInMib: usageInMib,
                quotaInMib: quotaInMib,
            };
        }
        return {
            usageInMib: 0,
            quotaInMib: 0,
        };
    }
}
