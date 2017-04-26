(function(){
  angular
    .module('intranet.home')
    .factory('homeService', homeService);

    homeService.$inject = ['$http'];

    function homeService($http){
      var apiBaseUrl = "/wordpress/api";
      var service = {
          getVacancies: getVacancies,
          getVacancyBySlug: getVacancyBySlug,
          getPostsByCategory: getPostsByCategory,
          getRSSFeed: getRSSFeed
      };

      return service;
      /**
       * Gets all vacancies
       * @return {[type]} [description]
       */
      function getVacancies(){
        return $http.get(apiBaseUrl + '/get_category_posts?slug=vacancies')
                    .then(handleSuccess)
                    .catch(handleError);
        function handleSuccess(response){ return response.data.posts; }
        function handleError(error){ return error; }
      }

      function getVacancyBySlug(slug){
        return $http.get(apiBaseUrl + '/get_post/?slug=' + slug)
                    .then(handleSuccess)
                    .catch(handleError);
        function handleSuccess(response){ return response.data.post};
        function handleError(error) {return error; }
      }

      function getPostsByCategory(category){
        return $http.get(apiBaseUrl + '/get_category_posts?slug=' + category)
                    .then(handleSuccess)
                    .catch(handleError);
        function handleSuccess(response){ return response.data.posts; }
        function handleError(error){ return error; }
      }

      function getRSSFeed(){
        return $http.get('http://rss2json.com/api.json?rss_url=http://jamaica-gleaner.com/feed/rss.xml')
    		            .then(handleSuccess)
                    .catch(handleError);
        function handleSuccess(response){ return response.data.items; }
        function handleError(error){ return error; }
      }
    }
})();
