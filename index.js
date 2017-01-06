'use strict';
const mame = require('./libs/mame');
const parse = require('xml2js').parseString;
var inspect = require('util').inspect;

module.exports = {
    version: function() {

        return mame.getVersion()
                        .then((result) => {
                            if (result.code === 1) {

                                const re = /^MAME\s{1}v([0-9\.]+)/gi;
                                let match;
                                let version = {};

                                while ((match = re.exec(result.data)) !== null) {

                                    // var msg = 'Found ' + match[0] + '. ';
                                    // msg += 'Next match starts at ' + re.lastIndex;
                                    // console.log(msg);
                                    // console.log(JSON.stringify(match, null, 4));

                                    version = match[1];

                                }

                                return version;

                            }

                            //resolve('');
                            return '';

                        })
                        .catch(e => e);


        // return new Promise((resolve, reject) => {
        //     resolve('0.180');
        // });
    },
    listFull: function() {
        return new Promise((resolve, reject) => {
            
            mame
                .listFullResult()
                .then((result) => {
                    
                    if (result.code === 1) {

                        const re = /([a-zA-Z_0-9]+)\s+(".*")/gi;
                        let match;
                        const resultObject = {};

                        while ((match = re.exec(result.data)) !== null) {

                            // var msg = 'Found ' + match[0] + '. ';
                            // msg += 'Next match starts at ' + re.lastIndex;
                            // console.log(msg);
                            // console.log(JSON.stringify(match, null, 4));

                            resultObject[match[1]] = match[2];

                        }

                        resolve(resultObject);

                    }

                    resolve('');

                })
                .catch(reject);

        });

    },
    listXml: function(game) {
        return mame
                .listXmlResult(game)
                .then((result) => {

                    return new Promise((resolve, reject) => {

                        let defaultInfos = {
                            'description': '',
                            'year': '',
                            'manufacturer': '',
                            'driver': {
                                'status': '',
                                'emulation': '',
                            } 
                        };

                        if (result.code === 1) {
                            const obj = parse(result.data, (err, resultObj) => {

                                if (err) {
                                    reject(err);
                                } else {
                                    
                                    let returnObject = {};                                    

                                    returnObject[game] = resultObj.mame.machine
                                                        // Get only machine game
                                                        .filter(machine => machine.$.name === game)
                                                        .reduce((r, machine) => {

                                                            r.description = machine.description[0];
                                                            r.year = machine.year[0];
                                                            r.manufacturer = machine.manufacturer[0];
                                                            r.driver.status = machine.driver[0].$.status;
                                                            r.driver.emulation = machine.driver[0].$.emulation;

                                                            return r;

                                                        }, defaultInfos)

                                    resolve(returnObject);
                                }
                            });
                        }
                    });
                    

                })
                .catch(e => e);

        }
}

