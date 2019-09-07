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
			$crud->set_relation('place_location_id','place_location','{name} - {ciudad}');

			$crud->add_fields('place_location_id','name','description','cant');
			$crud->edit_fields('name','description');
			$crud->unset_delete();
			$crud->unset_clone();
			
			$crud->display_as('place_location_id','Sucursal');
			$crud->display_as('name','Titulo');
			$crud->display_as('description','Descripción');
			$crud->display_as('cant','Cantidad');

			$crud->add_action('Generados', '', 'raspables/generated', 'redeem');
			
			$crud->callback_after_insert(array($this, 'generar'));

			// $crud->columns(['gift_username','gift_points','gift_bill_id','gift_time','device','user']);
			$output = $crud->render();

			$this->_example_output($output);
	}


function generar($post_array,$primary_key)
{
	$this->ion_auth_model->tables = array(
				
				'scratch_generated'				=> 'scratch_generated',
	);

	$generar_scratch = array(
        "scratch_id" => $primary_key,
        "img" => ''
    );

	for ($i=0; $i < $post_array['cant']; $i++) { 
		$this->db->insert('scratch_generated',$generar_scratch);
	}
    
 
    
 
    return true;
}

public function generated(){

			

			$crud = new grocery_CRUD();
			$crud->set_table('scratch_generated');

			$actual_link = $_SERVER['REQUEST_URI'];
			$array = explode("/", $actual_link);
			$id= $array[7];

			$crud->where('scratch_generated.scratch_id',$id);

			$crud->set_relation('scratch_id','scratch','{name}');
			$crud->set_relation('client_id','xtraclientes','{nombre}');
			$crud->set_field_upload('img','assets/uploads/img/scratch');
			$crud->field_type('state','hidden');
			$crud->unset_add();
			$crud->unset_delete();
			$crud->edit_fields('state','img');

			$crud->callback_column('state',array($this,'url_client'));
			$crud->callback_column('img',array($this,'url_img'));

			$crud->display_as('scratch_id','Titulo');
			$crud->display_as('state','Estado');
			$crud->display_as('client_id','Cliente');
			$crud->display_as('img','Imagen');		
			
			$crud->unset_fields('uuid');
			$crud->columns('scratch_id','state','client_id','img');

			$crud->callback_before_update(array($this, 'estado'));

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
{	if ($value == 2) {
		return "<a class='btn btn-success' href='".site_url('clientes/show/read/'.$row->client_id)."'>Ganador</a>";
	}elseif ($value == 3) {
		return "<a class='btn btn-danger' href='".site_url('clientes/show/read/'.$row->client_id)."'>Reclamado</a>";
	}elseif ($value == 1) {
		return "<a class='btn btn-info' href='#'>Premiado</a>";
	}else{
		
		return "";
	}
	
}


function estado($post_array,$primary_key)
{
	if($post_array['img'] != '')    {
		$post_array['state'] = 1;
	}else{
		$post_array['state'] = 0;
	}
 	
    return $post_array;
}




}
