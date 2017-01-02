'use strict';
const test = require('tape');
var mockSpawn = require('mock-spawn');
var spawn = mockSpawn();
const mockery = require('mockery');
mockery.enable({ useCleanCache: true });        
mockery.registerMock('child_process', { spawn: spawn });
mockery.registerAllowable('../', true);


//require('child_process').spawn = mySpawn;
const mockListFull = require('./__mocks__/mame').listFullResult();

const mame2json = require('../');


test('Get object from listFull', function(assert) {

    // Mock MAME binary response
    spawn.setDefault(spawn.simple(1 /* exit code */, mockListFull /* stdout */));

    const result = mame2json.listFull();
    const expected = {
        'as_mp2': '"Mission Possible 2 (Lowen, V114)"',
        'as_otr': '"Over The Rainbow (Astra, V104)"',
        'as_otra': '"Over The Rainbow (Astra, V102)"',
        'as_party': '"Party Time (Astra, V105)"',
    };

    result.then((result) => {
        assert.same(result, expected);    
        assert.end();
    })
    .catch((e) => {
        console.error(e);
        assert.end();
    });

});

