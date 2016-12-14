<?php
require_once "../common/php/dbConnect.php";
//js側からのデータ
$data = file_get_contents("php://input");
$req = json_decode($data, true);
$res="";
if($req['command']=='packageSearch'){
    $res=packageSearch($req);
}
else if($req['command']=='sheetSave'){
    $res=sheetSave($req);
}
echo json_encode($res,JSON_UNESCAPED_UNICODE);
//////////////////////////////////////////////function
// パッケージを検索する
function packageSearch($req=null) {
    $res=array();
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    if($req!=null){
        $tablename="package";
        $sql = "SELECT * FROM `{$tablename}`";
        $str="";
        if(isset($req['param'])){
            if(is_array($req['param'])){
                $str.=" where ";
                $end = each($req['param']);
                foreach ($req['param'] as $key => $value) {
                   $str.=" `{$key}` = ? AND ";
               }
               $str=substr($str, 0, -4);
               // echo $sql.$str;
               $stmt = $pdo -> prepare($sql.$str);
               $count=1;
               foreach ($req['param'] as $key => $value) {
                    $stmt -> bindValue($count, $value, PDO::PARAM_INT);
                     $count++;
                }
            }else{
                $stmt = $pdo -> prepare($sql);
            }
            $stmt -> execute(null);
            
            $res[$tablename]=$stmt->fetchAll(PDO::FETCH_CLASS);
        }
            //子データ取得
        $sql = "SELECT * FROM `question`";
        $stmt = $pdo -> prepare($sql);
        $stmt -> execute(null);
        $detail=$stmt->fetchAll(PDO::FETCH_CLASS);
            // var_dump($res[$tablename]);
            //マッチング
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
    }
return $res;
}

function sheetSave($req=null) {

    date_default_timezone_set('Asia/Tokyo');
    $res=array();
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    $tablename="sheet";

    $datetime = date("Y-m-d H:i:s");
    $param=$req['param'];
    $id="";


    $dateTo = DateTime::createFromFormat('Y/m/d',$param['dateTo']);
    $dateTo= $dateTo->format('Y-m-d 23:59:59');



    $sql="INSERT INTO ".$tablename
    ." (id,`group`,title,schoolE,schoolH,gradeE,gradeH,classE,classH,share,package,dateFrom,dateTo)"
    ." VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)"
    ." ON DUPLICATE KEY UPDATE"
    ." `group`= ? ,title= ? ,schoolE= ? ,schoolH= ? ,gradeE= ? ,gradeH= ? ,classE= ? ,classH= ? ,share= ? ,package= ? ,dateFrom= ? ,dateTo= ?;";

    $stmt = $pdo->prepare($sql);
    session_start();

    if($stmt){
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->bindValue(1, $id,                    PDO::PARAM_INT);
        $stmt->bindValue(2, $_SESSION['GROUP'],         PDO::PARAM_INT); 
        $stmt->bindValue(3, $param['title'],       PDO::PARAM_STR);
        $stmt->bindValue(4, $_SESSION['SCHOOLE'],       PDO::PARAM_INT);
        $stmt->bindValue(5, $_SESSION['SCHOOLH'],       PDO::PARAM_INT);
        $stmt->bindValue(6, $_SESSION['GRADEE'],        PDO::PARAM_INT); 
        $stmt->bindValue(7, $_SESSION['GRADEH'],        PDO::PARAM_INT);
        $stmt->bindValue(8, $_SESSION['CLASSE'],        PDO::PARAM_INT); 
        $stmt->bindValue(9, $_SESSION['CLASSH'],        PDO::PARAM_INT);
        $stmt->bindValue(10, $param['share'],       PDO::PARAM_INT);
        $stmt->bindValue(11, $param["package"],        PDO::PARAM_INT); 
        $stmt->bindValue(12, $param["dateFrom"],              PDO::PARAM_STR);
        $stmt->bindValue(13, $dateTo,              PDO::PARAM_STR);


        $stmt->bindValue(14, $_SESSION['GROUP'],         PDO::PARAM_INT); 
        $stmt->bindValue(15, $param['title'],       PDO::PARAM_STR);
        $stmt->bindValue(16, $_SESSION['SCHOOLE'],       PDO::PARAM_INT);
        $stmt->bindValue(17, $_SESSION['SCHOOLH'],       PDO::PARAM_INT);
        $stmt->bindValue(18, $_SESSION['GRADEE'],        PDO::PARAM_INT); 
        $stmt->bindValue(19, $_SESSION['GRADEH'],        PDO::PARAM_INT);
        $stmt->bindValue(20, $_SESSION['CLASSE'],        PDO::PARAM_INT); 
        $stmt->bindValue(21, $_SESSION['CLASSH'],        PDO::PARAM_INT);
        $stmt->bindValue(22, $param['share'],       PDO::PARAM_INT);
        $stmt->bindValue(23, $param["package"],        PDO::PARAM_INT); 
        $stmt->bindValue(24, $param["dateFrom"],              PDO::PARAM_STR);
        $stmt->bindValue(25, $dateTo,              PDO::PARAM_STR);
        
        $stmt->execute();
        return array('result'=>'true');
    }else{

        return array('result'=>'false');
    }



}
