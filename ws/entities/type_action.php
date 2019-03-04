<?php

function get_types(){
    global $con;
    $query = "SELECT * FROM type_action WHERE type_deleted = 0";

    $sth = mysqli_query($con, $query);

    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }

    return $rows;

}