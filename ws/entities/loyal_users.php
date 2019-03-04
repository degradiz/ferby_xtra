<?php

function select_loyal_user($parameters) {
    global $con;
    $query = "SELECT * FROM loyal_users WHERE username = '$parameters->username'";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    return $rows;
}


;
