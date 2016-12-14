<?php

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
    <link rel="stylesheet" href="./complete.css">

    <!--JavaScript読み込み-->
    <script src="../../common/js/smartRollover.js"></script>
    <script src="../../common/js/common.js"></script>
    <!--<script src="./script.js"></script>-->

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
                    <button class="btn btn-primary" id="endBtn" onclick="location.href = '../../menu_s'">終了</button>
                    <div class="questionPane">
                        <div class="completeTitle">アンケートが送信されました。</div>
                        <div id="box5">
                        </div>
<!--                        <div id="box7">
                            <p class="speech"></p>
                        </div>-->
                    </div>
                </section>
                <!--content-->
            </div>
        </div>
    </div>
</body>

</html>