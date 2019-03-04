<?php


  $id = isset($_GET["id"]) ? $_GET["id"] : "";
  // $t = "Super Samus Blue";//isset($_GET["t"]) ? $_GET["t"] : ""
  // $d = "Super NES";
  // $img = "https://upload.wikimedia.org/wikipedia/en/f/f1/Mega_Man_X_Coverart.png";
  $response = file_get_contents('https://xtra.myferby.com/ws/wsMain.php?action=select_product&id='.$id);
  $response = json_decode($response);

  if(empty($response)){
    $p = "Ferby";
    $t = "Lo sentimos, algo salio mal con el enlace";
    $d = "Producto no encontrado o enlace roto. Consultar con el equipo de Apps Ferby.";
    $img = "https://xtra.myferby.com:8888/wp-content/uploads/2018/02/tr1.png";
    $product_img = "https://xtra.myferby.com:8888/wp-content/uploads/2018/02/tr1.png";
    $headers  = get_headers($img, 1);
    $app = "http://myferby.com";
    $price = "";
    

  }else{
    //$add_whatsapp_click = file_get_contents('https://xtra.myferby.com/ws/wsMain.php?action=add_whatsapp_click&id='.$id);
    $p = $response[0]->business_name;
    $t = $response[0]->name;
    $d = $response[0]->description;
    $img = "https://xtra.myferby.com/img/".$response[0]->img;
    $app = "https://xtra.myferby.com/".$response[0]->name_app;
    $product_img = "https://xtra.myferby.com/img/".$response[0]->img;
    $price = $response[0]->price;

    // $headersProduct  = get_headers($img, 1);


    // if(isset($headersProduct['Content-Length'])){
      
    //   $size    = $headersProduct['Content-Length'];
    //   if($size > 299999){
    //     $headersCategory = get_headers($img, 1);
    //     if(isset($headersCategory['Content-Length'])){
    //       $size = $headersCategory['Content-Length'];
    //       if($size > 299999){
    //         $img = "https://xtra.myferby.com:8888/wp-content/uploads/2018/02/tr1.png";  
    //       //  return;
    //       }else{
    //         $img = "https://xtra.myferby.com/img/".$response[0]->category_img;
    //       }
    //       //return;
    //     }else{
    //       $img = "https://xtra.myferby.com:8888/wp-content/uploads/2018/02/tr1.png";  
    //     }
    //     //return;
    //   }else{
    //     $img = "https://xtra.myferby.com/img/".$response[0]->img;
    //   }
    //   //return;
    // }else{
    //   $product_img = "https://xtra.myferby.com:8888/wp-content/uploads/2018/02/tr1.png";
    //   $img = "https://xtra.myferby.com/img/".$response[0]->category_img;
    //   $headersCategory = get_headers($img, 1);
    //   if(isset($headersCategory['Content-Length'])){
    //     $size = $headersCategory['Content-Length'];
    //     if($size > 299999){
    //       $img = "https://xtra.myferby.com:8888/wp-content/uploads/2018/02/tr1.png";  
          
    //     }else{
    //       $img = "https://xtra.myferby.com/img/".$response[0]->category_img; 
    //     }
    //     $product_img = "https://xtra.myferby.com/img/".$response[0]->category_img; 
    //   }else{
    //     $img = "https://xtra.myferby.com:8888/wp-content/uploads/2018/02/tr1.png";
    //   }
    // }
  //return;
  }
?>
<!DOCTYPE html>
<html prefix="og: http://ogp.me/ns#">
<head>
  <meta charset="utf-8">
  <title><?php echo $t; ?></title>
   <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta property="og:title" content="<?php echo $t; ?>" />
  <meta property="og:description" content="<?php echo $d; ?>" />
  <meta property="og:image" itemprop="image" content="https://process.filestackapi.com/AhTgLagciQByzXpFGRI0Az/resize=width:250/<?php echo $img; ?>" />
  <meta property="og:type" content="website" />
  <link href="https://fonts.googleapis.com/css?family=Condiment" rel="stylesheet">
  <link rel="stylesheet" type="text/css" href="./css/material-style.css"  /> 
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
</head>
<body>
<div class="row">
  <center>
  <div style="padding:0px;width:100%" class="example-1 card">
    <div class="ferby">
        <span class="place" ><?php echo $p; ?></span>
        
      </div>
    <div class="wrapper" 
    style="background: white;width: 100%;height: 400px;background-image:url('<?php echo $product_img; ?>');background-position: 50% 20%;background-repeat:no-repeat;background-size:contain;"
    >


      
      
      <div class="data" style="max-height: 70%">
        <div class="content">
          
          <h1 class="title" style="font-size: 30px"><a href="#"><?php echo $t;?></a></h1>
          <p class="text"><?php echo $d;?></p>

          <h1 class="text"><?php echo $price;?></h1>
          <center><a style="width:100%;" href="<?php echo $app;?>">Visitar Página</a></center>
        </div>
        
      </div>
    </div>
  </div>
  </center>
</div>

</body>
</html>