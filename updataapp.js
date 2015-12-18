var http = require('http');
var cheerio = require('cheerio');
var querystring = require('querystring');
var url = require('url');

var index = 1;
var versionCode = 221;
var maxVersionCode = 278;

var appcanInfo = {
	version:168,
	host:'http://dashboard.appcan.cn/',
	appId:'177598',
	url:{
		listPage:'app/detail?type=1&id=',
		delUrl:'appversion/ajaxdel?id=',
		packageUrl:'pack/package',
		taskUrl:'/pack/query?app_id=177598&task_key='
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
		'wg_ios_id':'230',
		'android_engine_radio':'-1',
		'wg_android_id':'230',
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
		'version_number_3':'0291',
		'version_des':versionCode,
	},
	userCookie:'appcan_uuid=5b6e95c5-90b9-678a-fbb7-de930fe71a09; no_ts=1; PHPSESSID=ST-60355-gFEck9fHcn9dan2RySRT-newssoappcancn; Hm_lvt_d1cb55eae9757438f24e73fdcedc27c5=1450415515; Hm_lpvt_d1cb55eae9757438f24e73fdcedc27c5=1450434554; Hm_lvt_d2f8cf438a1c60b4c14e6983620b37ae=1450415515; Hm_lpvt_d2f8cf438a1c60b4c14e6983620b37ae=1450434554; Hm_lvt_e4d658be0097faa61e8ec41cf5405f2d=1450415515; Hm_lpvt_e4d658be0097faa61e8ec41cf5405f2d=1450434554; CNZZDATA3774146=cnzz_eid%3D1450023404-1450411005-http%253A%252F%252Fwww.appcan.cn%252F%26ntime%3D1450432618'
};
function appcanGet (url,callfn) {
	http.get(url,function(res){
		var html = '';
		res.on('data',function(data){
			html+=data;
		});
		res.on('end',function(){
			callfn(res,html);
		});
	});
}
// 入口
function updataApp () {
	if(versionCode>maxVersionCode){
		console.log('打包完毕');
		return;
	}
	console.log('开始第'+index+'次打包,versionCode'+versionCode);
	var urlObj = url.parse(appcanInfo.host+appcanInfo.url.packageUrl, true, true);
	console.log('发送请求！');
	var requestApp = http.request({
		host:urlObj.host,
		method:'POST',
		path:urlObj.path,
		headers:{
			'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
			'Content-Length':querystring.stringify(appcanInfo.appPost).length,
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
			var data = JSON.parse(html);
			// console.log(data);
			if(data.status="succ"){
				if(data.msg=='用户空间已满'){
					console.log('用户空间已满,删除上一个app');
					delApp();
				}else if(data.task_info.taskId){
					console.log('请求成功！监听打包进度');
					taskApp(data.task_info.taskId);
				}
			}else{
				console.log('请求失败,开始重试');
				updataApp();
			}
		});
	});
	requestApp.write(querystring.stringify(appcanInfo.appPost));
	requestApp.end();
}
// 监听打包状态
function taskApp (key) {
	var u = 0;
	var urlObj = url.parse(appcanInfo.host+appcanInfo.url.taskUrl+key, true, true);
	var inter = setInterval(function(){
	var requestApp = http.request({
		host:urlObj.host,
		method:'GET',
		path:urlObj.path,
		headers:{
			'Cookie':appcanInfo.userCookie,
			'Host':urlObj.host,
			'Origin':'http://dashboard.appcan.cn',
			'User-Agent':'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.10 Safari/537.36',
			'X-Requested-With':'XMLHttpRequest'
		}
	},function(res){
		var html = '';
		res.on('data',function(data){
			html+=data;
		});
		res.on('end',function(){
			var data = JSON.parse(html);
			if(data.ptTaskInfoList[0].pkgStatus=="Waiting"){
				if(data.ptTaskInfoList[0].taskBefore!=u){
					console.log('排队中，前面还有'+data.ptTaskInfoList[0].taskBefore+"个人");
					u = data.ptTaskInfoList[0].taskBefore;
				}
			}else if(data.ptTaskInfoList[0].pkgStatus=="PkgDone"){
				console.log('打包成功，开始下一次打包');
				index++;
				versionCode++;
				appcanInfo.appPost.version_des = versionCode;
				clearInterval(inter);
				updataApp();
			}
		});
	});
	requestApp.end();
	},2000);
}
// 获取要删除appID
function delApp () {
	console.log('获取需要删除的appid');
	var urlObj = url.parse(appcanInfo.host+appcanInfo.url.listPage+appcanInfo.appId, true, true);
	var requestApp = http.request({
		host:urlObj.host,
		method:'GET',
		path:urlObj.path,
		headers:{
			'Cookie':appcanInfo.userCookie,
			'Host':urlObj.host,
			'User-Agent':'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.10 Safari/537.36',
			'X-Requested-With':'XMLHttpRequest'
		}
	},function(res){
		var html = '';
		res.on('data',function(data){
			html+=data;
		});
		res.on('end',function(){
			var $ = cheerio.load(html);
			var sID = $('#android_page_1_1').find('table').eq(0).prev().attr('id').substring(12);
			console.log('id'+sID+'获取成功 执行删除程序');
			reqDelApp(sID);
		});
	});
	requestApp.end();
}
// 删除app
function reqDelApp (id) {
	var urlObj = url.parse(appcanInfo.host+appcanInfo.url.delUrl+id, true, true);
	var requestApp = http.request({
		host:urlObj.host,
		method:'GET',
		path:urlObj.path,
		headers:{
			'Cookie':appcanInfo.userCookie,
			'Host':urlObj.host,
			'User-Agent':'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.10 Safari/537.36',
			'X-Requested-With':'XMLHttpRequest'
		}
	},function(res){
		var html = '';
		res.on('data',function(data){
			html+=data;
		});
		res.on('end',function(){
			if(html == 'succ'){
				console.log("删除成功 再次执行打包");
				updataApp();
			}else{
				console.log("删除失败 重试删除");
				reqDelApp(id);
			}
		});
	});
	requestApp.end();
}

updataApp();