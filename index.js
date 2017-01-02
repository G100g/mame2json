'use strict';
const mame = require('./libs/mame');

module.exports = {
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

    }
}

