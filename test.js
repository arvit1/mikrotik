/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


// readFileUsingPromises.js
var FS = require('fs'),
        Q = require('q');

var deferred = Q.defer();
function readJson(filename) {
    FS.readFile(filename, "utf-8", function (error, text) {
        if (error) {
            deferred.reject(error);
        } else {
            deferred.resolve(text);
        }
    });
    return deferred.promise;
}

for(var i = 0; i < 3; i++){
    console.log(i)
    var filename = i+".js";
    readJson(filename)
        .then(function(res){
            console.log(res);
        })
        .catch(function(err){
            console.log("erroriiiiiiiiiiiiii " + err);
        })
        .done();
}