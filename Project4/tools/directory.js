var getAllFilesInDirectory = function(dir) {

    var filesystem = require("fs");
    var results = [];

    filesystem.readdirSync(dir).forEach(function(file) {

        file = dir+'/'+file;
        var stat = filesystem.statSync(file);

        if (stat && stat.isDirectory()) {
            results = results.concat(getAllFilesInDirectory(file))
        } else results.push(file);
    });

    return results;
};

module.exports = getAllFilesInDirectory;