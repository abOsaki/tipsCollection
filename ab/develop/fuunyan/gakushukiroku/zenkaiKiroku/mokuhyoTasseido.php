<?php 
require_once "../../common/php/dbConnect.php";

//セッションからユーザと期間ＩＤを取得する
session_start();
$userID = $_SESSION['userID'];
$periodID = $_SESSION['periodID'];

//データ取得
$model = new dbConnect(MASTER_TABLE);
$pdo = $model -> connectInfo();

//目標の取得メソッド
$periodGoal = getPeriodGoal($pdo,$userID,$periodID);
//科目別目標のメソッド
$curriculumGoal = getCurriculumGoal($pdo,$userID,$periodID);
//科目別計画のメソッド
$keikaku = getKeikaku($pdo,$userID,$periodID);
//科目別実績のメソッド
$jisseki = getJisseki($pdo,$userID,$periodID);

//計画実績%の取得
function getKeikakuJissekiPercent($keikaku,$jisseki,$curriculumID){
    $keikakuTime = getKeikakuTime($keikaku,$curriculumID);
    $jissekiTime = getJissekiTime($jisseki, $curriculumID);
    
    if($keikakuTime){
        $percent = (floatval($jissekiTime) / floatval($keikakuTime)) * 100;
        return intval($percent).'%';
    }else{
        return 0 . '%';
    }
}

//計画時間の取得
function getKeikakuTime($keikaku,$curriculumID){
    $callback = function ($var) use ($curriculumID) {
        return ($var[curriculumID] == $curriculumID);
    };
    //カリキュラムＩＤでのフィルター
    $filterKeikaku = array_filter($keikaku, $callback);
    
    $result = 0;
    foreach ($filterKeikaku as $keikaku){
        $result += intval($keikaku[spendTime]);
    }
    return $result;
}

//計画のセット
function setKeikakuPanel($keikaku,$curriculumID){
    $sum = getKeikakuTime($keikaku,$curriculumID);
    setCommonKeikakuPanel($sum);
}

function setCommonKeikakuPanel($keikakuSpendTime){
    for($i = 0; $i < $keikakuSpendTime; $i++){
        echo '<div class="planYokoGraph" ></div>';
    }
}

function getJissekiTime($jisseki,$curriculumID){
    $callback = function ($var) use ($curriculumID) {
        return ($var[curriculumID] == $curriculumID);
    };
    //カリキュラムＩＤでのフィルター
    $filterKeikaku = array_filter($jisseki, $callback);
    
    $result = 0;
    foreach ($filterKeikaku as $keikaku){
        $result += intval($keikaku[spendTime]);
    }
    return $result;
}

//実績のセット
function setJissekiPanel($jisseki,$curriculumID){
    $sum = getJissekiTime($jisseki,$curriculumID);
    setCommonJissekiPanel($sum);
}

function setCommonJissekiPanel($jissekiSpendTime){
    for($i = 0; $i < $jissekiSpendTime; $i++){
        echo '<div class="logYokoGraph" ></div>';
    }
}

//目標点数のセット
function setMokuhyoPointPanel($curriculumGoal,$curriculumID){
    foreach ($curriculumGoal as $goal){
        if($goal[curriculumID] == $curriculumID){
            setCommonMokuhyoPointPanel($goal[goalPoint]);
        }
    }
}

function setCommonMokuhyoPointPanel($goalPoint){
    //点数を５で割る
    $omomituke = $goalPoint / 5;
    for($i = 0; $i < $omomituke; $i++){
        echo '<div class="planYokoGraph" ></div>';
    }
}

function getMokuhyoPoint($curriculumGoal,$curriculumID){
    foreach ($curriculumGoal as $goal){
        if($goal[curriculumID] == $curriculumID){
            return $goal[goalPoint];
        }
    }
}

function setResultPointPanel($curriculumGoal,$curriculumID){
    foreach ($curriculumGoal as $goal){
        if($goal[curriculumID] == $curriculumID){
            setCommonResultPointPanel($goal[point]);
        }
    }
}

function setCommonResultPointPanel($point){
    //点数を５で割る
    $omomituke = $point / 5;
    for($i = 0; $i < $omomituke; $i++){
        echo '<div class="logYokoGraph" ></div>';
    }
}

function getResultPoint($curriculumGoal,$curriculumID){
    foreach ($curriculumGoal as $goal){
        if($goal[curriculumID] == $curriculumID){
            return $goal[point];
        }
    }
}

function getMokuhyoResultPercent($curriculumGoal,$curriculumID){
    $mokuhyo = getMokuhyoPoint($curriculumGoal,$curriculumID);
    $result = getResultPoint($curriculumGoal,$curriculumID);
    
    if($mokuhyo){
        $percent = (floatval($result) / floatval($mokuhyo)) * 100;
        return intval($percent).'%';
    }else{
        return 0 . '%';
    }
}

function getPeriodGoal($pdo,$userID,$periodID){
    $sql="select * from ".'studyPeriodGoal '
    ." where `userID` = ? and `periodID` = ?";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $userID,       PDO::PARAM_INT);
    $stmt->bindValue(2, $periodID,       PDO::PARAM_INT);
    
    $stmt->execute();
    $result = $stmt->fetchAll();
    
    return $result;
}

function getCurriculumGoal($pdo,$userID,$periodID){
    $sql="select goal.curriculumID, goal.goalPoint , result.point from ".'studyCurriculumGoal goal '
            . 'LEFT JOIN studyCurriculumResult result ON result.userID=goal.userID AND result.periodID=goal.periodID AND result.curriculumID=goal.curriculumID'
            ." where goal.`userID` = ? and goal.`periodID` = ?";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $userID,       PDO::PARAM_INT);
    $stmt->bindValue(2, $periodID,       PDO::PARAM_INT);
    
    $stmt->execute();
    $result = $stmt->fetchAll();
    
    return $result;
}

function getKeikaku($pdo,$userID,$periodID){
    $sql="select * from ".'studyPlan '
    ." where `userID` = ? and `periodID` = ? ";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $userID,       PDO::PARAM_INT);
    $stmt->bindValue(2, $periodID,       PDO::PARAM_INT);
    
    $stmt->execute();
    $result = $stmt->fetchAll();
    return $result;
}

function getJisseki($pdo,$userID,$periodID){
    $sql="select * from ".'studyLog '
    ." where `userID` = ? and `periodID` = ? ";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $userID,       PDO::PARAM_INT);
    $stmt->bindValue(2, $periodID,       PDO::PARAM_INT);
    
    $stmt->execute();
    $result = $stmt->fetchAll();
    return $result;
}

?>

<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html lang="ja">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta charset="utf-8">
        <link rel="stylesheet" href="../../common/css/jquery-ui.min.css">
        
        <!--jquery読み込み-->
        <script src="../../common/js/jquery.min.js"></script>
        <script src="../../common/js/jquery-ui.min.js"></script>
        <script src="../../common/js/datepicker-ja"></script>
        <script src="../../common/js/jqfloat.min.js"></script>

        <!-- BootstrapのCSS読み込み -->
        <link href="../../common/bootstrap-3.3.7-dist/css/bootstrap.min.css" rel="stylesheet">
        <!-- BootstrapのJS読み込み -->
        <script src="../../common/bootstrap-3.3.7-dist/js/bootstrap.min.js"></script>
        
        <!--スタイルシート読み込み-->
        <link rel="stylesheet" href="mokuhyoTasseido.css">
        <!-- JavaScript読み込み -->
        <script src="./mokuhyoTasseido.js"></script>
        <script src="../common/common.js"></script>
        <script src="../common/kamokubetu.js"></script>
        <script src="../common/mokuhyo.js"></script>
        <script src="../common/kamokubetu.js"></script>
        <script src="../../common/js/common.js"></script>
        
        <title>学習記録日別学習内容設定ページ</title>
    </head>
    <body>
        <span id="userName"></span>
        <div>
            <ol class="breadcrumb">
              <li><a href="../menu/">メニュー</a></li>
              <li><a href="index.html">試験結果入力</a></li>
              <li class="active">目標達成度</li>
            </ol>
        </div>
        
        <div class="text-left topKoumoku koumoku"><span class="topTextSize" >今回の目標達成度</span></div>
        
        <!--ボタン-->
        <div class="text-center center-block tabPane">
            <table id="kyoukaHeader" >
                <tr>
                    <td>
                        <button class="kubunBtn btn-primary" id="testBtn" >試験</button>
                    </td>
                    <td>
                        <button class="kubunBtn btn-default" id="gakushuBtn" >学習</button>
                    </td>
                </tr>
            </table>
        </div>
                
        <div class="contentPane" id="testPane">
            <div class="hyoukaPane topTextSize koumokuLeftMargin" id="kokugoPane">
                <!--
                <span class="graphHeader">国語</span>
                <div class="graphPane" >
                    <div class="graphContentPane" id="kokugoPlanPane">
                        <div class="dummy"></div>
                    </div>
                    <div class="graphContentPane" id="kokugoResultPane">
                        <div class="dummy"></div>
                    </div>
                </div>
                -->
<!--                <table>
                    
                </table>-->
                
                <table class="kyoukaTable">
                    <tr>
                        <td colspan="2"></td>
                        <td class="colHeader">点数</td>
                        <td class="colHeader">達成率</td>
                    </tr>
                    <tr>
                        <td class="graphHeaderTD" rowspan="2"><span class="graphHeader">国語</span></td>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div>
                                    <div class="dummy"></div>
                                    <?php setMokuhyoPointPanel($curriculumGoal,1); ?>
                                </div>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getMokuhyoPoint($curriculumGoal,1).'点'; ?>
                        </td>
                        <td class="resultPercent" rowspan="2">
                            <?php echo getMokuhyoResultPercent($curriculumGoal,1); ?>
                        </td>
                    </tr>
                    <tr>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div class="dummy"></div>
                            <?php setResultPointPanel($curriculumGoal,1); ?>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getResultPoint($curriculumGoal,1).'点'; ?>
                        </td>
                    </tr>
                </table>
                
            </div>
            <div class="hyoukaPane topTextSize koumokuLeftMargin" id="suugakuPane">
                <!--
                <span class="graphHeader">数学</span>
                <div class="graphPane" >
                    <div class="graphContentPane" id="suugakuPlanPane">
                        <div class="dummy"></div>
                    </div>
                    <div class="graphContentPane" id="suugakuResultPane">
                        <div class="dummy"></div>
                    </div>
                </div>
                -->
                
                <table class="kyoukaTable">
                    <tr>
                        <td class="graphHeaderTD" rowspan="2"><span class="graphHeader">数学</span></td>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div>
                                    <div class="dummy"></div>
                                    <?php setMokuhyoPointPanel($curriculumGoal,2); ?>
                                </div>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getMokuhyoPoint($curriculumGoal,2).'点'; ?>
                        </td>
                        <td class="resultPercent" rowspan="2">
                            <?php echo getMokuhyoResultPercent($curriculumGoal,2); ?>
                        </td>
                    </tr>
                    <tr>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div class="dummy"></div>
                            <?php setResultPointPanel($curriculumGoal,2); ?>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getResultPoint($curriculumGoal,2).'点'; ?>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="hyoukaPane topTextSize koumokuLeftMargin" id="eigoPane">
                <!--
                <span class="graphHeader">英語</span>
                <div class="graphPane" >
                    <div class="graphContentPane" id="eigoPlanPane">
                        <div class="dummy"></div>
                    </div>
                    <div class="graphContentPane" id="eigoResultPane">
                        <div class="dummy"></div>
                    </div>
                </div>
                -->
                
                <table class="kyoukaTable">
                    <tr>
                        <td class="graphHeaderTD" rowspan="2"><span class="graphHeader">英語</span></td>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div>
                                    <div class="dummy"></div>
                                    <?php setMokuhyoPointPanel($curriculumGoal,3); ?>
                                </div>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getMokuhyoPoint($curriculumGoal,3).'点'; ?>
                        </td>
                        <td class="resultPercent" rowspan="2">
                            <?php echo getMokuhyoResultPercent($curriculumGoal,3); ?>
                        </td>
                    </tr>
                    <tr>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div class="dummy"></div>
                            <?php setResultPointPanel($curriculumGoal,3); ?>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getResultPoint($curriculumGoal,3).'点'; ?>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="hyoukaPane topTextSize koumokuLeftMargin" id="rikaPane">
                
                <!--
                <span class="graphHeader">理科</span>
                <div class="graphPane" >
                    <div class="graphContentPane" id="rikaPlanPane">
                        <div class="dummy"></div>
                    </div>
                    <div class="graphContentPane" id="rikaResultPane">
                        <div class="dummy"></div>
                    </div>
                </div>
                -->
                
                <table class="kyoukaTable">
                    <tr>
                        <td class="graphHeaderTD" rowspan="2"><span class="graphHeader">理科</span></td>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div>
                                    <div class="dummy"></div>
                                    <?php setMokuhyoPointPanel($curriculumGoal,4); ?>
                                </div>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getMokuhyoPoint($curriculumGoal,4).'点'; ?>
                        </td>
                        <td class="resultPercent" rowspan="2">
                            <?php echo getMokuhyoResultPercent($curriculumGoal,4); ?>
                        </td>
                    </tr>
                    <tr>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div class="dummy"></div>
                            <?php setResultPointPanel($curriculumGoal,4); ?>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getResultPoint($curriculumGoal,4).'点'; ?>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="hyoukaPane topTextSize koumokuLeftMargin" id="shakaiPane">
                <!--
                <span class="graphHeader">社会</span>
                <div class="graphPane" >
                    <div class="graphContentPane" id="shakaiPlanPane">
                        <div class="dummy"></div>
                    </div>
                    <div class="graphContentPane" id="shakaiResultPane">
                        <div class="dummy"></div>
                    </div>
                </div>
                -->
                
                <table class="kyoukaTable">
                    <tr>
                        <td class="graphHeaderTD" rowspan="2"><span class="graphHeader">社会</span></td>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div>
                                    <div class="dummy"></div>
                                    <?php setMokuhyoPointPanel($curriculumGoal,5); ?>
                                </div>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getMokuhyoPoint($curriculumGoal,5).'点'; ?>
                        </td>
                        <td class="resultPercent" rowspan="2">
                            <?php echo getMokuhyoResultPercent($curriculumGoal,5); ?>
                        </td>
                    </tr>
                    <tr>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div class="dummy"></div>
                            <?php setResultPointPanel($curriculumGoal,5); ?>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getResultPoint($curriculumGoal,5).'点'; ?>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="hyoukaPane topTextSize koumokuLeftMargin" id="ongakuPane">
                <!--
                <span class="graphHeader">音楽</span>
                <div class="graphPane" >
                    <div class="graphContentPane" id="ongakuPlanPane">
                        <div class="dummy"></div>
                    </div>
                    <div class="graphContentPane" id="ongakuResultPane">
                        <div class="dummy"></div>
                    </div>
                </div>
                -->
                
                <table class="kyoukaTable">
                    <tr>
                        <td class="graphHeaderTD" rowspan="2"><span class="graphHeader">音楽</span></td>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div>
                                    <div class="dummy"></div>
                                    <?php setMokuhyoPointPanel($curriculumGoal,6); ?>
                                </div>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getMokuhyoPoint($curriculumGoal,6).'点'; ?>
                        </td>
                        <td class="resultPercent" rowspan="2">
                            <?php echo getMokuhyoResultPercent($curriculumGoal,6); ?>
                        </td>
                    </tr>
                    <tr>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div class="dummy"></div>
                            <?php setResultPointPanel($curriculumGoal,6); ?>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getResultPoint($curriculumGoal,6).'点'; ?>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="hyoukaPane topTextSize koumokuLeftMargin" id="bijutuPane">
                <!--
                <span class="graphHeader">美術</span>
                <div class="graphPane" >
                    <div class="graphContentPane" id="bijutuPlanPane">
                        <div class="dummy"></div>
                    </div>
                    <div class="graphContentPane" id="bijutuResultPane">
                        <div class="dummy"></div>
                    </div>
                </div>
                -->
                
                <table class="kyoukaTable">
                    <tr>
                        <td class="graphHeaderTD" rowspan="2"><span class="graphHeader">美術</span></td>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div>
                                    <div class="dummy"></div>
                                    <?php setMokuhyoPointPanel($curriculumGoal,7); ?>
                                </div>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getMokuhyoPoint($curriculumGoal,7).'点'; ?>
                        </td>
                        <td class="resultPercent" rowspan="2">
                            <?php echo getMokuhyoResultPercent($curriculumGoal,7); ?>
                        </td>
                    </tr>
                    <tr>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div class="dummy"></div>
                            <?php setResultPointPanel($curriculumGoal,7); ?>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getResultPoint($curriculumGoal,7).'点'; ?>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="hyoukaPane topTextSize koumokuLeftMargin" id="gijutuPane">
                <!--
                <span class="graphHeader">技家</span>
                <div class="graphPane" >
                    <div class="graphContentPane" id="gijutuPlanPane">
                        <div class="dummy"></div>
                    </div>
                    <div class="graphContentPane" id="gijutuResultPane">
                        <div class="dummy"></div>
                    </div>
                </div>
                -->
                
                <table class="kyoukaTable">
                    <tr>
                        <td class="graphHeaderTD" rowspan="2"><span class="graphHeader">技家</span></td>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div>
                                    <div class="dummy"></div>
                                    <?php setMokuhyoPointPanel($curriculumGoal,8); ?>
                                </div>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getMokuhyoPoint($curriculumGoal,8).'点'; ?>
                        </td>
                        <td class="resultPercent" rowspan="2">
                            <?php echo getMokuhyoResultPercent($curriculumGoal,8); ?>
                        </td>
                    </tr>
                    <tr>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div class="dummy"></div>
                            <?php setResultPointPanel($curriculumGoal,8); ?>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getResultPoint($curriculumGoal,8).'点'; ?>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="hyoukaPane topTextSize koumokuLeftMargin" id="hotaiPane">
                <!--
                <span class="graphHeader">保体</span>
                <div class="graphPane" >
                    <div class="graphContentPane" id="hotaiPlanPane">
                        <div class="dummy"></div>
                    </div>
                    <div class="graphContentPane" id="hotaiResultPane">
                        <div class="dummy"></div>
                    </div>
                </div>
                -->
                
                <table class="kyoukaTable">
                    <tr>
                        <td class="graphHeaderTD" rowspan="2"><span class="graphHeader">保体</span></td>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div>
                                    <div class="dummy"></div>
                                    <?php setMokuhyoPointPanel($curriculumGoal,9); ?>
                                </div>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getMokuhyoPoint($curriculumGoal,9).'点'; ?>
                        </td>
                        <td class="resultPercent" rowspan="2">
                            <?php echo getMokuhyoResultPercent($curriculumGoal,9); ?>
                        </td>
                    </tr>
                    <tr>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div class="dummy"></div>
                            <?php setResultPointPanel($curriculumGoal,9); ?>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getResultPoint($curriculumGoal,9).'点'; ?>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        
        <div class="contentPane hidden" id="gakushuPane">
            <div class="hyoukaPane topTextSize koumokuLeftMargin" id="kokugoGakushuPane">
                <!--
                <span class="graphHeader">国語</span>
                <div class="graphPane" >
                    <div class="graphContentPane" id="kokugoKeikakuPane">
                        
                        <div>
                            <div class="dummy"></div>
                        </div>
                    </div>
                    
                    <div class="graphContentPane" id="kokugoJissekiPane">
                        <div class="dummy"></div>
                    </div>
                </div>
                -->
                
                <table class="kyoukaTable">
                    <tr>
                        <td colspan="2"></td>
                        <td class="colHeader">時間</td>
                        <td class="colHeader">達成率</td>
                    </tr>
                    <tr>
                        <td class="graphHeaderTD" rowspan="2"><span class="graphHeader">国語</span></td>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div>
                                    <div class="dummy"></div>
                                    <?php setKeikakuPanel($keikaku,1); ?>
                                </div>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getKeikakuTime($keikaku,1).'時間'; ?>
                        </td>
                        <td class="resultPercent" rowspan="2">
                            <?php echo getKeikakuJissekiPercent($keikaku,$jisseki,1); ?>
                        </td>
                    </tr>
                    <tr>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div class="dummy"></div>
                                <?php setJissekiPanel($jisseki,1); ?>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getJissekiTime($jisseki,1).'時間'; ?>
                        </td>
                    </tr>
                </table>
                
            </div>
            <div class="hyoukaPane topTextSize koumokuLeftMargin" id="suugakuGakushuPane">
<!--                <span class="graphHeader">数学</span>
                <div class="graphPane" >
                    <div class="graphContentPane" id="suugakuKeikakuPane">
                        <div class="dummy"></div>
                    </div>
                    <div class="graphContentPane" id="suugakuJissekiPane">
                        <div class="dummy"></div>
                    </div>
                </div>-->
                <table class="kyoukaTable">
                    <tr>
                        <td class="graphHeaderTD" rowspan="2"><span class="graphHeader">数学</span></td>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div>
                                    <div class="dummy"></div>
                                    <?php setKeikakuPanel($keikaku,2); ?>
                                </div>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getKeikakuTime($keikaku,2).'時間'; ?>
                        </td>
                        <td class="resultPercent" rowspan="2">
                            <?php echo getKeikakuJissekiPercent($keikaku,$jisseki,2); ?>
                        </td>
                    </tr>
                    <tr>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div class="dummy"></div>
                                <?php setJissekiPanel($jisseki,2); ?>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getJissekiTime($jisseki,2).'時間'; ?>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="hyoukaPane topTextSize koumokuLeftMargin" id="eigoGakushuPane">
                <!--
                <span class="graphHeader">英語</span>
                <div class="graphPane" >
                    <div class="graphContentPane" id="eigoKeikakuPane">
                        <div class="dummy"></div>
                    </div>
                    <div class="graphContentPane" id="eigoJissekiPane">
                        <div class="dummy"></div>
                    </div>
                </div>
                -->
                
                <table class="kyoukaTable">
                    <tr>
                        <td class="graphHeaderTD" rowspan="2"><span class="graphHeader">英語</span></td>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div>
                                    <div class="dummy"></div>
                                    <?php setKeikakuPanel($keikaku,3); ?>
                                </div>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getKeikakuTime($keikaku,3).'時間'; ?>
                        </td>
                        <td class="resultPercent" rowspan="2">
                            <?php echo getKeikakuJissekiPercent($keikaku,$jisseki,3); ?>
                        </td>
                    </tr>
                    <tr>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div class="dummy"></div>
                                <?php setJissekiPanel($jisseki,3); ?>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getJissekiTime($jisseki,3).'時間'; ?>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="hyoukaPane topTextSize koumokuLeftMargin" id="rikaGakushuPane">
                <!--
                <span class="graphHeader">理科</span>
                <div class="graphPane" >
                    <div class="graphContentPane" id="rikaKeikakuPane">
                        <div class="dummy"></div>
                    </div>
                    <div class="graphContentPane" id="rikaJissekiPane">
                        <div class="dummy"></div>
                    </div>
                </div>
                -->
                
                <table class="kyoukaTable">
                    <tr>
                        <td class="graphHeaderTD" rowspan="2"><span class="graphHeader">理科</span></td>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div>
                                    <div class="dummy"></div>
                                    <?php setKeikakuPanel($keikaku,4); ?>
                                </div>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getKeikakuTime($keikaku,4).'時間'; ?>
                        </td>
                        <td class="resultPercent" rowspan="2">
                            <?php echo getKeikakuJissekiPercent($keikaku,$jisseki,4); ?>
                        </td>
                    </tr>
                    <tr>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div class="dummy"></div>
                                <?php setJissekiPanel($jisseki,4); ?>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getJissekiTime($jisseki,4).'時間'; ?>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="hyoukaPane topTextSize koumokuLeftMargin" id="shakaiGakushuPane">
                
                <!--
                <span class="graphHeader">社会</span>
                <div class="graphPane" >
                    <div class="graphContentPane" id="shakaiKeikakuPane">
                        <div class="dummy"></div>
                    </div>
                    <div class="graphContentPane" id="shakaiJissekiPane">
                        <div class="dummy"></div>
                    </div>
                </div>
                -->
                
                <table class="kyoukaTable">
                    <tr>
                        <td class="graphHeaderTD" rowspan="2"><span class="graphHeader">社会</span></td>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div>
                                    <div class="dummy"></div>
                                    <?php setKeikakuPanel($keikaku,5); ?>
                                </div>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getKeikakuTime($keikaku,5).'時間'; ?>
                        </td>
                        <td class="resultPercent" rowspan="2">
                            <?php echo getKeikakuJissekiPercent($keikaku,$jisseki,5); ?>
                        </td>
                    </tr>
                    <tr>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div class="dummy"></div>
                                <?php setJissekiPanel($jisseki,5); ?>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getJissekiTime($jisseki,5).'時間'; ?>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="hyoukaPane topTextSize koumokuLeftMargin" id="ongakuGakushuPane">
                <!--
                <span class="graphHeader">音楽</span>
                <div class="graphPane" >
                    <div class="graphContentPane" id="ongakuKeikakuPane">
                        <div class="dummy"></div>
                    </div>
                    <div class="graphContentPane" id="ongakuJissekiPane">
                        <div class="dummy"></div>
                    </div>
                </div>
                -->
                
                <table class="kyoukaTable">
                    <tr>
                        <td class="graphHeaderTD" rowspan="2"><span class="graphHeader">音楽</span></td>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div>
                                    <div class="dummy"></div>
                                    <?php setKeikakuPanel($keikaku,6); ?>
                                </div>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getKeikakuTime($keikaku,6).'時間'; ?>
                        </td>
                        <td class="resultPercent" rowspan="2">
                            <?php echo getKeikakuJissekiPercent($keikaku,$jisseki,6); ?>
                        </td>
                    </tr>
                    <tr>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div class="dummy"></div>
                                <?php setJissekiPanel($jisseki,6); ?>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getJissekiTime($jisseki,6).'時間'; ?>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="hyoukaPane topTextSize koumokuLeftMargin" id="bijutuGakushuPane">
                <!--
                <span class="graphHeader">美術</span>
                <div class="graphPane" >
                    <div class="graphContentPane" id="bijutuKeikakuPane">
                        <div class="dummy"></div>
                    </div>
                    <div class="graphContentPane" id="bijutuJissekiPane">
                        <div class="dummy"></div>
                    </div>
                </div>
                -->
                
                <table class="kyoukaTable">
                    <tr>
                        <td class="graphHeaderTD" rowspan="2"><span class="graphHeader">美術</span></td>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div>
                                    <div class="dummy"></div>
                                    <?php setKeikakuPanel($keikaku,7); ?>
                                </div>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getKeikakuTime($keikaku,7).'時間'; ?>
                        </td>
                        <td class="resultPercent" rowspan="2">
                            <?php echo getKeikakuJissekiPercent($keikaku,$jisseki,7); ?>
                        </td>
                    </tr>
                    <tr>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div class="dummy"></div>
                                <?php setJissekiPanel($jisseki,7); ?>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getJissekiTime($jisseki,7).'時間'; ?>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="hyoukaPane topTextSize koumokuLeftMargin" id="gijutuGakushuPane">
                <!--
                <span class="graphHeader">技家</span>
                <div class="graphPane" >
                    <div class="graphContentPane" id="gijutuKeikakuPane">
                        <div class="dummy"></div>
                    </div>
                    <div class="graphContentPane" id="gijutuJissekiPane">
                        <div class="dummy"></div>
                    </div>
                </div>
                -->
                
                <table class="kyoukaTable">
                    <tr>
                        <td class="graphHeaderTD" rowspan="2"><span class="graphHeader">技家</span></td>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div>
                                    <div class="dummy"></div>
                                    <?php setKeikakuPanel($keikaku,8); ?>
                                </div>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getKeikakuTime($keikaku,8).'時間'; ?>
                        </td>
                        <td class="resultPercent" rowspan="2">
                            <?php echo getKeikakuJissekiPercent($keikaku,$jisseki,8); ?>
                        </td>
                    </tr>
                    <tr>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div class="dummy"></div>
                                <?php setJissekiPanel($jisseki,8); ?>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getJissekiTime($jisseki,8).'時間'; ?>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="hyoukaPane topTextSize koumokuLeftMargin" id="hotaiGakushuPane">
                <!--
                <span class="graphHeader">保体</span>
                <div class="graphPane" >
                    <div class="graphContentPane" id="hotaiKeikakuPane">
                        <div class="dummy"></div>
                    </div>
                    <div class="graphContentPane" id="hotaiJissekiPane">
                        <div class="dummy"></div>
                    </div>
                </div>
                -->
                
                <table class="kyoukaTable">
                    <tr>
                        <td class="graphHeaderTD" rowspan="2"><span class="graphHeader">保体</span></td>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div>
                                    <div class="dummy"></div>
                                    <?php setKeikakuPanel($keikaku,9); ?>
                                </div>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getKeikakuTime($keikaku,9).'時間'; ?>
                        </td>
                        <td class="resultPercent" rowspan="2">
                            <?php echo getKeikakuJissekiPercent($keikaku,$jisseki,9); ?>
                        </td>
                    </tr>
                    <tr>
                        <td class="graphContentArea">
                            <div class="graphContentPane" >
                                <div class="dummy"></div>
                                <?php setJissekiPanel($jisseki,9); ?>
                            </div>
                        </td>
                        <td class="score">
                            <?php echo getJissekiTime($jisseki,9).'時間'; ?>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        
        <div class="text-center topKoumoku koumoku">
            <img id="stampImg" src="../../common/images/cat2.png" alt="stamp.img">
        </div>

        <div class="row text-center koumoku">
            <button type="button" class="btn btn-primary okBtn" id="okBtn">メニュー</button>
        </div>
    </body>
</html>
