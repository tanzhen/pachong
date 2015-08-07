var request = require('request');
var cheerio = require('cheerio');

function getHTML (options,ore) {
	request({
		uri:'http://www.zimuzu.tv/resource/list/'+options.linkid,
		headers:{
			'Cookie':'last_item:11003=%E7%8A%AF%E7%BD%AA%E5%BF%83%E7%90%86.Criminal.Minds.S10E08.%E4%B8%AD%E8%8B%B1%E5%AD%97%E5%B9%95.WEB-HR.AC3.1024X576.x264.mkv; last_item_date:11003=1437661509; PHPSESSID=dno9ulnfpnike8oo7od959u904; mykeywords=a%3A3%3A%7Bi%3A0%3Bs%3A15%3A%22%E6%9D%83%E5%8A%9B%E7%9A%84%E6%B8%B8%E6%88%8F%22%3Bi%3A1%3Bs%3A6%3A%22%E7%A1%85%E8%B0%B7%22%3Bi%3A2%3Bs%3A12%3A%22%E7%8A%AF%E7%BD%AA%E5%BF%83%E7%90%86%22%3B%7D; ctrip=ctrip%2F1438954148; GINFO=uid%3D3644573%26nickname%3Dminika%26group_id%3D0%26avatar_t%3D%26main_group_id%3D0%26common_group_id%3D53; GKEY=c0a2bd67586e77f0ef78e69535698d37; cps=yhd%2F1438953976%3Bsfbest%2F1438953985%3Bnuomi%2F1438953991%3Bdp%2F1438954204; CNZZDATA1254180690=593096919-1437655573-%7C1438950005'
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
		console.log('抓取成功！');
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

module.exports = getHTML;