<?php

require_once "../common/jugyouEnquete.php";
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    //IDの取得
    $quesions = $_POST['questionChk'];

    //学年の取得
    $gakunen = $_POST['gakunen'];
    //クラスの取得
    $class = $_POST['class'];
    //教科の取得
    $curriculum = $_POST['curriculum'];
    
    $insertID = jugyouEnquete::insert($quesions, $gakunen, $class, $curriculum);
}

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
    <link rel="stylesheet" href="./enqueteHozonKakunin.css">
    
    <!--JavaScript読み込み-->
    <script src="./enqueteKakunin.js"></script>
    
  </head>
  <body>
      <!-- コンテナー -->
      <div id="container">
          <!-- ヘッダー -->
          <header class="clearfix">
            <div id="header">授業アンケートの作成</div>
            <div id="img_logout" class="fu_admin_button" onclick="location.href = '../../';">ログアウト</div>
            <div id="img_menu" class="fu_admin_button" onclick="location.href='../menu';">メニュー</div>
            <!--<div id="img_modoru" class="fu_admin_button">戻る</div>-->
          </header>
          <!-- コンテンツ -->
          <div id="contents">
              <div class="dummy"></div>
              <div class="kakuninTitle text-center" >
                  アンケートを作成しました。
              </div>
              <div class="text-center">
                  <form method="post" action="../execute/execute.php">
                      <input type="submit" id="executeInput" class="btn-primary" value="アンケートの実施">
                      <?php echo "<input type='hidden' name='id' value = $insertID >"  ?>
                  </form>
                  
              </div>
              <div class="text-center">
                  <button class="btn-primary" onclick="location.href = 'createEnquete.php';">作成画面へ戻る</button>
              </div>
          </div>
      </div>
  </body>
</html>