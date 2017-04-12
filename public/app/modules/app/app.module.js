(function(){
	angular
	.module('intranet',[
		'ngRoute',
		'ngCookies',
		'home',
		'dashboard',
		'directory',
		'login',
		'help',
		'shared-services',
		'vacancy',
		'promotion',
		'mail',
		'trans',
		'nav'
	]).run(routeLogin)
		.config(config)
		.constant("API_URLS", {	base_url : '/intranet/api/v1/'})
		.constant('CONSTANTS',{ URL: '/intranet/api/v1/' })

	function config($routeProvider, $httpProvider){
	 $routeProvider.otherwise({redirectTo: '/login'})
	}
	/**
	 * Checks if an application route is protected.
	 * @param  {[type]} $rootScope     [description]
	 * @param  {[type]} $location      [description]
	 * @param  {[type]} sharedServices [description]
	 * @return {[type]}                [description]
	 */
  function routeLogin($rootScope, $location, loginService){
  	$rootScope.$on('$routeChangeStart', function(event, next, current){
			if(next.access != null){
				if(next.access.restricted && !loginService.isAuthenticated()){
					 $location.path('/login');
				}
			}
  	});
  }
})();
