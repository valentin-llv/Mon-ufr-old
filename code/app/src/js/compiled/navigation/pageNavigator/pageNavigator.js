"use strict";
import Store from "../../petite-vue/store/store.js";
export default class PageNavigator {
    static _instance = null;
    pages = {};
    pageHistory = ["home-page"];
    isMoving = false;
    static getInstance() {
        if (!PageNavigator._instance)
            PageNavigator._instance = new PageNavigator();
        return PageNavigator._instance;
    }
    ;
    constructor() {
        this.setupWindowPageHistoryManagemenet();
    }
    ;
    setupWindowPageHistoryManagemenet() {
        window.history.pushState({}, '');
        window.addEventListener('popstate', this.handlePopEvent);
    }
    ;
    canMove() {
        if (!this.isMoving) {
            this.isMoving = true;
            setTimeout(() => {
                this.isMoving = false;
            }, 300);
            return true;
        }
        else
            return false;
    }
    ;
    goto(pageName) {
        if (this.canMove() && pageName != this.pageHistory[this.pageHistory.length - 1]) {
            this.dispatchAnimation(this.pages[this.pageHistory[this.pageHistory.length - 1]], this.pages[pageName], this.pages[pageName].pageAnimation, "Open");
            this.storeNewPage(pageName);
        }
    }
    ;
    restartTo(pageName) {
        if (this.canMove() && pageName != this.pageHistory[this.pageHistory.length - 1]) {
            this.isMoving = false;
            if (this.pageHistory.length > 1) {
                this.pageHistory[0] = pageName;
                for (let i = this.pageHistory.length - 1; i > 0; i--) {
                    this.back();
                    if (i != 1)
                        this.isMoving = false;
                }
            }
            else {
                this.goto(pageName);
                this.pageHistory[0] = pageName;
                this.pageHistory.pop();
            }
        }
    }
    ;
    back() {
        if (this.canMove()) {
            window.history.back();
        }
    }
    ;
    handlePopEvent = () => {
        if (this.pageHistory.length > 1) {
            this.dispatchAnimation(this.pages[this.pageHistory[this.pageHistory.length - 1]], this.pages[this.pageHistory[this.pageHistory.length - 2]], this.pages[this.pageHistory[this.pageHistory.length - 1]].pageAnimation, "Close");
            if (this.pageHistory[this.pageHistory.length - 1] == "add-planning-scann-page") {
                Store.getInstance().addPlanning.closeScannPage();
            }
            this.pageHistory.pop();
        }
    };
    dispatchAnimation(pageFrom, pageTo, pageAnimation, type) {
        pageFrom.out(pageAnimation + "Out" + type);
        pageTo.in(pageAnimation + "In" + type);
    }
    ;
    storeNewPage(pageName) {
        this.pageHistory.push(pageName);
        window.history.pushState({}, '');
    }
    ;
    registerPage(page) {
        this.pages[page.pageName] = page;
    }
    ;
}
