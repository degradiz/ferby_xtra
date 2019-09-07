<!DOCTYPE html>
<html lang="en">


    <?php include 'header.php';?>
    <?php include 'conection.php';?>


<body>
 
   <div style="width:100%;height: 700px;background-size: cover;background-image:url('https://wallpaperaccess.com/full/937101.jpg')">
      <div style="padding-top:100px">
       <div class="card" style="width:350px;padding:25px;margin:auto;">
       <img src="https://images.vexels.com/media/users/3/143097/isolated/preview/5a631e30cd478440c20da8c5578dd77c-discos-con-logo-circular-by-vexels.png" style="margin-left: 20%;width:60%" >
          <form  method="post" >
           <input placeholder="email" name="usuario" style="width:100%" type="text"/><br><br>
           <input placeholder="password" name="pass" style="width:100%" type="password"/><br><br>
                  <button type="submit" class="btn btn-info btn-fill btn-wd" style="width:100%;"> Log In </button>
                  <br><br>
                  <a href="http://localhost/Github/salco/index.php/register/show/add" style="width:100%;text-align: center;display:block">Register as a new user</a>
                  <form>
                    <?php
                     if(!isset($_POST["usuario"])){
                                if (isset($_COOKIE['user'])) {
                                unset($_COOKIE['user']); 
                                setcookie('user', null, -1, '/'); 
                                       return true;
                                } else {
                                   return false;
                                }
                              }
                     ?>

                    <?php
        
                    if(isset($_POST["usuario"])){
                         if(isset($_POST["pass"])){
                    
                                $select = "SELECT * FROM user WHERE user = '".$_POST["usuario"]."' AND password = '".md5($_POST["pass"])."'";
                              //  echo $select;
                                $result = mysqli_query($con, $select);
                                $n = mysqli_num_rows($result);
                                if ($n == 0){
                                    echo "Login Incorrect";
                                }else{
                                  $arr = mysqli_fetch_array($result);
                                    unset($_COOKIE["user"]);
                                    $cookie_name = "user";
                                    $cookie_value = $_POST["usuario"];
                                    setcookie($cookie_name, $cookie_value, time() + (86400 * 30), "/");


                                    $cookie_name = "nombre";
                                    $cookie_value = $arr["nombre"];
                                    setcookie($cookie_name, $cookie_value, time() + (86400 * 30), "/");

                                    $cookie_name = "idConstructora";
                                    $cookie_value = $arr["id_constructora"];
                                    setcookie($cookie_name, $cookie_value, time() + (86400 * 30), "/");

                                    $cookie_name = "tipo_usuario";
                                    $cookie_value = $arr["tipo_usuario"];
                                    setcookie($cookie_name, $cookie_value, time() + (86400 * 30), "/");

                                    header("Location: main"); 
                                }
                       }
                    }
                     

                    ?>
       </div>

       </div>
   </div>
    
</body>
<!--   Core JS Files   -->
<?php include 'footer.php';?>

</html>