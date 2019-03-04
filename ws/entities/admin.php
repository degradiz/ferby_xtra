<?php

function create_new_app($parameters){
    global $con;
    $parameters->business_name = mysqli_real_escape_string($con, $parameters->business_name);    
    $parameters->first_name = $parameters->business_name;

    if($parameters->password == '') $parameters->password = 'ferby';

    $admin = false;
    echo 1;
    if($parameters->admin_id != '') $admin = create_admin($parameters); else $parameters->admin_id = 'administrator@ferby.com';
    echo 2;
    if(!$admin) $parameters->user_exists = true;
echo 3;
    $parameters->alliance_name = $parameters->business_name;

    $alliance_id = create_alliance($parameters);

    if(!$alliance_id) return false;
echo 4;
    $parameters->alliance_id = $alliance_id;

    $place_id = create_place($parameters);

    if(!$place_id) return false;
echo 5;
    $parameters->place_id = $place_id;

    $parameters->place_location_id = default_place_location($parameters);

    $place_alliance = create_place_alliance($parameters);

    if(!$place_alliance) return false;
echo 6;
    $parameters->place_alliance_id = $place_alliance;

    $result_points_settings = insert_settings($parameters);

    $result_checkin_option = insert_checkin_option($parameters);
echo 7;
    return $parameters;    

}

function default_place_location($parameters){
    $parameters->name = $parameters->business_name;
    $parameters->ciudad = 'Ciudad A';
    $parameters->lat = '14.084071853564854';
    $parameters->lon = '-87.27501342231072';
    $parameters->passkey = $parameters->password;
    $parameters->home_order_terms = '';
    $parameters->email = $parameters->admin_id;
    $parameters->min = 0;

    $place_location_id = create_place_location($parameters);
    return $place_location_id;

}

function create_place_alliance($parameters){

    $place_alliance = get_place_alliance($parameters);

    if((array)$place_alliance)
        return $place_alliance->place_alliance_id;

    global $con;
    $query = "
    INSERT INTO `place_alliance` (`place_alliance_id`, `place_id`, `alliance_id`) 
    VALUES (NULL,'$parameters->place_id','$parameters->alliance_id');";

    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        $place_alliance_id = mysqli_insert_id($con);
        return $place_alliance_id;
    } 
    
    return false;   
}

function exist_place_alliance($parameters){
    global $con;
    
    $query = "
    SELECT *  
    FROM place_alliance 
    WHERE place_id = '$parameters->place_id' AND place_alliance_status = '0'";

    $sth = mysqli_query($con, $query);

    $result = mysqli_fetch_assoc($sth);
    return $result==null? false : true;

}

function get_place_alliance($parameters){
    global $con;
    
    $query = "
    SELECT *  
    FROM place_alliance 
    WHERE place_id = '$parameters->place_id' AND alliance_id = '$parameters->alliance_id' ";

    $sth = mysqli_query($con, $query);

    $result = null;// mysqli_fetch_assoc($sth);
    return $result==null? new stdClass() : $result;

}

function create_alliance($parameters){
    global $con;
    $query = "
    INSERT INTO `alliance` (`admin_id`, `alliance_name`) 
    VALUES ('$parameters->admin_id','$parameters->alliance_name');";

    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        $alliance_id = mysqli_insert_id($con);
        return $alliance_id;
    } 
    
    return mysqli_error($con);
}

function create_admin($parameters){

    if((array)get_admin($parameters))
        return false;

    global $con;
    global $salt;

    $parameters->admin_id = mysqli_real_escape_string($con, $parameters->admin_id);    

    $md5pass = md5($parameters->password . $salt);

    $query = "
    INSERT INTO `admin` (`admin_id`, `first_name`, `pass`) 
    VALUES ('$parameters->admin_id','$parameters->first_name', '$md5pass');";

    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        return true;
    } 
    
    return false;//mysqli_error($con);
}

function get_admin($parameters){
    global $con;
    $query = "SELECT * FROM admin WHERE status = 1 AND admin_id = '$parameters->admin_id' ";

    $sth = mysqli_query($con, $query);
    $result = mysqli_fetch_assoc($sth);
    return $result==null? new stdClass() : $result;

}

function insert_Admin($admin_id, $pass, $first_name, $last_name) {
    global $con;
    global $salt;
    $prevQuery = "SELECT * FROM `admin` WHERE `admin_id` = '$admin_id'";
    $firstResult = mysqli_query($con, $prevQuery);
    $num = mysqli_num_rows($firstResult);
    if ($num == 0) {
        $md5pass = md5($pass . $salt);
        $query = "INSERT INTO `admin` (`admin_id`, `pass`, `max_tables`, `first_name`, `last_name`, `status`) VALUES ('$admin_id', '$md5pass', '4', '$first_name', '$last_name', '1');";
        $result = mysqli_query($con, $query);
        if ($result === true) {
            echo 1;
        } else {
            mysqli_error($con);
        }
    } else {
        echo '2';
    }
}

function update_Admin($admin_id, $first_name, $last_name) {
    global $con;
    $query = "UPDATE `admin` SET `first_name` = '$first_name', `last_name` = '$last_name' where `admin_id` = '$admin_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function update_Table_Max($admin_id, $tableMax) {
    global $con;
    $query = "UPDATE `admin` SET `max_tables` = '$tableMax' where `admin_id` = '$admin_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function update_User_Status($admin_id, $status) {
    global $con;
    $query = "UPDATE `admin` SET `status` = '$status' where `admin_id` = '$admin_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function update_Pass_Admin($token, $pass, $user) {
    global $con;
    global $salt;
    $query = "SELECT pass FROM admin WHERE admin_id = '$user'";
    $result = mysqli_query($con, $query);
    $row = mysqli_fetch_assoc($result);
    if ($row['pass'] == $token) {
        $md5pass = md5($pass . $salt);
        $queryUpdatePass = "UPDATE admin SET pass = '$md5pass' WHERE admin_id = '$user'";
        $resultUpdatePass = mysqli_query($con, $queryUpdatePass);
        if ($resultUpdatePass === true) {
            echo 1;
        } else {
            echo mysqli_error($con);
        }
    } else {
        echo 2;
    }
}

function login_admin_places($user, $pass){

    global $con;
    global $salt;
    $md5pass = md5($pass . $salt);
    $query = sprintf(
        "SELECT a.admin_id, a.status, p.place_id, p.business_logo 
         FROM admin a 
         INNER JOIN place p ON (a.admin_id = p.admin_id AND p.status = 1)
         WHERE a.admin_id = '%s' AND a.pass = '%s';",mysqli_real_escape_string($con,$user) 
        ,mysqli_real_escape_string($con,$md5pass)
    );    

    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function insert_gcm_place_admin($uuid, $gcmToken, $admin_id, $platform) {
    global $con, $ip;
    
    $query = "SELECT pl.place_location_id FROM place p JOIN place_location pl ON pl.place_id = p.place_id WHERE p.auth LIKE '%$admin_id%'";  
    $sth = mysqli_query($con, $query);
    while ($r = mysqli_fetch_assoc($sth)) {
        insert_gcm_admin($uuid, $gcmToken, $r['place_location_id'],$platform);
    }
}

function insert_gcm_admin($uuid, $gcmToken, $place_id,$platform) {
    global $con;
    $query = "DELETE FROM `place_admin_users` WHERE `uuid` = '$uuid' AND `place_id` = '$place_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        $s_query = "INSERT INTO `place_admin_users` (`uuid`, `gcmToken`, `place_id`, `platform`) VALUES ('$uuid', '$gcmToken', '$place_id', '$platform');";
        $s_result = mysqli_query($con, $s_query);
        if ($s_result === true) {
            echo 1;
        } else {
            echo 'err';
            echo mysqli_error($con);
        }
    } else {
        echo mysqli_error($con);
    }
}

function login_admin_app($user, $pass) {
    global $con;
    global $salt;
    $md5pass = md5($pass . $salt);
    $query = sprintf(
        "SELECT a.admin_id, a.status, p.place_id 
         FROM admin a 
         INNER JOIN place p ON (a.admin_id = p.admin_id AND p.status = 1)
         WHERE a.admin_id = '%s' AND a.pass = '%s';",mysqli_real_escape_string($con,$user) 
        ,mysqli_real_escape_string($con,$md5pass)
    );
    //$query = "SELECT admin_id, status FROM admin WHERE admin_id = '$user' AND pass = '$md5pass'";
    
    $result = mysqli_query($con, $query);
    $num = mysqli_num_rows($result);
    if ($num > 0) {
        $row = mysqli_fetch_assoc($result);
        if ($row['status'] == 1) {
            echo 'cod-9144';
        } else {
            echo '000-9144';
        }
    } else {
        echo '000-000';
    }
}

function login_admin($user, $pass) {
    global $con;
    global $salt;
    $md5pass = md5($pass . $salt);
    $query = sprintf("SELECT admin_id, status FROM admin WHERE admin_id = '%s' AND pass = '%s';",mysqli_real_escape_string($con,$user) ,mysqli_real_escape_string($con,$md5pass));
    //$query = "SELECT admin_id, status FROM admin WHERE admin_id = '$user' AND pass = '$md5pass'";
    
    $result = mysqli_query($con, $query);
    $num = mysqli_num_rows($result);
    if ($num > 0) {
        $row = mysqli_fetch_assoc($result);
        if ($row['status'] == 1) {
            echo 'cod-9144';
        } else {
            echo '000-9144';
        }
    } else {
        echo '000-000';
    }
}

function select_admin($admin_id) {//Nujabes - Feathers
    global $salt;
    global $con;
    $query = sprintf("SELECT max_tables,first_name,last_name FROM admin WHERE admin_id = '%s';",mysqli_real_escape_string($con,$admin_id));
    //$query = "SELECT max_tables,first_name,last_name FROM admin WHERE admin_id = '$admin_id'";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function change_admin_pass($old_pass, $new_pass, $user) {
    global $con;
    global $salt;
    $md5pass1 = md5($old_pass . $salt);
    $query = "SELECT admin_id, status FROM admin WHERE admin_id = '$user' AND pass = '$md5pass1'";
    $result = mysqli_query($con, $query);
    $num = mysqli_num_rows($result);
    if ($num > 0) {
        $row = mysqli_fetch_assoc($result);
        if ($row['status'] == 1) {
            $md5pass = md5($new_pass . $salt);
            $queryUpdatePass = "UPDATE admin SET pass = '$md5pass' WHERE admin_id = '$user'";
            $resultUpdatePass = mysqli_query($con, $queryUpdatePass);
            if ($resultUpdatePass === true) {
                echo 1;
            } else {
                echo mysqli_error($con);
            }
        } else {
            echo '000-9144';
        }
    } else {
        echo '000-000';
    }
}
