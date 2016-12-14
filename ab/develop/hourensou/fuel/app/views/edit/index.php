<!DOCTYPE html>
<html lang="ja">

<head>
<meta charset="UTF-8">
<?php echo Asset::css('bootstrap.min.css'); ?>
<?php echo Asset::css('style.css'); ?>
<?php echo Asset::css('main.css'); ?>
<?php echo Asset::css('loader.css'); ?>

<!-- jquery読み込み -->
<?php  echo Asset::js('jquery/jquery.min.js'); ?>
<?php  echo Asset::js('jquery/jquery.cookie.js'); ?>
<?php  echo Asset::js('modalContents.js'); ?>
<?php  echo Asset::js('smartRollover.js'); ?>

<!-- JavaScript読み込み -->
<?php  echo Asset::js('bootstrap.min.js'); ?>
<?php  echo Asset::js('appcommon.js'); ?>
<?php  echo Asset::js('item.js'); ?>
<?php  echo Asset::js('inputWorkShift.js'); ?>
<?php  echo Asset::js('baseInfo.js'); ?>
<?php  echo Asset::js('tabChange.js'); ?>
<?php  echo Asset::js('spanChange.js'); ?>
<?php  echo Asset::js('reportItem.js'); ?>
<?php  echo Asset::js('edit.js'); ?>
<?php  echo Asset::js('editReportSend.js'); ?>
<?php  echo Asset::js('editDemandList.js'); ?>
<?php  echo Asset::js('editReportList.js'); ?>
<?php  echo Asset::js('reMakeSelect.js'); ?>
<?php  echo Asset::js('selectLimit.js'); ?>
<?php  echo Asset::js('selectDisable.js'); ?>
<?php  echo Asset::js('loader.js'); ?>
<?php  echo Asset::js('logout.js'); ?>
<?php  echo Asset::js('workShift.js'); ?>

<title>ほうれんそう名人</title>
</head>

<body>
<!-- コンテナー -->
<div id="container">
<!-- ヘッダー -->
<div id="header">
<a href="../" title="トップ画面へ移動"><?php echo Asset::img('hourensou.png', array('id' => 'headerImg1', 'alt' => 'ほうれんそう名人')); ?></a>
<div id="headerInfo">
<div id=loginInfo>
<div id="userName">名前</div>
</div>
<select id="yearDate">
<?php for ($i = $startYear; $i <= $endYear; $i++) { ?>
<option value="<?= $i ?>"><?= $i ?></option>
<?php } ?>
<?php /*
<option value="2015">2015</option>
<option value="2016">2016</option>
<option value="2017">2017</option>
<option value="2018">2018</option>
*/ ?>
</select>年
<select id="monthDate">
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
<option value="6">6</option>
<option value="7">7</option>
<option value="8">8</option>
<option value="9">9</option>
<option value="10">10</option>
<option value="11">11</option>
<option value="12">12</option>
</select>月
<select id="dayDate">
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
<option value="6">6</option>
<option value="7">7</option>
<option value="8">8</option>
<option value="9">9</option>
<option value="10">10</option>
<option value="11">11</option>
<option value="12">12</option>
<option value="13">13</option>
<option value="14">14</option>
<option value="15">15</option>
<option value="16">16</option>
<option value="17">17</option>
<option value="18">18</option>
<option value="19">19</option>
<option value="20">20</option>
<option value="21">21</option>
<option value="22">22</option>
<option value="23">23</option>
<option value="24">24</option>
<option value="25">25</option>
<option value="26">26</option>
<option value="27">27</option>
<option value="28">28</option>
<option value="29">29</option>
<option value="30">30</option>
<option value="31">31</option>
</select>日
<select id="schoolType" name="group">
<option value="0">【学校種別】</option>
</select>
<select name="school">
<option value="">【学校名】</option>
</select>
</div>
<?php /*
<a href="../" title="トップ画面へ移動"><?php echo Asset::img('flyingcrimson.png', array('id' => 'headerImg2', 'alt' => 'ほうれんそう名人')); ?></a>
*/ ?>
<?php /*
<div id="headImg">
<?php echo Asset::img('modoru_s_off.png', array('alt' => '戻る', 'title' => '戻る', 'onclick' => 'history.back()')); ?>
<?php echo Asset::img('logout_off.png', array('alt' => 'ログアウト', 'title' => 'ログアウト', 'onclick' => 'logout("edit")')); ?>
</div>
*/ ?>
<button class="btn btn-default" style="position: absolute; top: 10px; left: 1250px;" onclick='logout("report");'>ログアウト</button>
</div>

<!-- コンテンツ -->
<div id="contents">
<!-- 業務報告メニュータブ -->
<ul class="nav nav-tabs">
<li class="active" id="tabtype3">
<a href="#inputWorkShiftView" data-toggle="tab" id="inputWorkShift">シフト入力</a>
</li>
<li id="tabtype1">
<a href="#inputReportView" data-toggle="tab" id="inputReport">業務報告</a>
</li>
<li id="tabtype1">
<a href="#ictReportView" data-toggle="tab" id="ictReport">ICT活用授業報告</a>
</li>
<li id="tabtype1">
<a href="#demandReportView" data-toggle="tab" id="demandReport">要望・トラブル等報告</a>
</li>
<li id="tabtype2">
<a href="#reportListView" data-toggle="tab" id="reportList">業務報告一覧</a>
</li>
<li id="tabtype2">
<a href="#ictListView" data-toggle="tab" id="ictList">ICT活用授業報告一覧</a>
</li>
<li id="tabtype2">
<a href="#demandListView" data-toggle="tab" id="demandList">要望・トラブル等報告一覧</a>
  </li>
</ul>

<button type="button" class="btn btn-default" id="frmSubmitButton" onclick="frmSubmit()">送信</button>
<button type="button" class="btn btn-primary btn-xs" id="prevMonthButton" style="display: none;" onclick="editSpanChange(-1)">前月&lt;&lt;&lt;</button>
<p id="dispYear" style="display: none;"></p>
<p id="dispMonth" style="display: none;"></p>
<button type="button" class="btn btn-primary btn-xs" id="nextMonthButton" style="display: none;" onclick="editSpanChange(1)">次月&gt;&gt;&gt;</button>

<div id="menuTab">
</div>

<!-- 入力画面領域 -->
<div id="reportView" class="tab-content">

<!--シフト入力-->
<div id="inputWorkShiftView" class="reportContent tab-pane active">
<div class="tableHeader" style="height: 44px">
<table>
<colgroup>
<col class="dateCol" style="width: 126px;" />
<col class="areaCol" style="width: 78px;" />
<col class="schooltypeCol" style="width: 70px;" />
<col class="schoolCol" style="width: 125px;" />
<col class="areaCol" style="width: 78px;" />
<col class="schooltypeCol" style="width: 70px;" />
<col class="schoolCol" style="width: 125px;" />
<col class="areaCol" style="width: 78px;" />
<col class="schooltypeCol" style="width: 70px;" />
<col class="schoolCol" style="width: 125px;" />
<col style="width: 80px;" />
</colgroup>
<thead>
<tr>
<th rowspan="2">日付</th>
<th colspan="3">終日</th>
<th colspan="3" style="background: #A9D0F5;">AM</th>
<th colspan="3">PM</th>
<th rowspan="2"></th>
</tr>
<tr>
<th>地区</th>
<th>学校種別</th>
<th>学校名</th>
<th style="background: #A9D0F5;">地区</th>
<th style="background: #A9D0F5;">学校種別</th>
<th style="background: #A9D0F5;">学校名</th>
<th>地区</th>
<th>学校種別</th>
<th>学校名</th>
</tr>
</thead>
</table>
</div>
<div class="tableBody" style="height: 463px;">
<table>
<colgroup>
<col class="dateCol" style="width: 126px;" />
<col class="areaCol" style="width: 78px;" />
<col class="schooltypeCol" style="width: 70px;" />
<col class="schoolCol" style="width: 125px;" />
<col class="areaCol" style="width: 78px;" />
<col class="schooltypeCol" style="width: 70px;" />
<col class="schoolCol" style="width: 125px;" />
<col class="areaCol" style="width: 78px;" />
<col class="schooltypeCol" style="width: 70px;" />
<col class="schoolCol" style="width: 125px;" />
<col style="width: 80px;" />
</colgroup>
<tbody id="inputWorkShiftBody">
</tbody>
</table>
<table style="left: 1055px; top: 5px; position: absolute;">
<colgroup>
<col style="width: 20px; "/>
<col class="areaCol" style="width: 60px;" />
<col class="schoolCol" style="width: 120px;" />
<col style="width: 35px;" />
</colgroup>
<thead>
<tr>
<th>No.</th>
<th>地区</th>
<th>学校名</th>
<th>日数</th>
</tr>
</thead>
<tbody id="schoolCountBody">
</tbody>
</table>
</div>
</div>

<!-- 業務報告入力画面 -->
<div id="inputReportView" class="reportContent tab-pane">
<table>
<colgroup>
<col class="timetableCol" />
<col class="locationCol" />
<col class="businessCol" />
<col class="itemCol" />
<col class="gradeCol" />
<col class="classCol" />
<col class="curriculumCol" />
<col class="unitCol" />
</colgroup>
<thead>
<tr id="reportHeader">
<th>時間割</th>
<th>場所</th>
<th>業務</th>
<th>項目</th>
<th>学年</th>
<th>クラス</th>
<th>教科</th>
<th>単元</th>
</tr>
</thead>
<tbody id="reportBody">
</tbody>
</table>
</div>

<!-- ICT活用授業報告入力画面 -->
<div id="ictReportView" class="reportContent tab-pane">
<div class="tableHeader">
<table>
<colgroup>
<col class="timetableCol" />
<col class="locationCol" />
<col class="suportCol" />
<col class="lessonCol" />
<col class="gradeCol" />
<col class="classCol" />
<col class="curriculumCol" />
<col class="unitCol" />
<col class="purposeCol" />
<col class="equipmentCol" />
<col class="appliCol" />
<col class="scrollCol" />
</colgroup>
<thead>
<tr>
<th>時間割</th>
<th>場所</th>
<th>支援有無</th>
<th>授業支援</th>
<th>学年</th>
<th>クラス</th>
<th>教科</th>
<th>単元</th>
<th>目的</th>
<th>機器</th>
<th>アプリ</th>
<th></th>
</tr>
</thead>
</table>
</div>
<div class="tableBody">
<table>
<colgroup>
<col class="timetableCol" />
<col class="locationCol" />
<col class="suportCol" />
<col class="lessonCol" />
<col class="gradeCol" />
<col class="classCol" />
<col class="curriculumCol" />
<col class="unitCol" />
<col class="purposeCol" />
<col class="equipmentCol" />
<col class="appliCol" />
<col class="scrollCol" />
</colgroup>
<tbody id="ictBody">
</tbody>
</table>
</div>
</div>

<!-- 要望・トラブル等報告入力画面 -->
<div id="demandReportView" class="reportContent tab-pane">
<div class="tableHeader">
<table>
<colgroup>
<col class="titleCol" />
<col class="troubleCol" />
<col class="equipmentCol" />
<col class="appliCol" />
<col class="statusCol" />
<col class="souceCol" />
<col class="memoCol" />
<col class="scrollCol" />
</colgroup>
<thead>
<tr>
<th>タイトル</th>
<th>トラブル</th>
<th>ICT機器等</th>
<th>アプリ等</th>
<th>状況</th>
<th>情報元</th>
<th>メモ</th>
<th></th>
</tr>
</thead>
</table>
</div>
<div class="tableBody">
<table>
<colgroup>
<col class="titleCol" />
<col class="troubleCol" />
<col class="equipmentCol" />
<col class="appliCol" />
<col class="statusCol" />
<col class="souceCol" />
<col class="memoCol" />
<col class="scrollCol" />
</colgroup>
<tbody id="demandBody">
</tbody>
</table>
</div>
</div>

<!-- 業務報告一覧View領域 -->
<div id="reportListView" class="reportContent tab-pane">
<div class="tableHeader">
<table id="reportListTable">
<colgroup>
<col class="dateCol" />
<col class="schoolCol" />
<col class="timetableCol" />
<col class="locationCol" />
<col class="businessCol" />
<col class="itemCol" />
<col class="gradeCol" />
<col class="classCol" />
<col class="curriculumCol" />
<col class="unitCol" />
<col class="scrollCol" />
</colgroup>
<thead>
<tr>
<th>日付</th>
<th>学校</th>
<th>時間割</th>
<th>場所</th>
<th>業務</th>
<th>項目</th>
<th>学年</th>
<th>クラス</th>
<th>教科</th>
<th>単元</th>
<th></th>
</tr>
</thead>
</table>
</div>
<div class="tableBody">
<table>
<colgroup>
<col class="dateCol" />
<col class="schoolCol" />
<col class="timetableCol" />
<col class="locationCol" />
<col class="businessCol" />
<col class="itemCol" />
<col class="gradeCol" />
<col class="classCol" />
<col class="curriculumCol" />
<col class="unitCol" />
<col class="scrollCol" />
</colgroup>
<tbody id="reportListBody">
</tbody>
</table>
</div>
</div>

<!-- ICT活用授業報告View領域 -->
<div id="ictListView" class="reportContent tab-pane">
<div class="tableHeader">
<table>
<colgroup>
<col class="dateCol" />
<col class="schoolCol" />
<col class="timetableCol" />
<col class="locationCol" />
<col class="suportCol" />
<col class="lessonCol" />
<col class="gradeCol" />
<col class="classCol" />
<col class="curriculumCol" />
<col class="unitCol" />
<col class="purposeCol" />
<col class="equipmentCol" />
<col class="appliCol" />
<col class="scrollCol" />
</colgroup>
<thead>
<tr>
<th>日付</th>
<th>学校</th>
<th>時間割</th>
<th>場所</th>
<th>支援有無</th>
<th>授業支援</th>
<th>学年</th>
<th>クラス</th>
<th>教科</th>
<th>単元</th>
<th>目的</th>
<th>機器</th>
<th>アプリ</th>
<th></th>
</tr>
</thead>
</table>
</div>
<div class="tableBody">
<table>
<colgroup>
<col class="dateCol" />
<col class="schoolCol" />
<col class="timetableCol" />
<col class="locationCol" />
<col class="suportCol" />
<col class="lessonCol" />
<col class="gradeCol" />
<col class="classCol" />
<col class="curriculumCol" />
<col class="unitCol" />
<col class="purposeCol" />
<col class="equipmentCol" />
<col class="appliCol" />
<col class="scrollCol" />
</colgroup>
<tbody id="ictListBody">
</tbody>
</table>
</div>
</div>

<!-- 要望・トラブル等報告View領域 -->
<div id="demandListView" class="reportContent tab-pane">
<div class="tableHeader">
<table>
<colgroup>
<col class="dateCol" />
<col class="schoolCol" />
<col class="titleCol" />
<col class="troubleCol" />
<col class="equipmentCol" />
<col class="appliCol" />
<col class="statusCol" />
<col class="souceCol" />
<col class="memoCol" />
<col class="checkCol" />
<col class="commentCol" />
<col class="scrollCol" />
</colgroup>
<thead>
<tr>
<th>日付</th>
<th>学校</th>
<th>タイトル</th>
<th>トラブル</th>
<th>ICT機器等</th>
<th>アプリ等</th>
<th>状況</th>
<th>情報元</th>
<th>メモ</th>
<th>事務局確認</th>
<th>事務局コメント</th>
<th></th>
</tr>
</thead>
</table>
</div>
<div class="tableBody">
<table>
<colgroup>
<col class="dateCol" />
<col class="schoolCol" />
<col class="titleCol" />
<col class="troubleCol" />
<col class="equipmentCol" />
<col class="appliCol" />
<col class="statusCol" />
<col class="souceCol" />
<col class="memoCol" />
<col class="checkCol" />
<col class="commentCol" />
<col class="scrollCol" />
</colgroup>
<tbody id="demandListBody">
</tbody>
</table>
</div>
</div>
</div>

</div>
<!-- フッター -->
<div id="footer">
Copyright&copy; Activebrains. All Right Reserved
</div>
</div>

<script type="text/javascript">
/********************
 * tab選択
 ********************/
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var activated_tab = e.target;
    var previous_tab = e.relatedTarget;

    editTabChange(activated_tab);
  })
</script>
</body>
</html>