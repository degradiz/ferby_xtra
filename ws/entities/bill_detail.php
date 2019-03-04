<?php

function get_bill_detail($bill_detail_id){
    global $con;
    $bill_detail = new stdClass();

    $billDetailQuery = "SELECT * FROM bill_detail WHERE bill_detail_id = '$bill_detail_id' ";
    $sth = mysqli_query($con, $billDetailQuery);
    $result = mysqli_fetch_assoc($sth);
    
    $bill_detail->bill_id = $result['bill_id'];
    $bill_detail->username = $result['username'];
    $bill_detail->bill_detail_id = $result['bill_detail_id'];
    $bill_detail->menu_id = $result['menu_id'];
    $bill_detail->status = $result['status'];
    $bill_detail->qty = $result['qty'];

    return $bill_detail;
}

function get_bill_detail_list($bill_id){
    global $con;

    $billDetailQuery = "
        SELECT bd.*, m.name AS product_name, m.category_id, m.description, m.img AS product_img, m.menu_points, m.menu_price, m.menu_stock, m.price, m.tipo_menu
        FROM bill_detail bd
        INNER JOIN menu m ON (bd.menu_id = m.menu_id)
        WHERE bill_id = '$bill_id'
    ";
    $sth = mysqli_query($con, $billDetailQuery);

    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }

    return $rows;
}

function insert_Bill_Detail($menu_id, $bill_id, $option_id, $username, $comment, $qty, $price, $cncOptions, $img) {
    global $con;
    
    $opts = explode(",", $option_id);
    $l = sizeof($opts);
    $optquery = "SELECT option_conversion,option_name,cod_option FROM options WHERE menu_id = $menu_id";
    $optReslt = mysqli_query($con, $optquery);
    $concatConv = "";
    $rows = array();
    while ($ropts = mysqli_fetch_assoc($optReslt)) {
        array_push($rows, $ropts);
    }
    $lOpts = sizeof($rows);
    for ($i = 0; $i < $l; $i++) {
        $c1 = str_replace(" ", "", $opts[$i]);
        for ($y = 0; $y < $lOpts; $y++) {
            $c2 = str_replace("+", "", $rows[$y]['option_name']);
            $c2 = str_replace(" ", "", $c2);
            if ($c2 == $c1) {

                if ($rows[$y]['option_conversion'] != '') {
                    $concatConv .= $rows[$y]['option_conversion'] . ',';
                }
                break;
            }
        }
    }

    $optquery2 = "SELECT conversion FROM menu WHERE menu_id = $menu_id LIMIT 1";
    $optReslt2 = mysqli_query($con, $optquery2);
    while ($ropts2 = mysqli_fetch_assoc($optReslt2)) {
        if (trim($ropts2['conversion']) == '') {
            $concatConv = substr($concatConv, 0, -1);
        } else {
            $concatConv .= $ropts2['conversion'];
        }
    }
        $namelFotoV = 0;
        if ($img != 0) {
            $namelFotoV = "";
            $fileRoute = uploadedFileUrl($img);
            $namelFotoV = $fileRoute['name'];
        }

        $RESmenu_id = mysqli_real_escape_string($con, $menu_id);
        $RESbill_id = mysqli_real_escape_string($con, $bill_id);
        $RESoption_id = mysqli_real_escape_string($con, utf8_encode($option_id));
        $RESusername = mysqli_real_escape_string($con, $username);
        $REScomment = mysqli_real_escape_string($con, utf8_encode($comment));
        $RESqty = mysqli_real_escape_string($con, $qty);
        $RESprice = mysqli_real_escape_string($con, $price);
        $RESconcatConv = mysqli_real_escape_string($con, $concatConv);
        $REScncOptions = mysqli_real_escape_string($con, $cncOptions);

        $query = "INSERT INTO `bill_detail` (`bill_detail_id`, `menu_id`, `bill_id`, `status`, `option_id`, `username`, `comment`, `qty`, `bill_detail_price`,`final_conv`,`final_opts`,`img`) VALUES (NULL, '$RESmenu_id', '$RESbill_id', '1', '$RESoption_id', '$RESusername', '$REScomment', '$RESqty', '$RESprice','$RESconcatConv','$REScncOptions','$namelFotoV');";
        $result = mysqli_query($con, $query);
        if ($result === TRUE) {
            echo 1;
            $menu = get_menu($menu_id);

            $bill = get_bill($bill_id);

            $bill_points = ($menu->menu_points)*$RESqty+$bill->bill_points;
            update_bill_points($bill_points, $bill_id);

            $table = "SELECT `desk_id` FROM `bill` WHERE `bill_id` = $bill_id LIMIT 1";
            $sthTable = mysqli_query($con, $table);
            $desk_id = mysqli_fetch_assoc($sthTable);
            if ($desk_id['desk_id'] != 120) {
                //HASTA QUE QUIERAN NOTIFICACIONES DE NUEVO getWaiters($bill_id);
                //HASTA QUE QUIERAN NOTIFICACIONES DE NUEVO getManagers($bill_id);
            }
        } else {
            mysqli_error($con);
        }

}

function delete_bill_detail($bill_detail_id) {
    global $con;
    $query = "DELETE FROM bill_detail WHERE bill_detail_id = $bill_detail_id ";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo 1;
    } else {
        echo '0';
    }
}

function suppress_img($id) {
    global $con;

    $imgQuery = "SELECT img FROM `bill_detail` WHERE `bill_detail_id` = $id;";
    $imgResult = mysqli_query($con, $imgQuery);
    $imgArray = mysqli_fetch_assoc($imgResult);
    if ($imgArray['img'] == '') {
        echo 1;
    } else {
        delete_file($imgArray['img']);
        $query = "UPDATE `bill_detail` SET `img` = '11' WHERE `bill_detail_id` = $id;";
        $result = mysqli_query($con, $query);
        if ($result === TRUE) {
            echo 1;
        } else {
            echo '0';
        }
    }
}

function update_bill_Image($img, $bill_detail_id) {
    global $con;
    $namelFotoV = 0;
    if ($img != 0) {
        $namelFotoV = "";
        $fileRoute = uploadedFileUrl($img);
        $namelFotoV = $fileRoute['name'];
    }
    $query = "UPDATE `bill_detail` SET `img` = '$namelFotoV' WHERE `bill_detail`.`bill_detail_id` = $bill_detail_id;";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo 1;
    } else {
        echo '0';
    };
}

function update_bill_detail($bill_detail_id, $menu_id, $bill_id, $option_id, $comment, $qty, $price, $cncOptions) {
    global $con;
    $prevQuery = "SELECT b.bill_id 
    FROM bill b
    WHERE b.bill_id = $bill_id AND b.status != 0
    AND TIMESTAMPDIFF(MINUTE , b.time, CURRENT_TIMESTAMP( ) ) < 60";
    $sth = mysqli_query($con, $prevQuery);
    $n = mysqli_num_rows($sth);
    $opts = explode(",", $option_id);
    $l = sizeof($opts);
    $optquery = "SELECT option_conversion,option_name,cod_option FROM options WHERE menu_id = $menu_id";

    $optReslt = mysqli_query($con, $optquery);

    $concatConv = "";
    $rows = array();
    while ($ropts = mysqli_fetch_assoc($optReslt)) {
        array_push($rows, $ropts);
    }
    $lOpts = sizeof($rows);
    for ($i = 0; $i < $l; $i++) {
        $c1 = str_replace(" ", "", $opts[$i]);
        for ($y = 0; $y < $lOpts; $y++) {
            $c2 = str_replace("+", "", $rows[$y]['option_name']);
            $c2 = str_replace(" ", "", $c2);
            if ($c2 == $c1) {

                if ($rows[$y]['option_conversion'] != '') {
                    $concatConv .= $rows[$y]['option_conversion'] . ',';
                }
                break;
            }
        }
    }

    $optquery2 = "SELECT conversion FROM menu WHERE menu_id = $menu_id LIMIT 1";
    $optReslt2 = mysqli_query($con, $optquery2);
    while ($ropts2 = mysqli_fetch_assoc($optReslt2)) {
        if (trim($ropts2['conversion']) == '') {
            $concatConv = substr($concatConv, 0, -1);
        } else {
            $concatConv .= $ropts2['conversion'];
        }
    }
    if ($n == 1) {

        $REScncOptions = mysqli_real_escape_string($con, utf8_encode($cncOptions));
        $RESconcatConv = mysqli_real_escape_string($con, $concatConv);
        $RESprice = mysqli_real_escape_string($con, $price);
        $RESqty = mysqli_real_escape_string($con, $qty);
        $REScomment = mysqli_real_escape_string($con, utf8_encode($comment));
        $RESoption_id = mysqli_real_escape_string($con, utf8_encode($option_id));

        $query = "UPDATE bill_detail 
                  SET option_id = '$RESoption_id', comment = '$REScomment', qty = '$RESqty', bill_detail_price = '$RESprice', final_conv = '$RESconcatConv', final_opts = '$REScncOptions' 
                  WHERE bill_detail_id = '$bill_detail_id'";
        //$query = "INSERT INTO `bill_detail` (`bill_detail_id`, `menu_id`, `bill_id`, `status`, `option_id`, `username`, `comment`, `qty`, `bill_detail_price`,`final_conv`,`final_opts`) VALUES (NULL, '$menu_id', '$bill_id', '1', '$option_id', '$username', '$comment', '$qty', '$price','$concatConv','$concatOps');";
        $result = mysqli_query($con, $query);
        if ($result === TRUE) {
            echo 1;
            $table = "SELECT `desk_id` FROM `bill` WHERE `bill_id` = $bill_id LIMIT 1";
            $sthTable = mysqli_query($con, $table);
            $desk_id = mysqli_fetch_assoc($sthTable);
            if ($desk_id['desk_id'] != 120) {
                //HASTA QUE QUIERAN NOTIFICACIONES DE NUEVO getWaiters($bill_id);
                //HASTA QUE QUIERAN NOTIFICACIONES DE NUEVO getManagers($bill_id);
            }
        } else {
            mysqli_error($con);
        }
    } else {
        echo -1;
    }
}

function update_bill_status_cancel($bill_det_id) {
    global $con;
    $prevQuery = "SELECT status FROM bill_detail WHERE bill_detail_id = '$bill_det_id'";
    $firstResult = mysqli_query($con, $prevQuery);
    $row = mysqli_fetch_assoc($firstResult);
    if ($row['status'] == 1) {
        $query = "UPDATE `bill_detail` SET status = -1 WHERE bill_detail_id = '$bill_det_id';";
        $result = mysqli_query($con, $query);
        if ($result === TRUE) {

            $bill_detail = get_bill_detail($bill_det_id);

            $menu = get_menu($bill_detail->menu_id);

            $bill = get_bill($bill_detail->bill_id);

            $bill_points = $bill->bill_points - ($menu->menu_points)*$bill_detail->qty;
            update_bill_points($bill_points, $bill_detail->bill_id);
            echo 1;
        } else {
            mysqli_error($con);
        }
    } else {
        echo 2;
    }
}

;

function update_bill_status($bill_det_id, $status) {
    global $con;
    $prevQuery = "SELECT status FROM bill_detail WHERE bill_detail_id = '$bill_det_id'";
    $firstResult = mysqli_query($con, $prevQuery);
    $row = mysqli_fetch_assoc($firstResult);
    if ($status == 0) {
        if ($row['status'] < 2) {
            $query = "UPDATE `bill_detail` SET status = 0 WHERE bill_detail_id = '$bill_det_id';";
            $result = mysqli_query($con, $query);
            if ($result === TRUE) {
                echo 1;
            } else {
                mysqli_error($con);
            }
        } else {
            echo 2;
        }
    } else {
        if ($row['status'] != 0) {
            $query = "UPDATE `bill_detail` SET status = $status WHERE bill_detail_id = '$bill_det_id';";
            $result = mysqli_query($con, $query);
            if ($result === TRUE) {
                echo 1;
            } else {
                mysqli_error($con);
            }
        } else {
            echo 3;
        }
    }
}

function select_bill_detail($status) {
    global $con;
    $query = "SELECT b.menu_id, m.name, o.option_name, b.status
FROM `bill_detail`b
JOIN menu m ON m.menu_id = b.menu_id
LEFT OUTER JOIN options o ON o.cod_option = b.option_id
WHERE b.status = '$status'";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function select_bill_detailById($billId) {
    global $con;
    global $ip;
    $query = "SELECT bd.bill_id AS shopping_id, bd.final_opts, bd.menu_id, m.menu_points*qty AS menu_points, CONCAT('$ip/img/',m.img ) AS img, m.name, bd.qty, bd.comment, bd.option_id AS option_name, bd.bill_detail_id, CONCAT('http://graph.facebook.com/',bd.username,'/picture?type=large') as userimg, bd.status, bd.bill_detail_price ,CONCAT('$ip/img/',bd.img ) AS billImg
 FROM bill_detail bd
 JOIN menu m ON m.menu_id = bd.menu_id
 JOIN username u ON u.username = bd.username
 WHERE bd.bill_id = $billId AND bd.status <> -1  
 ORDER BY bd.bill_detail_id DESC";
    $sth = mysqli_query($con, $query);
    $rows = array();
    $bill_points = 0;
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
        $bill_points += $r['menu_points'];
    }
    $update_points = update_bill_points($bill_points,$billId);
    print json_encode($rows);
}

function getBillByPlace($status, $place_location) {
    global $con;
    global $ip;
    $query = "SELECT bd.bill_detail_id, CONCAT('$ip/img/', m.img ) AS img, m.name as name_plate, bd.qty, bd.comment, d.desk_name, bd.option_id AS option_name, u.name,CONCAT('http://graph.facebook.com/',bd.username,'/picture?type=large') as userimg , bd.username , TIMESTAMPDIFF( 
MINUTE , bd.submit_time, CURRENT_TIMESTAMP( ) ) AS minutes_ago
FROM bill_detail bd
JOIN menu m ON m.menu_id = bd.menu_id
JOIN bill b ON b.bill_id = bd.bill_id
JOIN desk d ON d.desk_id = b.desk_id
JOIN place_location pl ON pl.place_location_id = d.place_location_id
JOIN username u ON u.username = bd.username
WHERE bd.status = $status
AND pl.place_location_id = $place_location  AND TIMESTAMPDIFF(HOUR,bd.submit_time,NOW()) < 12 ORDER BY bd.bill_detail_id DESC";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function updateBillDetail($status, $idBill) {
    global $con;
    $pre_query = "SELECT * FROM `bill_detail` WHERE `bill_detail_id` = $idBill and status = -1";
    $sth = mysqli_query($con, $pre_query);
    $n = mysqli_num_rows($sth);
    if ($n == 0) {
        $query = "UPDATE  `bill_detail` SET  `status` =  '$status' WHERE  `bill_detail`.`bill_detail_id` = $idBill";
        $result = mysqli_query($con, $query);
        if ($result === TRUE) {
            notifyUser($email, $status, $idBill);
            echo 1;
            if ($status == 2) {
                //  alertUser($idBill);
            }
        } else {
            echo 0;
        }
    } else {
        echo -1;
    }
}

function alertUser($idBill) {
    global $con;
    global $ip;
    $pre_query = "SELECT u.gcmToken,m.name FROM bill_detail bd , username u, menu m WHERE bd.username = u.username AND bd.bill_detail_id = $idBill AND bd.menu_id = m.menu_id";
    $sth = mysqli_query($con, $pre_query);
    $arr = mysqli_fetch_assoc($sth);
    $gcm_key = $arr['gcmToken'];
    $plate = $arr['name'];

    // Replace with the real server API key from Google APIs
    $apiKey = "AIzaSyBsOOsegOrDfjkQFRv47GksXwkmPV540u0";

    // Replace with the real client registration IDs
    $registrationIDs = array($gcm_key);

    // Message to be sent
    $message = "Ya se recibio tu orden de  $plate";

    // Set POST variables
    $url = 'https://android.googleapis.com/gcm/send';

    $fields = array(
        'registration_ids' => $registrationIDs,
        'data' => array("message" => $message),
    );
    $headers = array(
        'Authorization: key=' . $apiKey,
        'Content-Type: application/json'
    );

    // Open connection
    $ch = curl_init();

    // Set the URL, number of POST vars, POST data
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    //curl_setopt( $ch, CURLOPT_POSTFIELDS, json_encode( $fields));

    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    // curl_setopt($ch, CURLOPT_POST, true);
    // curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));

    // Execute post
    $result = curl_exec($ch);

    // Close connection
    curl_close($ch);
    //echo $result;
    //print_r($result);
    //var_dump($result);
}

function getWaiters($bill_id) {
    global $con;
    $query = "select pu.gcmToken FROM bill_detail bd
JOIN bill b ON bd.bill_id = b.bill_id
JOIN desk d ON d.desk_id = b.desk_id
JOIN place_location pl ON pl.place_location_id = d.place_location_id
JOIN place_users pu on pu.place_loc_Id = pl.place_location_id
WHERE b.bill_id=$bill_id";
    $result = mysqli_query($con, $query);
    $gcm = array();
    while ($r = mysqli_fetch_assoc($result)) {
        array_push($gcm, $r['gcmToken']);
        //notifyWaiter($r['gcmToken']);
    }
    // notifyWaiter($gcm);
}

function getManagers($bill_id) {
    global $con;
    $query = "select pu.gcmToken FROM bill b JOIN desk d ON d.desk_id = b.desk_id JOIN place_location pl ON pl.place_location_id = d.place_location_id JOIN place p on p.place_id = pl.place_id JOIN place_admin_users pu ON pu.place_id = p.place_id where b.bill_id = $bill_id Group By pu.gcmToken";
    $result = mysqli_query($con, $query);
    $gcm = array();
    while ($r = mysqli_fetch_assoc($result)) {
        // array_push($gcm, $r['gcmToken']);
        // notifyWaiter($r['gcmToken']);
    }
    //notifyWaiter($gcm);
}

function getWaitersHomeOrder($place_loc_id) {
    global $con;
    $query = "SELECT * 
     FROM `place_users` 
     WHERE place_loc_id = $place_loc_id ";
    $result = mysqli_query($con, $query);
    // $gcm = array();
    while ($r = mysqli_fetch_assoc($result)) {
        if($r['platform'] == "Android"){
            notifyWaiterDomAndroid($r['gcmToken']);
        }else{
            notifyWaiterDomIOS($r['gcmToken']);
        }
    }
    //   notifyWaiterDom($gcm);
//    $queryManager = "SELECT pau. * 
//FROM place_location pl
//INNER JOIN place_admin_users pau ON ( pl.place_id = pau.place_id ) 
//WHERE pl.place_location_id =16
//AND pau.gcmToken <>  ''";
    $queryManager = "SELECT * 
FROM place_admin_users
WHERE  `place_id` = $place_loc_id";
    //echo '<br>'.'<br>'.$queryManager.'<br>';
    $resultManager = mysqli_query($con, $queryManager);
    //$gcm2 = array();
    while ($rManager = mysqli_fetch_assoc($resultManager)) {
         if($rManager['platform'] == "Android"){
            notifyWaiterDomAndroid($rManager['gcmToken']);
        }else{
            notifyWaiterDomIOS($rManager['gcmToken']);
        }
    }
    // notifyWaiterDom($gcm2);
}

function notifyWaiter($gcm_key) {

    // Replace with the real server API key from Google APIs
    $apiKey = "AIzaSyBsOOsegOrDfjkQFRv47GksXwkmPV540u0";

    // Replace with the real client registration IDs
    $registrationIDs = array($gcm_key);

    // Message to be sent
    $message = "Has recibido uno nueva orden!";

    // Set POST variables
    $url = 'https://android.googleapis.com/gcm/send';

    $fields = array(
        'registration_ids' => $registrationIDs,
        'data' => array("message" => $message),
    );
    $headers = array(
        'Authorization: key=' . $apiKey,
        'Content-Type: application/json'
    );

    // Open connection
    $ch = curl_init();

    // Set the URL, number of POST vars, POST data
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    //curl_setopt( $ch, CURLOPT_POSTFIELDS, json_encode( $fields));

    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    // curl_setopt($ch, CURLOPT_POST, true);
    // curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));

    // Execute post
    $result = curl_exec($ch);

    // Close connection
    curl_close($ch);
    //echo $result;
    //print_r($result);
    //var_dump($result);
}

function notifyWaiterDomAndroid($gcm_key) {
    // Replace with the real server API key from Google APIs
    $apiKey = "AIzaSyBsOOsegOrDfjkQFRv47GksXwkmPV540u0";

    // Replace with the real client registration IDs
    $registrationIDs = array($gcm_key);

    // Message to be sent
    $message = "DOMICILIO! Has recibido uno nueva orden!";

    // Set POST variables
    $url = 'https://android.googleapis.com/gcm/send';

    $fields = array(
        'registration_ids' => $registrationIDs,
        'data' => array(
            "message" => $message, 
            "sound" => "notify",
            "android_channel_id" => "channel1"
        ),
    );
    $headers = array(
        'Authorization: key=' . $apiKey,
        'Content-Type: application/json'
    );

    // Open connection
    $ch = curl_init();

    // Set the URL, number of POST vars, POST data
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    //curl_setopt( $ch, CURLOPT_POSTFIELDS, json_encode( $fields));

    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    // curl_setopt($ch, CURLOPT_POST, true);
    // curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));

    // Execute post
    $result = curl_exec($ch);

    // Close connection
    curl_close($ch);
    //echo $result;
    //print_r($result);
    //var_dump($result);
    // echo $result;
}

function notifyWaiterDomIOS($gcm_key) {
  /* We are using the sandbox version of the APNS for development. For production
        environments, change this to ssl://gateway.push.apple.com:2195 */
        $apnsServer = 'ssl://gateway.push.apple.com:2195';
        /* Make sure this is set to the password that you set for your private key
        when you exported it to the .pem file using openssl on your OS X */
        $privateKeyPassword = '';
        /* Put your own message here if you want to */
        $message = 'Has Recibido Una Nueva Orden';
        /* Pur your device token here */
        $deviceToken = $gcm_key;
        /* Replace this with the name of the file that you have placed by your PHP
        script file, containing your private key and certificate that you generated
        earlier */
        $pushCertAndKeyPemFile = 'pushcert.pem';
        $stream = stream_context_create();
        stream_context_set_option($stream,
        'ssl',
        'passphrase',
        $privateKeyPassword);
        stream_context_set_option($stream,
        'ssl',
        'local_cert',
        $pushCertAndKeyPemFile);
        $connectionTimeout = 20;
        $connectionType = STREAM_CLIENT_CONNECT | STREAM_CLIENT_PERSISTENT;
        $connection = stream_socket_client($apnsServer,
        $errorNumber,
        $errorString,
        $connectionTimeout,
        $connectionType,
        $stream);
        if (!$connection){
        //echo "Failed to connect to the APNS server. Error no = $errorNumber<br/>";
        exit;
        } else {
        //echo "Successfully connected to the APNS. Processing...</br>";
        }
        $messageBody['aps'] = array('alert' => $message,
        'sound' => 'notify.wav',
        'badge' => 2,
        );
        $payload = json_encode($messageBody);
        $notification = chr(0) .
        pack('n', 32) .
        pack('H*', $deviceToken) .
        pack('n', strlen($payload)) .
        $payload;
        $wroteSuccessfully = fwrite($connection, $notification, strlen($notification));
        if (!$wroteSuccessfully){
        //echo "Could not send the message<br/>";
        }
        else {
        //echo "Successfully sent the message<br/>";
        }
        fclose($connection);
}
