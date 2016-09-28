require('babel-register');
var path = require('path');
var glob = require('glob');

process.argv.slice(2).forEach(function (arg) {
    glob(arg, function (er, files) {
        if (er) throw er;

        files.forEach(function (file) {
            require(path.resolve(process.cwd(), file));
        });
    });
});

