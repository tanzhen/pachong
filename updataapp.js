var http = require('http');
var cheerio = require('cheerio');
var querystring = require('querystring');
var url = require('url');


var appcanInfo = {
	host:'http://dashboard.appcan.cn/',
	appId:'177598',
	url:{
		listPage:'app/detail?type=1&id=',
		delUrl:'appversion/ajaxdel?id=675317',
		packageUrl:'pack/package',
		taskUrl:'pack/query?app_id=177598&task_key=ecc743f4-0a4f-43a5-a9e2-18e591853372'

	},
	appPost:{
		'app_id':'177598',
		'pack_icon':'/upload/image/201512/04/2dca7304da5cfa172cfd6c477a6f61.png',
		'pack_iphone_1':'/upload/default/640x960.png',
		'pack_iphone_2':'/upload/default/640x1136.png',
		'pack_iphone_3':'/upload/default/750x1334.png',
		'pack_iphone_4':'/upload/default/1242x2208.png',
		'ipad_type_screen':'2',
		'pack_ipad_1':'/upload/default/1536x2048.png',
		'pack_ipad_1_h':'/upload/default/2048x1536.png',
		'android_type_screen':'2',
		'pack_android_1':'/upload/image/201512/04/3fc0f327bb84720c500e5002153ea6.png',
		'pack_android_2':'/upload/image/201512/04/c23418f1bc6ebf008c649afa040454.png',
		'pack_android_1_h':'/upload/default/1920x1080.png',
		'pack_android_2_h':'/upload/default/1920x1280.png',
		'start_bar':'0',
		'run_bar':'2',
		'android_bar':'1',
		'ios_engine_radio':'-1',
		'wg_ios_id':'217',
		'android_engine_radio':'-1',
		'wg_android_id':'216',
		'channel_ids':'1,000',
		'channel_radio':'1,000',
		'plat[]':'1',
		'android_is_push':'on',
		'android_wiget_update':'on',
		'android_hard_speed':'on',
		'android_cert':'1',
		'android_key_mode':'1',
		'android_package_name':'com.wg.dfs168',
		'ios_is_push':'on',
		'ios_terminal':'iphone',
		'ios_cert':'3',
		'version_number_1':'01',
		'version_number_2':'01',
		'version_number_3':'0280',
		'version_des':'丰收农资购 v1.1',
	},
	userCookie:'appcan_uuid=9d535987-3b56-2979-0399-bc8687a3efab; pgv_pvi=4142314496; __cfduid=d1a8c1064e86c24e41400a4932673dab91449649706; no_ts=1; PHPSESSID=ST-44946-2oZQ4B7VzSafgQHQbi35-newssoappcancn; CNZZDATA3774146=cnzz_eid%3D850235725-1449043499-http%253A%252F%252Fnewsso.appcan.cn%252F%26ntime%3D1450348364; Hm_lvt_d2f8cf438a1c60b4c14e6983620b37ae=1450057547,1450085742,1450231469,1450335782; Hm_lpvt_d2f8cf438a1c60b4c14e6983620b37ae=1450350717; Hm_lvt_e4d658be0097faa61e8ec41cf5405f2d=1450057547,1450085742,1450231469,1450335782; Hm_lpvt_e4d658be0097faa61e8ec41cf5405f2d=1450350717; Hm_lvt_d1cb55eae9757438f24e73fdcedc27c5=1450057547,1450085742,1450231469,1450335782; Hm_lpvt_d1cb55eae9757438f24e73fdcedc27c5=1450350717',
	pageCookie:'appcan_uuid=9d535987-3b56-2979-0399-bc8687a3efab; pgv_pvi=4142314496; __cfduid=d1a8c1064e86c24e41400a4932673dab91449649706; PHPSESSID=ST-41592-nSGbT9HQf7OD3eQ5jmaZ-newssoappcancn; no_ts=1; CNZZDATA3774146=cnzz_eid%3D850235725-1449043499-http%253A%252F%252Fnewsso.appcan.cn%252F%26ntime%3D1450341662; Hm_lvt_d2f8cf438a1c60b4c14e6983620b37ae=1450057547,1450085742,1450231469,1450335782; Hm_lpvt_d2f8cf438a1c60b4c14e6983620b37ae=1450346139; Hm_lvt_d1cb55eae9757438f24e73fdcedc27c5=1450057547,1450085742,1450231469,1450335782; Hm_lpvt_d1cb55eae9757438f24e73fdcedc27c5=1450346139; Hm_lvt_e4d658be0097faa61e8ec41cf5405f2d=1450057547,1450085742,1450231469,1450335782; Hm_lpvt_e4d658be0097faa61e8ec41cf5405f2d=1450346139'
};
// var 'http://dashboard.appcan.cn/pack/query?app_id=177598&task_key=ecc743f4-0a4f-43a5-a9e2-18e591853372';

function updataApp () {
	var urlObj = url.parse(appcanInfo.host+appcanInfo.url.packageUrl, true, true);
	var requestApp = http.request({
		host:urlObj.host,
		method:'POST',
		path:urlObj.path,
		headers:{
			'Content-Length':'1165',
			'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
			'Cookie':appcanInfo.userCookie,
			'Host':urlObj.host,
			'Origin':'http://dashboard.appcan.cn',
			'Referer':'http://dashboard.appcan.cn/pack?app_id='+appcanInfo.appId,
			'User-Agent':'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.10 Safari/537.36',
			'X-Requested-With':'XMLHttpRequest'
		}
	},function(res){
		var html = '';
		res.on('data',function(data){
			html+=data;
		});
		res.on('end',function(){
			console.log(html);
		});
	});
	requestApp.write(querystring.stringify(appcanInfo.appPost));
	requestApp.end();
}
updataApp();