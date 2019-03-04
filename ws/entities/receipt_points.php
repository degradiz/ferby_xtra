<?php

function select_receipt_points($parameters) {
    global $con;
    $query = 
    "SELECT rp.*, p.business_name, pl.name as place
     FROM receipt_points rp
     LEFT JOIN place_location pl ON (rp.receipt_place_location_id = pl.place_location_id)
     LEFT JOIN place p ON (pl.place_id = p.place_id)
     WHERE receipt_username = '$parameters->username' AND receipt_place_location_id = '$parameters->place_location_id'
     ORDER BY rp.receipt_points_id ASC";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function select_all_receipt_points($parameters) {
    global $con;
    $query = 
    "SELECT rp.*, p.business_name, pl.name as place
     FROM receipt_points rp
     LEFT JOIN place_location pl ON (rp.receipt_place_location_id = pl.place_location_id)
     LEFT JOIN place p ON (pl.place_id = p.place_id)
     WHERE receipt_place_location_id = '$parameters->place_location_id'
     ORDER BY rp.receipt_points_id ASC";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function select_receipt_points_of_day($parameters) {
    global $con;
    $query = 
    "SELECT rp.*, p.business_name, pl.name as place
     FROM receipt_points rp
     LEFT JOIN place_location pl ON (rp.receipt_place_location_id = pl.place_location_id)
     LEFT JOIN place p ON (pl.place_id = p.place_id)
     WHERE receipt_place_location_id = '$parameters->place_location_id' AND YEAR(rp.receipt_date) = '$parameters->year' 
     AND MONTH(rp.receipt_date) = '$parameters->month' AND DAY(rp.receipt_date) = '$parameters->day'
     ORDER BY rp.receipt_points_id ASC";
     
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}



