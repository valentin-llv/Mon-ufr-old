"use strict";
import { reactive } from '../../../../libs/petite-vue/petite-vue.js';
import DataManager from '../../data/data-manager/data-manager.js';
import PlanningBox from '../../pages/planning/planning.js';
import Utils from '../../utils/utils.js';
export default class Store {
    static _instance = null;
    store;
    static getInstance() {
        if (!Store._instance)
            Store._instance = new Store();
        return Store._instance.store;
    }
    constructor() {
        this.initialiseStore();
    }
    initialiseStore() {
        this.store = reactive({
            home: {
                date: Utils.getDateString(new Date()),
                menuSelected: ["var(--color-accent)", "var(--color-100)", "var(--color-100)", "var(--color-100)"],
            },
            themeColor: {
                color: DataManager.getInstance().data.settings.themeColor,
                toggle(element) {
                    this.color = element.checked == true ? "dark" : "light";
                    DataManager.getInstance().data.settings.themeColor = this.color;
                    this.update();
                },
                update() {
                    let shade = [900, 800, 700, 600, 300, 200, 100];
                    for (let i = 0; i < shade.length; i++) {
                        document.documentElement.style.setProperty('--color-' + shade[i], getComputedStyle(document.documentElement).getPropertyValue('--color-' + shade[i] + "-" + DataManager.getInstance().data.settings.themeColor));
                    }
                },
            },
            accentColor: {
                colors: ["#49b583", "#fd6868", "#5575e7"],
                toggle(index) {
                    DataManager.getInstance().data.settings.accentColor = this.colors[index];
                    document.documentElement.style.setProperty('--color-accent', this.colors[index]);
                },
            },
            informations: {
                currentInformation: "",
                infos: [],
                infosUnseen: 0,
                errorMessage: "",
                displayLoader: true,
            },
            planning: {
                tabsDisplay: [true, false],
                changeSelectedTab(index) {
                    this.tabsDisplay = [false, false];
                    this.tabsDisplay[index] = true;
                },
                week: {
                    daysName: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
                    daysNumber: [],
                    monthName: "",
                    selectedDay: false,
                    selectedWeek: 0,
                    weekDisplay: [],
                    selectPreviousWeek() {
                        if (this.selectedWeek > 0)
                            this.selectedWeek -= 1;
                        PlanningBox.getInstance().calcWeekTabDays();
                        PlanningBox.getInstance().calcWeekTabContent();
                    },
                    selectNextWeek() {
                        this.selectedWeek += 1;
                        PlanningBox.getInstance().calcWeekTabDays();
                        PlanningBox.getInstance().calcWeekTabContent();
                    },
                    changeSelectedDay(index) {
                        this.selectedDay = index - 1;
                        PlanningBox.getInstance().calcWeekTabContent();
                    },
                },
                events: [],
                showAddPlanningButton: false,
                errorMessage: "",
                displayLoader: true,
                classToday: "",
            },
        });
    }
}
