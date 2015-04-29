angular.module('shareMod',[])

.factory('filterService', function() {
    return {
      activeFilters: {},
      searchText: ''
    };
})