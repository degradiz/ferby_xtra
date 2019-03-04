<?php

define ('HMAC_SHA256', 'sha256');
define ('SECRET_KEY', '7ea6dcbd654b4ea883f4a9cc1baaba5f9cb73c6f92044b9fa7db09ebd6537e396f776230216e453189a163e1be813be57cc34275236c433496eca734e1071323a268211b8ec44bb0962916740797d2b875741d7c19b2490b98f067e2b4665ea90445972fd1024c668191b937ed46f5eb4d46ac639e3a452c90d289bc7cf99309');

function sign ($params) {
  return signData(buildDataToSign($params), SECRET_KEY);
}

function signData($data, $secretKey) {
    return base64_encode(hash_hmac('sha256', $data, $secretKey, true));
}

function buildDataToSign($params) {
        $signedFieldNames = explode(",",$params["signed_field_names"]);
        foreach ($signedFieldNames as $field) {
           $dataToSign[] = $field . "=" . $params[$field];
        }
        return commaSeparate($dataToSign);
}

function commaSeparate ($dataToSign) {
    return implode(",",$dataToSign);
}

?>
