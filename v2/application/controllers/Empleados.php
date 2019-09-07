<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Empleados extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
		$this->load->helper('url');
		$this->load->library('grocery_CRUD');
	}

	public function _example_output($output = null)
	{ 
		$this->load->view('empleados.php',(array)$output);
	}

	public function index()
	{
		$this->_example_output((object)array('output' => '' , 'js_files' => array() , 'css_files' => array()));
	}
	
	public function show()
	{
			$crud = new grocery_CRUD();
			$crud->set_table('usuarios_sucursal');
			$crud->where('usuarios_sucursal.place_id',$_COOKIE["frb_place_id"]);
			$crud->field_type('place_id', 'hidden');
			$crud->field_type('pin', 'hidden');
			$crud->set_relation('place_location_id','place_location','name',array('place_id' => $_COOKIE["frb_place_id"]));
			$crud->callback_before_insert(array($this,'autoprimary'));

             $crud->display_as('place_location_id','Sucursal');
            $crud->field_type('puntos','dropdown',
            array('1' => 'Si', '0' => 'No'));
            $crud->field_type('cupones','dropdown',
            array('1' => 'Si', '0' => 'No'));
            $crud->columns(['place_location_id','usuario','nombre','apellido','pin','puntos','cupones']);
			$output = $crud->render();
			$this->_example_output($output);
	}

	function autoprimary($post_array) {
	 $six_digit_random_number = mt_rand(100000, 999999);
	 $four_digit_random_number = mt_rand(1000, 9999);
     $post_array['place_id'] = $_COOKIE["frb_place_id"];
     $post_array['pin'] = $six_digit_random_number;
     $post_array['usuario'] = $post_array['usuario'].$four_digit_random_number;

    return $post_array;
}


}
