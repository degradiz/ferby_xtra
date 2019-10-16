<?php

function set_rate_app_playstore($parameters) {
    global $con;

    $query = "
    UPDATE place 
    SET rate_app_playstore = '$parameters->rate_app_playstore' 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    }

    return 0; // mysqli_error($con);

}


function set_img_rate_app($img, $place_id) {
    global $con;


    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];

    $query = "UPDATE place SET img_rate_app = '$namelFotoV' WHERE place_id = '$place_id'";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    }

    return 0;
}

function switch_show_rate_app($parameters) {//
    global $con;

    $query = "
    UPDATE place 
    SET show_rate_app = $parameters->show_rate_app 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } 
    
    return 0; //mysqli_error($con);

}

function switch_show_scratch($parameters) {//
    global $con;

    $query = "
    UPDATE place 
    SET show_scratch = $parameters->show_scratch 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } 
    
    return 0; //mysqli_error($con);

}

function switch_show_lottery($parameters) {//
    global $con;

    $query = "
    UPDATE place 
    SET show_lottery = $parameters->show_lottery 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } 
    
    return 0; //mysqli_error($con);

}

function set_rate_app_text($parameters) {
    global $con;

    $query = "
    UPDATE place 
    SET rate_app_text = '$parameters->rate_app_text' 
    WHERE place_id = '$parameters->place_id'
    ";
    //echo $query;
    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    }

    return 0; // mysqli_error($con);

}

function set_subscription_link($parameters) {
    global $con;

    $query = "
    UPDATE place 
    SET subscription_link = '$parameters->subscription_link' 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    }

    return 0; // mysqli_error($con);

}


function set_img_subscription_link($img, $place_id) {
    global $con;


    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];

    $query = "UPDATE place SET img_subscription_link = '$namelFotoV' WHERE place_id = '$place_id'";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    }

    return 0;
}

function switch_show_subscription_link($parameters) {//
    global $con;

    $query = "
    UPDATE place 
    SET show_subscription_link = $parameters->show_subscription_link 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } 
    
    return 0; //mysqli_error($con);

}

function set_subscription_link_text($parameters) {
    global $con;

    $query = "
    UPDATE place 
    SET subscription_link_text = '$parameters->subscription_link_text' 
    WHERE place_id = '$parameters->place_id'
    ";
    //echo $query;
    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    }

    return 0; // mysqli_error($con);

}

function set_img_reservar($img, $place_id) {
    global $con;


    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];

    $query = "UPDATE place SET img_reservar = '$namelFotoV' WHERE place_id = '$place_id'";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    }

    return 0;
}

function switch_show_reservar($parameters) {//
    global $con;

    $query = "
    UPDATE place 
    SET show_reservar = $parameters->show_reservar 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } 
    
    return 0; //mysqli_error($con);

}

function set_help_link($parameters) {
    global $con;

    $query = "
    UPDATE place 
    SET help_link = '$parameters->help_link' 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } else {
        return 0; // mysqli_error($con);
    }
}


function set_img_help_link($img, $place_id) {
    global $con;


    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];

    $query = "UPDATE place SET img_help_link = '$namelFotoV' WHERE place_id = '$place_id'";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    }

    return 0;
}

function switch_show_help_link($parameters) {//
    global $con;

    $query = "
    UPDATE place 
    SET show_help_link = $parameters->show_help_link 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } 
    
    return 0; //mysqli_error($con);

}



function set_instagram_username($parameters) {
    global $con;

    $query = "
    UPDATE place 
    SET instagram_username = '$parameters->instagram_username' 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } else {
        return 0; // mysqli_error($con);
    }
}

function set_img_instagram($img, $place_id) {
    global $con;


    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];

    $query = "UPDATE place SET img_instagram = '$namelFotoV' WHERE place_id = '$place_id'";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    }

    return 0;
}

function switch_show_instagram($parameters) {//
    global $con;

    $query = "
    UPDATE place 
    SET show_instagram = $parameters->show_instagram 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } 
    
    return 0; //mysqli_error($con);

}

function set_img_track_orders($img, $place_id) {
    global $con;


    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];

    $query = "UPDATE place SET img_track_orders = '$namelFotoV' WHERE place_id = '$place_id'";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } else {
        return 0;// mysqli_error($con);
    }
}

function switch_show_track_orders($parameters) {//
    global $con;

    $query = "
    UPDATE place 
    SET show_track_orders = $parameters->show_track_orders 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } 
    
    return 0; //mysqli_error($con);

}

function set_redeem_name($parameters) {
    global $con;

    $query = "
    UPDATE setting 
    SET redeem_name = '$parameters->redeem_name' 
    WHERE setting_place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    }

    return 0; // mysqli_error($con);

}

function set_fcm_key($parameters) {
    global $con;

    $query = "
    UPDATE place 
    SET fcm_key = '$parameters->fcm_key', notify_bill = '1' 
    WHERE place_id = '$parameters->place_id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    }

    return 0; // mysqli_error($con);

}
