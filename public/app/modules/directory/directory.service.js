(function(){
   'use strict';
   angular
   .module('intranet.directory')
   .factory('directoryService', directoryService);

   directoryService.$inject = ['$http'];
   /**
    * [directoryService description]
    * @param  {[type]} $http [description]
    * @return {[type]}       [description]
    */
   function directoryService($http){
       var service = {
           getDepartments: getDepartments,
           getEmployeesByDepartment:getEmployeesByDepartment,
           getEmployees: getEmployees,
           search: search
       };
       return service;
       /**
        * Get all departments
        */
       function getDepartments(){
           var url = '/api/v1/departments';
           return $http.get(url)
                        .then(getDepartmentsSuccess)
                        .catch(getDepartmentsFailure);
             /**
              * Handle data retrieval success
              */
            function getDepartmentsSuccess(result){ return result.data; }
            /**
             * Handle data retrieval error
             */
            function getDepartmentsFailure(error){ return error; }
       }
       /**
        * Get employees by department id
        * @param id Deparment id
        */
       function getEmployeesByDepartment(id){
           var url = '/intranet/api/v1/departments/' + id + '/employees';

           return $http.get(url)
                        .then(getEmployeesSuccess)
                        .catch(getEmployeesFailure);
            /**
             * Handle data retrieval success
            */
            function getEmployeesSuccess(result){ return result.data; }
            /**
             * Handle data retrieval error
             */
            function getEmployeesFailure(error){ return error; }
       }
       /**
        * Search database for a employee matching the query
        * @param  {[type]} query [description]
        * @return {[type]}       [description]
        */
       function search(query){
             var url = '/intranet/api/v1/employees/search?q=' + query;
             return $http.get(url)
                         .then(handleSuccess)
                         .catch(handleError);
         /**
          * Handle data retrieval success
         */
         function handleSuccess(result){ return result.data; }
         /**
          * Handle data retrieval error
          */
         function handleError(error){ return error; }
       }
       /**
        * Get all employees
        * @return {[type]} [description]
        */
       function getEmployees(){
         var url = '/api/v1/employees'
         return $http.get(url)
       }
   }
})();
