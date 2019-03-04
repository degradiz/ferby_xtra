<?php

$place_location = "X";
$place = "Tienda Demo Post";
$message = "Tienes una nueva orden visita para ver tu orden";
$link = "http://demo.tiendas.myferby.com/wp-admin/edit.php?post_type=shop_order";
$nombre = "fredin funez";
$telefono1 = "97501016";
$email = "fredinfu@gmail.com";
$direccion = "WooFerby Bosques del tablon";

$object_data = array(
		"place_id" => 51,
		"message" => $message,
		"nombre" => $nombre,
		"telefono1" => $telefono1,
		"email" => $email,
		"direccion" => $direccion,
		"bill_url" => $link
	);

$object_data = json_encode($object_data);

$post = array(
	"action" => "app_push_woo_ferby",
	"object_data" => $object_data
);

$postdata = http_build_query($post);

$opts = array('http' =>
    array(
        'method'  => 'POST',
        'header'  => 'Content-type: application/x-www-form-urlencoded',
        'content' => $postdata
    )
);

$context = stream_context_create($opts);
$url = "http://localhost/ferbyWeb/ws/wsMain.php";

$response = file_get_contents($url, false, $context);

echo $response;

// get order object and order details

#Echo Result Of FireBase Server
//echo $result;
