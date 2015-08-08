var express = require('express');
var router = express.Router();
var querystring = require('querystring');

// 抓取资源页面
var ziyuan = require('../public/module/get_zimuzu_id');

var searchInfo;
/* GET users listing. */
router.get('/', function(req, res, next) {
	var search = req._parsedUrl.search;
	var sSeason = req.query.season||'all';
	var sFormat = req.query.geshi||'all';
	var utfsearch = querystring.escape(req.query.name);
	var options = {
		'name':utfsearch,
		'format':sFormat,
		'season':sSeason,
		'search':search
	};
  	ziyuan(options,res);
});

module.exports = router;
