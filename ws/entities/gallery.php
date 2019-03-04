<?php

function insert_galley_image($menu_id, $img, $label) {
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

function delete_galley_Image($image_id) {
    global $con;
    $imgQuery = "SELECT img FROM `images` WHERE `image_id` = '$image_id';";
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

function select_galley_image($menu_id) {
    global $con;
    global $ip;
    $q = "SELECT CONCAT('$ip/img/',img) AS img_url, image_id,menu_id,label FROM `images` WHERE menu_id = '$menu_id'";
    $sth = mysqli_query($con, $q);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}
