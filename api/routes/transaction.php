<?php
  include_once 'functions.php';
  $dotenv = new Dotenv\Dotenv(__DIR__);
  $dotenv->load();
  function routeTransRequests($app){
    /**
     * Get a list of all apps for a given id.
     */
    $app->get('/balances', function () use ( $app ){
      $sql = 'SELECT b.id,
                     b.opening_bal AS balance_bf,
                     b.current_bal AS balance,
                     c.title
              FROM balances AS b
              INNER JOIN councils AS c ON b.council_id = c.id';
      try{
        $db = openDBConnection();
        $stmt = $db->prepare( $sql );
        $stmt->execute();
        $result = $stmt->fetchAll( PDO::FETCH_OBJ );
        closeDBConnection( $db );
        setResponseHeader( $app );
        echo json_encode( $result );
      }catch(PDOException $e){
        echo '{"error":{"text":' .$e->getMessage(). '}}';
      }
    });

    $app->get('/councils/:id', function ( $id ) use ( $app ){
      $sql = 'SELECT t.id,
                     t.particular,
                     t.created,
                     ty.title AS type,
                     t.amount,
                     t.created_by,
                     t.trans_date
              FROM transactions AS t
              INNER JOIN councils AS c ON t.council_id = c.id
              INNER JOIN tran_types AS ty ON t.trans_type = ty.id
              WHERE t.council_id=:id';
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
