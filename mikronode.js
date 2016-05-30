var api = require('mikronode');
var RouterController = require("./controllers/RouterController");

function connect(ip, cb) {
    //console.log(ip);
    RouterController.getRouterByIp(ip, function (err, router) {
        if (err) {
            cb(err);
        } else {
            console.log("login to router");
            console.log(router);
            var connection = new api(router[0].ip, router[0].username, router[0].password);

            connection.connect(function (conn) {
                cb(null, conn);
            });
            connection.on('error', function (err) {
                console.error('Error connecting to '+ip+' : ', err);
                cb(err);
            });
        }
    });
};

exports.connect = connect;