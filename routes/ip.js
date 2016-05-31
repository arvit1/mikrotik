var express = require('express');
var async = require('async');
var api = require('mikronode');
var router = express.Router();
var mikronode = require('../mikronode');

router.get('/', function (req, res, next) {

    var templateObj = {
        '.id': "*4",
        'address': '1.1.1.1/24',
        'network': "1.1.1.0",
        'interface': 'ether1',
        'actual-interface': 'ether1',
        'invalid': false,
        'dynamic': false,
        'disabled': false
    };

    var addTemplateObj = {
        'ip': '192.2.2.9',
        'address': '1.1.1.1/24',        
        'interface': 'ether1'
    };

    var routers2 = req.query.selectedRouters;
    //console.log(routers2);

    async.forEach(routers2, function (router, callback1) {

        mikronode.connect(router.ip, function (err, conn) {
            if (err) {
                res.end("" + err);
            } else {
                var chan = conn.openChannel();
                chan.write('/ip/address/print', function () {
                    chan.on('done', function (data) {
                        //console.log(data);
                        var parsed = api.parseItems(data);
                        var templateArray = [];
                        async.forEach(parsed, function (item, callback2) {
                            templateArray.push(item);
                            callback2();
                        }, function (err) {
                            router.templateArray = templateArray;
                            chan.close();
                            conn.close();
                            callback1();
                        });
                    });
                });
            }
        });
    }, function (err) {
        //console.log(JSON.stringify(routers2));
        res.render('ip', {routers: routers2, addTemplate: addTemplateObj});
    });
});


router.post('/', function (req, res, next) {

    var routers2 = [];
    routers2.push(req.body);
    console.log(routers2);
    routers2.forEach(function (router) {
        mikronode.connect(router.ip, function (err, conn) {
            if (err) {
                res.end("" + err);
            } else {
                var chan = conn.openChannel();

                var arrCmd = ['/ip/address/add'];
                for (var key in router) {
                    if (key !== "ip") {
                        var value = router[key];
                        arrCmd.push('=' + key + '=' + value);
                    }
                }

                console.log(arrCmd);
                chan.write(arrCmd, function () {
                    chan.on('done', function (data) {
                        console.log(data);
                        res.json(data);
                        chan.close();
                        conn.close();
                    });
                    chan.once('trap', function (trap, chan) {
                        console.log(trap);
                    });
                    chan.once('error', function (err, chan) {
                        console.log(err);
                    });
                });
            }
        });
    });
});

router.put('/', function (req, res) {
    setIpAddress(req.body.rip, req.body.oldAddress, req.body.address, function (err, data) {
        if (err) {
            res.end("" + err);
        } else {
            res.json(data);
//                RouterController.updateByIp(req.body.ip, req.body.address, req.body.username, req.body.password, req.body.name, function (err, data2) {
//                    if (err) {
//                        res.json({error: err.message});
//                    } else {
//                        res.json([data, data2]);
//                    }
//                });
        }
    });
});

router.delete('/', function (req, res) {
    removeIpAddress(req.body.rip, req.body.address, function (err, data) {
        if (err) {
            res.end("" + err);
        } else {
            res.json(data);
        }
    });
});

function setIpAddress(ip, address, newAddress, cb) {
    mikronode.connect(ip, function (err, conn) {
        if (err) {
            cb(err);
        } else {
            var chan = conn.openChannel();
            chan.write('/ip/address/print', function () {
                chan.on('done', function (data) {
                    var parsed = api.parseItems(data);
                    var kot = [];
                    async.each(parsed, function (item, callback) {
                        if (item.address === address) {
                            kot.push(item);
                            console.log(item['.id']);
                            var arrCmd = ['/ip/address/set'];
                            arrCmd.push('=address=' + newAddress);
                            arrCmd.push('=.id="' + item['.id'] + '"');
                            console.log(arrCmd);
                            chan.write(arrCmd, function () {
                                chan.on('done', function (data) {
                                    //cb(null, data);
                                    chan.close();
                                    conn.close();
                                });
                            });
                            chan.once('trap', function (trap, chan) {
                                console.log('Command failed: ' + trap);
                            });
                            chan.once('error', function (err, chan) {
                                console.log('Oops: ' + err);
                            });
                        }
                        callback();
                    }, function (err) {
                        if (kot[0]) {
                            cb(null, kot);
                        } else {
                            cb("ip " + ip + " nuk u gjet");
                        }
                        chan.close();
                        conn.close();
                    });
                });
            });
        }
    });
}

function removeIpAddress(ip, address, cb) {
    mikronode.connect(ip, function (err, conn) {
        if (err) {
            cb(err);
        } else {
            var chan = conn.openChannel();
            chan.write('/ip/address/print', function () {
                chan.on('done', function (data) {
                    var parsed = api.parseItems(data);
                    var kot = [];
                    async.each(parsed, function (item, callback) {
                        if (item.address === address) {
                            kot.push(item);
                            var arrCmd = ['/ip/address/remove'];
                            arrCmd.push('=.id="' + item['.id'] + '"');
                            chan.write(arrCmd, function () {
                                chan.on('done', function (data) {
                                    console.log(data);
                                    //cb(null, data);
                                    chan.close();
                                    conn.close();
                                });
                            });
                            chan.once('trap', function (trap, chan) {
                                console.log('Command failed: ' + trap);
                            });
                            chan.once('error', function (err, chan) {
                                console.log('Oops: ' + err);
                            });
                        }
                        callback();
                    }, function (err) {
                        if (kot[0]) {
                            cb(null, kot);
                        } else {
                            cb("ip " + address + " nuk u gjet");
                        }
                        chan.close();
                        conn.close();
                    });
                });
            });
        }
    });
}

module.exports = router;
    