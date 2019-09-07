 <?php
 $host = 'localhost';
 $user = 'root';
 $password = '';
 $db = 'salco'; 
 $con = mysqli_connect($host, $user, $password, $db);       
 

?>

<h1>Auditoría de materiales</h1>

<p>Auditado por ____________________________________________</p>

<p>Fecha <?php $date = date('d/m/Y H:i:s'); echo $date; ?></p>

	<table class="tabledata" >
  <tr>
    <th>#</th>
    <th>Material</th> 
    <th>Cantidad Teorica</th>
    <th>Cantidad Real</th>
    <th>Diferencia</th>
   
  </tr>

<?php
	  $proyecto = isset($_GET["proyecto"]) ? $_GET["proyecto"] : (isset($_POST["proyecto"]) ? $_POST["proyecto"] : "0");
    $url = 'https://dash.myferby.com/api/endpoint.php?action=inventarios&id_constructora=7&proyecto='.$proyecto.'&tipo=2';

//ho $url ;
//create a new cURL resource
$ch = curl_init($url);


//attach encoded JSON string to the POST fields


//set the content type to application/json
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));

//return response instead of outputting
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

//execute the POST request
$result = curl_exec($ch);

//close cURL resource
curl_close($ch);

//echo $result;
        
$arr = json_decode($result);

for ($i = 0 ; $i < count($arr); $i++ )
    echo "<tr><td>".($i+1)."</td><td>".$arr[$i]->nombre_material."</td><td style='text-align:center;'>".$arr[$i]->inventario_final."</td><td>_____________      </td><td>   (_______________) </td></tr>";
 ?>
  
</table>


<style>
  .tableheader,  td {

      border: 1px solid black;
     
        border-collapse: collapse;
}

  .tabledata,  td {
     
      border: 1px solid black;
     
        border-collapse: collapse;
}
</style>
