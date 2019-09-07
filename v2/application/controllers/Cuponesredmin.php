<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Cuponesredmin extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
		$this->load->helper('url');
		$this->load->library('grocery_CRUD');
	}

	public function _example_output($output = null)
	{ 
		$this->load->view('cupon_redeem.php',(array)$output);
	}

	public function index()
	{
		$this->_example_output((object)array('output' => '' , 'js_files' => array() , 'css_files' => array()));
	}
	
	public function show()
	{
			$crud = new grocery_CRUD();
			$crud->display_as('customer_email','Email');
			$crud->display_as('customer_name','Nombre');
			$crud->display_as('customer_phone','Número de Celular');
			$crud->display_as('cupon_code','Código de Cupón');
			$crud->display_as('redeem_date','Fecha de la Transacción');
			$crud->display_as('device','Dispositivo');
			$crud->display_as('usuario','Usuario');
			$crud->field_type('place_id', 'hidden');
			$crud->field_type('customer_email', 'hidden');
			$crud->field_type('place_location_id', 'hidden');
			$crud->field_type('deleted', 'hidden');
			$crud->columns(['customer_name','cupon_code','redeem_date','device','usuario']);
			$crud->set_table('cupon_redeem');
			$crud->where('place_id',$_COOKIE["frb_place_id"]);
		    $this->mPageTitle = 'cupon_redeem';
			$output = $crud->render();
			$this->_example_output($output);
	}
	function autouser($post_array) {
    $post_array['usuario'] = $_COOKIE["user"];
    return $post_array;
}


}
