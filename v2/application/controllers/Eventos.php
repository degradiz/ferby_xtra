<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Eventos extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
		$this->load->helper('url');
		$this->load->library('grocery_CRUD');
	}

	public function _example_output($output = null)
	{ 
		$this->load->view('eventos.php',(array)$output);
	}

	public function index()
	{
		$this->_example_output((object)array('output' => '' , 'js_files' => array() , 'css_files' => array()));
	}
	
	public function show()
	{
			$crud = new grocery_CRUD();
			$crud->set_table('cupon_code');
			$crud->where('place_id',$_COOKIE["frb_place_id"]);
			$crud->where('cupon_type','2');
			$crud->field_type('cupon_code', 'hidden');
			$crud->field_type('place_id', 'hidden');
			$crud->field_type('cupon_type', 'hidden');


				$crud->display_as('cupon_name','Titulo del Evento');
			$crud->display_as('cupon_description','Descripcion');
			$crud->display_as('valid_thru','Valida Hasta:');
			$crud->display_as('created','Fecha de Creación');
			

			$crud->field_type('place_id', 'hidden');
			$crud->field_type('cupon_points', 'hidden');
		    $crud->field_type('cupon_redeems', 'hidden');
		    $crud->field_type('expired_attempts', 'hidden');
	
			$crud->columns(['cupon_name','cupon_description','valid_thru','created','cupon_status','cupon_img']);



			$crud->callback_before_insert(array($this,'autoprimary'));
            $crud->callback_before_update(array($this,'autoprimary'));
            $crud->set_field_upload('cupon_img','../img');
			$output = $crud->render();
			$this->_example_output($output);
	}

	function autoprimary($post_array) {
         $post_array['place_id'] = $_COOKIE["frb_place_id"];
     $post_array['cupon_type'] = '1';
    return $post_array;
}


}
