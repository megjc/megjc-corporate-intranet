(function(){
	angular
	.module('intranet.home',[])
	.config(config);

	function config($routeProvider){
		$routeProvider
		.when('/', {
			controllerAs: 'Home as vm',
			templateUrl: 'public/app/templates/home/home.html',
			access: {restricted: false}
		}).when('/vacancies', {
				controllerAs: 'Home as vm',
				templateUrl: 'public/app/templates/home/vacancy.html',
				access: {restricted: false}
		}).when('/vacancies/slug', {
				controllerAs: 'Home as vm',
				templateUrl: 'public/app/templates/home/vacancy-item.html',
				access: {restricted: false}
		}).when('/directory', {
				controllerAs: 'Home as vm',
				templateUrl: 'public/app/templates/home/home.html',
				access: {restricted: false}
		}).when('/forms', {
				controllerAs: 'Home as vm',
				templateUrl: 'public/app/templates/home/form-list.html',
				access: {restricted: false}
		}).when('/policies', {
				controllerAs: 'Home as vm',
				templateUrl: 'public/app/templates/home/policy-list.html',
				access: {restricted: false}
		}).when('/news/:slug', {
				controllerAs: 'Home as vm',
				templateUrl: 'public/app/templates/news/news.html',
				access: {restricted: false}
		})
	}
})();
