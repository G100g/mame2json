'use strict';
const test = require('tape');
var mockSpawn = require('mock-spawn');
var spawn = mockSpawn();
const mockery = require('mockery');
mockery.enable({ useCleanCache: true });        
mockery.registerMock('child_process', { spawn: spawn });
mockery.registerAllowable('../libs/mame', true);

const mockListFull = require('./__mocks__/mame').listFullResult();

const mame = require('../libs/mame');

test('Get listFull result from MAME bin', function(assert) {

    // Mock MAME binary response
    spawn.setDefault(spawn.simple(1 /* exit code */, mockListFull /* stdout */));

    const result = mame.listFullResult();
    const expected = mockListFull;

    result.then((proc) => {
        assert.equal(proc.data, expected);    
        assert.end();
    })
    .catch((e) => {
        console.error(e);
        assert.end();
    });

});

