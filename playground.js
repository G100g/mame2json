'use strict';
const mame2json = require('./');

console.log("PLayground");

mame2json.listFull()
    .then((result) => {

        console.log(result);

    }, (error) => {

        console.error(error);

    });