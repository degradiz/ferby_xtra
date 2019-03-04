<?php

function add_punchcard_place($parameters){
    $exists_checkin = exist_place_checkin($parameters);

    if($exists_checkin == false){
        $result_checkin_option = insert_checkin_option($parameters);
    }

    $exists_alliance = exist_place_alliance($parameters);

    if($exists_alliance == false){
        $parameters->alliance_name = $parameters->business_name;
        $alliance_id = create_alliance($parameters);
        $parameters->alliance_id = $alliance_id;
        $place_alliance = create_place_alliance($parameters);
    }

    $parameters->addon_check_in = '1';
    switch_addon_check_in($parameters);
    return 1;
        
}

function exist_place_checkin($parameters){
    global $con;
    
    $query = "
    SELECT * 
    FROM checkin_option  
    WHERE checkin_place_id = '$parameters->place_id' AND checkin_deleted = '0'";

    $sth = mysqli_query($con, $query);

    $result = mysqli_fetch_assoc($sth);
    return $result==null? false : true;

}

function select_user_check_ins($parameters) {
    global $con;
    $query = "
    SELECT * 
    FROM check_in 
    WHERE check_place_id = '$parameters->place_id' AND check_username = '$parameters->username' AND c.deleted = '0' ";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    return $rows;
}

function select_loyal_username($parameters){
   global $con;
   $query = "SELECT * FROM  loyal_users WHERE username = '$parameters->username'";
   $sth = mysqli_query($con, $query);
   $rows = array();
   while ($r = mysqli_fetch_assoc($sth)) {
     $rows[] = $r;
   }
   return $rows;
   
}

function get_user_check_log($parameters){
    global $con;
    $query = "SELECT * FROM check_in c WHERE c.check_username = '$parameters->username' AND c.check_place_id = '$parameters->place_id' AND c.deleted = '0' ";
    //echo $query;
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    return $rows;

}

function get_user_checkins($parameters){
    global $con;
    $query = "
    SELECT IFNULL( SUM(ci.check_points), 0 ) AS check_points
    FROM check_in ci
    JOIN (
    SELECT pa.place_id FROM place_alliance pa 
    WHERE pa.alliance_id IN (SELECT alliance_id FROM place_alliance WHERE place_id = '$parameters->place_id')
    ) p ON (ci.check_place_id = p.place_id)
    WHERE ci.check_username = '$parameters->username' AND ci.deleted = '0' ";

    $sth = mysqli_query($con, $query);
    $num = mysqli_num_rows($sth);
    //echo $num;
    if ($num > 0) {
        $result = mysqli_fetch_assoc($sth);
        //print_r($result);
        echo $result['check_points'];
    } else {
        echo 0;
    }    
}

function redeem_check($parameters){
    global $con;
    $query = "INSERT INTO `check_in` (
    `check_place_id`, 
    `check_store_id`, 
    `check_username`, 
    `check_points`, 
    `transaction_entry`
    ) 
    VALUES (
    '$parameters->place_id', 
    '$parameters->store_id', 
    '$parameters->username', 
    '-$parameters->check_points',
    '$parameters->transaction_entry');";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo mysqli_insert_id($con);
        //generate_receipt($parameters);
    } else {
        echo '0';//mysqli_error($con);
    }
}


function check_in($parameters){
    global $con;

    $gift_point = new stdClass();

    $prequery = "SELECT * FROM  loyal_users WHERE username = '$parameters->username'";
    $res = mysqli_query($con, $prequery);
    $num = mysqli_num_rows($res);

    if ($num > 0) {

        $place = get_place_by_place_location($parameters->store_id);

        if($place->addon_check_in==0)
            return '0';
    // if($gift_point->place->settings->redeem_free_format != 1){
    //     if(strlen(trim($gift_point->gift_username)) != $gift_point->place->settings->redeem_length_format){
    //         return '-1';
    //     }
    // }

        $query = "INSERT INTO `check_in` (
        `check_place_id`, 
        `check_store_id`, 
        `check_username`, 
        `check_points`, 
        `transaction_entry`
        ) 
        VALUES (
        '$parameters->place_id', 
        '$parameters->store_id',
        '$parameters->username',
        '$parameters->check_points',
        '$parameters->transaction_entry');";
    //'$parameters->check_points',
        echo $query;
        $result = mysqli_query($con, $query);
        if ($result === TRUE) {
            return '1';
        } else {
            return '0';
        }
    }else{
        return '-1';
    }

};

function delete_checkin($parameters) {
    global $con;

    $query = "
    UPDATE check_in 
    SET deleted = '1' 
    WHERE check_in_id = '$parameters->check_in_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) 
        return 1;
    
    return mysqli_error($con);
}


function insert_loyal_username($parameters){
   global $con;
   $prequery = "SELECT * FROM  loyal_users WHERE username = '$parameters->username'";
   $res = mysqli_query($con, $prequery);
   $num = mysqli_num_rows($res);
   if ($num == 0) {
        $query = "INSERT INTO `loyal_users` (`username`, `name`, `tel`, `email`) VALUES ('$parameters->username', '$parameters->Nombre', '$parameters->numero', '$parameters->email');";
        $result = mysqli_query($con, $query);
        if($result === TRUE){
            echo 1;
        }
    }else{
         echo -1;
    }
}