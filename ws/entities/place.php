<?php

function get_place($place_id){
    global $con;
    $query = "SELECT * FROM place WHERE status = 1 AND place_id = '$place_id' ";

    $sth = mysqli_query($con, $query);
    $result = mysqli_fetch_assoc($sth);


    return $result==null? new stdClass() : $result;

}


function delete_place($parameters) {
    global $con;

    $query = "
    UPDATE place 
    SET status = '0' 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } else {
        return 0;
        //return mysqli_error($con);
    }
}

function create_place($parameters){
    global $con;
    $namelFotoV = "";
    $fileRoute = uploadedFileUrl($parameters->business_logo);
    $namelFotoV = $fileRoute['name'];

    $auth = 'administrator@ferby.com,'.$parameters->admin_id;
    if($parameters->admin_id == '') $auth = 'administrator@ferby.com';

    $parameters->facebook_id = mysqli_real_escape_string($con, $parameters->facebook_id);
    $parameters->business_phone = mysqli_real_escape_string($con, $parameters->business_phone); 

    $query = "
    INSERT INTO `place` (`place_id`, `admin_id`, `facebook_id`,  `business_name`, `business_phone`, `business_logo`, `auth`) 
    VALUES (NULL, '$parameters->admin_id', '$parameters->facebook_id',  '$parameters->business_name', '$parameters->business_phone', '$namelFotoV', '$auth');";
    echo $query;
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        $place_id = mysqli_insert_id($con);
        return $place_id;
    } 
    
    return false;    

}



function switch_show_shop($parameters) {//
    global $con;

    $query = "
    UPDATE place 
    SET show_shop = $parameters->show_shop 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } 
    
    return 0; //mysqli_error($con);

}

function switch_show_locations($parameters) {//
    global $con;

    $query = "
    UPDATE place 
    SET show_locations = $parameters->show_locations 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } 
    
    return 0; //mysqli_error($con);

}


function switch_show_events($parameters) {//
    global $con;

    $query = "
    UPDATE place 
    SET show_events = $parameters->show_events 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } 
    
    return 0; //mysqli_error($con);

}

function switch_show_promos($parameters) {//
    global $con;

    $query = "
    UPDATE place 
    SET show_promos = $parameters->show_promos 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } 
    
    return 0; //mysqli_error($con);

}

function switch_show_coupons($parameters) {//
    global $con;

    $query = "
    UPDATE place 
    SET show_coupons = $parameters->show_coupons 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } 
    
    return 0; //mysqli_error($con);

}

function switch_addon_check_in($parameters) {//
    global $con;

    $query = "
    UPDATE place 
    SET addon_check_in = $parameters->addon_check_in 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } 
    
    return 0; //mysqli_error($con);

}

function switch_addon_puntos($parameters) {//
    global $con;

    $query = "
    UPDATE place 
    SET addon_puntos = $parameters->addon_puntos 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } 
    
    return 0; //mysqli_error($con);

}

function switch_map_directions($parameters) {//
    global $con;

    $query = "
    UPDATE place 
    SET map_directions = $parameters->map_directions 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } 
    
    return 0; //mysqli_error($con);

}

function switch_show_messenger($parameters) {//
    global $con;

    $query = "
    UPDATE place 
    SET show_messenger = '$parameters->show_messenger' 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } 
    
    return 0; //mysqli_error($con);

}

function switch_show_facebook($parameters) {//
    global $con;

    $query = "
    UPDATE place 
    SET show_facebook = '$parameters->show_facebook' 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } 
    
    return 0; //mysqli_error($con);

}

function switch_show_phone($parameters) {//
    global $con;

    $query = "
    UPDATE place 
    SET show_phone = '$parameters->show_phone' 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } 

    return 0; //mysqli_error($con);

}

function get_place_by_place_id($parameters){    

    global $con;
    $query = "SELECT p.* 
    FROM place p 
    WHERE p.place_id = '$parameters->place_id'";

    $sth = mysqli_query($con, $query);
    $result = mysqli_fetch_assoc($sth);


    return $result==null? new stdClass() : (object)$result;

}

function get_place_by_admin_id($parameters){
    global $con;
    $place = new stdClass();

    $placeQuery = "SELECT p.* 
    FROM place p 
    WHERE p.admin_id = '$parameters->admin_id' ";
    $sth = mysqli_query($con, $placeQuery);
    $result = mysqli_fetch_assoc($sth);
    
    $place->place_id = $result['place_id'];
    $place->admin_id = $result['admin_id'];
    $place->addon_puntos = $result['addon_puntos'];
    $place->business_name = $result['business_name'];
    $place->status = $result['status'];

    return $place;
}

function activate_points($parameters) {
    global $con;

    $parameters->addon_puntos = 1;

    $place = get_place_by_place_id($parameters);

    $parameters->business_name = $place->business_name;

    $activation = switch_points($parameters);

    if($activation === 0)
        return 0;

    $alliance_id = insert_alliance($parameters);

    if($alliance_id === 0)
        return 0;



    
}

function insert_settings($parameters){

    global $con;


    $query = "INSERT INTO setting (setting_id, setting_place_id) VALUES (NULL, '$parameters->place_id');";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        return 1;
    } else {
        return 2;
    }
}

function insert_checkin_option($parameters){

    global $con;


    $query = "INSERT INTO checkin_option (checkin_id, checkin_place_id) VALUES (NULL, '$parameters->place_id');";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        return 1;
    } else {
        return 2;
    }
}

function insert_alliance($parameters){
    global $con;

    $query = "INSERT INTO alliance (alliance_id, alliance_name, alliance_description) VALUES (NULL, '$parameters->business_name', '$parameters->business_name');";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        return mysqli_insert_id($con);
    } else {
        return 0;
    }
}

function switch_points($parameters) {
    global $con;

    $query = "UPDATE place SET addon_puntos = '$parameters->addon_puntos' WHERE place_id = '$parameters->place_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } else {
        //echo mysqli_error($con);
        return 0;
    }
}

function select_all_settings(){

    global $con;
    $query = "SELECT * FROM setting WHERE setting_deleted = '0' ";

    $sth = mysqli_query($con, $query);

    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    return $rows;

}

function select_place_settings($parameters){
    global $con;
    $setting = new stdClass();

    $placeQuery = "SELECT s.* 
    FROM setting s 
    WHERE s.setting_place_id = '$parameters->place_id' AND s.setting_deleted = '0' ";
    $sth = mysqli_query($con, $placeQuery);
    $result = mysqli_fetch_assoc($sth);
    
    $setting->setting_place_id = $result['setting_place_id'];
    $setting->redeem_app = $result['redeem_app'];
    $setting->redeem_icon = $result['redeem_icon'];
    $setting->redeem_minimum = $result['redeem_minimum'];
    $setting->redeem_maximum = $result['redeem_maximum'];
    $setting->redeem_free_format = $result['redeem_free_format'];
    $setting->redeem_length_format = $result['redeem_length_format'];
    $setting->redeem_name_format = $result['redeem_name_format'];
    $setting->redeem_name = $result['redeem_name'];
    $setting->redeem_description = $result['redeem_description'];
    $setting->redeem_title = $result['redeem_title'];
    $setting->redeem_instruction = $result['redeem_instruction'];
    return $setting;
}

function select_place_options($parameters){

    global $con;
    $query = "SELECT * FROM checkin_option WHERE checkin_place_id = '$parameters->place_id' AND checkin_deleted = '0' ";

    $sth = mysqli_query($con, $query);
    $result = mysqli_fetch_assoc($sth);

    return $result==null? new stdClass() : $result;

}

function select_checkin_options($parameters){
    global $con;
    $options = new stdClass();

    $placeQuery = "SELECT c.* 
    FROM checkin_option c
    WHERE c.checkin_place_id = '$parameters->place_id' AND c.checkin_deleted = '0' ";
    $sth = mysqli_query($con, $placeQuery);
    $result = mysqli_fetch_assoc($sth);
    
    $options->checkin_id = $result['checkin_id'];
    $options->checkin_place_id = $result['checkin_place_id'];
    $options->checkin_icon = $result['checkin_icon'];
    $options->checkin_app = $result['checkin_app'];
    $options->checkin_minimum = $result['checkin_minimum'];
    $options->checkin_maximum = $result['checkin_maximum'];
    $options->checkin_free_format = $result['checkin_free_format'];
    $options->checkin_length_format = $result['checkin_length_format'];
    $options->checkin_name_format = $result['checkin_name_format'];
    $options->checkin_name = $result['checkin_name'];
    $options->checkin_description = $result['checkin_description'];
    $options->checkin_title = $result['checkin_title'];
    $options->checkin_instruction = $result['checkin_instruction'];
    return $options;
}

function insert_Place($admin_id, $business_name, $business_logo) {

    global $con;
    $namelFotoV = "";
    $fileRoute = uploadedFileUrl($business_logo);
    $namelFotoV = $fileRoute['name'];
    $query = "INSERT INTO `place` (`place_id`, `admin_id`, `business_name`, `business_logo`, `status`) VALUES (NULL, '$admin_id', '$business_name', '$namelFotoV', '1');";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo '1';
    } else {
        echo mysqli_error($con);
    }
}

function insert_place_user($uuid, $gcmToken, $place_Id, $platform) {
    global $con;
    $query = "DELETE FROM `place_users` WHERE `uuid` = '$uuid'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        $s_query = "INSERT INTO `place_users` (`uuid`, `gcmToken`, `place_loc_Id`, `red_id`, `platform`) VALUES ('$uuid', '$gcmToken', '$place_Id', NULL, '$platform');";
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
    $query2 = "DELETE FROM `place_admin_users` WHERE `uuid` = '$uuid'";
    mysqli_query($con, $query2);
}

function insert_place_admin_user($uuid, $gcmToken, $place_id, $platform) {
    global $con;
    $query = "DELETE FROM `place_admin_users` WHERE `uuid` = '$uuid'";
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
    $query2 = "DELETE FROM `place_users` WHERE `uuid` = '$uuid'";
    mysqli_query($con, $query2);
}

function select_place($admin_id) {//Nujabes - Feathers
    global $con;
    if ($admin_id == 'administrator@ferby.com') {
        $query = "SELECT * FROM place WHERE status = 1";
    } else {
        $query = "SELECT * FROM place WHERE status = 1 AND admin_id = '$admin_id'";
    }

    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}


function set_button_color_theme($place_id, $button_color_theme) {
    global $con;

    $query = "UPDATE place SET button_color_theme = '$button_color_theme' WHERE place_id = '$place_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function set_home_square_color($place_id, $home_square_color) {
    global $con;

    $query = "UPDATE place SET home_square_color = '$home_square_color' WHERE place_id = '$place_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}


function set_business_phone($parameters) {
    global $con;

    $query = "
    UPDATE place 
    SET business_phone = '$parameters->business_phone' 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function set_name_app($parameters) {
    global $con;

    $query = "
    UPDATE place 
    SET name_app = '$parameters->name_app' 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function set_facebook_id($parameters) {
    global $con;

    $query = "
    UPDATE place 
    SET facebook_id = '$parameters->facebook_id' 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function set_desk_text($parameters) {
    global $con;

    $query = "
    UPDATE place 
    SET desk_text = '$parameters->desk_text' 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function switch_desk($parameters) {//
    global $con;

    $query = "
    UPDATE place 
    SET desk_order = '$parameters->desk_order' 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function set_pick_text($parameters) {
    global $con;

    $query = "
    UPDATE place 
    SET pick_text = '$parameters->pick_text' 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function switch_pick($parameters) {//
    global $con;

    $query = "
    UPDATE place 
    SET pick_order = '$parameters->pick_order' 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function set_home_text($parameters) {
    global $con;

    $query = "
    UPDATE place 
    SET home_text = '$parameters->home_text' 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}


function switch_home($parameters) {//
    global $con;

    $query = "
    UPDATE place 
    SET home_order = '$parameters->home_order' 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function select_theme($place_id) {//Nujabes - Feathers
    global $con;
    $query = "SELECT *
              FROM place p 
              WHERE status = 1 AND p.place_id = '$place_id'";

    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function update_Place($pl_id, $business_name, $business_logo) {
    global $con;
    $extra = "";

    if ($business_logo != "Error action don´t exists." && $business_logo != 0) {
        $imgQuery = "SELECT business_logo FROM `place` WHERE `place_id` = '$pl_id';";
        $imgResult = mysqli_query($con, $imgQuery);
        $imgArray = mysqli_fetch_assoc($imgResult);
        delete_file($imgArray['business_logo']);
        $fileRoute = uploadedFileUrl($business_logo);
        $namelFotoV = $fileRoute['name'];
        $extra = ", `business_logo` = '$namelFotoV'";
    }
    $query = "UPDATE `place` SET `business_name` = '$business_name' $extra WHERE `place_id` = '$pl_id';";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo '1';
    } else {
        echo mysqli_error($con);
    }
}

function select_producs_from_place($place_id){
        global $con;
    $query = "SELECT m . * 
FROM  `menu` m
JOIN category c ON m.category_id = c.category_id
JOIN place p ON p.place_id = c.place_id
WHERE p.place_id = $place_id
AND m.status = 1";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}