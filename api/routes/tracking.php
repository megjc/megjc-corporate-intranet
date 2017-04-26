<?php
  include_once 'functions.php';
  $dotenv = new Dotenv\Dotenv(__DIR__);
  $dotenv->load();
  function routeTrackingRequests($app){

    $app->post('/features', function () use ( $app ){
      $tracking = json_decode( $app->request->getBody(), true);
      try {
        $db = openDBConnection();
        $sql = 'INSERT INTO features (title, created_at, user_id, ip)
                VALUES (:title, :created_at, :user_id, :ip)';
        $stmt = $db->prepare($sql);
        $stmt->execute(array(":title" => $tracking['feature_title'],
                            ":created_at" => date("Y-m-d H:i:s"),
                            ":user_id" => $tracking['user_id'],
                            ":ip" => $_SERVER['REMOTE_ADDR']
                          ));

        $response = $db->lastInsertId();
        closeDBConnection($db);
        echo json_encode($response);
      } catch (PDOException $e) {
        $response = '{"error":{"text":' .$e->getMessage(). '}}';
      }
    });
  } //end of function
?>
