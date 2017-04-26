(function(){
	angular
	.module('intranet.auth')
	.controller('Login', Login);

	Login.$inject = ['$location', '$scope', 'loginService'];

	function Login($location, $scope, loginService){
		var vm = this;
		vm.handleForm = handleForm;
		vm.message = false;
		vm.user = {
			name : '',
			password : ''
		}

		activate()
		/**
		 * Handles login form to authenticate user.
		 * @param  {[type]} user User email and password.
		 */
		function handleForm(credentials){
			if( loginService.checkCredentials( credentials ) ){
				loginService
						.authUser(credentials)
						.then(function(response){
							if(response.success){
								loginService
										.getDepartment(response.dn)
										.then(function (department) {
												loginService
														.getUser(response.dn, department.id)
														.then(function(user){
															if(user.success){
																vm.user = {};
																loginService.setUser(user.user);
																$location.path('/dashboard/apps');
															}
														}).catch(function(error){
															console.log('Error in getting user')
														})
										}).catch(function(error){
											console.log('Error in getting department');
										});
							}else{
								vm.message = true;
								vm.user.password = '';
							}
						}).catch(function (error){
								console.log(error);
						});
			}else{
				vm.message = true;
				vm.user.password = '';
			}
		}
		/**
		 * Get mails by department id if user is authenticated.
		 * @return {[type]} [description]
		 */
		function activate() {
			if(loginService.isAuthenticated()){
				$location.path('/dashboard/apps')
			}
		}
	}
})();
