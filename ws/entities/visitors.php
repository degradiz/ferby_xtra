<?php

function insert_visitor($user_id, $place_id) {
    global $con;
    $query = "INSERT INTO `visitor` (`visit_id`, `user_id` , `place_id`) VALUES (NULL, '$place_id', '$user_id');";
    $secondResult = mysqli_query($con, $query);
    if ($secondResult === true) {
        echo '1';
    } else {
        echo mysqli_error($con);
    }
}

function select_count_visitor($place_id) {
    global $con;
    $query = "SELECT * FROM `visitor` WHERE `place_id` = '$place_id'";
    $result = mysqli_query($con, $query);
    $num = mysqli_num_rows($result);
    echo $num;
}
