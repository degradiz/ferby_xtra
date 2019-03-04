<?php

function insert_desk($place_location_id, $desk_name) {
    global $con;
    $query = "INSERT INTO `desk` (`desk_id`, `place_location_id`, `desk_name`, `status`) VALUES (NULL, '$place_location_id', '$desk_name', '1');";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function update_desk_name($desk_name, $desk_id, $status) {
    global $con;
    $query = "UPDATE `desk` SET  `desk_name` = '$desk_name',`status` = '$status' WHERE `desk_id` = '$desk_id'";
    $result = mysqli_query($con, $query);
    if ($result == TRUE) {
        echo 1;
    } else {
        echo mysqli_error($con);
    };
}

function select_desk($place_location_id) {
    global $con;
    $query = "SELECT d.desk_id, d.desk_name,d.status,pl.`name` as sucursal , group_concat(dw.fist_name) AS asigned
from desk d 
JOIN place_location pl ON d.place_location_id = pl.place_location_id 
LEFT OUTER JOIN (SELECT dw.waiter_id, dw.desk_id, w.fist_name FROM deskxwaiter dw JOIN waiter w ON w.waiter_id = dw.waiter_id) dw ON dw.desk_id = d.desk_id
WHERE pl.place_location_id  = '$place_location_id'

UNION

SELECT d.desk_id, d.desk_name,d.status,pl.`name` as sucursal , dw.fist_name AS asigned
from desk d 
JOIN place_location pl ON d.place_location_id = pl.place_location_id 
LEFT OUTER JOIN (SELECT dw.waiter_id, dw.desk_id, w.fist_name FROM deskxwaiter dw JOIN waiter w ON w.waiter_id = dw.waiter_id) dw ON dw.desk_id = d.desk_id
WHERE pl.place_location_id  = '$place_location_id'
AND isnull(dw.fist_name)";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function delete_desk($desk_id){
   global $con;
    $query = "DELETE FROM `desk` WHERE `desk_id` = '$desk_id'";
    $result = mysqli_query($con, $query);
    if ($result == TRUE) {
        echo 1;
    } else {
        echo mysqli_error($con);
    };
    
}
