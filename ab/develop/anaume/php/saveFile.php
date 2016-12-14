<?php

require_once "dbConnect.php";

$model = new dbConnect();
$pdo = $model -> connectInfo();

$filename = $_POST["filename"];
//$file = $_FILES['content']['tmp_name'];
$file = fopen($_FILES['content']['tmp_name'], 'rb');

//var_dump($filename);
//var_dump($file);


$sql = "INSERT INTO `file` (`fileName`, `data`) VALUES (:fileName, :data)";
$stmt = $pdo -> prepare($sql);

$stmt -> bindParam(':fileName', $filename, PDO::PARAM_STR);
$stmt -> bindParam(':data', $file, PDO::PARAM_LOB);

//発行
$stmt -> execute(null);

?>