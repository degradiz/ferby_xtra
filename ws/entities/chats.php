<?php

function getConversations($userID) {
    global $con;
    $query = 'SELECT c.id_conv, u.name As receptor_name, c.receptor As receptor_id, CONCAT("http://graph.facebook.com/",c.receptor,"/picture?type=large") AS receptor_pic ,x.name As emitter_name, x.emitter As emitter_id, CONCAT("http://graph.facebook.com/",x.emitter,"/picture?type=large") AS emitter_pic, IFNULL(y.ct,0) as ct
FROM conversations c
JOIN username u on c.receptor = u.username
LEFT OUTER JOIN (SELECT c.id_conv, u.name, c.emitter 
FROM conversations c
JOIN username u on c.emitter = u.username)x on x.id_conv = c.id_conv
LEFT OUTER JOIN (SELECT COUNT(*) as ct, c.id_conv FROM message m JOIN conversations c on c.id_conv = m.id_conv WHERE sender != "' . $userID . '" AND m.read = 0 GROUP BY m.id_conv)y on y.id_conv = c.id_conv
WHERE c.receptor = "' . $userID . '"
OR c.emitter = "' . $userID . '"
ORDER BY y.ct DESC';
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    $converted = utf8_converter($rows);
    print json_encode($converted);
}

function updateRead($userID, $id_conv) {
    global $con;
    $query = "UPDATE message set  `message`.`read` = 1 WHERE `message`.`id_conv` = $id_conv  AND `message`.`sender` != '$userID'";
    $result = mysqli_query($con, $query);
    if ($result === TRUE) {
        echo 1;
    } else {
        echo 0;
    }
}

function getMessages($convID) {
    global $con;
    $query = 'SELECT CONCAT("http://graph.facebook.com/",u.username,"/picture?type=large") AS pic, u.username, u.name, m.id_mes,m.message,m.date,m.sender,m.id_conv FROM message m
JOIN username u on u.username = m.sender
where m.id_conv = ' . $convID . ' ORDER BY m.id_mes ASC';
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $rows[] = $r;
    }
    print json_encode($rows);
}

function sendMessage($message, $sender, $id_conv) {
    global $con;

    $preSQL = "SELECT (SELECT COUNT(*) FROM message m where m.sender=$sender AND m.id_conv = $id_conv LIMIT 1 ) as SENDER, (SELECT COUNT(*) FROM message m where m.id_conv = $id_conv LIMIT 1) AS total";
    $result = mysqli_query($con, $preSQL);
    $arr = mysqli_fetch_assoc($result);
    if ($arr['SENDER'] == 2 && $arr['total'] == 2) {
        echo -1;
    } else {
        $sql = sprintf("INSERT INTO `message` (`id_mes` ,`message` ,`date` ,`sender` ,`id_conv`)VALUES (NULL ,  '%s', CURRENT_TIMESTAMP ,  '%s',  '%s');", mysqli_real_escape_string($con, $message), mysqli_real_escape_string($con, $sender), mysqli_real_escape_string($con, $id_conv));
        $result = mysqli_query($con, $sql);
        echo $sql;
        if ($result === TRUE) {
            echo 'MENSAJE INSERTADO!';
            $user = "";
            $q1 = "select * from conversations where id_conv = $id_conv";
            $sth1 = mysqli_query($con, $q1);
            $r1 = mysqli_fetch_assoc($sth1);
            if ($r1['receptor'] == $sender) {
                $user = $r1['emitter'];
            } else {
                $user = $r1['receptor'];
            }
            $q2 = "SELECT gcmTOken FROM username WHERE username = '$user' LIMIT 1";
            $sth2 = mysqli_query($con, $q2);
            $r2 = mysqli_fetch_assoc($sth2);
            $q3 = "SELECT name FROM username WHERE username = '$sender' LIMIT 1";
            $sth3 = mysqli_query($con, $q3);
            $r3 = mysqli_fetch_assoc($sth3);
            alert($r2['gcmTOken'], $r3['name']);
        } else {
            mysqli_error($con);
        }
    }
}

function selectOnline($loc) {
    global $con;
    $query = "SELECT `username` , `name` , CONCAT( 'http://graph.facebook.com/', username, '/picture?type=large' ) AS pic FROM username WHERE `username` = '100015899701211' AND `place_id` = $loc AND TIMESTAMPDIFF(MINUTE , last_seen, CURRENT_TIMESTAMP( ) ) < 25";
    $sth = mysqli_query($con, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        array_push($rows, $r);
    }
    print json_encode($rows);
}

function startChat($emitter_id, $receptor_id) {
    global $con;
    $query = 'SELECT * 
FROM  `conversations` 
WHERE  `receptor` =  "' . $emitter_id . '"
AND  `emitter` =  "' . $receptor_id . '"
UNION ALL
SELECT *
FROM  `conversations` 
WHERE `emitter` = "' . $emitter_id . '"
AND `receptor` = "' . $receptor_id . '"';
    $result = mysqli_query($con, $query);
    $n = mysqli_num_rows($result);
    if ($n == 0) {
        $secondQuery = "INSERT INTO `conversations` (`id_conv` ,`emitter` ,`receptor`)VALUES (NULL ,  '$emitter_id',  '$receptor_id');";
        $result = mysqli_query($con, $secondQuery);
        if ($result == TRUE) {
            echo $con->insert_id;
        }
    } else {
        $array = mysqli_fetch_assoc($result);
        echo $array['id_conv'];
    }
}

function updateOnlinePlace($username, $value) {
    global $con;
    if ($username != '100015899701211') {
        $query = "UPDATE `username` SET  `place_id` =  '$value' WHERE  `username`.`username` =  '$username';";
        $result = mysqli_query($con, $query);
        if ($result === TRUE) {
            echo 1;
        }
    }
}

;

function alert($gcm_key, $name) {
    // Replace with the real server API key from Google APIs
    $apiKey = "AIzaSyBsOOsegOrDfjkQFRv47GksXwkmPV540u0";

    // Replace with the real client registration IDs
    $registrationIDs = array($gcm_key);

    // Message to be sent
    $message = "Nuevo mensaje de $name";

    // Set POST variables
    $url = 'https://android.googleapis.com/gcm/send';

    $fields = array(
        'registration_ids' => $registrationIDs,
        'data' => array("message" => $message),
    );
    $headers = array(
        'Authorization: key=' . $apiKey,
        'Content-Type: application/json'
    );

    // Open connection
    $ch = curl_init();

    // Set the URL, number of POST vars, POST data
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    //curl_setopt( $ch, CURLOPT_POSTFIELDS, json_encode( $fields));

    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    // curl_setopt($ch, CURLOPT_POST, true);
    // curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));

    // Execute post
    $result = curl_exec($ch);

    // Close connection
    curl_close($ch);
    echo $result;
    //print_r($result);
    //var_dump($result);
}

function updateLastSeen($user_id) {
    global $con;
    $q = "UPDATE `username` SET `last_seen` = CURRENT_TIMESTAMP() WHERE `username` = '$user_id';";
    $result = mysqli_query($con, $q);
    if ($result == TRUE) {
        echo 1;
    } else {
        echo 0;
    };
}

function deleteChat($conv) {
    global $con;
    $q = "DELETE FROM `conversations` WHERE id_conv = '$conv';";
    $result = mysqli_query($con, $q);
    if ($result == TRUE) {
        echo 1;
    } else {
        echo 0;
    };
}
