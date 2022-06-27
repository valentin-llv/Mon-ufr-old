// Require modules

import http from "http";
import https from "https";

import fs from 'fs';

import nodemailer from 'nodemailer';

http.createServer(
    // {
    //     key: fs.readFileSync('/etc/letsencrypt/live/test.valentin-lelievre.com/privkey.pem'),
    //     cert: fs.readFileSync('/etc/letsencrypt/live/test.valentin-lelievre.com/fullchain.pem'),
    // },
    (request, response) => {
    if(request.method != "GET") {
        response.end(`${request.method} from origin ${request.headers.origin} is not allowed for the request.`);
    }

    let urlParams = parseUrl(request.url);
    if(!urlParams.from || !urlParams.message) {
        response.end(`From or Message parameter are invalid`);
    }

    sendMail(decodeURI(urlParams.from), decodeURI(urlParams.message));
}).listen(9000);

function sendMail(sender, text) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'lelievre.valentin17@gmail.com',
            pass: 'ejtpbdgirrqyitbf',
        }
    });

    let htmlMailContent = "Nouveau message de" + sender + "<br /><br />" + text.replaceAll('\n', "<br />");
    let textMailContent = "Nouveau message de" + sender + "\n\n" + text;

    transporter.sendMail({
        from: 'Mon UFR mail sender <lelievre.valentin17@gmail.com>',
        to: "lelievre.valentin17@gmail.com",
        subject: "Mon UFR - User feedback",
        text: textMailContent,
        html: htmlMailContent,
    });
}

function parseUrl(url) {
    let urlData = {};

    url = url.slice(2, url.length);
    let array = url.split('&');

    for(let i = 0; i < array.length; i++) {
        let equalIndex = array[i].indexOf("=");
        let key = array[i].slice(0, equalIndex);
        let value = array[i].slice(equalIndex + 1, array[i].length);

        urlData[key] = value;
    }

    return urlData;
}