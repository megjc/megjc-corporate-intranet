(function() {
  'use strict'
   angular.module('intranet.dashboard').service('dashboardService', dashboardService)
   dashboardService.$inject = ['$http', 'CONSTANTS']
    /* @ngInject */
    function dashboardService($http, CONSTANTS) {
      var service = {
        getApps: getApps
      }
      /**
       * Get a list of applications for a user
       * @return {[type]} [description]
       */
      function getApps(){
        var user = JSON.parse(localStorage.getItem('user'))
        return $http.get( CONSTANTS.URL + 'apps/' + user.id )
                    .then(handleSuccess)
                    .catch(handleError)
      }

      function handleSuccess( res ){
        return res.data
      }

      function handleError( res ){
        return res
      }

      return service
    }
})();
