<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mesas extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
		$this->load->helper('url');
		$this->load->library('grocery_CRUD');
	}

	public function _example_output($output = null)
	{ 
		$this->load->view('mesas.php',(array)$output);
	}

	public function index()
	{
		$this->_example_output((object)array('output' => '' , 'js_files' => array() , 'css_files' => array()));
	}
	
	public function show()
	{
			$crud = new grocery_CRUD();
			$crud->set_table('mesas');
			$crud->where('mesas.place_id',$_COOKIE["frb_place_id"]);
			$crud->field_type('place_id', 'hidden');
			$crud->field_type('random_id', 'hidden');
			$crud->display_as('random_id','Identificador de la Mesa');
			$crud->display_as('place_location_id','Sucursal');
			$crud->set_relation('place_location_id','place_location','name',array('place_id' => $_COOKIE["frb_place_id"]));
			$crud->callback_before_insert(array($this,'autoprimary'));
            $crud->callback_before_update(array($this,'autoprimary'));
            $crud->columns(['numero_mesa','random_id','place_location_id']);
			$output = $crud->render();
			$this->_example_output($output);
	}

	function autoprimary($post_array) {
	 $six_digit_random_number = mt_rand(100000, 999999);
     $post_array['place_id'] = $_COOKIE["frb_place_id"];
     $post_array['random_id'] = $six_digit_random_number;
    return $post_array;
}


}
