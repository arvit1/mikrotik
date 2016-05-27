var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {

    var templateObj = [{
            '.id': "*4",
            'address': '1.1.1.1/24',
            'network': "1.1.1.0",
            'interface': 'ether1',
            'actual-interface': 'ether1',
            'invalid': false,
            'dynamic': false,
            'disabled': false
        }, {
            '.id': "*5",
            'address': '2.2.1.1/24',
            'network': "2.2.1.0",
            'interface': 'ether2',
            'actual-interface': 'ether2',
            'invalid': false,
            'dynamic': false,
            'disabled': false
        }];

    var routers = [{
            "ip": "192.2.2.9",
            "name": "test",
            "username": "arviti",
            "password": "1234"
        }, {
            "password": "1234",
            "username": "arviti",
            "ip": "10.10.3.3",
            "name": "wifi",
        }]
    res.render('ip', {templateObjs: templateObj, routers: routers});
});

module.exports = router;