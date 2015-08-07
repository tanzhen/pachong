var express = require('express');
var router = express.Router();

var request = require('request');
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
  	getHTML(options,res);
});

function getHTML (options,ore) {
	request({
		uri:'http://www.zimuzu.tv/resource/list/'+options.linkid,
		headers:{
			'Cookie':'PHPSESSID=tp2fh4pcard5440rhuuhg1qn33; ctrip=ctrip%2F1438922505; GINFO=uid%3D3644573%26nickname%3Dminika%26group_id%3D0%26avatar_t%3D%26main_group_id%3D0%26common_group_id%3D53; GKEY=a7db6af42949fad799291a8fdcdb9dc9; last_item_date:10733=1438923915; last_item_date:32102=1438924659; mykeywords=a%3A3%3A%7Bi%3A0%3Bs%3A15%3A%22%E7%94%9F%E6%B4%BB%E5%A4%A7%E7%88%86%E7%82%B8%22%3Bi%3A1%3Bs%3A6%3A%22%E8%A1%80%E6%97%8F%22%3Bi%3A2%3Bs%3A15%3A%22%E6%9D%83%E5%8A%9B%E7%9A%84%E6%B8%B8%E6%88%8F%22%3B%7D; cps=yhd%2F1438926997%3Bsfbest%2F1438922507%3Bnuomi%2F1438922572%3Bdp%2F1438922655; CNZZDATA1254180690=203626452-1438912045-%7C1438924969'
		}
	},function  (err,res,body) {
		var html;
		if(err){
			console.log('Error');
		}
		if(!options.linkid){
			ore.json('{"error":"flase"}');
		}else{
			html = fiterChapters(body,options);
			ore.json(html);
		}
	});
}


function fiterChapters(html,options){
	var $ = cheerio.load(html);
	var sArr = [];
	var mediaBox = $('.media-box');
	var mediaList = mediaBox.find('.media-list');
	mediaList.each(function(index){
		var _mediaList = $(this);
		if(_mediaList.find('h2').text()==options.format||options.format=='all'){
			_mediaList.find('li').each(function(){
				var _mediaList_ul = $(this);
				var title = _mediaList_ul.find('.fl a').text();
				var arrLink = [];
				var ulj;
				var sLink;
				if(_mediaList_ul.attr('season')==options.season||options.season=='all'){
					_mediaList_ul.find('.fr a').each(function(){
						var _fr_a = $(this);
						var sName = _fr_a.text();
						if(!_fr_a.attr('href')&&!_fr_a.attr('mamvboau')){
							return;
						}else{
							if(_fr_a.attr('mamvboau')){
								sLink = _fr_a.attr('mamvboau');
							}else{
								sLink = _fr_a.attr('href');
							}
						}
						var sj = {
							link_name : sName,
							link_url :sLink
						};
						arrLink.push(sj);
					});
					ulj = {
						title:title,
						links:arrLink
					};
				sArr.push(ulj);
				}
			});
		}
	});
	return sArr;
}


module.exports = router;
