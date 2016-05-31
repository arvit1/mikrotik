/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


    var FS = require('fs'),
            Q = require('q');

    var deferred = Q.defer();
    function readJson(filename) {
        FS.readFile(filename, "utf-8", function (error, text) {
            if (error) {
                deferred.reject(new Error(error));
            } else {
                deferred.resolve(text);
            }
        });
        return deferred.promise;
    }



var Q = require('q');
require('q-foreach')(Q);

var array = ["app.js","0.js","kot.js"];

Q.forEach(array, function (value) {  
  
  return readJson(value);
}).then(function (resolutions)
{
  console.log('All 5 items completed!',resolutions); // Will output the order in which items were done... [5,4,3,2,1]
}).catch(function (err)
{
  console.log('error: ',err); // Will output the order in which items were done... [5,4,3,2,1]
});


/*  var api = require('mikronode');

 var connection = new api('192.2.2.9','admin','1234');
 connection.connect(function(conn) {

    var chan=conn.openChannel();

    chan.write('/ip/address/print',function() {
       chan.on('done',function(data) {

          var parsed = api.parseItems(data);

          parsed.forEach(function(item) {
             console.log('Interface/IP: '+item.interface+"/"+item.address);
          });

          chan.close();
          conn.close();

       });
    });
 }); */