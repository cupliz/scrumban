exports.get = function(req,res){
conn(function(con){
    var tb = req.params.uri1;
    con.query('SHOW KEYS FROM '+tb+' WHERE Key_name = "PRIMARY"',function(erPK,pk){
        if(erPK){
            status.http(res,404);
        }else if(pk){
            var where   = '',
                filter  = '',
                field   = '*',
                limit   = 100,
                offset  = 0,
                sort    = 'asc';
            if(req.query.field){
                field = req.query.field;
                delete req.query.field;
            }

            if(req.query.limit){limit = req.query.limit;}
            delete req.query.limit;
            
            if(req.query.order){
                order = req.query.order;
                filter += ' ORDER BY '+order;
                if(req.query.sort){
                    sort = req.query.sort;
                    filter += ' '+sort;
                }
            }
            delete req.query.sort;
            delete req.query.order;

            if(req.query.offset){offset = req.query.offset;}
            delete req.query.offset;

            qk = Object.keys(req.query);
            if(qk.length){
                wh = [];
                qk.forEach(function(k){
                    wh.push(k+' LIKE "%"+req.query[k]+'%'');
                });
                where = ' WHERE '+wh.join('&& ');
            }

            if(req.params.uri2){
                where = ' WHERE '+pk[0].Column_name+' = "'+req.params.uri2+'"';
            }
            filter += ' LIMIT '+offset+','+limit;
            var sqlQuery = util.format('SELECT %s FROM %s',field,tb,where,filter);
            con.query(sqlQuery,function(erQ, rows) {
                if(!erQ){
                    hide(rows);
                    if(Object.keys(rows[0]).length){
                        res.send(JSON.stringify(rows, 'null', '\t'));   
                    }else{
                        status.http(res,404);
                    }
                }else{
                    status.http(res,404);
                }
                con.release();
            });
            if(req.query.live){
                
            }
        }
    });
});
}

exports.post = function(con,req,res,acc){
conn(function(con){
    var tb = req.params.uri1;
    var id = req.params.uri2;
    con.query('SHOW KEYS FROM '+tb+' WHERE Key_name = "PRIMARY"',function(er,pk){
        if(er){
            status.http(res,404);
        }else if(pk.length){
            if(id){
                var query = con.query('UPDATE '+tb+' SET ? WHERE '+pk[0].Column_name+'='+id,req.body,function(er2,rs2){
                    if(er2){res.send(er2)
                    }else if(rs2){
                        res.send(rs2);
                    }else{status.http(res,400)}
                });
                console.log(query.sql);
            }else{
                var query = con.query('INSERT INTO '+tb+' SET ?',req.body,function(er2,rs2){
                    if(er2){res.send(er2)
                    }else if(rs2.affectedRows){
                        res.send(rs2);
                    }else{status.http(res,400)}
                });
                console.log(query.sql);
            }
        }
    });
});
}

var hide = function(rows){
    var att = ['pass','access','token'];
    if(rows!=undefined){
    rows.forEach(function(el){
        att.forEach(function(el2){
            delete el[el2];
        })
    });   
    }
}