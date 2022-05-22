"use strict"


/* Informations box */

export default class DateManager {
    static parseDate(string) {
        let yearString = string.split('T')[0].slice(0, 4);
        let monthString = ((string.split('T')[0].slice(4, 6) * 1) - 1).toString();
        let dateString = string.split('T')[0].slice(6, 8);
        let hourString = string.split('T')[1].slice(0, 2);
        let minutesString = string.split('T')[1].slice(2, 4);

        let timezone = DateManager.getTimezone(yearString, monthString, dateString);
        hourString = (hourString * 1 + timezone) + "";
        if(hourString.length == 1) {
            hourString = "0" + hourString;
        }

        if(monthString.length == 1) {
            monthString = "0" + monthString;
        }

        if(minutesString.length == 1) {
            minutesString = "0" + minutesString;
        }

        let date = {
            year: yearString,
            month: monthString,
            date: dateString,
        };

        let time = {
            hour: hourString,
            minute: minutesString,
        }

        let eventDayName = DateManager.getDays()[DateManager.createDate(yearString, monthString, dateString).getDay()];
        let eventMonthName = DateManager.getMonths()[DateManager.createDate(yearString, monthString, dateString).getMonth()];
        let eventFullDateName = eventDayName + " " + DateManager.createDate(yearString, monthString, dateString).getDate() + " " + eventMonthName;

        return {
            string: {
                eventDayName: eventDayName,
                eventMonthName: eventMonthName,
                eventFullDateName: eventFullDateName,
            },

            date: date,
            time: time,
        };
    }

    static getTimezone(year, month, day) {
        let date = DateManager.createDate(year, month, day);
        if(("" + date).includes("GMT+0100")) return 1;
        else return 2;
    }

    static createDate(year, month, day) {
        let date = new Date();

        date.setDate(day * 1);
        date.setMonth(month * 1);
        date.setFullYear(year * 1);

        return date;
    }

    static getDays() {
        return ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];;
    }

    static getMonths() {
        return ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    }

    static calcDuration(date1, date2) {
        let minute = date2.time.minute - date1.time.minute;
        let hour = date2.time.hour - date1.time.hour;

        if(minute < 0) {
            minute += 60;
            hour -= 1;
        }

        let hourString = hour + "";
        if(hourString.length == 1) {
            hourString = "0" + hourString;
        }

        let minutesString = minute + "";
        if(minutesString.length == 1) {
            minutesString = "0" + minutesString;
        }

        return {
            hour: hour,
            minutes: minute,
            text: hourString + "h" + minutesString,
        }
    }

    static convertDateIntoNumber(event) {
        return event.eventStart.date.year * 10000 + event.eventStart.date.month * 100 + event.eventStart.date.date * 1
    }
}