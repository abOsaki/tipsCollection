<?php
require_once "dbConnect.php";


//js側からのデータ
$data = file_get_contents("php://input");
$req = json_decode($data, true);
$res="";


if($req['command']=='loginCheck'){
    $res=loginCheck();
}else if ($req['command']=='getTableCom' || $req['command']=='getTableMaster') {
    $res=getTable($req);
}else if ($req['command']=='logout') {
    $res=logout();
}
echo json_encode($res,JSON_UNESCAPED_UNICODE);


//////////////////////////////////////////////function

//ログインチェック
function loginCheck() {
    session_start();
    return $_SESSION;
}
//Table取得
function getTable($req=null) {

    $res=array();

    if($req!=null){

        $dbname="";
        if($req['command']=='getTableMaster'){
            $dbname=MASTER_TABLE;
        }else{
            $dbname=COMMON_TABLE;
        }


        $model = new dbConnect($dbname);
        $pdo = $model -> connectInfo();
        
        for ($i=0; $i <count($req['param']) ; $i++) { 

            $tablename=$req['param'][$i];
            $sql = "SELECT * FROM `".$tablename."`";



            if($req['delete_flag']=='on'){
                $sql .= " where delete_flag=0";      
            }


            $stmt = $pdo -> prepare($sql);

            $stmt -> execute(null);

            $res[$tablename]=$stmt->fetchAll(PDO::FETCH_CLASS);
        }
        return $res;

    }


}
//ログアウト
function logout() {
    session_start();

    if (isset($_COOKIE["PHPSESSID"])) {
        setcookie("PHPSESSID", '', time() - 1800, '/');
    }
    session_destroy();
    return true;
}



?>