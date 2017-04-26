(function() {
    'use strict'

    angular
        .module('nav')
        .controller('Nav', Nav);

    Nav.$inject = ['$scope', '$location', 'mailService', 'loginService', 'sharedServices']
    /* @ngInject */
    function Nav($scope, $location, mailService, loginService, sharedServices) {
      var vm = this
      vm.logout = logout
      vm.track = track
      activate()
      /**
       * Listens for broadcast from parent controller
       */
      $scope.$on('mailCreated', handleBroadcast)
      /**
       * Handles controller start up logic
       * @return {[type]} [description]
       */
      function activate() {
        getMailsCount()
        getFollowupCount()
        setCurrentUser()
      }
      /**
       * Listens for successfull mail created event
       * @param  {[type]} event [description]
       * @param  {[type]} args  [description]
       * @return {[type]}       [description]
       */
      function handleBroadcast(event, args){
        activate()
      }
      /**
       * Gets the mails count
       * @return {[type]} [description]
       */
      function getMailsCount() {
          mailService
            .getMailsByDepartmentId()
            .then(function (mails) {
              vm.mails_count = mails.length
            }).catch(function () {
                vm.mails_count = []
            })
       }
       /**
        * Gets the follow up mails count
        * @return {[type]} [description]
        */
        function getFollowupCount() {
          mailService
            .getMailsForFollowup()
            .then(function (res) {
              vm.followup_count = res.count
            }).catch(function () {
                vm.followup_count = []
            })
        }
        /**
         * Logs out a user
         * @return {[type]} [description]
         */
        function logout() {
          loginService.logout()
          $location.path('/login')
        }
        /**
         * Sets current user's name
         */
        function setCurrentUser() {
          var user = JSON.parse(localStorage.getItem('user'))
          vm.username = user.uname
        }

        function track( feature ) {
          sharedServices.track(feature)
        }
    }
})();
