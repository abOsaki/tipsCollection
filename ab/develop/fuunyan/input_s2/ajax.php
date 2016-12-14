<?php
require_once "../common/php/dbConnect.php";
//js側からのデータ
$data = file_get_contents("php://input");
$req = json_decode($data, true);
$res="";
if($req['command']=='sheetSearch'){
    $res=sheetSearch($req);
}
else if($req['command']=='answerSave'){
    $res=answerSave($req);
}
echo json_encode($res,JSON_UNESCAPED_UNICODE);
//////////////////////////////////////////////function
// パッケージを検索する
function sheetSearch($req=null) {
    $res=array();
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();

        session_start();



$schoole= (int)$_SESSION["SCHOOLE"];
$schoolh= (int)$_SESSION["SCHOOLH"];
$gradee= (int)$_SESSION["GRADEE"];
$gradeh= (int)$_SESSION["GRADEH"];
$classe= (int)$_SESSION["CLASSE"];
$classh= (int)$_SESSION["CLASSH"];
$group= (int)$_SESSION["GROUP"];


    if($req!=null){
        $tablename="sheet";
        $datetime=date("Y-m-d H:i:s");
        $sql = "SELECT * FROM `{$tablename}`".
        " left outer join package on sheet.package = package.id".
        " where dateFrom < ? AND dateTo > ? AND ".
        " `{$tablename}`.`stopFlag` = 0 AND".
        " `{$tablename}`.`schoolE` = ? AND".
        " `{$tablename}`.`schoolH` = ? AND".
        " `{$tablename}`.`gradeE` = ? AND".
        " `{$tablename}`.`gradeH` = ? AND".
        " `{$tablename}`.`classE` = ? AND".
        " `{$tablename}`.`classH` = ? AND".
        " `{$tablename}`.`group` = ? ";


        $stmt = $pdo -> prepare($sql);
        $stmt->bindValue(1, $datetime,PDO::PARAM_STR);
        $stmt->bindValue(2, $datetime,PDO::PARAM_STR);
        $stmt -> bindValue(3,$schoole , PDO::PARAM_INT);
        $stmt -> bindValue(4,$schoolh , PDO::PARAM_INT);
        $stmt -> bindValue(5,$gradee , PDO::PARAM_INT);
        $stmt -> bindValue(6,$gradeh , PDO::PARAM_INT);
        $stmt -> bindValue(7,$classe , PDO::PARAM_INT);
        $stmt -> bindValue(8,$classh , PDO::PARAM_INT);
        $stmt -> bindValue(9,$group, PDO::PARAM_INT);
        $stmt -> execute(null);
        $res[$tablename]=$stmt->fetchAll(PDO::FETCH_CLASS);
    }
        //子データ取得
    $sql = "SELECT * FROM `question`";
    $stmt = $pdo -> prepare($sql);
    $stmt -> execute(null);
    $detail=$stmt->fetchAll(PDO::FETCH_CLASS);
    for ($i=0; $i < count($res[$tablename]); $i++) { 
        $list=explode(',',$res[$tablename][$i]->contents);
        $res[$tablename][$i]->child=array();
        for ($j=0; $j <count($list) ; $j++) { 
            for ($k=0; $k <count($detail); $k++) { 
                if($list[$j]==$detail[$k]->id){
                    $res[$tablename][$i]->child[]=$detail[$k];
                }
            }
        }
    }

    //すでに回答されているかどうか確認する
    $datetime=date("Y-m-d").'%';

    $sql = "SELECT * FROM `answer` where `date` like ? AND user = ?";
    $stmt = $pdo -> prepare($sql);

    $stmt->bindValue(1, $datetime,PDO::PARAM_STR);
    $stmt -> bindValue(2,$_SESSION['USERID'] , PDO::PARAM_INT);

    $stmt -> execute(null);
    $detail=$stmt->fetchAll(PDO::FETCH_CLASS);



    for ($i=0; $i < count($res[$tablename]); $i++) { 

        if(count($detail)>0){
            $res[$tablename][$i]->answerdFlag="1";
        }
        else{
            $res[$tablename][$i]->answerdFlag="0";

        }

    }





return $res;
}
function answerSave($req=null) {
    $res=array();
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    $tablename="answer";
    $year = $req['year'];
    $month = $req['month'];
    $date = $req['date'];
    $timeStamp = strtotime("$year-$month-$date");
    //日付調整（直指定に対応）
    $datetime = date("Y-m-d H:i:s",$timeStamp);
    //return($datetime);
    //var_dump($req['param']['date']);
    //var_dump('$datetime');die;
    $param=$req['param'];
    //強制的新規
    $id=null;
    session_start();
    for ($i=0; $i <count($req['param']['qa']) ; $i++) { 

        $obj=$req['param']['qa'][$i];

        $sql="INSERT INTO ".$tablename
        ." (id,date,renewalDate,user,package,question,answerData)"
        ." VALUES (?,?,?,?,?,?,?)"
        ." ON DUPLICATE KEY UPDATE"
        ." date = ? ,renewalDate = ? ,user = ? ,package = ? ,question = ? ,answerData = ?;";
        $stmt = $pdo->prepare($sql);
        if($stmt){
            $stmt->setFetchMode(PDO::FETCH_ASSOC);
            $stmt->bindValue(1, $id,       PDO::PARAM_INT);           
            $stmt->bindValue(2, $datetime,         PDO::PARAM_STR); 
            $stmt->bindValue(3, $datetime,       PDO::PARAM_STR);
            $stmt->bindValue(4, $_SESSION['USERID'],       PDO::PARAM_INT);
            $stmt->bindValue(5, $param["package"],       PDO::PARAM_INT);
            $stmt->bindValue(6, $obj["id"],        PDO::PARAM_INT); 
            $stmt->bindValue(7, $obj["value"],        PDO::PARAM_STR);
            $stmt->bindValue(8, $datetime,         PDO::PARAM_STR); 
            $stmt->bindValue(9, $datetime,       PDO::PARAM_STR);
            $stmt->bindValue(10, $_SESSION['USERID'],       PDO::PARAM_INT);
            $stmt->bindValue(11, $param["package"],       PDO::PARAM_INT);
            $stmt->bindValue(12, $obj["id"],        PDO::PARAM_INT); 
            $stmt->bindValue(13, $obj["value"],        PDO::PARAM_STR);
            $stmt->execute();
        }
    }
    return array('result'=>'true');
}
