(function() {
  'use strict'
  angular.module('intranet.dashboard', []).config(config)
  /**
   * Outlines all routes for dashboard
   * @param  {[type]} $routeProvider [description]
   * @return {[type]}                [description]
   */
  function config($routeProvider) {
    $routeProvider.when('/dashboard/apps',{
      templateUrl:'public/app/templates/dashboard/dashboard.html',
      controller: 'Dashboard as vm',
      resolve: {
        apps: function(dashboardService){
          return dashboardService.getApps()
        }
      },
      access: {restricted: true}
    }).otherwise({redirectTo: '/'});
  }
})();
