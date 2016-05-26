var RouterModel = require('../models/router').Router;

var RouterController = function () { }

RouterController.getRouters = function (cb) {
    RouterModel.find(function (err, routers) {
        if (err) {
            cb(err);
        } else {
            cb(null, routers);
        }
    });
};

RouterController.getRouterByIp = function (ip, cb) {    
    RouterModel.find({ip: ip}, function (err, router) {
        //console.log("routerrrrrrrrrrr " + router)
        if (err) {
            cb(err);
        } else if (router[0]) {
            cb(null, router);
        }else{
            cb(new Error('ip nuk ndodhet ne databaze'));
        }
    });
};

RouterController.getRouterById = function (req, res) {
    RouterModel.findById(req.params.id, function (err, router) {
        if (err) {
            res.json({error: err});
        } else {
            res.json(router);
        }
    });
};

RouterController.removeById = function (req, res) {
    RouterModel.remove({_id: req.params.id}, function (err, router) {
        if (err)
            res.json({error: err});
        else
            res.json(router);
    });
};

RouterController.createRouter = function (req, res) {
    var router = new RouterModel();      // create a new instance of the Router model
    router.name = req.body.name;  // set the routers name (comes from the request)
    router.ip = req.body.ip;
    router.username = req.body.username;
    router.password = req.body.password;
    // save the routers and check for errors
    router.save(function (err) {
        if (err)
            res.json({error: err});
        else
            res.json(router);
    });
};

RouterController.updateByIp = function (ip, newIp, username, password, name, cb) {
    var that = this;
    that.getRouterByIp(ip, function (err, router) {
        //console.log(router)
        if (err) {
            cb(err);
        } else {
            //console.log(router);
            if (username)
                router[0].username = username;
            if (password)
                router[0].password = password;
            if (name)
                router[0].name = name;
            if (ip)
                router[0].ip = newIp;

            router[0].save(function (err) {
                if (err)
                    cb(err);
                else
                    cb(null, {message: 'Router updated!'});
            });
        }
    });
};

module.exports = RouterController;