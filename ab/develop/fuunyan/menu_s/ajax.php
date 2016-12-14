<?php
require_once "../common/php/dbConnect.php";
//js側からのデータ
$data = file_get_contents("php://input");
$req = json_decode($data, true);
$res="";
if($req['command']=='answerSearch'){
    $res=answerSearch($req);
}
echo json_encode($res,JSON_UNESCAPED_UNICODE);
//////////////////////////////////////////////function
// パッケージを検索する
//本日の日付から対象のシートを検索し、セッションのユーザに一致するレコードを返す。
function answerSearch($req=null) {

    session_start();

    $res=array();
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    if($req!=null){
        $tablename="sheet";
        $datetime=date("Y-m-d H:i:s");
        $sql = "SELECT * FROM `{$tablename}`".
        " left outer join package on sheet.package = package.id".
        " where dateFrom < ? AND dateTo > ? ";
        $stmt = $pdo -> prepare($sql);
        $stmt->bindValue(1, $datetime,PDO::PARAM_STR);
        $stmt->bindValue(2, $datetime,PDO::PARAM_STR);
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

    //answer取得
    $sql = "SELECT * FROM `answer` where package= ? and user= ?;";
    $stmt = $pdo -> prepare($sql);
    $stmt -> bindValue(1,$res[$tablename][0]->package, PDO::PARAM_INT);
    $stmt -> bindValue(2,$_SESSION['USERID'], PDO::PARAM_INT);
    $stmt -> execute(null);
    $res['answer']=$stmt->fetchAll(PDO::FETCH_CLASS);


    return $res;
}