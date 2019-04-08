<?php

function insert_image($menu_id, $img, $label) {
    global $con;
    $namelFotoV = "";
    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];
    $query = "INSERT INTO `images` (`image_id`, `menu_id`, `img`, `label`) VALUES (NULL, '$menu_id', '$namelFotoV','$label');";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo '1';
    } else {
        echo mysqli_error($con);
    }
}

function set_img_shop($img, $place_id) {
    global $con;


    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];

    $query = "UPDATE place SET img_shop = '$namelFotoV' WHERE place_id = '$place_id'";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } else {
        return 0;// mysqli_error($con);
    }
}

function set_img_addon_puntos($img, $place_id) {
    global $con;


    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];

    $query = "UPDATE setting SET redeem_icon = '$namelFotoV' WHERE setting_place_id = '$place_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } else {
        return 0;// mysqli_error($con);
    }
}

function set_img_addon_check_in($img, $place_id) {
    global $con;


    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];

    $query = "UPDATE checkin_option SET checkin_icon = '$namelFotoV' WHERE checkin_place_id = '$place_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } else {
        return 0;// mysqli_error($con);
    }
}

function set_img_locations($img, $place_id) {
    global $con;


    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];

    $query = "UPDATE place SET img_locations = '$namelFotoV' WHERE place_id = '$place_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } else {
        return 0;// mysqli_error($con);
    }
}

function set_img_coupons($img, $place_id) {
    global $con;


    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];

    $query = "UPDATE place SET img_coupons = '$namelFotoV' WHERE place_id = '$place_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } else {
        return 0;// mysqli_error($con);
    }
}

function set_img_promos($img, $place_id) {
    global $con;


    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];

    $query = "UPDATE place SET img_promos = '$namelFotoV' WHERE place_id = '$place_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } else {
        return 0;// mysqli_error($con);
    }
}

function set_img_events($img, $place_id) {
    global $con;


    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];

    $query = "UPDATE place SET img_events = '$namelFotoV' WHERE place_id = '$place_id'";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } else {
        return 0;// mysqli_error($con);
    }
}

function set_business_logo($img, $place_id) {
    global $con;


    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];

    $query = "UPDATE place SET business_logo = '$namelFotoV' WHERE place_id = '$place_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function set_promo_img($img, $place_id) {
    global $con;


    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];

    $query = "UPDATE place SET promo_img = '$namelFotoV' WHERE place_id = '$place_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function set_messenger_img($img, $place_id) {
    global $con;


    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];

    $query = "UPDATE place SET messenger_img = '$namelFotoV' WHERE place_id = '$place_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function set_scanner_img($img, $place_id) {
    global $con;


    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];

    $query = "UPDATE place SET scanner_img = '$namelFotoV' WHERE place_id = '$place_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function set_facebook_img($img, $place_id) {
    global $con;


    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];

    $query = "UPDATE place SET facebook_img = '$namelFotoV' WHERE place_id = '$place_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function set_phone_img($img, $place_id) {
    global $con;


    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];

    $query = "UPDATE place SET phone_img = '$namelFotoV' WHERE place_id = '$place_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function set_desk_img($img, $place_id) {
    global $con;


    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];

    $query = "UPDATE place SET desk_img = '$namelFotoV' WHERE place_id = '$place_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function set_pick_img($img, $place_id) {
    global $con;


    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];

    $query = "UPDATE place SET pick_img = '$namelFotoV' WHERE place_id = '$place_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function set_home_img($img, $place_id) {
    global $con;


    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];

    $query = "UPDATE place SET home_img = '$namelFotoV' WHERE place_id = '$place_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function set_background_app($img, $place_id) {
    global $con;


    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];

    $query = "UPDATE place SET background_app = '$namelFotoV' WHERE place_id = '$place_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function set_background1($img, $place_id) {
    global $con;


    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];

    $query = "UPDATE place SET business_background1 = '$namelFotoV' WHERE place_id = '$place_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function set_background2($img, $place_id) {
    global $con;


    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];

    $query = "UPDATE place SET business_background2 = '$namelFotoV' WHERE place_id = '$place_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}


function delete_Image($image_id) {
    $imgQuery = "SELECT img FROM `images` WHERE `imeg_id` = '$image_id';";
    $imgResult = mysqli_query($con, $imgQuery);
    $imgArray = mysqli_fetch_assoc($imgResult);
    delete_file($imgArray['img']);
    $query = "DELETE FROM `images` WHERE `image_id` = '$image_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo '1';
    } else {
        echo mysqli_error($con);
    }
}

function select_image($menu_id) {
    global $con;
    global $ip;
    $q = "SELECT CONCAT('$ip',img) AS img_url, image_id,menu_id, label FROM `images` WHERE menu_id = '$menu_id'";
    $sth = mysqli_query($con, $q);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function select_place_images($place_id) {
    global $con;
    global $ip;
    $q = "SELECT CONCAT('$ip','/img/', i.img ) AS img_url, i.image_id, i.menu_id, i.label
        FROM menu m
        INNER JOIN category c ON m.category_id = c.category_id
        INNER JOIN images i ON m.menu_id = i.menu_id 
        WHERE c.place_id = '$place_id' ";
    $sth = mysqli_query($con, $q);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    $encode = utf8_converter($rows);
    print json_encode($encode);
}

