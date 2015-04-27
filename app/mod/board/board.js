angular.module('boardMod',[])
.filter('pColor', function(){
    return function(pi){
        switch(pi){
            case 'low':
                return 'green';
                break;
            case 'medium':
                return 'yellow';
                break;
            case 'high':
                return 'red';
                break;
            default: 
                return 'grey';
                break;
        }
    }
})
.factory('socketf', ['$rootScope', function($rootScope){
    return {
        on: function(event,callback){
            socket.on(event,function(data){
                $rootScope.$apply(function(){
                    callback(data);
                })
            })
        },
        emit: function(event,data){
            socket.emit(event,data);
        }
    };
}])
.controller('boardCtrl',function($rootScope,$scope,$http,$state,socketf){
    var socket = io.connect($rootScope.scoket_url,{query:{token:$rootScope.token}});
    var pid = $state.params.pid;
    function uid (){
        date = new Date().getTime().toString();
        datemd5 = CryptoJS.MD5(date).toString();
        var uid = btoa(datemd5.substr(datemd5.length - 6));
        return uid;
    }
    console.log(uid());
    socket.emit('project:pid',pid);
    socket.on('project:'+pid,function(rs){
        if(rs.length){
        $scope.$apply(function(){
            $scope.lists = JSON.parse(rs[0].map);
        })   
        }else{
            $state.go('404');
        }
    });

    socket.emit('task:list',{pid:pid,st:'todo',user:$rootScope.user});
    socket.on('task:',function(rs){
        $scope.$apply(function(){
        var wish=[],todo=[],doing=[],test=[],done=[];
            rs.forEach(function(val,key){
                switch(val.type){
                    case 'todo':todo.push(rs[key]);break;
                    case 'doing':doing.push(rs[key]);break;
                    case 'test':test.push(rs[key]);break;
                    case 'done':done.push(rs[key]);break;
                    case 'wish':wish.push(rs[key]);break;
                    default:wish.push(rs[key]);break;
                }
            })
            if($scope.lists){
                $scope.lists.todo.data = todo;
                $scope.lists.doing.data = doing;
                $scope.lists.test.data = test;
                $scope.lists.done.data = done;
                $scope.lists.wish.data = wish;
            }
        })
    })
    $scope.update = function(index,tb){
        tb.splice(index, 1);
        console.log(tb.length);

        // socket.emit('task:u',{});
        // if(tb == 'todo'){
        //     console.log($scope.todo);   
        // }
    }
    $scope.removeCard = function(event, index, item){
        socket.emit('task:remove',item);
    }
    $scope.submitCard = function(text){
    	if(text){
	    	$scope.lists.wish.data.push({name:text});
            socket.emit('task:add',{tid:uid(),project:pid,name:text,user:$rootScope.user})
	    	$scope.textarea = '';
    	}
    }
})
.controller('projectCtrl', function($rootScope,$scope){
    var socket = io.connect($rootScope.scoket_url,{query:{token:$rootScope.token}});
    
    socket.emit('project:user',$rootScope.user);
    socket.on('project:'+$rootScope.user,function(rs){
        $scope.$apply(function(){
            $scope.pList = rs;
        })
    })
})