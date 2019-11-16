<?php 
require_once 'AppEmulator/nusoap/lib/nusoap.php';

//$wsdl="http://192.168.0.10:53168/operaciones.asmx?WSDL";
$wsdl="http://190.185.114.166:53168/operaciones.asmx?WSDL";
//$wsdl="http://138.0.230.5:53168/operaciones.asmx?WSDL";
$client=new nusoap_client($wsdl,true);
$cupon_code = "de001";
$cupon_name = "Prueba Dennis";
$cupon_description = "35";
$cant = "10";

//$result=$client->call('Insert',array('cupon_code'=>$cupon_code,'nombre'=>$cupon_name,'descuento'=>$cupon_description,'cantidad'=>$cant));
//$result=$client->call('Insert',array('cupon_code'=>'3ac-9','nombre'=>'dia del padre','descuento'=>'10','cantidad'=>'20'));

$result=$client->call('sumar',array('x'=>'7','y'=>'1'));

var_dump($result);

echo $result['sumarResult'];




?>