<?php

include_once "config.php";


class dbConnect {
    private $host;
    private $user;
    private $pass;
    private $dbname;
    private $pdo;
    
    //DB情報
    public function __construct($dbname) {
        date_default_timezone_set('Asia/Tokyo');
        $this -> host = HOST;
        $this -> user = USER;
        $this -> pass = PASS;
        $this -> dbname = $dbname;
        $this -> connect();
    }
    //DB接続
    public function connect() {
        $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8;',
                       $this->host,
                       $this->dbname
                      );
        $this -> pdo = new PDO($dsn, $this -> user, $this -> pass);

        //SQLエラーを表示
        $this -> pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    
    //DB接続
    public function connectInfo() {
        return $this -> pdo;
    }
    
    //SQL実行
    public function fetch($sql) {
        $stmt = $this -> pdo -> prepare($sql);
        $stmt -> execute(null);
        while($result = $stmt -> fetch(PDO::FETCH_ASSOC)) {
            $array[] = json_encode($result);
        }
        $data = $array;
        
        return $data;
    }
}

?>