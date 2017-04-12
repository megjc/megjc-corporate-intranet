(function() {
  'use strict'
  angular.module('dashboard', []).config(config)
  /**
   * Outlines all routes for dashboard
   * @param  {[type]} $routeProvider [description]
   * @return {[type]}                [description]
   */
  function config($routeProvider) {
    $routeProvider.when('/dashboard/apps',{
      templateUrl:'public/app/modules/dashboard/dashboard.html',
      controller: 'Dashboard as vm',
      access: {restricted: true}
    }).otherwise({redirectTo: '/'});
  }
})();
