var express = require('express'),
	app = express(),
	fs = require('fs'),
    bparser = require('body-parser'),
    multer = require('multer'),

	mysql = require('mysql'),
	con = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'',
		database:'scrumban'
	});

var auth = require('./core/auth.js'),
	st = require('./core/status.js'),
	socket = require('./core/socket.js');
	rest = require('./core/rest.js');
	
var ssl = {key: fs.readFileSync('ssl/key.pem'),cert: fs.readFileSync('ssl/server.crt')};
	https = require('https').Server(ssl, app);
	http = require('http').Server(app);
	io = require('socket.io')(https);

http.listen(8000);
https.listen(443);
app.use('/',express.static(__dirname+'/app'));
io.use(function(socket, next){
	auth.token(con,socket.handshake.query.token,function(er,data){
		if(!er){
			next();
		}else{
			console.log('auth error');
		}
	})
});
socket.init(io,con);
app.disable('x-powered-by');
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Headers','X-Auth-Token,Content-Type,Authorization');
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.get('/auth',function(req,res){
	auth.init(con,req,res);
})
app.delete('/auth/:token',function(req,res){
	auth.logout(con,req.params.token,function(er){res.send(er)})
})
