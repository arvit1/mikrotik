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
    var templateArray = [];
    var routers = [{
            "ip": "192.2.2.9",
            "name": "test",
            "username": "arviti",
            "password": "1234"
        }, {
            "password": "1234",
            "username": "arviti",
            "ip": "10.10.3.3",
            "name": "wifi"
        }];

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
                        
                        async.forEach(parsed, function (item, callback2) {
                            templateArray.push(item);
                            callback2();
                        }, function (err) {
                            chan.close();
                            conn.close();
                            callback1();
                        });
                    });
                });
            }
        });
    }, function (err) {
        console.log(templateArray);
        res.render('ip', {templateObjs: templateArray, routers: routers2});
    });
});


router.post('/', function (req, res, next) {
    console.log(req.body);
    var routers2 = JSON.parse(req.body.selectedRouters);
    routers2.forEach(function (router) {
        mikronode.connect(router.ip, function (err, conn) {
            if (err) {
                res.end("" + err);
            } else {
                var chan = conn.openChannel();

                var arrCmd = ['/ip/address/add'];
                if (req.body.address && req.body.netmask) {
                    arrCmd.push('=address=' + req.body.address + "/" + req.body.netmask);
                }
                if (req.body.interface) {
                    arrCmd.push('=interface=' + req.body.interface);
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

router.put(function (req, res) {
    setIpAddress(req.body.ip, req.body.address, req.body.newAddress, req.body.netmask, req.body.newNetmask, function (err, data) {
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

router.delete(function (req, res) {
    removeIpAddress(req.body.ip, req.body.address, req.body.netmask, function (err, data) {
        if (err) {
            res.end("" + err);
        } else {
            res.json(data);
        }
    });
});

function setIpAddress(ip, address, newAddress, netmask, newNetmask, cb) {
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
                        if (item.address === address + "/" + netmask) {
                            kot.push(item);
                            console.log(item['.id']);
                            var arrCmd = ['/ip/address/set'];
                            arrCmd.push('=address=' + newAddress + "/" + newNetmask);
                            arrCmd.push('=.id="' + item['.id'] + '"');
                            console.log(arrCmd)
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

function removeIpAddress(ip, address, netmask, cb) {
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
                        if (item.address === address + "/" + netmask) {
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
    