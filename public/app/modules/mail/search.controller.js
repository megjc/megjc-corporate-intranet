(function() {
    'use strict';

    angular
        .module('mail')
        .controller('Search', Search);

   Search.$inject = ['mailService', 'loginService', '$location', '$http']
    /* @ngInject */
    function Search(mailService, loginService, $location, $http) {
        var vm = this
        vm.query = query
        vm.showMail = showMail
        vm.results = []
        //vm.q = ''
        //TODO - move functionality to a service.
        function query( q ){
          if(q.length > 2){
            var url = '/intranet/api/v1/search/' + loginService.getDepartmentId() + '/'
            $http.get( url + q).then(function(results){
              vm.results = results.data
            })
          }else{
            vm.results = []
          }
        }
        /**
         * Shows a mail by id
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        function showMail( id ){
          $location.path('/dashboard/apps/mails/' + id + '/view')
        }

    }
})();
