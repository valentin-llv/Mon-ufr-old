"use strict"

import CacheManager from "../../data/cache-manager/cache-manager.js";
import DataManager from "../../data/data-manager/data-manager.js";
import FetchManager from "../../data/fetch-manager/fetch-manager.js";
import Server from "../../data/server-manager/server.js";
import PageNavigator from "../../navigation/pageNavigator/pageNavigator.js";
import Store from "../../petite-vue/store/store.js";
import DateManager from "../../utils/date-manager.js";

export default function MailMessage(props): any {
    return {
        $template: "#message-template",
        loading: true,

        messageId: props.messageId,
        messageBox: props.box,

        seen: false,
        error: false,

        rawMessageData: {}, 
        message: {},

        async load() {
            if(this.loading) {
                let result = await CacheManager.getInstance().checkCache(Server.getInstance()["mailsUrl"] + "/?query=getMail&mail=22109034t&pass=8Gn5mt!U4!!E&box=" + this.messageBox + "&mailId=" + this.messageId.id, false);

                if(!result) {
                    let result = await FetchManager.getInstance().fetch("/?query=getMail&mail=22109034t&pass=8Gn5mt!U4!!E&box=" + this.messageBox + "&mailId=" + this.messageId.id, "mailsUrl");
                    
                    if(!result) {
                        this.error = true;
                        this.loading = false;

                        return false;
                    } else this.rawMessageData = result.mailsData;
                } else this.rawMessageData = result.mailsData;

                if(this.messageId.flags.includes("\\Seen")) {
                    this.seen = true;
                }

                this.parseMessage(this.rawMessageData);
                Store.getInstance().mail.messages.push(this);
                
                this.loading = false;
            }
        },

        click() {
            Store.getInstance().mailContent.message = this.message;
            Store.getInstance().mailContent.message["messageId"] = this.messageId;
            Store.getInstance().mailContent.message["messageBox"] = this.messageBox;
            FetchManager.getInstance().fetch("/?query=setRead&mail=22109034t&pass=8Gn5mt!U4!!E&box=" + this.messageBox + "&mailId=" + this.messageId.id, "mailsUrl", {
                cache: false,
            });

            for(let i = 0; i < DataManager.getInstance().data.mail.hierarchy[this.messageBox].length; i++) {
                if(DataManager.getInstance().data.mail.hierarchy[this.messageBox][i].id == this.messageId.id) {
                    DataManager.getInstance().data.mail.hierarchy[this.messageBox][i].flags.push("\\Seen");
                }
            }
            setTimeout(() => {
                this.seen = true;
                Store.getInstance().mail.hierarchy = DataManager.getInstance().data.mail.hierarchy;

                let tab = Store.getInstance().mail.tabsDisplay;
                Store.getInstance().mail.changeSelectedTab(-1);
                setTimeout(() => {
                    Store.getInstance().mail.changeSelectedTab(tab);
                }, 100);

                Store.getInstance().mail.unseenCounter = 0;
                if(Store.getInstance().mail.unseenCounter == 0) {
                    Store.getInstance().mail.isUnseen = false;
                }
            }, 300);

            PageNavigator.getInstance().goto("mail-content-page");
        },

        update(messageId) {
            if(messageId.flags.includes("\\Seen")) this.seen = true;
            else this.seen = false;
        },

        parseMessage(messageData) {
            // From
            let from = messageData.from[0];
            if(from.includes('"')) {
                from = from.split('"')[1]
            }
            from = from.split(" <")[0];
            this.message.from = from;

            // Title
            let title = messageData.title[0];
            this.message.title = title;

            // First letter
            let firstLetter = from[0];
            this.message.firstLetter = firstLetter;

            // To
            this.message.to = [];
            if(messageData.to) {
                let toArray = messageData.to[0].split(',');
                for(let i = 0; i < toArray.length; i++) {
                    let sender = toArray[i].split(" <")[0];
                    this.message.to.push(sender);
                }
            }

            // CC
            this.message.cc = [];
            if(messageData.cc) {
                for(let i = 0; i < messageData.cc.length; i++) {
                    let copy = messageData.cc[i].split(" <")[0];
                    this.message.cc.push(copy);
                }
            }

            // Text content
            this.message.text = messageData.text;

            // Html content
            if(messageData.html) {
                messageData.html = messageData.html.replaceAll("#000000", "unset");
                messageData.html = messageData.html.replaceAll('valign="BASELINE"', "");
                messageData.html = messageData.html.replaceAll('align="RIGHT"', 'align="LEFT"');
            }
            this.message.html = messageData.html;

            // Date
            let dateString = messageData.date;
            let date = DateManager.parseDate(dateString);
            this.message.date = date;

            // Attachments
            let attachements = messageData.attachements;
            for(let i = 0; i < attachements.length; i++) {
                if(attachements[i].filename.includes("=?UTF-8?")) {
                    attachements[i].filename = "sans_nom";
                }

                if(!attachements[i].filename.includes(".")) {
                    attachements[i].filename += "." + attachements[i].fileType;
                }
            }

            this.message.attachments = attachements;
        },
    };
}