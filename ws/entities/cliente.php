<?php

function insert_xtraCliente($identdad, $nombre, $numero, $email){
    global $con;
    $prequery = "SELECT * FROM xtraclientes WHERE identidad = '$identdad'";
    $fisrtResult = mysqli_query($con, $prequery);
    $num = mysqli_num_rows($fisrtResult);
    if($num == 0 ){
        $query = "INSERT INTO `xtraclientes` (`id`, `identidad`, `nombre`, `celular`, `email`) VALUES (NULL, '$identdad', '$nombre', '$numero', '$email');";
          $secondResult = mysqli_query($con, $query);
           if ($secondResult === TRUE) {
                    echo 1;
                } else {
                    echo mysqli_error($con);
                 }
    }else{
        $queryth = "UPDATE `xtraclientes` SET `email` = '$email', nombre = '$nombre', celular = '$numero' WHERE `xtraclientes`.`identidad` = $identdad;";
         $thResult = mysqli_query($con, $queryth);
           if ($thResult === TRUE) {
                    echo 1;
                } else {
                    echo mysqli_error($con);
                 }
    }
}


function insert_Client($username, $password, $name, $email, $sex, $bday, $profile_picture, $recieve_notification, $mcId) {
    global $con;
    global $salt;
    $preQuery = "SELECT * FROM `username` WHERE username = '$username'";
    $fisrtResult = mysqli_query($con, $preQuery);
    user_mails($username, $email);

    $num = mysqli_num_rows($fisrtResult);
    if ($num == 0) {
        $md5Pass = md5($password . $salt);
        $query = "INSERT INTO `username` (`username`, `password`, `name`, `sex`, `bday`, `profile_picture`, `recieve_notification`) VALUES ('$username', '$md5Pass', '$name', '$sex', '$bday', '$profile_picture', '1');";
        $secondResult = mysqli_query($con, $query);
        if ($secondResult === TRUE) {
            user_mac_id($mcId, $username);
            echo 1;
        } else {
            echo mysqli_error($con);
        }
    } else {
        user_mac_id($mcId, $username);
        echo '2';
    }
}

function insert_Client_Man($username, $password, $name, $sex, $bday, $recieve_notification) {
    global $con;
    global $salt;
    $preQuery = "SELECT * FROM `username` WHERE username = '$username'";
    $fisrtResult = mysqli_query($con, $preQuery);
    user_mails($username, $username);
    $num = mysqli_num_rows($fisrtResult);
    if ($num == 0) {
        $md5Pass = md5($password . $salt);
        $query = "INSERT INTO `username` (`username`, `password`, `name`, `sex`, `bday`, `recieve_notification`) VALUES ('$username', '$md5Pass', '$name', '$sex', '$bday', '$profile_picture', '1');";
        $secondResult = mysqli_query($con, $query);
        if ($secondResult === TRUE) {
            echo 1;
        } else {
            echo mysqli_error($con);
        }
    } else {
        echo '2';
    }
}

function user_mails($userId, $emailStr) {
    global $con;
    $arr = [];
    $arr = explode(",", $emailStr);
    for ($i = 0; $i < sizeof($arr); $i++) {
        $prevQuery = "SELECT * FROM username_email WHERE email = '$arr[$i]'";
        $firstRes = mysqli_query($con, $prevQuery);
        $n = mysqli_num_rows($firstRes);
        if ($n == 0) {
            $query = "INSERT INTO `username_email` (`id`, `email`, `username`) VALUES (NULL, '$arr[$i]', '$userId');";
            $result = mysqli_query($con, $query);
            if ($result === TRUE) {
                echo 1;
            } else {
                echo 2;
            }
        }
    }
}

function user_mac_id($mac_id, $username) {
    global $con;
    
        $query = "UPDATE `username` set gcmToken = '$mac_id' WHERE username = '$username'";
        echo $query;
        $secondResult = mysqli_query($con, $query);
        if ($secondResult === TRUE) {
            echo 'SE ACTUALIZO EL GCM TOKEN';
        } else {
            echo mysqli_error($con);
        }
}

function login_order($place_id) {
    global $con;
    $query = "SELECT p.business_name, p.business_logo,pl.home_order_terms, pl.place_location_id, pl.name, pl.lat, pl.lon, pl.place_id
FROM place_location pl
JOIN place p ON p.place_id = pl.place_id
WHERE pl.place_location_id = $place_id";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    echo json_encode($rows);
}

function update_Pass_Client($token, $pass, $user) {
    global $con;
    global $salt;
    $query = "SELECT password FROM username WHERE username = '$user'";
    $result = mysqli_query($con, $query);
    $row = mysqli_fetch_assoc($result);
    if ($row['password'] == $token) {
        $md5pass = md5($pass . $salt);
        $queryUpdatePass = "UPDATE username SET password = '$md5pass' WHERE username = '$user'";
        $resultUpdatePass = mysqli_query($con, $queryUpdatePass);
        if ($resultUpdatePass === true) {
            echo 1;
        } else {
            echo mysqli_error($con);
        }
    } else {
        echo 2;
    };
}

function login_client($user, $pass) {
    global $salt;
    global $con;
    $md5pass = md5($pass . $salt);
    $query = "SELECT username FROM username WHERE username = '$user' AND password = '$md5pass'";
    $result = mysqli_query($con, $query);
    $num = mysqli_num_rows($result);
    if ($num > 0) {
        echo 'cod-9144';
    } else {
        echo '000-000';
    }
}

function change_client_pass($client_id, $new_Pass, $old_Pass) {
    $md5pass1 = md5($old_Pass . $salt);
    $query = "SELECT username FROM username WHERE username = '$client_id' AND password = '$md5pass1'";
    $result = mysqli_query($con, $query);
    $num = mysqli_num_rows($result);
    if ($num > 0) {
        $md5pass = md5($new_Pass . $salt);
        $queryUpdatePass = "UPDATE username SET password = '$md5pass' WHERE username = '$client_id'";
        $resultUpdatePass = mysqli_query($con, $queryUpdatePass);
        if ($resultUpdatePass === true) {
            echo 1;
        } else {
            echo mysqli_error($con);
        }
    } else {
        echo '000-000';
    }
}
