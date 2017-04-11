(function() {
    'use strict';

    angular
        .module('trans')
        .service('transService', transService);

    transService.$inject = ['$http', 'CONSTANTS'];

    /* @ngInject */
    function transService($http, CONSTANTS) {
        var service = {
          getTransaction: getTransaction,
          getTransactions: getTransactions,
          updateTransaction: updateTransaction,
          createTransaction: createTransaction,
          getBalances: getBalances,
          getTransactionsByCouncilId: getTransactionsByCouncilId
        }

        function getTransactions() {
          return $http
                    .get(API_URL + 'transactions')
                    .then(function (res) {
                      return res.data
                    }).catch(function(res){
                      return res
                    })
        }

        function getTransaction( id ) {
          return $http
                    .get(API_URL + 'transactions/' + id)
                    .then(function (res) {
                      return res.data
                    }).catch(function(res){
                      return res
                    })
        }

        function updateTransaction( value, id ) {
          var update = {'value': value},
              url = API_URL + 'transactions/' + id
          return $http
                    .put(url, update)
                    .then(function (res) {
                      return res.data
                    }).catch(function(res){
                      return res
                    })
        }

        function createTransaction( trans ) {
          return $http
            .post(API_URL + 'transactions', trans)
            .then(function (res) {
               return res.data
            }).catch(function (res) {
               return res
            })
        }

      function getTransactionsByCouncilId( id ){
        return $http
                  .get(CONSTANTS.URL + 'transactions/councils/' + id)
                  .then(handleSuccess).catch(handleError)
      }

      function getBalances(){
        return $http.get(CONSTANTS.URL + 'transactions/balances').then(handleSuccess).catch(handleError)
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
