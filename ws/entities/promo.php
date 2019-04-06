<?php
 
function username_cupon_redeems($parameters){
    global $con;
    $query = "
    SELECT COUNT(cupon_code) AS redeems 
    FROM `cupon_redeem` 
    WHERE customer_username = '$parameters->customer_username' AND cupon_code = '$parameters->cupon_code' ";

    $sth = mysqli_query($con, $query);
    $num = mysqli_num_rows($sth);
    //echo $num;
    if ($num > 0) {
        $result = mysqli_fetch_assoc($sth);
        //print_r($result);
        return $result['redeems'];
    }

    return 0; 
}

function insert_cupon_redeem($parameters) {
    global $con;

    $parameters->customer_email = mysqli_real_escape_string($con, $parameters->customer_email);
    $parameters->customer_name = mysqli_real_escape_string($con, $parameters->customer_name); 
    $parameters->customer_phone = mysqli_real_escape_string($con, $parameters->customer_phone);
    $parameters->customer_username = mysqli_real_escape_string($con, $parameters->customer_username);
    $parameters->cupon_code = mysqli_real_escape_string($con, $parameters->cupon_code);
    $parameters->place_id = mysqli_real_escape_string($con, $parameters->place_id);
    $parameters->place_location_id = mysqli_real_escape_string($con, $parameters->place_location_id);

    $query = "
            INSERT INTO `cupon_redeem` (
                `cupon_redeem_id`, 
                `customer_email`, 
                `customer_name`, 
                `customer_phone`,
                `customer_username`,
                `cupon_code`,
                `place_id`,
                `place_location_id`
                ) 
            VALUES (
                NULL, 
                '$parameters->customer_email', 
                '$parameters->customer_name', 
                '$parameters->customer_phone',
                '$parameters->customer_username',
                '$parameters->cupon_code',
                '$parameters->place_id',
                '$parameters->place_location_id'
            );";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        notify_redeem_store($parameters);
        return 1;
    } 
    
    return mysqli_error($con);
    
}

function asign_uuid_generated($parameters) {
    global $con;
    //query para obtener los cupones existentes a utilizar su cupon_code
    $query = "SELECT * FROM cupon_code WHERE place_id = '$parameters->place_id' ORDER BY 1 DESC";
    $sth = mysqli_query($con, $query);
    $asigned = 0;
  
    // por cada cupon_code se recorre 
    while ($r = mysqli_fetch_assoc($sth)) {
        // se obtiene una fila si existe un cupon generado asignado a un uuid para validarlo como ya asignado
        $cuponcode = $r["cupon_code"] ;
        $prequery = "SELECT * FROM cupon_generated WHERE '$cuponcode' LIKE LEFT(cupon_code,7)  AND uuid = '$parameters->uuid' ORDER BY cupon_generated.id_generated ASC LIMIT 1";
        $presth = mysqli_query($con, $prequery);

        // Si no devuelve filas entonces se puede asignar uno con uuid vacio y cupon_code 
        
        if ($presth->num_rows === 0) {
                // Se obtiene el id_generated que se asignara el uuid
                $query2 = "SELECT * FROM cupon_generated WHERE '$cuponcode' like LEFT(cupon_code,7)  AND uuid IS NULL ORDER BY cupon_generated.id_generated ASC LIMIT 1";
                $sth2 = mysqli_query($con, $query2);
                // se recorre para poder actualizarlo y asignarle el uuid
                 while ($r2 = mysqli_fetch_assoc($sth2)) {
                    // Se actualiza el uuid enviado como parametro
                    $idgenerated = $r2["id_generated"];
                    $query = "UPDATE cupon_generated 
                              SET uuid = '$parameters->uuid' 
                              WHERE id_generated = '$idgenerated'
                              ";

                    $result = mysqli_query($con, $query);
                    // se haecho del resultado
                    if ($result === true) {
                            
                            $asigned += 1;
                            update_asignados($cuponcode);
                    } 
                    else {
                            echo mysqli_error($con);
                    }

                 }// Fin del while de asignación y actualización del uuid
                 
        }// fin del if si no se retorno alguna fila con el uuid ya asignado

    }// Fin del while de recorrido en cupon_generated por cada cupon_code existente en cupon_code
    
    
    
   return $asigned;
}


function select_promotions($parameters){
    global $con;

    $query = "SELECT * FROM promotion WHERE place_id = '$parameters->place_id' ORDER BY 1 DESC";
    $sth = mysqli_query($con, $query);

    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }

    return $rows;
}

function select_cupon_code($parameters){
    global $con;

    $query = "SELECT * FROM cupon_code WHERE place_id = '$parameters->place_id' ORDER BY 1 DESC";
    $sth = mysqli_query($con, $query);

    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }

    return $rows;
}

function select_cupon_code_uuid($parameters){
    //asignar si no tiene asignado
    asign_uuid_generated($parameters);
    // Obtener la lista de cupones
    global $con;

    $query = "SELECT * FROM cupon_code LEFT JOIN  cupon_generated on cupon_code.cupon_code like LEFT(cupon_generated.cupon_code , 7) WHERE cupon_code.place_id = '$parameters->place_id' and cupon_generated.uuid = '$parameters->uuid' and cupon_generated.state = 0 ORDER BY 1 DESC";
    $sth = mysqli_query($con, $query);

    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }

    return $rows;
}

function delete_cupon_code($parameters) {//

    global $con;
    $imgQuery = "SELECT cupon_img AS img FROM `cupon_code` WHERE `cupon_code` = '$parameters->cupon_code';";
    $imgResult = mysqli_query($con, $imgQuery);
    $imgArray = mysqli_fetch_assoc($imgResult);
    delete_file($imgArray['img']);
    $query = "DELETE FROM `cupon_code`  WHERE  `cupon_code` = '$parameters->cupon_code';";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }

}

function switch_cupon_code($parameters) {//
    global $con;

    $query = "
    UPDATE cupon_code 
    SET cupon_status = '$parameters->cupon_status' 
    WHERE cupon_code = '$parameters->cupon_code'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function set_cupon_description($parameters) {
    global $con;

    $query = "
    UPDATE cupon_code 
    SET cupon_description = '$parameters->cupon_description' 
    WHERE cupon_code = '$parameters->cupon_code'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function add_cupon_cant($parameters) {
    global $con;

    $query = " SELECT cupon_code FROM `cupon_generated` where cupon_code LIKE '" . $parameters->cupon_code . "%' order by id_generated DESC LIMIT 1";

    $result = $con->query($query);
    $rest = 0;
    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
          //  echo "cupon_code: " . $row["cupon_code"]."<br>";
            $rest = substr($row["cupon_code"], 8,-3);
        }
    } else {
        echo "0 results";
    }


    //echo $rest;
    


    if($rest>0){
        adicionarCupones($parameters->cupon_cant,$parameters->cupon_code,$rest);
    }


    $query2 = " SELECT count(cupon_code) total FROM `cupon_generated` where cupon_code like '" . $parameters->cupon_code . "%'";

    $result2 = $con->query($query2);
    $total = 0;
    if ($result2->num_rows > 0) {
        // output data of each row
        while($row = $result2->fetch_assoc()) {
          //  echo "total: " . $row["total"]."<br>";
            $total = $row["total"];
        }
    } else {
        echo "0 results";
    }

    $query3 = "
    UPDATE cupon_code 
    SET cupon_cant = $total 
    WHERE cupon_code = '$parameters->cupon_code'
    ";

    $result = mysqli_query($con, $query3);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
    


}


function set_cupon_name($parameters) {
    global $con;

    $query = "
    UPDATE cupon_code 
    SET cupon_name = '$parameters->cupon_name' 
    WHERE cupon_code = '$parameters->cupon_code'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}


function update_valid_thru($parameters) {
    global $con;

    $query = "
    UPDATE cupon_code 
    SET valid_thru = '$parameters->valid_thru' 
    WHERE cupon_code = '$parameters->cupon_code'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function set_cupon_image($parameters) {
    global $con;

    $namelFotoV = "";

    if ($parameters->img != "") {
        $fileRoute = uploadedFileUrl($parameters->img);
        $namelFotoV = $fileRoute['name'];
    }

    $query = "UPDATE cupon_code SET cupon_img = '$namelFotoV' WHERE cupon_code = '$parameters->cupon_code'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function update_redimidos($cupon_code){
    global $con;

    $query = "
    UPDATE cupon_code 
    SET redimidos = (select count(cupon_code) from cupon_generated where SUBSTRING(cupon_code, 1, 7) =  '$cupon_code' and state = 1) 
    WHERE cupon_code = '$cupon_code'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } else {
        echo mysqli_error($con);
    }

}

function update_asignados($cupon_code){
    global $con;

    $query = "
    UPDATE cupon_code 
    SET asignados = (select count(cupon_code) from cupon_generated where SUBSTRING(cupon_code, 1, 7) =  '$cupon_code' and uuid is not null) 
    WHERE cupon_code = '$cupon_code'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } else {
        echo mysqli_error($con);
    }

}

function add_cupon_redeem($parameters){
    global $con;

    $accumulated_redeem = $parameters->cupon_redeems + 1;

    $query = "
    UPDATE cupon_code 
    SET cupon_redeems = '$accumulated_redeem' 
    WHERE cupon_code = '$parameters->cupon_code'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } else {
        echo mysqli_error($con);
    }

}

function add_expired_attempt($parameters){
    global $con;

    $accumulated_attempt = $parameters->expired_attempts + 1;

    $query = "
    UPDATE cupon_code 
    SET expired_attempts = '$accumulated_attempt' 
    WHERE cupon_code = '$parameters->cupon_code'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } else {
        echo mysqli_error($con);
    }

}

function register_scan($parameters){
    if($parameters->valid_days < 0)
        return add_expired_attempt($parameters);

    return add_cupon_redeem($parameters);
}


function scan_cupon_code($parameters){
    global $con;

    $query = "SELECT TIMESTAMPDIFF(DAY,NOW(),c.valid_thru) AS valid_days, c.* FROM cupon_code c WHERE c.cupon_code = '$parameters->cupon_code' ";
    $sth = mysqli_query($con, $query);
    $rows = [];

    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
        $parameters->valid_days = $r["valid_days"];
        $parameters->expired_attempts = $r["expired_attempts"];
        $parameters->cupon_redeems = $r["cupon_redeems"];
        register_scan($parameters);
    }

    return $rows;
}

function create_cupon($parameters) {
    global $con;

    
    $namelFotoV = "";

    if ($parameters->img != "") {
        $fileRoute = uploadedFileUrl($parameters->img);
        $namelFotoV = $fileRoute['name'];
    }

    $parameters->cupon_code = generate_cupon_code($parameters);
    echo $parameters->cupon_discount;
    $query = "
            INSERT INTO `cupon_code` (
                `cupon_id`, 
                `place_id`, 
                `cupon_name`, 
                `cupon_description`, 
                `valid_thru`,
                `valid_time`,
                `cupon_points`,
                `cupon_code`,
                `cupon_type`,
                `cupon_cant`, 
                `cupon_img`,
                `cupon_id_departamento`,
                `cupon_discount`
                ) 
            VALUES (
                NULL, 
                '$parameters->place_id', 
                '$parameters->cupon_name', 
                '$parameters->cupon_description', 
                '$parameters->valid_thru',
                '$parameters->valid_time',
                '$parameters->cupon_points',
                '$parameters->cupon_code',
                '$parameters->cupon_type',
                '$parameters->cupon_cant',
                '$namelFotoV',
                '$parameters->cupon_id_departamento',
                '$parameters->cupon_discount'
            );";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        //echo "entro al result";
        generarCupones($parameters->cupon_cant,$parameters->cupon_code);
        generarCuponesXtra($parameters->cupon_cant,$parameters->cupon_code,$parameters->cupon_name,$parameters->cupon_discount,$parameters->cupon_id_departamento);

        return 1;
    } 
    
    return mysqli_error($con);
    
}

function random_strings($length_of_string) 
{ 
  
    // String of all alphanumeric character 
    $str_result = '0123456789'; 
  
    // Shufle the $str_result and returns substring 
    // of specified length 
    return substr(str_shuffle($str_result),  
                       0, $length_of_string); 
} 

function generarCupones($cant,$cupon_code){
    
    global $con;
            //echo "va al for";
       for ($i = 0; $i < $cant; $i++){
       $code_generated = $cupon_code.'-'.$i.random_strings(3);
        $query = "
            INSERT INTO `cupon_generated` (
                
                `cupon_code`
                ) 
            VALUES (                
                '$code_generated'
            );";

            $result = mysqli_query($con, $query);
           // echo $query;
           // echo $result;

        }

       // echo "paso del for";
        return mysqli_error($con);

}


function generarCuponesXtra($cant,$cupon_code,$cupon_name,$cupon_discount,$department){
    


    require_once '../nusoap/lib/nusoap.php';

        //$wsdl="http://localhost:53168/operaciones.asmx?WSDL";
        $wsdl="http://138.0.230.5:53168/operaciones.asmx?WSDL";
        $client=new nusoap_client($wsdl,true);

        $result=$client->call('Insert',array('cupon_code'=>$cupon_code,'nombre'=>$cupon_name,'descuento'=>$cupon_discount,'cantidad'=>$cant,'id_departamento'=>$department));

        //$result=$client->call('Exist',array('cupon_code'=>'a001'));

       //var_dump($result);

        //echo $result['InsertResult'];
    print_r($result['InsertResult']) ;




}

function adicionarCupones($cant,$cupon_code,$lastgenerated){
    
    global $con;

       $correlativo = $lastgenerated + 1;
            //echo "va al for";
       for ($i = 0; $i < $cant; $i++){
       $code_generated = $cupon_code.'-'.$correlativo.random_strings(3);
        $query = "
            INSERT INTO `cupon_generated` (
                
                `cupon_code`
                ) 
            VALUES (                
                '$code_generated'
            );";

            $result = mysqli_query($con, $query);
           // echo $query;
           // echo $result;
            $correlativo += 1;
        }

        //update_asignados($cupon_code);

       // echo "paso del for";
        return mysqli_error($con);

}

function generate_cupon_code($parameters){
    global $con;
    global $salt;

    $aIQuery = "
    SELECT COUNT(c.cupon_id)+1 AS id
    FROM cupon_code c 
    WHERE c.place_id = '$parameters->place_id' ";

    $sth = mysqli_query($con, $aIQuery);
    $result = mysqli_fetch_assoc($sth);

    $code = random_strings(5);
    //$code = substr($code, 0, 3);
    //$strcode = strtoupper($code);
//echo $str;
    $new_code = $code.'-'.$result['id'];

    return $new_code;
}

function insert_promo($place_id, $img, $title, $description, $type) {
    global $con;
    $namelFotoV = "";
    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];
    $query = "INSERT INTO `promotion` (`promo_id`, `place_id`, `img`, `title`, `description`,`type`) VALUES (NULL, '$place_id', '$namelFotoV', '$title', '$description','$type');";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo '1';
    } else {
        echo mysqli_error($con);
    }
}

function update_promo($promo_id, $img, $title, $description, $type) {
    global $con;
    $extra = "";
    if ($img != "0") {
        if (valid_image($img) == 'false') {
            echo -1;
            exit;
        }
        $imgQuery = "SELECT img FROM `promotion` WHERE `promo_id` = '$promo_id';";
        $imgResult = mysqli_query($con, $imgQuery);
        $imgArray = mysqli_fetch_assoc($imgResult);
        delete_file($imgArray['img']);
        $fileRoute = uploadedFileUrl($img);
        $namelFotoV = $fileRoute['name'];
        $extra = ", `img` = '$namelFotoV'";
    }
    $query = "UPDATE  `promotion` SET  `title` = '$title', `description` = '$description', type = '$type' $extra WHERE  `promo_id` = '$promo_id'";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function delete_promotion($promo_id) {
    global $con;
    $imgQuery = "SELECT img FROM `promotion` WHERE `promo_id` = '$promo_id';";
    $imgResult = mysqli_query($con, $imgQuery);
    $imgArray = mysqli_fetch_assoc($imgResult);
    delete_file($imgArray['img']);
    $query = "DELETE FROM `promotion`  WHERE  `promo_id` = '$promo_id'";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function selectPromo($place_id) {
    global $con;
    global $ip;
    $query = "Select * from promotion where place_id = '$place_id'";
    $sth = mysqli_query($con, $query);
    $rows = array();
    $finalArray = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows['promo_id'] = $r['promo_id'];
        $rows['place_id'] = $r['place_id'];
        $rows['img'] = $ip . '/img/' . $r['img'];
        $rows['title'] = $r['title'];
        $rows['description'] = $r['description'];
        $rows['type'] = $r['type'];
        array_push($finalArray, $rows);
    }
    $utf = utf8_converter($finalArray);
    echo json_encode($utf);
}

function getFiltPromos($filt) {
    global $con;
    global $ip;
    $conc = '';
    $places = json_decode($filt);
    $i = 0;
    foreach ($places as $p) {
        if ($i == 0) {
            $conc .= ' WHERE place_id = ' . $p->place_id . ' ';
        } else {
            $conc .= 'OR place_id = ' . $p->place_id . ' ';
        }
        $i++;
    }
    $query = "Select * from promotion " . $conc;
    $sth = mysqli_query($con, $query);
    $rows = array();
    $finalArray = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows['promo_id'] = $r['promo_id'];
        $rows['place_id'] = $r['place_id'];
        $rows['img'] = $ip . '/img/' . $r['img'];
        $rows['title'] = $r['title'];
        $rows['description'] = $r['description'];
        $rows['type'] = $r['type'];
        array_push($finalArray, $rows);
    }
    $utf = utf8_converter($finalArray);
    echo json_encode($utf);
};



function selectAllPromo($place_id) {
    global $con;
    global $ip;
    $query = "Select * from promotion where place_id = '$place_id'";
    $sth = mysqli_query($con, $query);
    $rows = array();
    $finalArray = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows['promo_id'] = $r['promo_id'];
        $rows['place_id'] = $r['place_id'];
        $rows['img'] = $ip . '/img/' . $r['img'];
        $rows['title'] = $r['title'];
        $rows['description'] = $r['description'];
        $rows['type'] = $r['type'];
        array_push($finalArray, $rows);
    }
    print json_encode($finalArray);
}

function select_ferby_promos() {
    global $con;
    global $ip;
    $query = "SELECT p.* 
              FROM app_details ad 
              INNER JOIN promotion p ON (ad.app_place_id = p.place_id)
              WHERE ad.app_deleted = '0'
              ORDER BY RAND()
              LIMIT 50
              ";
    $sth = mysqli_query($con, $query);
    $rows = array();
    $finalArray = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows['promo_id'] = $r['promo_id'];
        $rows['place_id'] = $r['place_id'];
        $rows['img'] = str_replace(' ','%20',$ip . '/img/'.$r['img'] );
        $rows['title'] = $r['title'];
        $rows['description'] = $r['description'];
        $rows['type'] = $r['type'];
        array_push($finalArray, $rows);
    }
    print json_encode($finalArray);
}

function selectCoupons($place_id) {
    global $con;
    global $ip;
    $query = "Select * from promotion where place_id = '$place_id' AND type = 2";
    $sth = mysqli_query($con, $query);
    echo mysqli_error($con);
    $rows = array();
    $finalArray = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows['promo_id'] = $r['promo_id'];
        $rows['place_id'] = $r['place_id'];
        $rows['img'] = $ip . '/img/' . $r['img'];
        $rows['title'] = $r['title'];
        $rows['description'] = $r['description'];
        array_push($finalArray, $rows);
    }
    print json_encode($finalArray);
}
