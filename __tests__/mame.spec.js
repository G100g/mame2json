'use strict';
// const test = require('tape');
const assert = require('assert');
var mockSpawn = require('mock-spawn');

const mockery = require('mockery');


const mockListFull = require('./__mocks__/mame').listFullResult();
const mockVersion = require('./__mocks__/mame').versionResult();
const mockListXmlSingle = require('./__mocks__/mame').listXmlResult('wboy');

const C = require('../libs/constants');
let mame;
let spawn;
let returnSpawFunction;

describe('MAME wrapper', () => {

    beforeEach(function() {
        spawn = mockSpawn(false);
        returnSpawFunction = spawn.simple(1 /* exit code */, '' /* stdout */, '{ [Error: spawn ENOTDIR] code: \'ENOTDIR\', errno: \'ENOTDIR\', syscall: \'spawn\' }');
        mockery.enable({ useCleanCache: true });        
        mockery.registerMock('child_process', { spawn: spawn });
        mockery.registerAllowable('../libs/mame', true);
        mockery.warnOnUnregistered(false);
        mame = require('../libs/mame')
    });

    afterEach(function () {
        mockery.deregisterAll();
        mockery.resetCache();
        mockery.disable();
    });

    it('MAME bin not found', () => {
        
       spawn.setDefault(returnSpawFunction);

       return mame.getVersion()
            .catch((e) => {
                assert.equal(e, C.NOT_MAME_BIN, 'Right error message');
            });
    });

    it('MAME64 bin not found', () => {

        spawn.setStrategy(function (command, args, opts) {
            if (command === 'mame64') { return returnSpawFunction; } // use default
            if (command === 'mame') { return null; } // use default
        });

        mame.setBinary('mame64');

        return mame.getVersion()
            .catch((e) => {
                assert.equal(e, C.NOT_MAME_BIN, 'Right error message');
            });

    });

    it('Get version from MAME bin', function() {

        // Mock MAME binary response
        spawn.setDefault(spawn.simple(0 /* exit code */, mockVersion /* stdout */));

        mame.setBinary('mame');

        const expected = mockVersion;

        return mame.listFullResult().then((proc) => {
            assert.equal(proc.data, expected, 'MAME info displayed');    
        })
        .catch((e) => {
            assert.fail(e)
        });

    });

    it('Get listFull result from MAME bin', function() {

        // Mock MAME binary response
        spawn.setDefault(spawn.simple(0 /* exit code */, mockListFull /* stdout */));

        mame.setBinary('mame');

        const expected = mockListFull;

        return mame.listFullResult().then((proc) => {
            assert.equal(proc.data, expected, '-listfull output displayed');    
        })
        .catch((e) => {
            assert.fail(e)
        });

    });

    it('Get listxml output of a single game', () => {

        const game = 'wboy';

        // Mock MAME binary response
        spawn.setDefault(spawn.simple(0 /* exit code */, mockListXmlSingle /* stdout */));

        const expected = mockListXmlSingle;

        return mame.listXmlResult(game).then((proc) => {
            assert.equal(proc.data, expected, '-listxml for ' + game + ' output displayed');    
        })
        .catch((e) => {
            assert.fail(e)
        });

    });

});


