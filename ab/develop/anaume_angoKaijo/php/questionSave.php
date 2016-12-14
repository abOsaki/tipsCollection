<?php
require_once "dbConnect.php";


//項目をすべて取得
function insertData($dataList) {
    $model = new dbConnect();
    $pdo = $model -> connectInfo();

    var_dump($dataList);
    
    //カラムリスト
    $columnList = array("group", "schoolE", "schoolH", "gradeE", "gradeH", "curriculumE", "curriculumH", 
                        "title", "textContents", "imageContents", "audioContents","rubyContents", "fusen", "textStyle", "belongCount", "share",
                        "unit",
                        "unitE1Kokugo", "unitE1Math",
                        "unitE2Kokugo", "unitE2Math",
                        "unitE3Kokugo", "unitE3Math", "unitE3Rika", "unitE3Syakai",
                        "unitE4Kokugo", "unitE4Math", "unitE4Rika", "unitE4Syakai",
                        "unitE5Kokugo", "unitE5Math", "unitE5Rika", "unitE5Syakai",
                        "unitE6Kokugo", "unitE6Math", "unitE6Rika", "unitE6Syakai",
                        "unitH1English", "unitH1Kokugo", "unitH1Math", "unitH1Rika", "unitH1ShakaiG", "unitH1ShakaiH",
                        "unitH2English", "unitH2Kokugo", "unitH2Math", "unitH2Rika", "unitH2ShakaiG", "unitH2ShakaiH",
                        "unitH3English", "unitH3Kokugo", "unitH3Math", "unitH3Rika", "unitH3ShakaiC", "unitH3ShakaiH",
                        "unitHAllRika");
    
    session_start();
    
    $sqlInsert = "INSERT INTO `question`";
    
    $sqlColumn = "`date`, `author`";
    $sqlValues = "NOW(), '{$_SESSION["USERID"]}'";
    
    //sql文作成
    //カラムリストのキーで
    foreach($columnList as $key){
        //パラメタのデータリストのキーに設定されているものがあり
        if (isset($dataList[$key])){
            //sqlColumnがセットされていれば
            if (isset($sqlColumn)) {
                $sqlColumn .= ", ";
                $sqlValues .= ", ";
            }
            //テキストコンテンツかイメージコンテンツの場合はプラス付箋コンテンツ
            //if ($key == "textContents" || $key == "imageContents" ||  $key == "fusenContents") {
            if ($key == "textContents" || $key == "imageContents" || $key == "audioContents" || $key == "rubyContents" || $key == "fusen") {
                $sqlColumn .= "`{$key}`";
                $sqlValues .= ":{$key}";
            } else {
                $sqlColumn .= "`{$key}`";
                $sqlValues .= "'{$dataList[$key]}'";
            }
        }
    }
    
    $sql = "{$sqlInsert} ({$sqlColumn}) VALUES({$sqlValues})";
    //return $sql;
    
    //発行
    $stmt = $pdo -> prepare($sql);
    
    //プレースホルダ
    $stmt -> bindValue(':textContents', $dataList["textContents"], PDO::PARAM_STR);
    $stmt -> bindValue(':imageContents', $dataList["imageContents"], PDO::PARAM_STR);
    $stmt -> bindValue(':audioContents', $dataList["audioContents"], PDO::PARAM_STR);
    $stmt -> bindValue(':rubyContents', $dataList["rubyContents"], PDO::PARAM_STR);
    $stmt -> bindValue(':fusen', $dataList["fusen"], PDO::PARAM_STR);
    
    //var_dump($sql); die;
    
    //実行
    $stmt -> execute(null);
    
    /*
    $array = array();
    while($result = $stmt -> fetch(PDO::FETCH_ASSOC)) {
        $array[] = json_encode($result);
    }
    $data = $array;
    */
    //var_dump($data);
    
    //return $data;
}

//js側からのデータ
$data = file_get_contents("php://input");
//var_dump($data);
$dataArray = json_decode($data, true);
//元
echo insertData($dataArray);

//js側へ
//echo json_encode(insertData($dataArray));

?>