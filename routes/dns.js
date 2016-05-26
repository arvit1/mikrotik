var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {

    //templateObj = {
    //    'dynamic-servers': "",
    //    'allow-remote-requests': 'true',
    //    'max-udp-packet-size': 4096,
    //    'query-server-timeout': '2s',
    //    'query-total-timeout': '10s',
    //    'cache-size': 2048,
    //    'cache-max-ttl': '1w',
    //    'cache-used': 10
    //}
    //res.render('dns', { templateObj: templateObj, ids: req.body.data });
});

module.exports = router;
