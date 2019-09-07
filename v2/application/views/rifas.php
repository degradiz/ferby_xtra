<!DOCTYPE html>
<html lang="en">
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.js"></script>
 <?php include 'header.php';?>
<body class="">
  <div class="wrapper ">
     <?php include 'sidebar.php';?>
    <div class="main-panel">
      <!-- Navbar -->
       <?php include 'searchbar.php';?> 
      <!-- End Navbar --> 


        <div class="content" >
        <div class="container-fluid">
          <div class="row animated bounceInLeft">
            <div class="col-lg-12 col-md-12 col-sm-12">
              <div class="card card-stats">
                <div class="card-header card-header-tabs card-header-success">
                  <div class="nav-tabs-navigation">
                    <div class="nav-tabs-wrapper">
                      <ul class="nav nav-tabs" data-tabs="tabs">
                        <li class="nav-item">
                          <a class="nav-link show" href="<?php echo base_url(); ?>index.php/raspables/show" >
                             Rifas
                            <div class="ripple-container"></div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>   
               
                   <div style="padding: 10px">
                        <?php echo $output; ?>
                   </div>
                    <?php foreach($js_files as $file): ?>
                        <script src="<?php echo $file; ?>"></script>
                       <?php endforeach; ?>  
                      </div>
              </div>
            </div>
           </div>
          </div>

           
          
           </div>
          </div>

  
 <?php include 'footer.php';?>
</body>

</html>

