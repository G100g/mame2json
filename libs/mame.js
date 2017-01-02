'use strict';
const spawn = require('cross-spawn');

/**
 * 
 * 
 * @param {String} command Command to run
 * @param {Array} args Command arguments
 * @returns {Promise}
 */
function createSpawn(command, args) {
    return new Promise((resolve, reject) => {
        let proc = null;
        let dataResult = '';
        try {
            proc = spawn(command, args, {
                stdio: 'inherit'
            });
        } catch (e) {
            reject(e);
        }

        proc.stdout.setEncoding('utf8');
        proc.stdout.on('data', function (d) {
            dataResult += d;
        });
        proc.stderr.on('data', function (d) {
            console.error(d);
        });

        proc.on('error', function (e) {
            reject(e);
        });

        proc.on('exit', function (code) {
            resolve({
                code,
                data: dataResult
            });
        });

    });
}


module.exports = {
    listFullResult() {
        return createSpawn('mame64', ['-listfull']);
    }
}