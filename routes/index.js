var express = require('express');
var router = express.Router();
var RouterController = require("../controllers/RouterController");


/* GET home page. */
router.get('/', function (req, res, next) {

    RouterController.getRouters(function (err, routers) {
        if (err) {
            res.json({error: err});
        } else {
            res.render('index', {routers: routers, title: "esspresso"});
        }        
    });
});

module.exports = router;
