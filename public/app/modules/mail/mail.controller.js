/**
 * @author Tremaine Buchanan (tremaine.buchanan@megjc.gov.jm)
 */
(function(){
	angular
	.module('mail')
	.controller('Mail', Mail);

	Mail.$inject = ['$routeParams', '$location', '$scope', '$anchorScroll',
									'mailService', 'loginService' , 'API_URLS', 'Upload'];

	function Mail($routeParams, $location, $scope, $anchorScroll,
								mailService, loginService, API_URLS, Upload){
			$scope.message = $scope.success = false
			$scope.error = false
			$scope.text = ''
			$scope.showOther = false
			$scope.file_upload_msg = false
			$scope.revealAction = false
			$scope.showFollowup = false
			var blank = angular.copy($scope.mail)
			$scope.showMail = show
			$scope.goTo = goTo
			$scope.createMail = createMail
			$scope.removeFile = removeFile
			$scope.clearForm = clearForm
			$scope.createMail = createMail
			$scope.toggle = toggle
			$scope.createAction = createAction
			$scope.revealActionForm = revealActionForm
			$scope.cancel = cancel
			$scope.file = []
			$scope.logout = logout
			$scope.update = update
			$scope.toggleFollowup =  toggleFollowup
			activate()
			/**
			 * Clears form.
			 * @return {[type]} [description]
			 */
			function clearForm(){
				$scope.file = []
				$scope.mail = angular.copy(blank)
				$scope.mailForm.$setPristine()
				$scope.mailForm.$setValidity()
    		$scope.mailForm.$setUntouched()
			}
			/**
			 * Handles
			 * @return {[type]} [description]
			 */
			function activate() {
				getMails()
				$scope.mail = mailService.initMail()
				getMailsForFollowup()
			}
			/**
			 * Sets the follow up date for the mail correspondence
			 * @return {[type]} [description]
			 */
			function toggleFollowup () {
				if($scope.mail.follow_up == 2){
					var date = new Date()
					date.setDate(date.getDate() + 7)
					$scope.mail.follow_up_date = date
					$scope.showFollowup = true
				}else{
					$scope.showFollowup = false
				}
			}
			/**
			 * Show details of mail.
			 * @param  {[type]} id Id of a mail correspondence.
			 */
			function show (id){
				mailService
					.getMail(id)
					.then(function(mail){
						$scope.mail_corr = mail.mail
						$scope.actions = mail.actions
						$location.path('/dashboard/apps/mails/' + id + '/view')
					}).catch(function(error){
						$scope.mail_corr = {}
					});
			}
			/**
			 * Get all mails created by a user.
			 * @return {[type]} [description]
			 */
			function getMails (){
				mailService
					.getMailsByDepartmentId()
					.then(function(mails){
						$scope.mails = mails
					}).catch(function(error){
						$scope.mails = []
					})
			}
			/**
			 * Get mails tagged for follow up
			 * @return {[type]} [description]
			 */
			function getMailsForFollowup (){
				var dept_id = loginService.getDepartmentId();
				mailService
					.getMailsForFollowup(dept_id)
					.then(function(mails){
						$scope.follow_ups = mails.mails
					}).catch(function(error){
						$scope.mails = [];
					})
			}

			function goTo (path){
				$location.path('/' + path);
			}
			/**
			 * Creates a mail correspondence.
			 * @param  {[type]} mail [description]
			 * @return {[type]}      [description]
			 */
			function createMail(){
				mailService
					.createMail($scope.mail)
					.then(function(res){
						if(res.status === 500){
							$scope.message = true
							$scope.text = 'An error has occurred on the server'
							$scope.error = true
						}

						if(res.status === 400){
							$scope.message = true
							$scope.text = 'Please review the form for errors'
							$scope.error = true
						}

						if(res.status == 200){
							$scope.text = 'Mail correspondence created successfully'
							$scope.message = true
							$scope.success = true
							clearForm()
							$scope.mail = mailService.initMail()
							$scope.$broadcast('mailCreated')
							scroll('top')
						}
				}).catch(function(err){
					 console.log('Error in creating mail')
				});
			}
			/**
			 * Scrolls to a position on the page
			 * @param  string pos Position to scroll to
			 */
			function scroll( pos ) {
				$location.hash( pos )
				$anchorScroll()
			}
			/**
			 * Dimisses a success or error alert.
			 * @return {[type]} [description]
			 */
			function dismiss( alert_id ){
				switch (alert_id) {
					case 'file_upload_msg': $scope.file_upload_msg = !$scope.file_upload_msg;
						break;
						case 'message': $scope.message = !$scope.message;
							break;
				}
				//$scope.message = false;
			}
			/**
			 * Clears file upload array
			 * @return {[type]} [description]
			 */
			function removeFile(){
				$scope.file = []
			}
			/**
			 * Toggles text field to accept other mail type.
			 * @param  {[type]} mail_type The type of mail correspondence.
			 * @return {[type]}           [description]
			 */
			function toggle(mail_type){
				switch (mail_type) {
						case 'other': $scope.showOther = true;
													$scope.showFile = false;
						break;
						case 'file': $scope.showFile = true;
													$scope.showOther = false;
						break;
						default: $scope.showOther = false;
										 $scope.showFile = false;
					}
			}
			/**
			 * Toggles mail action form
			 * @return {[type]} [description]
			 */
			function revealActionForm() {
				$scope.revealAction = !$scope.revealAction
			}
			/**
			 * Clears and hides mail action form
			 * @return {[type]} [description]
			 */
			function cancel() {
					$scope.revealAction = false
					$scope.description = ''
			}
			/**
			 * Creates an action for a mail correspondence
			 * @param  {[type]} mail_id [description]
			 * @return {[type]}         [description]
			 */
			function createAction(mail_id){
				var mail = { mail_id : $scope.mail_corr.id,
										 uid: loginService.getUserId(),
									   description: $scope.description
									 }
				mailService
					.createAction(mail)
					.then(function(response){
						cancel()
						getActions($scope.mail_corr.id)
					}).catch(function(error){
						//show error message
					})
			}
			/**
			 * Get actions by mail id
			 * @return {[type]} [description]
			 */
			function getActions(mail_id){
				mailService
					.getActions(mail_id)
					.then(function(actions){
						$scope.actions = actions
					}).catch(function(error){
						$scope.actions = []
					});
			}
			/**
			 * Get all attachments for a given mail correspondence by id
			 * @return {[type]} [description]
			 */
			function getAttachments() {
				var id = $scope.mail_corr.id
				mailService
						.getAttachments( id )
						.then(function ( attachments ){
								$scope.uploads = attachments
						}).catch(function ( error ){
								console.log('Error in getting attachments')
						})
			}
			/**
			 * Logs out signed in user
			 */
			function logout() {
				loginService.logout()
				$location.path('/login')
			}

			function update() {
				mailService
					.updateMail($scope.mail_corr)
					.then(function( response ){
						$scope.message = true
						show($scope.mail_corr.id)
					}).catch(function( error ){
						 console.log('Error in updating mail')
					})
			}
	}
})();
