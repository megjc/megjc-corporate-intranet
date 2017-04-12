<?php
  include_once 'functions.php';
  $dotenv = new Dotenv\Dotenv(__DIR__);
  $dotenv->load();
  function routeAppRequests($app){
    /**
     * Get a list of all apps for a given id.
     */
    $app->get('/:id', function ( $id ) use ( $app ){
      $sql = 'SELECT * FROM apps WHERE user_id=:id';
      try{
        $db = openDBConnection();
        $stmt = $db->prepare( $sql );
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $result = $stmt->fetchAll( PDO::FETCH_OBJ );
        closeDBConnection( $db );
        setResponseHeader( $app );
        echo json_encode( $result );
      }catch(PDOException $e){
        echo '{"error":{"text":' .$e->getMessage(). '}}';
      }
    });
  } //end of function
?>
