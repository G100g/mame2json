'use strict';

const assert = require('assert');
var mockSpawn = require('mock-spawn');

const mockery = require('mockery');

const mockListFull = require('./__mocks__/mame').listFullResult();
const mockVersion = require('./__mocks__/mame').versionResult();
const mockListXmlSingle = require('./__mocks__/mame').listXmlResult('wboy');

const C = require('../libs/constants');
let mame2json;
let spawn;
let returnSpawFunction;

describe('mame2json', () => {

    beforeEach(function() {
        spawn = mockSpawn(false);
        returnSpawFunction = spawn.simple(1 /* exit code */, '' /* stdout */, '{ [Error: spawn ENOTDIR] code: \'ENOTDIR\', errno: \'ENOTDIR\', syscall: \'spawn\' }');
        mockery.enable({ useCleanCache: true });        
        mockery.registerMock('child_process', { spawn: spawn });
        mockery.registerAllowable('../', true);
        mockery.warnOnUnregistered(false);
        mame2json = require('../')
    });

    afterEach(function () {
        mockery.deregisterAll();
        mockery.resetCache();
        mockery.disable();
    });

    it('Get version', function() {
    
        // Mock MAME binary response
        spawn.setDefault(spawn.simple(0 /* exit code */, mockVersion /* stdout */));

        const expected = '0.180';

        return mame2json.version()
            .then((result) => {
                assert.deepEqual(result, expected, 'Returned version match ' + expected);    
            })
            .catch((e) => {
                assert.fail(e, 'Error getting version')
            });
    });

    it.skip('Get version without output', function() {
    
        // Mock MAME binary response
        spawn.setDefault(spawn.simple(0 /* exit code */, mockVersion /* stdout */));

        const expected = '0.180';

        return mame2json.version()
            .then((result) => {
                assert.deepEqual(result, expected, 'Returned version match ' + expected);    
            })
            .catch((e) => {
                assert.fail(e, 'Error getting version')
            });
    });

    it('Get object from listFull', function() {

        // Mock MAME binary response
        spawn.setDefault(spawn.simple(0 /* exit code */, mockListFull /* stdout */));

        const expected = {
            'as_mp2': '"Mission Possible 2 (Lowen, V114)"',
            'as_otr': '"Over The Rainbow (Astra, V104)"',
            'as_otra': '"Over The Rainbow (Astra, V102)"',
            'as_party': '"Party Time (Astra, V105)"',
        };

        return mame2json.listFull().then((result) => {
            assert.deepEqual(result, expected, 'Got listfull object');    
        })
        .catch((e) => {
            assert.fail(e, 'Error getting listfull')
        });

    });

    it('Get object from listxml of a single game', () => {

        const game = 'wboy';

        // Mock MAME binary response
        spawn.setDefault(spawn.simple(0 /* exit code */, mockListXmlSingle /* stdout */));
 
        const expected = {
            'wboy': {
                'description': 'Wonder Boy (set 1, 315-5177)',
                'year': '1986',
                'manufacturer': 'Escape (Sega license)',
                'driver': {
                    'status': 'good',
                    'emulation': 'good',
                } 
            }
        };

        return mame2json.listXml(game).then((result) => {
            assert.deepEqual(result, expected, 'Got listfull object');    
        })
        .catch((e) => {
            assert.fail(e, 'Error getting listfull')
        });

    });

    it('listxml without game return error', () => {

        const game = '';

        // Mock MAME binary response
        spawn.setDefault(spawn.simple(1 /* exit code */, '' /* stdout */));
 
        return mame2json.listXml(game).then((result) => {
            assert.fail(e, 'listxml without gamename should return an error')
        })
        .catch((e) => {
            assert.equal(e, false);
        });

    });


});
