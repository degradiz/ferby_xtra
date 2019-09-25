<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Sucursales extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
		$this->load->helper('url');
		$this->load->library('grocery_CRUD');
	}

	public function _example_output($output = null)
	{ 
		$this->load->view('sucursales.php',(array)$output);
	}

	public function index()
	{
		$this->_example_output((object)array('output' => '' , 'js_files' => array() , 'css_files' => array()));
	}
	
	public function show()
	{
			$crud = new grocery_CRUD();
			$crud->set_table('sucursales');
			
			$crud->field_type('ciudad','dropdown',
            array('Choluteca' => 'Choluteca', 'Comayagua' => 'Comayagua','Juticalpa' => 'Juticalpa' ,'La Ceiba' => 'La Ceiba' ,'San Pedro Sula' => 'San Pedro Sula', 'Tegucigalpa' => 'Tegucigalpa'));

			$crud->unset_delete();
			$crud->unset_clone();
			
			$crud->columns(['sucursal_id','nombre','ciudad']);
			$output = $crud->render();

			$this->_example_output($output);
	}



}
