"use strict"

export default function Popup(): any {
    return {
        marginTop: "-40px",
        opacity: "0",
        display: "none",

        text: "",
        callback: null,

        openTime: 0,
        openDuration: 3500,

        usePopup(text, callback) {
            this.text = text;
            this.callback = callback;
            this.openTime = Date.now();

            this.openPopup();
            setTimeout(() => {
                this.closePopup();
            }, this.openDuration);
        },

        clicked() {
            this.openTime = 0;
            this.closePopup();
            this.callback();
        },

        openPopup() {
            this.display = "flex";

            setTimeout(() => {
                this.marginTop = "-60px";
                this.opacity = "1";
            }, 10);
        },

        closePopup() {
            if(this.openTime + this.openDuration < Date.now()) {
                this.marginTop = "-40px";
                this.opacity = "0";

                setTimeout(() => {
                    this.display = "none";
                }, 300);
            }
        }
    };
}