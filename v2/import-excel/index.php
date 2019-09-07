<?php


include 'connect.php';

require_once('vendor/php-excel-reader/excel_reader2.php');
require_once('vendor/SpreadsheetReader.php');


if (isset($_POST["import"]))
{
    
    
  $allowedFileType = ['application/vnd.ms-excel','text/xls','text/xlsx','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  
  if(in_array($_FILES["file"]["type"],$allowedFileType)){

        $targetPath = 'uploads/'.$_FILES['file']['name'];
        move_uploaded_file($_FILES['file']['tmp_name'], $targetPath);
        
        $Reader = new SpreadsheetReader($targetPath);
        
        $sheetCount = count($Reader->sheets());
        $importado = false;
        for($i=0;$i<$sheetCount;$i++)
        {
            
            $Reader->ChangeSheet($i);

            $i = 0;
            $flag = 0;
            foreach ($Reader as $Row)

            {
                if(!isset($flag_first)){
                    $flag_first=1;
                }else{

                     $gift_place_id = $_POST['place_id'];
                               
                                
                    $gift_username = "";
                    if(isset($Row[0])) {
                        $gift_username = mysqli_real_escape_string($conn,$Row[0]);
                    }

                    $gift_points = "";
                    if(isset($Row[1])) {
                        $gift_points = mysqli_real_escape_string($conn,$Row[1]);
                    }
                    

                
                    if (!empty($gift_username) || !empty($gift_points)) {

                        if($_POST['opcion'] == 0 && $flag == 0){

                            $query = "DELETE FROM `gift_points` WHERE `gift_place_id` = '".$gift_place_id."' ;";
                            $result = mysqli_query($conn, $query);
                            $flag = 1;
                        }

                        
                        $query = "INSERT INTO `gift_points`(`gift_place_id`, `gift_username`,  `gift_points`,`gift_bill_id`, `gift_time`) VALUES ('".$gift_place_id."','".$gift_username."','".$gift_points."','0', CURRENT_TIMESTAMP);";
                        $result = mysqli_query($conn, $query);
                
                        if (! empty($result)) {
                            $importado = true;
                        } else {
                            $importado = false;
                        }
                        
                        
                        //echo $query;
                        //echo "<br>";
                    }
                }
                $i++;
            }
        
         }
         if ($importado) {
                $URL= $hosturl . "/index.php/puntosredeem/show?m";
                echo "<script type='text/javascript'>document.location.href='{$URL}';</script>";
                echo '<META HTTP-EQUIV="refresh" content="0;URL=' . $URL . '">';
            
         }else{
            $URL= $hosturl . "/index.php/puntosredeem/show?f";
                echo "<script type='text/javascript'>document.location.href='{$URL}';</script>";
                echo '<META HTTP-EQUIV="refresh" content="0;URL=' . $URL . '">';
         }
  }
  else
  { 
        $type = "error";
        $message = "Tipo de archivo invalido. Subir un Excel.";
  }
}
?>
