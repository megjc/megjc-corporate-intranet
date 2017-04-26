(function() {
    'use strict';

    angular
        .module('intranet.apps.mail')
        .controller('Incoming', Incoming);

    Incoming.$inject = ['$scope', '$location','mails', 'mailService']
    /* @ngInject */
    function Incoming($scope, $location, mails, mailService) {
        $scope.flag = flag
        $scope.showMail = show
        activate()

        function activate() {
          $scope.mails = mails.length > 0 ? mails: []
        }

        function flag( id ) {
          console.log( id )
        }
        /**
         * Show mail by id
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        function show( id ) {
          $location.path('/dashboard/apps/mails/' + id + '/view')
        }
    }
})();
