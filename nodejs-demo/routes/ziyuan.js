var express = require('express');
var router = express.Router();

var request = require('request');
var ziyuan = require('../public/js/get_zimuzu_id');
var cheerio = require('cheerio');

// var url ='http://www.zimuzu.tv/resource/list/';

var searchInfo;
/* GET users listing. */
router.get('/', function(req, res, next) {

	var sSeason = req.query.season||'all';
	var sFormat = req.query.geshi||'all';

	var options = {
		'linkid':req.query.id,
		'format':sFormat,
		'season':sSeason
	};
	// console.log(ziyuan);
  	ziyuan(options,res);
});

module.exports = router;
