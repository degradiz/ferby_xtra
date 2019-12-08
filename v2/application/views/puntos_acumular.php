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


    <div class="row">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header card-header-danger">
            <h4 class="card-title">Asignar puntos manualmente</h4>
            <p class="card-category">Llene los datos para sumar puntos y raspables al cliente</p>
          </div>
          <div class="card-body">
            <form  method="GET" id="acumular">
  <div class="form-group">
    <label for="exampleFormControlInput1">Factura</label>
    <input type="number" class="form-control" name="factura" required placeholder="">
  </div>
  <div class="form-group">
    <label >Tienda</label>
    <select required="true" class="form-control" name="tienda">
      <option ></option>
      <option value="1">Xtra Proceres</option>
      <option value="3">Emporio SPS</option>
      <option value="6">Emporio TGU</option>
      <option value="9">Xtra Premier TGU</option>
      <option value="11">Xtra Premier Comayagua</option>
      <option value="12">Xtra Suyapa</option>
      <option value="18">Xtra Las Hadas</option>
      <option value="24">Xtra Choluteca</option>
      <option value="25">Xtra Ceiba</option>
      <option value="27">Xtra Premier Juticalpa</option>
    </select>
  </div>
    <div class="form-group">
    <label for="exampleFormControlInput1">Identidad</label>
    <input type="number" class="form-control" name="identidad" required placeholder="">
  </div>
    <div class="form-group">
    <label for="exampleFormControlInput1">Puntos</label>
    <input type="number" class="form-control" name="amt" required placeholder="">
  </div>
<input type="hidden" name="action" value="insertPoints_manually">
  <input type="hidden" name="place_id" value="4">

<button id="btn-ingresar" class="btn btn-primary" onclick="enviar()">Enviar</button>
</form>
          </div>
        </div>
      </div>
    </div>

    <?php foreach($js_files as $file): ?>
      <script src="<?php echo $file; ?>"></script>
    <?php endforeach; ?>  


  </div>

</div>

<?php include 'footer.php';?>
</body>

<script type="text/javascript">

function enviar(){  
  var url = "https://app.almacenesxtra.com/ws/wsMain.php";
  var form = $("#acumular");
  form.validate();

  if(form.valid()){
    $.ajax({                        
      type: "GET",                 
      url: url,                     
      data: $("#acumular").serialize(), 
      success: function(data)             
      { 

        $('#acumular').trigger("reset");
        alert("Puntos enviados");
      }
    });
  }
}

</script>

</html>

