<?php
  include_once 'functions.php';
  $dotenv = new Dotenv\Dotenv(__DIR__);
  $dotenv->load();
  function routeMailRequests($app){
    /**
     * Get all mails by a user's id.
     */
     $app->get('/users/:id', function($id) use($app){
      $sql = 'SELECT id, mail_type, file_title, mail_date,
                      receipt_date, from_org, sender,
                      receipent, subject, created_on, dept_id
                      FROM mails WHERE created_by=:id
                      ORDER BY created_on DESC';
      try{
        $db = openDBConnection();
        $stmt = $db->prepare( $sql );
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $result = $stmt->fetchAll( PDO::FETCH_OBJ );
        closeDBConnection( $db );
        setResponseHeader( $app );
        echo json_encode($result);
      }catch(PDOException $e){
        echo '{"error":{"text":' .$e->getMessage(). '}}';
      }
     });

     /**
      * Get all mails by a department id.
      */
      $app->get('/departments/:id', function( $id ) use( $app ){
       $params = $app->request->get();
       if(array_key_exists('follow_up', $params)){
         $sql = 'SELECT id, mail_type, file_title, mail_date,
                         receipt_date, from_org, sender,
                         receipent, subject, created_on, dept_id, follow_up, follow_date
                         FROM mails WHERE dept_id=:id AND follow_up = 2
                         ORDER BY receipt_date DESC';
       }else{
         $sql = 'SELECT id, mail_type, file_title, mail_date,
                         receipt_date, from_org, sender,
                         receipent, subject, created_on, dept_id, follow_up, follow_date
                         FROM mails WHERE dept_id=:id AND deleted = 1
                         ORDER BY receipt_date DESC';
       }
       try{
         $db = openDBConnection();
         $stmt = $db->prepare( $sql );
         $stmt->bindParam("id", $id);
         $stmt->execute();
         $result = $stmt->fetchAll( PDO::FETCH_OBJ );
         closeDBConnection( $db );
         setResponseHeader( $app );
         echo json_encode(array('mails'=>$result, 'count'=>sizeof($result)));
       }catch(PDOException $e){
         echo '{"error":{"text":' .$e->getMessage(). '}}';
       }
      });
     /**
      * Get a mail correspondence by id.
      */
     $app->get('/:id', function( $id ) use( $app ){
      $sql = 'SELECT id, mail_type, file_title, mail_date,
                      receipt_date, from_org, sender,
                      receipent, subject, created_on, dept_id, follow_up, follow_date
                      FROM mails WHERE id=:id AND deleted = 1
                      ORDER BY created_on DESC';
      $sql_attachments = 'SELECT id, file_name, mail_id, created_on
                          FROM uploads WHERE mail_id=:id';
      $sql_actions = 'SELECT id, created_on, mail_id, uid, description
                      FROM actions WHERE mail_id=:id
                      ORDER BY created_on DESC';
        try{
          $db = openDBConnection();
          $stmt = $db->prepare( $sql );
          $stmt->bindParam("id", $id);
          $stmt->execute();
          $mail = $stmt->fetch( PDO::FETCH_OBJ );
          $stmt = null;
          $stmt = $db->prepare( $sql_actions );
          $stmt->bindParam("id", $id);
          $stmt->execute();
          $actions = $stmt->fetchAll( PDO::FETCH_OBJ );
          closeDBConnection( $db );
          setResponseHeader( $app );
          echo json_encode(array( "mail" => $mail,
                                  "actions" => $actions ));
        }catch(PDOException $e){
          echo '{"error":{"text":' .$e->getMessage(). '}}';
        }
     });
    /**
     * Creates a mail correspondence.
     */
    $app->post('/', function() use ( $app ){
      $mail = json_decode( $app->request->getBody(), true);
      $mail_id = false;
      $status = null;
      if(!isValueEmpty($mail)){

        try {
          $db = openDBConnection();
          $sql = 'INSERT INTO mails (mail_type, file_title,
                                    mail_date, receipt_date,
                                    from_org, sender, receipent, subject,
                                    created_by, created_on, dept_id, follow_up, follow_date)
                              VALUES (:mail_type, :file_title, :mail_date,
                                      :receipt_date, :from_org, :sender,
                                      :receipent, :subject, :created_by,
                                      :created_on, :dept_id, :follow_up, :follow_date)';
          $stmt = $db->prepare($sql);
          $stmt->execute(array(":mail_type" => $mail['mail_type'],
                              ":file_title" => $mail['file_title'],
                              ":mail_date" => $mail['mail_date'],
                              ":receipt_date" => $mail['receipt_date'],
                              ":from_org" => $mail['from_org'],
                              ":sender" => $mail['sender'],
                              ":receipent" => $mail['receipent'],
                              ":subject" => $mail['subject'],
                              ":created_by" => $mail['created_by'],
                              ":created_on" => date("Y-m-d H:i:s"),
                              ":dept_id" => $mail['dept_id'],
                              ":follow_up"=> intval($mail['follow_up']),
                              ":follow_date" => $mail['follow_up_date']));

          $mail_id = $db->lastInsertId();
          $stmt = null;
          $sql = 'INSERT INTO actions (mail_id, uid, description, created_on)
                  VALUES (:mail_id, :uid, :description, :created_on)';
          $stmt = $db->prepare( $sql );
          $stmt->execute(array( ":mail_id" => $mail_id,
                                ":uid" => 6,
                                ":description" => "Mail correspondence created.",
                                ":created_on" => date("Y-m-d H:i:s") ));

          closeDBConnection($db);
        } catch (PDOException $e) {
          $mail_id = '{"error":{"text":' .$e->getMessage(). '}}';
          $status = 400;
        }
      }
      if(is_numeric($mail_id)){
        $status = 200;
      }else{
        $status = 400;
      }
      setResponseHeader($app);
      setHTTPStatus($app, $status);
      echo json_encode($mail_id);
    });
    /**
     * [$filename description]
     * @var [type]
     */
    $app->post('/:id/upload', function( $id ) use ( $app ){
        if(!empty($_FILES)){
          $filename = $_FILES['file']['name'];
          $sql_upload = 'INSERT INTO uploads (file_name, mail_id, created_on)
                         VALUES (:file_name, :mail_id, :created_on)';
          $stmt_upload = $db->prepare($sql_upload);
          $stmt_upload->execute(array(":file_name"=> $filename,
                                      ":mail_id" => $mail_id,
                                      ":created_on" => date("Y-m-d H:i:s")));
          $upload_dir = __DIR__ . '/uploads';
          move_uploaded_file( $_FILES['file']['tmp_name'] , "$upload_dir/$filename" );
          echo json_encode('endpoint hit');
        }
    });
    /**
     * [$action description]
     * @var [type]
     */
    $app->post('/:id/actions', function( $id ) use ( $app ){
      $action = json_decode( $app->request->getBody() );
      $action_id = 0;
      try{
        $db = openDBConnection();
        $sql = 'INSERT INTO actions (mail_id, uid, description, created_on)
                VALUES (:mail_id, :uid, :description, :created_on)';
        $stmt = $db->prepare( $sql );
        $stmt->execute(array( ":mail_id" => $action->mail_id,
                              ":uid" => $action->uid,
                              ":description" => $action->description,
                              ":created_on" => date("Y-m-d H:i:s") ));
        $action_id = $db->lastInsertId();
        $stmt = null;
        if($action->follow_up == 1 && $action->closeFollowup == 1){
          $sql_update = 'UPDATE mails SET follow_up = 1 WHERE id=:mail_id';
          $stmt = $db->prepare( $sql_update );
          $stmt->execute(array(":mail_id"=> $action->mail_id));
       }
        closeDBConnection( $db );
      }catch(PDOException $e){
        $action_id = '{"error":{"text":' .$e->getMessage(). '}}';
      }
      setResponseHeader( $app );
      echo json_encode( $action_id );
    });
    /**
     * [$sql description]
     * @var string
     */
    $app->get('/:id/actions', function ( $id ) use ( $app ){
      $sql = 'SELECT id, created_on, mail_id, uid, description
                      FROM actions WHERE mail_id=:id
                      ORDER BY created_on DESC';
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

    $app->get('/search/mails', function (  ) use ( $app ){
      $params = $app->request->get('q');
      $sql = 'SELECT * FROM mails';
      try{
        $db = openDBConnection();
        $stmt = $db->prepare( $sql );;
        $result = $stmt->fetchAll( PDO::FETCH_OBJ );
        closeDBConnection( $db );
        setResponseHeader( $app );
        echo json_encode( $result );
      }catch(PDOException $e){
        echo '{"error":{"text":' .$e->getMessage(). '}}';
      }
    });
    /**
     * Get all attachments for a given mail correspondence id
     * @var string
     */
    $app->get('/:id/attachments', function ( $id ) use ( $app ){
      $sql = 'SELECT id, file_name, created_on
                      FROM uploads WHERE mail_id=:id
                      ORDER BY created_on DESC';
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

    $app->put('/:id', function( $id ) use ( $app ){
      $request = json_decode( $app->request->getBody() );
      $fields = array("subject" => "subject",
                      "receipt_date"=>"receipt date",
                      "sender" => "sender",
                      "mail_date" => "correspondence date",
                      "from_org" => "from organization",
                      "receipent" => "receipent",
                      "file_title" =>  "file title",
                      "follow_date" => "follow up date",
                      "deleted" => "deleted");
      try{
        $db = openDBConnection();
        $stmt = $db->prepare( "UPDATE mails SET $request->key=:value WHERE id=:id" );
        $response = $stmt->execute(array("value" => $request->value, "id"=>$id));
        if($response){
          $stmt = null;
          $sql = 'INSERT INTO actions (mail_id, uid, description, created_on)
                   VALUES (:mail_id, :uid, :description, :created_on)';

          if($request->key !== 'follow_up'){
            $desc = "Mail correspondence ".$fields[$request->key]." updated by ". $request->uname;

            $stmt = $db->prepare( $sql );
            $stmt->execute(array( ":mail_id" => $id,
                                   ":uid" => $request->created_by,
                                   ":description" => $desc,
                                   ":created_on" => date("Y-m-d H:i:s") ));
          }

        }else{
          $response = array();
        }
        closeDBConnection( $db );
      }catch(PDOException $e){
        $response = '{"error":{"text":' .$e->getMessage(). '}}';
      }
      setResponseHeader( $app );
      echo json_encode( $response );
    });
  }


  /**
   * Creates an attachment for a mail correspondence.
   * @param  [type] $mail_id The id of a mail correspondence.
   * @return [type]          [description]
   */
  function createAttachments($mail_id, $filename){
    try{
      $db = openDBConnection();
      $sql = 'INSERT INTO uploads (file_name, mail_id, created_on)
              VALUES (:file_name, mail_id, created_on)';
      $stmt = $db->prepare($sql);

      $stmt->execute(array(":file_name"=> $filename,
                            ":mail_id" => $mail_id,
                            ":created_on" => date("Y-m-d H:i:s")));
      closeDBConnection($db);
      return true;
    }catch(PDOException $e){
      return false;
    }
  }

?>
