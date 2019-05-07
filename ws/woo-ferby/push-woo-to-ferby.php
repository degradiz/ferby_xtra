<?php

function pushWooFerbyOrder($parameters){
	$place_location = get_stores_by_place_id($parameters);
	$parameters->place_location = (object)$place_location[0];

	$parameters->place = (object)get_place_by_place_id($parameters);

	$parameters->placeUsersAndroidIds = getAndroidRegistrationIds($parameters);

	if(empty($place_location))
		return;//NO SE PUEDE CREAR UN BILL NI ENVIAR NOTIFICACION SI NO EXISTE AL MENOS UNA SUCURSAL, ENTONCES DEBE TERMINAR

	convert_woo_ferby_bill($parameters);

	sendFcmFerbyStore($parameters);
}

function getAndroidRegistrationIds($parameters){

	$placeUserIds = getPlaceUsersAndroidIds($parameters);
	$placeAdminIds = getPlaceAdminAndroidIds($parameters);

	$new_array = array_merge($placeUserIds, $placeAdminIds);
	$unique_array = array_unique($new_array);

	return $unique_array;
}

function getPlaceAdminAndroidIds($parameters){
	global $con;

	$place_location_id = $parameters->place_location->place_location_id;

    $query = "
    	SELECT gcmToken, platform 
		FROM  `place_admin_users` 
		WHERE place_id =$place_location_id
    ";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
    	if($r["platform"] === "Android")
        	$rows[] = $r["gcmToken"];
        else
        	sendPushAppleFerbyStore($parameters, $r["gcmToken"]);
    }

    //var_dump($rows);

    return $rows;
}

function getPlaceUsersAndroidIds($parameters){
	global $con;

    $query = "
    	SELECT pu.gcmToken, pu.platform 
		FROM  `place_users` pu
		INNER JOIN place_location pl ON ( pu.place_loc_Id = pl.place_location_id ) 
		INNER JOIN place p ON ( pl.place_id = p.place_id ) 
		WHERE p.place_id =$parameters->place_id
    ";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
    	if($r["platform"] === "Android")
        	$rows[] = $r["gcmToken"];
        else
        	sendPushAppleFerbyStore($parameters, $r["gcmToken"]);
    }

	//echo $query;

    return $rows;
}



function sendFcmFerbyStore($parameters){
    define( 'API_ACCESS_KEY', 'AAAAiJmtLSI:APA91bFoMJqc7HUWGgNlmb7cwLNrY8Crqqg523ZOVtakOJ1Bu8WHJ0gSLihwiFQWM0mlDBgDLJpwaYIsC-Z-PZ7KjCOFrz3g9vgpbkSSiDewwzQbkyv_bppeBT9Q13cyr7llVsCrRZ9cvQAs4SxnMocb7o_cV2G7qw' );
    // $registrationIds = 'fxumClYDVvo:APA91bHrZ0l-9NnXsMQYmuofri-1D0M2wnBAKFYp1Epk1JsiRdFTxHk8H83_EvrVY6rSQ7ojBXoW6ficxL67XJMA1ZD4AMtWeMRhB1f9Muxt5E1Dj4UQ6twcGT-A8jP9LI8yiz-Nze4o';

    $registrationIds = $parameters->placeUsersAndroidIds;

    $title = $parameters->place->business_name;

     $msg = array
          (
		"body" 	=> "$parameters->message",
		"title"	=> "$title",
      	"sound" => "notify" 
        //"android_channel_id" => "channel1"
          );


	$fields = array
			(
				'registration_ids'		=> $registrationIds,
				'data'	=> $msg
			);
	
	
	$headers = array
			(
				'Authorization: key=' . API_ACCESS_KEY,
				'Content-Type: application/json'
			);

	$ch = curl_init();
	curl_setopt( $ch,CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send' );
	curl_setopt( $ch,CURLOPT_POST, true );
	curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
	curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
	curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
	curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
	$result = curl_exec($ch );
	curl_close( $ch );

	return $result;

}

function sendPushAppleFerbyStore($parameters, $gcm_key) {

	$title = $parameters->place->business_name;
	/* We are using the sandbox version of the APNS for development. For production
    environments, change this to ssl://gateway.push.apple.com:2195 */
    $apnsServer = 'ssl://gateway.push.apple.com:2195';
    /* Make sure this is set to the password that you set for your private key
    when you exported it to the .pem file using openssl on your OS X */
    $privateKeyPassword = '';
    /* Put your own message here if you want to */
    $message = $title.': '.$parameters->message;
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

function convert_woo_ferby_bill($parameters) {
    global $con;

    $place_location_id = $parameters->place_location->place_location_id;

    $query = "INSERT INTO `bill` (`bill_id`, `desk_id`, `status`, `nombre`, `telefono1`, `email`, `direccion`, `place_id`, `bill_url`, `delivery_date`) 
    VALUES (
    NULL, 
    '120', 
    '6',
	'$parameters->nombre',
	'$parameters->telefono1',
	'$parameters->email',
	'$parameters->direccion',
	'$place_location_id',
	'$parameters->bill_url',
	NOW()
	);";

    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
      return 1;  
    } 

    return 0;
}


