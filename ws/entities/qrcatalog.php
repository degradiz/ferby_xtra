<?php

function insert_qr_catalog($title, $desc, $img, $place_id) {
    global $con;
    $namelFotoV = "";
    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];
    $query = "INSERT INTO `qrcatalog` (`reg_id`, `title`, `desc`, `img`, `place_id`, `status`, `type`) VALUES (NULL, '$title', '$desc', '$namelFotoV', '$place_id', '1', '1');";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo '1';
    } else {
        echo mysqli_error($con);
    }
}

function update_qr_catalog($title, $desc, $img, $place_id, $status, $reg_id) {
    global $con;
    $extra = "";
    if ($img != "0") {
        if (valid_image($img) == 'false') {
            echo -1;
            exit;
        }
        $imgQuery = "SELECT img FROM `qrcatalog` WHERE `reg_id` = '$reg_id';";
        $imgResult = mysqli_query($con, $imgQuery);
        $imgArray = mysqli_fetch_assoc($imgResult);
        delete_file($imgArray['img']);
        $fileRoute = uploadedFileUrl($img);
        $namelFotoV = $fileRoute['name'];
        $extra = ", `img` = '$namelFotoV'";
    }

    $query = "UPDATE `qrcatalog` set `title` = '$title', `desc` = '$desc',  `place_id` = '$place_id', `status` = '$status' $extra WHERE `reg_id` =  $reg_id;";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo '1';
    } else {
        echo mysqli_error($con);
    }
}

function select_logo_qr($place_id) {
    global $con;
    global $ip;
    $query = "SELECT p.business_logo FROM place p WHERE p.place_id = '$place_id'";
    $sth = mysqli_query($con, $query);
    while ($r = mysqli_fetch_assoc($sth)) {
        echo $ip . '/img/' . $r['business_logo'];
    }
}

function select_qr_catalog($place_id) {
    global $con;
    global $ip;
    $query = "SELECT q.*, p.business_logo FROM qrcatalog q JOIN place p ON p.place_id = q.place_id WHERE q.place_id = '$place_id'";
    $sth = mysqli_query($con, $query);
    $rows = array();
    $finalArray = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows['reg_id'] = $r['reg_id'];
        $rows['title'] = $r['title'];
        $rows['img'] = $ip . '/img/' . $r['img'];
        $rows['desc'] = $r['desc'];
        $rows['place_id'] = $r['place_id'];
        $rows['type'] = $r['type'];
        $rows['status'] = $r['status'];
        $rows['logo'] = $ip . '/img/' . $r['business_logo'];

        array_push($finalArray, $rows);
    }
    $utf = utf8_converter($finalArray);
    echo json_encode($utf);
}

function delete_qr_catalog($qr_reg) {
    global $con;
    $query = "DELETE from qrcatalog where reg_id = '$qr_reg'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo '1';
    } else {
        echo mysqli_error($con);
    }
}

function select_prd_qr($reg_id) {
    global $con;
    global $ip;
    $query = "SELECT * FROM qrcatalog WHERE reg_id = '$reg_id'";

    $sth = mysqli_query($con, $query);
    $rows = array();
    $finalArray = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows['reg_id'] = $r['reg_id'];
        $rows['title'] = $r['title'];
        $rows['img'] = $ip . '/img/' . $r['img'];
        $rows['desc'] = $r['desc'];
        array_push($finalArray, $rows);
    }
    $utf = utf8_converter($finalArray);
    echo json_encode($utf);
}
