<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of uploads
 *
 * @author Jossel
 */
class uploads {
    
    
    function dirNamegeneric($name) {
        $letras = array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');
        $name = substr($name,0, strpos($name,"."));
        $date = strtolower(substr(md5(date("Y-m-d h:m:s")), 0, 12));
        $inter1 = strtolower(substr(md5(array_rand($letras)), 0, 4));

        $dirname = $name . "-" . $inter1 . $date;
        return $dirname;
    }

    function getUniqueTargetPath($uploadDirectory, $filename) {

        if (function_exists('sem_acquire')) {
            $lock = sem_get(ftok(__FILE__, 'u'));
            sem_acquire($lock);
        }

        $pathinfo = pathinfo($filename);
        $base = $pathinfo['filename'];
        $ext = isset($pathinfo['extension']) ? $pathinfo['extension'] : '';
        $ext = $ext == '' ? $ext : '.' . $ext;

        $unique = $base;
        $suffix = 0;

        // Get unique file name for the file, by appending random suffix.

        while (file_exists($uploadDirectory . DIRECTORY_SEPARATOR . $unique . $ext)) {
            $suffix += rand(1, 999);
            $unique = $base . '-' . $suffix;
        }

        $result = $uploadDirectory . DIRECTORY_SEPARATOR . $unique . $ext;

        // Create an empty target file
        if (!touch($result)) {
            // Failed
            $result = false;
        }

        if (function_exists('sem_acquire')) {
            sem_release($lock);
        }

        return $result;
    }    
    
     function upload($archivo, $directorioUpload, $nameorigin=0) {
        $tamaño = ($archivo['size'] / (1024 / 1024)); //conversion a megas
        $resp = array();
        if ($tamaño == 0) {
            $resp["succes"] = false;
            $resp['error'] = 'El archivo esta vacio.';
            return $resp;
        }

        if ($this->toBytes(ini_get('post_max_size')) < $tamaño || $this->toBytes(ini_get('upload_max_filesize')) < $tamaño) {
            $resp["succes"] = false;
            $resp['error'] = "Error al subir. Tamaño maximo aceptado por el servidor es de " . $tamaño . "Mb";
            return $resp;
        }

        if ($this->isInaccessible($directorioUpload)) {
            $resp["succes"] = false;
            $resp['error'] = "Acceso Denegado $directorioUpload. El directorio de subida de archivos no es editable.";
            return $resp;
        }

        if ($archivo['name'] === null || $archivo['name'] === '') {
            $resp["succes"] = false;
            $resp['error'] = 'Nombre del archivo esta vacio.';
            return $resp;
        }
        
        
        $nameDirNew = $nameorigin==0? $this->dirNamegeneric($archivo['name']) . "." . pathinfo($archivo['name'])['extension']:$archivo['name'];

        while (file_exists($directorioUpload . DIRECTORY_SEPARATOR . $nameDirNew)) {
            $nameDirNew = $this->dirNamegeneric($archivo['name']);
        }

        $nameDirNew = preg_replace('/\s+/', '_', $nameDirNew);

        $ruta = $directorioUpload . DIRECTORY_SEPARATOR . $nameDirNew;
        //mkdir($ruta,0777,true);   

        $success = move_uploaded_file($archivo['tmp_name'], $ruta);
        $resp['name'] = $nameDirNew;
        $resp['ruta'] = $ruta;
        $resp["succes"] = $success;
        $resp["error"] = '';
        return $resp;
    }

    function toBytes($str) {
        $val = trim($str);
        $last = strtolower($str[strlen($str) - 1]);
        switch ($last) {
            case 'g': $val *= 1024;
            case 'm': $val *= 1024;
            case 'k': $val *= 1024;
        }
        return $val;
    }

    function isInaccessible($directory) {
        $isWin = $this->isWindows();
        $folderInaccessible = ($isWin) ? !is_writable($directory) : (!is_writable($directory) && !is_executable($directory) );
        return $folderInaccessible;
    }

    function isWindows() {
        $isWin = (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN');
        return $isWin;
    }

}
