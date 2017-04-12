	<?php
require 'vendor/autoload.php';
require 'routes/routes.php';

$config['displayErrorDetails'] = true;

$app = new \Slim\Slim(["settings" => $config]);
/**
* Slim group defining version of api
*/
$app->group('/v1', function() use ($app){

		$app->group('/departments', function() use ($app){
				routeDepartmentRequests($app);
		});

		$app->group('/employees', function() use($app){
				routeEmployeeRequests($app);
		});

		$app->group('/tickets', function() use($app){
				routeTicketRequests($app);
		});

		$app->group('/admin', function() use($app){
				routeAdminRequests($app);
		});

		$app->group('/auth', function() use($app){
					routeAuthRequests($app);
		});

		$app->group('/poll', function() use($app){
					routePollRequests($app);
		});

		$app->group('/users', function() use($app){
					routeUserRequests($app);
		});

		$app->group('/mails', function() use( $app ){
					routeMailRequests( $app );
		});

		$app->group('/upload', function() use( $app ){
					routeUploadRequests( $app );
		});

		$app->group('/apps', function() use( $app ){
					routeAppRequests( $app );
		});

		$app->group('/transactions', function() use( $app ){
					routeTransRequests( $app );
		});

		$app->group('/search', function() use( $app ){
					routeSearchRequests( $app );
		});
}); //end of group
/**
 * Run the Slim application
 */
$app->run();

?>
