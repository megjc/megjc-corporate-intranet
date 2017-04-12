(function() {
    'use strict'

    angular.module('dashboard').controller('Dashboard', Dashboard)

    Dashboard.$inject = ['$location', 'loginService', 'dashboardService']
    /* @ngInject */
    function Dashboard($location, loginService, dashboardService) {
        var vm = this
        vm.logout = logout
        activate()
        /**
         * Handles controller start up logic
         * @return {[type]} [description]
         */
        function activate() {
          //vm.apps = apps
          var user = JSON.parse(localStorage.getItem('user'))
          vm.username = user.uname
        }
        /**
         * Logs out user
         * @return {[type]} [description]
         */
        function logout() {
          loginService.logout()
          $location.path('/login')
        }
    }
})();
