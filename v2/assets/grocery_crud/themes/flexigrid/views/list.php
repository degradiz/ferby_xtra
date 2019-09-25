<?php 

	$column_width = (int)(80/count($columns));
	
	if(!empty($list)){
?><div class="bDiv" >
		<table cellspacing="0" cellpadding="0" border="0" id="flex1">
		<thead>
			<tr class='hDiv'>
				
				<?php if(!$unset_delete || !$unset_edit || !$unset_read || !$unset_clone || !empty($actions)){?>
				<th align="left" abbr="tools" axis="col1" class="" width='20%'>
					<div class="text-left">
						<?php echo $this->l('list_actions'); ?>
					</div>
				</th>
				<?php }?>

				<?php foreach($columns as $column){?>
				<th width='<?php echo $column_width?>%'>
					<div class="text-left field-sorting <?php if(isset($order_by[0]) &&  $column->field_name == $order_by[0]){?><?php echo $order_by[1]?><?php }?>" 
						rel='<?php echo $column->field_name?>'>
						<?php echo $column->display_as?>
					</div>
				</th>
				<?php }?>
			</tr>
		</thead>		
		<tbody>

<?php $i = 0; ?>


<?php foreach($list as $num_row => $row){ ?>        
		<tr  <?php if($num_row % 2 == 1){?>class="erow"<?php }?>>
			
			<?php if(!$unset_delete || !$unset_edit || !$unset_read || !empty($actions)){?>
			<td style="background-color: lightgray" align="left" width='20%'>
				<div  >				
					



					<button class="btn btn-round btn-info" data-toggle="modal" data-target="#loginModal<?php echo $i; ?>">
                       <i class="material-icons">touch_app</i> Acciones

                  </button>		


          <!-- Modal -->
          <div class="modal fade" id="loginModal<?php echo $i; ?>" tabindex="-1" role="" style="z-index: 9999 !important;">
            <div class="modal-dialog modal-login" role="document">
              <div class="modal-content">
                <div class="card card-signup card-plain">
                  <div class="modal-header">
                    <div class="card-header card-header-info text-center" style="width: 100%;">
                      <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                        <i class="material-icons">clear</i>
                      </button>

                      <h4 class="card-title">Acciones</h4>

                    </div>
                  </div>

                  <div class="modal-body">
        


                      <div class="card-body">

                         
                        <div class="row col-sm justify-content-center" style="text-align: center !important;">
                        	<?php if(!$unset_read){?>
								<a href='<?php echo $row->read_url?>' title='<?php echo $this->l('list_view')?> <?php echo $subject?>' class="btn btn-primary"><span style="float:left !important;"><i class="material-icons">search</i> Ver</span></a>
								 	
							<?php }?>
							<?php if(!$unset_edit){?>
								<a href='<?php echo $row->edit_url?>' title='<?php echo $this->l('list_edit')?> <?php echo $subject?>' class="btn btn-round btn-warning"><span style="float:left !important;"><i class="material-icons">create</i> Editar</span></a>
							<?php }?>
                        	<?php if(!$unset_delete){?>
		                    	<a href='<?php echo $row->delete_url?>' title='<?php echo $this->l('list_delete')?> <?php echo $subject?>' class="btn btn-round btn-danger" >
		                    			<span style="float:left !important;"><i class="material-icons">delete_sweep</i> Eliminar</span></a>
		                    	</a>
		                    <?php }?>
		                    
		                    <?php if(!$unset_clone){?>
		                        <a href='<?php echo $row->clone_url?>' title='Clone <?php echo $subject?>' class="btn btn-round btn-primary"><span style="float:left !important;"><i class="material-icons">view_agenda</i> CLonar</span></a>
		                    <?php }?>
							
							<?php 
							if(!empty($row->action_urls)){
								foreach($row->action_urls as $action_unique_id => $action_url){ 
									$action = $actions[$action_unique_id];
							?>
									<a href="<?php echo $action_url; ?>" class="btn btn-round btn-info" title="<?php echo $action->label?>"><?php 
										if(!empty($action->image_url))
										{
											?><img src="<?php echo $action->image_url; ?>" alt="<?php echo $action->label?>" /><?php 	
										}
									?>
									<span style="float:left !important;"><i class="material-icons"><?php echo $action->css_class; ?></i> <?php echo $action->label?></span>
								 	</a>

							<?php }
							}
							?>	

                          <!-- <button name="import" type="submit" class="btn btn-success btn-wd btn-lg">Enviar</button> -->
                        </div>
                      </div>
                     
                    </div>
                  </div>
                </div>
                </div>
                </div>
                <!-- /.modal -->


                    <div class='clear'></div>
				</div>
			</td>
			<?php $i ++; ?>
			<?php }?>
			<?php foreach($columns as $column){?>
			<td width='<?php echo $column_width?>%' class='<?php if(isset($order_by[0]) &&  $column->field_name == $order_by[0]){?>sorted<?php }?>'>
				<div class='text-left'><?php echo $row->{$column->field_name} != '' ? utf8_decode($row->{$column->field_name}) : '&nbsp;' ; ?></div>
			</td>
			<?php }?>
		</tr>
<?php } ?>        
		</tbody>
		</table>
	</div>






<?php }else{?>
	<br/>
	&nbsp;&nbsp;&nbsp;&nbsp; <?php echo $this->l('list_no_items'); ?>
	<br/>
	<br/>
<?php }?>	


