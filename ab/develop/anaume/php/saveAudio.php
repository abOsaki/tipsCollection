<?php

require_once "dbConnect.php";

//echo "start";

$model = new dbConnect();
$pdo = $model -> connectInfo();

$filename = $_POST["filename"];
$audiofile = $_FILES['content']['tmp_name'];
$audiofile = file_get_contents($audiofile);

$sql = "INSERT INTO `audioFile` (`fileName`, `data`) VALUES (:fileName, :data)";
$stmt = $pdo -> prepare($sql);

$stmt -> bindParam(':fileName', $name, PDO::PARAM_STR);
$stmt -> bindParam(':data', $data, PDO::PARAM_LOB);

$name = $filename;
$data = $audiofile;

//echo $sql;

//発行
$stmt -> execute(null);

?>