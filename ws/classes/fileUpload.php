<?php

function uploadedFileUrl($logo) {
    include_once 'uploads.php';
    $subida = new uploads();
    $resp = array();
    $respIMGV = array();
    $respIMGV['succes'] = true;
    $namelFotoV = ""; 
    if ($logo != "") {
        if (0 < $logo['error']) {
            $resp['id'] = -96; //Error al obtener imagen
            $resp['error'] = "Error al obtener imagen";
            $resp['succes'] = false;
            $namelFotoV = 'error';
        } else {
            $respIMGV = $subida->upload($logo, ".." . DIRECTORY_SEPARATOR . "img");
        }
    }
    return $respIMGV;
}
 
function uploadedFileUrlEventos($logo) {
    include_once 'uploads.php';
    $subida = new uploads();
    $resp = array();
    $respIMGV = array();
    $respIMGV['succes'] = true;
    $namelFotoV = ""; 
    if ($logo != "") {
        if (0 < $logo['error']) {
            $resp['id'] = -96; //Error al obtener imagen
            $resp['error'] = "Error al obtener imagen";
            $resp['succes'] = false;
            $namelFotoV = 'error';
        } else {
            $respIMGV = $subida->upload($logo, ".." . DIRECTORY_SEPARATOR . "evImages");
        }
    }
    return $respIMGV;
}

function delete_file($url){
    
    $filename = "../img/$url";
    unlink($filename);
}
