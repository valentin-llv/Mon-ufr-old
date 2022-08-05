"use strict"

export default function Popup(): any {
    return {
        marginTop: "-40px",
        opacity: "0",
        display: "none",

        text: "",
        callback: null,
        showCancel: true,

        openTime: 0,
        openDuration: 3500,

        usePopup(text, callback = () => {}, showCancel = true) {
            this.text = text;
            this.callback = callback;
            this.showCancel = showCancel;
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