(function(){
	angular
	.module('intranet.directory',[])
	.config(config);

	function config($routeProvider){
		$routeProvider
		.when('/directory',{
			controller: 'Directory',
			controllerAs: 'vm',
			templateUrl: 'public/app/templates/directory/directory.html'
		});
	}
})();
