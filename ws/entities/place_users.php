<?php

function notify_unchecked_bills() {
    global $con;
    $bill = new stdClass();
    //b.bill_id, b.status, b.place_id, b.telefono1, b.delivery_date
    $query = "
        SELECT DISTINCT p.place_id, pl.place_location_id
        FROM bill b
        INNER JOIN place_location pl ON (b.place_id = pl.place_location_id AND pl.deleted = '0')
        INNER JOIN place p ON (pl.place_id = p.place_id AND p.status = '1')
        WHERE b.status = '6'
        ";
    $sth = mysqli_query($con, $query);
    $rows = array();
    $pending = false;
    while ($result = mysqli_fetch_assoc($sth)) {
        $bill->place_location_id = $result['place_location_id'];
        $bill->place_id = $result['place_id'];
        // $bill->status = $result['status']; 
        // $bill->place_id = $result['place_id'];
        // $bill->telefono1 = $result['telefono1'];
        // $bill->delivery_date = $result['delivery_date'];
        notify_place($bill);
       // notify_admin($bill);
        //$pending = true;
    }

    //if($pending)
       // notify_admin();

}

function notify_place($bill){
    global $con;
    $query = "
        SELECT * FROM `place_users` WHERE place_loc_Id = '$bill->place_location_id'
        ";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($place = mysqli_fetch_assoc($sth)) {
        echo "<br/><br/> place_loc_id: {$place["place_loc_Id"]} uuid: {$place["uuid"]} Existen ordenes que no han sido marcadas como recibida. {$place["platform"]}<br/>";  
        $message = " Existen ordenes que no han sido marcadas como recibida.";  
        if($place["platform"]=="Android")
            sendPushNotification($place["gcmToken"], $message);
        else
            sendPushNotificationiOS($place["gcmToken"], $message);
    }
}

function notify_admin($bill){
    global $con;
    $query = "SELECT DISTINCT pau.uuid, pau.gcmToken, pau.platform FROM `place_admin_users` pau WHERE molestador = '1' AND place_id = '$bill->place_id'";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($place = mysqli_fetch_assoc($sth)) {
        echo "<br/><br/> Admin: uuid: {$place["uuid"]} Existen ordenes que no han sido marcadas como recibida. {$place["platform"]}<br/>";  
        $message = " Existen ordenes que no han sido marcadas como recibida.";  
        if($place["platform"]=="Android")
            sendPushNotification($place["gcmToken"], $message);
        else
            sendPushNotificationiOS($place["gcmToken"], $message);
    }
};
