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

<!-- JavaScript読み込み -->
<?php  echo Asset::js('appcommon.js'); ?>
<?php  echo Asset::js('item.js'); ?>
<?php  echo Asset::js('bootstrap.min.js'); ?>
<?php  echo Asset::js('baseInfo.js'); ?>
<?php  echo Asset::js('loader.js'); ?>
<?php  echo Asset::js('logout.js'); ?>
<?php  echo Asset::js('user.js'); ?>

<title>ほうれんそう名人</title>
</head>

<body>

<div id="header">
<a href="../" title="トップ画面へ移動"><?php echo Asset::img('hourensou.png', array('id' => 'headerImg1', 'alt' => 'ほうれんそう名人')); ?></a>
<div id="headerInfo">
<div id="userName">名前 さん</div>
</div>
<button class="btn btn-danger" style="position: absolute; top: 10px; left: 990px;" data-toggle="modal" data-target="#createUserModal" >ユーザ新規作成</button>
<a href="../report/"><button class="btn btn-primary" style="position: absolute; top: 10px; left: 1120px;">管理画面に戻る</button></a>
<button class="btn btn-default" style="position: absolute; top: 10px; left: 1250px;" onclick='logout("report");'>ログアウト</button>
</div>

<div id="contents">
<table class="table table-bordered table-hover" style="background-color: #fff;">
<thead>
<tr>
<th>id</th>
<th>userid</th>
<th>名前</th>
<th>権限</th>
</tr>
</thead>
<tbody>
<?php foreach ($user_array as $user) { ?>
<tr data-toggle="modal" data-target="#updateUserModal" data-whatever="<?= $user->id ?>">
<td><?= $user->id ?></td>
<td><?= $user->loginName ?></td>
<td><?= $user->displayName  ?></td>
<td><?= $user->authority ?></td>
</tr>
<?php } ?>
</tbody>
</table>
</div>

<div class="modal" id="createUserModal" tabindex="-1" role="dialog" aria-labelledby="createUserModalLabel" aria-hidden="true" data-show="true" data-keyboard="false" data-backdrop="static">
<div class="modal-dialog">
<div class="modal-content">
<div class="modal-header">
<button type="button" class="close" data-dismiss="modal">
<span aria-hidden="true">&#215;</span><span class="sr-only">閉じる</span>
</button>
<h4 class="modal-title">ユーザ新規作成</h4>
</div><!-- /modal-header -->
<div class="modal-body">
<table class="table table-bordered">
<tr>
<td>userid</td><td><input type="text" id="modal_userid" /></td>
</tr>
<tr>
<td>名前</td><td><input type="text" id="modal_displayname" /></td>
</tr>
<tr>
<td>password</td><td><input type="text" id="modal_password" /></td>
</tr>
<tr>
<td>authority</td><td>
<select id="modal_authority">
<option value="s">s 支援員</option>
<option value="m">m 管理者</option>
</select>
</td>
</tr>
</table>
</div>
<div class="modal-footer">
<button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
<button type="button" class="btn btn-primary" onclick="createUserFrmSubmit();">新規作成</button>
</div>
</div>
</div>
</div>

<div class="modal" id="updateUserModal" tabindex="-1" role="dialog" aria-labelledby="updateUserModalLabel" aria-hidden="true" data-show="true" data-keyboard="false" data-backdrop="static">
<div class="modal-dialog">
<div class="modal-content">
<div class="modal-header">
<button type="button" class="close" data-dismiss="modal">
<span aria-hidden="true">&#215;</span><span class="sr-only">閉じる</span>
</button>
<h4 class="modal-title">ユーザ情報変更</h4>
</div><!-- /modal-header -->
<div class="modal-body">
<input type="hidden" id="modal_id" value="" />
<table class="table table-bordered">
<tr>
<td>id</td><td><span class="id">id</span></td>
</tr>
<tr>
<td>userid</td><td><span class="userid">ユーザID</span></td>
</tr>
<tr>
<td>名前</td><td><input type="text" id="modal_update_displayname" class="name" value="" /></td>
</tr>
<tr>
<td>password</td><td>****</td>
</tr>
<tr>
<td>authority</td><td id="user_modal_authority_td"></td>
</tr>
</table>
</div>
<div class="modal-footer">
<button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
<button type="button" class="btn btn-primary" onclick="updateUserFrmSubmit();">変更</button>
</div>
</div>
</div>
</div>

<script type="text/javascript">
/********************
 * ダイアログ表示
 ********************/
$(function() {
    // ダイアログ表示前にJavaScriptで操作する
    $('#updateUserModal').on('show.bs.modal', function(e) {
        var target = e.target; // activated tab
        console.log('**** target:' + target);
        console.log('**** target id:' + target.id);
        var id = $(e.relatedTarget).data('whatever'); //< "パラメーター１"を取得
        console.log('**** id:' + id);
//      $(this).find('.modal-body .recipient').text(recipient);
        setModalUser(id, target);
    });
});

</script>

</body>

</html>