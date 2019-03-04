<?php

function get_contacts_referred($parameters){
    global $con;
    $query = "SELECT * FROM contacts_referred WHERE deleted = 0";

    $sth = mysqli_query($con, $query);

    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }

    return $rows;

}

function countReferidos($phoneNumber){
    global $con;
    $count = 0;
    $finalCount = referidos($count,$phoneNumber,0); //iniciaRecursividad
}

    function referidos($counter,$phNumber,$depth){
    global $con;
    if($depth < 3){
        $newDepth = $depth + 1;
        $q_Cantidad_referidos = "SELECT COUNT(*) as CantReferidos from contacts_referred WHERE `refnumber` = '$phNumber'";
      $sth = mysqli_query($con, $q_Cantidad_referidos);
      while ($r = mysqli_fetch_assoc($sth)) {
        if($r["CantReferidos"] != 0){ //si tiene gente referida
            $counter = $counter + 1;
            $query = "SELECT * FROM `contacts_referred` WHERE `refnumber` = '$phNumber'";
            $sth2 = mysqli_query($con, $query);
                 while ($r2 = mysqli_fetch_assoc($sth2)) {
                    echo $r2["contact_username"].",";
                         referidos($counter,$r2["contact_username"],$newDepth) ;
                 }
        }else{
            //EXIT
        }
      }
     }else{
        //EXIT
     }

    }

    

function create_contacts_referred($uuid, $contact_username, $refnumber, $place_id){
    global $con;
    $query = "INSERT INTO `contacts_referred` (`id`, `uuid`, `contact_username`, `refnumber`, `place_id`, `date`, `deleted`) VALUES (NULL, '$uuid', '$contact_username', '$refnumber', '$place_id', CURRENT_TIMESTAMP, '0');";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
      echo 1;
    } else {
        echo $query;
    }   
}