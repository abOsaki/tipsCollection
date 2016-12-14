<?php
require_once "dbConnect.php";
require_once "belongCountUpdater.php";

function workbookSave($dataList) {
    $model = new dbConnect();
    $pdo = $model -> connectInfo();
    
    //カラムリスト
    $columnList = array("group", "schoolE", "schoolH", "gradeE", "gradeH", "curriculumE", "curriculumH", "title", "share",
                        "unit",
                        "unitE1Kokugo", "unitE1Math",
                        "unitE2Kokugo", "unitE2Math",
                        "unitE3Kokugo", "unitE3Math", "unitE3Rika", "unitE3Syakai",
                        "unitE4Kokugo", "unitE4Math", "unitE4Rika", "unitE4Syakai",
                        "unitE5Kokugo", "unitE5Math", "unitE5Rika", "unitE5Syakai",
                        "unitE6Kokugo", "unitE6Math", "unitE6Rika", "unitE6Syakai",
                        "unitH1English", "unitH1Kokugo", "unitH1Math", "unitH1Rika", "unitH1ShakaiG", "unitH1ShakaiH",
                        "unitH2English", "unitH2Kokugo", "unitH2Math", "unitH2Rika", "unitH2ShakaiG", "unitH2ShakaiH",
                        "unitH3English", "unitH3Kokugo", "unitH3Math", "unitH3Rika", "unitH3ShakaiC", "unitH3ShakaiH");
    
    session_start();
    $sqlInsert = "INSERT INTO `package`";
    
    $sqlColumn = "`date`, `author`, `contents`";
    $sqlValues = "NOW(), '{$_SESSION["USERID"]}', :contents";
    
    //sql文作成
    foreach($columnList as $key){
        if (isset($dataList[$key])){
            if (isset($sqlColumn)) {
                $sqlColumn .= ", ";
                $sqlValues .= ", ";
            }
            $sqlColumn .= "`{$key}`";
            $sqlValues .= "'{$dataList[$key]}'";
        }
    }
    
    //INSERT INTO テーブル名 (カラム名1[,カラム名2, ... ]) VALUES (値1[,値2, ... ]);
    $sql = "{$sqlInsert} ({$sqlColumn}) VALUES({$sqlValues})";  
    
    //発行
    $stmt = $pdo -> prepare($sql);
    
    //プレースホルダ
    $stmt -> bindValue(':contents', $dataList["contents"], PDO::PARAM_STR);
    
    //実行
    $stmt -> execute(null);
    
    updateBelongCount($pdo, $dataList["contents"], null);
}


//js側からのデータ
$data = file_get_contents("php://input");
//var_dump($data);
$dataArray = json_decode($data, true);

//js側へ
echo json_encode(workbookSave($dataArray));

?>