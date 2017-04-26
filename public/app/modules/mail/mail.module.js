(function(){
	angular
	.module('intranet.apps.mail',['ngFileUpload', 'ngMessages'])
	.config(config);

	function config($routeProvider){
		$routeProvider
		.when('/dashboard/apps/mails/incoming',{
			templateUrl: "public/app/modules/mail/tpl/mail.incoming.html",
			controller: 'Incoming',
			resolve: {
				mails: function (mailService) {
					return mailService.getMailsByDepartmentId();
				}
			},
			access: {restricted: true}
		}).when('/dashboard/apps/mails/create', {
			templateUrl: "public/app/modules/mail/tpl/create.html",
			controller: 'Mail',
			access: {restricted: true}
		}).when('/dashboard/apps/mails/:id/view', {
			templateUrl: "public/app/modules/mail/tpl/mail.view.html",
			controller: 'View as vm',
			access: {restricted: true}
		}).when('/dashboard/apps/mails/follow_ups', {
			templateUrl: "public/app/modules/mail/tpl/mail.followup.html",
			controller: 'Mail',
			access: {restricted: true}
		}).when('/dashboard/apps/mails/search', {
			templateUrl: "public/app/modules/mail/tpl/mail.search.html",
			controller: 'Search',
			controllerAs: 'vm',
			access: {restricted: true}
		});
	}
})();
