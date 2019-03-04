<?php

function insert_subscription($place_id, $user_id,$loc_id) {
    global $con;
    insert_visit($place_id, $user_id);
    if($loc_id == 0){   
         update_visitor($loc_id, $user_id);   
    }
    $q1 = " SELECT * FROM subscriber WHERE place_id = '$place_id' AND user_id = '$user_id'";
    $firstResult = mysqli_query($con, $q1);
    $num = mysqli_num_rows($firstResult);
    if ($num == 0) {
        $query = "INSERT INTO `subscriber` (`sub_id`, `place_id`, `user_id`) VALUES (NULL, '$place_id', '$user_id');";
        $secondResult = mysqli_query($con, $query);
        if ($secondResult === true) {
            echo '1';
        } else {
            echo mysqli_error($con);
        }
    }
}


function insert_sub($place_id, $user_id) {
    global $con;
    $query = "INSERT INTO `subscriber` (`sub_id`,`place_id`,`user_id`) VALUES (NULL, '$place_id', '$user_id');";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo '1';
    } else {
        echo mysqli_error($con);
    }
}

function subscribe_place($place_id, $user_id) {
    global $con;
    $q1 = " SELECT * FROM subscriber WHERE place_id = '$place_id' AND user_id = '$user_id'";
    $firstResult = mysqli_query($con, $q1);
    $num = mysqli_num_rows($firstResult);
    if ($num == 0) {
        $query = "INSERT INTO `subscriber` (`sub_id`, `place_id`, `user_id`, `desirable`) VALUES (NULL, '$place_id', '$user_id', 1);";
        $secondResult = mysqli_query($con, $query);
        if ($secondResult === true) {
            echo '1';
        } else {
            echo mysqli_error($con);
        }
    }
}

function select_unsubscribed_places($user_id) {
    global $con;
     global $ip;
    $query = "
SELECT p.business_name, CONCAT('$ip/img/',p.business_logo) AS business_logo, s . * , x.place_location_id
FROM  `subscriber` s
JOIN  `place` p ON ( s.place_id = p.place_id
AND p.status =  '1' ) 
LEFT OUTER JOIN (
SELECT pl.place_location_id, pl.place_id
FROM place_location pl GROUP BY  pl.place_id)x ON x.place_id = p.place_id 
WHERE s.user_id =$user_id
AND s.desirable =0";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function select_subscribed_places($user_id) {
    global $con;
    global $ip;
    $query = "SELECT p.business_name, CONCAT('$ip/img/',p.business_logo) AS business_logo, s . * , x.place_location_id
FROM  `subscriber` s
JOIN  `place` p ON ( s.place_id = p.place_id
AND p.status =  '1' ) 
LEFT OUTER JOIN (
SELECT pl.place_location_id, pl.place_id
FROM place_location pl GROUP BY  pl.place_id)x ON x.place_id = p.place_id 
WHERE s.user_id =$user_id
AND s.desirable =1";
    
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function select_places_not_subscribed($user_id) {
    global $con;
    global $ip;
    $query = "
        SELECT p.place_id, p.business_name, CONCAT(  '$ip/img/', p.business_logo ) AS business_logo, x.place_location_id
FROM  `place` p
LEFT OUTER JOIN (

SELECT pl.place_location_id, pl.place_id
FROM place_location pl
GROUP BY pl.place_id
)x ON x.place_id = p.place_id
WHERE p.status =  '1'
AND p.place_id NOT 
IN (
SELECT s.place_id
FROM  `subscriber` s
WHERE s.user_id =  '$user_id'
)";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function select_Count_Subscription($place_id) {
    global $con;
    $query = "SELECT * FROM `subscriber` WHERE `place_id` = '$place_id'";
    $result = mysqli_query($con, $query);
    $num = mysqli_num_rows($result);
    echo $num;
}

function update_subscribe($place_id, $user_id, $flag){
    global $con;
    $query = ""
            . "UPDATE `subscriber` "
            . "SET `subscriber`.`desirable` =  $flag "
            . "WHERE `subscriber`.`user_id` = '$user_id' AND `subscriber`.`place_id` = '$place_id';";
     $result = mysqli_query($con, $query);
    if ($result === true) {
        echo '1';
    } else {
        echo mysqli_error($con);
    }
}

function insert_visit($place_id, $user_id) {
    global $con;
    $query = "INSERT INTO  `visitor` (`visit_id` ,`place_id` ,`user_id` ,`Date`)VALUES (NULL ,  '$place_id',  '$user_id', CURRENT_TIMESTAMP)";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo '1';
    } else {
        echo mysqli_error($con);
    }
}

function update_visitor($loc_id, $user_id){
    global $con;
    $query = "UPDATE  `username` SET  `place_id` =  '$loc_id' WHERE  `username`.`username` =  '$user_id';";
     $result = mysqli_query($con, $query);
    if ($result === true) {
        echo '1';
    } else {
        echo mysqli_error($con);
    }
}