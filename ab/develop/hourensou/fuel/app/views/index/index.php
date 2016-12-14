<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">

	<?php echo Asset::css('bootstrap.css'); ?>

    <?php echo Asset::css('style.css'); ?>
    <?php echo Asset::css('main.css'); ?>
    <?php echo Asset::css('top.css'); ?>
    <?php echo Asset::css('modal.css'); ?>

    <!-- jquery読み込み -->
    <?php  echo Asset::js('jquery/jquery.min.js');  ?>
    <?php  echo Asset::js('jquery/jquery.cookie.js'); ?>
    <?php  echo Asset::js('modalContents.js');  ?>
    <?php  echo Asset::js('smartRollover.js');  ?>

    <!-- JavaScript読み込み -->
    <?php echo Asset::js('login.js');  ?>
    <?php echo Asset::js('logout.js');  ?>

    <title>ほうれんそう名人</title>
</head>

<body>
<?php /*
    <div id="headImg">
	    <?php echo Asset::img('logout_off.png', array('alt' => 'ログアウト', 'title' => 'ログアウト', 'onclick' => 'logout(\'index\')')); ?>
    </div>
*/ ?>
    <!-- コンテンツ -->
    <div id="container">
        <div id="contents">
            <div id="topImg">
    <?php if ($userid) { ?>
	<button class="btn btn-default" style="position: absolute; top: 180px; left: 295px; " onclick='logout("index");'>ログアウト</button>
	<?php } ?>
<?php
if ($user) {
    if ($user->authority == 'm') {
        echo Asset::img('hourensou_off.png', array('id' => 'hourensoukun','onclick' => 'location_href("./report/")'));
    } elseif ($user->authority == 's') {
        echo Asset::img('hourensou_off.png', array('id' => 'hourensoukun','onclick' => 'location_href("./edit/")'));
    } else {
        echo Asset::img('hourensou_off.png', array('id' => 'hourensoukun', 'class' => 'modal-open', 'data-target'=> 'modalContents01', 'onclick' => 'modalLogin(this)'));
    }
} else {
    echo Asset::img('hourensou_off.png', array('id' => 'hourensoukun', 'class' => 'modal-open', 'data-target'=> 'modalContents01', 'onclick' => 'modalLogin(this)'));
}
?>
            </div>
        </div>
        <!-- フッター -->
        <div id="footer">
             Copyright&copy; ActiveBrains.Co.,Ltd. All Rights Reserved
        </div>
    </div>

    <!-- モーダルコンテンツ -->
    <div id="modalContents01" class="modal-content">
        <h1>ログイン</h1>
        <hr>
        <div class="itemBox">
            <div class="itemName">ユーザー名</div>
            <input id="userID" class="itemInput" name="userid" type="text">
        </div>
        <div class="itemBox">
            <div class="itemName">パスワード</div>
            <input id="userPW" class="itemInput" name="password" type="password">
        </div>
        <div>
            <input id="loginFrm" name="login" type="hidden" value="loginData">
        </div>
        <hr>
        <?php echo Asset::img('b_login_off.png', array('onclick' => 'login()')) ?>
        <?php echo Asset::img('b_cancel_off.png', array('class' => 'modal-close')) ?>
    </div>
</body>

</html>