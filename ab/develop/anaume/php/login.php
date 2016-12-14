<?php
require_once "dbConnect.php";
require_once "password.php";

//セッション登録
function setSession($loginId, $loginPw) {
    $model = new dbConnect();
    $pdo = $model -> connectInfo();
    
    //ハッシュ化
    $loginPw = get_stretched_password($loginPw, $loginId);
        
    $baseInfo = $model -> baseInfoName();
    
    $selectList = ["id", "loginName", "password", "displayName", "mekurin", "anaume", "tamatebako", "hourensou", "fuunyan", "group"];

    //SQL文発行
    //権限箇所
    $sqlSelect = "`" . implode("`, `", $selectList) . "` ";
    //分岐個所
    $sqlCase = "";
    $sqlCase .=", " .
        "CASE `users`.`group` " .
        "WHEN '1' THEN `users`.`schoolE` " .
        "WHEN '2' THEN `users`.`schoolH` " .
        "ELSE 0 " .
        "END AS 'school'";
    $sqlCase .= ", " .
        "CASE `users`.`group` " .
        "WHEN '1' THEN `users`.`gradeE` " .
        "WHEN '2' THEN `users`.`gradeH` " .
        "ELSE 0 " .
        "END AS 'grade' ";
    $sqlCase .= ", " .
        "CASE `users`.`group` " .
        "WHEN '1' THEN `users`.`classE` " .
        "WHEN '2' THEN `users`.`classH` " .
        "ELSE 0 " .
        "END AS 'class' ";
    $sqlCase .= ", " .
        "CASE `users`.`group` " .
        "WHEN '1' THEN `users`.`curriculumE` " .
        "WHEN '2' THEN `users`.`curriculumH` " .
        "ELSE 0 " .
        "END AS 'curriculum'";
    $sqlSelect .= $sqlCase;
    
    $sqlFrom = "`{$baseInfo}`.`users` ";
    
    $sqlWhere = "`loginName` = :loginId AND `password` = :loginPw";
    //$sqlWhere = "`loginName` = '{$loginId}' AND `password` = '{$loginPw}'";
    
    $sql = "SELECT {$sqlSelect} FROM {$sqlFrom} WHERE {$sqlWhere};";
    //return $sql;

    $stmt = $pdo -> prepare($sql);

    //パラメーター設定
    $stmt -> bindParam(':loginId', $loginId, PDO::PARAM_STR);
    $stmt -> bindParam(':loginPw', $loginPw, PDO::PARAM_STR);

    $stmt -> execute(null);

    $loginFlag = "";
    $loginAuthority = "";
    $displayName = "";
    $group = "";
    $school = "";
    $grade = "";
    $class = "";
    
    if ($result = $stmt -> fetch(PDO::FETCH_ASSOC)) {
        session_start();
        //権限登録
        $_SESSION["USERID"] = $result["id"];
        $_SESSION["DISPLAYNAME"] = $result["displayName"];
        $_SESSION["MEKURIN"] = $result["mekurin"];
        $_SESSION["ANAUME"] = $result["anaume"];
        $_SESSION["TAMATEBAKO"] = $result["tamatebako"];
        $_SESSION["HOURENSOU"] = $result["hourensou"];
        $_SESSION["FUUNYAN"] = $result["fuunyan"];
        
        $_SESSION["GROUP"] = $result["group"];
        $_SESSION["SCHOOL"] = $result["school"];
        $_SESSION["GRADE"] = $result["grade"];
        $_SESSION["CLASS"] = $result["class"];
        $_SESSION["CURRICULUM"] = $result["curriculum"];

        //成功
        $loginFlag = 1;
        //コンテンツの権限を設定
        $loginAuthority = $_SESSION["ANAUME"];
        $displayName = $_SESSION["DISPLAYNAME"];
        
        //情報未登録
        //if () {
        //    $loginFlag = 2;
        //}
    } else {
        //失敗
        $loginFlag = 0;
        $loginAuthority = null;
        $displayName = null;
    }
    
    $sessionInfo = array(
        "flag" => $loginFlag,
        "authority" => $loginAuthority,
        "displayName" => $displayName
    );
    return $sessionInfo;
}

//ログイン処理
function login($loginData) {
    //var_dump($loginData);
    if(isset($loginData["login"])) {
        $sessionInfo = setSession($loginData["userid"], $loginData["password"]);
        //return $sessionInfo;
        if ($sessionInfo["flag"] == 2) {
            $url = "#";
            $flag = 2;
            $message = "";
        } else if($sessionInfo["flag"] == 1) {
            if($sessionInfo["authority"] >= 1 && $sessionInfo["authority"] <= 3){
                $url = "./menu.html";
                $flag = "true";
                $message = "ログインに成功しました。";
            } else {
                $url = "#";
                $flag = "false";
                $message = "権限認証に失敗しました。";
            }
        } else {
            $url = "#";
            $message = "ユーザ名あるいはパスワードを確認してください。";
            $flag = "false";
        }
    } else {
        $url = "#";
        $flag = "false";
        $message = "エラーが発生しました。";
    }
    
    $loginInfo = array(
        "flag" => $flag,
        "userid" => $loginData["userid"],
        "url" => $url,
        "message" => $message
    );
    
    return $loginInfo;
}

//js側からのデータ
$data = file_get_contents("php://input");
//var_dump($data);
$dataArray = json_decode($data, true);

//js側へ
echo json_encode(login($dataArray));

?>