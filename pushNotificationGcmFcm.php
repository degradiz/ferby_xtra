<?php

#API access key from Google API's Console
    define( 'API_ACCESS_KEY', 'AIzaSyBsOOsegOrDfjkQFRv47GksXwkmPV540u0' );
    $registrationIds = $_GET['id'];

#prep the bundle
    $apiKey = "AIzaSyBsOOsegOrDfjkQFRv47GksXwkmPV540u0";

    // Replace with the real client registration IDs
    $registrationIDs = array($registrationIds);

    // Message to be sent
    $message = "DOMICILIO! Has recibido uno nueva orden channel id por aqui?!";

    // Set POST variables
    $url = 'https://android.googleapis.com/gcm/send';

    $fields = array(
        'registration_ids' => $registrationIDs,
        'data' => array("message" => $message, "sound" => "notify"),
    );
    $headers = array(
        'Authorization: key=' . $apiKey,
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

#Echo Result Of FireBase Server
echo $result;
