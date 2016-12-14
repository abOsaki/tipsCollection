<?php

require_once "../common/jugyouEnqueteQuestion.php";

//クエッションオブジェクトの取得
$questionObjects = jugyouEnqueteQuestion::create();

//選択された配列
$selectedIDs = array();
//選択されたＩＤの取得
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $quesionChecks = $_POST['questionChk'];
    $dataCount = count($quesionChecks);
    foreach ($quesionChecks as $quesionCheck){
        $id = intval($quesionCheck);
        array_push($selectedIDs,$id);
    }
    //フィルターをかける
    $filtered = array_filter($questionObjects, function($question)use($selectedIDs){
        return in_array($question->getID(),$selectedIDs);
    });
    //フィルターをかけた配列
    $questionObjects = $filtered;
    
    //学年の取得
    $gakunen = $_POST['gakunen'];
    //クラスの取得
    $class = $_POST['class'];
    //カリキュラムの取得
    $curriculumIndex = $_POST['kyouka'];
    $curriculumText = getKyoukaText($curriculumIndex);
}

function getKyoukaText($index){
    if($index == 1){
        return '国語';
    }else if($index == 2){
        return '数学';
    }else if($index == 3){
        return '英語';
    }else if($index == 4){
        return '理科';
    }else if($index == 5){
        return '社会';
    }else if($index == 6){
        return '音楽';
    }else if($index == 7){
        return '美術';
    }else if($index == 8){
        return '技家';
    }else if($index == 9){
        return '保体';
    }else if($index == 10){
        return 'その他';
    }
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
    <link rel="stylesheet" href="./enqueteKakunin.css">
    
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
              <div class="title" >
                  アンケートの確認
              </div>
              <form action="enqueteHozonKakunin.php" method="post">
                  <input type="submit" class="okBtn btn-primary" value="ＯＫ" >
                  
                  <div class="gakunenClassPane">
                      <span>学年：</span>
                      <?php echo "<span class='kakuninText' id='gakunenText'>$gakunen 年</span>"; ?>
                      <?php echo "<input type='hidden' name='gakunen' value=$gakunen >"; ?>
                      <span>　クラス：</span>
                      <?php echo "<span class='kakuninText' id='classText'>$class 組</span>"; ?>
                      <?php echo "<input type='hidden' name='class' value=$class >"; ?>
                      <span>　教科：</span>
                      <?php echo "<span class='kakuninText' id='kyoukaText'>$curriculumText</span>"; ?>
                      <?php echo "<input type='hidden' name='curriculum' value=$curriculumIndex >"; ?>
                  </div>
                  
                  <div class="container">
                      <table class="table table-striped table-bordered">
                          <thead>
                              <tr>
                                  <th colspan="2">この設定で保存しますか？ドラッグして順番を入れ替えることができます</th>
                              </tr>
                          </thead>
                          <tbody id="sortData">
                              <?php
                              echo jugyouEnqueteQuestion::getTrs($questionObjects);
                              ?>
                          </tbody>
                      </table>
                  </div>
              </form>
          </div>
      </div>
  </body>
</html>