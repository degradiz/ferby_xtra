
<?php
header("Access-Control-Allow-Origin: *");
require 'connection.php';     
 $action = isset($_GET["action"]) ? $_GET["action"] : (isset($_POST["action"]) ? $_POST["action"] : "0");
global $con;
 switch ($action) {
  case 'login_empelado':
        $pin = isset($_GET["pin"]) ? $_GET["pin"] : (isset($_POST["pin"]) ? $_POST["pin"] : "0");
        $user = isset($_GET["user"]) ? $_GET["user"] : (isset($_POST["user"]) ? $_POST["user"] : "0");
        $device = isset($_GET["device"]) ? $_GET["device"] : (isset($_POST["device"]) ? $_POST["device"] : "0");
        $arr = array();
        $firstSelect = "SELECT * FROM `usuarios_sucursal` WHERE usuario = '$user' AND pin = '$pin' LIMIT 1";
        $firstResult = mysqli_query($con,$firstSelect);
        $firstN = mysqli_num_rows($firstResult);
        if($firstN > 0){
             $tmparr = mysqli_fetch_array($firstResult);
             $place_id = $tmparr["place_id"];
             $secondSelect = "SELECT * FROM dispositivos where identificador = '$device' AND place_location_id = ".$tmparr["place_location_id"];
             $secondResult = mysqli_query($con,$firstSelect);
             $secondN = mysqli_num_rows($firstResult);
              if($secondN > 0){
                   $arr["result"] = "ok";
                   $arr["place_id"] = $tmparr["place_id"];
                   $arr["place_location_id"] = $tmparr["place_location_id"];
                   $arr["cupon"] =  $tmparr["cupones"];
                   $arr["puntos"] =  $tmparr["puntos"];
              }else{
                $arr["result"] = "nop";
              }
        }else{
            $arr["result"] = "nop";
        }
        echo json_encode($arr);
  break;

    case 'insert_cliente': //CONSUMID
     $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
     $nombre = isset($_GET["nombre"]) ? $_GET["nombre"] : (isset($_POST["nombre"]) ? $_POST["nombre"] : "0");
     $documento = isset($_GET["documento"]) ? $_GET["documento"] : (isset($_POST["documento"]) ? $_POST["documento"] : "0");
      $email = isset($_GET["email"]) ? $_GET["email"] : (isset($_POST["email"]) ? $_POST["email"] : "0");
     $numero_celular = isset($_GET["numero_celular"]) ? $_GET["numero_celular"] : (isset($_POST["numero_celular"]) ? $_POST["numero_celular"] : "0");
     $direccion_domicilio = isset($_GET["direccion_domicilio"]) ? $_GET["direccion_domicilio"] : (isset($_POST["direccion_domicilio"]) ? $_POST["direccion_domicilio"] : "0");

      $prequery = "SELECT * FROM clientes WHERE email = '$email' and place_id = '$place_id'";
      $preresult = mysqli_query($con,$prequery);
      $n = mysqli_num_rows($preresult);
      if($n == 0){
          $q = "INSERT INTO `clientes` (`id_cliente`, `place_id`, `nombre`, `documento`, `email`, `numero_celular`, `direccion_domicilio`) VALUES (NULL, '$place_id', '$nombre', '$documento', '$email', '$numero_celular', '$direccion_domicilio');";
      }else{
          $q = "UPDATE clientes SET nombre = '$nombre', documento = '$documento', direccion_domicilio = '$direccion_domicilio', numero_celular = '$numero_celular' WHERE email = '$email' AND place_id = '$place_id'";
      }
          $result = mysqli_query($con,$q);
        if ($result === TRUE){
          echo 1;
        }else{
          echo $q;
        }
        break;

       case 'get_mesa':
        $random = isset($_GET["random"]) ? $_GET["random"] : (isset($_POST["random"]) ? $_POST["random"] : "0");
        $q = "SELECT * FROM mesas where random_id = '$random'";
        $rsl = mysqli_query($con,$q);
        $arr = array();
        $n = mysqli_num_rows($rsl);
        if ($n == 0){
               $arr[0]["result"] = "nop";
        }else{
           while ($r = mysqli_fetch_assoc($rsl)){
              $arr[0]["result"] = "ok";
              $arr[0]["place_location_id"] = $r["place_location_id"];
              $arr[0]["numero_mesa"] = $r["numero_mesa"];
            }
        }
       echo json_encode($arr);
       break; 


       case 'redeem_cupon_v2':
        $parameters = new stdClass();
        $parameters->customer_name = isset($_GET["customer_name"]) ? $_GET["customer_name"] : (isset($_POST["customer_name"]) ? $_POST["customer_name"] : "");
        $parameters->customer_phone = isset($_GET["customer_phone"]) ? $_GET["customer_phone"] : (isset($_POST["customer_phone"]) ? $_POST["customer_phone"] : "");
        $parameters->customer_username = isset($_GET["customer_username"]) ? $_GET["customer_username"] : (isset($_POST["customer_username"]) ? $_POST["customer_username"] : "");
        $parameters->cupon_code = isset($_GET["cupon_code"]) ? $_GET["cupon_code"] : (isset($_POST["cupon_code"]) ? $_POST["cupon_code"] : "");
        $parameters->cupon_name = isset($_GET["cupon_name"]) ? $_GET["cupon_name"] : (isset($_POST["cupon_name"]) ? $_POST["cupon_name"] : "");
        $parameters->place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        $parameters->place_location_id = isset($_GET["place_location_id"]) ? $_GET["place_location_id"] : (isset($_POST["place_location_id"]) ? $_POST["place_location_id"] : "0");
        $parameters->device = isset($_GET["device"]) ? $_GET["device"] : (isset($_POST["device"]) ? $_POST["device"] : "0");
        $parameters->user = isset($_GET["user"]) ? $_GET["user"] : (isset($_POST["user"]) ? $_POST["user"] : "0");
        $prequery = "SELECT * FROM cupon_redeem WHERE cupon_code = '$parameters->cupon_code' AND customer_username = '$parameters->customer_username'";
        $rsl = mysqli_query($con,$prequery);
        $n = mysqli_num_rows($rsl);
        if($n == 0){
                            $query = "
                INSERT INTO `cupon_redeem` (
                    `cupon_redeem_id`, 
                    `customer_name`, 
                    `customer_email`, 
                    `customer_phone`,
                    `customer_username`,
                    `cupon_code`,
                    `place_id`,
                    `place_location_id`,
                    `deleted`,
                    `usuario`,
                    `device`
                    ) 
                VALUES (
                    NULL, 
                    '$parameters->customer_name', 
                    '', 
                    '$parameters->customer_phone',
                    '$parameters->customer_username',
                    '$parameters->cupon_code',
                    '$parameters->place_id',
                    '$parameters->place_location_id',
                    '0', 
                    '$parameters->user',
                    '$parameters->device'
                );";

        $result = mysqli_query($con, $query);
        if ($result === true) { 
            echo 1;
                }  else{
                  echo 0;
           }
        }else{
            echo -1;
        }

       break;
    }