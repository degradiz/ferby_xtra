<?php

function select_bill_by_id($bill_id){
    $bill = get_bill($bill_id);
    print json_encode($bill);
}

function untrack_order($parameters) {
    global $con;
    $query = "UPDATE bill
              SET track_id = ''
              WHERE bill_id = '$parameters->bill_id'";
    
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        return 1;
    } else {
        return 0;
    };
}

function track_id_orders($parameters){
    global $con;
    $query = "
        SELECT b.* 
        FROM bill b
        INNER JOIN place_location pl ON (pl.place_location_id = b.place_id)
        INNER JOIN place p ON (pl.place_id = '$parameters->place_id')  
        WHERE b.track_id = '$parameters->track_id' 
        GROUP BY b.bill_id
        HAVING COUNT(*) > 1
        ORDER BY b.bill_id DESC
        ";
    //echo $query;
    $sth = mysqli_query($con, $query);
    $bills = array();
    while ($b = mysqli_fetch_assoc($sth)) {
        $b["bill_detail"] = get_bill_detail_list($b["bill_id"]);
        $bills[] = $b;
    }
    return $bills;

}

function get_user_orders($parameters){
    global $con;
    $query = "
        SELECT b.* 
        FROM bill b
        INNER JOIN place_location pl ON (pl.place_location_id = b.place_id)
        INNER JOIN place p ON (pl.place_id = '$parameters->place_id')  
        WHERE b.bill_username = '$parameters->bill_username' 
        GROUP BY b.bill_id
        HAVING COUNT(*) > 1
        ORDER BY b.bill_id DESC
        ";
    //echo $query;
    $sth = mysqli_query($con, $query);
    $bills = array();
    while ($b = mysqli_fetch_assoc($sth)) {
        $b["bill_detail"] = get_bill_detail_list($b["bill_id"]);
        $bills[] = $b;
    }
    return $bills;

}

function pushFerbyOrder($parameters){
    $place_location = new stdClass();//get_stores_by_place_id($parameters);
    $place_location->place_location_id = $parameters->store_id;
    $parameters->message = "¡Han realizado una orden!";
    $parameters->place_location = (object)$place_location;

    $parameters->place = (object)get_place_by_place_id($parameters);

    $parameters->placeUsersAndroidIds = getAndroidRegistrationIds($parameters);

    if(empty($place_location))
        return;//NO SE PUEDE CREAR UN BILL NI ENVIAR NOTIFICACION SI NO EXISTE AL MENOS UNA SUCURSAL, ENTONCES DEBE TERMINAR

    sendFcmFerbyStore($parameters);

}


function create_order($parameters) {
    global $con;
    $bill_id = 0;
    $query = "
    INSERT INTO `bill` (`bill_id`, `desk_id`, `status`,  
    `bill_username`,
    `track_id`,
    `bill_points`,
    `longitud`,
    `latitud`,
    `place_id`,
    `nombre`,
    `telefono1`,
    `email`,
    `direccion`,
    `bill_token`,
    `delivery_date`
    ) 
    VALUES (NULL, '120', '6', 
    '$parameters->bill_username',
    '$parameters->track_id',
    '$parameters->bill_points',
    '$parameters->longitud',
    '$parameters->latitud',
    '$parameters->store_id',
    '$parameters->nombre',
    '$parameters->telefono1',
    '$parameters->email',
    '$parameters->direccion',
    '$parameters->bill_token',
     NOW()
    );";

    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        $bill_id = mysqli_insert_id($con);
        $parameters->bill_id = $bill_id;
        pushFerbyOrder($parameters);
        return create_bill_detail($parameters);
    } else {
        return $bill_id;//mysqli_error($con);
    }    

}

function create_bill_detail($parameters){
    global $con;
    if($parameters->menu_id == 0){
        $menu = get_first_place_menu($parameters);
        
        if($menu == -1)
            return -1;
    }else{
        $menu["menu_id"] = $parameters->menu_id;
    }

    $RESmenu_id = $menu["menu_id"];
    $RESbill_id = mysqli_real_escape_string($con, $parameters->bill_id);
    $RESusername = mysqli_real_escape_string($con, $parameters->username);
    $REScomment = mysqli_real_escape_string($con, utf8_encode($parameters->comment));
    $RESqty = mysqli_real_escape_string($con, $parameters->qty);
    $RESprice = mysqli_real_escape_string($con, $parameters->price);

    $query = "
    INSERT INTO `bill_detail` (`bill_detail_id`, 
    `menu_id`, 
    `bill_id`, 
    `status`, 
    `username`, 
    `comment`, 
    `qty`, 
    `bill_detail_price`
    ) VALUES (NULL, 
    '$RESmenu_id', 
    '$RESbill_id', 
    '1', 
    '$RESusername', 
    '$REScomment', 
    '$RESqty', 
    '$RESprice'
    );";

    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        return $parameters->bill_id;
    } else {
        return 0;
    }
}

function get_first_place_menu($parameters){
    global $con;
    $query = "
        SELECT m.*
        FROM `category` c
        INNER JOIN menu m ON (c.category_id = m.category_id)
        WHERE c.place_id = '$parameters->place_id' AND c.status = '1' AND m.status = 1
        ORDER BY 1 DESC
        LIMIT 0,1
    ";

    $sth = mysqli_query($con, $query);
    $result = mysqli_fetch_assoc($sth);

    return $result==null? -1 : $result;

}

function insert_bill($desk_id) {
    global $con;
    global $salt;
    $query = "INSERT INTO `bill` (`bill_id`, `desk_id`, `status`) VALUES (NULL, '$desk_id', '1');";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        $str = mysqli_insert_id($con);
        $hash = md5($str . $salt);
        //echo $hash;
        $token = $str . "-" . substr($hash, -3);
        echo $token;
    } else {
        echo '0';
    }
}

function delete_Bill($bill_id) {
    global $con;
    $query = "DELETE FROM bill WHERE bill_id = $bill_id ";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo 1;
    } else {
        echo '0';
    }
}

function delete_image_bill($imgId){
	global $con;
	$imgQuery = "SELECT imgUrl FROM `bill_images` WHERE `imgId` = '$imgId';";
    $imgResult = mysqli_query($con, $imgQuery);
    $imgArray = mysqli_fetch_assoc($imgResult);
    delete_file($imgArray['imgUrl']);
    $query = "DELETE FROM bill_images WHERE imgId = $imgId ";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo 1;
    } else {
        echo '0';
    }
}

function get_bill_images($bill_id){
	global $con;
	global $ip;
	$query = "SELECT CONCAT('$ip','/img/',imgUrl) AS img_url, imgId FROM `bill_images` WHERE bill_id=".$bill_id;
	$sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function insert_bill_qr($desk_id, $place_id, $username) {
    global $con;
    if ($desk_id == 120) {
        $query = "INSERT INTO `bill` (`bill_id`, `desk_id`, `status`,  `bill_username`) VALUES (NULL, '$desk_id', '5', '$username');";
        $result = mysqli_query($con, $query);
        if ($result === TRUE) {
            echo mysqli_insert_id($con);
        } else {
            mysqli_error($con);
        }
    } else {
        $pre_query = "SELECT * FROM desk WHERE desk_id = $desk_id AND place_location_id = $place_id";
        $sth = mysqli_query($con, $pre_query);
        $n = mysqli_num_rows($sth);
        if ($n != 0) {
            $query = "INSERT INTO `bill` (`bill_id`, `desk_id`, `status`,  `bill_username`) VALUES (NULL, '$desk_id', '1', '$username');";
            $result = mysqli_query($con, $query);
            if ($result === TRUE) {
                echo mysqli_insert_id($con);
            } else {
                mysqli_error($con);
            }
        } else {
            echo '-1';
        }
    }
}
         
function update_bill($status, $bill_id) {
    global $con;
    $query = "UPDATE `bill` SET `status` = '$status' WHERE `bill_id` = '$bill_id'";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {   
        $query2 = "select * FROM bill where bill_id = $bill_id ";
        $result2 = mysqli_query($con, $query2);
        while ($r = mysqli_fetch_assoc($result2)) {
            notifyUser($r['email'], $status, $bill_id);
            $place_location_id = $r["place_id"];
            $parameters = new stdClass();
            $parameters->token = $r["bill_token"];
            $parameters->bill_id = $r["bill_id"];
            $parameters->status = $r["status"];
            $parameters->place_location_id = $place_location_id;
            configure_store_order($parameters);
        }
        echo 1;
        if($status=='8'){
            $bill = get_bill($bill_id);
            $username = $bill->bill_username;
            $points = $bill->bill_points;
            $place_location_id = $bill->place_id;

            $place = get_place_by_place_location($place_location_id);
            if($place->stock_order == 1){
                update_bill_stock($bill->bill_id);
                //$menu = get_menu($bill->menu_id);
            }


            if($points > 0)
                accumulate_points($bill_id);
        }
    } else {
        mysqli_error($con);
    }
}

function update_bill_stock($bill_id){
    global $con;
    $bill_detail_list = get_bill_detail_list($bill_id);

    foreach($bill_detail_list as $bill_detail){

        $bill_detail = (object)$bill_detail;
        $menu = get_menu($bill_detail->menu_id);

        if($menu->menu_stock == -1){

            $options_json = $bill_detail->final_opts;
            $options = json_decode($options_json);

            foreach ($options as $cod_option) {
                $option_entity = get_option($cod_option);
                $option_balance = $option_entity->option_stock - $bill_detail->qty;
                $optionQuery = "UPDATE `options` SET `option_stock` = '$option_balance' WHERE `cod_option` = '$option_entity->cod_option'";
                $option_result = mysqli_query($con, $optionQuery);
                if($option_result === TRUE){
                    //echo 'yes';
                }else{
                    //echo mysqli_error($con);
                }
                
            }
        }else if($menu->menu_stock > 0){
            $menu_balance = $menu->menu_stock - $bill_detail->qty;
            $menuQuery = "UPDATE `menu` SET `menu_stock` = '$menu_balance' WHERE `menu_id` = '$menu->menu_id'";
            echo $menuQuery;
            $menu_result = mysqli_query($con, $menuQuery);
            if($menu_result === TRUE){
                //return 'yes';
            }else{
                //return mysqli_error($con);
            }
        }
      
    }
}

function reduce_option_stock($bill_detail){
    global $con;
    $optionQuery = "UPDATE `option` SET `status` = '$status' WHERE `bill_id` = '$bill_id'";
    $result = mysqli_query($con, $query);
}

function update_bill_points($bill_points, $bill_id) {
    global $con;
    $query = "UPDATE bill
              SET bill_points = '$bill_points'
              WHERE bill_id = '$bill_id'";
    
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        return '1';
    } else {
        return '0';
    };
}

function update_bill_details($status, $bill_id) {
    global $con;
    $query = "UPDATE `bill_detail` SET `status` = '$status' WHERE `bill_id` = '$bill_id' AND `status` = '1'";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo 1;
    } else {
        mysqli_error($con);
    }
}

function update_bill_home_order($bill_id, $longitud, $latitud, $nombre, $telefono1, $email, $direccion, $tipo_pago, $place_loc_id, $uuid, $rtn, $deliveryDate,$balance, $username, $track_id, $bill_points,  $bill_token) {
    global $con;
    $status = 6;
    $RESnombre = mysqli_real_escape_string($con, $nombre);
    $RESemail = mysqli_real_escape_string($con, $email);
    $REStelefono1 = mysqli_real_escape_string($con, $telefono1);
    $RESdireccion = mysqli_real_escape_string($con, $direccion);
    $RESusername = mysqli_real_escape_string($con, $username);
    if ($deliveryDate == 0) {
        $deliveryDate = 'NOW()';
        if ($deliveryDate == 'NOW()') {
            $date = 'NOW()';
        } else {
            $noquotes = substr($deliveryDate, 1, -1);
            $time = strtotime($noquotes);
            if (strtotime($noquotes) < strtotime(date('Y-m-d'))) {
                $date = 'NOW()';
            } else {
                $date = $deliveryDate;
            }
        }
    } else {
        $date = "'".$deliveryDate."'";
    }
    //echo $date;
    if($bill_points == -1){  
        $query = "
        UPDATE `bill` 
        SET  `bill_token` = '$bill_token',  `status` = '$status', `uuid` = '$uuid' ,`longitud` = '$longitud', `latitud` = '$latitud', `tipo_pago` = '$tipo_pago',
        `nombre` = '$RESnombre', `telefono1` = '$REStelefono1', `email` = '$RESemail', `direccion` = '$RESdireccion' , place_id = $place_loc_id, RTN = '$rtn' , delivery_date = $date , balance = $balance,  
         `time` = CURRENT_TIMESTAMP, 
        `bill_username` = '$RESusername', 
        `track_id` = '$track_id'
         WHERE `bill_id` = '$bill_id'";
    }else{
        $query = "
        UPDATE `bill` 
        SET `bill_token` = '$bill_token', `bill_points` = '$bill_points', `status` = '$status', `uuid` = '$uuid' ,`longitud` = '$longitud', `latitud` = '$latitud', `tipo_pago` = '$tipo_pago',
        `nombre` = '$RESnombre', `telefono1` = '$REStelefono1', `email` = '$RESemail', `direccion` = '$RESdireccion' , place_id = $place_loc_id, RTN = '$rtn' , delivery_date = $date , balance = $balance,  
         `time` = CURRENT_TIMESTAMP, 
        `bill_username` = '$RESusername', 
        `track_id` = '$track_id'
         WHERE `bill_id` = '$bill_id'";
    }   

    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo 1;
        getWaitersHomeOrder($place_loc_id);
        notifyEmail($place_loc_id, $nombre, $telefono1, $email, $direccion, $bill_id, $date, $email);
    } else {
        echo mysqli_error($con);
    }
}


function update_Bill_Header($bill_id,$nombre,$telefono1,$email,$direccion,$rtn,$deliveryDate) {
    global $con;
    $RESnombre = mysqli_real_escape_string($con, $nombre);
    $RESemail = mysqli_real_escape_string($con, $email);
    $REStelefono1 = mysqli_real_escape_string($con, $telefono1);
    $RESdireccion = mysqli_real_escape_string($con, $direccion);
    if ($deliveryDate == 0) {
        $date = "";
    } else {
        $date = ", delivery_date = '$deliveryDate'";
    }
    $query = "UPDATE `bill` SET `nombre` = '$RESnombre', `telefono1` = '$REStelefono1', `email` = '$RESemail', `direccion` = '$RESdireccion', RTN = '$rtn' $date WHERE `bill_id` = '$bill_id'";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo 1;
    } else {
        echo $query;
        echo mysqli_error($con);
    }
}




function selectDomicilio($place_id, $status) {
    global $con;
    $query = "SELECT * , TIMESTAMPDIFF(MINUTE,`time`,NOW()) as min FROM `bill` WHERE place_id = $place_id and status = $status";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function select_domicilio_place($admin) {
    global $con;
    $query = "SELECT b.* , TIMESTAMPDIFF(MINUTE,b.time,NOW()) as min , pl.name AS Sucursal
     FROM bill b
     JOIN place_location pl ON (pl.place_location_id = b.place_id)
     JOIN place p ON (p.place_id = pl.place_id)
     WHERE p.auth LIKE '%$admin%' and b.status = 6";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function select_historial_domicilio_place($place_id) {
    global $con;
    $query = "SELECT b.* , TIMESTAMPDIFF(MINUTE,b.time,NOW()) as min , pl.name AS Sucursal 
             FROM bill b 
             JOIN place_location pl ON (pl.place_location_id = b.place_id) 
             JOIN place p ON (p.place_id = pl.place_id) 
             WHERE b.place_id = $place_id and b.status IN (7,8)
             ORDER BY b.status ASC, b.delivery_date ASC";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function select_all_domicilio_place($place_id) {
    global $con;
    $query = "SELECT b.* , TIMESTAMPDIFF(MINUTE,b.time,NOW()) as min , pl.name AS Sucursal, p.place_id AS admin_id 
             FROM bill b 
             JOIN place_location pl ON (pl.place_location_id = b.place_id) 
             JOIN place p ON (p.place_id = pl.place_id) 
             WHERE b.place_id = $place_id and b.status IN (7,8) AND TIMESTAMPDIFF(HOUR,b.delivery_date,NOW()) < 36
             ORDER BY b.status ASC, b.delivery_date ASC";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function select_all_domicilio_union($admin_id) {
    global $con;
    $query = "SELECT b.* , TIMESTAMPDIFF(MINUTE,b.time,NOW()) as min , pl.name AS Sucursal, p.place_id AS admin_id 
             FROM bill b 
             JOIN place_location pl ON (pl.place_location_id = b.place_id) 
             JOIN place p ON (p.place_id = pl.place_id) 
             WHERE p.auth LIKE '%$admin_id%' AND b.status IN (7,8) AND  TIMESTAMPDIFF(HOUR,b.time,NOW()) < 36
             ORDER BY b.status ASC,  b.delivery_date ASC";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function  updateBalance($bill_id){
	global $con;
    $query = "UPDATE `bill` SET `balance` = '0' WHERE `bill_id` = $bill_id;";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo 1;
    } else {
        mysqli_error($con);
    }
}

function selectDomiciliouuid($uuid) {
    global $con;
    global $ip;
    $query = "SELECT b.* , TIMESTAMPDIFF(DAY,b.time,NOW()) as days, pl.name, p.place_id , CONCAT('$ip/img/', p.business_logo ) as logo  FROM bill b JOIN place_location pl ON pl.place_location_id = b.place_id JOIN place p on pl.place_id = p.place_id WHERE b.uuid = '$uuid' ORDER BY b.bill_id DESC";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function queryBill($bill_id) {
    global $con;
    global $ip;
   // $query = "SELECT CONCAT('$ip/img/', bd.img ) as img2 ,b.delivery_date, bd.bill_detail_id, CONCAT('$ip/img/', bd.img ) as billImg ,CONCAT('$ip/img/', m.img ) AS img, m.name as name_plate, bd.qty,bd.bill_detail_price, bd.comment, bd.option_id AS option_name, u.name,CONCAT('http://graph.facebook.com/',bd.username,'/picture?type=large') as userimg , bd.username , TIMESTAMPDIFF( MINUTE , bd.submit_time, CURRENT_TIMESTAMP( ) ) AS minutes_ago FROM bill_detail bd JOIN menu m ON m.menu_id = bd.menu_id JOIN bill b ON b.bill_id = bd.bill_id JOIN username u ON u.username = bd.username WHERE b.bill_id = $bill_id AND bd.status <> -1";
    $query = "SELECT CONCAT('$ip/img/', bd.img ) as img2 ,b.delivery_date, bd.bill_detail_id, CONCAT('$ip/img/', bd.img ) as billImg ,CONCAT('$ip/img/', m.img ) AS img, CONCAT(m.name,' - ', c.name ) as name_plate, bd.qty,bd.bill_detail_price, bd.comment, bd.option_id AS option_name, u.name,CONCAT('http://graph.facebook.com/',bd.username,'/picture?type=large') as userimg , bd.username , TIMESTAMPDIFF( MINUTE , bd.submit_time, CURRENT_TIMESTAMP( ) ) AS minutes_ago FROM bill_detail bd JOIN menu m ON m.menu_id = bd.menu_id JOIN bill b ON b.bill_id = bd.bill_id JOIN username u ON u.username = bd.username JOIN category c ON m.category_id = c.category_id WHERE b.bill_id = $bill_id AND bd.status <> -1";
    
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function selectPlaceLocByBil($bill_id) {
    global $con;
    global $salt;
    $array = explode("-", $bill_id);
    $number = $array[0];
    $hash = md5($number . $salt);
    $salting = substr($hash, -3);

    if ($salting == $array[1]) {
        $query = "SELECT pl.place_location_id 
FROM `bill` b JOIN desk d on d.desk_id = b.desk_id 
JOIN place_location pl on pl.place_location_id = d.place_location_id
WHERE b.bill_id = $number 
LIMIT 1";
        $result = mysqli_query($con, $query);
        $arr = mysqli_fetch_assoc($result);
        echo $arr['place_location_id'];
    } else {
        echo -1;
    }
}

function select_bill_id($bill_id, $pl_id) {
    global $con;
    global $salt;
    $array = explode("-", $bill_id);
    $number = $array[0];

    $hash = md5($number . $salt);

    $salting = substr($hash, -3);

    if ($salting == $array[1]) {
        $query = "SELECT b.* ,d.place_location_id FROM `bill` b JOIN desk d on b.desk_id = d.desk_id WHERE b.bill_id = '$bill_id' AND b.status = '1' AND d.place_location_id = $pl_id AND TIMESTAMPDIFF(MINUTE , b.time, CURRENT_TIMESTAMP( ) ) < 60";
        $sth = mysqli_query($con, $query);
        $n = mysqli_num_rows($sth);
        if ($n == 0) {
            echo 0;
        } else {
            echo 1;
        }
    }
}

function select_bill($place_loc_id) {
    global $con;
    $query = "SELECT d.desk_name, b.bill_id 
FROM bill b
JOIN desk d ON d.desk_id = b.desk_id
JOIN place_location pl ON pl.place_location_id = d.place_location_id
WHERE pl.place_location_id = $place_loc_id
AND b.status = 1
AND TIMESTAMPDIFF(MINUTE , b.time, CURRENT_TIMESTAMP( ) ) < 60 ORDER BY b.bill_id desc";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function dismiss_homeDelivery($bill_id) {
    global $con;

    $bill = get_bill($bill_id);

    if($bill->status === "7"){
        echo 1;
        return 1;
    }

    $query = "UPDATE `bill` SET `status` = '7' WHERE `bill`.`bill_id` = $bill_id;";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        $query2 = "select * FROM bill where bill_id = $bill_id ";
        $result2 = mysqli_query($con, $query2);
        $count = 0;
        while ($r = mysqli_fetch_assoc($result2)) {
            $count = $count + 1;
            //echo 'count: '.$count;
            notifyUser($r['email'], 7, $bill_id);
            $place_location_id = $r["place_id"];
            $parameters = new stdClass();
            $parameters->token = $r["bill_token"];
            $parameters->bill_id = $r["bill_id"];
            $parameters->status = $r["status"];
            $parameters->place_location_id = $place_location_id;
            configure_store_order($parameters);
        }
        echo 1;
    } else {
        echo 0;
        mysqli_error($con);
    }
}

function configure_store_order($parameters){
    $place_location = get_place_location($parameters->place_location_id);
    $place_id = $place_location["place_id"];
    $place = get_place($place_id);

    if($place["notify_bill"]==="1"){
        $parameters->table = 'bill';
        $parameters->fcm_key = $place["fcm_key"];
        $parameters->title = "Orden #".$parameters->bill_id;
        $status = get_status($parameters);
        $parameters->body = $status->status_description;
        sendPushNotificationAndroidUser($parameters->token, $parameters);
    }
}

function insert_Bill_Pass($desk_id, $user, $pass) {
    global $con;
    global $salt;
    $md5pass = md5($pass . $salt);
    $query = sprintf("SELECT * FROM place_location WHERE place_location_id = '%s' AND passkey = '%s';", mysqli_real_escape_string($con, $user), mysqli_real_escape_string($con, $md5pass));
    $result = mysqli_query($con, $query);
    $num = mysqli_num_rows($result);
    if ($num > 0) {
        insert_bill_qr($desk_id, $user);
    } else {
        echo '000-000';
    }
}

function getOtherPlaces($place_loc_id) {
    global $con;
    $place_id_query = "SELECT p.place_id FROM place_location pl
JOIN place p ON pl.place_id = p.place_id 
where pl.place_location_id = $place_loc_id LIMIT 1";
    $pre = mysqli_query($con, $place_id_query);
    $place_id_array = mysqli_fetch_assoc($pre);
    $place_id = $place_id_array['place_id'];
    $query = "SELECT pl.name, pl.place_location_id FROM place_location pl where pl.place_id = $place_id and pl.home_order = 1";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function transfer($place_loc_id, $bill_id) {
    global $con;
    $query = "UPDATE `bill` SET `place_id` = '$place_loc_id' WHERE `bill`.`bill_id` = $bill_id;";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo 1;
        getWaitersHomeOrder($place_loc_id);
    } else {
        mysqli_error($con);
    }
}

function notifyEmail($place_loc_id, $nombre, $telefono1, $email, $direccion, $bill_id, $deliveryDate, $userEmail) {
    global $con;
    global $ip;
    $strDate = '';
    if ($deliveryDate == 'NOW()') {
        $strDate = 'Lo Mas Pronto Posible';
    } else {
        $strDate = substr($deliveryDate, 1, -1);
    }

    $plates = '\n';
    $prequery = "SELECT bd.bill_detail_id, CONCAT('$ip/img/', m.img ) AS img, m.name as name_plate, bd.qty, bd.comment, bd.option_id AS option_name, u.name,CONCAT('http://graph.facebook.com/',bd.username,'/picture?type=large') as userimg , bd.username , TIMESTAMPDIFF( MINUTE , bd.submit_time, CURRENT_TIMESTAMP( ) ) AS minutes_ago FROM bill_detail bd JOIN menu m ON m.menu_id = bd.menu_id JOIN bill b ON b.bill_id = bd.bill_id JOIN username u ON u.username = bd.username WHERE b.bill_id = $bill_id AND bd.status <> -1";
    $presth = mysqli_query($con, $prequery);
    while ($rPre = mysqli_fetch_assoc($presth)) {
        $plateName = $rPre['name_plate'];
        $comment = $rPre['comment'];
        $option_name = $rPre['option_name'];
        $qty = $rPre['qty'];
        $plates .= "\r\nNombre del Producto: " . $plateName . "  ";
        if (strlen($option_name) > 0) {
            $plates .= "\r\nOpciones: " . $option_name . "  ";
        }
        if (strlen($comment) > 0) {
            $plates .= "\r\nComentario: " . $comment . "  ";
        }
        $plates .= "\r\nCantidad: " . $qty . "\r\n ";
    }
    $query = "SELECT pl.email FROM place_location pl WHERE pl.place_location_id = $place_loc_id";
    $sth = mysqli_query($con, $query);
    while ($r = mysqli_fetch_assoc($sth)) {
        if ($place_loc_id == 7) {
            $message = '"NOMBRE: ' . $nombre . ' \n TELEFONO: ' . $telefono1 . ' \n EMAIL: ' . $email . ' \n FECHA: ' . $strDate . ' \n DIRECCION: ' . $direccion . ' \n ' . $plates . ' \n Codigo de Orden: #' . $bill_id . ' \n MOTORISTA:__________________ " ';
        } else {
            $message = '"NOMBRE: ' . $nombre . ' \n TELEFONO: ' . $telefono1 . ' \n FECHA: ' . $strDate . ' \n EMAIL: ' . $email . ' \n DIRECCION: ' . $direccion . ' \n ' . $plates . ' \n Visita https://app.almacenesxtra.com/#/restLogin y accede a la tienda numero ' . $place_loc_id . ' para ver tu orden \n Codigo de Orden: #' . $bill_id . ' \n MOTORISTA:__________________ " ';
            $message2 = '"NOMBRE: ' . $nombre . '\n TELEFONO: ' . $telefono1 . ' \n FECHA: ' . $strDate . ' \n EMAIL: ' . $email . ' \n DIRECCION: ' . $direccion . ' \n ' . $plates . ' \n Codigo de Orden: #' . $bill_id . ' \n ¿Te gusto Ferby? Conocenos en http://www.myferby.com/" ';
        }
        $c = 'bash /var/www/html/simpleMail.sh ' . trim($r['email']) . ' "Has Recibido una Nueva Orden COD: ' . $bill_id . ' " ' . $message;
        // $c = 'bash /var/www/html/simpleMail.sh '.$rows['email'].' '; 
        $d = 'bash /var/www/html/simpleMail.sh ' . $userEmail . ' "Tu Orden Ha Sido Enviada COD: ' . $bill_id . ' " ' . $message2;
        $output = shell_exec($c);
        $output = shell_exec($d);
    }
}


function insertPoints_manually($username,$factura,$place_loc_id,$amt,$tienda) {
    global $con;
    $prequery = "select place_id from place_location where place_location_id = $place_loc_id LIMIT 1";
    $presth = mysqli_query($con, $prequery);
    while ($rPre = mysqli_fetch_assoc($presth)) {
        $place_id = $rPre['place_id'];

        $query = "INSERT INTO `gift_points` (`gift_point_id`, `gift_place_id`, `gift_username`, `gift_points`, `gift_bill_id`, `gift_time`, `idtienda`) VALUES (NULL, '$place_id', '$username', '$amt', '$factura', CURRENT_TIMESTAMP, '$tienda');"; 


        $result = mysqli_query($con, $query);

        $otroQuery = "INSERT INTO `receipt_points` (`receipt_points_id`, `receipt_gift_points`, `receipt_username`, `receipt_place_id`, `receipt_place_location_id`, `receipt_name`, `receipt_place`, `receipt_date`, `deleted`) VALUES (NULL, '$amt', '$username', '$place_id', '$place_loc_id', '', '', CURRENT_TIMESTAMP, '0');";
        mysqli_query($con, $otroQuery);
        
        if ($result === TRUE) {
            echo 1;
            $queryUser = "SELECT fcmToken, platform FROM xtraClientes WHERE identidad = '$username' LIMIT 1";
            $sth = mysqli_query($con, $queryUser);
             while ($r = mysqli_fetch_assoc($sth)) {
                $parameters = new stdClass();
                $parameters->body = "Se Acreditaron $amt puntos a tu app";
                $parameters->title = "Puntos Acreditados";
                $parameters->cTyoe = "x";
                if($r["platform"] == "Android"){
                    sendPushNotificationAndroidUser($r["fcmToken"], $parameters);
                }
           }
        } else {
            mysqli_error($con);
        }
    }
}

function update_motorista($bill_id, $mot) {
    global $con;
    $query = "UPDATE `bill` SET `motorista` = '$mot' WHERE `bill_id` = $bill_id;";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo 1;
    } else {
        mysqli_error($con);
    }
}
