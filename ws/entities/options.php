<?php

function set_option_param($parameters) {
    global $con;

    $query = "
    UPDATE options 
    SET option_param = '$parameters->option_param' 
    WHERE cod_option = '$parameters->cod_option'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } else {
        // mysqli_error($con);
    }
}

function get_options($place_id) {
    global $con;
    $query = "SELECT o.*, m.* FROM options o
JOIN menu m  ON m.menu_id = o.menu_id
JOIN category c ON c.category_id = m.category_id
JOIN place p ON p.place_id = c.place_id
WHERE p.place_id = '$place_id'";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    $utf = utf8_converter($rows);
    print json_encode($utf);
}

function select_option($id_menu) {
    global $con;
    $query = "SELECT * FROM options WHERE menu_id = '$id_menu'";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function get_options_menu($menu_id) {
    global $con;
    $query = "SELECT * FROM options WHERE menu_id = '$menu_id'";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    return $rows;
    
}

function add_option($parameters) {
    global $con;
    
    $namelFotoV = "";

    if ($parameters->img != "") {
        $fileRoute = uploadedFileUrl($parameters->img);
        $namelFotoV = $fileRoute['name'];
    }

    $query = "
        INSERT INTO `options` (
            `cod_option`, 
            `option_name`, 
            `option_price`, 
            `menu_id`, 
            `group`,  
            `option_stock`,  
            `option_param`,  
            `option_img`
        ) VALUES (
            NULL, 
            '$parameters->option_name', 
            '$parameters->option_price', 
            '$parameters->menu_id', 
            '$parameters->group', 
            '$parameters->option_stock', 
            '$parameters->option_param', 
            '$namelFotoV'
        );";
    
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        return 1;
    } else {
        return 0;//mysqli_error($con);
    }
}

function get_option($cod_option){
    global $con;
    $option = new stdClass();

    $optionQuery = "SELECT * FROM options WHERE cod_option = '$cod_option' ";
    $sth = mysqli_query($con, $optionQuery);
    $result = mysqli_fetch_assoc($sth);
    
    $option->cod_option = $result['cod_option'];
    $option->option_stock = $result['option_stock'];
    $option->option_price = $result['option_price'];
    $option->option_name = $result['option_name'];
    $option->menu_id = $result['menu_id'];
    $option->group = $result['group'];

    return $option;
}

function select_options($place_id) {
    global $con;
    $query = "SELECT * FROM options o
JOIN menu m  ON m.menu_id = o.menu_id
JOIN category c ON c.category_id = m.category_id
JOIN place p ON p.place_id = c.place_id
WHERE p.place_id = '$place_id'";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    $utf = utf8_converter($rows);
    print json_encode($utf);
}

function update_option($name, $optionId, $group, $price, $optionConv,$inventory) {
    global $con;
    $query = "UPDATE `options` SET `option_name` = '$name' ,`group` = '$group', `option_price` = '$price' , `option_conversion` = '$optionConv', `option_stock` = '$inventory' WHERE `cod_option` = '$optionId' ;";
    $result = mysqli_query($con, $query);
    if ($result == TRUE) {
        echo 1;
    } else {
        echo mysqli_error($con);
    };
}

;

function insert_option($name, $menu_id,$group,$price ,$conv,$inv) {
    global $con;
    $query = "INSERT INTO `options` (`cod_option` ,`option_name` ,`menu_id` ,`group`,`option_price`,`option_conversion`,`option_stock`)VALUES (NULL ,  '$name',  '$menu_id', '$group','$price', '$conv', '$inv');";
    $result = mysqli_query($con, $query);
    if ($result == TRUE) {
        echo 1;
    } else {
        echo mysqli_error($con);
    };
}

;

function delete_option($optionId) {
    global $con;
    $query = "DELETE FROM `options` WHERE `cod_option` = '$optionId' ";
    $result = mysqli_query($con, $query);
    if ($result == TRUE) {
        echo 1;
    } else {
        echo mysqli_error($con);
    };
}

function delete_menu_options($menu_id) {
    global $con;
    $query = "DELETE FROM `options` WHERE `menu_id` = '$menu_id' ";
    $result = mysqli_query($con, $query);
    if ($result == TRUE) {
        echo 1;
    } else {
        echo mysqli_error($con);
    };
}

function insert_excel($excel, $menu_id, $group) {
    global $con;
    $array = json_decode($excel, true);
    //echo $json;

    foreach($array as $item) { //foreach element in $arr
        $name = $item['Opciones']; //etc
        $price = $item['Precio']; //etc
        $conversion = $item['Conversion']; //etc
        $query = "INSERT INTO `options` (`cod_option` ,`option_name` ,`menu_id` ,`group`, `option_price`, `option_conversion`)VALUES (NULL ,  '$name',  '$menu_id', '$group', $price, '$conversion');";
        mysqli_query($con,$query);
    }
    echo 1;

}

;
