(function() {
    'use strict';

    angular
        .module('mail')
        .controller('View', View);

    View.$inject = ['$scope', '$routeParams','mailService', 'loginService']

    /* @ngInject */
    function View($scope, $routeParams, mailService, loginService) {
        var vm = this
        vm.revealAction = vm.revealFollowup = vm.showFollowupDate = false
        vm.revealActionForm = revealActionForm
        vm.cancelFollowup = cancelFollowup
        vm.save = saveFollowup
        vm.cancel = cancel
        vm.createAction = createAction
        vm.revealFollowupForm = revealFollowupForm
        vm.revealFollowupDate = revealFollowupDate
        vm.closeFollowup = closeFollowup
        vm.toggleEditCtrl = toggleEditCtrl
        vm.ctrls = mailService.initFormCtrls()
        vm.panels = mailService.initPanels()
        vm.update = update
        vm.show = showFollowup
        vm.showForm = false

        activate()

        function activate() {
          mailService
            .getMail($routeParams.id)
            .then(function (mail) {
              vm.mail_corr = mail.mail
              vm.actions = mail.actions
              vm.follow_up_date = new Date(vm.mail_corr.follow_date)
              vm.mail_corr.receipt_date = new Date(vm.mail_corr.receipt_date)
              vm.mail_corr.mail_date = new Date(vm.mail_corr.mail_date)
              vm.fileTitle = vm.mail_corr.file_title == 'none' ? false : true
            }).catch(function () {
              vm.mail_corr = []
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
              vm.actions = actions
            }).catch(function(error){
              vm.actions = []
            });
        }
        /**
         * Toggles mail action form
         * @return {[type]} [description]
         */
        function revealActionForm() {
          vm.revealAction = !vm.revealAction
        }

        function revealFollowupForm( ) {
          vm.revealFollowup = !vm.revealFollowup
          vm.description = ''
        }

        function cancel() {
            vm.revealAction = false
            vm.description = ''
        }

        function revealFollowupDate() {
          vm.showFollowupDate = !vm.showFollowupDate
        }
      /**
       * Toggle edit controls
       * @param  {[type]} ctrl [description]
       * @return {[type]}      [description]
       */
      function toggleEditCtrl( ctrl ){
        switch (ctrl) {
          case 'subject': vm.panels.subject = !vm.panels.subject
                          vm.ctrls.subject = !vm.ctrls.subject
          break
          case 'receipt_date': vm.panels.receipt_date = !vm.panels.receipt_date
                              vm.ctrls.receipt_date = !vm.ctrls.receipt_date
          break

          case 'mail_date': vm.panels.mail_date = !vm.panels.mail_date
                              vm.ctrls.mail_date = !vm.ctrls.mail_date
          break
          case 'sender': vm.panels.sender = !vm.panels.sender
                              vm.ctrls.sender = !vm.ctrls.sender
          break
          case 'receipent': vm.panels.receipent = !vm.panels.receipent
                              vm.ctrls.receipent = !vm.ctrls.receipent
          break
          case 'from_org': vm.panels.from_org = !vm.panels.from_org
                              vm.ctrls.from_org = !vm.ctrls.from_org

          case 'file_title': vm.panels.file_title = !vm.panels.file_title
                           vm.ctrls.file_title = !vm.ctrls.file_title
          break
          default: vm.ctrls = mailService.initFormCtrls()
                  vm.panels = mailService.initPanels()
        }
      }
        /**
         * Creates an action for a mail correspondence
         * @param  {[type]} mail_id [description]
         * @return {[type]}         [description]
         */
        function createAction(){
          var mail = { mail_id : vm.mail_corr.id,
                       uid: loginService.getUserId(),
                       description: vm.description
                     }
          mailService
            .createAction(mail)
            .then(function(response){
              cancel()
              getActions(vm.mail_corr.id)
            }).catch(function(error){
              //show error message
            })
        }

        function closeFollowup(){
          if(vm.followup_desc == '' || vm.followup_desc == null) return

          var mail = {
            mail_id: vm.mail_corr.id,
            uid: loginService.getUserId(),
            description: vm.followup_desc,
            follow_up: 1,
            closeFollowup: 1
          }
          mailService.createAction(mail).then(function(response){
            $scope.$broadcast('mailCreated')
            revealFollowupForm()
            activate()
          }).catch(function(error){

          })
        }
        /**
         * Updates field of mail correspondence
         * @param  {[type]} field [description]
         * @param  {[type]} data  [description]
         * @return {[type]}       [description]
         */
        function update( key, value ){
          if(value == null || value == '') return

          mailService
              .update( key, value, vm.mail_corr.id )
              .then(function(res){
                vm.updateSuccess = true
                vm.notification = "Mail correspondence successfully updated"
                toggleEditCtrl( key )
                getActions(vm.mail_corr.id)
          }).catch(function(error){  })
        }
        /**
         * Reveals follow up form
         * @return {[type]} [description]
         */
        function showFollowup(){
          vm.new_follow_date = mailService.customDate( 7 )
          vm.showForm = !vm.showForm
        }
        /**
         * Saves follow up date
         * @return {[type]} [description]
         */
        function saveFollowup( key, value ){
          if(value == null || value == '') return

          mailService.update( key, value, vm.mail_corr.id).then(function(res){
            mailService.update( 'follow_up', 2, vm.mail_corr.id).then(function(res){
              vm.showForm = false
              activate()
            }).catch(function(error){
                console.log('Error in updating follow up date')
            })
          }).catch(function(error){
              console.log('Error in updating follow up date')
          })
        }
        /**
         * Hides follow up form
         * @return {[type]} [description]
         */
        function cancelFollowup(){
            vm.showForm = !vm.showForm
        }
    }
})();
