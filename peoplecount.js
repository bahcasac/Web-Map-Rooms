//
// Copyright (c) 2018 Cisco Systems
// Licensed under the MIT License 
//

/**
 * / 
 * /!\ This example only works when run against a 'RoomKit' type of device
 */

//
// Connect to the device
//
var http = require('http');
const jsxapi = require('jsxapi');

// Check args
if (!process.env.JSXAPI_DEVICE_URL || !process.env.JSXAPI_USERNAME) {
    console.log("Please specify info to connect to your device as JSXAPI_DEVICE_URL, JSXAPI_USERNAME, JSXAPI_PASSWORD env variables");
    console.log("Bash example: JSXAPI_DEVICE_URL='ssh://10.97.32.105' JSXAPI_USERNAME='integrator' JSXAPI_PASSWORD='cisco123' node peoplecount.js");
    process.exit(1);
}
    
// Empty passwords are supported
const password = process.env.JSXAPI_PASSWORD ? process.env.JSXAPI_PASSWORD : "";

// Connect to the device
console.log("connecting to your device...");
const xapi = jsxapi.connect(process.env.JSXAPI_DEVICE_URL, {
    username: process.env.JSXAPI_USERNAME,
    password: password
});
xapi.on('error', (err) => {
    console.error(`connexion failed: ${err}, exiting`);
    process.exit(1);
});


//
// Lógica
//

xapi.on('ready', () => {
    console.log("connexion successful");

    // Fetch current count  *busca o atual número de pessoas*
    xapi.status
        .get('RoomAnalytics PeopleCount')
        .then((count) => {
            console.log(`Initial count is: ${count.Current}`);

            // Listen to events
            console.log('Adding feedback listener to: RoomAnalytics PeopleCount');
            xapi.feedback.on('/Status/RoomAnalytics/PeopleCount', (count) => {
                //console.log(`Updated count to: ${count.Current}`);
                console.log($count.Current)
            });

        })
        .catch((err) => {
            console.log(`Failed to fetch PeopleCount, err: ${err.message}`);
            console.log(`Are you interacting with a RoomKit? exiting...`);
            xapi.close();
        });
});

//Conection
http.createServer(function(req,res) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h2>Updated count to: ${count.Current}</h2>');
  }).listen(3000);
  console.log('Servidor iniciado em localhost:3000. Ctrl+C para encerrar…');
  
