<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Promos extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
		$this->load->helper('url');
		$this->load->library('grocery_CRUD');
	}

	public function _example_output($output = null)
	{ 
		$this->load->view('promos.php',(array)$output);
	}

	public function index()
	{
		$this->_example_output((object)array('output' => '' , 'js_files' => array() , 'css_files' => array()));
	}
	
	public function show()
	{
			$crud = new grocery_CRUD();
			$crud->set_table('promotion');
			$crud->where('place_id',$_COOKIE["frb_place_id"]);
			$crud->field_type('place_id', 'hidden');
			$crud->display_as('img','Imagen');
			$crud->display_as('title','Titulo');
			$crud->display_as('description','Descripcion de la promoción');
			$crud->field_type('type', 'hidden');
			$crud->callback_before_insert(array($this,'autoprimary'));
            $crud->callback_before_update(array($this,'autoprimary'));
            $crud->set_field_upload('img','../img');
            $crud->columns(['img','title','description']);
			$output = $crud->render();
			$this->_example_output($output);
	}

	function autoprimary($post_array) {
     $post_array['place_id'] = $_COOKIE["frb_place_id"];
    // $post_array['place_id'] = '1';
    return $post_array;
}


}
