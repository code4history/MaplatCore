var MaplatApp = require('../src/index').MaplatApp;

var Maplat = window.Maplat = {};
Maplat.createObject = function(option) {
    return new Promise(function(resolve) {
        var app = new MaplatApp(option);
        app.waitReady.then(function() {
            resolve(app);
        });
    });
};