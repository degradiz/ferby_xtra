<?php

function insert_Waiter($waiter_id, $fist_name, $last_name, $number, $place_id) {
    global $con;
    global $salt;
    $preQuery = "SELECT * FROM `waiter` where `waiter_id` = '$waiter_id'";
    $firstResult = mysqli_query($con, $preQuery);
    $num = mysqli_num_rows($firstResult);
    if ($num == 0) {
        $md5Pass = md5('ferby' . $salt);
        $query = "INSERT INTO `waiter` (`waiter_id`, `fist_name`, `last_name`, `password`, `number`,`place_id`) VALUES ('$waiter_id', '$fist_name', '$last_name', '$md5Pass', '$number', '$place_id');";
        $result = mysqli_query($con, $query);
        if ($result == TRUE) {
            echo 1;
        } else {
            echo mysqli_error($con);
        }
    } else {
        echo 2;
    }
}

function update_Waiter($waiter_id, $fist_name, $last_name, $number) {
    global $con;
    $query = "UPDATE `waiter` SET `fist_name` = '$fist_name', `last_name` = '$last_name', `number` = '$number'WHERE `waiter_id` = '$waiter_id'";
    $result = mysqli_query($con, $query);
    if ($result == TRUE) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function login_waiter($waiter_id, $pass) {
    global $salt;
    global $con;
    $md5pass = md5($pass . $salt);
    $query = "SELECT * FROM `waiter` WHERE `waiter_id` = '$waiter_id' AND password = '$md5pass'";
   
    $result = mysqli_query($con, $query);
    $num = mysqli_num_rows($result);
    if ($num > 0) {
        $row = mysqli_fetch_assoc($result);
            echo 'cod-9144';
    } else {
        echo '000-000';
    }
}

function update_waiter_pass($waiter_id) {
    global $salt;
    global $con;
    $md5pass = md5('ferby' . $salt);
    $query = "UPDATE `waiter` SET password = '$md5pass' WHERE `waiter_id` = '$waiter_id'";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo 1;
    } else {
        echo mysqli_query($con, $query);
    }
}

function asign_waiter($waiter_id, $desk_id) {
    global $con;
    $preQuery = "SELECT * FROM `deskXwaiter` where `waiter_id` = '$waiter_id' AND `desk_id` = '$desk_id' ";
    $firstResult = mysqli_query($con, $preQuery);
    $num = mysqli_num_rows($firstResult);
    if ($num == 0) {
        $query = "INSERT INTO `deskXwaiter` (`tableXwaiter_id`, `waiter_id`, `desk_id`) VALUES (NULL, '$waiter_id', '$desk_id');";
        $result = mysqli_query($con, $query);
        if ($result == TRUE) {
            echo 1;
        } else {
            echo mysqli_error($con);
        }
    } else {
        echo 2;
    }
}

function unassign_waiter($tablexwaiter_id) {
    global $con;
    $query = "DELETE FROM `deskXwaiter` ";
    $result = mysqli_query($con, $query);
    if ($result == TRUE) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function select_Waiter($place_id) {
    global $con;
    $query = "SELECT * FROM waiter WHERE  place_id = $place_id";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function change_pass_waiter($waiter_id, $old_password, $new_password) {
    global $salt;
    global $con;
    $md5pass1 = md5($old_password . $salt);
    $query = "SELECT status FROM `waiter` WHERE `waiter_id` = '$waiter_id' AND password = '$md5pass1'";
    $result = mysqli_query($con, $query);
    $num = mysqli_num_rows($result);
    if ($num > 0) {
        $row = mysqli_fetch_assoc($result);
        if ($row ['status'] != 0) {
            $md5pass = md5($new_password . $salt);
            $query = "UPDATE `waiter` SET password = '$md5pass' WHERE `waiter_id` = '$waiter_id'";
            $result = mysqli_query($con, $query);
            if ($result === TRUE) {
                echo 1;
            } else {
                echo mysqli_query($con, $query);
            }
        } else {
            echo '000-111';
        }
    } else {
        echo '000-000';
    }
}
