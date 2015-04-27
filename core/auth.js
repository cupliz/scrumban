var crypto = require('crypto'),
    tb_data='user,fullname,access,email',
    data = {};

var basic_auth = function(con,basic,callback){
if(basic[0] && basic[1]){
    n=new Date().getTime();
    u = basic[0];
    p = crypto.createHash('md5').update(basic[1]).digest('hex');
    con.query("SELECT "+tb_data+" FROM user WHERE user=? && pass=?",[u,p],function(er,rs){
        if(rs.length){
            // if(rs[0].access==7){t = 14400; //4jam
            // }else if(rs[0].access==5){t = 10800; //3jam
            // }else if(rs[0].access==3){t = 7200; //2jam
            // }else if(rs[0].access==1){ t = 3600; //1jam
            // }else{t = 1800; //30menit
            // }
            t=10800;
            c = t/10;
            con.query("SELECT expire,token,c_rate,c_limit FROM user_log WHERE user=? && logid<? && expire>? && c_rate>0",[u,n,n],function(er1,rs1){
                if(rs1.length){
                    con.query("UPDATE user_log SET c_rate=? WHERE user=? && logid<? && expire>?",[rs1[0].c_rate-1,u,n,n],function(){});
                    data.token = rs1[0].token;
                    data.login = rs[0];
                    data.rate = {limit:rs1[0].c_limit,remaining:rs1[0].c_rate-1,reset:rs1[0].expire}
                }else{
                    e = new Date(n+(t*1000)).getTime();
                    var token = crypto.createHash('md5').update(JSON.stringify(n)).digest('hex');
                    con.query("INSERT INTO user_log VALUES(?,?,?,?,?,?,?)",[n,e,u,token,'127.0.0.1',c,c],function(){});                
                    data.token = token
                    data.login = rs[0];
                    data.rate = {limit:c,remaining:c,reset:e}
                }
                callback(er1,data);
            });
        }else{
            callback('wrong username / password');
        }
    });
}else{
    callback('empty username / password');
}
}

var token_auth = function(con,token,callback){
    n=new Date().getTime();
    con.query("SELECT expire,user,token,c_rate,c_limit FROM user_log WHERE token=? && logid<? && expire>? && c_rate>0",[token,n,n],function(er1,rs1){
        if(rs1.length){
            query = con.query("SELECT "+tb_data+" FROM user WHERE user=?",[rs1[0].user],function(er2,rs2){
                if(rs2.length){
                    data.token = token;
                    data.login = rs2[0];
                    data.rate = {limit:rs1[0].c_limit,remaining:rs1[0].c_rate,reset:rs1[0].expire}
                    callback(er2,data);
                }
            });
        }else{
            callback('token invalid / expired');
        }
    });
}
var set_header = function(res,rate){
    res.header('X-Rate-Limit-Limit',rate.limit);
    res.header('X-Rate-Limit-Remaining',rate.remaining);
    res.header('X-Rate-Limit-Reset',rate.reset);
}

exports.logout = function(con,token,callback){
    n=new Date().getTime();
    error='',success='';
    query = con.query("SELECT token FROM user_log where token=?",[token],function(er,rs){
        if(rs.length){
            console.log(rs);
            con.query("UPDATE user_log SET expire=? WHERE token=?",[n,token],function(er){
                if(!er){
                    callback('token '+token+' revoked');
                }
            })
        }else{
            callback('token revoke failed');
        }

    })
}
exports.init = function(con,req,res,callback){
    if(req.headers['authorization']) {
        basic = new Buffer(req.headers['authorization'].substring(6), 'base64').toString().split(':');
        basic_auth(con,basic,function(er,data){
            if(!er){
                set_header(res,data['rate']);
                res.send(data);
            }else{
                res.statusCode = 401;
                res.send(er);
            }
        })
    }else if(req.headers['x-auth-token']){
        token_auth(con,req.headers['x-auth-token'],function(er,data){
            if(!er){
                set_header(res,data.rate);
                res.send(data);
            }else{
                res.statusCode = 401;
                res.send(er)
            }
        })
    }else{
        res.statusCode = 401;
        res.send('<h1>Unauthorized</h1>')
    }
}

exports.basic = basic_auth;
exports.token = token_auth;
exports.header = set_header;