<?php

function insert_sale($qty, $bill_id) {
    global $con;
    $prevQuery = "SELECT * FROM sales WHERE `bill_id` = '$bill_id'";
    $firstResult = mysqli_query($con, $prevQuery);
    $num = mysqli_num_rows($firstResult);
    if ($num == 0) {
        $query = "INSERT INTO `sales` (`sale_id`, `date`, `qty`, `bill_id`) VALUES (NULL, CURRENT_TIMESTAMP, '$qty', '$bill_id');";
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
