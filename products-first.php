<?php header('Access-Control-Allow-Headers: X-Requested-With, origin, content-type'); ?>
<?php


	$id = isset($_GET["id"]) ? $_GET["id"] : "";
	// $t = "Super Samus Blue";//isset($_GET["t"]) ? $_GET["t"] : ""
	// $d = "Super NES";
	// $img = "https://upload.wikimedia.org/wikipedia/en/f/f1/Mega_Man_X_Coverart.png";
	$response = file_get_contents('http://ferby.stolz-engineering.com/ws/wsMain.php?action=select_product&id='.$id);
	$response = json_decode($response);

	if(empty($response)){
		$p = "Lo sentimos, algo salio mal con el enlace";
		$t = "Producto no encontrado o enlace roto.";
		$d = "Consultar con el equipo de Apps Ferby.";
		$img = "http://ferby.stolz-engineering.com:8888/wp-content/uploads/2018/02/tr1.png";
		$product_img = "http://ferby.stolz-engineering.com:8888/wp-content/uploads/2018/02/tr1.png";
		$headers  = get_headers($img, 1);
		$app = "http://myferby.com";
		$price = "";
		

	}else{

		$p = $response[0]->business_name;
		$t = $response[0]->name;
		$d = $response[0]->description;
		$img = "http://ferby.stolz-engineering.com/img/".$response[0]->img;
		$app = "http://ferby.stolz-engineering.com/".$response[0]->name_app;
		$product_img = "http://ferby.stolz-engineering.com/img/".$response[0]->img;
		$price = $response[0]->price;

		$headersProduct  = get_headers($img, 1);


		if(isset($headersProduct['Content-Length'])){
			
			$size    = $headersProduct['Content-Length'];
			if($size > 299999){
				$headersCategory = get_headers($img, 1);
				if(isset($headersCategory['Content-Length'])){
					$size = $headersCategory['Content-Length'];
					if($size > 299999){
						$img = "http://ferby.stolz-engineering.com:8888/wp-content/uploads/2018/02/tr1.png";	
					//	return;
					}else{
						$img = "http://ferby.stolz-engineering.com/img/".$response[0]->category_img;
					}
					//return;
				}else{
					$img = "http://ferby.stolz-engineering.com:8888/wp-content/uploads/2018/02/tr1.png";	
				}
				//return;
			}else{
				$img = "http://ferby.stolz-engineering.com/img/".$response[0]->img;
			}
			//return;
		}else{

			$img = "http://ferby.stolz-engineering.com/img/".$response[0]->category_img;
			$headersCategory = get_headers($img, 1);
			if(isset($headersCategory['Content-Length'])){
				$size = $headersCategory['Content-Length'];
				if($size > 299999){
					$img = "http://ferby.stolz-engineering.com:8888/wp-content/uploads/2018/02/tr1.png";	
					return;
				}
			}else{
				$img = "http://ferby.stolz-engineering.com:8888/wp-content/uploads/2018/02/tr1.png";
			}
		}
	//return;
	}
?>
<html prefix="og: http://ogp.me/ns#">
	<head>	
		<meta charset="utf-8">
		<title><?php echo $t; ?></title>
		<meta property="og:title" content="<?php echo $t; ?>" />
		<meta property="og:description" content="<?php echo $d; ?>" />
		<!-- <meta property="og:image" itemprop="image" content="<?php echo $img; ?>" /> -->

		<!-- <div id='hidden' style='display:none;'><img src="<?php echo $img; ?>"></div> -->

		<span itemprop="image" itemscope itemtype="http://schema.org/ImageObject"> 
			<link itemprop="url" href="<?php echo $img; ?>" >
			<meta itemprop="width" content="1024">
		 	<meta itemprop="height" content="1024">
		</span>

		<meta property="og:type" content="website" />
		<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
	</head>
	<body style="background-color:#6f0000;font-family: 'Roboto', sans-serif;">
		<!-- <link itemprop="thumbnailUrl" href="<?php echo $img; ?>"> 
		<span itemprop="thumbnail" itemscope="" itemtype="http://schema.org/ImageObject"> 
			<link itemprop="url" href="<?php echo $img; ?>"> 
		</span>	 -->
		
		<div style="max-width:1000px;margin:auto; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);background-color:#fafafa;display:block;margin-top:25px;">
			<div style="padding-top: 20px;padding-bottom: 40px;">
				<h1 style="width:100%;text-align: center"><?php echo $p;?></h1>
				<img style="width:100%;max-width:450px; margin:auto; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);display:block;margin-top:25px;" src='<?php echo $product_img; ?>' />
				<h2 style="width:100%;text-align: center"><?php echo $t;?></h2>
				<h2 style="width:100%;text-align: center"><?php echo $price;?></h2>
				<p style="width:100%;text-align: center"><?php echo $d;?></p>
				<center><a style="width:100%;" href="<?php echo $app;?>">Visitar Pagina</a></center>
		    </div>
		</div>
	</body>
</html>

