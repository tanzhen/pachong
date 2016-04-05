var http = require('http');
var url = require('url');
var Q = require("q");
var querystring = require('querystring');

function login(us,ur){
		var deferred = Q.defer();
		var oURL = url.parse(ur);
		var strUser = querystring.stringify(us);
		var req = http.request({
			host:oURL.host,
			method:'POST',
			path:oURL.path,
			headers:{
				'X-Requested-With':'XMLHttpRequest',
				'Content-Type':'application/x-www-form-urlencoded',
				'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.18 Safari/537.36',
				'Content-Length':Buffer.byteLength(strUser)
			}
		},(res)=>{
			deferred.resolve(res);
		});
		req.write(strUser);
		req.end();
		return deferred.promise;
}
module.exports = login;