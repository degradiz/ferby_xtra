<?php

function select_ferby_banners() {
    global $con;
    $query = "SELECT * FROM `ferby_banners` WHERE `banner_activated` = '0'";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function detail_ferby_banners() {
    global $con;
    global $ip;
    $details_query = "SELECT * FROM `ferby_banners` WHERE `banner_activated` = '0' ";
    $sth = mysqli_query($con, $details_query);
    $r = mysqli_fetch_assoc($sth);//array();
    
    print json_encode($r);
}


