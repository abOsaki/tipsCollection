<?php

require_once "../common/jugyouEnquete.php";

//セッションが生きているか？
//生きていればhiddenにセット
session_start();

if($_SESSION['USERID']){
    $userID = $_SESSION['USERID'];
    
    //ｉｎｆｏのセット
    $group= (int)$_SESSION["GROUP"];
    $school = 0;
    $grade = 0;
    $class = 0;
    if($group == 1){
        $school = $_SESSION["SCHOOLE"];
        $grade = $_SESSION["GRADEE"];
        $class = $_SESSION["CLASSE"];
    }else if($group == 2){
        $school = $_SESSION["SCHOOLH"];
        $grade = $_SESSION["GRADEH"];
        $class = $_SESSION["CLASSH"];
    }
    $info = $grade.'年'.$class.'組'.$_SESSION["NUMBER"].'番さん';
    
    //アンケートの取得
    $enquete = jugyouEnquete::create();
    $enqueteID = $enquete->getID();
    
}

if(!$enqueteID){
    $enqueteID = 0;
}

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

?>

<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="utf-8">
    <meta name="Keywords" content="">
    <meta name="Description" content="">
    <title>みまもりふぅーにゃん│入力</title>

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
    
    <link rel="stylesheet" href="../../common/css/common.css">
    <link rel="stylesheet" href="./style.css">

    <!--JavaScript読み込み-->
    <script src="../../common/js/smartRollover.js"></script>
    <script src="../../common/js/common.js"></script>
    <script src="./script.js"></script>

    <!-- [if lt IE 9]>
  	<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif] -->
</head>

<body id="student">
    <div id="container">
        <div class="container_input">
            <div class="content_inner">
                <section id="content">
                    <img id="baseImg" src="../../common/images/binder.png">
                    <?php echo "<div class='info' id='info'>$info</div>"  ?>
                    <div class="questionPane">
                        <?php echo $enquete->getQuestionPane(); ?>
                        <div id='kakuninPane'>
                            <div class="text-right">
                                <button class="btn-warning" id='sendBtn'>送信</button>
                            </div>
                            <div class="container">
                                <table class="table table-striped table-bordered kakuninTable">
                                    <thead>
                                        <tr>
                                            <th colspan="3">この内容で送信しますか？</th>
                                        </tr>
                                    </thead>
                                    <tbody id='questionKakuninTBody'>
                                        
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
                <!--content-->
            </div>
        </div>
    </div>
    <?php echo "<input type='hidden' id='userID' value=$userID >" ?>
    <?php echo "<input type='hidden' id='enqueteID' value=$enqueteID >" ?>

</body>

</html>