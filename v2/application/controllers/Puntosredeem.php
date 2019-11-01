<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Puntosredeem extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
		$this->load->helper('url');
		$this->load->library('grocery_CRUD');
	}

	public function _example_output($output = null)
	{ 
		$this->load->view('puntosredeem.php',(array)$output);
	}

	public function index()
	{
		$this->_example_output((object)array('output' => '' , 'js_files' => array() , 'css_files' => array()));
	}
	
	public function show()
	{
			$crud = new grocery_CRUD();
			$crud->set_table('gift_points');
			$crud->where('gift_place_id',$_COOKIE["frb_place_id"]);
			$crud->field_type('gift_place_id', 'hidden');
			$crud->display_as('gift_username','Numero de Tarjeta Usuario');
			$crud->display_as('gift_points','Puntos en Transacción');
			$crud->display_as('gift_bill_id','Número de Factura');
			$crud->display_as('gift_time','Hora de la Transacción');
            $crud->display_as('device','Dispositivo');
			$crud->display_as('gift_time','Hora de la Transacción');
			$crud->columns(['gift_username','gift_points','gift_bill_id','gift_time','device','user']);
			$output = $crud->render();

			//agregar data para enviarla al view
			$data['place_id']= $_COOKIE["frb_place_id"];
			$output->data = $data;
			// se agrego y en el view se utliza asi $data['place_id']
				
			
			$this->_example_output($output);
	}

	function autouser($post_array) {
    $post_array['usuario'] = $_COOKIE["user"];
    return $post_array;
}


}
