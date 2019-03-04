<?php 

function cupon_redeems_report($parameters){
    global $con;
    $query = "
        SELECT pl.name AS sucursal, cr.customer_name, cr.customer_phone, cr.customer_username, cr.cupon_code, cc.cupon_name, cr.redeem_date 
        FROM `cupon_redeem` cr 
        INNER JOIN place_location pl ON (cr.place_location_id = pl.place_location_id)
        INNER JOIN cupon_code cc ON (cr.cupon_code = cc.cupon_code)
        WHERE cr.deleted = 0 AND cr.place_id = '$parameters->place_id'
        ORDER BY cr.cupon_redeem_id  DESC
    ";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    return $rows;
}

function reporte_de_ventas($place_id){
    global $con;
    $query = "SELECT b.`bill_id` , b.`nombre`, b.`status`, b.`tipo_pago`, b.`email` ,b.`delivery_date`,pl.name ,SUM(bd.bill_detail_price) AS Price
FROM `bill` b 
JOIN place_location pl on pl.place_location_id = b.place_id 
JOIN place p on p.place_id = pl.place_id 
JOIN bill_detail bd on bd.bill_id = b.bill_id
WHERE b.status IN(7,8)
AND p.place_id = $place_id
GROUP BY `b`.`bill_id`
ORDER BY `b`.`bill_id` DESC";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function pointsTransactions($place_id){
    global $con;
    $query = "SELECT * FROM `gift_points` WHERE `gift_place_id` = $place_id ORDER BY `gift_points`.`gift_point_id` DESC";
     $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function checkInsTransactions($place_id){
    global $con;
    $query = "SELECT `check_username` AS usuario,`check_points` as Valor,`transaction_entry` AS Detalle,`transaction_time` AS Fecha FROM `check_in` WHERE `check_place_id` = $place_id";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}