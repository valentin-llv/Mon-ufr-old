// Require modules

import http from "http";
import https from "https";

import fetch from 'node-fetch';

http.createServer((request, response) => {
    if(request.method == "GET") {
        let urlParams = parseUrl(request.url);

        if(urlParams.query) {
            fetch(urlParams.query).then((data) => {
                return data.text();
            }).then((data) => {
                response.writeHead(200, {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET",
                });
                response.end(JSON.stringify({ response: data }));
            }).catch(() => {
                response.writeHead(200, {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET",
                });
                response.end(JSON.stringify({ response: false }));
            });
        }
    }
}).listen(8080);

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