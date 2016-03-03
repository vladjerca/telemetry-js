var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', function (req, res) {
    fs.readFile('./views/index.html', function (err, data) { 
        if (err)
            return res.send(err);

        return res.send(data);
    });
});

module.exports = router;