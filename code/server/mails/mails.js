// Require modules

import http from "http";
import https from "https";

import fs from 'fs';

import imaps from 'imap-simple';

http.createServer(
    // {
    //     key: fs.readFileSync('/etc/letsencrypt/live/test.valentin-lelievre.com/privkey.pem'),
    //     cert: fs.readFileSync('/etc/letsencrypt/live/test.valentin-lelievre.com/fullchain.pem'),
    // }, 
    async (request, response) => {
    if(request.method != "GET") {
        response.end(`${request.method} from origin ${request.headers.origin} is not allowed for the request.`);
    }

    let urlParams = parseUrl(request.url);
    if(!urlParams.query) {
        response.end(`Request query is not defined !`);
    }

    if(urlParams.query == "getHierarchy") {
        let hierarchy = await MailManager.getInstance().getHierarchy(urlParams);

        response.writeHead(200, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
        });
        response.end(JSON.stringify(hierarchy));
    }

    if(urlParams.query == "getMail") {
        let mail = await MailManager.getInstance().getNewMail(urlParams);

        response.writeHead(200, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
        });
        response.end(JSON.stringify(mail));
    }

    if(urlParams.query == "setRead") {
        MailManager.getInstance().setRead(urlParams);

        response.writeHead(200, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
        });
        response.end("true");
    }

    if(urlParams.query == "moveMail") {
        MailManager.getInstance().moveMail(urlParams);

        response.writeHead(200, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
        });
        response.end("true");
    }
}).listen(8090);

/* Mails manager */

class MailManager {
    static _instance = null;

    static getInstance() {
        if(!MailManager.instance) MailManager.instance = new MailManager();
        return MailManager.instance;
    }

    constructor() {}

    getMailsConfig(mail, pass) {
        return {
            imap: {
                user: mail,
                password: pass,
                host: 'imapetu.univ-tours.fr',
                port: 993,

                tls: {
                    secureProtocol: "TLSv1_method",
                }
            },
        }
    }

    async getHierarchy(request) {
        let config = this.getMailsConfig(decodeURI(request.mail), decodeURI(request.pass));

        let connection = await this.connect(config);
        if(!connection) return { hierarchy: false, error: "con-error" }

        let boxes = await this.getBoxes(connection);
        if(!boxes) return { hierarchy: false, error: "search-box-error" }

        let mailsId = await this.getMailsId(connection, boxes);
        if(!mailsId) return { hierarchy: false, error: "search-ids-error" }

        connection.end();
        return { hierarchy: mailsId, };
    }

    async connect(config) {
        try { return await imaps.connect(config);
        } catch(e) { return false; }
    }

    async openBox(connection, boxName) {
        try { await connection.openBox(boxName); return true;
        } catch(e) { return false; }
    }

    async getBoxes(connection) {
        let boxes;
        try { boxes = await connection.getBoxes();
        } catch(e) { return false; }
        
        let searchedBoxes = [];
        let ignoredBoxes = ["Junk", "Draft"];
        let boxesKeys = Object.keys(boxes);

        for(let i = 0; i < boxesKeys.length; i++) {
            if(!ignoredBoxes.includes(boxesKeys[i])) {
                if(boxesKeys[i] == "INBOX") {
                    searchedBoxes.push("Réception");
                } else if(boxesKeys[i] == "Trash") {
                    searchedBoxes.push("Corbeille");
                } else if(boxesKeys[i] == "Sent") {
                    searchedBoxes.push("Envoyé");
                } else searchedBoxes.push(boxesKeys[i]);
            }
        }

        return searchedBoxes;
    }

    async getMailsId(connection, boxes) {
        let mailsPerBox = {};
        for(let i = 0; i < boxes.length; i++) {
            let box = boxes[i];
            if(box == "Réception") {
                box = "INBOX";
            } else if(box == "Corbeille") {
                box = "Trash";
            } else if(box == "Envoyé") {
                box = "Sent";
            }

            let state = await this.openBox(connection, box);
            if(!state) return false;

            let result = await this.loadMailsHeader(connection);
            if(!result) {
                continue;
            } else mailsPerBox[boxes[i]]  = result;
        }

        return mailsPerBox;
    }

    async loadMailsHeader(connection) {
        let mails = await connection.search(['ALL'], {
            bodies: ['HEADER.FIELDS (UID, FLAGS)'],
        }).catch(() => {
            return false;
        });

        let mailsId = [];
        for(let i = 0; i < mails.length; i++) {
            mailsId.push({
                id: mails[i].attributes.uid,
                flags: mails[i].attributes.flags,
            });
        }

        return mailsId;
    }

    async getNewMail(request) {
        let config = this.getMailsConfig(decodeURI(request.mail), decodeURI(request.pass));

        let connection = await this.connect(config);
        if(!connection) return { mailsData: false }

        let box = decodeURI(request.box);
        if(box == "Réception") {
            box = "INBOX";
        } else if(box == "Corbeille") {
            box = "Trash";
        } else if(box == "Envoyé") {
            box = "Sent";
        }
        
        let state = await this.openBox(connection, box);
        if(!state) return { mailsData: false };

        let mail = await this.downloadMail(connection, decodeURI(request.mailId));
        if(!mail || (Array.isArray(mail) && mail.length == 0)) return { mailsData: false };

        let mailsData = await this.parseMail(connection, mail);

        connection.end();
        return { mailsData: mailsData, };
    }

    async parseMail(connection, message) {
        let parsedMessage = {
            text: null,
            html: null,
            attachements: [],

            flags: message[0].attributes.flags,
            uid: message[0].attributes.uid,
            title: message[0].parts[0].body.subject,
            date: message[0].attributes.date,
            from: message[0].parts[0].body.from,
            to: message[0].parts[0].body.to,
            cc: message[0].parts[0].body.cc,
        };

        let parts;
        try { parts = await imaps.getParts(message[0].attributes.struct);
        } catch(e) { return parsedMessage; }

        for(let j = 0; j < parts.length; j++) {
            if(parts[j].disposition && parts[j].disposition.type.toUpperCase() == 'ATTACHMENT') {
                let partData = await connection.getPartData(message[0], parts[j]).catch(() => { return null; });

                if(partData) {
                    parsedMessage.attachements.push({
                        filename: parts[j].disposition.params.filename,
                        fileType: parts[j].subtype,
                        data: partData,
                    });
                }
            } else if(parts[j].subtype.toUpperCase() == 'HTML') {
                let partData = await connection.getPartData(message[0], parts[j]).catch(() => { return null; });
                parsedMessage.html = partData;
            } else if(parts[j].subtype.toUpperCase() == 'PLAIN') {
                let partData = await connection.getPartData(message[0], parts[j]).catch(() => { return null; });
                parsedMessage.text = partData;
            }
        }

        return parsedMessage;
    }

    async downloadMail(connection, mailId) {
        return await connection.search([["UID", mailId + ""]], {
            bodies: ['HEADER.FIELDS (FROM TO SUBJECT CC)', "TEXT"],
            struct: true,
        }).catch(() => {
            return false;
        });
    }

    async setRead(request) {
        let config = this.getMailsConfig(decodeURI(request.mail), decodeURI(request.pass));

        let connection = await this.connect(config);
        if(!connection) return false;

        let box = decodeURI(request.box);
        if(box == "Réception") {
            box = "INBOX";
        } else if(box == "Corbeille") {
            box = "Trash";
        } else if(box == "Envoyé") {
            box = "Sent";
        }

        await this.openBox(connection, box);
        await connection.addFlags(decodeURI(request.mailId), "\\Seen");

        connection.end();
        return true;
    }

    async moveMail(request) {
        let config = this.getMailsConfig(decodeURI(request.mail), decodeURI(request.pass));

        let connection = await this.connect(config);
        if(!connection) return false;

        let box = decodeURI(request.box);
        if(box == "Réception") {
            box = "INBOX";
        } else if(box == "Corbeille") {
            box = "Trash";
        } else if(box == "Envoyé") {
            box = "Sent";
        }

        await this.openBox(connection, box);

        let newBox = decodeURI(request.newBox);
        if(newBox == "Réception") {
            newBox = "INBOX";
        } else if(newBox == "Corbeille") {
            newBox = "Trash";
        } else if(newBox == "Envoyé") {
            newBox = "Sent";
        }

        await connection.moveMessage(decodeURI(request.mailId), newBox);

        connection.end();
        return true;
    }
}

function parseUrl(url) {
    let urlData = {};

    url = url.slice(2, url.length);
    url = url.replaceAll('%22', '"');
    let array = url.split('&');

    for(let i = 0; i < array.length; i++) {
        let equalIndex = array[i].indexOf("=");
        let key = array[i].slice(0, equalIndex);
        let value = array[i].slice(equalIndex + 1, array[i].length);

        urlData[key] = value;
    }

    return urlData;
}