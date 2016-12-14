<?php
require_once "../common/php/dbConnect.php";


//js側からのデータ
$data = file_get_contents("php://input");
$req = json_decode($data, true);
$res="";



if($req['command']=='login'){
    $res=login($req);

}else if($req['command']=='groupSearch'){
    $res=groupSearch($req);

}else if($req['command']=='studentSearch'){
    $res=studentSearch($req);
}else if($req['command']=='studentSet'){
    $res=studentSet($req);
}else if($req['command'] == 'getSession'){
    session_start();
    $res = $_SESSION;
}
echo json_encode($res,JSON_UNESCAPED_UNICODE);



//////////////////////////////////////////////function
//GETパラメータより先生のデータを取得し，所属する学校，学年を取得する．
function groupSearch($req=null) {

    $res=array();
    $model = new dbConnect(COMMON_TABLE);
    $pdo = $model -> connectInfo();
    $sql = "SELECT * FROM `users` WHERE `id` = :loginId AND `authority` LIKE 't'";
    $stmt = $pdo -> prepare($sql);

    // var_dump($stmt);
    //パラメーター設定
    $stmt -> bindValue(':loginId', $req['param']["userid"], PDO::PARAM_STR);
    $stmt -> execute(null);
    $res['users']=$stmt->fetchAll(PDO::FETCH_CLASS);
    return $res;

}

//////////////////////////////////////////////function
//生徒番号と教師のログイン情報より，既存レコードが存在するか確認を行う．
//既存レコードがあればそのIDを返し，無ければ新規にレコードを作成，そのIDを返す
function studentSearch($req=null) {


    $res=array();
    $model = new dbConnect(COMMON_TABLE);
    $pdo = $model -> connectInfo();


    if($req['param']['group']=="1"){
        //小学校
        $sql = "SELECT * FROM `users`".
        " WHERE".
        " `schoolE` = ? AND".
        " `gradeE` = ? AND".
        " `classE` = ? AND".
        " `number` = ? AND".
        " `group` = ? AND".
        " `authority` LIKE 's'";

    }else{
        //中学校
        $sql = "SELECT * FROM `users`".
        " WHERE".
        " `schoolH` = ? AND".
        " `gradeH` = ? AND".
        " `classH` = ? AND".
        " `number` = ? AND".
        " `group` = ? AND".
        " `authority` LIKE 's'";
    }

    $stmt = $pdo -> prepare($sql);
    $stmt -> bindValue(1, $req['param']["schoolNumber"], PDO::PARAM_INT);
    $stmt -> bindValue(2, $req['param']["schoolGrade"], PDO::PARAM_INT);
    $stmt -> bindValue(3, $req['param']["schoolClass"], PDO::PARAM_INT);
    $stmt -> bindValue(4, $req['param']["studentNumber"], PDO::PARAM_INT);
    $stmt -> bindValue(5, $req['param']["group"], PDO::PARAM_INT);
    $stmt -> execute(null);

    $result=$stmt->fetchAll(PDO::FETCH_CLASS);
    $res['users']=$result;


    // var_dump($res);

    if(count($res['users'])==0){
        //新規作成フラグだが性別が記載されていない場合
        return array('result'=>'false');
    }else{


        setSession($res['users'][0]->loginName,$res['users'][0]->password,true);

    }

    return $res;

}

//新規レコードを作成し，IDを返す．
function studentset($req=null) {


    $res=array();
    $model = new dbConnect(COMMON_TABLE);
    $pdo = $model -> connectInfo();


   //新規レコードを作成
    $sql = 'INSERT INTO `users` (`id`, `loginName`, `password`, `displayName`, `mekurin`, `anaume`, `tamatebako`, `hourensou`, `fuunyan`, `group`, `schoolE`, `schoolH`, `gradeE`, `gradeH`, `classE`, `classH`, `curriculumE`, `curriculumH`, `number`, `sex`, `authority` )VALUES(
        null, ? , ? , ? , 0, 0, 0, 0, 0, ? , ? , ? , ? , ? , ? , ? , 0 , 0 , ? , ? , "s");';

    $stmt = $pdo -> prepare($sql);

    $hash="".$req['param']["group"].
    $req['param']["schoolNumber"].
    $req['param']["schoolGrade"].
    $req['param']["schoolClass"].
    $req['param']["studentNumber"].
    $req['param']["group"];

    $password=get_stretched_password($hash,$hash);

    $stmt -> bindValue(1,$hash, PDO::PARAM_STR);
    $stmt -> bindValue(2,$password, PDO::PARAM_STR);
    $stmt -> bindValue(3,$hash, PDO::PARAM_STR);
    $stmt -> bindValue(4,$req['param']['group'] , PDO::PARAM_INT);


    $reset=0;
    if($req['param']['group']=="1"){
        //小学校用
        $stmt -> bindValue(5,$req['param']['schoolNumber'] , PDO::PARAM_INT);
        $stmt -> bindValue(6,$reset , PDO::PARAM_INT);
        $stmt -> bindValue(7,$req['param']['schoolGrade'] , PDO::PARAM_INT);
        $stmt -> bindValue(8,$reset , PDO::PARAM_INT);
        $stmt -> bindValue(9,$req['param']['schoolClass'] , PDO::PARAM_INT);
        $stmt -> bindValue(10,$reset , PDO::PARAM_INT);

    }else{
        //中学校用
        $stmt -> bindValue(5,$reset , PDO::PARAM_INT);
        $stmt -> bindValue(6,$req['param']['schoolNumber'] , PDO::PARAM_INT);
        $stmt -> bindValue(7,$reset , PDO::PARAM_INT);
        $stmt -> bindValue(8,$req['param']['schoolGrade'] , PDO::PARAM_INT);
        $stmt -> bindValue(9,$reset , PDO::PARAM_INT);
        $stmt -> bindValue(10,$req['param']['schoolClass'] , PDO::PARAM_INT);
    }

    $stmt -> bindValue(11,$req['param']["studentNumber"], PDO::PARAM_STR);
    $stmt -> bindValue(12,$req['param']["sex"], PDO::PARAM_STR);
    $stmt -> execute(null);


    $id = $pdo->lastInsertId('id');

    //今作成したレコードをハッシュに格納
    setSession($hash,$password,true);

    return array('id'=>$id);
    exit;


}





//////////////////////////////////////////////function
//ログイン処理
function login($req=null) {
    // var_dump($req=null);
    if(isset($req['param']["login"])) {
        $sessionInfo = setSession($req['param']["userid"], $req['param']["password"]);



        if($sessionInfo["flag"] == true) {
            if($sessionInfo["authority"] == "m") {
                $url = "../menu_admin/";
            } else if($sessionInfo["authority"] == "t") {
                $url = "../menu_admin/";
            } else if($sessionInfo["authority"] == "s") {
                $url = "../menu_s/";
            }
            $message = "success";
            $flag = "true";
        } else {
            $url = "./";
            $message = "mismatch";
            $flag = "false";
        }
    } else {
        $url = "#";
        $message = "error";
        $flag = "false";
    }
    $loginInfo = array(
        "flag" => $flag,
        "url" => $url,
        "message" => $message
        );
    
    return $loginInfo;
}



//セッション登録
function setSession($loginId, $loginPw,$flag=false) {


    $model = new dbConnect(COMMON_TABLE);
    $pdo = $model -> connectInfo();
    
    if($flag==false){
    $loginPw = get_stretched_password($loginPw, $loginId);
    }else{
     $loginPw=   $loginPw;
    }

    $sql = "SELECT * FROM `users` WHERE `loginName` = :loginId AND `password` = :loginPw";
    $stmt = $pdo -> prepare($sql);



    //パラメーター設定
    $stmt -> bindValue(':loginId', $loginId, PDO::PARAM_STR);
    $stmt -> bindValue(':loginPw', $loginPw, PDO::PARAM_STR);

    


    $stmt -> execute(null);
    
    $loginFlag = "";
    $loginAuthority = "";
    


    if ($result = $stmt -> fetch(PDO::FETCH_ASSOC)) {


        session_start();
        $_SESSION["USERID"] = $result["id"];
        $_SESSION["DISPLAYNAME"] = $result["displayName"];
        $_SESSION["AUTHORITY"] = $result["fuunyan"];
        $_SESSION["NUMBER"] = $result["number"];       
        $_SESSION["GROUP"] = $result["group"];
        $_SESSION["SCHOOLE"] = $result["schoolE"];
        $_SESSION["SCHOOLH"] = $result["schoolH"];
        $_SESSION["GRADEE"] = $result["gradeE"];
        $_SESSION["GRADEH"] = $result["gradeH"];
        $_SESSION["CLASSE"] = $result["classE"];
        $_SESSION["CLASSH"] = $result["classH"];
        $_SESSION["CURRICULUME"] = $result["curriculumE"];
        $_SESSION["CURRICULUMH"] = $result["curriculumH"];

        $loginFlag = true;
        $loginAuthority = $result["authority"];
    } else {
        $loginFlag = false;
        $loginAuthority = $result["authority"];
    }
    
    $sessionInfo = array(
        "flag" => $loginFlag,
        "authority" => $loginAuthority,
        "displayName" => $displayname
        );
    return $sessionInfo;
}

function get_sha256($target) {
    return hash("sha256", $target);
}

function get_stretched_password($password, $userId) {
    $salt = get_sha256($userId);
    $hash = "";
    for ($i = 0; $i < STRETCH_COUNT; $i++) {
        $hash = get_sha256($hash . $salt . $password);
    }
    return $hash;
}


?>