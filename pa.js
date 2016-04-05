var login = require('./login');

var user ={
	account:'565665876@qq.com',
	password:'tz1414213563'
};
var sUrl = 'http://www.zimuzu.tv/User/Login/ajaxLogin';

login(user,sUrl).then((data)=>{
	var cookies = data.headers['set-cookie'];
	var sCookie = '';
	for(var i=0;i<cookies.length;i++){
		sCookie += cookies[i].substr(0,cookies[i].indexOf(';'))+'; ';
	}
	console.log(sCookie);
});