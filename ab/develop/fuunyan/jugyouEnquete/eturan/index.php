<?php

require_once "../common/jugyouEnquete.php";
//ユーザＩＤからアンケートの一覧を取得する（共有になっているものと自分で作成したもの）
$enquetes = jugyouEnquete::createForTeacher();

$enqueteTrs = jugyouEnquete::getTrs($enquetes);

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
    <link rel="stylesheet" href="./index.css">
    
    <!--JavaScript読み込み-->
    <script src="../../common/js/smartRollover.js"></script>
    <!--<script src="../../common/js/common.js"></script>-->
    <script src="index.js"></script>
    
    
    <title>シートの閲覧／クラス担任用</title>
  </head>
  <body>
    <!-- コンテナー -->
    <div id="container">
      <!-- ヘッダー -->
      <header class="clearfix">
        <div id="header">アンケート一覧</div>
        <div id="img_logout" class="fu_admin_button" onclick="location.href = '../../';" >ログアウト</div>
        <div id="img_menu" class="fu_admin_button" onclick="location.href='../menu';" >メニュー</div>
      </header>
      <!-- コンテンツ -->
      <div id="contents">
        <!-- 基本情報 -->
        <!-- 基本情報 -->
        <div id="basicInfo">
          <div>
            種別
            <select class="group" id="group"></select>　学年
            <select class="grade" id="grade"></select>
<!--            タイトル
            <input type="text" class="title" id="title" />-->
            <span id="author"></span>
          </div>
          <div id="btnImg">
            <!-- <div id="img_edit" class="fu_admin_button">編集</div> -->
            <div id="img_search" class="fu_admin_button">検索</div>
          </div>
        </div>
        <div id="questionBox">
          <div id="kakuninBox">
            <div id="table01">
              <div class="tableHeader">
                <table id="reportListTable">
                  <thead>
                    <tr>
                      <th class="shubetu">種別</th>
                      <th class="school">学校名</th>
                      <th class="grade">学年</th>
                      <th class="class">クラス</th>
                      <th class="curriculum">教科</th>
                      <th class="execute">閲覧</th>
                    </tr>
                  </thead>
                    <tbody id="educationListBody">
                        <?php echo $enqueteTrs; ?>
                    </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- モーダルコンテンツ -->
    <div id="alertModal" class="modal-content">
      <div id="alertText"></div>
      <img src="../common/images/b_cancel_off.png" class="modal-close" alt="OK" title="OK" />
    </div>
    <div id="dateSearch" style="display:none;text-align:center;" title="日付を決めてください">
      <div>いつから：&nbsp;
        <input type="text" class="dateFrom">
      </div>
      <div>いつまで：&nbsp;
        <input type="text" class="dateTo">
      </div>
    </div>
  </body>
</html>
