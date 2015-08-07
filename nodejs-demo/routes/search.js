var express = require('express');
var router = express.Router();

var http = require('http');
var cheerio = require('cheerio');
var querystring = require('querystring');

var url ='http://www.zimuzu.tv/search/index?';
var keyword;
var searchInfo;
/* GET users listing. */
router.get('/', function(req, res, next) {
  	keyword = req.query.name;
  	var oRes = res;
  	searchInfo = querystring.stringify({
		'keyword':keyword
	});

  	http.get(url+searchInfo,function(res){
		var html = '';
		res.on('data',function(data){
			html+=data;
		});
		res.on('end',function(){
			oRes.writeHead(200,{'Content-Type': 'text/plain;charset=UTF-8'});
			oRes.end(html);
			console.log('数据抓取成功！');
		});
	}).on('error',function(){
		console.log('获取数据出错！');
	});
});



function fiterChapters(html){
	var $ = cheerio.load(html);
	var chapters = $('.learnchapter');
	var courseData = [];
	chapters.each(function(item){
		var chapter = $(this);
		var chapterTitle = chapter.find('strong').text();
		var videos = chapter.find('.video').children('li');
		console.log(videos);
	});
}


module.exports = router;
