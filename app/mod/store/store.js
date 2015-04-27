angular.module('storeMod',[{
	name: 'cartMod',
	files: ['mod/store/cart.js']
}])
.controller("StoreCtrl", function($scope,$state,list) {

    $scope.models = {
        selected: null,
        lists: list.items
    };

    // Generate initial model
    for (var i = 1; i <= 5; ++i) {
        $scope.models.lists.Apple.push({label: "Item A" + i});
        $scope.models.lists.Banana.push({label: "Item B" + i});
    }

    // Model to JSON for demo purpose
    $scope.$watch('models', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

});