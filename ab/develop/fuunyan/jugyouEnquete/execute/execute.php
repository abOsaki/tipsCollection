<?php

require_once "../common/jugyouEnquete.php";

//選択されたＩＤの取得
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $enqueteID = $_POST['id'];
    //アンケートオブジェクトの取得
    $enquete = jugyouEnquete::getByID($enqueteID);
    //質問TRの取得
    $questionsTRs = $enquete->getQuestionTrs();
    
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
    
    <!-- JavaScript読み込み -->
    <script src="execute.js"></script>
    
    <link rel="stylesheet" href="../../common/css/jquery-ui.min.css">
    <link rel="stylesheet" href="../../common/css/common.css">
    <link rel="stylesheet" href="../common/base.css">
    <link rel="stylesheet" href="execute.css">
    
  </head>
  <body>
      <!-- コンテナー -->
      <div id="container">
          <!-- ヘッダー -->
          <header class="clearfix">
            <div id="header">アンケートの実施</div>
            <div id="img_logout" class="fu_admin_button" onclick="location.href = '../../';" >ログアウト</div>
            <div id="img_menu" class="fu_admin_button" onclick="location.href='../menu';" >メニュー</div>
          </header>
          <!-- コンテンツ -->
          <div id="contents">
              <div class="dummy"></div>
              <?php echo "<input id='enqueteID' type='hidden' value=$enqueteID >" ?>
              <div class="gakunenClassPane">
                  <?php echo $enquete->getTitle(); ?>
              </div>
              <div class="controlPane">
                  <span id="stopWatch">00:00</span>
                  <span>時間</span>
                  <select id="timeSelect">
                      <option value="3">３</option>
                      <option value="5">５</option>
                  </select>
                  <!--<input id="time" type="number" >-->
                  <span>分</span>
                  <button id="startBtn" class="btn-primary">開始</button>
                  <button id="endBtn" class="btn-primary">終了</button>
              </div>
              
              <div class="container">
                  <table class="table table-bordered">
                      <thead>
                          <tr>
                              <th colspan="2">問題</th>
                          </tr>
                      </thead>
                      <tbody>
                          <?php echo $questionsTRs; ?>
<!--                          <tr>
                              <td>1</td>
                              <td>授業の開始時間は守られていますか</td>
                          </tr>-->
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
      
  </body>
</html>