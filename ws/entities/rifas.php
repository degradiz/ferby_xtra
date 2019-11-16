<?php
 
function select_scratch($parameters){
   
    // Obtener la lista de cupones
    global $con;

    $query = "SELECT sucursales.nombre as sucursal , sucursales.ciudad , scratch_generated.scratch_id , scratch.img , description , count(scratch_generated.generated_id) as numeros FROM `scratch_generated` RIGHT join scratch  on scratch_generated.scratch_id = scratch.scratch_id left join sucursales on scratch.place_location_id = sucursales.sucursal_id  WHERE `identidad` = '$parameters->identidad' and activo = 1 and (raspado = 0 or state = 1)  GROUP BY scratch_generated.scratch_id ORDER by scratch_generated.scratch_id ASC";

    $sth = mysqli_query($con, $query);

    $num = mysqli_num_rows($sth);
    //echo $num;
    if ($num > 0) {
        while ($r = mysqli_fetch_assoc($sth)) {
            $rows[] = $r;
        }

        return $rows;
    }

    return 0; 

}

function select_scratch_identidad($parameters){
   
    // Obtener la lista de cupones
    global $con;

    $query = "SELECT scratch_generated.scratch_id, scratch_generated.generated_id , if(scratch.img != '',scratch.img ,'retry.jpg' ) img , if(scratch_generated.img != '',scratch_generated.img ,'retry.jpg' ) img2 , scratch_generated.state , scratch_generated.raspado , reclamado FROM `scratch_generated` left join scratch ON scratch_generated.scratch_id = scratch.scratch_id WHERE scratch_generated.scratch_id = $parameters->scratch_id AND `identidad` = '$parameters->identidad' and (raspado = 0 or state = 1)  ORDER by scratch_generated.scratch_id ASC";

    $sth = mysqli_query($con, $query);

    $num = mysqli_num_rows($sth);
    //echo $num;
    if ($num > 0) {
        while ($r = mysqli_fetch_assoc($sth)) {
            $rows[] = $r;
        }

        return $rows;
    }

    return 0; 

}

function select_scratch_generated($parameters){
   
    // Obtener la lista de cupones
    global $con;

    $query = "SELECT scratch_id, generated_id , if(`img` != '',`img`,'retry.jpg' ) img , state , raspado , reclamado FROM `scratch_generated` WHERE generated_id = $parameters->generated_id and scratch_id = $parameters->scratch_id AND `identidad` = '$parameters->identidad' and raspado = 0  ORDER by scratch_generated.scratch_id ASC";


    $sth = mysqli_query($con, $query);

    $num = mysqli_num_rows($sth);
    //echo $num;
    if ($num > 0) {
        while ($r = mysqli_fetch_assoc($sth)) {

            $rows[] = $r;
        }

        return $rows;
        
    }

    return 0; 

}




function rasparscratch($parameters){
   
    // Obtener la lista de cupones
    global $con;
    $raspado = false;

    $query = "SELECT generated_id , raspado  FROM `scratch_generated` WHERE generated_id = $parameters->generated_id AND `identidad` = '$parameters->identidad' and raspado = 0 ";


    $sth = mysqli_query($con, $query);

    $num = mysqli_num_rows($sth);
    //echo $num;
    if ($num > 0) {
        while ($r = mysqli_fetch_assoc($sth)) {
            // $rows[] = $r;
        

            // return $rows;
            $query_set_raspado = "UPDATE scratch_generated SET raspado = '1' where generated_id = $parameters->generated_id and scratch_id = $parameters->scratch_id AND `identidad` = '$parameters->identidad' and raspado = 0 ";

            if ($con->query($query_set_raspado) === TRUE) {
                $raspado = true;
            
            } else {
            
            }
        }

    }

    if ($raspado) {
       return 1;
    }else{
       return 0;
    }
   
     

}

function reclamarscratch($parameters){
   
    // Obtener la lista de cupones
    global $con;
    $reclamado = false;

    $query_clave = "SELECT * FROM `scratch` LEFT JOIN sucursales on scratch.place_location_id = sucursales.sucursal_id where scratch_id = $parameters->scratch_id and clave = $parameters->clave";

    $sthclave = mysqli_query($con, $query_clave);

    $numclave = mysqli_num_rows($sthclave);
    //echo $num;
    if ($numclave > 0) {

        $query = "SELECT generated_id , reclamado  FROM `scratch_generated` WHERE generated_id = $parameters->scratch_generated_id AND `identidad` = '$parameters->identidad' and reclamado = 0 ";


        $sth = mysqli_query($con, $query);

        $num = mysqli_num_rows($sth);
        //echo $num;
        if ($num > 0) {
            while ($r = mysqli_fetch_assoc($sth)) {
                // $rows[] = $r;
            

                // return $rows;
                $query_set_reclamado = "UPDATE scratch_generated SET reclamado = '1' , fecha_reclamado = NOW()  where generated_id = $parameters->scratch_generated_id AND `identidad` = '$parameters->identidad' and state = 1 and reclamado = 0 ";

                if ($con->query($query_set_reclamado) === TRUE) {
                    $reclamado = true;
                
                } else {
                
                }
            }

        }

        if ($reclamado) {
            $reclamados_total = 0;
            $query = "SELECT SUM(reclamado) as reclamados FROM `scratch_generated` WHERE scratch_id = $parameters->scratch_id ;";
            $sth = mysqli_query($con, $query);

            $num = mysqli_num_rows($sth);
            //echo $num;
            if ($num > 0) {
                while ($r = mysqli_fetch_assoc($sth)) {
                    $reclamados_total = $r["reclamados"];
                }
            }

            if($reclamados_total > 0){
                // return $rows;
                $query_set_reclamados = "UPDATE scratch SET redeems = $reclamados_total where scratch_id = $parameters->scratch_id ;";

                if ($con->query($query_set_reclamados) === TRUE) {
                    $reclamado = true;
                
                } else {
                
                }
            }

           return 1;
        }else{
           return 0;
        }
    }else{
        return 0;
    }
     

}

function select_lottery_identidad($parameters){
   
    // Obtener la lista de cupones
    global $con;

    $query = "SELECT sucursales.nombre as sucursal , sucursales.ciudad , lottery.lottery_id as rifa, count(lottery_generated.numero) as numeros, name, sorteo , img,description  FROM `lottery_generated` RIGHT join lottery  on lottery_generated.lottery_id = lottery.lottery_id left join sucursales on lottery.place_location_id = sucursales.sucursal_id   WHERE `identidad` = '$parameters->identidad' and activo = 1 and state = 1 and reclamado = 0 group by lottery.lottery_id ORDER by lottery_generated.lottery_id ASC ";


    $sth = mysqli_query($con, $query);

    $num = mysqli_num_rows($sth);
    //echo $num;
    if ($num > 0) {
        while ($r = mysqli_fetch_assoc($sth)) {
            $rows[] = $r;
        }

        return $rows;
    }

    return 0; 

}

function select_number_lottery_identidad($parameters){
   
    // Obtener la lista de numeros de rifas
    global $con;

    $query = "SELECT lottery.lottery_id as rifa, lottery_generated.numero as numero , name, sorteo , img  FROM `lottery_generated` RIGHT join lottery  on lottery_generated.lottery_id = lottery.lottery_id WHERE `identidad` = '$parameters->identidad' and lottery.lottery_id = $parameters->lottery and activo = 1 and state = 1 and reclamado = 0 ORDER by lottery_generated.lottery_id ASC";


    $sth = mysqli_query($con, $query);

    $num = mysqli_num_rows($sth);
    //echo $num;
    if ($num > 0) {
        while ($r = mysqli_fetch_assoc($sth)) {
            $rows[] = $r;
        }

        return $rows;
    }

    return 0; 

}


function assign_number_lottery_identidad($tienda, $identidad , $amt){
   
    // Obtener la lista de cupones
    global $con;
    $asignado = false;
    
    $query_show_lottery = "SELECT show_lottery from place where place_id = 4 and show_lottery = 1";
    $sth_show_lottery = mysqli_query($con, $query_show_lottery);
    $num_show_lottery = mysqli_num_rows($sth_show_lottery);
    if ($num_show_lottery > 0) {

        // obtener id del cliente
        $query_client = "SELECT id FROM xtraClientes where identidad = '$identidad'";

        $sth_client = mysqli_query($con, $query_client);

        $num_client = mysqli_num_rows($sth_client);

        if ($num_client > 0) {
            while ($r = mysqli_fetch_assoc($sth_client)) {


                //elegir numeros de la rifa de la tienda

                $query = "SELECT lottery_id as rifa , requisito FROM `lottery` where place_location_id = $tienda";

                $sth = mysqli_query($con, $query);

                $num = mysqli_num_rows($sth);

                //echo $num;
                if ($num > 0) {
                    while ($r1 = mysqli_fetch_assoc($sth)) {

                        $boletos = intval($amt/$r1['requisito']) ;
                        //echo "boletos rifa: " . $boletos;
                        $query_get_number = "SELECT numero FROM lottery_generated where identidad is null and lottery_id = $r1[rifa] order by rand() limit $boletos";
                       
                        $sth_number = mysqli_query($con, $query_get_number);

                        $num_number = mysqli_num_rows($sth_number);

                        //echo $num_number;
                        if ($num_number > 0) {
                            while ($r2 = mysqli_fetch_assoc($sth_number)) {
                                $rows[] = $r2;
                               //echo $r2['numero'];

                               $query_set_identidad = "UPDATE lottery_generated SET identidad = '$identidad' , client_id = $r[id] , state = 1 where identidad is null and lottery_id = $r1[rifa] and numero = $r2[numero] ";
                       
                               //$sth_identidad = mysqli_query($con, $query_set_identidad);

                               if ($con->query($query_set_identidad) === TRUE) {
                                   $asignado = true;
                                   // echo "Record updated successfully";
                                } else {
                                  //  echo "Error updating record: " . $con->error;
                                }

                            }

                            if($asignado){
                                $query_asigned = "UPDATE `lottery` SET `asigned` = (SELECT COUNT(generated_id) from lottery_generated where identidad is NOT null and lottery_id = $r1[rifa] ) WHERE `lottery`.`lottery_id` = $r1[rifa] ";
                                
                                $con->query($query_asigned);
                            }
                            //print_r($rows);
                            $queryUser = "SELECT fcmToken, platform FROM xtraClientes WHERE identidad = '$identidad' LIMIT 1";
                            $sth = mysqli_query($con, $queryUser);
                             while ($r = mysqli_fetch_assoc($sth)) {
                                $parameters = new stdClass();
                                
                                $parameters->title = "Transacción de Rifas";
                                $parameters->body = "Se asignaron $num_number números de rifa a tu app";
                                
                                $parameters->cType = "l";
                                $parameters->fcm_key = "AIzaSyCN9BOgTjBQTfMX2SOWT4gc14LzxpgMz3s";
                                if($r["platform"] == "Android"){
                                    sendPushNotificationAndroidUser($r["fcmToken"], $parameters);
                                }
                           }
                            return $rows;
                        }
                    }

                  // return $rows;
                }
            }
        }

        
        return 0; 

    }else{
        return 0; 
    }
}


function assign_scratch_identidad($tienda, $identidad , $amt){
   
    // Obtener la lista de cupones
    global $con;
    $asignado = false;
    
    $query_show_scratch = "SELECT show_scratch from place where place_id = 4 and show_scratch = 1";
    $sth_show_scratch = mysqli_query($con, $query_show_scratch);
    $num_show_scratch = mysqli_num_rows($sth_show_scratch);
    if ($num_show_scratch > 0) {


        // obtener id del cliente
        $query_client = "SELECT id FROM xtraClientes where identidad = '$identidad'";

        $sth_client = mysqli_query($con, $query_client);

        $num_client = mysqli_num_rows($sth_client);

        if ($num_client > 0) {
            while ($r = mysqli_fetch_assoc($sth_client)) {


                //elegir numeros de la raspable de la tienda

                $query = "SELECT scratch_id as raspable , requisito FROM `scratch` where place_location_id = $tienda";

                $sth = mysqli_query($con, $query);

                $num = mysqli_num_rows($sth);

                //echo $num;
                if ($num > 0) {
                    while ($r1 = mysqli_fetch_assoc($sth)) {

                        $boletos = intval($amt/$r1['requisito']) ;
                        //echo "Raspables: " . $boletos ;
                       
                        $query_get_number = "SELECT generated_id FROM scratch_generated where identidad is null and scratch_id = $r1[raspable] order by rand() limit $boletos";
                       
                        $sth_number = mysqli_query($con, $query_get_number);

                        $num_number = mysqli_num_rows($sth_number);

                        //echo $num_number;
                        if ($num_number > 0) {
                            while ($r2 = mysqli_fetch_assoc($sth_number)) {
                                $rows[] = $r2;
                               //echo $r2['generated_id'];

                               $query_set_identidad = "UPDATE scratch_generated SET identidad = '$identidad' , client_id = $r[id] where identidad is null and scratch_id = $r1[raspable] and generated_id = $r2[generated_id] ";
                       
                               //$sth_identidad = mysqli_query($con, $query_set_identidad);

                               if ($con->query($query_set_identidad) === TRUE) {
                                   $asignado = true;
                                   // echo "Record updated successfully";
                                } else {
                                  //  echo "Error updating record: " . $con->error;
                                }

                            }

                            if($asignado){
                                $query_asigned = "UPDATE `scratch` SET `asigned` = (SELECT COUNT(generated_id) from scratch_generated where identidad is NOT null and scratch_id = $r1[raspable] ) WHERE `scratch`.`scratch_id` = $r1[raspable] ";
                                
                                $con->query($query_asigned);
                            }
                            //print_r($rows);
                            $queryUser = "SELECT fcmToken, platform FROM xtraClientes WHERE identidad = '$identidad' LIMIT 1";
                            $sth = mysqli_query($con, $queryUser);
                             while ($r = mysqli_fetch_assoc($sth)) {
                                $parameters = new stdClass();
                                
                                $parameters->title = "Transacción de Raspables";
                                $parameters->body = "Se asignaron $num_number raspables a tu app";
                                
                                $parameters->cType = "l";
                                $parameters->fcm_key = "AIzaSyCN9BOgTjBQTfMX2SOWT4gc14LzxpgMz3s";
                                if($r["platform"] == "Android"){
                                    sendPushNotificationAndroidUser($r["fcmToken"], $parameters);
                                }
                           }
                            return $rows;

                        }
                    }

                  // return $rows;
                }
            }
        }

        
        return 0; 
    }else{
        return 0;
    }
}
