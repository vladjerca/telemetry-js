var express = require('express');
var router = express.Router();

router.use(function (req, res) {
    res.status(400);
    return res.send('You seem to be lost... AND ALONE!');
});

router.use(function (error, req, res, next) {
    res.status(500);
    return res.json({ title: '500: Internal Server Error', error: error });
});

module.exports = router;