<?php

function insert_category($place_id, $name) {
    global $con;
    $query = "INSERT INTO `category` (`category_id`, `place_id`, `name`, `status`) VALUES (NULL, '$place_id', '$name', '1');";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function add_category($place_id, $name, $img, $super_category, $category_type, $category_home){
    global $con;
    
    $namelFotoV = "";

    if ($img != "") {
        $fileRoute = uploadedFileUrl($img);
        $namelFotoV = $fileRoute['name'];
    }

    $query = "INSERT INTO `category` (`category_id`, `place_id`, `name`, `category_img`,  `status`,  `super_category` ,  `category_type`,  `category_home`) VALUES (NULL, '$place_id', '$name', '$namelFotoV', '1', '$super_category', '$category_type', '$category_home');";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function update_category($cat_id, $name, $status, $category_type, $category_home) {
    global $con;
    $query = "UPDATE`category` SET  `name` = '$name', `status` = '$status', `category_type` = '$category_type', `category_home` = '$category_home' WHERE `category_id` = '$cat_id'";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function set_category_image($img, $category_id) {
    global $con;


    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];

    $query = "UPDATE category SET category_img = '$namelFotoV' WHERE category_id = '$category_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function select_Category($place_id) {
    global $con;
    $query = "SELECT * FROM category where place_id = '$place_id'";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function delete_cat($cat_id) {
    global $con;
    $query = "DELETE FROM category WHERE category_id = $cat_id";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}
