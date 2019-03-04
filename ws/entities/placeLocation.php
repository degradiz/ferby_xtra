<?php

function create_place_location($parameters){
    global $con;
    global $salt;    

    $query = "
    INSERT INTO place_location 
    (
        name, 
        ciudad, 
        lat, 
        lon, 
        place_id, 
        passkey, 
        home_order_terms, 
        email, 
        min
    ) 
    VALUES  
    (
        '$parameters->name', 
        '$parameters->ciudad', 
        '$parameters->lat', 
        '$parameters->lon', 
        '$parameters->place_id', 
        '$parameters->home_order_terms', 
        '$parameters->email', 
        '$parameters->min'
    );
    ";

    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        $place_location_id = mysqli_insert_id($con);
        return $place_location_id;
    } 

    echo mysqli_error($con);
    
    return false;    

}

function get_place_location($place_location_id){
    global $con;
    $query = "SELECT * FROM place_location WHERE deleted = 0 AND place_location_id = '$place_location_id' ";

    $sth = mysqli_query($con, $query);
    $result = mysqli_fetch_assoc($sth);

    return $result==null? new stdClass() : $result;

}

function get_stores_by_place_id($parameters){
    global $con;
    $place_location = new stdClass();

    $placeLocationQuery = "
    SELECT p.* 
    FROM place_location p 
    WHERE p.place_id = '$parameters->place_id' ";

    $sth = mysqli_query($con, $placeLocationQuery);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }

    return $rows;
}

function insert_Place_Locations($name, $lat, $lon, $place_id, $city, $min) {
    global $con;
    global $salt;
    $passkey = md5('ferby' . $salt);
    $query = "INSERT INTO `place_location` (`place_location_id`, `name`, `ciudad`, `lat`, `lon`, `place_id`,`passkey`,`min` ) VALUES (NULL, '$name', '$city', '$lat', '$lon', '$place_id','$passkey','$min');";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function set_whatsapp_store($parameters) {
    global $con;

    $query = "
    UPDATE place_location 
    SET whatsapp = '$parameters->whatsapp' 
    WHERE place_location_id = '$parameters->store_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } else {
        return mysqli_error($con);
    }
}

function set_order_site($parameters) {
    global $con;

    $query = "
    UPDATE place_location 
    SET order_site = '$parameters->order_site' 
    WHERE place_location_id = '$parameters->store_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } else {
        return mysqli_error($con);
    }
}

function set_shipping_cost($parameters) {
    global $con;

    $query = "
    UPDATE place_location 
    SET shipping_cost = '$parameters->shipping_cost' 
    WHERE place_location_id = '$parameters->store_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } else {
        return mysqli_error($con);
    }
}

function set_promo_day($parameters) {
    global $con;

    $query = "
    UPDATE place_location 
    SET promo_day = '$parameters->promo_day' 
    WHERE place_location_id = '$parameters->place_location_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function delete_place_location($parameters) {
    global $con;

    $query = "
    UPDATE place_location 
    SET deleted = '1' 
    WHERE place_location_id = '$parameters->place_location_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function udpate_Place_Locations($name, $lat, $lon, $place_location_id, $city, $min) {
    global $con;
    $query = "UPDATE `place_location` SET `name`  = '$name', `lat` = '$lat', `lon` = '$lon', `ciudad` = '$city' ,`min` = '$min' WHERE `place_location_id` = '$place_location_id';";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function select_All_Place_Locations() {
    global $con;
    global $ip;
    $query = "SELECT pl.home_order,pl.pick_order, pl.place_location_id, CONCAT('$ip/img/',p.business_logo) as business_logo,pl.name, pl.ciudad ,pl.lat,pl.lon, pl.home_order_terms FROM `place_location` pl JOIN `place` p ON p.place_id = pl.place_id";
    //echo $query;
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function select_Filt_Locations($filt) {
    global $con;
    $conc = '';
    $places = json_decode($filt);
    $i = 0;
    foreach ($places as $p) {
        if ($i == 0) {
            $conc .= ' WHERE p.place_id = ' . $p->place_id . ' ';
        } else {
            $conc .= 'OR p.place_id = ' . $p->place_id . ' ';
        }
        $i++;
    }
    $query = "SELECT pl.* FROM `place_location` pl JOIN `place` p ON p.place_id = pl.place_id AND pl.deleted = 0 " . $conc;

    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function select_place_Locations($place_id) {
    global $con;
    $query = "SELECT * FROM `place_location` WHERE place_id = '$place_id' AND deleted = '0'";

    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function select_place_locations_det($place_location_id) {
    global $con;
    $query = "SELECT * FROM `place_location` WHERE place_location_id = '$place_location_id'";

    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}


function login_place_loc($user, $pass) {
    global $con;
    global $salt;
    $md5pass = md5($pass . $salt);
    $query = sprintf("SELECT * FROM place_location WHERE place_location_id = '%s' AND passkey = '%s';", mysqli_real_escape_string($con, $user), mysqli_real_escape_string($con, $md5pass));
    //$query = "SELECT * FROM place_location WHERE place_location_id = '$user' AND passkey = '$md5pass'";
    $result = mysqli_query($con, $query);
    $num = mysqli_num_rows($result);
    if ($num > 0) {
        echo 'cod-9144';
    } else {
        echo '000-000';
    }
}

function login_personalized($user, $pass, $place_id) {
    global $con;
    global $salt;
    $md5pass = md5($pass . $salt);
    $query = sprintf("SELECT * FROM place_location WHERE place_id = %s AND place_location_id = '%s' AND passkey = '%s';", mysqli_real_escape_string($con, $place_id), mysqli_real_escape_string($con, $user), mysqli_real_escape_string($con, $md5pass));
    //$query = "SELECT * FROM place_location WHERE place_location_id = '$user' AND passkey = '$md5pass'";
    $result = mysqli_query($con, $query);
    $num = mysqli_num_rows($result);
    if ($num > 0) {
        echo 'cod-9144';
    } else {
        echo '000-000';
    }
}

function change_place_pass($new_pass, $place_location_id) {
    global $con;
    global $salt;

    $md5pass = md5($new_pass . $salt);
    $queryUpdatePass = "UPDATE place_location SET passkey = '$md5pass' WHERE place_location_id = '$place_location_id'";
    $resultUpdatePass = mysqli_query($con, $queryUpdatePass);
    if ($resultUpdatePass === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function change_politics($home_order_terms, $place_location_id) {
    global $con;

    $query = "UPDATE place_location SET home_order_terms = '$home_order_terms' WHERE place_location_id = '$place_location_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function switch_home_delivery($switch, $place_location_id) {
    global $con;

    $query = "UPDATE place_location SET home_order = '$switch' WHERE place_location_id = '$place_location_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function switch_pick_delivery($switch, $place_location_id) {
    global $con;

    $query = "UPDATE place_location SET pick_order = '$switch' WHERE place_location_id = '$place_location_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function get_orders_by_place($place_id, $status) {
    global $con, $ip;
    $query = "SELECT bd.bill_detail_id, CONCAT('$ip/img/', m.img ) AS img, m.name as name_plate, bd.qty, bd.comment, d.desk_name, bd.option_id AS option_name, 
     u.name,CONCAT('http://graph.facebook.com/',bd.username,'/picture?type=large') as userimg , 
     bd.username , TIMESTAMPDIFF( 
     MINUTE , bd.submit_time, CURRENT_TIMESTAMP( ) ) AS minutes_ago, p.business_name AS Restaurante, pl.name AS Sucursal
     FROM bill_detail bd
     JOIN menu m ON m.menu_id = bd.menu_id
     JOIN bill b ON b.bill_id = bd.bill_id
     JOIN desk d ON d.desk_id = b.desk_id
     JOIN place_location pl ON pl.place_location_id = d.place_location_id
     JOIN place p ON pl.place_id = p.place_id
     JOIN username u ON u.username = bd.username
     WHERE bd.status = $status AND pl.place_id = $place_id  AND TIMESTAMPDIFF(HOUR,bd.submit_time,NOW()) < 12 
     ORDER BY bd.bill_detail_id DESC";

    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function get_orders_by_admin($admin_id, $status) {
    global $con, $ip;
    $query = "SELECT bd.bill_detail_id, CONCAT('$ip/img/', m.img ) AS img, m.name as name_plate, bd.qty, bd.comment, d.desk_name, bd.option_id AS option_name, 
     u.name,CONCAT('http://graph.facebook.com/',bd.username,'/picture?type=large') as userimg , 
     bd.username , TIMESTAMPDIFF( 
     MINUTE , bd.submit_time, CURRENT_TIMESTAMP( ) ) AS minutes_ago,p.business_name AS Restaurante, pl.name AS Sucursal
     FROM bill_detail bd
     JOIN menu m ON m.menu_id = bd.menu_id
     JOIN bill b ON b.bill_id = bd.bill_id
     JOIN desk d ON d.desk_id = b.desk_id
     JOIN place_location pl ON pl.place_location_id = d.place_location_id
     JOIN place p ON pl.place_id = p.place_id AND p.status = '1'
     JOIN username u ON u.username = bd.username
     WHERE bd.status = $status AND p.auth LIKE '%$admin_id%'  AND TIMESTAMPDIFF(HOUR,bd.submit_time,NOW()) < 12 
     ORDER BY bd.bill_detail_id DESC";

    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}
