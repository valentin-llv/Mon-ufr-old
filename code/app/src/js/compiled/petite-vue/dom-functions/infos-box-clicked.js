"use strict";
import DataManager from "../../data/data-manager/data-manager.js";
import PageNavigator from "../../navigation/pageNavigator/pageNavigator.js";
import Store from "../store/store.js";
export default function infosBoxClicked(index) {
    let informations = Store.getInstance().informations;
    informations.currentInformation = informations.infos[index];
    PageNavigator.getInstance().goto("notification-content-page");
    setTimeout(() => {
        if (informations.infos[index].isUnseen) {
            informations.infos[index].isUnseen = false;
            DataManager.getInstance().data.news.newsRead.push(informations.infos[index].id);
            informations.infosUnseen--;
        }
    }, 300);
}
;
