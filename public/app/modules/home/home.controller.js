(function(){
	'use strict';
	angular
	.module('intranet.home')
	.controller('Home', Home);

	Home.$inject = ['$http', '$location', '$window', '$routeParams', 'homeService', 'sharedServices'];
	/**
	 * Home Controller
	 * @param {[type]} $scope    [description]
	 * @param {[type]} $http     [description]
	 * @param {[type]} $location [description]
	 * @param {[type]} $window
	 * @param {[type]} sharedServices
	 */
	function Home($http, $location, $window, $routeParams, homeService, sharedServices){
		var vm = this
		vm.goTo = goTo
		vm.getBlogs = getBlogs
		vm.getStaffFocus = getStaffFocus

		function goTo(path){
			$location.path('#!/' + path)
		}
	}
})();
