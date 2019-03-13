<?php

 //$host = 'localhost';
 //$user = 'root';
 //$password = '';
 //$db = 'ferby';
 //$con = mysqli_connect($host, $user, $password, $db);                                               


$host = 'localhost';
$user = 'ferbyadmin';
$password = 'Catedradefensa2018$';
$db = 'ferby';
$con = mysqli_connect($host, $user, $password, $db);


//$host = 'mysql.hostinger.mx';
//$user = 'u586955650_ferby';
//$password = 'catedradefensa';
//$db = 'u586955650_ferby';
//$con = mysqli_connect($host, $user, $password, $db);  

function getConnect() {
    $host = 'ferby-dbserver.c.ferby-49595.internal';
    $user = 'ferbyadmin';
    $password = 'catedradefensa';
    $db = 'ferby';
    $con = mysqli_connect($host, $user, $password, $db) or die ('err');
    return $con;
}
