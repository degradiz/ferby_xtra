<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Clientes extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
		$this->load->helper('url');
		$this->load->library('grocery_CRUD');
	}

	public function _example_output($output = null)
	{ 
		$this->load->view('clientes.php',(array)$output);
	}

	public function index()
	{
		$this->_example_output((object)array('output' => '' , 'js_files' => array() , 'css_files' => array()));
	}
	
	public function show()
	{
			$crud = new grocery_CRUD();
			$crud->set_table('xtraClientes');
			$crud->unset_add();
			$crud->unset_edit();
			$crud->unset_delete();
			$crud->unset_fields('fcmToken');
			$crud->columns('identidad','nombre','platform');
			
			$output = $crud->render();
			$this->_example_output($output);
	}




}
