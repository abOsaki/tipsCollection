<!DOCTYPE html>
<html lang="ja">

<head>
<meta charset="UTF-8">

<?php echo Asset::css('style.css'); ?>
<?php echo Asset::css('result.css'); ?>

<!-- jquery読み込み -->
<?php  echo Asset::js('smartRollover.js'); ?>

<!-- JavaScript読み込み -->
<?php  echo Asset::js('logout.js'); ?>

<title>ほうれんそう名人</title>
</head>

<body>
<div id="wrap">
<!-- コンテンツ -->
<div id="container">
<div id="contents">
<div id="reTop" onclick="logout('result');">
</div>
<div id="topImg">
<a href="../edit/">
<?php echo Asset::img('b_nyuryoku_off.png', array('id' => 'nyuryoku')); ?>
</a>
</div>
</div>
<!-- フッター -->
<div id="footer">
Copyright&copy; ActiveBrains.Co.,Ltd. All Rights Reserved
</div>
</div>
</div>
</body>