angular.module('boardMod',[])
.filter('labelColor', function(){
    return function(label){
        if(label){
            return JSON.parse(label).color;
        }else{
            return 'grey'
        }
    }
})
.controller('BoardCtrl',function($rootScope,$window,$scope,$state){

    if($window.localStorage.auth){
        auth = JSON.parse($window.localStorage.auth);
    }
    var socket = io.connect('/',{query:{token: auth.token}});
    var pid = $state.params.pid;

    function uid (){
        date = new Date().getTime().toString();
        datemd5 = CryptoJS.MD5(date).toString();
        var uid = btoa(datemd5.substr(datemd5.length - 6));
        return uid;
    }
    // console.log(uid());
    $rootScope.socket.emit('project:pid',pid);
    $rootScope.socket.on('project:'+pid,function(rs){
        if(rs.length){
        $scope.$apply(function(){
            $scope.lists = JSON.parse(rs[0].map);
        })   
        }else{
            $state.go('404');
        }
    });

    $rootScope.socket.emit('task:list',{pid:pid,st:'todo',user:auth.login.user});
    $rootScope.socket.on('task:',function(rs){
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
    this.dropCallback = function(event, index, item) {
        var type = event.target.attributes['name'].value;
        if(!(item.sort==index && item.type==type)){
            $rootScope.socket.emit('task:update',{item:item,index:index,type:type});
        }
        return item;
    };

    this.removeCard = function(event, index, item){
        $rootScope.socket.emit('task:remove',item);
    }
    this.submitCard = function(text){
    	if(text){
	    	$scope.lists.wish.data.push({name:text});
            $rootScope.socket.emit('task:add',{tid:uid(),project:pid,name:text,user:auth.login.user})
	    	$scope.textarea = '';
    	}
    }
})
.controller('ProjectCtrl', function($rootScope,$scope,$window){
        auth = JSON.parse($window.localStorage.auth);
        $rootScope.socket.emit('project:user',auth.login.user);
        $rootScope.socket.on('project:'+auth.login.user,function(rs){
            $scope.$apply(function(){
                $scope.pList = rs;
            })
        })
})