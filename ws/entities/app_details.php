<?php

function select_apps() {
    global $con;
    $query = "SELECT app_id, app_name, app_icon FROM `app_details` WHERE `app_deleted` = '0'";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function detail_app($app_id) {
    global $con;
    global $ip;
    $details_query = "SELECT * FROM `app_details` WHERE `app_deleted` = '0' AND app_id = '$app_id'";
    $sth = mysqli_query($con, $details_query);
    $r = mysqli_fetch_assoc($sth);//array();
    
    $app = new stdClass();
    $app->details = $r;
    $app->banners = array();
    $app->promos = array();

    $place_id = $app->details['app_place_id'];

    $banners_query = "SELECT banner_img FROM `banner` WHERE `banner_place_id` = '$place_id' ";
    $sth = mysqli_query($con, $banners_query);
    while ($r = mysqli_fetch_assoc($sth)) {
        $app->banners[] = $r;
    }

    $promos_query = "SELECT CONCAT('$ip','/img/', img) AS promo_img FROM `promotion` WHERE `place_id` = '$place_id' ";
    $sth = mysqli_query($con, $promos_query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $app->promos[] = $r;
    }

    print json_encode($app);
}
