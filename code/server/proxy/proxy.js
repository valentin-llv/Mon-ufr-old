// Require modules

import http from "http";
import https from "https";

import fs from 'fs';

import fetch from 'node-fetch';

http.createServer(
    // {
    //     key: fs.readFileSync('/etc/letsencrypt/live/server.valentin-lelievre.com/privkey.pem'),
    //     cert: fs.readFileSync('/etc/letsencrypt/live/server.valentin-lelievre.com/fullchain.pem'),
    // }, 
    (request, response) => {
    if(request.method != "GET") {
        response.end(`${request.method} from origin ${request.headers.origin} is not allowed for the request.`);
        return false;
    }

    let urlParams = parseUrl(request.url);
    if(!urlParams.query) {
        response.end(`Request query is not defined !`);
        return false;
    }

    fetch(urlParams.query).then((data) => {
        return data.text();
    }).then((data) => {
        response.writeHead(200, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
        });
        response.end(JSON.stringify({ response: data }));
        return false;
    }).catch(() => {
        response.writeHead(200, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
        });
        response.end(JSON.stringify({ response: false }));
        return false;
    });
}).listen(3000);

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