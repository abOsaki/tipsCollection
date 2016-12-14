<?php
class dbConnect {
    private $host;
    private $user;
    private $pass;
    private $dbname;
    private $baseinfo;
    private $pdo;
    
    //DB情報
    public function __construct() {

        $this -> host = 'mysql518.db.sakura.ne.jp';
        $this -> user = 'activepro';
        $this -> pass = 'wbg20160705';
        $this -> dbname = 'activepro_anaume_demo2';
        $this -> baseinfo = 'activepro_baseinfo_demo2';
        $this -> dbmekurin = 'activepro_mekurin_demo2';
        $this -> connect();

    }
    
    //DB接続
    public function connect() {
        $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8;',
                       $this -> host,
                       $this -> dbname
                      );
        $this -> pdo = new PDO($dsn, $this -> user, $this -> pass);
    }
    
    //DB接続
    public function connectInfo() {
        return $this -> pdo;
    }
    
    //共通情報
    public function baseInfoName() {
        return $this -> baseinfo;
    }
    
    //共通情報
    public function dbmekurinName() {
        return $this -> dbmekurin;
    }
    
    //SQL実行
    public function fetch($sql) {
        $stmt = $this -> pdo -> prepare($sql);
        $stmt -> execute(null);
        while($result = $stmt -> fetch(PDO::FETCH_ASSOC)) {
            $array[] = json_encode($result);
        }
        $data = $array;
        //var_dump($data);
        
        return $data;
    }
}

?>