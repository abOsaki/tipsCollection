<!DOCTYPE html>
<html lang="ja">

<head>
<meta charset="UTF-8">

<?php echo Asset::css('bootstrap.min.css'); ?>
<?php echo Asset::css('style.css'); ?>
<?php echo Asset::css('main.css'); ?>
<?php echo Asset::css('report.css'); ?>
<?php echo Asset::css('loader.css'); ?>

<!-- jquery読み込み -->
<?php  echo Asset::js('Chart.min.js'); ?>
<?php  echo Asset::js('jquery/jquery.min.js'); ?>
<?php  echo Asset::js('jquery/jquery.cookie.js'); ?>
<?php  echo Asset::js('smartRollover.js'); ?>

<!-- JavaScript読み込み -->
<?php  echo Asset::js('appcommon.js'); ?>
<?php  echo Asset::js('item.js'); ?>
<?php  echo Asset::js('bootstrap.min.js'); ?>
<?php  echo Asset::js('baseInfo.js'); ?>
<?php  echo Asset::js('tabChange.js'); ?>
<?php  echo Asset::js('spanChange.js'); ?>
<?php  echo Asset::js('report.js'); ?>
<?php  echo Asset::js('reportList.js'); ?>
<?php  echo Asset::js('reportCheck.js'); ?>
<?php  echo Asset::js('reportDataList.js'); ?>
<?php  echo Asset::js('reportDemandList.js'); ?>
<?php  echo Asset::js('reportIctList.js'); ?>
<?php  echo Asset::js('reportManage.js'); ?>
<?php  echo Asset::js('reportState.js'); ?>
<?php /*
<?php  echo Asset::js('getReportList.js'); ?>
*/ ?>
<?php /*
    <?php  echo Asset::js('graph.js'); ?>
    <?php  echo Asset::js('eventListener.js'); ?>
*/ ?>
<?php  echo Asset::js('makeChart.js'); ?>
<?php  echo Asset::js('downloadCsv.js'); ?>
<?php  echo Asset::js('dataAnalyze.js'); ?>
<?php /*
<?php  echo Asset::js('dataList.js'); ?>
*/ ?>
<?php  echo Asset::js('loader.js'); ?>
<?php  echo Asset::js('logout.js'); ?>
<?php  echo Asset::js('inputWorkShift.js'); ?>
<?php  echo Asset::js('workShift.js'); ?>

<title>ほうれんそう名人</title>
</head>

<body>
<!-- コンテンツ -->
<div id="container">
    <!-- ヘッダー -->
<div id="header">
    <a href="../" title="トップ画面へ移動"><?php echo Asset::img('hourensou.png', array('id' => 'headerImg1', 'alt' => 'ほうれんそう名人')); ?></a>
<div id="headerInfo">
    <div id="userName">名前 さん</div>
</div>

<div id="dateSelecter">
<div id="dateDataFrom">
<select id="yearDateFrom">
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
<select id="monthDateFrom">
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
</div>
<div id="dateDataTo">
<select id="yearDateTo">
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
<select id="monthDateTo">
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
</div>
<button class="btn btn-primary btn-sm" id="dateSelecterSubmit" onclick='filter();'>表示</button>
<?php /*
<?php echo Asset::img('b_hyouji_off.png', array('id' => 'dateSelecterSubmit', 'onclick' => 'filter()')); ?>
*/ ?>
<button class="btn btn-warning btn-sm" id="csvDownloadButton" onclick='reportCsvDownload();'>CSVデータ出力</button>
<?php /*
<?php echo Asset::img('b_csv_off.png', array('id' => 'csvDownloadButton', 'onclick' => 'reportCsvDownload()')); ?>
*/ ?>
</div>
<?php /*
<a href="./edit.html" title="入力画面へ移動"><?php echo Asset::img('flyingcrimson.png', array('id' => 'headerImg2', 'alt' => 'ほうれんそう名人')); ?></a>
*/ ?>
<?php /*
            <div id="headImg">
                <?php echo Asset::img('modoru_s_off.png', array('alt' => '戻る', 'title' => '戻る', 'onclick' => 'history.back()')); ?>
                <?php echo Asset::img('logout_off.png', array('alt' => 'ログアウト', 'title' => 'ログアウト', 'onclick' => 'logout("report)')); ?>
            </div>
*/ ?>
<a href="../user/"><button class="btn btn-danger" style="position: absolute; top: 10px; left: 1150px;">ユーザ管理</button></a>
<button class="btn btn-default" style="position: absolute; top: 10px; left: 1250px;" onclick='logout("report");'>ログアウト</button>
</div>

<!-- コンテンツ -->
<div id="contents">

            <!-- 業務報告 -->
<ul class="nav nav-tabs">
<li class="active" id="tabtype3">
<a href="#workShiftView" data-toggle="tab" id="workShift">シフト一覧</a>
</li>
<li id="tabtype1">
<a href="#reportStateView" data-toggle="tab" id="reportState">提出状況</a>
</li>
<li id="tabtype1">
<a href="#ictListView"  data-toggle="tab" id="ictList">ICT活用授業報告一覧</a>
</li>
<li id="tabtype1">
<a href="#demandListView"data-toggle="tab" id="demandList">要望・トラブル等一覧</a>
</li>
<li id="tabtype2">
<a href="#reportAnalysisView" data-toggle="tab" id="reportAnalysis">業務分析</a>
</li>
<li id="tabtype2">
<a href="#ictAnalysisView"  data-toggle="tab" id="ictAnalysis">ICT活用授業分析</a>
</li>
<li id="tabtype2">
<a href="#demandAnalysisView" data-toggle="tab" id="demandAnalysis">トラブル分析</a>
</li>
</ul>

<button type="button" class="btn btn-primary btn-xs" id="prevMonthButton" style="display: none;" onclick="reportSpanChange(-1)">前月&lt;&lt;&lt;</button>
<p id="dispYear" style="display: none;"></p>
<p id="dispMonth" style="display: none;"></p>
<button type="button" class="btn btn-primary btn-xs" id="nextMonthButton" style="display: none;" onclick="reportSpanChange(1)">次月&gt;&gt;&gt;</button>

<!-- 管理画面View領域 -->
<div id="reportView" class="tab-content">

<!--シフト一覧-->
<div id="workShiftView" class="reportContent tab-pane active">
<?php /*
<div id="workShiftView" class="reportContent tab-pane">
*/ ?>
<div style="position: absolute;">
<div class="tableHeader">
<table>
<colgroup>
<col class="areaCol" />
<col class="schoolCol" />
<col class="userCol" />
</colgroup>
<thead id="reportThead">
</thead>
</table>
</div>
</div>
<div class="tableBody" style="top: 45px; height: 462px; position: absolute;">
<table>
<colgroup>
<col class="areaCol" />
<col class="schoolCol" />
<col class="userCol" />
</colgroup>
<tbody id="workShiftBody">
</tbody>
</table>
</div>
</div>

<!--業務報告提出状況-->
<div id="reportStateView" class="reportContent tab-pane">
<div class="tableHeader">
<table>
<colgroup>
<col class="dateCol" />
<col class="dowCol" />
<col class="schoolCol" />
<col class="userCol" />
<col class="reportCol" />
<col class="ictCol" />
<col class="demandCol" />
<col class="spaceCol" />
<col class="scrollCol" />
</colgroup>
<thead>
<tr>
<th onclick="filter()">日付▼</th>
<th>曜日</th>
<th onclick="filter('school')">学校▼</th>
<th onclick="filter('user')">氏名▼</th>
<th>業務報告</th>
<th>ICT活用授業報告</th>
<th>要望・トラブル等報告</th>
<th></th>
<th></th>
</tr>
</thead>
</table>
</div>
<div class="tableBody">
<table>
<colgroup>
<col class="dateCol" />
<col class="dowCol" />
<col class="schoolCol" />
<col class="userCol" />
<col class="reportCol" />
<col class="ictCol" />
<col class="demandCol" />
<col class="spaceCol" />
</colgroup>
<tbody id="reportStateBody">
</tbody>
</table>
</div>
</div>

<!--業務報告一覧-->
<div id="reportListView" class="reportContent tab-pane">
<div class="tableHeader">
<table>
<colgroup>
<col class="dateCol" />
<col class="userCol" />
<col class="schoolCol" />
<col class="timetableCol" />
<col class="lacationCol" />
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
<th onclick="filter()">日付▼</th>
<th onclick="filter('Auser')">氏名▼</th>
<th onclick="filter('Aschool')">学校▼</th>
<th>時間割</th>
<th>場所</th>
<th onclick="filter('Abusiness')">業務▼</th>
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
<col class="userCol" />
<col class="schoolCol" />
<col class="timetableCol" />
<col class="lacationCol" />
<col class="businessCol" />
<col class="itemCol" />
<col class="gradeCol" />
<col class="classCol" />
<col class="curriculumCol" />
<col class="unitCol" />
</colgroup>
<tbody id="reportListBody">
</tbody>
</table>
</div>
</div>

<!--ICT業務報告一覧-->
<div id="ictListView" class="reportContent tab-pane">
<div class="tableHeader">
<table>
<colgroup>
<col class="dateCol" />
<col class="userCol" />
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
<th onclick="filter()">日付▼</th>
<th onclick="filter('Auser')">氏名▼</th>
<th onclick="filter('Aschool')">学校▼</th>
<th>時間割</th>
<th>場所</th>
<th onclick="filter('Asupport')">支援有無▼</th>
<th onclick="filter('Alesson')">授業支援▼</th>
<th onclick="filter('Agrade')">学年▼</th>
<th>クラス</th>
<th onclick="filter('Acurriculum')">教科▼</th>
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
<col class="userCol" />
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
</colgroup>
<tbody id="ictListBody">
</tbody>
</table>
</div>
</div>

<!-- 要望・トラブル等一覧 -->
<div id="demandListView" class="reportContent tab-pane">
<div class="tableHeader">
<table>
<colgroup>
<col class="dateCol" />
<col class="userCol" />
<col class="schoolCol" />
<col class="titleCol" />
<col class="troubleCol" />
<col class="itemCol" />
<col class="statusCol" />
<col class="souceCol" />
<col class="memoCol" />
<col class="checkCol" />
<col class="commentCol" />
<col class="submitCol" />
<col class="scrollCol" />
</colgroup>
<thead>
<tr>
<th onclick="filter()">日付▼</th>
<th onclick="filter('Auser')">氏名▼</th>
<th onclick="filter('Aschool')">学校▼</th>
<th onclick="filter('Atitle')">タイトル▼</th>
<th onclick="filter('Atrouble')">トラブル▼</th>
<th>機器・アプリ等</th>
<th onclick="filter('Astatus')">状況▼</th>
<th>情報元</th>
<th>メモ</th>
<th>確認</th>
<th>事務局コメント</th>
<th></th>
<th></th>
</tr>
</thead>
</table>
</div>
<div class="tableBody">
<table>
<colgroup>
<col class="dateCol" />
<col class="userCol" />
<col class="schoolCol" />
<col class="titleCol" />
<col class="troubleCol" />
<col class="itemCol" />
<col class="statusCol" />
<col class="souceCol" />
<col class="memoCol" />
<col class="checkCol" />
<col class="commentCol" />
<col class="submitCol" />
</colgroup>
<tbody id="demandListBody">
</tbody>
</table>
</div>
</div>

<!-- データ分析 -->
<div id="reportAnalysisView" class="reportContent tab-pane">
<div id="reportA_list">
集計期間
<select id="reportA_yearF">
<?php for ($i = $aggregateStartYear; $i <= $aggregateEndtYear; $i++) { ?>
<option value="<?= $i ?>"><?= $i ?></option>
<?php } ?>
<?php /*
<option value="2013">2013</option>
<option value="2014">2014</option>
<option value="2015">2015</option>
*/ ?>
<option value="" selected="selected">--</option>
</select> 年
<select id="reportA_monthF">
<option value="" selected="selected">--</option>
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
</select> 月 ～
<select id="reportA_yearE">
<option value="" selected="selected">--</option>
<?php for ($i = $aggregateStartYear; $i <= $aggregateEndtYear; $i++) { ?>
<option value="<?= $i ?>"><?= $i ?></option>
<?php } ?>
<?php /*
<option value="2013">2013</option>
<option value="2014">2014</option>
<option value="2015">2015</option>
*/ ?>
</select> 年
<select id="reportA_monthE">
<option value="" selected="selected">--</option>
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
</select> 月 &nbsp;氏名:
<select id="reportA_user" class="inputData">
<option value="" selected="selected">--</option>
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
</select>
&nbsp;学校種別:
<select id="reportA_group" class="inputData analyzeGroup" onchange="analyzeGroupChange(event)">
<option value="" selected="selected">--</option>
<option value="1">小学校</option>
<option value="2">中学校</option>
</select>
&nbsp;学校:
<select id="reportA_school" class="inputData analyzeSchool">
<option value="" selected="selected">--</option>
</select>
&nbsp;学年:
<select id="reportA_grade" class="inputData analyzeGrade">
<option value="" selected="selected">--</option>
</select>
<span><input type="button" id="reportA_run" value="指定条件で分析" onclick="drawChart()"/></span>
</div>
<div id="reportA_graph" class="graphArea">
<!-- <canvas id="reportA_graphArea" class="pieChart"></canvas> -->
<div id="reportA_indexArea"></div>
<div id="reportA_legendArea" class="legendArea"></div>
<canvas id="reportA_graphArea"></canvas>
<div id="reportA_outline" class="outline" style="display:none;">
<table></table>
</div>
</div>
<div id="reportA_graph_2" class="graphArea">
<!-- <canvas id="reportA_graphArea" class="pieChart"></canvas> -->
<div id="reportA_indexArea_2"></div>
<div id="reportA_legendArea_2" class="legendArea"></div>
<canvas id="reportA_graphArea_2"></canvas>
<div id="reportA_outline_2" class="outline" style="display:none;">
<table></table>
</div>
</div>
</div>

<!-- ICT分析 -->
<div id="ictAnalysisView" class="reportContent tab-pane">
<div id="ictA_list">
集計期間
<select id="ictA_yearF">
<?php for ($i = $aggregateStartYear; $i <= $aggregateEndtYear; $i++) { ?>
<option value="<?= $i ?>"><?= $i ?></option>
<?php } ?>
<?php /*
<option value="2013">2013</option>
<option value="2014">2014</option>
<option value="2015">2015</option>
*/ ?>
<option value="" selected="selected">--</option>
</select> 年
<select id="ictA_monthF">
<option value="" selected="selected">--</option>
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
</select> 月 ～
<select id="ictA_yearE">
<option value="" selected="selected">--</option>
<?php for ($i = $aggregateStartYear; $i <= $aggregateEndtYear; $i++) { ?>
<option value="<?= $i ?>"><?= $i ?></option>
<?php } ?>
<?php /*
<option value="2013">2013</option>
<option value="2014">2014</option>
<option value="2015">2015</option>
*/ ?>
</select> 年
<select id="ictA_monthE">
<option value="" selected="selected">--</option>
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
</select> 月 &nbsp;学校種別:
<select id="ictA_group" class="inputData analyzeGroup" onchange="analyzeGroupChange(event)">
<option value="" selected="selected">--</option>
<option value="1">小学校</option>
<option value="2">中学校</option>
</select>
&nbsp;学校:
<select id="ictA_school" class="inputData analyzeSchool">
<option value="" selected="selected">--</option>
</select>
&nbsp;学年:
<select id="ictA_grade" class="inputData analyzeGrade">
<option value="" selected="selected">--</option>
</select>
&nbsp;教科:
<select id="ictA_curriculum" class="inputData analyzeCurriculum">
<option value="" selected="selected">--</option>
</select>
<select id="ictA_group_by">
<option value="grade" selected>学年別</option>
<option value="curriculum">教科別</option>
<option value="purpose">目的別</option>
<option value="equipment">機器別</option>
<option value="application">アプリ別</option>
</select>

<span><input type="button" id="ictA_run" value="指定条件で分析" onclick="ict_drawChart()"/></span>
</div>
<div id="ictA_graph" class="graphArea">
<!-- <canvas id="reportA_graphArea" class="pieChart"></canvas> -->
<div id="ictA_indexArea"></div>
<div id="ictA_legendArea" class="legendArea"></div>
<canvas id="ictA_graphArea"></canvas>
<div id="ictA_outline" class="outline" style="display:none;">
<table></table>
</div>
</div>
</div>

<!-- トラブル分析 -->
<div id="demandAnalysisView" class="reportContent tab-pane">
<div id="demandA_list">
集計期間
<select id="demandA_yearF">
<?php for ($i = $aggregateStartYear; $i <= $aggregateEndtYear; $i++) { ?>
<option value="<?= $i ?>"><?= $i ?></option>
<?php } ?>
<?php /*
<option value="2013">2013</option>
<option value="2014">2014</option>
<option value="2015">2015</option>
*/ ?>
<option value="" selected="selected">--</option>
</select> 年
<select id="demandA_monthF">
<option value="" selected="selected">--</option>
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
</select> 月 ～
<select id="demandA_yearE">
<option value="" selected="selected">--</option>
<?php for ($i = $aggregateStartYear; $i <= $aggregateEndtYear; $i++) { ?>
<option value="<?= $i ?>"><?= $i ?></option>
<?php } ?>
<?php /*
<option value="2013">2013</option>
<option value="2014">2014</option>
<option value="2015">2015</option>
*/ ?>
</select> 年
<select id="demandA_monthE">
<option value="" selected="selected">--</option>
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
</select> 月 &nbsp;氏名:
<select id="demandA_user" class="inputData">
<option value="" selected="selected">--</option>
</select>
&nbsp;学校種別:
<select id="demandA_group" class="inputData analyzeGroup" onchange="analyzeGroupChange(event)">
<option value="" selected="selected">--</option>
<option value="1">小学校</option>
<option value="2">中学校</option>
</select>
&nbsp;学校:
<select id="demandA_school" class="inputData analyzeSchool">
<option value="" selected="selected">--</option>
</select>
&nbsp;学年:
<select id="demandA_grade" class="inputData analyzeGrade">
<option value="" selected="selected">--</option>
</select>
<span><input type="button" id="demandA_run" value="指定条件で分析" onclick="trouble_drawChart()"/></span>
</div>
<div id="demandA_graph" class="graphArea">
<!-- <canvas id="reportA_graphArea" class="pieChart"></canvas> -->
<div id="demandA_indexArea"></div>
<div id="demandA_legendArea" class="legendArea"></div>
<canvas id="demandA_graphArea"></canvas>
<div id="demandA_outline" class="outline" style="display:none;">
<table></table>
</div>
</div>
<div id="demandA_graph_2" class="graphArea">
<!-- <canvas id="reportA_graphArea" class="pieChart"></canvas> -->
<div id="demandA_indexArea_2"></div>
<div id="demandA_legendArea_2" class="legendArea"></div>
<canvas id="demandA_graphArea_2"></canvas>
<div id="demandA_outline_2" class="outline" style="display:none;">
<table></table>
</div>
</div>
<div id="demandA_graph_3" class="graphArea">
<!-- <canvas id="reportA_graphArea" class="pieChart"></canvas> -->
<div id="demandA_indexArea_3"></div>
<div id="demandA_legendArea_3" class="legendArea"></div>
<canvas id="demandA_graphArea_3"></canvas>
<div id="demandA_outline_3" class="outline" style="display:none;">
<table></table>
</div>
</div>
</div>

</div>
</div>
<!-- フッター -->
<div id="footer">
Copyright&copy; ActiveBrains.Co.,Ltd. All Rights Reserved
</div>
</div>

<div class="modal" id="staticModal" tabindex="-1" role="dialog" aria-labelledby="staticModalLabel" aria-hidden="true" data-show="true" data-keyboard="false" data-backdrop="static">
<div class="modal-dialog">
<div class="modal-content">
<div class="modal-header">
<button type="button" class="close" data-dismiss="modal">
<span aria-hidden="true">&#215;</span><span class="sr-only">閉じる</span>
</button>
<h4 class="modal-title">シフト情報 詳細</h4>
</div><!-- /modal-header -->
<div class="modal-body">
<input type="hidden" id="workshift_modal_shiftid" value="" />
<table class="table table-bordered">
<tr>
<td colspan="2">ユーザ名</td><td><span class="username">ユーザ名</span></td>
</tr>
<tr>
<td colspan="2">日付</td><td><span class="shiftdate">シフト日付</span></td>
</tr>
<tr>
<td rowspan="3">AM</td><td>地区</td><td id="workshift_modal_am_area_td"></td>
</tr>
<tr>
<td>学校区分</td><td id="workshift_modal_am_group_td"></td>
</tr>
<tr>
<td>学校</td><td id="workshift_modal_am_school_td"></td>
</tr>
<tr>
<td rowspan="3">PM</td><td>地区</td><td id="workshift_modal_pm_area_td"></td>
</tr>
<tr>
<td>学校区分</td><td id="workshift_modal_pm_group_td"></td>
</tr>
<tr>
<td>学校</td><td id="workshift_modal_pm_school_td"></td>
</tr>
</table>
</div>
<div class="modal-footer">
<button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
<button type="button" class="btn btn-primary" onclick="changeWorkFrmSubmit();">変更を保存</button>
</div>
</div>
</div>
</div>

<script type="text/javascript">
/********************
 * tab選択
 ********************/
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var activated_tab = e.target; // activated tab
    var previous_tab = e.relatedTarget; // previous tab
    reportTabChange(activated_tab);
  });

/********************
 * ダイアログ表示
 ********************/
$(function() {
    // ダイアログ表示前にJavaScriptで操作する
    $('#staticModal').on('show.bs.modal', function(e) {
        var target = e.target; // activated tab
        console.log('**** target:' + target);
        console.log('**** target id:' + target.id);
        var id = $(e.relatedTarget).data('whatever'); //< "パラメーター１"を取得
        console.log('**** id:' + id);
//      $(this).find('.modal-body .recipient').text(recipient);
        setModalWorkShift(id, target);
    });
});

</script>

</body>

</html>