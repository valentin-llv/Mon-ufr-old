"use strict"

// Imports

import PageNavigator from '../singleton/page-navigator.js';

// Interfaces

interface PageProps {
    pageName: string,
    pageAnimation: string,
    hidden?: boolean,
}

// Component

export default function Page(props: PageProps): any {
    return {
        pageName: props.pageName,
        pageAnimation: props.pageAnimation,

        displayState: props.hidden === false ? "block" : "none",
        opacity: 1,
        left: 0,

        mounted() {
            PageNavigator.getInstance().registerPage(this);

            if(this.mountedCallback) {
                this[this.mountedCallback]();
            }
        },

        in(animationFunction: string) {
            this[animationFunction]();
        },

        out(animationFunction: string) {
            this[animationFunction]();
        },
        
        async fadeInOpen() {
            this.displayState = "block";
            this.opacity = 0;
            this.left = 0;
            await this.tick();
            this.opacity = 1;
        },
        fadeInClose() { this.fadeInOpen(); },

        async fadeOutOpen() {
            await this.tick();
            this.opacity = 0;
            this.left = 0;
            await this.wait();
            this.displayState = "none";
        },
        fadeOutClose() { this.fadeOutOpen(); },

        async slideInOpen() {
            this.displayState = "block";
            this.left = "100%";
            this.opacity = 1;
            await this.tick();
            this.left = 0;
        },

        async slideInClose() {
            this.displayState = "block";
            this.left = "-200px";
            this.opacity = 1;
            await this.tick();
            this.left = 0;
        },

        async slideOutOpen() {
            this.opacity = 1;
            await this.tick();
            this.left = "-200px";
            await this.wait();
            this.displayState = "none";
        },

        async slideOutClose() {
            this.opacity = 1;
            await this.tick();
            this.left = "100%";
            await this.wait();
            this.displayState = "none";
        },

        async tick() {
            return await new Promise((resolve): void => {
                setTimeout((): void => {
                    resolve(true);
                }, 20);
            });
        },

        async wait() {
            return await new Promise((resolve): void => {
                setTimeout((): void => {
                    resolve(true);
                }, 300);
            });
        },
    };
}