 <?php
 $host = 'localhost';
 $user = 'root';
 $password = '';
 $db = 'salco'; 
 $con = mysqli_connect($host, $user, $password, $db);       
 
 $action = isset($_GET["action"]) ? $_GET["action"] : (isset($_POST["action"]) ? $_POST["action"] : "0");

 switch ($action) {
    case 'imprimir_oc':
    		$id_orden_compra = isset($_GET["id_orden_compra"]) ? $_GET["id_orden_compra"] : (isset($_POST["id_orden_compra"]) ? $_POST["id_orden_compra"] : "0");
    		$query = "SELECT oc.*, p.*, c.* FROM ordenes_de_compra oc 
JOIN proveedores  p on oc.id_proveedor = p.id_proveedor
JOIN constructora c on p.id_constructora = c.id_constructora
WHERE id_orden_compra = ".$id_orden_compra;
    		$result = mysqli_query($con,$query);
    		$arrEncabezado = mysqli_fetch_array($result);

    break;
}

?>

<style>
	.tableheader,  td {
		 table-layout: fixed ;
  		border: 1px solid black;
  		padding:10px;
  		width:100%;
  		  border-collapse: collapse;
}

	.tabledata,  td {
		  table-layout: fixed ;
  		border: 1px solid black;
  		padding:10px;
  		width:100%;
  		font-size:11px;
  		border-collapse: collapse;

        
}
body{
         font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
          font-size:14px;
        }
</style>
<div style="border:1px solid black">
<p >
   <img style="width:150px;"  src="https://dash.myferby.com/salco/img/35f4a-splash.jpg"  ><br>
 <?php echo $arrEncabezado["nombre"] ?> <br>
 <?php echo "RTN: ".$arrEncabezado["rtn"] ?>  <br>
 <?php echo "Número de Oficina: ".$arrEncabezado["numero_contacto"] ?>
 </p>

<div>


</div>

<div style="width:100%">
	<table style="width:100%" >
  
  <tr>
      <td style="width:50%"><b>Datos del Proveedor</b><br>  
Proveedor: <?php echo utf8_encode($arrEncabezado["nombre_proveedor"]); ?> <br>
Nombre de Contacto:  <?php echo utf8_encode($arrEncabezado["nombre_contacto"]); ?> <br>
Número de Celular  <?php echo utf8_encode($arrEncabezado["numero_celular_contacto"]); ?> <br> </td>

<td style="width:50%" ><b>Datos del Proveedor</b><br>  
  Fecha de Emisión  <?php echo $arrEncabezado["fecha_emision"] ?><br>
Numero de Orden: <?php echo $arrEncabezado["id_orden_compra"] ?> <br>
Fecha de Entrega: <?php echo $arrEncabezado["fecha_entrega"] ?> <br>
Dirección de entrega:  <?php echo $arrEncabezado["direccion_de_envio"] ?> <br>
 </td>
  </tr>
</table>
  
<br></br><br>


	<table class="tabledata" >
  <tr>
    <th>#</th>
    <th>Material</th> 
    <th>Sc</th>
    <th>Cantidad</th>
    <th>Precio Unitario</th>
    <th>Unidad</th>
      <th>Subtotal</th>
    <th>Impuestos</th>
  </tr>

<?php
	  $proyecto = isset($_GET["proyecto"]) ? $_GET["proyecto"] : (isset($_POST["proyecto"]) ? $_POST["proyecto"] : "0");
        $query = "SELECT m.nombre_material, m.unidad, m.impuesto, cc.item, doc.precio_unitario, doc.cantidad From detalle_orden_de_compra doc JOIN materiales m on m.id_material = doc.id_material JOIN centros_costos cc on cc.id_centro_costo = doc.sc WHERE doc.id_orden_compra = ".$id_orden_compra;
        //echo $query;
        $result =  mysqli_query($con,$query);
        $rows = array();
        $index = 1;
        $subtotal = 0;
        while ($r = mysqli_fetch_assoc($result)) {
             
             echo "<tr><td>".$index."</td><td>".$r["nombre_material"]."</td><td>".$r["item"]."</td><td>".$r["cantidad"]."</td><td>L. ".$r["precio_unitario"]."</td><td> ".$r["unidad"]."</td><td>L. ".($r["cantidad"] * $r["precio_unitario"] )."</td><td> L.".($r["impuesto"]/100) * ($r["cantidad"] * $r["precio_unitario"] )."</td></tr>";
             $index ++;
             $subtotal = $subtotal +($r["cantidad"] * $r["precio_unitario"]);
          }
  		$isv = $subtotal * 0.15; 
		$total = $subtotal * 1.15;
 ?>
  
</table>
<br><br><br>
	<table class="tableheader" >
  <tr>
    <th>Firma y Sello</th>
    <th>Totales</th> 
  
  </tr>
  <tr>
    <td><br><br><br><br></td>
    <td><p style="margin:5px">Subtotal: L.<?php echo  number_format((float)$subtotal, 2, '.', '');  ?></p>
<p style="margin:5px">ISV(15%): L.<?php echo number_format((float)$isv, 2, '.', ''); ?></p>
    	<p style="margin:5px"><b>Total L. <?php echo number_format((float)$total, 2, '.', ''); ?></b></p></td>
    
  </tr>
  
</table>

</div>
</div>