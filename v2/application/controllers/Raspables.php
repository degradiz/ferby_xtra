<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Raspables extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
		$this->load->helper('url');
		$this->load->library('grocery_CRUD');
	}

	public function _example_output($output = null)
	{ 
		$this->load->view('raspables.php',(array)$output);
	}

	public function index()
	{
		$this->_example_output((object)array('output' => '' , 'js_files' => array() , 'css_files' => array()));
	}
	
	public function show()
	{
			$crud = new grocery_CRUD();
			$crud->set_table('scratch');
			$crud->set_relation('place_location_id','sucursales','{nombre} - {ciudad}');
			$crud->columns('scratch_id','place_location_id','requisito','disponibles','cant','asigned','redeems','name','description','created','img');
			$crud->add_fields('place_location_id','name','description','cant','requisito','img');
			$crud->edit_fields('name','cant','activo','description','requisito','img');
			$crud->set_field_upload('img','assets/uploads/img/scratch');
			$crud->unset_delete();
			$crud->unset_clone();
			$crud->callback_column('disponibles',array($this, 'disponibles'));
			$crud->display_as('scratch_id','Raspable');
			$crud->display_as('place_location_id','Tienda');
			$crud->display_as('name','Titulo');
			$crud->display_as('description','Descripción');
			$crud->display_as('cant','Cantidad');
			$crud->display_as('asigned','Asignados');	
			$crud->display_as('redeems','Reclamados');		
			$crud->display_as('created','Creado');

			$crud->add_action('Generados', '', 'raspables/generated', 'list');
			$crud->add_action('Asignados', '', 'raspables/asignados', 'get_app');
			$crud->add_action('Reclamados', '', 'raspables/reclamados', 'redeem');
			
			$crud->callback_after_insert(array($this, 'generar'));
			$crud->callback_before_update(array($this, 'plus'));

			// $crud->columns(['gift_username','gift_points','gift_bill_id','gift_time','device','user']);
			$output = $crud->render();

			$this->_example_output($output);
	}

function disponibles($value, $row)
{
	return $row->cant - $row->asigned;
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
		        "state" => 1,
		        "img" => 'c2957-premio-sorpresa.jpg'
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

			//$crud->set_relation('client_id','xtraClientes','{nombre}');
			$crud->set_field_upload('img','assets/uploads/img/scratch');
			//$crud->field_type('state','hidden');
			$crud->field_type('raspado','dropdown',array('1'=>'Si','0'=>'No'));
			$crud->unset_add();
			$crud->unset_edit();
			$crud->unset_delete();

			$crud->callback_column('client_id',array($this,'url_client'));
			//$crud->callback_column('img',array($this,'url_img'));


			//$crud->display_as('generated_id','Número');
			
			//$crud->display_as('state','Estado');
			$crud->display_as('client_id','Cliente');
			$crud->display_as('img','Premio');			
			$crud->columns('numero','identidad','client_id','raspado','img');

			$crud->add_action('Reclamar', '', '','redeem',array($this,'reclamar'));

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
			//echo $id;
			$crud->where(array('scratch_generated.scratch_id'=> $id,'scratch_generated.client_id >'=> 0 ,'scratch_generated.reclamado' => 0	));

			
			//$crud->set_relation('client_id','xtraClientes','{nombre}');
			$crud->set_field_upload('img','assets/uploads/img/scratch');
			//$crud->field_type('state','hidden');
			$crud->field_type('raspado','dropdown',array('1'=>'Si','0'=>'No'));
			$crud->unset_add();
			$crud->unset_edit();
			$crud->unset_delete();

			$crud->callback_column('client_id',array($this,'url_client'));
			//$crud->callback_column('img',array($this,'url_img'));


			//$crud->display_as('generated_id','Número');
			
			//$crud->display_as('state','Estado');
			$crud->display_as('client_id','Cliente');
			$crud->display_as('img','Premio');			
			$crud->columns('numero','identidad','client_id','raspado','img');

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
		 return site_url('raspables/reclamados/'). $row->scratch_id .'/edit/'.$primary_key;
		}else{
			return "#";
		}
   
}



}
