# mame2json
[![Build Status](https://travis-ci.org/G100g/mame2json.svg?branch=master)](https://travis-ci.org/G100g/mame2json)

This project aim to create a wrapper around MAME bin

## listFull

Convert the output of command

```sh
$ mame -listfull
```

To an *Object* like this

```js
{
    as_mp2: '"Mission Possible 2 (Lowen, V114)"',
    as_otr: '"Over The Rainbow (Astra, V104)"',
    as_otra: '"Over The Rainbow (Astra, V102)"',
    as_party: '"Party Time (Astra, V105)"',
    ...
}
```

## TODO
- [ ] **listsource** option
- [ ] **listclones** option
- [ ] **listbrothers** option
- [ ] **listcrc** option
- [ ] **listroms** option
- [ ] **listsamples** option
- [ ] **listdevices** option
- [ ] **listslots** option
- [ ] **listmedia** option
- [ ] **listsoftware** option