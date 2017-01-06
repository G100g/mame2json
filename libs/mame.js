'use strict';
const spawn = require('cross-spawn');
const C = require('./constants');

let mameBinaryPath = 'mame';

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
        let errorMessage = '';
        try {
            proc = spawn(command, args);
        } catch (e) {
            reject(e);
        }

        proc.stdout.setEncoding('utf8');
        proc.stdout.on('data', function (d) {
            dataResult += d;
        });
        proc.stderr.on('data', function (d) {
            errorMessage += d;
        });

        proc.on('error', function (e) {
            reject(e);
        });

        proc.on('exit', function (code) {

            if(code > 0) {

                if(errorMessage.indexOf('ENOTDIR') !== -1) {
                    reject(C.NOT_MAME_BIN);
                } else {
                    reject('Error');
                }
            }
            resolve({
                code,
                data: dataResult
            });
        });

    });
}

module.exports = {
    setBinary(binary) {
        mameBinaryPath = binary;
    },
    getVersion() {
        return createSpawn(mameBinaryPath, ['-?']);
    },
    listFullResult() {
        return createSpawn(mameBinaryPath, ['-listfull']);
    },
    listXmlResult(game) {
        return createSpawn(mameBinaryPath, ['-listxml', game]);
    }
}