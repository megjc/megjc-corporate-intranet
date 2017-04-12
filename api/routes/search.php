<?php
  include_once 'functions.php';
  $dotenv = new Dotenv\Dotenv(__DIR__);
  $dotenv->load();
  function routeSearchRequests($app){
    /**
     * Search mails by subject, sender, organization, receipent and file title
     * and returns results for a departme by id.
     */
    $app->get('/:id/:q', function ( $id, $q ) use ( $app ){
      $sql = "SELECT * FROM mails WHERE dept_id =:id AND
              (subject LIKE '$q%' OR sender LIKE '$q%'
                OR from_org LIKE '$q%' OR receipent LIKE '$q%'
                OR file_title LIKE '$q%')";
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
