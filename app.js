var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var dns = require('./routes/dns');
var ip = require('./routes/ip');


//var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/mikrotik'); // connect to our database

var api = require('mikronode');

var Router = require('./models/router').Router;
var User = require('./models/user').User;

var RouterController = require("./controllers/RouterController");

var async = require("async");
var Q = require('q');
require('q-foreach')(Q);

var router = express.Router();              // get an instance of the express Router
var app = express();
var cors = require('cors');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', index);
app.use('/users', users);
app.use('/dns', dns);
app.use('/ip', ip);
app.use('/api', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


router.route('/users')
        .post(function (req, res) {

            var user = new User();      // create a new instance of the Router model
            user.name = req.body.name;  // set the routers name (comes from the request)
            user.username = req.body.username;
            user.password = req.body.password;

            user.save(function (err) {
                if (err)
                    res.end(err);
                else
                    res.json({message: 'User created!'});
            });
        })

        .get(function (req, res) {
            User.find(function (err, routers) {
                if (err)
                    res.end(err);
                else
                    res.json(routers);
            });
        })

        .delete(function (req, res) {   //kjo eshte delete all nuk duhet perdor
            User.remove(function (err, users) {
                if (err)
                    res.send(err);
                else
                    res.json(users);
            });
        })

        .put(function (req, res) {
            routerId = req.body.routerId;
            id = req.body.id;

            User.findById(id, function (err, user) {
                if (err)
                    res.end(err);
                else {
                    if (req.body.username)
                        user.username = req.body.username;
                    if (req.body.password)
                        user.password = req.body.password;
                    if (req.body.name)
                        user.name = req.body.name;

                    //user.routers.push({name: "kot"})
                    Router.findById(routerId, function (err, router) {
                        if (err)
                            res.end(err);
                        else {
                            user.routers.push(router);
                            user.save(function (err) {
                                if (err)
                                    res.end(err);
                                else
                                    res.json({message: 'User updated!'});
                            });
                        }
                    });
                }
            });
        })

router.route('/routers')
        .post(function (req, res) {
            RouterController.createRouter(req, res);
        })

        .get(function (req, res) {
            RouterController.getRouters(function (err, router) {
                if (err) {
                    res.end(err);
                } else {
                    res.json(router);
                }
            });
        })

router.route('/routers/:id')
        .delete(function (req, res) {
            RouterController.removeById(req, res);
        })

        .get(function (req, res) {
            RouterController.getRouterById(req, res);
        })

        .put(function (req, res) {      //kjo poshte eshte ip
            RouterController.updateByIp(req.params.id, req.body.address, req.body.username, req.body.password, req.body.name, function (err, data) {
                if (err) {
                    res.end(err);
                } else {
                    res.json(data);
                }
            });
        })

router.route('/dns')
        .post(function (req, res) {
            //console.log(req.body.ip)
            connect(req.body.ip, function (err, conn) {
                var chan = conn.openChannel();

                var arrDns = ['/ip/dns/set'];
                if (req.body.servers) {
                    arrDns.push('=servers=' + req.body.servers);
                }
                console.log(" arrray eshte " + arrDns);
                chan.write(arrDns, function () {
                    chan.on('done', function (data) {
                        console.log(data);
                        chan.close();
                        conn.close();
                        res.json(data);
                    });
                });
            });
        })

        .get(function (req, res) {
            printDns(req.query.ip, function (err, data) {
                if (err) {
                    res.end(err);
                } else {
                    res.json(data);
                }
            });
        })

router.route('/commands')
        .post(function (req, res) {

            var templateObj = {
                'dynamic-servers': "",
                'servers': "",
                'allow-remote-requests': 'true',
                'max-udp-packet-size': 4096,
                'query-server-timeout': '2s',
                'query-total-timeout': '10s',
                'cache-size': 2048,
                'cache-max-ttl': '1w',
                'cache-used': 10
            };
            var routers = JSON.parse(req.body.selectedRouters);
            var selectedRouters = [];
            //console.log(routers)
            var templateArray = [];

            async.each(routers, function (router, callback1) {
                printDns(router.ip, function (err, data) {
                    if (err) {
                        res.end(""+err);
                    } else {
                        var parsed = api.parseItems(data);
                        var templateObj2 = Object.assign({}, templateObj);  //Object.assign() mbaje mend

                        async.each(parsed, function (item, callback2) {
                            templateObj2.servers = item.servers;
                            templateObj2.ip = router.ip;
                            callback2();

                        }, function (err) {
                            templateArray.push(templateObj2);
                            selectedRouters.push(router);
                            callback1();
                        });
                    }
                });

            }, function (err) {
                console.log(templateArray);
                res.render('dns', {templateObjs: templateArray, routers: selectedRouters});
            });
        })




module.exports = app;




function connect(ip, cb) {
    //console.log(ip)
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
                console.error('Error: ', err);
                cb(err);
            });
        }
    });
}

function printDns(ip, cb) {
    connect(ip, function (err, conn) {
        if (err) {
            cb(err);
        } else {
            var chan = conn.openChannel();
            chan.write('/ip/dns/print', function () {
                chan.on('done', function (data) {
                    //console.log(data)
                    cb(null, data);
                    chan.close();
                    conn.close();
                });
                chan.once('trap', function (trap, chan) {
                    cb(new Error('komanda nuk u ekzekutua sakte ne ip: ' + ip));
                    console.log('Command failed: ' + trap);
                });
                chan.once('error', function (err, chan) {
                    cb(err);
                    console.log('Oops: ' + err);
                });
            });
        }
    });
}