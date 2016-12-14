<?php

require_once "../common/jugyouEnqueteQuestion.php";

//クエッションオブジェクトの取得
$questionObjects = jugyouEnqueteQuestion::create();

$userID = (int)$_SESSION['USERID'];
$group= (int)$_SESSION["GROUP"];
$school = 0;
$grade = 0;
$class = 0;
if($group == 1){
    $school = (int)$_SESSION["SCHOOLE"];
    $grade = (int)$_SESSION["GRADEE"];
    $class = (int)$_SESSION["CLASSE"];
}else if($group == 2){
    $school = (int)$_SESSION["SCHOOLH"];
    $grade = (int)$_SESSION["GRADEH"];
    $class = (int)$_SESSION["CLASSH"];
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
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta charset="utf-8" />
    
    <!--jquery読み込み-->
    <script src="../../common/js/jquery.min.js"></script>
    <script src="../../common/js/jquery-ui.min.js"></script>
    <script src="../../common/js/datepicker-ja"></script>
    <script src="../../common/js/jqfloat.min.js"></script>
    <script src="../../common/js/dataformat.js"></script>
    
    <!-- BootstrapのCSS読み込み -->
    <link href="../../common/bootstrap-3.3.7-dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- BootstrapのJS読み込み -->
    <script src="../../common/bootstrap-3.3.7-dist/js/bootstrap.min.js"></script>
    
    <link rel="stylesheet" href="../../common/css/jquery-ui.min.css">
    <link rel="stylesheet" href="../../common/css/common.css">
    <link rel="stylesheet" href="../common/base.css">
    <link rel="stylesheet" href="createEnquete.css">
    
    <link href="https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css" rel="stylesheet">
    <script src="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js"></script>
    
    <!--JavaScript読み込み-->
    <script src="./createEnquete.js"></script>
    
  </head>
  <body>
      <!-- コンテナー -->
      <div id="container">
          <!-- ヘッダー -->
          <header class="clearfix">
            <div id="header">授業アンケートの作成</div>
            <div id="img_logout" class="fu_admin_button" onclick="location.href = '../../';">ログアウト</div>
            <div id="img_menu" class="fu_admin_button" onclick="location.href='../menu';" >メニュー</div>
            <!--<div id="img_modoru" class="fu_admin_button">戻る</div>-->
          </header>
          <!-- コンテンツ -->
          <div id="contents">
              <div class="dummy"></div>
              <div class="title" >
                  アンケートの作成
              </div>
              <form action="enqueteKakunin.php" method="post">
                  
                  <?php echo "<input type='hidden' id='gakunen' value='$grade'>" ; ?>
                  <?php echo "<input type='hidden' id='class' value='$class'>" ; ?>
                  <input type="submit" class="okBtn btn-primary" value="ＯＫ" >
                  <!--
                  <div class="buttonPane">
                      <select name="curriculum" id="kyoukaSelect">
                          <option value="1">国語</option>
                          <option value="2">数学</option>
                      </select>
                      <input type="submit" class="btn-primary btnBase" value="確認">
                      <button class="btn-primary btnBase">リセット</button>
                  </div>
                  -->
                  <div class="gakunenClassPane">
                      <span>学年：</span>
                      <select name="gakunen" id="gakunenSelect">
                          <option value="1">１年</option>
                          <option value="2">２年</option>
                          <option value="3">３年</option>
                          <option value="4">４年</option>
                          <option value="5">５年</option>
                          <option value="6">６年</option>
                      </select>
                      <span>　クラス：</span>
                      <select name="class" id="classSelect">
                          <option value="1">１組</option>
                          <option value="2">２組</option>
                          <option value="3">３組</option>
                          <option value="4">４組</option>
                      </select>
                      <span>　教科：</span>
                      <select name="kyouka" id="kyoukaSelect">
                          <option value="1">国語</option>
                          <option value="2">数学</option>
                          <option value="3">英語</option>
                          <option value="4">理科</option>
                          <option value="5">社会</option>
                          <option value="6">音楽</option>
                          <option value="7">美術</option>
                          <option value="8">技家</option>
                          <option value="9">保体</option>
                          <option value="10">その他</option>
                      </select>
                  </div>
<!--                  <div class="kyoukaPane">
                      <input name="kyouka" class="kyoukaKubun" type="radio" checked="checked" value="1">
                      　国語　
                      <input name="kyouka" class="kyoukaKubun" type="radio" value="2">
                      　数学　
                      <input name="kyouka" class="kyoukaKubun" type="radio" value="3">
                      　英語　
                      <input name="kyouka" class="kyoukaKubun" type="radio" value="4">
                      　理科　
                      <input name="kyouka" class="kyoukaKubun" type="radio" value="5">
                      　社会　
                  </div>-->
                  <div class="container">
                      <table class="table table-striped table-bordered">
                          <thead>
                              <tr>
                                  <th colspan="2">設問リスト</th>
                              </tr>
                          </thead>
                          <tbody id="questionTBody">
                              <?php
                              echo jugyouEnqueteQuestion::getTrs($questionObjects);
                              ?>
                          </tbody>
                      </table>
                  </div>
                  
              </form>
              <div class="questionInsertPane">
                  <span>新規追加 </span>
                  <input id="questionInsert" type="text" >
                  <button id="addBtn" class="questionAddBtn btn-primary">追加</button>

              </div>
              
          </div>
      </div>
      
  </body>
</html>