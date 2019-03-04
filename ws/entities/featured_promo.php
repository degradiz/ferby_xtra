<?php

function select_featured_promos() {
    global $con;
    $query = "SELECT * FROM `featured_promo` WHERE `featured_promo_deleted` = '0' ORDER BY featured_promo_priority DESC";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function detail_promo($place_id) {
    global $con;
    $query = "SELECT * FROM `featured_promo_deleted` WHERE `featured_promo_deleted` = '0' AND featured_promo_place_id = '$place_id'";
    $sth = mysqli_query($con, $query);
    $r = mysqli_fetch_assoc($sth);//array();
    
    print json_encode($r);
}
