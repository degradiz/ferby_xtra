<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Rifas extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
		$this->load->helper('url');
		$this->load->library('grocery_CRUD');
	}

	public function _example_output($output = null)
	{ 
		$this->load->view('rifas.php',(array)$output);
	}

	public function index()
	{
		$this->_example_output((object)array('output' => '' , 'js_files' => array() , 'css_files' => array()));
	}
	
	public function show()
	{
			$crud = new grocery_CRUD();
			$crud->set_table('lottery');
			$crud->set_relation('place_location_id','sucursales','{nombre} - {ciudad}');

			$crud->add_fields('place_location_id','name','description','cant','img','requisito','sorteo');
			$crud->edit_fields('name','cant','img','description','requisito','sorteo');
			$crud->unset_delete();
			$crud->unset_clone();

			$crud->set_field_upload('img','assets/uploads/img/lottery');

			$crud->display_as('img','Imagen');
			$crud->display_as('asigned','Asignados');	
			$crud->display_as('redeems','Reclamados');		
			$crud->display_as('created','Creado');	
			
			$crud->display_as('place_location_id','Tienda');
			$crud->display_as('name','Titulo');
			$crud->display_as('description','Descripción');
			$crud->display_as('cant','Cantidad');

			$crud->add_action('Generados', '', 'rifas/generated', 'receipt');
			$crud->add_action('Ganadores', '', 'rifas/ganadores', 'emoji_events');
			$crud->add_action('Reclamados', '', 'rifas/reclamados', 'redeem');
			
			$crud->callback_after_insert(array($this, 'generar'));
			$crud->callback_before_update(array($this, 'plus'));

			// $crud->columns(['gift_username','gift_points','gift_bill_id','gift_time','device','user']);
			$output = $crud->render();

			$this->_example_output($output);
	}


function generar($post_array,$primary_key)
{
	$this->ion_auth_model->tables = array(
				
				'lottery_generated'				=> 'lottery_generated',
	);

	$ultimo = 0;	

	for ($i=0; $i < $post_array['cant']; $i++) {
		$ultimo ++; 

		$generar_lottery = array(
        		"lottery_id" => $primary_key,
		        "numero" => $ultimo
    	);
		$this->db->insert('lottery_generated',$generar_lottery);
	}
    
 
    
 
    return true;
}


function plus($post_array,$primary_key)
{

	

	$this->ion_auth_model->tables = array(
				
				'lottery_generated'				=> 'lottery_generated',
	);

	$query = $this->db->query("SELECT COUNT(lottery_id) AS total FROM lottery_generated WHERE lottery_generated.lottery_id=".$primary_key);

	$total = 0;

	$row = $query->row_array();

	if (isset($row))
	{
	        $total = $row['total'];
	}

	$cantidad_a_generar = ($post_array['cant'] - $total);

    $ultimo =  $total;

	if ($cantidad_a_generar > 0) {
		for ($i=0; $i < $cantidad_a_generar; $i++) { 
			$ultimo ++;
			$generar_scratch = array(
		        "lottery_id" => $primary_key,
		        "numero" => $ultimo
		    );


			$this->db->insert('lottery_generated',$generar_scratch);

		}

		return true;
	}elseif($cantidad_a_generar == 0){
		return true;
	}else{
		return false;
	}

    
}

public function generated(){

			

			$crud = new grocery_CRUD();
			$crud->set_table('lottery_generated');

			$actual_link = $_SERVER['REQUEST_URI'];
			$array = explode("/", $actual_link);
			echo count($array);
			print_r($array);
			if($array[count($array)-2] == "success"){
				$id= $array[count($array)-3];
			}else{
				$id= $array[count($array)-1];
			}

			$crud->where(array('lottery_generated.lottery_id' => $id , 'reclamado' => '0' , 'ganador' => '0'));

			$crud->set_relation('lottery_id','lottery','{name}');
			$crud->set_relation('client_id','xtraClientes','{nombre}');
			
			$crud->field_type('state','hidden');
			$crud->unset_add();
			$crud->unset_edit();
			$crud->unset_delete();
			$crud->edit_fields('state');

			$crud->callback_column('state',array($this,'url_client'));

			$crud->display_as('lottery_id','Titulo');
			$crud->display_as('state','Estado');
			$crud->display_as('client_id','Cliente');
			$crud->display_as('numero','Número');
			
			
			$crud->unset_fields('uuid');
			$crud->columns('numero','lottery_id','state','client_id');

			$crud->add_action('Ganador', '', '','redeem',array($this,'ganar'));

		//	$crud->callback_before_update(array($this, 'estado'));

			$output = $crud->render();

			$this->_example_output($output);
}


public function ganadores(){

			

			$crud = new grocery_CRUD();
			$crud->set_table('lottery_generated');

			$actual_link = $_SERVER['REQUEST_URI'];
			$array = explode("/", $actual_link);
			if($array[count($array)-2] == "success"){
				$id= $array[count($array)-3];
			}else{
				$id= $array[count($array)-1];
			}

			$crud->where(array('lottery_generated.lottery_id'=> $id , 'ganador' => 1));
			
			$crud->field_type('ganador','dropdown',array('1'=>'Si','0'=>'No'));

			$crud->set_relation('lottery_id','lottery','{name}');
			$crud->set_relation('client_id','xtraClientes','{nombre}');
			
			$crud->field_type('state','hidden');
			$crud->unset_add();
			//$crud->unset_edit();
			$crud->unset_delete();
			$crud->edit_fields('state','ganador','fecha_ganador');

			$crud->callback_column('state',array($this,'url_client'));

			$crud->display_as('lottery_id','Titulo');
			$crud->display_as('state','Estado');
			$crud->display_as('client_id','Cliente');
			$crud->display_as('numero','Número');
			
			
			$crud->unset_fields('uuid');
			$crud->columns('numero','lottery_id','state','client_id','fecha_ganador');

			$crud->add_action('Reclamar', '', '','redeem',array($this,'reclamar'));

		//	$crud->callback_before_update(array($this, 'estado'));

			$output = $crud->render();

			$this->_example_output($output);
}

public function reclamados(){

			

			$crud = new grocery_CRUD();
			$crud->set_table('lottery_generated');

			$actual_link = $_SERVER['REQUEST_URI'];
			$array = explode("/", $actual_link);
			if($array[count($array)-2] == "success"){
				$id= $array[count($array)-3];
			}else{
				$id= $array[count($array)-1];
			}

			$crud->where(array('lottery_generated.lottery_id'=> $id , 'reclamado' => 1));
			
			$crud->field_type('reclamado','dropdown',array('1'=>'Si','0'=>'No'));

			$crud->set_relation('lottery_id','lottery','{name}');
			$crud->set_relation('client_id','xtraClientes','{nombre}');
			
			$crud->field_type('state','hidden');
			$crud->unset_add();
			//$crud->unset_edit();
			$crud->unset_delete();
			$crud->edit_fields('state');
			$crud->edit_fields('state','reclamado','fecha_reclamado');

			$crud->callback_column('state',array($this,'url_client'));

			$crud->display_as('lottery_id','Titulo');
			$crud->display_as('state','Estado');
			$crud->display_as('client_id','Cliente');
			$crud->display_as('numero','Número');
			
			
			$crud->unset_fields('uuid');
			$crud->columns('numero','lottery_id','state','client_id','fecha_reclamado');

			

		//	$crud->callback_before_update(array($this, 'estado'));

			$output = $crud->render();

			$this->_example_output($output);
}


public function url_img($value, $row)
{	if ($value == '') {

		return '<a href=" ' . substr(site_url(),0,-9) . 'assets/uploads/img/lottery/retry.jpg" class="image-thumbnail"><img src="' . substr(site_url(),0,-9) . 'assets/uploads/img/lottery/retry.jpg" height="50px"></a>';
		 
	}else{
		
		return '<a href=" ' . substr(site_url(),0,-9) . 'assets/uploads/img/lottery/'.$value.'" class="image-thumbnail"><img src="' . substr(site_url(),0,-9) . 'assets/uploads/img/lottery/'.$value.'" height="50px"></a>';
	}
	
}

public function url_client($value, $row)
{	
	
	if ($row->ganador == 1 && $row->client_id != null && $row->reclamado == 0) {
		return "<a class='btn btn-success' href='".site_url('clientes/show/read/'.$row->client_id)."'>Ganador</a>";
	}elseif ($row->reclamado == 1 && $row->client_id != null  ) {
		return "<a class='btn btn-danger' href='".site_url('clientes/show/read/'.$row->client_id)."'>Reclamado</a>";
	}elseif ($value == 1 && $row->client_id != null) {
		return "<a class='btn btn-info' href='".site_url('clientes/show/read/'.$row->client_id)."'>Asignado</a>";
	}else{
		
		return "";
	}
	
}


// function estado($post_array,$primary_key)
// {
// 	if($post_array['img'] != '')    {
// 		$post_array['state'] = 1;
// 	}else{
// 		$post_array['state'] = 0;
// 	}
 	
//     return $post_array;
// }

function reclamar($primary_key , $row)
{
	if(strstr( $row->state, 'Ganador' )){
		 return site_url('rifas/reclamados/'). $row->lottery_id .'/edit/'.$primary_key;
		}else{
			return "#";
		}
   
}

function ganar($primary_key , $row)
{
	if(strstr( $row->state, 'Asignado' )){
		 return site_url('rifas/ganadores/'). $row->lottery_id .'/edit/'.$primary_key;
		}else{
			return "#";
		}
   
}


}
