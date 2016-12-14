<?php

require_once "../common/jugyouEnqueteQuestion.php";

//クエッションオブジェクトの取得
$questionObjects = jugyouEnqueteQuestion::create();


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

?>

<!DOCTYPE html>
<html ng-app lang="ja">
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta charset="utf-8" />
    <!--angularJS-->
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.4/angular.min.js"></script>
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
    <link rel="stylesheet" href="./index.css">
    
    <!--JavaScript読み込み-->
    <script src="./index.js"></script>
    
  </head>
  <body>
      <!-- コンテナー -->
      <div id="container">
          <!-- ヘッダー -->
          <header class="clearfix">
            <div id="header">授業アンケートの作成</div>
            <div id="img_logout" class="fu_admin_button" onclick="location.href = '../../';">ログアウト</div>
            <div id="img_menu" class="fu_admin_button" onclick="location.href='../menu';">メニュー</div>
          </header>
          <!-- コンテンツ -->
          <div id="contents">
              <div class="dummy"></div>
              <div class="title">
                  設問の新規作成
              </div>
              <form name="addQuestionForm" novalidate>
                  <div class="addQuestionPane">
                      <input type="text" name="question" ng-model="question" ng-required="true" id="insertQuestion">
                      <select id="selectNumberSelect">
                          <option value="5">５択</option>
                          <option value="3">３択</option>
                      </select>
                      <button class="btn-primary btnBase" id="addBtn">追加する</button>
                  </div>
                  <div class="validationPane" ng-show="addQuestionForm.question.$error.required">質問が入力されていません</div>
              </form>
              
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
              <div class="nextButtonPane">
                  <button class="btn-primary btnBase" onclick="location.href = '../menu/';">終了</button>
              </div>
          </div>
      </div>
      
  </body>
</html>