const fs = require('fs');
const path = require('path');

function getFilesContent(filename) {
    return fs.readFileSync(filename, { encoding: "utf8" });
}

module.exports = {
    listFullResult: function() {
        const result = getFilesContent(path.join(__dirname, 'listfull.txt'));
        return result;
    },
    versionResult: function() {
        const result = getFilesContent(path.join(__dirname, 'version.txt'));
        return result;
    },
    listXmlResult: function(game) {
        const result = getFilesContent(path.join(__dirname, 'listxml.' + game + '.xml'));
        return result;
    }
}