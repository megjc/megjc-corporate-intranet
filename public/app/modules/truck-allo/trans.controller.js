(function() {
    'use strict';

    angular
        .module('trans')
        .controller('Trans', Trans);

    Trans.$inject = ['$location', '$routeParams', 'transService'];

    /* @ngInject */
    function Trans( $location, $routeParams, transService) {
        var vm = this
        vm.goTo = goTo
        vm.loading = true
        vm.show = show
        vm.update = update
        vm.create = create
        vm.message =  {
          show: false,
          message: ''
        }

        activate()
        /**
         * Handles controller start up logic
         * @return {[type]} [description]
         */
        function activate(){
          if(angular.isDefined($routeParams.id)){
            show( $routeParams.id )
            getTransactionsByCouncilId( $routeParams.id )
          }else{
            getBalances()
          }
        }

        function goTo( path ) {
          $location.path( path )
        }

        function show( id ) {
          $location.path( '/dashboard/apps/truck-allo/transactions/councils/' + id )
        }

        function update() {
          transService
            .updateTransaction(vm.transaction.particular, vm.transaction.id)
            .then(function (res) {
              vm.message.show = vm.message.success = true
              vm.message.text = 'Transaction updated successfully'
            }).catch(function () {
              console.log('Error')
            });
        }

        function getBalances(){
          transService.getBalances().then(function(balances){
            vm.balances = balances
          }).catch(function(error){
            vm.balances = []
          })
        }
        /**
         * Get transactions by council id
         * @param  {[type]} council_id [description]
         * @return {[type]}            [description]
         */
        function getTransactionsByCouncilId( council_id ){
          transService
              .getTransactionsByCouncilId( council_id )
              .then(function(transactions){
                vm.transactions = transactions
          }).catch(function(error){
               vm.transactions = []
          })
        }

        function create() {
          transService
            .createTransaction( vm.trans )
            .then(function (res) {
              vm.message.show = vm.message.success = true
              vm.message.text = 'Transaction created successfully'
            }).catch(function (err) {
              console.log('Error')
            })
        }
    }
})();
