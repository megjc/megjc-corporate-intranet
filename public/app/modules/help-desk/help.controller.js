(function(){
	angular
	.module('help')
	.controller('HelpDesk', HelpDesk);

	HelpDesk.$inject = ['$scope', '$http', 'helpDeskService'];

	function HelpDesk($scope, $http, helpDeskService){
		var vm = this;
		vm.open_tickets = true;
		vm.create_ticket = false;
		vm.message = false;
		vm.dismiss = dismissAlert;
		vm.toggle = toggle;
		vm.handleForm = handleForm;
		activate();
		/**
		 * Deals with controller startup logic
		 * @return {[type]} [description]
		 */
		function activate(){
			helpDeskService
					.getTickets({fname: 'Courtney', lname: 'Laidlaw'})
					.then(function(tickets){
							vm.tickets = tickets;
					}).catch(function(error){
							vm.tickets = [];
					});
		}
		/**
		 * Process issue form
		 * @param  {[type]} valid [description]
		 * @return {[type]}       [description]
		 */
		function handleForm(valid){ vm.message = true; };
		/**
		 * Removes bootstrap alert
		 * @return {[type]} [description]
		 */
		function dismissAlert(){ vm.message = false; };
		/**
		 * [toggle description]
		 * @param  {[type]} ticket [description]
		 * @return {[type]}        [description]
		 */
		function toggle(ticket){
			switch(ticket){
				case 'open-tickets':
							activate();
							vm.open_tickets = true;
							vm.create_ticket = false;
							vm.closed_tickets = false;
				break;
				case 'create-ticket':
										getCategories();
										vm.create_ticket = true;
									  vm.open_tickets = false;
				break;
				case 'closed-tickets': console.log('closed');
				break;
				case 'all-tickets': console.log('all');
				break;
			}
		}
		/**
		 * Get categories for issue creation
		 * @return {[type]} [description]
		 */
		function getCategories(){
			helpDeskService.getCategories().then(function(categories){
				vm.selected = categories[0];
				vm.categories = categories;
			}).catch(function(error){
				vm.categories = [];
			});
		}
	}
})();
