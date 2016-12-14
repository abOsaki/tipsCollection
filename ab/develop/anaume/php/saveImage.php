<?php

require_once "dbConnect.php";

$model = new dbConnect();
$pdo = $model -> connectInfo();

$filename = $_POST["filename"];
$imgfile = $_FILES['content']['tmp_name'];
$imgfile = file_get_contents($imgfile);

$sql = "INSERT INTO `imageFile` (`fileName`, `data`) VALUES (:fileName, :data)";
$stmt = $pdo -> prepare($sql);

$stmt -> bindParam(':fileName', $name, PDO::PARAM_STR);
$stmt -> bindParam(':data', $data, PDO::PARAM_LOB);

$name = $filename;
$data = $imgfile;

//発行
$stmt -> execute(null);

?>