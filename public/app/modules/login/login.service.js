(function () {
   angular
   .module('login')
   .service('loginService', loginService);

   loginService.$inject = ['$http', '$location', 'API_URLS'];

   function loginService($http, $location, API_URLS) {
     var service = {
       authUser: authUser,
       checkCredentials: checkCredentials,
       isAuthenticated: isAuthenticated,
       getDepartmentId: getDepartmentId,
       getDepartment: getDepartment,
       getUserId: getUserId,
       getUser: getUser,
       getUserName: getUserName,
       logout: logout,
       setUser: setUser
     };
     /**
      * Authenticates a user based on email and password.
      * @param  {[type]} user User's email and password
      */
     function authUser(credentials) {
       return $http
                .post(API_URLS.base_url + 'auth', credentials)
                .then(handleSuccess)
                .catch(handleError);
        function handleSuccess(response){
          return response.data
        }
        function handleError(error){
          return error;
        }
     }
     /**
      * Checks if user credentials are valid.
      * @param  object - credentials User name and password
      * @return boolean             [description]
      */
     function checkCredentials( credentials ) {
       if(credentials.name === '' && credentials.password === '') return false
       if(credentials.name === '' || credentials.password === '') return false

       return true;
     }
     /**
      * Get department id from dn.
      * @param  string dn Domain Name string
      * @return object
      */
     function getDepartment(dn) {
       return $http.post(API_URLS.base_url + 'departments', {dn: dn})
                   .then(handleSuccess)
                   .catch(handleError);
       /**
        * Handles success
        * @param  {[type]} response [description]
        * @return {[type]}          [description]
        */
       function handleSuccess(response){
         return response.data;
       }
       /**
        * [handleError description]
        * @param  {[type]} error [description]
        * @return {[type]}       [description]
        */
       function handleError(error){
         return error;
       }
     }
     /**
      * Determines if a user is authenticated.
      * @return boolean true if user is authenticated.
      */
     function isAuthenticated() {
       var user = JSON.parse(localStorage.getItem('user'));
       if(user == null) return false
       else if(typeof user === 'object') return true;
     }
     /**
      * Sets user object to local storage.
      * @param object user User object.
      */
     function setUser(user) {
       localStorage.setItem('user', JSON.stringify(user));
     }
     /**
      * Gets a user object from local storage.
      * @return string User object.
      */
     function getUser() {
       return JSON.parse(localStorage.getItem('user'));
     }
     /**
      * Get the user's id from local storage.
      * @return string User's id.
      */
     function getUserId(){
       var user = JSON.parse(localStorage.getItem('user'));
       return user.id;
     }
     /**
      * Get the user's department id from local storage.
      * @return {[type]} [description]
      */
     function getDepartmentId() {
       var user = JSON.parse(localStorage.getItem('user'));
       return user.dept_id;
     }
     /**
      * Logs out user.
      * @return {[type]} [description]
      */
     function logout() {
       localStorage.removeItem('user');
       $location.path('/login')
     }
     /**
      * Get username from local storage.
      * @return string uname
      */
     function getUserName(){
       var user = JSON.parse(localStorage.getItem('user'))
       return user.uname
     }
     /**
      * Gets the user.
      * @param  {[type]} dn      [description]
      * @param  {[type]} dept_id [description]
      * @return {[type]}         [description]
      */
     function getUser(dn, dept_id) {
       return $http.post(API_URLS.base_url + 'users', {dn: dn, dept_id: dept_id})
                   .then(handleSuccess)
                   .catch(handleError);
           function handleSuccess(response){
             return response.data;
           }
           function handleError(error){
             return error;
           }
     }

     return service;
   }
})();
