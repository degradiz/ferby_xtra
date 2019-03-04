<?php

function add_puntos_place($parameters){
    $exists_settings = exist_place_settings($parameters);

    if($exists_settings == false){
        $result_insert_settings = insert_settings($parameters);
    }

    $exists_alliance = exist_place_alliance($parameters);

    if($exists_alliance == false){
        $parameters->alliance_name = $parameters->business_name;
        $alliance_id = create_alliance($parameters);
        $parameters->alliance_id = $alliance_id;
        $place_alliance = create_place_alliance($parameters);
    }

    $parameters->addon_puntos = '1';
    switch_addon_puntos($parameters);
    return 1;
        
}

function exist_place_settings($parameters){
    global $con;
    
    $query = "
    SELECT s.* 
    FROM setting s 
    WHERE s.setting_place_id = '$parameters->place_id' AND s.setting_deleted = '0'";

    $sth = mysqli_query($con, $query);

    $result = mysqli_fetch_assoc($sth);
    return $result==null? false : true;

}

function select_gift_points($username) {
    global $con;
    $query = "SELECT * FROM gift_points WHERE gift_username = '$username'";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function get_place_points($username, $place_id){
    global $con;
    $query = "SELECT SUM(p.gift_points) AS puntos FROM gift_points p WHERE p.gift_username = '$username' AND p.gift_place_id = '$place_id' ";
    //echo $query;
    $sth = mysqli_query($con, $query);
    $num = mysqli_num_rows($sth);
    //echo $num;
    if ($num > 0) {
        $result = mysqli_fetch_assoc($sth);
        //print_r($result);
        echo $result['puntos'];
    } else {
        echo 0;
    }

}

function get_alliance_points($username, $place_id){
    global $con;
    $query = "
    SELECT IFNULL( SUM(gp.gift_points), 0 ) AS puntos
    FROM gift_points gp
    JOIN (
            SELECT pa.place_id FROM place_alliance pa 
            WHERE pa.alliance_id IN (SELECT alliance_id FROM place_alliance WHERE place_id = '$place_id')
         ) p ON (gp.gift_place_id = p.place_id)
    WHERE gp.gift_username = '$username' ";

    $sth = mysqli_query($con, $query);
    $num = mysqli_num_rows($sth);
    //echo $num;
    if ($num > 0) {
        $result = mysqli_fetch_assoc($sth);
        //print_r($result);
        echo $result['puntos'];
    } else {
        echo 0;
    }    
}

function redeem_points($parameters){
    global $con;
    $query = "INSERT INTO `gift_points` (
                            `gift_place_id`, 
                            `gift_username`, 
                            `gift_points`, 
                            `gift_bill_id`
                            ) 
                    VALUES (
                            '$parameters->place_id', 
                            '$parameters->gift_username', 
                            '-$parameters->gift_points',
                            '$parameters->gift_bill_id');";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo mysqli_insert_id($con);
        generate_receipt($parameters);
    } else {
        echo '0';//mysqli_error($con);
    }
}

function generate_receipt($parameters){
    global $con;
    $query = "INSERT INTO `receipt_points` (
                            `receipt_gift_points`, 
                            `receipt_username`, 
                            `receipt_place_location_id`,
                            `receipt_place_id`
                            ) 
                    VALUES (
                            '$parameters->gift_points', 
                            '$parameters->gift_username', 
                            '$parameters->place_location_id',
                            '$parameters->place_id'
                            );";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        //echo '1';
    } else {
        //mysqli_error($con);
    }
}

function accumulate_points($bill_id){
    global $con;

    $gift_point = get_gift_point_by_bill($bill_id);
    print json_encode($gift_point);

    echo 'print accumulate';

    if($gift_point->place->addon_puntos==0 && $gift_point->place->addon_check_in == 0)
        return '-1';

    if($gift_point->place->addon_puntos==1){

        if($gift_point->place->settings->redeem_free_format != 1){
            if(strlen(trim($gift_point->gift_username)) != $gift_point->place->settings->redeem_length_format){
                return '-1';
            }
        }
        
        $place_id = $gift_point->place->place_id;
        $query = "INSERT INTO `gift_points` (
                                `gift_place_id`, 
                                `gift_username`, 
                                `gift_points`, 
                                `gift_bill_id`
                                ) 
                        VALUES (
                                '$place_id', 
                                '$gift_point->gift_username', 
                                '$gift_point->gift_points',
                                '$gift_point->gift_bill_id');";
        $result = mysqli_query($con, $query);
        if ($result === TRUE) {
            return '1';
        } else {
            return '0';
        }
    }

        if($gift_point->place->addon_check_in==1){

        if($gift_point->place->options["checkin_free_format"] != 1){
            if(strlen(trim($gift_point->gift_username)) != $gift_point->place->options["checkin_length_format"]){
                return '-1';
            }
        }
        
        $place_id = $gift_point->place->place_id;
        $store_id = $gift_point->store_id;

        $query = "INSERT INTO `check_in` (
                `check_place_id`, 
                `check_store_id`, 
                `check_username`, 
                `check_points`, 
                `transaction_entry`
                ) 
                VALUES (
                '$place_id', 
                '$store_id',
                '$gift_point->gift_username',
                '1',
                '$gift_point->gift_bill_id');";

        $result = mysqli_query($con, $query);
        if ($result === TRUE) {
            return '1';
        } else {
            return '0';
        }
    }
}

function get_gift_point_by_bill($bill_id){
    global $con;
        $gift_point = new stdClass();

        $bill = get_bill($bill_id);
        $place_location_id = $bill->place_id;
        $gift_point->store_id = $place_location_id;
        $gift_point->place = get_place_by_place_location($place_location_id);
        $place_id = $gift_point->place->place_id;
        $gift_point->place_id = $place_id;
        $gift_point->place->settings = select_place_settings($gift_point);
        $gift_point->place->options = select_place_options($gift_point);
        $gift_point->gift_username = $bill->bill_username;
        $gift_point->gift_points = $bill->bill_points;
        $gift_point->gift_bill_id = $bill->bill_id;

        return $gift_point;
}



function get_place_by_place_location($place_location_id){
    global $con;
    $place = new stdClass();

    $placeQuery = "SELECT p.* 
    FROM place_location pl
    JOIN place p ON (pl.place_id = p.place_id)
    WHERE pl.place_location_id = '$place_location_id' ";
    $sth = mysqli_query($con, $placeQuery);
    $result = mysqli_fetch_assoc($sth);
    
    $place->place_id = $result['place_id'];
    $place->addon_puntos = $result['addon_puntos'];
    $place->addon_check_in = $result['addon_check_in'];
    $place->business_name = $result['business_name'];
    $place->stock_order = $result['stock_order'];
    $place->status = $result['status'];
    return $place;
}

function get_bill($bill_id){
    global $con;
    $bill = new stdClass();

    $billQuery = "SELECT * FROM bill WHERE bill_id = '$bill_id' ";
    $sth = mysqli_query($con, $billQuery);
    $result = mysqli_fetch_assoc($sth);
    
    $bill->bill_id = $result['bill_id'];
    $bill->bill_username = $result['bill_username'];
    $bill->place_id = $result['place_id'];
    $bill->bill_points = $result['bill_points'];
    $bill->status = $result['status'];
    $bill->bill_token = $result['bill_token'];

    return $bill;
}





;
