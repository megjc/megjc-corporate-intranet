<?php
  include_once 'functions.php';
  $dotenv = new Dotenv\Dotenv(__DIR__);
  $dotenv->load();
  function routeAuthRequests($app){

    $app->post('/', function() use ( $app ){
       	$user = json_decode($app->request->getBody());
	      $message = array("success" => "", "description"=>"");
	  try{
          $conn = openLDAPConnection();
          $ldapbind = bindLDAP($conn, getenv('LDAP_ADMIN'), getenv('LDAP_PASS'));
      	  if($ldapbind){
          		$dn = getDnFromLDAP($conn, $user->name);
          		$ldap_bind = bindLDAP($conn, $dn, $user->password);
            		if($ldap_bind){
            			$message["success"] = true;
            			$message["description"] = "The username/password entered was valid";
                  $user = findUserByDn($dn);
                  $department = findDepartmentByName(getDeptFromDn($dn));
                  if(!$user && !$department){
                    $dept_id = createDepartmentFromDn($dn);
                    $uid = createUser($dn, $dept_id);
                    if(!$dept_id || !$uid){
                      $message["uid"] = "user not created";
                      $message["department"] = "department not created";
                    }else{
                      $message["uid"] = findUserByID($uid);
                    }
                  }else{
                    $message["uid"] = $user;
                  }
            			setHTTPStatus($app, 200);
            		}else{
            			$message["success"] = false;
            			$message["description"] = "The username/password entered was invalid";
            			setHTTPStatus($app, 400);
            		 }
      	   }else{
            		$message["success"] = false;
            		$message["description"] = "The admin username/password combination was invalid";
            		setHTTPStatus($app, 500);
      	   }
      	  ldap_close($conn);

        }catch(ErrorException $e){
		        setHTTPStatus($app, 500);
            $message["success"] = false;
         	  $message["message"] = $e->getMessage();
		        $message["description"] = "An error exception was raised";
        }
        setResponseHeader($app);
        echo json_encode($message);
    });
    /**
     * Get a specific user
     */
    $app->get('/users/:id', function($id) use ( $app ){
        setResponseHeader($app);
        $user = array('id' => 1, 'name'=>'Tremaine', 'email'=>'tremainekbuchanan@gmail.com' );
        echo json_encode($user);
    });

    $app->get('/users', function() use($app){
      setResponseHeader($app);
      echo json_encode('Get all users');
    });

    $app->get('/loggedin', function() use($app){
        session_start();
        $_SESSION["username"] = "Tremaine";
        setResponseHeader($app);
        echo json_encode('Logged in');
    });

    $app->get('/logout', function() use($app){
      session_start();
      if(isset($_SESSION['username'])){
        unset($_SESSION['username']);
        $message = "Logged out";
      }else{
        $message = "Not logged in";
      }
      setResponseHeader($app);
      echo json_encode($message);
    });

    $app->get('/user', function() use($app){
      session_start();
      $user = array('authenticated' => false);
      if(isset($_SESSION['username'])){
        $user['authenticated'] = true;
      }
      setResponseHeader($app);
      echo json_encode($user);
    });

    /**
     * Find a user by dn or create a user if not found by dn.
     * @return [type] [description]
     */
    function findUserByDn($dn){
      $sql = 'SELECT * FROM users WHERE dn=:dn';
      try{
        $db = openDBConnection();
        $stmt = $db->prepare( $sql );
        $stmt->bindParam("dn", $dn);
        $stmt->execute();
        $result = $stmt->fetch( PDO::FETCH_OBJ );
        closeDBConnection( $db );
        return $result;
      }catch(PDOException $e){
        return false;
      }
    }
    /**
     * Find a user by id.
     * @return [type] [description]
     */
    function findUserByID($id){
      $sql = 'SELECT * FROM users WHERE id=:id';
      try{
        $db = openDBConnection();
        $stmt = $db->prepare( $sql );
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $result = $stmt->fetch( PDO::FETCH_OBJ );
        closeDBConnection( $db );
        return $result;
      }catch(PDOException $e){
        return false;
      }
    }
    /**
     * Creates a user if user not found in database.
     * @param  string $dn User domain name
     * @return boolean
     */
    function createUser($dn, $dept_id){
      $sql = 'INSERT INTO users (dn, dept_id, created_on)
              VALUES (:dn, :dept_id, :created_on)';
      try{
        $db = openDBConnection();
        $stmt = $db->prepare($sql);
        $stmt->execute(array(":dn" => $dn,":dept_id"=> $dept_id,
                              ":created_on" => date("Y-m-d H:i:s")));
        $result = $db->lastInsertId();
        closeDBConnection($db);
        return $result;
      }catch(PDOException $e){
        return false;
      }
    }
    /**
     * Get the department name of the user from the dn string.
     * @param  [type] $dn [description]
     * @return [type]     [description]
     */
    function getDeptFromDn($dn){
      list($cn, $dept, $ou, $dc_one, $dc_two, $dc_three) = explode(',', $dn);
      $dept_name = explode('=', $dept);
      return $dept_name[1];
    }
    /**
     * [createDepartmentFromDn description]
     * @param  [type] $dn [description]
     * @return [type]     [description]
     */
    function createDepartmentFromDn($dn){
      $name = getDeptFromDn($dn);
      $sql = 'INSERT INTO departments (name, created_on) VALUES (:name, :created_on)';
      try{
        $db = openDBConnection();
        $stmt = $db->prepare($sql);
        $stmt->execute(array(":name" => $name,":created_on" => date("Y-m-d H:i:s")));
        $result = $db->lastInsertId();
        closeDBConnection($db);
        return $result;
      }catch(PDOException $e){
        return false;
      }
    }
    /**
     * Find a department by name.
     * @param  [type] $name [description]
     * @return [type]       [description]
     */
    function findDepartmentByName($name){
      $sql = 'SELECT * FROM departments WHERE name=:name';
      try{
        $db = openDBConnection();
        $stmt = $db->prepare( $sql );
        $stmt->bindParam("name", $name);
        $stmt->execute();
        $result = $stmt->fetch( PDO::FETCH_OBJ );
        closeDBConnection( $db );
        return $result;
      }catch(PDOException $e){
        return false;
      }
    }

    function getNameFromDn($dn){
        list($cn, $dept, $ou, $dc_one, $dc_two, $dc_three) = explode(',', $dn);
        $name = explode('=', $ou);
        return $name[1];
    }
  }

?>
