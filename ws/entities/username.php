<?php

function post_username($user) {
    global $con;
    global $salt;

    echo 'user: ' . $user;
    $user = json_decode($user);
    $md5Pass = md5($user->password . $salt);

    $preQuery = "SELECT * FROM `username` WHERE username = '$user->username'";
    $fisrtResult = mysqli_query($con, $preQuery);

    $num = mysqli_num_rows($fisrtResult);
    if ($num != 0) {
        echo 0;
        return;
    }

    $query = "INSERT INTO username 
              ('username', 'password', 'name', 'bday', 'activated') 
              VALUES 
              ('$user->username', '$md5Pass', '$user->name', '$user->bday','1');";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function add_username($username, $password, $name, $bday, $email, $place_id) {
    global $con;
    global $salt;

    $md5Pass = md5($password . $salt);

    if (user_already_exist($username, $place_id)) {
        echo 0;
        return;
    }

    //if (email_already_exist($email, $place_id)) {
    //    echo 9;
    //    return;
    //}

    $query = "INSERT INTO username 
              (username, password, name, bday, place_app_id, activated) 
              VALUES 
              ('$username', '$md5Pass', '$name', '$bday', '$place_id', '1');";

    $result = mysqli_query($con, $query);
    if ($result === true) {
        if (add_email($username, $email, $place_id)) {
            remind_credentials($email, $username, $password, $place_id);
            //$message = body_credentials($username, $password);
            //sendCustomEmail($email, $message, $name, '');
        }
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function get_users($place_id) {

    global $con;
    $query = "SELECT u.* 
             FROM username u 
             WHERE u.place_app_id = $place_id 
             ORDER BY u.last_seen DESC";

    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function login_activated_user($user, $pass) {
    global $salt;
    global $con;
    $md5pass = md5($pass . $salt);
    $query = "SELECT * FROM username WHERE username = '$user' AND password = '$md5pass'";
    $sth = mysqli_query($con, $query);
    $num = mysqli_num_rows($sth);
    if ($num > 0) {
        $result = mysqli_fetch_assoc($sth);
        if ($result['activated'] != 1) {
            echo 0;
            return;
        }
        echo 'cod-9144';
    } else {
        echo '000-000';
    }
}

function recovery_code_access($token) {
    global $salt;
    global $con;
    $md5_token = md5($token . $salt);

    $query = "SELECT * FROM username WHERE recovery_code = '$md5_token' AND TIMESTAMPDIFF(MINUTE , recovery_time, CURRENT_TIMESTAMP( ) ) < 25";
    $sth = mysqli_query($con, $query);
    $num = mysqli_num_rows($sth);
    if ($num > 0) {
        $result = mysqli_fetch_assoc($sth);
        reset_token($result['username']);
        echo '1' . $result['username'];
    } else {
        echo '0';
    }
}

function generate_code_user($username, $place_id) {

    if (!user_already_exist($username, $place_id)) {
        echo '0';
        return;
    }

    $query_email = get_email_by_username($username, $place_id);

    if (mysqli_num_rows($query_email) == 0) {
        echo '0';
        return;
    }

    $row = mysqli_fetch_assoc($query_email);
    $email = $row['email'];
    $security_code = generate_token($email);

    if (set_recovery_code($username, $place_id, $security_code)) {
        send_recovery_code($email, $security_code);
        echo '1' . $email; //.$security_code;
        return;
    }

    echo '9';
}

function generate_code_email($email, $place_id) {

    $query_email = get_email($email, $place_id);

    if (mysqli_num_rows($query_email) == 0) {
        echo '0';
        return;
    }

    //$row = mysqli_fetch_assoc($query_email);
    //$username = $row['username'];
    $security_code = generate_token($email);

    //agregado para permitir identificacion de correos duplicados 
    //$sth = mysqli_query($con, $query_email);
    while ($row = mysqli_fetch_assoc($query_email)) {
        send_recovery_code($email, $security_code);
        set_recovery_code($row['username'], $place_id, $security_code);
    }

    echo '1' . $email; //.$security_code.'hola';

    return;

    if (set_recovery_code($username, $place_id, $security_code)) {
        send_recovery_code($email, $security_code);
        echo '1' . $email . $security_code;
        return;
    }

    echo '9';
}

function add_email($username, $email, $place_id) {
    global $con;
    $query = "INSERT INTO username_email (id, email, username, place_id) VALUES (NULL, '$email', '$username', '$place_id');";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        return 1;
    } else {
        return 2;
    }
}

function get_email_by_username($username, $place_id) {
    global $con;

    $query = "SELECT * FROM `username_email` WHERE username = '$username' AND place_id = '$place_id'";
    $result = mysqli_query($con, $query);

    return $result;
}

function get_email($email, $place_id) {
    global $con;

    $query = "SELECT * FROM `username_email` WHERE email = '$email' AND place_id = '$place_id'";
    $result = mysqli_query($con, $query);

    return $result;
}

function email_already_exist($email, $place_id) {
    global $con;

    $query = "SELECT * FROM `username_email` WHERE email = '$email' AND place_id = '$place_id'";
    $result = mysqli_query($con, $query);

    $num = mysqli_num_rows($result);
    if ($num == 0) {
        return false;
    }
    return true;
}

function user_already_exist($username) {
    global $con;

    $query = "SELECT * FROM `username` WHERE username = '$username'";
    $result = mysqli_query($con, $query);

    $num = mysqli_num_rows($result);
    if ($num == 0) {
        return false;
    }
    return true;
}

function activate_user($username) {
    global $con;

    $query = "UPDATE username SET activated = '1' WHERE username = '$username'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function deactivate_user($username) {
    global $con;

    $query = "UPDATE username SET activated = '0' WHERE username = '$username'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function change_username_pass($new_pass, $username) {
    global $con;
    global $salt;

    $md5pass = md5($new_pass . $salt);
    $queryUpdatePass = "UPDATE username SET password = '$md5pass' WHERE username = '$username'";
    $resultUpdatePass = mysqli_query($con, $queryUpdatePass);
    if ($resultUpdatePass === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function update_bday($username, $bday) {
    global $con;

    $queryUpdatePass = "UPDATE username SET bday = '$bday' WHERE username = '$username'";
    $resultUpdatePass = mysqli_query($con, $queryUpdatePass);
    if ($resultUpdatePass === true) {
        echo 1;
    } else {
        echo mysqli_error($con);
    }
}

function set_recovery_code($username, $place_id, $recovery_code) {
    global $con;
    global $salt;

    $md5_code = md5($recovery_code . $salt);

    $query = "UPDATE username SET recovery_code = '$md5_code' WHERE username = '$username' AND place_app_id = '$place_id'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        return true;
    } else {
        return false;
    }
}

function reset_token($username) {
    global $con;

    $query = "UPDATE username SET recovery_code = NULL, recovery_time = 0 WHERE username = '$username'";
    $result = mysqli_query($con, $query);
    if ($result === true) {
        return 1;
    } else {
        return mysqli_error($con);
    }
}

function new_password($username, $place_id, $password) {
    global $con;
    global $salt;

    $md5_pass = md5($password . $salt);

    $query = "UPDATE username SET password = '$md5_pass' WHERE username = '$username' AND place_app_id = '$place_id' ";
    $result = mysqli_query($con, $query);
    if ($result === true) {

        $query_email = get_email_by_username($username, $place_id);

        if (mysqli_num_rows($query_email) == 0) {
            echo 2;
            return;
        }

        $row = mysqli_fetch_assoc($query_email);
        $email = $row['email'];
        remind_credentials($email, $username, $password);
        echo 1;
        return;
    } else {
        echo mysqli_error($con);
    }
}

function body_credentials($username, $password, $place_id) {
    $u = str_replace($place_id . "-", "", $username);
    $message = "
            Credenciales para App \n
            Usuario:\n
            $u\n
            Password:\n
            $password
            ";
    return $message;
}

function generate_token($email) {
    global $salt;

    $word = $email . date("H:i:s");
    $token = md5($word . $salt);
    return substr($token, 0, 6);
}

function remind_credentials($email, $username, $password, $place_id) {
    send_email($email, 'Recordatorio de credenciales ', body_credentials($username, $password, $place_id));
}
