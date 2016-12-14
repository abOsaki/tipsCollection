<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">

    <?php echo Asset::css('bootstrap.css'); ?>
<?php /*
<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
*/ ?>
    <!-- jquery読み込み -->

    <?php echo Asset::js('jquery/jquery.min.js'); ?>
<?php /*
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
*/ ?>
    <!-- JavaScript読み込み -->
    <?php echo Asset::js('bootstrap.js'); ?>
<?php /*
<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
*/ ?>

<title>test</title>
</head>

<body>
<ul class="nav nav-tabs" id="myTab">
  <li class="nav-item"><a href="#home"  class="nav-link" data-toggle="tab">Home</a></li>
  <li class="nav-item active"><a href="#profile"  class="nav-link" data-toggle="tab">Profile</a></li>
  <li class="nav-item"><a href="#messages" class="nav-link" data-toggle="tab">Messages</a></li>
  <li class="nav-item"><a href="#settings" class="nav-link" data-toggle="tab">Settings</a></li>
</ul>

<div class="tab-content">
  <div class="tab-pane active" id="home">..1</div>
  <div class="tab-pane" id="profile">..2</div>
  <div class="tab-pane" id="messages">..3</div>
  <div class="tab-pane" id="settings">..4</div>
</div>

<script>
console.log('$.fn.tooltip.Constructor.VERSION:' + $.fn.tooltip.Constructor.VERSION);

$('a[data-toggle="tab"]').on('shown.bs.tab', function (event) {
//    alert("event 1");
    var textTarget = $(event.target).text();
    console.log('show.bs.tab textTarget:' + textTarget);
});

</script>

</body>

</html>