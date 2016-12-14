<?php
require_once "dbConnect.php";

function questionOpen($id) {
    $model = new dbConnect();
    $pdo = $model -> connectInfo();
    
    //取得リスト
    $selectList = array("group", "schoolE", "schoolH", "gradeE", "gradeH", "curriculumE", "curriculumH");
    //単元リスト
    $unitList = array(
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
        "unitHAllRika"
    );
    
    $sqlFrom = "question";
    $baseInfo = $model -> baseInfoName();
    
    //select,join
    $sqlSelect = "`{$sqlFrom}`.`id`, `title`, `share`, `textContents`, `imageContents`, `audioContents`, `rubyContents`,`fusen`, `textStyle`, `{$baseInfo}`.`users`.`displayName` AS 'author'";
    $sqlJoin = "LEFT JOIN `{$baseInfo}`.`users` ON `{$sqlFrom}`.`author` = `{$baseInfo}`.`users`.`id` ";
    
    foreach($selectList as $value) {
        if (isset($sqlSelect)) {
            $sqlSelect .= ", ";
        }
        $sqlSelect .= "`{$sqlFrom}`.`{$value}`";
    }

    //where
    $sqlWhere = "`{$sqlFrom}`.`id` = '{$id}'";

    foreach($unitList as $value) {
        if (isset($sqlIfNull)) {
            $sqlIfNull .= ", ";
        }
        $sqlIfNull .= "IFNULL (`{$value}`, '')";
    }
    $sqlSelect .= ", CONCAT ({$sqlIfNull}) AS 'unit' ";
    
    $sql = "SELECT {$sqlSelect} FROM {$sqlFrom} {$sqlJoin} WHERE {$sqlWhere}";
    //return $sql;
    
    //発行
    $stmt = $pdo -> prepare($sql);
    $stmt -> execute(null);

    $result = $stmt -> fetch(PDO::FETCH_ASSOC);
    
    return $result;
}

//js側からのデータ
$data = file_get_contents("php://input");
//var_dump($data);
$dataArray = json_decode($data, true);

//js側へ
echo json_encode(questionOpen($dataArray));

?>