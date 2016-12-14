<?php
require_once './../../../../admin/php/dbConnect.php';

$model = new dbConnect(ANAUME_TABLE);
$pdo = $model -> connectInfo();

$filename = $_POST["fileName"];
$imgData = $_FILES["imgData"]["tmp_name"];
$imgData = file_get_contents($imgData);

$sql =
    "INSERT INTO `fileImage` (`fileName`, `data`) VALUES (:fileName, :imgData) " .
    "ON DUPLICATE KEY UPDATE `fileName` = VALUES(`fileName`), `data` = VALUES(`data`)";
$stmt = $pdo -> prepare($sql);

$stmt -> bindParam(":fileName", $filename, PDO::PARAM_STR);
$stmt -> bindParam(":imgData", $imgData, PDO::PARAM_LOB);

$stmt -> execute(null);

?>