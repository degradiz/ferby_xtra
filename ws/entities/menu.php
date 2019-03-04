<?php

function menu_concat_options($parameters){
    global $con;

    $query = "
    SELECT m.menu_id AS id, m.name, m.description, m.tipo_menu, m.category_id AS menu_category_id, m.menu_price, m.price, m.menu_points, m.menu_stock, m.img, m.status, o.option_param, o.option_name 
    FROM menu m
    INNER JOIN category c ON (m.category_id = c.category_id)
    INNER JOIN options o ON (m.menu_id = o.menu_id)
    WHERE c.place_id = '$parameters->place_id'
    ";
    $sth = mysqli_query($con, $query);

    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }

    return $rows;
}

function create_product($parameters) {
    global $con;
    $namelFotoV = 0;
    $menu_id = 0;
    if ($parameters->img != 0) {
        $namelFotoV = "";
        $fileRoute = uploadedFileUrl($parameters->img);
        $namelFotoV = $fileRoute['name'];
    }
    $query = "INSERT INTO `menu` 
                            (
                                `menu_id`, 
                                `category_id`, 
                                `name`, 
                                `description`, 
                                `price`, 
                                `img`, 
                                `menu_price`, 
                                `conversion`, 
                                `menu_points`
                            ) VALUES 
                            (
                                NULL, 
                                '$parameters->category_id', 
                                '$parameters->name', 
                                '$parameters->description', 
                                '$parameters->price', 
                                '$namelFotoV', 
                                '$parameters->menu_price', 
                                '$parameters->conversion',
                                '$parameters->menu_points');";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        $menu_id = mysqli_insert_id($con);
        return $menu_id;
    }

    return $menu_id;  

}

function get_category_menu($parameters){
    global $con;

    $query = "
    SELECT * 
    FROM menu  
    WHERE category_id = '$parameters->category_id' AND status = 1 ORDER BY 1 ASC
    ";
    $sth = mysqli_query($con, $query);

    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }

    return $rows;
}

function add_whatsapp_click($parameters){
    global $con;

    $menu = get_menu($parameters->id);

    $accumulated_clicks = $menu->whatsapp_clicks + 1;

    $query = "
    UPDATE menu 
    SET whatsapp_clicks = '$accumulated_clicks' 
    WHERE menu_id = '$parameters->id'
    ";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }

}

function get_menu_items($parameters){
    
    $menu_detail = new stdClass();

    $menu_detail->menu = get_menu($parameters->menu_id);
    $menu_detail->menu_options = get_options_menu($parameters->menu_id);
   

    return $menu_detail;
}

function get_menu($menu_id){
    global $con;
    $menu = new stdClass();

    $menuQuery = "SELECT * FROM menu WHERE menu_id = '$menu_id' ";
    $sth = mysqli_query($con, $menuQuery);
    $result = mysqli_fetch_assoc($sth);
    
    $menu->menu_id = $result['menu_id'];
    $menu->tipo_menu = $result['tipo_menu'];
    $menu->menu_price = $result['menu_price'];
    $menu->menu_points = $result['menu_points'];
    $menu->status = $result['status'];
    $menu->whatsapp_clicks = $result['whatsapp_clicks'];
    $menu->menu_stock = $result['menu_stock'];

    return $menu;
}

function select_product($parameters){
    global $con;
    $menu = new stdClass();

    $productQuery = "
        SELECT m.*, c.category_img, c.name AS category_name, c.place_id, p.business_name, p.name_app
        FROM menu m 
        INNER JOIN category c ON (m.category_id = c.category_id)
        INNER JOIN place p ON (c.place_id = p.place_id)
        WHERE m.menu_id = '$parameters->id' 
    ";
    $sth = mysqli_query($con, $productQuery);
    //$result = mysqli_fetch_assoc($sth);
    
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    return $rows;
}


function insert_menu($category_id, $name, $description, $price, $img, $status, $tipo_menu, $menu_price, $conversion, $menu_points,$menuInventario) {
    global $con;
    $namelFotoV = 0;
    if ($img != 0) {
        $namelFotoV = "";
        $fileRoute = uploadedFileUrl($img);
        $namelFotoV = $fileRoute['name'];
    }
    $query = "INSERT INTO `menu` 
                            (
                                `menu_id`, 
                                `category_id`, 
                                `name`, 
                                `description`, 
                                `price`, 
                                `img`, 
                                `status`, 
                                `tipo_menu`, 
                                `menu_price`, 
                                `conversion`, 
                                `menu_points`,
                                `menu_stock`
                            ) VALUES 
                            (
                                NULL, 
                                '$category_id', 
                                '$name', 
                                '$description', 
                                '$price', 
                                '$namelFotoV', 
                                '$status', 
                                '$tipo_menu', 
                                '$menu_price', 
                                '$conversion',
                                '$menu_points',
                                '$menuInventario');";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo '1';
    } else {
        echo mysqli_error($con);
    }
}

function select_menu($place_id) {
    global $con;
    $query = "SELECT m.menu_id,
c.name AS Category,
m.`name`,
m.category_id,
m.tipo_menu,
m.description,
m.price,
m.img,
m.status,
m.menu_price,
m.menu_points,
m.conversion,
m.menu_stock,
p.place_id
FROM menu m
JOIN category c on c.category_id = m.category_id
JOIN place p on p.place_id = c.place_id
AND p.place_id = '$place_id'";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function view_whatsapp_clicks($parameters) {
    global $con;
    $query = "
        SELECT m.*,
        c.name AS category_name,
        p.place_id,
        p.business_name        
        FROM menu m
        JOIN category c on c.category_id = m.category_id
        JOIN place p on p.place_id = c.place_id
        AND p.place_id = '$parameters->place_id' AND m.whatsapp_clicks != '0' 
    ";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    return $rows;
}

function update_menu($menu_id, $category_id, $name, $description, $price, $img, $status, $tipo_menu, $menu_price, $conversion, $menu_points,$menuInventario) {
    global $con;
    global $ip;
    $extra = "";
    $namelFotoV = "0";
    $imgURL = "0";
    if ($img != "0") {
        if (valid_image($img) == 'false') {
            echo -1;
            exit(0);
        }
        $imgQuery = "SELECT img FROM `menu` WHERE `menu_id` = '$menu_id';";
        $imgResult = mysqli_query($con, $imgQuery);
        $imgArray = mysqli_fetch_assoc($imgResult);
        delete_file($imgArray['img']);
        $fileRoute = uploadedFileUrl($img);
        $namelFotoV = $fileRoute['name'];
        $extra = ", `img` = '$namelFotoV'";
        $imgURL = $ip."/img/".$namelFotoV;
    }

    $query = "UPDATE `menu` 
              SET 
              `category_id` = '$category_id', 
              `name` = '$name', 
              `description` = '$description', 
              `price` = '$price', 
              tipo_menu = '$tipo_menu', 
              `menu_price` = '$menu_price', 
              `conversion` = '$conversion', 
              `menu_points` = '$menu_points', 
              `menu_stock` = '$menuInventario',
              `status` = '$status' $extra WHERE `menu_id` = '$menu_id';";
    //echo 'query '.$query;
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        $arraynm = array('resp' => "1", 'img' => $imgURL);
        echo json_encode($arraynm);
    } else {
        echo mysqli_error($con);
    }
}

function getCatMenu($place_id) {
    global $con;
    $query = "select c.category_id,c.name, c.status from category c WHERE c.place_id = '$place_id'";
    $sth = mysqli_query($con, $query);
    $rows = array();
    $array = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows['category_id'] = $r['category_id'];
        $rows['name'] = $r['name'];
        $rows['status'] = $r['status'];
        array_push($array, $rows);
    }
    $encode = utf8_converter($array);
    print json_encode($encode);
}

function select_rest_menu($place_id) {

    global $con;
    global $ip;
    $firtQuery = "SELECT c.category_id,c.name FROM category c WHERE c.status = 1 AND c.place_id = '$place_id'";
    $firstResult = mysqli_query($con, $firtQuery);
    $mainJson = array();
    $cats = array();
    $plates = array();

    while ($row = mysqli_fetch_assoc($firstResult)) {
        $cat_id = $row['category_id'];
        $cats['category_id'] = $row['category_id'];
        $cats['name'] = $row['name'];
        $cats['category_id'] = $row['category_id'];
        $cats['plates'] = array();
        $secondQuery = "select * from menu m where m.category_id = '$cat_id' ";
        $secondResult = mysqli_query($con, $secondQuery);
        $row_count = mysqli_num_rows($secondResult);
        //echo " cat: ".$cats['name'].' count menu: '.$row_count."\n";
        if ($row_count > 0) {
            while ($row2 = mysqli_fetch_assoc($secondResult)) {
                $plates['id'] = $row2['menu_id'];
                $plates['name'] = $row2['name'];
                $plates['tipo_menu'] = $row2['tipo_menu'];
                $plates['precio'] = $row2['precio'];
                $plates['img'] = $ip . '/img/' . $row2['img'];
                $plates['name'] = $row2['name'];
                $plates['description'] = $row2['description'];
                $plates['price'] = $row2['price'];
                $plates['status'] = $row2['status'];
                array_push($cats['plates'], $plates);
            }

            array_push($mainJson, $cats);
        }
    }
    $utfArray = utf8_converter($mainJson);
    echo json_encode($utfArray);
}

function select_menu_rest($place_id, $tipo_menu) {

    global $con;
    global $ip;
    $firtQuery = "SELECT c.category_id,c.name FROM category c WHERE c.status = 1 AND c.place_id = '$place_id'";
    $firstResult = mysqli_query($con, $firtQuery);
    $mainJson = array();
    $cats = array();
    $plates = array();

    while ($row = mysqli_fetch_assoc($firstResult)) {
        $cat_id = $row['category_id'];
        $cats['category_id'] = $row['category_id'];
        $cats['name'] = $row['name'];
        $cats['category_id'] = $row['category_id'];
        $cats['plates'] = array();
        if ($tipo_menu == 0) {
            $secondQuery = "select * from menu m where m.category_id = '$cat_id' ";
        } else {
            $secondQuery = "select * from menu m where m.tipo_menu != $tipo_menu AND m.category_id = '$cat_id' ";
        }
        $secondResult = mysqli_query($con, $secondQuery);
        $row_count = mysqli_num_rows($secondResult);
        //echo " cat: ".$cats['name'].' count menu: '.$row_count."\n";
        if ($row_count > 0) {
            while ($row2 = mysqli_fetch_assoc($secondResult)) {
                $plates['id'] = $row2['menu_id'];
                $plates['name'] = $row2['name'];
                $plates['tipo_menu'] = $row2['tipo_menu'];
                $plates['menu_price'] = $row2['menu_price'];
                $plates['img'] = $ip . '/img/' . $row2['img'];
                $plates['name'] = $row2['name'];
                $plates['description'] = $row2['description'];
                $plates['price'] = $row2['price'];
                $plates['status'] = $row2['status'];
                array_push($cats['plates'], $plates);
            }
            array_push($mainJson, $cats);
        }
    }
    $utfArray = utf8_converter($mainJson);
    echo json_encode($utfArray);
}

function select_full_menu($place_id) {
    global $con;
    $query = "SELECT m.menu_id,m.description , m.price,m.img
FROM menu m
JOIN category c ON c.category_id = m.category_id
JOIN place p ON c.place_id = p.place_id
WHERE p.place_id = '$place_id' ";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function get_search_menu($place_id, $description) {
    global $con;
    $query = "
SELECT m.menu_id,m.description , m.price,m.img
FROM menu m
JOIN category c ON c.category_id = m.category_id
JOIN place p ON c.place_id = p.place_id
WHERE  p.place_id = '$place_id' AND m.description LIKE '%$description%' ";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function delete_menu($menu_id) {
    global $con;
    $query = "DELETE FROM `menu` WHERE `menu_id` = '$menu_id'";
    $result = mysqli_query($con, $query);
    if ($result == TRUE) {
        echo 1;
    } else {
        echo mysqli_error($con);
    };
}

function delete_image_menu($menu_id) {
    global $con;
    $query = "UPDATE `menu` SET img = 0 WHERE `menu_id` = '$menu_id'";
    $result = mysqli_query($con, $query);
    if ($result == TRUE) {
        echo 1;
    } else {
        echo mysqli_error($con);
    };
}

function import_menu($parameters) {
    global $con;

    $array = json_decode($parameters->menu_data, true);
    //echo $json;

    foreach($array as $item) { //foreach element in $arr
        $name = $item['Producto']; //etc
        $description = $item['Descripcion']; //etc
        $menu_price = $item['Precio']; //etc
        $price = $item['PrecioDescriptivo']; //etc
        $menu_points = $item['Puntos']; //etc
        $query = "INSERT INTO `menu` (`menu_id` ,`tipo_menu` ,`category_id` ,`menu_price`, `menu_points`, `name`, `description`, `price`)
                  VALUES (NULL ,  '3',  '$parameters->category_id', '$menu_price', $menu_points, '$name', '$description', '$price');";
        mysqli_query($con,$query);
    }

    echo 1;

}

function import_menu2($parameters) {
    global $con;

    $array = json_decode($parameters->menu_data, true);
    //echo $json;

    foreach($array as $item) { //foreach element in $arr
        $name = $item['Producto']; //etc
        $description = $item['Descripcion']; //etc
        $menu_price = $item['Precio']; //etc
        $price = $item['PrecioDescriptivo']; //etc
        $menu_points = isset($item["Puntos"]) ? $item["Puntos"] : "0" ;
        $query = "INSERT INTO `menu` (`menu_id` ,`tipo_menu` ,`category_id` ,`menu_price`, `menu_points`, `name`, `description`, `price`)
                  VALUES (NULL ,  '3',  '$parameters->category_id', '$menu_price', $menu_points, '$name', '$description', '$price');";
        mysqli_query($con,$query);  
    }

    echo 1;

}
