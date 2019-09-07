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


        <div class="content">
        <div class="container-fluid">
          <div class="row animated bounceInLeft">
            <div class="col-lg-12 col-md-12 col-sm-12">
              <div class="card card-stats">
                <div class="card-header card-header-tabs card-header-success">
                  <div class="nav-tabs-navigation">
                    <div class="nav-tabs-wrapper">
                      <ul class="nav nav-tabs" data-tabs="tabs">
                        <li class="nav-item">
                          <a class="nav-link show" href="../prescontratistas/show" >
                             Raspables
                            <div class="ripple-container"></div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>   
                             
                
                 <div ></div>  
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

           <?php if(isset($_GET['m'])){ echo $data['place_id']; ?> 

          <div id="notify" data-notify="container" class="col-11 col-md-4 alert alert-info alert-with-icon animated fadeInDown" role="alert" data-notify-position="top-right" style="display: inline-block; margin: 15px auto; position: fixed; transition: all 0.5s ease-in-out 0s; z-index: 1031; top: 20px; right: 20px;"><button type="button" aria-hidden="true" class="close" data-notify="dismiss" style="position: absolute; right: 10px; top: 50%; margin-top: -9px; z-index: 1033;"><i class="material-icons">close</i></button><i data-notify="icon" class="material-icons">cloud_upload</i><span data-notify="title"></span> <span data-notify="message">El archivo se ha importado con Éxito.</span><a href="#" target="_blank" data-notify="url"></a></div>

           <?php } ?> 

           <?php if(isset($_GET['f'])){ ?> 

          <div id="notify" data-notify="container" class="col-11 col-md-4 alert alert-danger alert-with-icon animated fadeInDown" role="alert" data-notify-position="top-right" style="display: inline-block; margin: 15px auto; position: fixed; transition: all 0.5s ease-in-out 0s; z-index: 1031; top: 20px; right: 20px;"><button type="button" aria-hidden="true" class="close" data-notify="dismiss" style="position: absolute; right: 10px; top: 50%; margin-top: -9px; z-index: 1033;"><i class="material-icons">close</i></button><i data-notify="icon" class="material-icons">cloud_upload</i><span data-notify="title"></span> <span data-notify="message">Ha ocurrido un error en importar el archivo.</span><a href="#" target="_blank" data-notify="url"></a></div>

           <?php } ?> 
          
           </div>
          </div>

          <!-- Modal -->
          <div class="modal fade" id="loginModal" tabindex="-1" role="">
            <div class="modal-dialog modal-login" role="document">
              <div class="modal-content">
                <div class="card card-signup card-plain">
                  <div class="modal-header">
                    <div class="card-header card-header-info text-center" style="width: 100%;">
                      <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                        <i class="material-icons">clear</i>
                      </button>

                      <h4 class="card-title">Importar Excel de Puntos</h4>

                    </div>
                  </div>

                  <div class="modal-body">
                    <form class="form" method="post" name="frmExcelImport" id="frmExcelImport" enctype="multipart/form-data" action="<?php echo base_url(); ?>import-excel/index.php">


                      <div class="card-body">

                        <div class="info info-horizontal">
                          <div class="icon icon-rose">

                          </div>
                          <div class="description">
                            <h4 class="info-title"> <i class="material-icons">attach_file</i> Seleccionar archivo</h4>
                            <p class="description">
                              Seleccione el archivo de excel con la cantidad de puntos de sus clientes.
                            </p>
                          </div>
                        </div>                              

                        
                        <input type="file" name="file" id="file" required accept=".xls,.xlsx">
                        <br>

                        <div class="info info-horizontal" style="padding-top: 30px;">
                          <div class="icon icon-rose">

                          </div>
                          <div class="description">
                            <h4 class="info-title"><i class="material-icons">timeline</i> Operaciones</h4>
                            <p class="description">
                              Seleccione la opción de actualización de puntos.
                            </p>
                          </div>
                        </div>


                        <div class="form-check form-check-radio">
                          <label class="form-check-label">
                            <input class="form-check-input" type="radio" name="opcion" id="opcion" checked value="0" >
                            Eliminar y Agregar Puntos
                            <span class="circle">
                              <span class="check"></span>
                            </span>
                          </label>
                          <label>&nbsp;&nbsp;&nbsp;&nbsp;</label>
                          <label class="form-check-label">
                            <input class="form-check-input" type="radio" name="opcion" id="opcion" value="1" >
                            Solo Agregar Puntos
                            <span class="circle">
                              <span class="check"></span>
                            </span>
                          </label>
                        </div>

                        <!-- <div class="info info-horizontal" style="padding-top: 30px;">
                          <div class="icon icon-rose">

                          </div>
                          <div class="description">
                            <h4 class="info-title"><i class="material-icons">store_mall_directory</i> Place id</h4>
                            <p class="description">
                              Numero de tienda.
                            </p>
                          </div>
                        </div>   -->                               



                        <input type="hidden" name="place_id" id="place_id" placeholder="id place" readonly class="form-control" value="<?php echo $data['place_id'];?>">

                        <br>

                        <div class="modal-footer justify-content-center">
                          <button name="import" type="submit" class="btn btn-success btn-wd btn-lg">Enviar</button>
                        </div>
                      </div>
                      <a href="<?php echo base_url(); ?>import-excel/puntos_plantilla.xlsx"> Descargar plantilla</a>
                    </div>
                  </div>
                </div>
                <!-- /.modal -->



                 <?php if(isset($_GET['m']) or isset($_GET['f'])){ ?> 

                  <!-- Bootstrap Notify -->
                  <script type="text/javascript">

                  setTimeout(function() {
                      $('#notify').fadeOut('slow');
                  }, 10000); // <-- time in milliseconds


                  $(document).ready(function(){
                    $('#notify').click(function(){
                      $(this).hide();
                    });
                  });

                  </script>

                <?php } ?>

  
 <?php include 'footer.php';?>
</body>

</html>

