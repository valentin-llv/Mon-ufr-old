"use strict"

import Store from "../../petite-vue/store/store.js";

/* Page navigator */

export default class PageNavigator {
    private static _instance: PageNavigator = null;

    private pages: Object = {};
    private pageHistory: Array<string> = ["home-page"];
    private isMoving: boolean = false;

    public static getInstance(): PageNavigator {
        if(!PageNavigator._instance) PageNavigator._instance = new PageNavigator();
        return PageNavigator._instance;
    };

    constructor() {
        this.setupWindowPageHistoryManagemenet();
    };

    private setupWindowPageHistoryManagemenet(): void {
        window.history.pushState({}, '');
        window.addEventListener('popstate', this.handlePopEvent);
    };

    private canMove(): boolean {
        if(!this.isMoving) {
            this.isMoving = true;

            setTimeout(() => {
                this.isMoving = false;
            }, 300);

            return true;
        } else return false;
    };

    public goto(pageName: string): void {
        if(this.canMove() && pageName != this.pageHistory[this.pageHistory.length - 1]) {
            this.dispatchAnimation(this.pages[this.pageHistory[this.pageHistory.length - 1]], this.pages[pageName], this.pages[pageName].pageAnimation, "Open");
            this.storeNewPage(pageName);
        }
    };

    public restartTo(pageName: string): void {
        if(this.canMove() && pageName != this.pageHistory[this.pageHistory.length - 1]) {
            this.isMoving = false;

            if(this.pageHistory.length > 1) {
                this.pageHistory[0] = pageName;
                for(let i = this.pageHistory.length - 1; i > 0; i--) {
                    this.back();
                    if(i != 1) this.isMoving = false;
                }
            }
            else {
                this.goto(pageName);
                this.pageHistory[0] = pageName;
                this.pageHistory.pop();
            }
        }
    };

    public back(): void {
        if(this.canMove()) {
            window.history.back();
        }
    };

    private handlePopEvent = () => {
        if(this.pageHistory.length > 1) {
            this.dispatchAnimation(this.pages[this.pageHistory[this.pageHistory.length - 1]], this.pages[this.pageHistory[this.pageHistory.length - 2]], this.pages[this.pageHistory[this.pageHistory.length - 1]].pageAnimation, "Close");
            
            if(this.pageHistory[this.pageHistory.length - 1] == "add-planning-scann-page") {
                Store.getInstance().addPlanning.closeScannPage();
            }
            this.pageHistory.pop();
        }
    }

    private dispatchAnimation(pageFrom: any, pageTo: any, pageAnimation: string, type: string): void {
        pageFrom.out(pageAnimation + "Out" + type);
        pageTo.in(pageAnimation + "In" + type);
    };

    private storeNewPage(pageName: string) {
        this.pageHistory.push(pageName);
        window.history.pushState({}, '');
    };

    public registerPage(page: any): void {
        this.pages[page.pageName] = page;
    };
}