<?php
    // Replace with the real server API key from Google APIs
    $apiKey = "AIzaSyBsOOsegOrDfjkQFRv47GksXwkmPV540u0";

    // Replace with the real client registration IDs
    $registrationIDs = array('ez5Yz1ZzNqc:APA91bH8yWHEPpk1-uBWqyy_rAalJAC_XAarWtPqMUG2uXbbPalnnbxRkDxXHy4hDgLyvwXGwhHqCfk2-VCArPN7cCiHu0O2TPPgkRMUgbE08tNDl6z09UaBFpfC680yMnpDdDR_b7B9');

    // Message to be sent
    $message = "Este es un mensaje de prueba";

    // Set POST variables
    $url = 'https://fcm.googleapis.com/fcm/send';

    $fields = array(
        'registration_ids' => $registrationIDs,
        'data' => array(
            "message" => $message, 
            "sound" => "notify",
            "priority" => "high",
            'android_channel_id' => 'channel1'
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
?>