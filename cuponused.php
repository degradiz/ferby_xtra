<?php
if(isset($_GET['cupon_code'])){
require 'ws/classes/connection.php';	
//$host = "localhost";
//$user = "root";
//$user = 'ferbyadmin';
//$password = "";
//$password = 'Catedradefensa2018$';
//$db = 'ferby';
//$con = mysqli_connect($host, $user, $password, $db);

// Check connection
if ($con->connect_error) {
    die("Connection failed: " . $con->connect_error);
} 
$codigo = $_GET['cupon_code'];
$status = "No";

$sql = "SELECT id_generated, cupon_code, state FROM cupon_generated WHERE cupon_code='$codigo' and uuid is not null";

$result = $con->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
    	if ($row["state"]==1){$status = "Si";}
        echo "id: " . $row["id_generated"]. " - cupon_code: " . $row["cupon_code"]. " - Consumido: " . $status . "<br>";
    }

    $sqlu = "UPDATE cupon_generated SET state=1 WHERE cupon_code='$codigo' and uuid is not null";
    
    if($row["state"]==0){
		if ($con->query($sqlu) === TRUE) {
		    echo "Consumo de cupón registrado.";
		} else {
		    echo "Error actualizando: " . $con->error;
		}
	}else{
		echo "Cupon ya consumido.";
	}
} else {
    echo "0 resultados del código de cupon enviado.";
}



$con->close();
}
?>