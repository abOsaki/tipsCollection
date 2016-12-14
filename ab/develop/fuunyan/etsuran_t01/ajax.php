<?php
require_once "../common/php/dbConnect.php";
//js側からのデータ
$data = file_get_contents("php://input");
$req = json_decode($data, true);
$res="";
if($req['command']=='sheetSearch'){
    $res=sheetSearch($req);
}
else if($req['command']=='manageStopFlag'){
    $res=manageStopFlag($req);
}else if($req['command']=='manageDate'){
    $res=manageDate($req);
}else if($req['command']=='getSheetByUser'){
    $res=getSheetByUser($req);
}else if($req['command']=='getCommonData'){
    $res=getBaseInfo($req);
}

echo json_encode($res,JSON_UNESCAPED_UNICODE);
//////////////////////////////////////////////function
// パッケージを検索する
function sheetSearch($req=null) {
    $res=array();
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    if($req!=null){


    session_start();
$schoole= (int)$_SESSION["SCHOOLE"];
$schoolh= (int)$_SESSION["SCHOOLH"];
$gradee= (int)$_SESSION["GRADEE"];
$gradeh= (int)$_SESSION["GRADEH"];
$classe= (int)$_SESSION["CLASSE"];
$classh= (int)$_SESSION["CLASSH"];
$group= (int)$_SESSION["GROUP"];


// var_dump($schoole,
// $schoolh,
// $gradee,
// $gradeh,
// $classe,
// $classh,
// $group);
// exit;
        $tablename="sheet";
        $datetime=date("Y-m-d H:i:s");
        $sql = "SELECT sheet.*,sheet.id AS sheet_id ,package.id,package.contents FROM `{$tablename}`".
        " left outer join package on sheet.package = package.id";



       $str="";
        if(isset($req['param'])){


                $stmt = $pdo -> prepare($sql);

            $stmt -> execute(null);
            $res[$tablename]=$stmt->fetchAll(PDO::FETCH_CLASS);
        }
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
    return $res;
}
function manageStopFlag($req=null) {
    $res=array();
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    $tablename="sheet";
    $datetime = date("Y-m-d H:i:s");
    $param=$req['param'];
    //強制的新規
    $id=null;
    session_start();

    $sql="UPDATE ".$tablename.' SET stopFlag = ? where id= ?;';
    $stmt = $pdo->prepare($sql);
    if($stmt){
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->bindValue(1, $param['flag'],PDO::PARAM_INT);           
        $stmt->bindValue(2, $param['where'],PDO::PARAM_INT); 
        $stmt->execute();
    }

    return array('result'=>'true');
}


function manageDate($req=null) {
    $res=array();
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    $tablename="sheet";
    $param=$req['param'];
    //強制的新規
    $id=null;


    //dateToはその日の23：59：59に変換する
    //「2016/03/31」→「2016/03/31 23:59:59」
    // echo $req['param']['dateTo'];
    $dateTo = DateTime::createFromFormat('Y/m/d',$req['param']['dateTo']);
    $dateTo= $dateTo->format('Y-m-d 23:59:59');

    // exit;


    session_start();

    $sql="UPDATE ".$tablename.' SET dateFrom= ? , dateTo= ? where id= ?;';

    $stmt = $pdo->prepare($sql);
    if($stmt){

        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->bindValue(1, $param['dateFrom'],PDO::PARAM_STR); 
        $stmt->bindValue(2, $dateTo,PDO::PARAM_STR); 
        $stmt->bindValue(3, $param['id'],PDO::PARAM_INT);           
        $stmt->execute();
    }

    return array('result'=>'true');
}

//ユーザ情報からシートを取得する
function getSheetByUser($req=null){
    $res=array();
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    $tablename="sheet";
    
    session_start();
    $schoole= (int)$_SESSION["SCHOOLE"];
    $schoolh= (int)$_SESSION["SCHOOLH"];
    $gradee= (int)$_SESSION["GRADEE"];
    $gradeh= (int)$_SESSION["GRADEH"];
    $classe= (int)$_SESSION["CLASSE"];
    $classh= (int)$_SESSION["CLASSH"];
    $group= (int)$_SESSION["GROUP"];
    
    
    $sql = "select * from ".$tablename;
    
    //var_dump($sql); die;
    
    $stmt = $pdo->prepare($sql);
    if($stmt){
        $stmt->execute();
    }
    $result=$stmt->fetchAll();
    return $result;
}

function getBaseInfo($req=null){
    $result=array();
    $model = new dbConnect(COMMON_TABLE);
    $pdo = $model -> connectInfo();
    
    session_start();
    $schoole= (int)$_SESSION["SCHOOLE"];
    $schoolh= (int)$_SESSION["SCHOOLH"];
    $gradee= (int)$_SESSION["GRADEE"];
    $gradeh= (int)$_SESSION["GRADEH"];
    $classe= (int)$_SESSION["CLASSE"];
    $classh= (int)$_SESSION["CLASSH"];
    $group= (int)$_SESSION["GROUP"];
    $authority = (int)$_SESSION["AUTHORITY"];
    
    $result["userSchoolE"] = $schoole;
    $result["userSchoolH"] = $schoolh;
    $result["userGradeE"] = $gradee;
    $result["userGradeH"] = $gradeh;
    $result["userClassE"] = $classe;
    $result["userClassH"] = $classh;
    $result["userGroup"] = $group;
    $result["authority"] = $authority;
    
    $tablenames = array('classE','classH','gradeE','gradeH','schoolE','schoolH','share',"`group`");
    
    foreach($tablenames as $tablename){
        $sql = "select * from ".$tablename;
        //var_dump($sql);
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $response=$stmt->fetchAll();
        //$result += array($tablename => $response);
        if($tablename === "`group`"){
            $result["group"] = $response;
        }else{
            $result[$tablename] = $response;
        }
        
        //return $response;
    }
    
    return $result;
}

