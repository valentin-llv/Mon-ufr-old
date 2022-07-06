"use strict"

// Imports

import Store from "../singleton/store.js";
import PageNavigator from "../singleton/pageNavigator.js";
import DataManager from "../singleton/data-manager.js";

// Component

export default function Notification(props) {
    return {
        $template: "#notification-template",

        title: props.title,
        date: props.date,
        summary: props.summary,
        content: props.content,
        id: props.id,

        store: Store.getInstance().notifications,

        clicked() {
            Store.getInstance().notifications.currentNotification = {
                title: this.title,
                date: this.date,
                summary: this.summary,
                content: this.content,
            };

            PageNavigator.getInstance().goto("notification-content-page");

            if(this.store.infosUnseen.includes(this.id)) {
                setTimeout(() => {
                    DataManager.getInstance().data.news.newsRead.push(this.id);
                    this.store.infosUnseen.splice(this.store.infosUnseen.indexOf(this.id), 1);
                }, 300);
            }
        },
    }
}