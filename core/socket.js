var sockArr = [];
exports.init = function(io,con){

io.sockets.on('connection',function(socket){
	sockArr.push(socket.id);
	console.log(socket.id+' in');
	// Project
	socket.on('project:user',function(user){
		con.query('SELECT p.pid,p.title,p.description,p.map,p.master,p.et,p.ut,p.rt,p.status FROM project AS p,task AS t WHERE p.master=? OR t.user=? AND p.pid=t.project GROUP BY p.pid',[user,user],function(er,rs){
			io.sockets.emit('project:'+user,rs);
		})
	})
	socket.on('project:pid',function(pid){
		con.query('SELECT * FROM project WHERE pid=?',[pid],function(er,rs){
			io.sockets.emit('project:'+pid,rs);
		})
	})


	// Task
	socket.on('task:list',function(req){
		con.query('SELECT * FROM task WHERE project=? ORDER BY sort',[req.pid],function(er,rs){
			io.sockets.emit('task:',rs);
		})
	})
	socket.on('task:update',function(req){
		query = con.query('UPDATE task SET sort=?,type=? WHERE tid=?',[req.index,req.type,req.item.tid],function(er,rs){
			con.query('SELECT * FROM task WHERE project=? ORDER BY sort',[req.item.project],function(er,rs){
				io.sockets.emit('task:',rs);
			})
		})
	})
	socket.on('task:add',function(req){
		con.query('INSERT INTO task SET ?',req,function(er,rs){
			con.query('SELECT * FROM task WHERE project=? ORDER BY sort',[req.project],function(er,rs){
				io.sockets.emit('task:',rs);
			})
		})
	})
	socket.on('task:remove',function(req){
		con.query('DELETE FROM task WHERE tid=?',[req.tid],function(er,rs){
			con.query('SELECT * FROM task WHERE project=? ORDER BY sort',[req.project],function(er,rs){
				io.sockets.emit('task:',rs);
			})
		})
	})

	socket.on('disconnect',function(){
		console.log(socket.id+' out');
		sockArr.splice(sockArr.indexOf(socket.id));
	})
})

}