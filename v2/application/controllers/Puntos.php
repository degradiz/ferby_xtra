<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Puntos extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
		$this->load->helper('url');
		$this->load->library('grocery_CRUD');
	}

	public function _example_output($output = null)
	{ 
		$this->load->view('puntos.php',(array)$output);
	}

	public function _form_output($output = null)
	{ 
		$this->load->view('puntos_acumular.php',(array)$output);
	}

	public function index()
	{
		$this->_example_output((object)array('output' => '' , 'js_files' => array() , 'css_files' => array()));
	}
	
	public function show()
	{
			$crud = new grocery_CRUD();
			$crud->set_table("gift_points");
			$crud->columns("gift_username" ,"gift_points","gift_bill_id","gift_time","idtienda");
			
			$crud->where(array('gift_place_id'=> "4"));
			$crud->display_as('gift_username','Identidad');
			$crud->display_as('gift_points','Puntos');
			$crud->display_as('gift_bill_id','Factura');
			$crud->display_as('gift_time','Fecha');
			$crud->display_as('idtienda','Tienda');
			$crud->unset_add();
			$crud->unset_edit();
			$crud->unset_delete();
			$crud->unset_clone();

			//$crud->add_action('Agregar manual', '', 'puntos/agregar', 'plus');

			$output = $crud->render();

			$this->_example_output($output);
	}

	public function acumular()
	{
			$crud = new grocery_CRUD();
			$crud->set_table("gift_points");
			$crud->columns("gift_username" ,"gift_points","gift_bill_id","gift_time","idtienda");
			
			$crud->where(array('gift_place_id'=> "4"));
			$crud->display_as('gift_username','Identidad');
			$crud->display_as('gift_points','Puntos');
			$crud->display_as('gift_bill_id','Factura');
			$crud->display_as('gift_time','Fecha');
			$crud->display_as('idtienda','Tienda');
			$crud->unset_add();
			$crud->unset_edit();
			$crud->unset_delete();
			$crud->unset_clone();

			//$crud->add_action('Agregar manual', '', 'puntos/agregar', 'plus');

			$output = $crud->render();

			$this->_form_output($output);
	}


function generar($post_array,$primary_key)
{
	$this->ion_auth_model->tables = array(
				
				'scratch_generated'				=> 'scratch_generated',
	);

	$query = $this->db->query("SELECT COUNT(scratch_id) AS total FROM scratch_generated WHERE scratch_generated.scratch_id=".$primary_key);

	$total = 0;

	$row = $query->row_array();

	if (isset($row))
	{
	        $total = $row['total'];
	}

	$generar_scratch = array(
        "scratch_id" => $primary_key,
        "img" => ''
    );

	$ultimo = $total;	
	for ($i=0; $i < $post_array['cant']; $i++) { 
		$ultimo ++; 
		$generar_scratch = array(
	        "scratch_id" => $primary_key,
	        "numero" => $ultimo,
	        "img" => ''
    	);
		$this->db->insert('scratch_generated',$generar_scratch);
	}
    
 
    
 
    return true;
}


function plus($post_array,$primary_key)
{

	

	$this->ion_auth_model->tables = array(
				
				'scratch_generated'				=> 'scratch_generated',
	);

	$query = $this->db->query("SELECT COUNT(scratch_id) AS total FROM scratch_generated WHERE scratch_generated.scratch_id=".$primary_key);

	$total = 0;

	$row = $query->row_array();

	if (isset($row))
	{
	        $total = $row['total'];
	}
	$cantidad_a_generar = ($post_array['cant'] - $total);

	$ultimo = $total;
	if ($cantidad_a_generar > 0) {
		for ($i=0; $i < $cantidad_a_generar; $i++) {
			$ultimo ++; 
			$generar_scratch = array(
		        "scratch_id" => $primary_key,
		        "numero" => $ultimo,
		        "img" => ''
	    	); 
			$this->db->insert('scratch_generated',$generar_scratch);
		}

		return true;
	}elseif($cantidad_a_generar == 0){
		return true;
	}
	else{
		return false;
	}

    
}

public function generated(){

			

			$crud = new grocery_CRUD();
			$crud->set_table('scratch_generated');

			$actual_link = $_SERVER['REQUEST_URI'];

			$array = explode("/", $actual_link);
						
			$clave = array_search('generated', $array);
			$id= $array[$clave + 1];
			
			$crud->where(array('scratch_generated.scratch_id'=> $id,'reclamado'=> 0	,'client_id' => null));

			$crud->set_relation('scratch_id','scratch','{name}');
			$crud->set_relation('client_id','xtraClientes','{nombre}');
			$crud->set_field_upload('img','assets/uploads/img/scratch');
			$crud->field_type('state','hidden');
			$crud->unset_add();
			$crud->unset_delete();
			$crud->edit_fields('state','img');

			$crud->callback_column('state',array($this,'url_client'));
			$crud->callback_column('img',array($this,'url_img'));


			$crud->display_as('generated_id','ID');
			$crud->display_as('scratch_id','Titulo');
			$crud->display_as('state','Estado');
			$crud->display_as('client_id','Cliente');
			$crud->display_as('img','Imagen');		
			
			$crud->unset_fields('uuid');
			$crud->columns('numero','scratch_id','state','client_id','img');

			$crud->callback_before_update(array($this, 'estado'));

			$output = $crud->render();

			$this->_example_output($output);
}

public function reclamados(){

			

			$crud = new grocery_CRUD();
			$crud->set_table('scratch_generated');

			$actual_link = $_SERVER['REQUEST_URI'];

			$array = explode("/", $actual_link);
						
			$clave = array_search('reclamados', $array);
			$id= $array[$clave + 1];

			$crud->where(array('scratch_generated.scratch_id'=> $id,'scratch_generated.reclamado'=> 1	));

			$crud->set_relation('scratch_id','scratch','{name}');
			$crud->set_relation('client_id','xtraClientes','{nombre}');
			$crud->set_field_upload('img','assets/uploads/img/scratch');
			$crud->edit_fields('reclamado','fecha_reclamado');
			$crud->field_type('reclamado','dropdown',array('1'=>'Si','0'=>'No'));
			$crud->unset_add();
			//$crud->unset_edit();
			$crud->unset_delete();

			$crud->callback_column('state',array($this,'url_client'));
			$crud->callback_column('img',array($this,'url_img'));

			$crud->required_fields('reclamado','fecha_reclamado');

			$crud->display_as('generated_id','Número');
			$crud->display_as('scratch_id','Titulo');
			$crud->display_as('state','Estado');
			$crud->display_as('client_id','Cliente');
			$crud->display_as('img','Imagen');		
			
			$crud->unset_fields('uuid');
			$crud->columns('numero','scratch_id','state','client_id','fecha_reclamado','img');

			$output = $crud->render();

			$this->_example_output($output);
}

public function asignados(){

			

			$crud = new grocery_CRUD();
			$crud->set_table('scratch_generated');

			$actual_link = $_SERVER['REQUEST_URI'];

			$array = explode("/", $actual_link);
						
			$clave = array_search('asignados', $array);
			$id= $array[$clave + 1];

			$crud->where(array('scratch_generated.scratch_id'=> $id,'scratch_generated.client_id >'=> 0 ,'scratch_generated.reclamado' => 0	));

			$crud->set_relation('scratch_id','scratch','{name}');
			$crud->set_relation('client_id','xtraClientes','{nombre}');
			$crud->set_field_upload('img','assets/uploads/img/scratch');
			$crud->field_type('state','hidden');
			$crud->unset_add();
			$crud->unset_edit();
			$crud->unset_delete();

			$crud->callback_column('state',array($this,'url_client'));
			$crud->callback_column('img',array($this,'url_img'));


			$crud->display_as('generated_id','Número');
			$crud->display_as('scratch_id','Titulo');
			$crud->display_as('state','Estado');
			$crud->display_as('client_id','Cliente');
			$crud->display_as('img','Imagen');		
			
			$crud->unset_fields('uuid','reclamado');
			$crud->columns('numero','scratch_id','state','client_id','img');

			$crud->add_action('Reclamar', '', '','redeem',array($this,'reclamar'));

			$output = $crud->render();

			$this->_example_output($output);
}

public function url_img($value, $row)
{	if ($value == '') {

		return '<a href=" ' . substr(site_url(),0,-9) . 'assets/uploads/img/scratch/retry.jpg" class="image-thumbnail"><img src="' . substr(site_url(),0,-9) . 'assets/uploads/img/scratch/retry.jpg" height="50px"></a>';
		 
	}else{
		
		return '<a href=" ' . substr(site_url(),0,-9) . 'assets/uploads/img/scratch/'.$value.'" class="image-thumbnail"><img src="' . substr(site_url(),0,-9) . 'assets/uploads/img/scratch/'.$value.'" height="50px"></a>';
	}
	
}

public function url_client($value, $row)
{	
	
	if ($value == 1 && $row->client_id != null && $row->reclamado == 0) {
		return "<a class='btn btn-success' href='".site_url('clientes/show/read/'.$row->client_id)."'>Ganador</a>";
	}elseif ($row->reclamado == 1  ) {
		return "<a class='btn btn-danger' href='".site_url('clientes/show/read/'.$row->client_id)."'>Reclamado</a>";
	}elseif ($value == 1 && $row->client_id == null) {
		return "<a class='btn btn-info' href='#'>Premiado</a>";

	}elseif ($value == 0 && $row->client_id != null) {
		return "<a class='btn btn-info' href='".site_url('clientes/show/read/'.$row->client_id)."'>Asignado</a>";
	}else{
		
		return "";
	}
	
}


function estado($post_array,$primary_key)
{
	//estado 0 esta generado pero sin asignar y no es premiado
	//estado 1 es premiado

	if($post_array['img'] != '')    {
		$post_array['state'] = 1;
	}else{
		$post_array['state'] = 0;
	}
 	
    return $post_array;
}


function reclamar($primary_key , $row)
{
	if(strstr( $row->state, 'Ganador' )){
		 return site_url('puntos/reclamados/'). $row->scratch_id .'/edit/'.$primary_key;
		}else{
			return "#";
		}
   
}



}
