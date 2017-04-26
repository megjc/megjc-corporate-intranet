(function(){
	angular
		.module('intranet.auth',[])
		.config(config);

	function config($routeProvider){
		$routeProvider.when('/login',{
			controller: 'Login',
			controllerAs: 'vm',
			templateUrl: 'public/app/templates/login/login.html',
			access: {restricted: false}
		});
	}
})();
