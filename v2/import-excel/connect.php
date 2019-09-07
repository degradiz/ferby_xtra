<?php

$host= $_SERVER["HTTP_HOST"]; 
$port= $_SERVER["SERVER_PORT"]; 
if($port == 80){
	$hosturl = "http://" .  $host . "/v2";
}else{
	$hosturl = "https://" .  $host . "/v2";
} 

if($host == "localhost"){
	$hosturl = "http://" .  $host . "/Github/ferbyWeb/v2";
	$host = 'localhost';
	$user = 'root';
	$pass = '';
	$db = 'ferby';

}else{
	$host = 'ferby-dbserver';
	$user = 'ferbyadmin';
	$pass = 'catedradefensa';
	$db = 'ferby';
}




$conn = mysqli_connect($host, $user, $pass, $db);

?>