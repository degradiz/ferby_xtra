<?php
header('Access-Control-Allow-Origin: *');

function insert_bill_images($bill_id,$img){
	global $con;
	$fileRoute = uploadedFileUrl($img);
	$namelFotoV = $fileRoute['name'];
	$query = "INSERT INTO `bill_images` (`imgId`, `bill_id`, `imgUrl`) VALUES (NULL, '$bill_id', '$namelFotoV');";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo 1;
    } else {
        echo '0';
    }
}

function insert_bill_refImage($bill_id,$img){
    global $con;
    $preQuery = "SELECT * FROM bill_detail WHERE bill_id =  '$bill_id' AND STATUS <> -1 ORDER BY bill_detail_id DESC LIMIT 1";
    $presth = mysqli_query($con, $preQuery);
    while ($rPre = mysqli_fetch_assoc($presth)) {
    $fileRoute = uploadedFileUrl($img);
    $namelFotoV = $fileRoute['name'];
    $bill_detail_id = $rPre['bill_detail_id'];
    $query = "UPDATE  `ferby`.`bill_detail` SET  `img` =  '$namelFotoV' WHERE  `bill_detail`.`bill_detail_id` = '$bill_detail_id'";
   
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo 1;
    } else {
        echo '0';
    }
   }
}



function compress($source, $destination, $quality) {

    $info = getimagesize($source);

    if ($info['mime'] == 'image/jpeg') 
        $image = imagecreatefromjpeg($source);

    elseif ($info['mime'] == 'image/gif') 
        $image = imagecreatefromgif($source);

    elseif ($info['mime'] == 'image/png') 
        $image = imagecreatefrompng($source);

    imagejpeg($image, $destination, $quality);

    return $destination;
}