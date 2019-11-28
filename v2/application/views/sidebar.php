<style type="text/css">
  .sidebar .nav i {
color: black;
  }

  .sidebar .nav li a, .sidebar .nav li .dropdown-menu a {
color: black  ;

  }

  .sidebar {
    width: 240px !important;
  }

  .card .card-header-success .card-icon, .card .card-header-success .card-text, .card .card-header-success:not(.card-header-icon):not(.card-header-text), .card.bg-success, .card.card-rotate.bg-success .front, .card.card-rotate.bg-success .back {
    background: linear-gradient(60deg, #ff0000, #ef0000);
}


.flexigrid .btn-danger {
  
    background-image: -webkit-linear-gradient(top, #ff1100, #F44336);
}

.nav-tabs .nav-item .nav-link {
    
    font-size: 16px;
}

</style>

<div class="sidebar" data-color="purple" data-background-color="white" data-image="<?php echo base_url()?>img/barra.jpg" style="background-image:url(<?php echo base_url()?>img/barra.jpg) !important">
      <div class="logo" style="padding:0px">
       <img src="<?php echo base_url()?>img/logo.png" style="padding: 30px;     width: 100%;" />
      </div>
      <div class="sidebar-wrapper" >
        <ul class="nav">
           <li class="nav-item " >
            <a class="nav-link" href='<?php echo site_url('home')?>' >
              <i class="material-icons">home</i>
              <p>Inicio</p>
            </a>
          </li>
          <li class="nav-item ">
            <a class="nav-link" href='<?php echo site_url('raspables/show')?>'>
              <i class="material-icons">card_giftcard</i>
              <p>Raspables</p>
            </a>
          </li>
          <li class="nav-item ">
            <a class="nav-link" href='<?php echo site_url('rifas/show')?>'>
              <i class="material-icons">receipt</i>
              <p>Rifas</p>
            </a>
          </li>
           <li class="nav-item ">
            <a class="nav-link" href='<?php echo site_url('clientes/show')?>'>
              <i class="material-icons">face</i>
              <p>Clientes</p>
            </a>
          </li>
          <li class="nav-item ">
            <a class="nav-link" href='<?php echo site_url('puntos/show')?>'>
              <i class="material-icons">radio_button_checked</i>
              <p>Puntos</p>
            </a>
          </li>
          <li class="nav-item ">
            <a class="nav-link" href='<?php echo site_url('sucursales/show')?>'>
              <i class="material-icons">store</i>
              <p>Sucursales</p>
            </a>
          </li>
           <!-- <li class="nav-item ">
            <a class="nav-link" href='<?php echo site_url('cuponesredmin/show')?>'>
              <i class="material-icons">favorite</i>
              <p>Cupones Redimidos</p>
            </a>
          </li>
           <li class="nav-item ">
            <a class="nav-link" href='<?php echo site_url('puntosredeem/show')?>'>
              <i class="material-icons">card_membership</i>
              <p>Puntos/Estampillas <br> Transaccionados</p>
            </a>
          </li>
            <li class="nav-item ">
            <a class="nav-link" href='<?php echo site_url('mesas/show')?>'>
              <i class="material-icons">line_style</i>
              <p>Mesas</p>
            </a>
          </li>
            </li>
            <li class="nav-item ">
            <a class="nav-link" href='<?php echo site_url('clientes/show')?>'>
              <i class="material-icons">face</i>
              <p>Clientes</p>
            </a>
          </li>
              <li class="nav-item ">
            <a class="nav-link" href='<?php echo site_url('promos/show')?>'>
              <i class="material-icons">bookmark</i>
              <p>Promociones</p>
            </a>
          </li>
           <li class="nav-item ">
            <a class="nav-link" href='<?php echo site_url('cupones/show')?>'>
              <i class="material-icons">card_giftcard</i>
              <p>Cupones</p>
            </a>
          </li>
          <li class="nav-item ">
            <a class="nav-link" href='<?php echo site_url('eventos/show')?>'>
              <i class="material-icons">grade</i>
              <p>Eventos</p>
            </a>
          </li>
             <li class="nav-item ">
            <a class="nav-link" href='<?php echo site_url('dispositivos/show')?>'>
              <i class="material-icons">smartphone</i>
              <p>Dispositivos</p>
            </a>
          </li>
             <li class="nav-item ">
            <a class="nav-link" href='<?php echo site_url('empleados/show')?>'>
              <i class="material-icons">nature_people</i>
              <p>Empleados</p>
            </a>
          </li> -->
        </ul>
        <br> <br> <br> <br> <br>
      </div>
    </div>