var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('meu/index', { title: '资源搜索' });
});

module.exports = router;
