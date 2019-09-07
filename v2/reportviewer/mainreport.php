<?php
$proyecto = isset($_GET["proyecto"]) ? $_GET["proyecto"] : (isset($_POST["proyecto"]) ? $_POST["proyecto"] : "0");
$url = 'http://localhost/Github/saLCO/api/endpoint.php?action=costos_centro_costo_proyectado&proyecto='.$proyecto;
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);
curl_close($ch);     
$arrProy = json_decode($result);

//print_r($arrProy);


$url = 'http://localhost/Github/saLCO/api/endpoint.php?action=costo_centro_costo&proyecto='.$proyecto;
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);
curl_close($ch);        
$arrCons = json_decode($result);
//print_r($arrCons);
$rows = array();
for($i = 0; $i < count($arrCons); $i++){
  if($arrCons[$i]->identificador == $arrProy[$i]->identificado)
    $rows[$i]["identificador"] = $arrCons[$i]->identificador;
    $rows[$i]["materiales_proyectado"] = $arrProy[$i]->material_proyectado;
    $rows[$i]["materiales_consumido"] = $arrCons[$i]->consumido;
    $rows[$i]["diferencia_materiales"] = $arrProy[$i]->material_proyectado - $arrCons[$i]->consumido;
    $rows[$i]["mod_proyectado"] = $arrProy[$i]->mod_proyectado;
    $rows[$i]["mod_consumido"] = $arrCons[$i]->total_mod;
    $rows[$i]["diferencia_mod"] = ($arrProy[$i]->mod_proyectado - $arrCons[$i]->total_mod);
    $rows[$i]["contratista_proyectado"] = $arrProy[$i]->contratista_proyectado;
    $rows[$i]["contratista_consumido"] = $arrCons[$i]->total_contratista;
    $rows[$i]["diferencia_contratistas"] = ($arrProy[$i]->contratista_proyectado - $arrCons[$i]->total_contratista);
}

echo json_encode($rows);

?>