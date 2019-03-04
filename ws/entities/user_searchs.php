<?php

function insert_search2($place_id, $user_id, $search_string) {
    global $con;
    $query = "INSERT INTO `user_searchs` (`id`, `place_id`, `user_id`, `search_string`) VALUES (NULL, '$place_id', '$user_id', '$search_string');";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function select_searchs($place_id, $user_id) {
    global $con;
    $query = "SELECT * FROM user_searchs where place_id = '$place_id' AND user_id = '$user_id'";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

