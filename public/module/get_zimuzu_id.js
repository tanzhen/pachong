// var request = require('request');
var cheerio = require('cheerio');
var http = require('http');
var reqUrl = require('url');
var querystring = require('querystring');

function searchName (options,call) {
	// http://www.zimuzu.tv/search?keyword=%E8%A1%80%E6%97%8F&type=resource
	var sName = new Buffer(options.name);
	var url = 'http://www.zimuzu.tv/search?keyword='+options.name+'&type=resource';
	var id = '';
	var urlObj = reqUrl.parse(url);

	var req = http.request({
		host:urlObj.hostname,
		path:urlObj.path
	},function  (res) {
		var html = '';
		console.log('获取剧集搜索页面..');
		res.on('data',function(data){
			html+=data;
		});
		res.on('end',function(){
			console.log('搜索页面获取成功！');
			console.log('获取剧集id..');
			var $ = cheerio.load(html);
			var list = $('.search-result>ul li').eq(0);
				if(list.find('em').text()==='电视剧'){
					id = list.find('.fl-info').find('a').attr('href').substr(10);
				}
			
			console.log(id);
			if(id!==''){
				console.log('获取剧集id成功！');
				console.log('抓取资源..');
				getPageHtml(id,call,options);
			}
		});
	});
	req.on('error',function(e){
		console.log('load id Error: '+e.message);
	});
	req.end();
}

function getPageHtml (id,call,options) {
	var req = http.request({
		host:'www.zimuzu.tv',
		path:'/resource/list/'+id,
		headers:{
			'Cookie':'lctrip=ctrip%2F1457314265; GINFO=uid%3D3644573%26nickname%3Dminika%26group_id%3D0%26avatar_t%3D%26main_group_id%3D0%26common_group_id%3D54; GKEY=c9071e910fa0197e7b72bb6be1cd72e9; mykeywords=a%3A2%3A%7Bi%3A0%3Bs%3A12%3A%22%E8%A1%8C%E5%B0%B8%E8%B5%B0%E8%82%89%22%3Bi%3A1%3Bs%3A9%3A%22%E7%BA%B8%E7%89%8C%E5%B1%8B%22%3B%7D; PHPSESSID=obu8gdv4dpjm6ouhuolq0c97s1; zmz_rich=2; cps=yhd%2F1457599892%3Bsuning%2F1457599900%3Btujia%2F1457421512%3Bwomai%2F1457314292%3Bnuomi%2F1457314306; CNZZDATA1254180690=1256191634-1453363517-%7C1457594756'
		}
	},function(res){
		var html = '';
		res.on('data',function(data){
			html+=data;
		});
		res.on('end',function(){
			var sText = fiterChapters(html,options);
			call.json(sText);
			console.log('抓取成功！');
		});
	});
	req.end();
}

function returnSourcesJson(html,options) {
	var $ = cheerio.load(html);
	var sArr = [];
	var mediaBox = $('.media-box');
	var mediaList = mediaBox.find('.media-list');
}


function reSeason(arr) {
	var res = [];
	var json = {};
	for(var i = 0; i < arr.length; i++){
		if(!json[arr[i]]){
			res.push(arr[i]);
			json[arr[i]] = 1;
		}
	}
	return res;
}


function fiterChapters(html,options){
	var $ = cheerio.load(html);
	var sArr = [];
	var mediaBox = $('.media-box');
	var mediaList = mediaBox.find('.media-list');
	mediaList.each(function(index){
		var _mediaList = $(this);
		var arrseason = [];
		//判断格式
		if(_mediaList.find('h2').text()==options.format||options.format=='all'){
			//遍历资源
			_mediaList.find('li').each(function(){
				var _mediaList_ul = $(this);
				var title = querystring.unescape(_mediaList_ul.find('.fl a').text());
				var season = querystring.unescape(_mediaList_ul.attr('season'));
				var arrLink = [];
				var ulj;
				var sLink;
				//判断season
				if(_mediaList_ul.attr('season')==options.season||options.season=='all'){
					//遍历链接
					if(options.season=='all'){
						arrseason.push(_mediaList_ul.attr('season'));
					}
					_mediaList_ul.find('.fr a').each(function(){
						var _fr_a = $(this);
						var sName = _fr_a.text();
						if(!_fr_a.attr('href')&&!_fr_a.attr('mamvboau')){
							return;
						}else{
							if(_fr_a.attr('mamvboau')){
								sLink = querystring.unescape(_fr_a.attr('mamvboau'));
							}else{
								sLink = querystring.unescape(_fr_a.attr('href'));
							}
						}
						var sj = {
							link_name : sName,
							link_url :sLink
						};
						arrLink.push(sj);
					});
					ulj = {
						season:season,
						sources:[],
						title:title,
						links:arrLink,
					};
				sArr.push(ulj);
				}
			});
			if(options.season == 'all'){
				var arrAllSeason = reSeason(arrseason);
				console.log('allSeason:'+arrAllSeason);

			}
		}
	});
	return sArr;
}


module.exports = searchName;