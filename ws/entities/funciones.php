

<?php

function get_status($parameters){
    global $con;
    $query = "SELECT * FROM status WHERE status_id = $parameters->status AND status_table = '$parameters->table' ";

    $sth = mysqli_query($con, $query);
    $result = mysqli_fetch_assoc($sth);

    return $result==null? new stdClass() : (object)$result;
}

function sendPushNotification($gcm_key, $message) {

// Replace with the real server API key from Google APIs
    $apiKey = "AIzaSyBsOOsegOrDfjkQFRv47GksXwkmPV540u0";

// Replace with the real client registration IDs
    $registrationIDs = array($gcm_key);

// Message to be sent
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
    echo $result;
//print_r($result);
//var_dump($result);
}

function sendPushNotificationAndroidUser($token, $parameters) {

#API access key from Google API's Console
    //define( "API_ACCESS_KEY", "$parameters->fcm_key" ); //AIzaSyCa0kkExuuATqIguaIKDwBdAMPqeVtDtmo NICHAS
    $registrationIds = $token;

#prep the bundle
    $msg = array
          (
        "body"  => "$parameters->body",
        "title" => "$parameters->title",
        "sound" => "notify1",
        "android_channel_id" => "channel1" 
          );
$data = array(
    "contentType" => "$parameters->cType",
    "content-available" => "1",
    "body"  => "$parameters->body",
    "title" => "$parameters->title",
    "sound" => "notify1",
    //"android_channel_id" => "channel1",
);
    $fields = array
            (
                "to"  => $registrationIds,
                "data" => $data
            );
    
    
    $headers = array
            (
                'Authorization: key=' . $parameters->fcm_key,
                'Content-Type: application/json'
            );

#Send Reponse To FireBase Server    
    $ch = curl_init();
    curl_setopt( $ch,CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send' );
    curl_setopt( $ch,CURLOPT_POST, true );
    curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
    curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
    curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
    curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
    $result = curl_exec($ch );
    curl_close( $ch );

        //var_dump($fields);

        //var_dump($headers);

      //  echo $result;

#Echo Result Of FireBase Server
    return $result;
}

function sendPushNotificationiOS($gcm_key, $message) {
  /* We are using the sandbox version of the APNS for development. For production
        environments, change this to ssl://gateway.push.apple.com:2195 */
        $apnsServer = 'ssl://gateway.push.apple.com:2195';
        /* Make sure this is set to the password that you set for your private key
        when you exported it to the .pem file using openssl on your OS X */
        $privateKeyPassword = '';
        /* Put your own message here if you want to */
        //$message = 'Has Recibido Una Nueva Orden';
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
            echo "Could not send the message<br/>";
        }
        else {
            echo "Successfully sent the message<br/>";
        }
        fclose($connection);
}

function sendemailsNotification($gcm_key, $message) {
    
}

function Notification_placeid($place_id) {
    global $con;
    $query = "SELECT u.mac_id FROM subscriber s \n"
            . "JOIN username u on u.username = s.user_id\n"
            . "WHERE s.place_id = '$place_id'\n"
            . "AND recieve_notification = 1 ";

    $sth = mysqli_query($con, $query);
    $rows = array();
    $message = 'This is a notification';

    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
        echo "Mac id: " . $r['mac_id'] . $message . "\n";
//sendPushNotification($r['mac_id'], $message);    
    }
// print json_encode($rows);
}

function massive_notifications_place($place_id, $message) {
    global $con;
    $query = "
            SELECT u.gcmToken
            FROM `username` u
            INNER JOIN (SELECT s.user_id FROM `subscriber` s WHERE s.desirable = '1' AND s.place_id = '$place_id') s ON (u.username = s.user_id)
            ";

    $sth = mysqli_query($con, $query);
    $rows = array();

    while ($r = mysqli_fetch_assoc($sth)) {
//   echo 'gcmToken: ';
//echo $r['gcmToken'];
        sendPushNotification($r['gcmToken'], $message);
    }
}

function update_place_token($parameters) {
    global $con;
    $query = "DELETE FROM `place_tokens` WHERE `uuid` = '$parameters->uuid' AND `place_id` = '$parameters->place_id' ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        $query = "INSERT INTO `place_tokens` (
            `id`, 
            `uuid`, 
            `token`, 
            `place_id`, 
            `platform`
        ) VALUES (
            NULL, 
            '$parameters->uuid', 
            '$parameters->token', 
            '$parameters->place_id', 
            '$parameters->platform'
        );";

        $s_result = mysqli_query($con, $query);
        if ($s_result === true) {
            return 1;
        } else {
            return 'err';
            return mysqli_error($con);
        }
    } else {
        return mysqli_error($con);
    }

}

function push_place_tokens($parameters) {
    global $con;
    $query = "
            SELECT token, platform
            FROM `place_tokens` 
            WHERE `place_id` = '$parameters->place_id' AND `status` = '1'
            ";

    $sth = mysqli_query($con, $query);
    $rows = array();

    $place = get_place_by_place_id($parameters);

    $parameters->fcm_key = $place->fcm_key;

    $result = mysqli_query($con, $query);

    if ($result === false) return 9;

    while ($r = mysqli_fetch_assoc($sth)) {
        if($r["platform"] === "Android")
            sendPushNotificationAndroidUser($r["token"], $parameters);
        else
            sendPushAppleFerbyStore($r["token"], $parameters->body);
    }
}


function massive_emails_place($place_id, $message, $image, $subject, $logo) {
    global $con;
    $query = "
    SELECT ue.email
    FROM `username` u
    JOIN `username_email` ue on u.username = ue.username
    INNER JOIN (SELECT s.user_id FROM `subscriber` s WHERE s.desirable = '1' AND s.place_id = '$place_id') s ON (u.username = s.user_id)
    ";
    $namelFotoV = "";
    if ($image != 0) {
        $fileRoute = uploadedFileUrl($image);
        $namelFotoV = $fileRoute['name'];
        $imgoption = 1;
        $imgurl = 'https://app.almacenesxtra.com/img/' . $namelFotoV;
    } else {
        $imgoption = 0;
        $imgurl = '';
    }
    $sth = mysqli_query($con, $query);
    $i = 0;
    $it = 0;
    $n = mysqli_num_rows($sth);
    $to = '';
    $tofile = 'contacts-place-' . $place_id;
    $output = shell_exec('touch /var/www/html/arch/' . $tofile);
    echo $n . " Correos a enviar <br/><br/>";
    while ($r = mysqli_fetch_assoc($sth)) {
        if ($i < 100) {
            $to = $to . " ," . filter_var($r['email'], FILTER_VALIDATE_EMAIL);
            $i++;
        }
        if ($i == 100) {
            $to = substr($to, 2);
            $output = shell_exec('cd /var/www/html/arch && echo ' . $to . '> ' . $tofile);
            echo $output;
            $c = 'bash /var/www/html/mail.sh ' . $tofile . ' "' . $subject . '" ' . $imgoption . ' "' . $imgurl . '" "' . $message . '"' . ' "' . $logo . '"';
            $output = shell_exec($c);
            echo $c;
            echo $output;
            echo '<br /><br />' . $i . ' ITERACIONES INTERVALO<br />';
            $i = 0;
            $to = '';
            $it += 100;
        }
        if ($n % 100 != 0) {
            if ($i == $n - $it) {
                $to = substr($to, 1);
                $c = 'bash /var/www/html/mail.sh ' . $tofile . ' "' . $subject . '" ' . $imgoption . ' "' . $imgurl . '" "' . $message . '"' . ' "' . $logo . '"';
                $output = shell_exec($c);
                echo $output;
                echo '<br /><br />' . $i . ' ULTIMAS ITERACIONES <br />';
            }
        }
    }
    $output = shell_exec('cd /var/www/html/arch && echo " " > ' . $tofile);
}

//function massive_emails_place() {
//
//    echo 'entro a massive emails funciones';
//    $salida = shell_exec('sendEmail -o tls=no -f degradiz@stolz-engineering.com -bcc jsuazo@stolz-engineering.com, degradiz
//@stolz-engineering.com, ffunez@stolz-engineering.com, djgradiz@gmail.com  -s smtp-relay.gmail.com:587 -xu degradiz@stolz-engineering.com -xp catedradefensa -u "Hello from sendEmail" -m "Hola este es un correo enviado desde ferby massive emails function"');
//    echo "<pre>$salida</pre>";
//}
//
function valid_image($img) {
    $check = getimagesize($img["tmp_name"]);
    if ($check !== false) {
        return 'true';
    } else {
        return 'false';
    }
}

function select_conv_bam($place_location) {
    global $con;
    global $ip;
    $query = "SELECT bd.bill_detail_id, d.desk_name, bd.final_conv, bd.qty, bd.bill_detail_price as price, bd.comment
FROM bill_detail bd
JOIN menu m ON m.menu_id = bd.menu_id
JOIN bill b ON b.bill_id = bd.bill_id
JOIN desk d ON d.desk_id = b.desk_id
JOIN place_location pl ON pl.place_location_id = d.place_location_id
WHERE bd.status = 2
AND pl.place_location_id = $place_location  AND TIMESTAMPDIFF(HOUR,bd.submit_time,NOW()) < 12 ORDER BY bd.bill_detail_id DESC";
    $sth = mysqli_query($con, $query);
    $rows = array();
    $arr1 = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        array_push($rows, $r);
    }
    $queryDom = "SELECT bill_id,nombre, telefono1,email,direccion FROM `bill` WHERE place_id = $place_location and status = 6";
    $sthDom = mysqli_query($con, $queryDom);
    $rowsDom = array();
    $i = 0;
    while ($rDom = mysqli_fetch_assoc($sthDom)) {
        $bill_id = $rDom['bill_id'];
        $rowsDom[$i]['bill_id'] = $rDom['bill_id'];
        $rowsDom[$i]['nombre'] = $rDom['nombre'];
        $rowsDom[$i]['telefono1'] = $rDom['telefono1'];
        $rowsDom[$i]['email'] = $rDom['email'];
        $rowsDom[$i]['direccion'] = $rDom['direccion'];
        $rowsDom[$i]['pedido'] = array();
        $queryDomDet = "SELECT bd.bill_detail_id, bd.final_conv, bd.qty,bd.bill_detail_price as price, bd.comment
FROM bill_detail bd 
JOIN menu m ON m.menu_id = bd.menu_id JOIN bill b ON b.bill_id = bd.bill_id 
JOIN username u ON u.username = bd.username
WHERE b.bill_id = $bill_id AND bd.status <> -1";
        $sthDomDet = mysqli_query($con, $queryDomDet);
        while ($rDomDet = mysqli_fetch_assoc($sthDomDet)) {
            array_push($rowsDom[$i]['pedido'], $rDomDet);
        }
        $i++;
    }
    $arr1['mesas'] = $rows;
    $arr1['domicilio'] = $rowsDom;
    print json_encode($arr1);
}

function notifyUser($email, $status, $bill_id) {
    global $con;

    if ($status == 7) {
        $message = '"Hola! te informamos que tu solicitud ha sido recibida  \n ¿Te gustó Ferby? Visita www.myferby.com ID de Seguimiento: ' . $bill_id . '"';
        $c = 'bash /var/www/html/simpleMail.sh ' . $email . '  "Notificacion de Pedido"  ' . $message;
        // $c = 'bash /var/www/html/simpleMail.sh '.$rows['email'].' '; 
        $output = shell_exec($c);
    }
    if ($status == 8) {
        $message = '"Hola! Gracias por usar las aplicaciones Ferby. Te informamos que tu solicitud ha sido finalizada! \n ¿Te gustó Ferby? Visita www.myferby.com ID de Seguimiento: ' . $bill_id . '"';
        $c = 'bash /var/www/html/simpleMail.sh ' . $email . ' "Notificacion de Pedido" ' . $message;
        // $c = 'bash /var/www/html/simpleMail.sh '.$rows['email'].' '; 
        $output = shell_exec($c);
    }
}

function getAllServices($place_id, $tipo_menu) {
    $getCatMenu = array();
    $select_menu_rest = array();
    $getPromos = array();
    $select_place_images = array();
    $select_options = array();
    $ALL_SERIVCES = array();
    global $con;
    $query = "SELECT c.* from category c JOIN menu m on m.category_id = c.category_id WHERE c.place_id = '$place_id' AND m.status = 1 GROUP BY c.category_id";
    $sth = mysqli_query($con, $query);
    $rows = array();
    $array1 = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows['category_id'] = $r['category_id'];
        $rows['name'] = $r['name'];
        $rows['category_description'] = $r['category_description'];
        $rows['category_img'] = $r['category_img'];
        $rows['category_type'] = $r['category_type'];
        $rows['category_home'] = $r['category_home'];
        $rows['super_category'] = $r['super_category'];
        $rows['status'] = $r['status'];
        array_push($array1, $rows);
    }
    $encode = utf8_converter($array1);
    $getCatMenu = $array1;
    // SELECT REST MENU-----------------------------
    global $ip;
    $firtQuery = "SELECT c.category_id,c.name FROM category c WHERE c.status = 1 AND c.place_id = '$place_id'";
    $firstResult = mysqli_query($con, $firtQuery);
    $mainJson = array();
    $cats = array();
    $plates = array();
    while ($row = mysqli_fetch_assoc($firstResult)) {
        $cat_id = $row['category_id'];
        $cats['category_id'] = $row['category_id'];
        $cats['name'] = $row['name'];
        $cats['category_id'] = $row['category_id'];
        $cats['plates'] = array();
        if ($tipo_menu == 0) {
            $secondQuery = "select * from menu m where m.category_id = '$cat_id' AND m.status <> 0 ORDER BY m.menu_id DESC";
        } else {
            $secondQuery = "select * from menu m where m.tipo_menu != $tipo_menu AND m.category_id = '$cat_id' AND m.status <> 0 ORDER BY m.menu_id DESC";
        }
        $secondResult = mysqli_query($con, $secondQuery);
        $row_count = mysqli_num_rows($secondResult);
        //echo " cat: ".$cats['name'].' count menu: '.$row_count."\n";
        if ($row_count > 0) {
            while ($row2 = mysqli_fetch_assoc($secondResult)) {
                $plates['id'] = $row2['menu_id'];
                $plates['name'] = $row2['name'];
                $plates['tipo_menu'] = $row2['tipo_menu'];
                $plates['menu_price'] = $row2['menu_price'];
                $plates['menu_points'] = $row2['menu_points'];
                $plates['img'] = $ip . '/img/' . $row2['img'];
                $plates['name'] = $row2['name'];
                $plates['description'] = $row2['description'];
                $plates['price'] = $row2['price'];
                $plates['status'] = $row2['status'];
                $plates['menu_promotion'] = $row2['menu_promotion'];
                $plates['menu_stock'] = $row2['menu_stock'];
                $plates['menu_category_id'] = $cats['category_id'];
                $plates['category_name'] = $row['name'];
                array_push($cats['plates'], $plates);
            }
            array_push($mainJson, $cats);
        }
    }
    $select_menu_rest = $mainJson;
    // getPromos-----------------------------
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
    $getPromos = $finalArray;

    // select_place_images-----------------------------
    $q = "SELECT CONCAT('$ip','/img/', i.img ) AS img_url, i.image_id, i.menu_id, i.label
        FROM menu m
        INNER JOIN category c ON m.category_id = c.category_id
        INNER JOIN images i ON m.menu_id = i.menu_id 
        WHERE c.place_id = '$place_id' ";
    $sth = mysqli_query($con, $q);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    $select_place_images = $rows;
    // select_options-----------------------------

    $query = "SELECT o.* FROM options o
JOIN menu m  ON m.menu_id = o.menu_id
JOIN category c ON c.category_id = m.category_id
JOIN place p ON p.place_id = c.place_id
WHERE p.place_id = '$place_id'";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    $select_options = $rows;



    $ALL_SERIVCES['getCatMenu'] = $getCatMenu;
    $ALL_SERIVCES['select_menu_rest'] = $select_menu_rest;
    $ALL_SERIVCES['getPromos'] = $getPromos;
    $ALL_SERIVCES['select_place_images'] = $select_place_images;
    $ALL_SERIVCES['select_options'] = $select_options;
    print json_encode($ALL_SERIVCES);
    // echo '[{"business_name":"Sushi","business_logo":"41c2119b194fd9dbe7cb1a4b40aba3da--sushi-design-sushi-ideas-cfcde1ae8303147b.jpg","business_background1":"2cf262980239ba13ecd83a4c41de7c68-c4cac6eb2745c823.jpg","business_background2":"sushi-backgrounds_112713348_82-3c59471734c486e0.jpg","button_color_theme":"rgb(0, 0, 0)","home_square_color":"rgb(128, 0, 0)"}]';
}

function sendCustomEmail($email, $message, $name, $phone) {
    $c = 'bash /var/www/html/simpleMail.sh joseandres.suazo@gmail.com  "Notificacion de Contacto"  "' . $message . '\n NOMBRE: ' . $name . '\n EMAIL: ' . $email . '\n NUMERO: ' . $phone . '"';
    // $c = 'bash /var/www/html/simpleMail.sh '.$rows['email'].' '; 
    $output = shell_exec($c);
}

function send_recovery_code($email, $recovery_code) {
    $c = 'bash /var/www/html/simpleMail.sh '.$email.'  "Codigo de recuperacion de cuenta: "  "' . $recovery_code . '"';
    $output = shell_exec($c);
}

function notify_redeem_store($parameters){
    global $con;
    $setting = new stdClass();

    $query = "SELECT * 
    FROM place_location  
    WHERE place_location_id = '$parameters->place_location_id'";
    $sth = mysqli_query($con, $query);
    $result = mysqli_fetch_assoc($sth);

    $string_emails = $result['email'];

    $emails = explode(',', $string_emails); //split string into array seperated by ', '

    foreach($emails as $email) //loop over values
    {

        $body = "Se ha redimido un cupon con el nombre: ".$parameters->cupon_name." para el cliente: ".$parameters->customer_name." con el correo: ".$parameters->customer_email;
        send_email($email, "Cupon redimido!", $body);
    }
}


function send_email($email, $title, $message){
    $c = 'bash /var/www/html/simpleMail.sh '.$email.'  "'. $title . ' "  "' . $message . '"';
    $output = shell_exec($c);
}

function insert_new_ev_user($name){
        global $con;
            $query = "INSERT INTO `events_user` (`id_user`, `name_user`) VALUES (NULL, '$name');";
            $result = mysqli_query($con, $query);
            if ($result == TRUE) {
                echo mysqli_insert_id($con);
            } else {
                echo mysqli_error($con);
            }
    
}

function select_event_posts($limit){
   
        global $con;
        $query = "SELECT * FROM `events_posts` p JOIN `events_user` u ON u.id_user = p.id_user ORDER BY id DESC limit $limit";
        $sth = mysqli_query($con, $query);
        $rows = array();
        while ($r = mysqli_fetch_assoc($sth)) {
            $rows[] = $r;
        }
        print json_encode($rows);
    
}

function insert_post_img($img,$txt,$id){
    global $con;
	$fileRoute = uploadedFileUrlEventos($img);
    $namelFotoV = $fileRoute['name'];
	$query = " INSERT INTO `events_posts` (`id`, `id_user`, `excert`, `img`, `loves`) VALUES (NULL, '$id', '$txt', '$namelFotoV', '');";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
     
        echo 1;
    } else {
        echo '0';
    }
}

function insert_post_text($txt,$id){
    global $con;
	$query = " INSERT INTO `events_posts` (`id`, `id_user`, `excert`, `img`, `loves`) VALUES (NULL, '$id', '$txt', '', '');";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo 1;
    } else {
        echo '0';
    }
}

function select_my_post($id){
    global $con;
    $query = "SELECT * FROM `events_posts` p JOIN `events_user` u ON u.id_user = p.id_user  WHERE u.id_user = '$id'  ORDER BY id DESC";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function delete_post($id){
    global $con;
    $query = "DELETE FROM `events_posts` WHERE id = $id";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}


function love_post($parameters){

    global $con;

    $post = get_post($parameters->id);

    $accumulated_loves = $post["loves"] + 1;

    $query = "
    UPDATE events_posts 
    SET loves = '$accumulated_loves' 
    WHERE id = '$parameters->id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } else {
        return mysqli_error($con);
    }
}

function dislove_post($parameters){

    global $con;

    $post = get_post($parameters->id);

    if($post["loves"] <= 0)
        return 0;

    $accumulated_loves = $post["loves"] - 1;

    $query = "
    UPDATE events_posts 
    SET loves = '$accumulated_loves' 
    WHERE id = '$parameters->id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } else {
        return mysqli_error($con);
    }
}

function get_post($id){
    global $con;
    $query = "SELECT * FROM events_posts WHERE id = '$id' ";

    $sth = mysqli_query($con, $query);
    $result = mysqli_fetch_assoc($sth);

    return $result==null? new stdClass() : $result;

}


