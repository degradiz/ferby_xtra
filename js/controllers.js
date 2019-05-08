var key = '';
var selectDomicilio = [];
var idleInterval1;
var idleInterval
var otherDom;
var buttons;
var LOGO_MAX_SIZE = 1048576;
var PLATE_MAX_SIZE = 2097152;
var BG_MAX_SIZE = 2097152;
var addon_puntos = 0;
var myPopup = {};

angular.module('starter.controllers', ['datatables', 'starter.services', 'ion-datetime-picker','xlsx-model'])
        .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $ionicPopup, $state, $ionicHistory, APPCache, $ionicLoading) {
            validateScope($scope);
            $scope.logo = sessionStorage.getItem('logoUrl');
            $scope.place_name = sessionStorage.getItem('business_name');
            $scope.nav = function nav(msg) {
                $ionicHistory.nextViewOptions({
                    disableAnimate: false,
                    disableBack: true
                });
                true
                switch (msg) {
                    case 'login':
                        $state.go('app.login')
                        break;
                    case 'dash':
                        $state.go('app.dash')
                        break;
                    case 'promos':
                        $state.go('app.promos')
                        break;
                    case 'import-products':
                        $state.go('app.import-products')
                        break;
                    case 'menu':
                        $state.go('app.menu')
                        break;
                    case 'import-product':
                        $state.go('import-products')
                        break;
                    case 'waiter':
                        $state.go('app.waiter')
                        break;
                    case 'mesas':
                        $state.go('app.mesas')
                        break;
                    case 'cat':
                        $state.go('app.cat')
                        break;
                    case 'stores':
                        $state.go('app.stores')
                        break;
                    case 'place':
                        $state.go('place')
                        break;
                    case 'subs':
                        $state.go('app.subs')
                        break;
                    case 'reports':
                        $state.go('app.reports')
                        break;
                    case 'personalize':
                        console.log('persn');
                        $state.go('app.personalize')
                        break;
                    case 'change_password':
                        $scope.changePassword();
                        break;
                    case 'logout':
                        $scope.logout();
                    break;
                        case 'reports':
                        $state.go('app.reports')
                        break;
                    case 'qr':
                        $state.go('app.qrCatalog')
                        break;
                }
            }
            $scope.logout = function () {
                key = '';
                checkKey(key);
            };

            $scope.changePassword = function () {
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/change_admin_password.html',
                    title: 'Actualiza tu Password actual para ingresar al portal',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var username = sessionStorage.getItem('username');
                                var oldPassword = $('#oldPassword').val();
                                var newPassword = $('#newPassword').val();
                                var confirmPassword = $('#confirmPassword').val();

                                if ($.trim(newPassword).length == 0 || $.trim(confirmPassword).length == 0) {
                                    alert('Tienes que agregar tu password')
                                    e.preventDefault();
                                    $ionicLoading.hide()
                                    return;
                                }

                                if ($.trim(newPassword) !== $.trim(confirmPassword)) {
                                    alert('Tu nuevo Password debe coincidir en el campo de confirmación')
                                    e.preventDefault();
                                    $ionicLoading.hide()
                                    return;
                                }

                                $.get(getServerPath(), {
                                    action: 'update_admin_pass',
                                    old_pass: oldPassword,
                                    new_pass: newPassword,
                                    user: username
                                }, function (r) {
                                    $ionicLoading.hide()
                                    var resp = $.trim(r)
                                    if (isNaN(resp)) {
                                        alert('Ha ocurrido un error de nuestro lado');
                                    } else {
                                        if (resp == "0") {
                                            alert('Parece que tu contraseña actual no coincide, favor intenta nuevamente.');
                                        } else {
                                            alert('Se ha actualizado el password de tu cuenta.');
                                        }
                                    }
                                })
                            }
                        }
                    ]
                });
            }

        })
        .controller('eventsCtrl', function ($scope, $state, $ionicLoading, $ionicPlatform, $ionicPopup, $rootScope) {
            validateScope($scope);
            checkKey(key);
            $scope.cupon = {
                cupon_name: '',
                cupon_description: '',
                cupon_points: ''
            };

            $scope.validText = function(p){
                return p.trim() == ""? "Sin Actualizar" : p;
            };

            $scope.deleteCoupon = function (coupon) {
                myPopup = $ionicPopup.show({
                    template: 'Estas seguro que deseas eliminar el coupon '+coupon.cupon_name,
                    title: 'Eliminar Coupon',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Save</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });

                                $.get(getServerPath(), {
                                    action: 'delete_cupon_code',
                                    cupon_code: coupon.cupon_code
                                }, function (r) {
                                    if(r==1)
                                    {
                                        setTimeout(function () {
                                            $ionicLoading.hide();
                                            $scope.getEventos();
                                        }, 500)
                                        return;
                                    }

                                    alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                                    console.log('error: '+JSON.stringify(r));
                                });

                            }
                        }
                    ]
                });
                
            }

            $scope.switch_cupon_code = function(turn, q){

                console.log('SWITCH: '+JSON.stringify(+ turn));
                console.log('PLACE: '+JSON.stringify(q));
                $.get(getServerPath(), {
                        action: 'switch_cupon_code',
                        cupon_code: q.cupon_code,
                        cupon_status: + turn
                    }, function (r) {
                        if(r==1)
                        {
                            setTimeout(function () {
                                $scope.getEventos();
                            }, 500)
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                        console.log('error: '+JSON.stringify(r));
                });
            }


            $scope.update_valid_thru = function (cupon) {
                $scope.cupon_edit = {};
                console.log(cupon);
                $scope.cupon_edit.valid_thru = cupon.valid_thru;
                myPopup = $ionicPopup.show({
                    template: "<div id='expirationDate' class='item' ng-value='cupon_edit.valid_thru' date ion-datetime-picker ng-model='cupon_edit.valid_thru'>{{cupon_edit.valid_thru| date: 'yyyy-MM-dd'}}</div>",
                    title: 'Editar '+cupon.cupon_name,
                    subTitle: 'Actualizar la fecha de expiración del evento: '+cupon.cupon_name,
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html'});
                                return $scope.cupon_edit;
                            }
                        }
                    ]
                });
              
                myPopup.then(function(res){
                    var date = res.valid_thru.toISOString().substring(0,10);
                    $.get(getServerPath(), {
                        action: 'update_valid_thru',
                        cupon_code: cupon.cupon_code,
                        valid_thru: date
                    }, function (r) {
                        $ionicLoading.hide()
                        if(r==1)
                        {
                            alert('Fecha de expiración actualizada correctamente');
                            $scope.getEventos();
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                        console.log(r);
                    });
                });
            };

            $scope.set_cupon_image = function(cupon_code) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elija una nueva arte para el evento seleccionado.<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_cupon_image');
                                form_data.append('img', new_image);
                                form_data.append('cupon_code', cupon_code);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            $scope.getEventos();
                                            $ionicLoading.hide()
                                            alert('Registrado Correctamente');
                                        } else {
                                            $scope.getEventos();
                                            console.log(data);
                                            $ionicLoading.hide()
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.createEvent = function () {
                myPopup = $ionicPopup.show({
                    template:  "<label style='margin-top: 1rem;display: block;font-size: .8rem;' for='title;'>Título del evento</label> \
                                <input ng-model='cupon.cupon_name' id='title' placeholder='Título'/><br/> \
                                <label style='margin-top: 1rem;display: block;font-size: .8rem;' for='expiration;'>Descripción o mensaje del evento</label> \
                                <textarea ng-model='cupon.cupon_description' value='' placeholder='descuento'/>\
                                <label style='margin-top: 1rem;display: block;font-size: .8rem;' for='expiration;'>Fecha de expiración</label> \
                                <div id='expirationDate' class='item' date ion-datetime-picker ng-model='cupon.expiration'>{{cupon.expiration| date: 'yyyy-MM-dd'}}</div> \
                                <label style='display: block;font-size: .7rem;'>*El evento tendrá que ser desactivado manualmente.</label> \
                                <label style='margin-top: 1rem;display: block;font-size: .8rem;' for='ccImage;'>Imagen o arte</label> \
                                <input id='new_image' name='file_image' type='file' accept='image/*'/>",
                    title: 'Crear Evento',
                    subTitle: 'Llena los campos del evento',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Crear</b>',
                            type: 'button-stable',
                            onTap: function () {
                                var MAX_SIZE = LOGO_MAX_SIZE;

                                

                                // var month = JSON.stringify($scope.cupon.month);
                                // var valid_thru = month.substring(1,11);
                                // var date = new Date(valid_thru.substring(0,4), valid_thru.substring(5,7),0);
                                // date = date.toISOString().substring(0,10);

                                if($scope.cupon.cupon_name == '' || $scope.cupon.cupon_name == undefined){
                                    alert('Debes ingresar un título al registro.');
                                    return;
                                }

                                if($scope.cupon.expiration == undefined){
                                    alert('Debes ingresar una fecha de expiración.');
                                    return;
                                }


                                var date = $scope.cupon.expiration.toISOString().substring(0,10);

                                var cupon_name = $scope.cupon.cupon_name;
                                var cupon_description = $scope.cupon.cupon_description;
                                var cupon_points = $scope.cupon.cupon_points;

                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";


                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    //$ionicLoading.hide()
                                    return;
                                }

                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });


                                var form_data = new FormData();
                                console.log(new_image);
                                form_data.append('action', 'create_cupon');
                                form_data.append('img', new_image);
                                form_data.append('cupon_type', 2);
                                form_data.append('cupon_name', cupon_name);
                                form_data.append('cupon_description', cupon_description);
                                form_data.append('cupon_points', cupon_points);
                                form_data.append('valid_thru', date);
                                form_data.append('place_id', sessionStorage.getItem('place_id'));
                                //console.log(qrDesc);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (d) {
                                        var data = $.trim(d);
                                        if (data == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getEventos();
                                            $ionicLoading.hide();
                                        } else {
                                            $scope.cupon = {
                                                cupon_name: '',
                                                cupon_description: '',
                                                cupon_points: ''
                                            };
                                            $scope.getEventos();
                                            $ionicLoading.hide();
                                            console.log(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.getEventos = function () {

                $('#loadingQr').show('slow')
                $('#contentQr').hide('slow')
                console.log(sessionStorage.getItem('place_id'));
                $.getJSON(getServerPath(), {
                    action: "select_cupon_code",
                    place_id: sessionStorage.getItem('place_id')
                }, function (json) {
                    console.log(json)
                    $('#loadingQr').hide('slow')
                    $('#contentQr').show('slow')
                    $scope.cupons = json.filter(f => f.cupon_type == 2);

                    $scope.$apply();
                    $scope.$broadcast('scroll.refreshComplete');
                })
            }

        }) 
        .controller('cuponCodeCtrl', function ($scope, $state, $ionicLoading, $ionicPlatform, $ionicPopup, $rootScope) {
            validateScope($scope);
            $scope.cupon = {
                cupon_name: '',
                cupon_description: '',
                cupon_points: ''
            };

            $scope.deleteCoupon = function (coupon) {
                myPopup = $ionicPopup.show({
                    template: 'Estas seguro que deseas eliminar el coupon '+coupon.cupon_name,
                    title: 'Eliminar Coupon',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Save</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });

                                $.get(getServerPath(), {
                                    action: 'delete_cupon_code',
                                    cupon_code: coupon.cupon_code
                                }, function (r) {
                                    if(r==1)
                                    {
                                        setTimeout(function () {
                                            $ionicLoading.hide();
                                            $scope.getCupones();
                                        }, 500)
                                        return;
                                    }

                                    alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                                    console.log('error: '+JSON.stringify(r));
                                });

                            }
                        }
                    ]
                });
                
            }

            $scope.switch_cupon_code = function(turn, q){

                console.log('SWITCH: '+JSON.stringify(+ turn));
                console.log('PLACE: '+JSON.stringify(q));
                $.get(getServerPath(), {
                        action: 'switch_cupon_code',
                        cupon_code: q.cupon_code,
                        cupon_status: + turn
                    }, function (r) {
                        if(r==1)
                        {
                            setTimeout(function () {
                                $scope.getCupones();
                            }, 500)
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                        console.log('error: '+JSON.stringify(r));
                });
            }

            $scope.set_cupon_name = function (cupon) {
                $scope.cupon = {};

                $scope.cupon.name = cupon.cupon_name;
                myPopup = $ionicPopup.show({
                    template: '<input type="text" ng-model="cupon.name" ng-value="cupon.name" autofocus>',
                    title: 'Editar '+cupon.cupon_name,
                    subTitle: 'Actualizar el texto del boton',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html'});
                                return $scope.cupon;
                            }
                        }
                    ]
                });
              
                myPopup.then(function(res){
                    $.get(getServerPath(), {
                        action: 'set_cupon_name',
                        cupon_code: cupon.cupon_code,
                        cupon_name: res.name
                    }, function (r) {
                        $ionicLoading.hide()
                        if(r==1)
                        {
                            alert('Texto actualizado correctamente');
                            $scope.getCupones();
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                    });
                });
            };


            $scope.set_cupon_description = function (cupon) {
                $scope.cupon = {};

                $scope.cupon.description = cupon.cupon_description;
                myPopup = $ionicPopup.show({
                    template: '<input type="text" ng-model="cupon.description" ng-value="cupon.description" autofocus>',
                    title: 'Editar '+cupon.cupon_description,
                    subTitle: 'Actualizar el texto del boton',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html'});
                                return $scope.cupon;
                            }
                        }
                    ]
                });
              
                myPopup.then(function(res){
                    $.get(getServerPath(), {
                        action: 'set_cupon_description',
                        cupon_code: cupon.cupon_code,
                        cupon_description: res.description
                    }, function (r) {
                        $ionicLoading.hide()
                        if(r==1)
                        {
                            alert('Texto actualizado correctamente');
                            $scope.getCupones();
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                    });
                });
            };

            $scope.add_cupon_cant = function (cupon) {
                $scope.cupon = {};

                //$scope.cupon.cant = cupon.cupon_cant;
                $scope.cupon.name = cupon.cupon_name;
                $scope.cupon.id_departamento = cupon.cupon_id_departamento;
                $scope.cupon.discount = cupon.cupon_discount;
                myPopup = $ionicPopup.show({
                    template:  '<label style="margin-top: 1rem;display: block;font-size: 1.5rem;" for="title;">Título del cupón</label> \
                                <input type="text" readonly ng-model="cupon.name" ng-value="cupon.name"><br/> \
                                <label style="margin-top: 1rem;display: block;font-size: 1.5rem;" for="expiration;">Descuento en porcentaje</label> \
                                <input ng-model="cupon.discount" readonly type="number" ng-value="cupon.discount"/>\
                                <label style="margin-top: 1rem;display: block;font-size: 1.5rem;" for="expiration;">Código de departamento</label> \
                                <input ng-model="cupon.id_departamento" readonly type="number" ng-value="cupon.id_departamento"/>\
                                <label style="margin-top: 1rem;display: block;font-size: 1.5rem;" for="cant;">Cantidad de cupones a adicionar</label> \
                                <input ng-model="cupon.cant" type="number"  id="cant" placeholder="1000" autofocus/><br/>'
                    ,
                    title: 'Adicionar cupones a '+cupon.cupon_code,
                    subTitle: 'Ingresar los cupones a adicionar',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Adicionar</b>',
                            type: 'button-stable',
                            onTap: function (e) {

                                if($scope.cupon.cant == '' || $scope.cupon.cant == undefined ){
                                    alert('Debes ingresar la cantidad a adicionar.');
                                    return;
                                }

                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html'});
                                return $scope.cupon;
                            }
                        }
                    ]
                });
              
                myPopup.then(function(res){
                    $.get(getServerPath(), {
                        action: 'add_cupon_cant',
                        cupon_code: cupon.cupon_code,
                        cupon_name: cupon.cupon_name,
                        cupon_id_departamento: cupon.cupon_id_departamento,
                        cupon_discount: cupon.cupon_discount,

                        cupon_cant: res.cant
                    }, function (r) {
                        $ionicLoading.hide()
                        if(r==1)
                        {
                            alert('Cupones adicionados correctamente');
                            $scope.getCupones();
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                    });
                });
            };

            $scope.validText = function(p){
                return p.trim() == ""? "Sin Actualizar" : p;
            };

            $scope.update_valid_thru = function (cupon) {
                $scope.cupon_edit = {};
                console.log(cupon);
                $scope.cupon_edit.valid_thru = cupon.valid_thru;
                myPopup = $ionicPopup.show({
                    template: "<div id='expirationDate' class='item' ng-value='cupon_edit.valid_thru' date ion-datetime-picker ng-model='cupon_edit.valid_thru'>{{cupon_edit.valid_thru| date: 'yyyy-MM-dd'}}</div>",
                    title: 'Editar '+cupon.cupon_name,
                    subTitle: 'Actualizar la fecha de expiración del cupon: '+cupon.cupon_name,
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html'});
                                return $scope.cupon_edit;
                            }
                        }
                    ]
                });
              
                myPopup.then(function(res){
                    var date = res.valid_thru.toISOString().substring(0,10);
                    $.get(getServerPath(), {
                        action: 'update_valid_thru',
                        cupon_code: cupon.cupon_code,
                        valid_thru: date
                    }, function (r) {
                        $ionicLoading.hide()
                        if(r==1)
                        {
                            alert('Fecha de expiración actualizada correctamente');
                            $scope.getCupones();
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                        console.log(r);
                    });
                });
            };

            $scope.set_cupon_image = function(cupon_code) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elija una nueva arte para el cupon seleccionado.<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_cupon_image');
                                form_data.append('img', new_image);
                                form_data.append('cupon_code', cupon_code);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            $scope.getCupones();
                                            $ionicLoading.hide()
                                            alert('Registrado Correctamente');
                                        } else {
                                            $scope.getCupones();
                                            console.log(data);
                                            $ionicLoading.hide()
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.createCupon = function () {
                myPopup = $ionicPopup.show({
                    template:  "<label style='margin-top: 1rem;display: block;font-size: 1.5rem;' for='title;'>Título del cupón</label> \
                                <input ng-model='cupon.cupon_name' id='title' type='text' placeholder='Título'/><br/> \
                                <label style='margin-top: 1rem;display: block;font-size: 1.5rem;' for='expiration;'>Descripción</label> \
                                <input ng-model='cupon.cupon_description' type='text' value='' placeholder='mensaje'/>\
                                <label style='margin-top: 1rem;display: block;font-size: 1.5rem;' for='expiration;'>Descuento en porcentaje</label> \
                                <input ng-model='cupon.cupon_discount' type='number' value='' placeholder='10'/>\
                                <label style='margin-top: 1rem;display: block;font-size: 1.5rem;' for='expiration;'>Código de departamento</label> \
                                <input ng-model='cupon.cupon_id_departamento' type='number' value='' placeholder='1'/>\
                                <label style='margin-top: 1rem;display: block;font-size: 1.5rem;' for='expiration;'>Fecha de expiración</label> \
                                <div id='expirationDate' class='item' date ion-datetime-picker ng-model='cupon.expiration'>{{cupon.expiration| date: 'yyyy-MM-dd'}}</div> \
                                <label style='display: block;font-size: 1rem;'>*El cupón será vigente hasta la fecha que elijas.</label> \
                                <label style='margin-top: 1rem;display: block;font-size: 1.5rem;' for='ccImage;'>Imagen o arte</label> \
                                <input id='new_image' name='file_image' type='file' accept='image/*'/>\
                                <label style='margin-top: 1rem;display: block;font-size: 1.5rem;' for='cant;'>Cantidad de cupones</label> \
                                <input ng-model='cupon.cupon_cant' type='number'  id='cant' placeholder='1000'/><br/>" 
                                ,
                    title: 'Crear Cupón',
                    subTitle: 'Llena los campos del cupón',
                    scope: $scope,
                    buttons: [
                        {type: 'button-assertive',text: 'Cancelar'},
                        {
                            text: 'Crear',
                            type: 'button-balanced',
                            onTap: function () {
                                var MAX_SIZE = LOGO_MAX_SIZE;

                                

                                // var month = JSON.stringify($scope.cupon.month);
                                // var valid_thru = month.substring(1,11);
                                // var date = new Date(valid_thru.substring(0,4), valid_thru.substring(5,7),0);
                                // date = date.toISOString().substring(0,10);
                                if($scope.cupon.cupon_name == '' || $scope.cupon.cupon_name == undefined ){
                                    alert('Debes ingresar un título al registro.');
                                    return;
                                }

                                
                                if($scope.cupon.cupon_discount == '' || $scope.cupon.cupon_discount == undefined ){
                                    alert('Debes ingresar porcentaje de descuento.');
                                    return;
                                }

                                

                                 if($scope.cupon.cupon_id_departamento == undefined){
                                    alert('Debes ingresar el código del departamento.');
                                    return;
                                }

                                if($scope.cupon.expiration == undefined){
                                    alert('Debes ingresar una fecha de expiración.');
                                    return;
                                }

                                 if($scope.cupon.cupon_cant == undefined){
                                    alert('Debes ingresar la cantidad de cupones a generar.');
                                    return;
                                }

                                var date = $scope.cupon.expiration.toISOString().substring(0,10);

                                var cupon_name = $scope.cupon.cupon_name;
                                var cupon_cant = $scope.cupon.cupon_cant;
                                var cupon_description = $scope.cupon.cupon_description;
                                var cupon_discount = $scope.cupon.cupon_discount;
                                var cupon_id_departamento = $scope.cupon.cupon_id_departamento;
                                var cupon_points = $scope.cupon.cupon_points;

                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";


                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    return;
                                }

                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });

                                var form_data = new FormData();
                                //console.log(new_image);
                                form_data.append('action', 'create_cupon');
                                form_data.append('img', new_image);
                                form_data.append('cupon_name', cupon_name);
                                form_data.append('cupon_description', cupon_description);
                                form_data.append('cupon_discount', cupon_discount);
                                form_data.append('cupon_id_departamento', cupon_id_departamento);
                                form_data.append('cupon_cant', cupon_cant);
                                //form_data.append('cupon_points', cupon_points);
                                form_data.append('valid_thru', date);
                                form_data.append('place_id', sessionStorage.getItem('place_id'));
                                //console.log(qrDesc);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (d) {
                                        $ionicLoading.hide();
                                        var data = $.trim(d);
                                        if (data == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getCupones();
                                            $ionicLoading.hide();
                                        } else {
                                            $scope.cupon = {
                                                cupon_name: '',
                                                cupon_description: '',
                                                cupon_points: ''
                                            };
                                            $scope.getCupones();
                                            
                                            console.log(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.getCupones = function () {

                $scope.drawQrCupon();

                $('#loadingQr').show('slow')
                $('#contentQr').hide('slow')
                console.log(sessionStorage.getItem('place_id'));
                $.getJSON(getServerPath(), {
                    action: "select_cupon_code",
                    place_id: sessionStorage.getItem('place_id')
                }, function (json) {
                    console.log(json)
                    $('#loadingQr').hide('slow')
                    $('#contentQr').show('slow')
                    $scope.cupons = json.filter(f => f.cupon_type == 1);
                    $scope.$apply();
                    $scope.$broadcast('scroll.refreshComplete');
                })
            }

            $scope.drawQrCupon = function(){

                $ionicPlatform.ready(function () {
                    $('#qrcode').find('img').remove()
                    var qrcode = new QRCode(document.getElementById("qrcode"), {
                        text: localStorage.next_cupon_code,
                        width: 150,
                        height: 150,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.H
                    });

                    setTimeout(function () {
                        $('#qrcode').find('img').css('height', 'auto').css('margin-bottom', '10px')
                    }, 500)

                })
            }
        })        
        .controller('menuCtrl', function ($scope, $state, $ionicPopup, APPCache, $rootScope, $ionicLoading) {
            checkKey(key);
            validateScope($scope);
            $rootScope.$on("getMenu", function () {
                $scope.start();
            });

            sessionStorage.base_path = baseUrl();

            $scope.nameApp = sessionStorage.nameApp;
            $scope.basePath = baseUrl();

            $scope.openUrlDialog = function (url) {
                $scope.url = url;
                myPopup = $ionicPopup.show({
                    title: 'Link de Producto',
                    subTitle: 'Copia este link y pegalo en tu articulo en facebook',
                    scope: $scope,
                    templateUrl: 'dialogs/urlViewer.html',
                    buttons: [
                        {text: 'OK'},
                    ]
                });
            }

            $scope.start = function () {
                $('#loadingMenu').show('slow')
                $('#contentMenu').hide('slow')

                $.getJSON(getServerPath(), {
                    action: "select_category",
                    place_id: sessionStorage.getItem('place_id')
                }, function (json) {
                    $('#loadingMenu').hide('slow')
                    $('#contentMenu').show('slow')
                    $scope.cat = json;
                    $scope.addon_puntos = sessionStorage.getItem('addon_puntos');
                    console.log('addon scope: '+$scope.addon_puntos);
                    console.log(json);
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$apply();
                })

                $.getJSON(getServerPath(), {
                    action: "select_menu",
                    place_id: sessionStorage.getItem('place_id')
                }, function (json) {
                    $scope.menu = json;
                    $scope.$apply();
                    //$scope.dtInstance.rerender(); 
                })
            }

            $scope.gotoImages = function (menuId) {
                sessionStorage.setItem('menuId', menuId);
                $state.go('app.images')
            }

            $scope.deleteImg = function (menuId) {
                myPopup = $ionicPopup.show({
                    title: 'Eliminar Imagen Producto',
                    subTitle: 'Estas seguro que deseas eliminar permanentemente la imagen del producto seleccionado?',
                    scope: $scope,
                    buttons: [
                        {text: 'No'},
                        {
                            text: '<b>Si</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $.get(getServerPath(), {
                                    action: 'delete_image_menu',
                                    menu_id: menuId
                                }, function (resp) {
                                    var resp = $.trim(resp);
                                    console.log(resp);
                                    switch (resp) {
                                        case '1':
                                            alert('Imagen eliminada')
                                            $scope.start();
                                            break;
                                        default:
                                            alert(resp);
                                            break;
                                    }
                                })
                            }
                        }
                    ]
                });
            }

            $scope.deleteMenu = function (menuId) {
                myPopup = $ionicPopup.show({
                    title: 'Eliminar Producto',
                    subTitle: 'Estas seguro que deseas eliminar permanentemente el producto seleccionado?',
                    scope: $scope,
                    buttons: [
                        {text: 'No'},
                        {
                            text: '<b>Si</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $.get(getServerPath(), {
                                    action: 'delete_menu',
                                    menu_id: menuId
                                }, function (resp) {
                                    var resp = $.trim(resp);
                                    console.log(resp);
                                    switch (resp) {
                                        case '1':
                                            alert('Elemento eliminado')
                                            $scope.start();
                                            break;
                                        default:
                                            alert(resp);
                                            break;
                                    }
                                })
                            }
                        }
                    ]
                });
            }

            $scope.edit = function (id) {

                setTimeout(function () {
                    // if(sessionStorage.getItem('addon_puntos')!=1){
                    //     $('$pmenuPoints').hide();
                    //     $('$menuPoints').hide();
                    // }
                    
                    $('#menuCategory').val($('#tblmenuCategoryID' + id).text())
                    $('#menuStatus').val($('#tblmenuStatusID' + id).text())
                    $('#menuName').val($('#tblmenuName' + id).text())
                    $('#menuDesc').val($('#tblmenuDesc' + id).text())
                    $('#menuPrice').val($('#tblmenuPrice' + id).text())
                    $('#menuPriceBase').val($('#tblmenuPriceBase' + id).text())
                    $('#menuPoints').val($('#tblmenuPoints' + id).text())
                    $('#menuInventario').val($('#tblstock' + id).text());
                    $('#menuStatus').val($('#tblmenuStatus' + id).text())
                    console.log($('#tblmenuStatus' + id).text());
                }, 500)
                var MAX_SIZE = PLATE_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_menu.html',
                    title: 'Editar Producto',
                    subTitle: 'Edita los campos del producto. <br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Save</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var menuImage = $.trim($('#menuImage').val()).length != 0 ? $('#menuImage').prop('files')[0] : " ";
                                var menuCategory = $('#menuCategory').val();
                                var menuCategoryText = $('#menuCategory :selected').text();
                                var menuName = $('#menuName').val();
                                var menuDesc = $('#menuDesc').val();
                                var menuPrice = $('#menuPrice').val();
                                var menuPriceBase = $('#menuPriceBase').val();
                                var menuPoints = $('#menuPoints').val();
                                var menuConversion = "";
                                var menuStock = $('#menuInventario').val();
                                var menuStatus = $('#menuStatus').val();
                                var typeMenuText = $('#menuStatus :selected').text();
                                var IMAGE_SIZE = menuImage.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                var form_data = new FormData();
                                form_data.append('action', 'update_menu');
                                form_data.append('img', menuImage);
                                form_data.append('description', menuDesc);
                                form_data.append('price', menuPrice);
                                form_data.append('menu_price', menuPriceBase);
                                form_data.append('menu_points', menuPoints);
                                form_data.append('conversion', menuConversion);
                                form_data.append('status', menuStatus);
                                form_data.append('tipo_menu', "3");
                                form_data.append('name', menuName);
                                form_data.append('category_id', menuCategory);
                                form_data.append('menuStock', menuStock);
                                form_data.append('menu_id', id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'json',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (d) {
                            
                                        if (d.resp == '1') {
                                            $('#tblmenuCategory' + id).text(menuCategoryText)
                                            $('#tblmenuStatusID' + id).text(menuStatus)
                                            $('#tblmenuName' + id).text(menuName)
                                            $('#tblmenuDesc' + id).text(menuDesc)
                                            $('#tblmenuPrice' + id).text(menuPrice)
                                            $('#tblmenuPriceBase' + id).text(menuPriceBase)
                                            $('#tblmenuPoints' + id).text(menuPoints)
                                            $('#tblstock' + id).text(menuStock);
                                            $('#tblmenuStatus' + id).text(menuStatus)
                                            $('#stat' + id).text(typeMenuText)
                                            if(d.img != 0){
                                                $('#img' + id).attr('src',d.img)
                                            }                              
                                            $ionicLoading.hide();
                                        } else {
                                            alert('Ha Ocurrido un Error')
                                            $ionicLoading.hide();
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });

            }
            $scope.newPlate = function () {

                setTimeout(function () {
                    // if(sessionStorage.getItem('addon_puntos')!=1){
                    //     $('$pmenuPoints').hide();
                    //     $('$menuPoints').hide();
                    // }
                }, 500)

                $scope.menuMenuId = "";
                $scope.menuCategoryID = "";
                $scope.menuName = "";
                $scope.menuDesc = "";
                $scope.menuStatusID = "";
                $scope.menuPrice = "";
                $scope.menuPriceBase = "";
                $scope.menuConversion = "";
                var MAX_SIZE = PLATE_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_menu.html',
                    title: 'Nuevo Producto',
                    subTitle: 'Agrega el nombre de tu producto. <br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Save</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var menuImage = $.trim($('#menuImage').val()).length != 0 ? $('#menuImage').prop('files')[0] : " ";
                                var menuCategory = $('#menuCategory').val();
                                var menuName = $('#menuName').val();
                                var menuDesc = $('#menuDesc').val();
                                var menuPrice = $('#menuPrice').val();
                                var menuPriceBase = $('#menuPriceBase').val();
                                var menuPoints = $('#menuPoints').val();
                                var menuConversion = "";
                                var menuInventario = $('#menuInventario').val();
                                var menuStatus = $('#menuStatus').val();


                                var IMAGE_SIZE = menuImage.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                var form_data = new FormData();
                                form_data.append('action', 'insert_menu');
                                form_data.append('img', menuImage);
                                form_data.append('description', menuDesc);
                                form_data.append('price', menuPrice);
                                form_data.append('menu_price', menuPriceBase);
                                form_data.append('menu_points', menuPoints);
                                form_data.append('conversion', menuConversion);
                                form_data.append('status', menuStatus);
                                form_data.append('name', menuName);
                                form_data.append('category_id', menuCategory);
                                form_data.append('tipo_menu', "3");
                                form_data.append('menuInventario', menuInventario);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        var d = $.trim(data)
                                        if (d == '1') {
                                            $ionicLoading.hide()
                                            alert('Registrado Correctamente');
                                            $scope.start()
                                        } else {
                                            $ionicLoading.hide()
                                            alert(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            };

            $scope.goToCat = function () {
                $state.go('app.cat');
            }

            $scope.goToImportProducts = function () {
                $state.go('import-products');
            }

            $scope.goToOptions = function (id) {
                console.log(id);
                sessionStorage.setItem('idMenu', id);
                $state.go('app.options');
            }

        })
        .controller('importProductsCtrl', function ($scope, $state, $ionicPopup, $ionicLoading, $rootScope) {
            validateScope($scope);
            $scope.addon_puntos = sessionStorage.addon_puntos;
            $scope.uploaded = 0;
            $scope.newitem = {}
            $scope.selectedCategory = {};
            $scope.products = [];

            $scope.initImportProducts = function () {
                $.getJSON(getServerPath(), {
                    action: "select_category",
                    place_id: sessionStorage.getItem('place_id')
                }, function (json) {
                    $scope.categories = json.reverse();
                    localStorage.categories = JSON.stringify(json);
                    $scope.$apply();
                })
            }

            $scope.selectCategory = function () {
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/categories.html',
                    title: 'Elija una categoria de productos para importar',
                    scope: $scope,
                    cssClass: 'popup-pin',
                    buttons: [
                        {
                            text: '<b>Ok</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $scope.selectedCategory = $scope.newitem.item;
                                localStorage.selectedCategory = JSON.stringify($scope.newitem);
                            }
                        }
                    ]
                });
            }
            
            $scope.populateProduct = function(z){
                $scope.products.push(z);
            }

            $scope.postData = function(){

                var form_data = new FormData();
                form_data.append('action', 'import_menu');
                form_data.append('menu_data', JSON.stringify($scope.products.reverse()));
                form_data.append('category_id', $scope.selectedCategory.category_id);
                $.ajax({
                    url: getServerPath(),
                    dataType: 'text',
                    cache: false,
                    contentType: false,
                    processData: false,
                    data: form_data,
                    type: 'post',
                    success: function (d) {
                        console.log('resp: '+d);
                        if(d!=1){
                            alert('Ha ocurrido un problema al importar los productos.')
                            return;
                        }

                        alert('Productos importados correctamente.');
                        $rootScope.$emit("getMenu", {});
                        $scope.uploaded = 1;
                        $scope.$apply();
                        
                    }
                });
            }

            $scope.reload = function(){
                $state.go($state.current, {}, {reload: true}); 
                setTimeout(function(){
                    $('ion-nav-bar').removeClass('hide')
                },10)
            }

            
        })
        .controller('dashCtrl', function ($scope, $state, APPCache) {
            checkKey(key);
            console.log('dash')
            $('#dataTables-example').DataTable({
                responsive: true
            });
            $scope.navigacion = function () {
                $state.go('app.images');
            }
        })
        .controller('restLoginCtrl', function ($scope, $state, APPCache, $rootScope, $ionicLoading) {
            $scope.login = function () {
                $ionicLoading.show({
                    templateUrl: 'dialogs/loader.html',
                });
                console.log('login store');
                var username = $("#store").val();
                var password = $("#passkey").val();
                if ($.trim(username) != 0) {
                    if ($.trim(password) != 0) {
                        $.get(getServerPath(), {
                            action: 'login_place_loc',
                            place_loc_id: username,
                            passkey: password
                        }, function (resp) {
                            var resp = $.trim(resp);
                            console.log(resp);
                            switch (resp) {
                                case '000-000':
                                    alert('Wrong username or password');
                                    $ionicLoading.hide()
                                    break;
                                case 'cod-9144':
                                    key = getServerKey();
                                    sessionStorage.setItem('place_loc_administration', username);
                                    sessionStorage.setItem('store_id', username)
                                    $state.go('tab.domicilios');
                                    $ionicLoading.hide()
                                    //$rootScope.$emit("getPlaces", {});
                                    break;
                                default:
                                    console.log(resp);
                                    $ionicLoading.hide()
                                    break;
                            }
                        });
                    } else {
                        alert('Please fill up your password');
                    }
                } else {
                    alert('Please fill up your username');
                }
            }
        })
        .controller('ordersCtrl', function ($scope, $state, APPCache, $rootScope) {
            checkKey(key);
            sessionStorage.setItem('store_id', sessionStorage.getItem('place_loc_administration'))
            sessionStorage.setItem('deskMode', 'res');
            var h = $(window).height()
            $('#toDo').height(h)
            $('#toDo2').height(h)
            $('#toDo3').height(h)
            var idleTime = 0;


            //Increment the idle time counter every minute.
            clearInterval(idleInterval1);
            idleInterval1 = setInterval(function () {
                timerIncrement1()
            }, 1000); // 1 minute

            //Zero the idle timer on mouse movement.
            $('#orderView').mousemove(function (e) {
                console.log('mouse move')
                idleTime = 0;
            });
            $('#orderView').keypress(function (e) {
                console.log('Key Press')
                idleTime = 0;
            });


            function timerIncrement1() {
                idleTime = idleTime + 1;
                if (idleTime > 60) { // 1 minutes
                    $scope.getData();
                    idleTime = 0;
                    console.log("idle")
                }
            }

            $scope.getData = function () {
                $scope.getPlace();
                $scope.getPending();
                $scope.getKitchen();
                $scope.getReady();
                $scope.domicilios();
            }

            $scope.getPlace = function(){
                console.log('get place from store start');
                $.getJSON(getServerPath(), {
                    action: 'get_place_by_place_location',
                    place_location_id: sessionStorage.store_id
                }, function (place) {
                    localStorage.place = JSON.stringify(place);
                    console.log('get place from store end');
                    localStorage.place_id = place.place_id;

                })
            }

            $scope.getPending = function () {
                $('#loadingOrders').show('slow')
                $.getJSON(getServerPath(), {
                    action: 'getBillByPlace',
                    status: '1',
                    place_location: sessionStorage.getItem('place_loc_administration')
                }, function (json) {
                    $scope.$broadcast('scroll.refreshComplete');
                    $('#loadingOrders').hide('slow')
                    $scope.pending = json;
                    $rootScope.$emit("updateRes", {len: json.length});
                    $scope.$apply();
                })
            }

            $scope.getKitchen = function () {
                $('#loadingKitchen').show('slow')
                $.getJSON(getServerPath(), {
                    action: 'getBillByPlace',
                    status: '2',
                    place_location: sessionStorage.getItem('place_loc_administration')
                }, function (json) {
                    $('#loadingKitchen').hide('slow')
                    $scope.kitchen = json;
                    $scope.$apply();
                })
            }

            $scope.getReady = function (json) {
                $('#loadingDone').show('slow')
                $.getJSON(getServerPath(), {
                    action: 'getBillByPlace',
                    status: '3',
                    place_location: sessionStorage.getItem('place_loc_administration')
                }, function (json) {
                    $('#loadingDone').hide('slow')
                    $scope.done = json;
                    $scope.$apply();
                })
            }

            $scope.updateBill = function (id, s) {
                $.get(getServerPath(), {
                    action: 'updateBillDetail',
                    idBill: id,
                    status: s
                }, function (data) {
                    var d = $.trim(data);
                    if (d == 1) {
                        switch (s) {
                            case 2:
                                $scope.getPending()
                                $scope.getKitchen();
                                break;
                            case 3:
                                $scope.getKitchen();
                                $scope.getReady();
                                break;
                            case 4:
                                $scope.getReady();
                                break;
                            default:
                                alert('NONE')
                                break
                        }
                    } else {
                        if (d == -1) {
                            alert('Esta orden fue cancelada')
                            $scope.getPending()
                        } else {
                            alert('Ha ocurrido un error de nuestra parte')
                        }
                    }
                })
            };

            $scope.domicilios = function () {
                $.getJSON(getServerPath(), {action: "selectDomicilio", place_id: sessionStorage.getItem('store_id'), status: 6}, function (json) {
                    selectDomicilio = json;
                    $rootScope.$emit("updateDom", {len: json.length});
                })
            }

        })
        .controller('billsCtrl', function ($scope, $state, APPCache, $ionicLoading, $ionicPopup) {
            checkKey(key);
            $scope.getTables = function () {
                $.getJSON(getServerPath(), {
                    action: 'select_desk',
                    place_location_id: sessionStorage.getItem('place_loc_administration')
                }, function (json) {
                    $scope.desks = json;
                    console.log(json);
                    $scope.getOrders();
                })
            };
            $scope.getOrders = function () {
                sessionStorage.setItem('viewState', "bills");
                console.log('view state: ' + sessionStorage.getItem('viewState'));
                $('#loadingX').hide('slow')
                $('#contentOrders').show('slow')
                $scope.$broadcast('scroll.refreshComplete');
                //return;
                $.getJSON(getServerPath(), {
                    action: 'select_historial_domicilio_place',
                    place_id: sessionStorage.getItem('store_id')
                }, function (json) {
                    selectDomicilio = json;
                    //$('#loadingX').hide('slow')
                    //$('#contentOrders').show('slow')
                    $scope.orders = json;
                    console.log(json);
                    //$scope.$broadcast('scroll.refreshComplete');
                    $scope.$apply();
                })
            };

            $scope.goToBillDetail = function (id) {
                sessionStorage.setItem('bill_id', id)

                $state.go('tab.domiciliosDetalle')
            }

            $scope.closeBill = function (id) {
                myPopup = $ionicPopup.show({
                    title: 'Seguro que deseas cerrar esta orden? el cliente ya no podra usarla para ordenar.',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Si Eliminar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                $.get(getServerPath(), {
                                    action: 'update_Bill',
                                    bill_id: id,
                                    status: 0
                                }, function (resp) {
                                    var resp = $.trim(resp);
                                    switch (resp) {
                                        case '1':
                                            $ionicLoading.hide()
                                            alert('Success');
                                            $scope.getOrders();
                                            break;
                                        default:
                                            $ionicLoading.hide()
                                            alert(resp);
                                            break;
                                    }
                                })
                            }
                        }
                    ]
                });
            }

            $scope.insertBill = function () {
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_bill.html',
                    title: 'Agregue la Nueva orden seleccionando la mesa respectiva',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>OK</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var desk = $('#desk_Selected').val();
                                $.get(getServerPath(), {
                                    action: 'insert_Bill',
                                    desk_id: desk
                                }, function (r) {
                                    alert('SE AGREGO LA ORDEN ' + r);
                                })
                            }
                        }
                    ]
                });
            }
        })
        .controller('userPointsCtrl', function ($scope, $state, $ionicLoading, $ionicPopup) {
            $scope.initializeUserPoints = function () {
                $.getJSON(getServerPath(), {
                    action: 'select_gift_points',
                    username: "0801199010718"
                }, function (json) {
                    $scope.userpoint = json;
                    $scope.$apply();
                    console.log('raw :'+json);
                    console.log('json :'+JSON.stringify(json));
                })
            };
            $scope.printPage = function(){
                console.log('print');
                var printContents = document.getElementById("print").innerHTML;
                var originalContents = document.body.innerHTML;
                document.body.innerHTML = printContents;
                window.print();
                document.body.innerHTML = originalContents;
            }
        })
        .controller('requestUserpointsCtrl', function ($scope, $state, $ionicLoading,  $ionicHistory, $ionicPopup) {
           // checkKey(key);
            $scope.user = {};
            $scope.receipt = {};
            $scope.receipts = [];
            $scope.user.username = '';

            $scope.initializeRequestUserpoints = function () {
                $scope.requestUserReceipts();
                $scope.requestUserpoints();
            };

            $scope.queryUser = function(){
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/change-username-points.html',
                    title: 'Consultar Cliente',
                    subTitle: 'Ingresa la identidad del cliente',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Aceptar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $scope.initializeRequestUserpoints();
                            }
                        }
                    ]
                });
            }

            $scope.InsertPoints = function(){
             
                myPopup = $ionicPopup.show({
                    template: '<input type="text" ng-model="user.identidad" placeholder="numero de cliente" > <br> <input type="text" ng-model="user.bill" placeholder="numero de la factura" <br> <input type="text" ng-model="user.amt" placeholder="Cantidad de Puntos" >',
                    title: 'Agregar Puntos',
                    subTitle: 'Ingresa la cantidad de puntos que el cliente recibira como regalo junto al numero de factura del sistema',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Insertar Puntos</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var identidad = $scope.user.identidad;
                                var factura = $scope.user.bill 
                                var amt = $scope.user.amt
                                $.get(getServerPath(), {
                                    action: "insertPoints_manually",
                                    identidad: identidad,
                                    factura:factura,
                                    amt: amt,
                                    place_id: sessionStorage.getItem("store_id")
                                },function(resp){
                                    if($.trim(resp) == "1"){
                                        $ionicLoading.hide()
                                        alert("Los Puntos fueron añadidos exitosamente")
                                    }else{
                                        $ionicLoading.hide()
                                        alert("Algo Salio Mal es posible que la transaccion no se halla completado")
                                    }
                                })
                            }
                        }
                    ]
                });
            }

            $scope.redeemDialog = function(){
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/redeem-userpoints.html',
                    title: 'Redimir/Canjear Puntos',
                    subTitle: 'Ingresa la cantidad de puntos a redimir del cliente',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Redimir</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $scope.redeemPoints();
                                $scope.initializeRequestUserpoints();
                            }
                        }
                    ]
                });
            }

            $scope.requestUserpoints = function () {
                sessionStorage.gift_user = $scope.user.username;
                console.log('user: '+sessionStorage.gift_user);
                $.getJSON(getServerPath(), {
                    action: 'get_user_points',
                    username: $scope.user.username,
                    place_id: localStorage.place_id
                }, function (res) {
                    $scope.user.gift_points = res;
                    if($scope.user.username.length != 0)
                        alert('El cliente tiene actualmente '+res+' puntos acumulados.')
                    $scope.user.print = 0;
                    $scope.$apply();
                    console.log('get user points')
                    console.log('raw :'+res);
                    console.log('json :'+JSON.stringify(res));
                    
                })
            };

            $scope.requestUserReceipts = function(){
                $.getJSON(getServerPath(), {
                    action: 'select_receipt_points',
                    username: $scope.user.username,
                    place_location_id: sessionStorage.store_id
                }, function (res) {
                    $scope.receipts = res.reverse();
                    $scope.$apply();
                    console.log('select receipts points')
                    console.log('raw :'+res);
                    console.log('json :'+JSON.stringify(res));
                    
                })
            }

            $scope.getReceipts = function(){
                $.ajax({
                    url: getServerPath() + '?action=select_receipt_points&username='+$scope.user.username+'&place_location_id='+sessionStorage.store_id,
                    dataType: 'json',
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'get',
                    success: function (res) {
                        localStorage.syncReceipts = JSON.stringify(res.reverse());
                    }
                });
                
            }

            $scope.redeemPoints = function(){

                $.ajax({
                    url: getServerPath() + '?action=redeem_points&username='+$scope.user.username+'&place_location_id='+sessionStorage.store_id+'&place_id='+localStorage.place_id+'&gift_points='+$scope.user.redeem_points,
                    dataType: 'json',
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'get',
                    success: function (res) {
                        $scope.requestUserpoints();
                        $scope.getReceipts();
                        $scope.user.receipt_points_id = res;
                        $scope.user.redeem_points = '';
                        $scope.$apply();
                        var recs = JSON.parse(localStorage.syncReceipts);
                        $scope.printReceipt(recs[0]);

                    }
                });

            };

            $scope.printReceipt = function(receipt){
                var receiptJson = JSON.stringify(receipt);
                var action = baseUrl()+"print-receipt.php";

                redirectPostOnNewTab(action, JSON.parse(receiptJson));
            }

            $scope.goToLogUserpoints = function(){
                console.log('go to receipts');
                $state.go('tab.log-userpoints');
            }

        })
        .controller('requestCheckpointsCtrl', function ($scope, $state, $ionicLoading,  $ionicHistory, $ionicPopup) {
            checkKey(key);
            $scope.search = 0;
            $scope.user = {};
            $scope.userResult = [];
            $scope.checkin = {};
            $scope.checkins = [];
            $scope.user.username = '';

            $scope.initializeRequestCheckpoints = function () {
                $scope.requestUserLog();
                $scope.requestUserChecks();
                if($scope.search == 0)
                    return;
                $scope.requestUser();

            };

            $scope.queryUser = function(){
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/change-username-points.html',
                    title: 'Consultar Cliente',
                    subTitle: 'Ingresa la identidad del cliente',
                    cssClass: 'small-large',
                    scope: $scope,
                    buttons: [
                        {
                            text: 'Limpiar',
                            onTap: function (e) {
                                $scope.user.username = '';
                                $scope.queryUser();
                            }
                        },
                        {text: 'Cancelar'},
                        {
                            text: '<b>Aceptar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $scope.search = 1;
                                $scope.initializeRequestCheckpoints();
                            }
                        }
                    ]
                });
            }

            $scope.redeemDialog = function(){
                $scope.user.entry = '';
                myPopup = $ionicPopup.show({
                    template: '<p>Visitas actuales: {{user.gift_points}}</p><p>Cliente {{user.username}}:</p><input ng-model="user.redeem_points" id="redeem_points" placeholder="Cantidad redimir" /><input ng-model="user.entry" id="entry" placeholder="Producto entregado" />',
                    title: 'Ingresa la cantidad de visitas a canjear del cliente',
                    subTitle: 'Se registrara la transaccion con un correo al cliente y local',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Redimir</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                if($scope.user.gift_points < $scope.user.redeem_points){
                                    alert('El usuario no tiene los visitas suficientes');
                                    return;
                                }
                                $scope.redeemCheckin();
                                $scope.initializeRequestCheckpoints();
                            }
                        }
                    ]
                });
            }

            $scope.entryCheckin = function(){
                myPopup = $ionicPopup.show({
                    template: '<input ng-model="user.username" id="username" placeholder="Identidad"  /><br/><input ng-model="user.entry" id="entry" placeholder="Razon Checkin" />',
                    title: 'Registrar Visita: ',
                    subTitle: 'Que compro el usuario en la visita',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Registrar Visita</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $scope.Checkin();
                                setTimeout(function () {
                                    $scope.initializeRequestCheckpoints();
                                }, 500)
                            }
                        }
                    ]
                });
            }

            $scope.requestUserChecks = function () {
                sessionStorage.check_user = $scope.user.username;
                $.getJSON(getServerPath(), {
                    action: 'get_user_checkins',
                    username: $scope.user.username,
                    place_id: localStorage.place_id
                }, function (res) {
                    $scope.user.gift_points = res;
                    if($scope.user.username.length != 0)
                        alert('El cliente tiene actualmente '+res+' visitas acumulados.')
                    $scope.$apply();
                    
                })
            };

            $scope.requestUserLog = function(){
                $.getJSON(getServerPath(), {
                    action: 'get_user_check_log',
                    username: $scope.user.username,
                    place_id: localStorage.place_id
                }, function (res) {
                    $scope.checkins = res.reverse();
                    $scope.$apply();
                })
            }

            $scope.requestUser = function(){
                $.getJSON(getServerPath(), {
                    action: 'select_loyal_username',
                    username: $scope.user.username
                }, function (res) {
                    $scope.userResult = res;
                    if($scope.userResult.length == 0){
                        $scope.registerClient();
                    }
                    $scope.$apply();
                })
            }


            $scope.redeemCheckin = function(){
                
                $.ajax({
                    url: getServerPath() + '?action=redeem_check&'
                    +'username='+$scope.user.username
                    +'&store_id='+sessionStorage.store_id
                    +'&place_id='+localStorage.place_id
                    +'&check_points='+$scope.user.redeem_points
                    +'&transacton_entry='+$scope.user.entry,
                    dataType: 'json',
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'get',
                    success: function (res) {
                        $scope.requestUserChecks();
                        $scope.requestUserLog();
                        $scope.user.receipt_points_id = res;
                        $scope.user.redeem_points = '';
                        $scope.$apply();
                        
                    }
                });

            };

            $scope.Checkin = function(){
                $.getJSON(getServerPath(), {
                    action: 'check_in',
                    username: $scope.user.username,
                    store_id: sessionStorage.store_id,
                    place_id: localStorage.place_id,
                    transaction_entry: $scope.user.entry
                }, function (res) {
                    if($.trim(res) == -1){
                        alert('Debes Registrar El Usuario');
                        $scope.registerClient();
                        return;
                    }
                    console.log('checkin ');
                    $scope.initializeRequestCheckpoints();
                    //$scope.user.entry = '';
                })
                


            };

            $scope.deleteCheckin = function(checkin){

                myPopup = $ionicPopup.show({
                    template: '<input ng-model="user.entry" id="entry" placeholder="Razon Checkin" />',
                    title: 'Estas seguro que deseas eliminar la visita?',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Eliminar Visita</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $.get(getServerPath(), {
                                    action: 'delete_checkin',
                                    check_in_id: checkin.check_in_id
                                }, function (resp) {
                                    var resp = $.trim(resp);
                                    switch (resp) {
                                        case '1':
                                        $ionicLoading.hide()
                                        alert('Visita eliminada correctamente');
                                        $scope.requestUserChecks();
                                        $scope.requestUserLog();
                                        break;

                                        default:
                                        $ionicLoading.hide()
                                        alert(resp);
                                        break;
                                    }
                                })
                            }
                        }
                    ]
                });
                
            }

            $scope.registerClient = function(){
                    myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_username.html',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>OK</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                
                                $.get(getServerPath(), {
                                    action: 'insert_loyal_username',
                                    identidad: $scope.user.username,
                                    Nombre: $scope.user.nombre,
                                    numero: $scope.user.numero,
                                    email: $scope.user.email,
                                }, function (resp) {
                                    var resp = $.trim(resp);
                                    switch (resp) {
                                        case '1':
                                            $ionicLoading.hide()
                                           
                                            alert('Usuario registrado correctamente');
                                            $scope.user.nombre = '';
                                            $scope.user.numero = '';
                                            $scope.user.email = '';
                                            $scope.requestUser();
                                            $scope.entryCheckin();
                                            break;
                                        case '-1':
                                            $ionicLoading.hide()
                                            alert('El usuario ya esta registrado');
                                            break;
                                        default:
                                            $ionicLoading.hide()
                                            alert(resp);
                                            break;
                                    }
                                })
                            }
                        }
                    ]
                });
            }

        })
        .controller('logUserpointsCtrl', function ($scope, $state, $ionicLoading,  $ionicHistory, $ionicPopup) {
          //  checkKey(key);
            $scope.user = {};
            $scope.receipt = {};
            $scope.receipts = [];
            $scope.user.username = '';

            $scope.initializeRequestUserpoints = function () {
                console.log('prueba entrada log userpoint');
                $scope.requestlogUserReceipts();
            };

            $scope.requestlogUserReceipts = function(){
                var date = new Date();
                var today = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
                console.log(getServerPath()+'?action=select_receipt_points_of_day&place_location_id='+sessionStorage.store_id+"&date="+today);
                $.getJSON(getServerPath(), {
                    action: 'select_receipt_points_of_day',
                    place_location_id: sessionStorage.store_id,
                    year: date.getFullYear(),
                    month: date.getMonth()+1,
                    day: date.getDate()
                }, function (res) {
                    $scope.receipts = res.reverse();
                    $scope.$apply();
                    console.log('select receipts points')
                    console.log('raw :'+res);
                    console.log('json :'+JSON.stringify(res));
                    
                })
            }


            $scope.printReceipt = function(receipt){
                var receiptJson = JSON.stringify(receipt);
                var action = baseUrl()+"print-receipt.php";

                redirectPostOnNewTab(action, JSON.parse(receiptJson));
            }

            $scope.goBack = function () {
                $ionicHistory.goBack()
            }

        })
        .controller('sentCtrl', function ($scope, $state, APPCache) {

        })
        .controller('catCtrl', function ($scope, $state, $ionicPopup, APPCache, $ionicLoading, $rootScope) {
            checkKey(key);
            validateScope($scope);
            $scope.category = {};
            $scope.del = function (cat_id) {
                myPopup = $ionicPopup.show({
                    template: '¿Estas seguro en proceder? Tambien se eliminaran todos los Platos, Imagenes y opciones que tienen relacion con esta categoria',
                    title: 'Eliminar Categoria',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>OK</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                $.get(getServerPath(), {
                                    action: 'delete_category',
                                    cat_id: cat_id
                                }, function (data) {
                                    $ionicLoading.hide();
                                    if ($.trim(data) == '1') {
                                        $rootScope.$emit("getMenu", {});
                                        $scope.getCategories();
                                    } else {
                                        alert(data);
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.getCategories = function () {
                $('#loadingCatX').show('slow')
                $('#contentCatX').hide('slow')
                $.getJSON(getServerPath(), {
                    action: 'select_category',
                    place_id: sessionStorage.getItem('place_id')
                }, function (json) {
                    $('#loadingCatX').hide('slow')
                    $('#contentCatX').show('slow')
                    console.log(json)
                    $scope.cat = json;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$apply();
                });
            }
            $scope.insertCat = function () {
                console.log(name);
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_cat.html',
                    title: 'Inserte la nueva categoria',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>OK</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var name = $('#catName').val();
                                $.get(getServerPath(), {
                                    action: 'insert_category',
                                    name: name,
                                    place_id: sessionStorage.getItem('place_id')
                                }, function (resp) {
                                    var resp = $.trim(resp);
                                    switch (resp) {
                                        case '1':
                                            $ionicLoading.hide()
                                            $scope.getCategories()
                                            $rootScope.$emit("getMenu", {});
                                            alert('Success');
                                            break;
                                        default:
                                            $ionicLoading.hide()
                                            alert(resp);
                                            break;
                                    }
                                })
                            }
                        }
                    ]
                });
            };
            $scope.updateCat = function (c) {
                console.log(JSON.stringify(c));
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/update_cat.html',
                    title: 'Actualize la categoria',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>OK</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var name = $('#catName').val();
                                var stat = $('#catStatus').val();
                                var categoryType = $('#tipoCategoria').val();
                                var category_home = 0;

                                if(categoryType == 2)
                                    category_home = 1;
                                else
                                    category_home = 0;
                                console.log(stat);
                                $.get(getServerPath(), {
                                    action: 'update_category',
                                    name: name,
                                    status: stat,
                                    category_home: category_home,
                                    category_type: categoryType,
                                    cat_id: c.category_id,
                                    place_id: sessionStorage.getItem('place_id')
                                }, function (resp) {
                                    $ionicLoading.hide();
                                    var resp = $.trim(resp);
                                    switch (resp) {
                                        case '1':
                                            $scope.getCategories();
                                            $rootScope.$emit("getMenu", {});
                                            alert('Success');
                                            break;
                                        default:
                                            alert(resp);
                                            break;
                                    }
                                })
                            }
                        }
                    ]
                })
                setTimeout(function () {
                    $('#catName').val($('#tbName' + c.category_id).text())
                    $('#catStatus').val($('#tbstat' + c.category_id).text())
                    $('#tipoCategoria').val(c.category_type)
                }, 500)
            }

        $scope.set_category_image = function(category_id) {
            var MAX_SIZE = LOGO_MAX_SIZE;
            myPopup = $ionicPopup.show({
                templateUrl: 'dialogs/insert_background.html',
                title: 'Inserte una Imagen',
                subTitle: 'Elige una nueva imagen para la categoria seleccionada.<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                scope: $scope,
                buttons: [
                    {text: 'Cancelar'},
                    {
                        text: '<b>Actualizar</b>',
                        type: 'button-stable',
                        onTap: function () {
                            $ionicLoading.show({
                                templateUrl: 'dialogs/loader.html',
                            });
                            var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                            var IMAGE_SIZE = new_image.size;
                            if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                $ionicLoading.hide()
                                return;
                            }

                            console.log('size image: ' + new_image.size);

                            var form_data = new FormData();
                            form_data.append('action', 'set_category_image');
                            form_data.append('img', new_image);
                            form_data.append('category_id', category_id);
                            $.ajax({
                                url: getServerPath(),
                                dataType: 'text',
                                cache: false,
                                contentType: false,
                                processData: false,
                                data: form_data,
                                type: 'post',
                                success: function (data) {
                                    var d = $.trim(data);
                                    if (d == '1') {
                                        $scope.getCategories();
                                        $rootScope.$emit("getMenu", {});
                                        $ionicLoading.hide()
                                        alert('Registrado Correctamente');
                                    } else {
                                        alert(data);
                                        $ionicLoading.hide()
                                    }
                                }
                            });
                        }
                    }
                ]
            });
        }

        $scope.add_category = function() {
            var MAX_SIZE = LOGO_MAX_SIZE;
            myPopup = $ionicPopup.show({
                templateUrl: 'dialogs/add_categories.html',
                title: 'Inserte la nueva categoria',
                scope: $scope,
                buttons: [
                    {text: 'Cancelar'},
                    {
                        text: '<b>Insertar</b>',
                        type: 'button-stable',
                        onTap: function () {
                            $ionicLoading.show({
                                templateUrl: 'dialogs/loader.html',
                            });
                            var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                            var IMAGE_SIZE = new_image.size;
                            if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                $ionicLoading.hide()
                                return;
                            }

                            console.log('size image: ' + new_image.size);

                            var category_home = 1;
                            if($('#tipoCategoria').val() == 1)
                                category_home = 0;

                            var form_data = new FormData();
                            form_data.append('action', 'add_category');
                            form_data.append('img', new_image);
                            form_data.append('name', $scope.category.name);
                            form_data.append('category_type', $('#tipoCategoria').val());
                            form_data.append('category_home', category_home);
                            // form_data.append('super_category', $scope.category.super_category);
                            form_data.append('place_id', sessionStorage.getItem('place_id'));
                            $.ajax({
                                url: getServerPath(),
                                dataType: 'text',
                                cache: false,
                                contentType: false,
                                processData: false,
                                data: form_data,
                                type: 'post',
                                success: function (data) {
                                    $ionicLoading.hide()
                                    console.log(data);
                                    var d = $.trim(data);
                                    if (d == '1') {
                                        $scope.getCategories();
                                        $rootScope.$emit("getMenu", {});
                                        $ionicLoading.hide()
                                        alert('Registrado Correctamente');
                                    } else {
                                        alert(data);
                                        $ionicLoading.hide()
                                    }
                                }
                            });
                        }
                    }
                ]
            });
        }
    })
        .controller('deskCtrl', function ($scope, $state, $ionicPopup, APPCache) {
            checkKey(key);
            validateScope($scope);
            $scope.getDesk = function () {
                $('#loadingDesks').show('slow')
                $('#contentDesks').hide('slow')
                $.getJSON(getServerPath(), {
                    action: 'select_desk',
                    place_location_id: sessionStorage.getItem('store_id')
                }, function (json) {
                    $('#loadingDesks').hide('slow')
                    $('#contentDesks').show('slow')
                    $scope.desks = json;
                    console.log(json);
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$apply();
                })
            }

            $scope.insertDesk = function () {
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_desk.html',
                    title: 'Nuevo Lugar',
                    subTitle: 'Agrega el nombre de tu restaurante',
                    scope: $scope,
                    buttons: [
                        {text: 'No'},
                        {
                            text: '<b>Yes</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                var name = $('#desk_name').val()
                                $.get(getServerPath(), {
                                    action: 'insert_desk',
                                    place_location_id: sessionStorage.getItem('store_id'),
                                    desk_nm: name,
                                }, function (resp) {
                                    var resp = $.trim(resp);
                                    switch (resp) {
                                        case '1':
                                            alert('Registrado Correctamente')
                                            $scope.getDesk();
                                            break;
                                        default:
                                            alert(resp);
                                            break;
                                    }
                                })
                            }
                        }
                    ]
                });
            }

            $scope.gotoQr = function (id) {
                sessionStorage.setItem('idDesk', id);
                var name = $('#deskName' + id).text()
                sessionStorage.setItem('deskName', name);
                if (sessionStorage.getItem('deskMode') == 'res') {
                    $state.go('tab.qr');
                } else {
                    $state.go('app.qr');
                }
            }

            $scope.deleteDesk = function (id) {
                myPopup = $ionicPopup.show({
                    title: 'Eliminar Mesa',
                    subTitle: 'Si deseas eliminar la mesa haz click en aceptar, despues de eso remueve el Codigo QR de la mesa eliminada',
                    scope: $scope,
                    buttons: [
                        {text: 'No'},
                        {
                            text: '<b>Si</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $.get(getServerPath(), {
                                    action: 'delete_desk',
                                    desk_id: id
                                }, function (resp) {
                                    var resp = $.trim(resp);
                                    console.log(resp);
                                    switch (resp) {
                                        case '1':
                                            alert('Registrado Correctamente')
                                            $scope.getDesk();
                                            break;
                                        default:
                                            alert(resp);
                                            break;
                                    }
                                })
                            }
                        }
                    ]
                });

            }

            $scope.editDesk = function (id) {

                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/update_desk.html',
                    title: 'Editar Mesa',
                    subTitle: 'Agrega el nombre de tu restaurante',
                    scope: $scope,
                    buttons: [
                        {text: 'No'},
                        {
                            text: '<b>Yes</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                var status = $('#desk_status').val()
                                var name = $('#desk_name').val()
                                $.get(getServerPath(), {
                                    action: 'update_desk',
                                    status: status,
                                    desk_id: id,
                                    desk_name: name
                                }, function (resp) {
                                    var resp = $.trim(resp);
                                    switch (resp) {
                                        case '1':
                                            alert('Registrado Correctamente')
                                            $scope.getDesk();
                                            break;
                                        default:
                                            alert(resp);
                                            break;
                                    }
                                })
                            }
                        }
                    ]
                });
                setTimeout(function () {
                    $('#desk_name').val($('#deskName' + id).text())
                    $('#desk_status').val($('#deskStatus' + id).text())
                }, 500)
            }

        })
        .controller('loginCtrl', function ($scope, $state, APPCache, $rootScope, $ionicLoading) {

            $scope.login = function () {
                $ionicLoading.show({
                    templateUrl: 'dialogs/loader.html',
                });
                var username = $("#username").val();
                var password = $("#password").val();
                if ($.trim(username) != 0) {
                    if ($.trim(password) != 0) {
                        $.get(getServerPath(), {
                            action: 'login_admin',
                            admin_id: username,
                            pass: password
                        }, function (resp) {
                            var resp = $.trim(resp);
                            switch (resp) {
                                case '000-000':
                                    alert('Wrong username or password');
                                    $ionicLoading.hide()
                                    break;
                                case '000-9144':
                                    alert('You need to update your payment');
                                    $ionicLoading.hide()
                                    break;
                                case 'cod-9144':
                                    key = getServerKey();
                                    sessionStorage.setItem('username', username);
                                    $state.go('place');
                                    $rootScope.$emit("getPlaces", {});
                                    $ionicLoading.hide()
                                    break;
                                default:
                                    console.log(resp);
                                    break;
                            }
                        });
                    } else {
                        alert('Please fill up your password');
                    }
                } else {
                    alert('Please fill up your username');
                }
            }


        })
        .controller('placeCtrl', function ($scope, $state, $ionicPopup, APPCache, $rootScope, $ionicLoading) {
            checkKey(key);
            validateScope($scope);
            sessionStorage.setItem('deskMode', 'admin');
            $scope.username = sessionStorage.getItem('username');
            $scope.imgUrl = getImagePath();
            $scope.place = {
                business_name: '',
                business_phone: '',
                facebook_id: '',
                admin_id: '',
                password: '',
                confirm_password: ''
            };

            $scope.addPoints = function(p){
                myPopup = $ionicPopup.show({
                    title: 'Agregar Puntos a '+p.business_name,
                    subTitle: 'Estas seguro que deseas agregar sistema de puntos a '+p.business_name+'?',
                    scope: $scope,
                    buttons: [
                        {text: 'No'},
                        {
                            text: '<b>Sí</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html' });
                                
                                $.get(getServerPath(), {
                                    action: 'add_puntos_place',
                                    place_id: p.place_id,
                                    business_name: p.business_name,
                                    admin_id: p.admin_id
                                }, function (r) {
                                    $ionicLoading.hide()
                                    console.log(r);
                                    var resp = $.trim(r)
                                    if (resp==1) {
                                        alert('Puntos agregados correctamente');
                                        $scope.getPlaces();
                                        return;
                                    }
                
                                    alert('Ocurrio un problema con el servidor');
                                })
                            }
                        }
                    ]
                });
            }

            $scope.addCheckins = function(p){
                myPopup = $ionicPopup.show({
                    title: 'Agregar Punchcard a '+p.business_name,
                    subTitle: 'Estas seguro que deseas agregar sistema Punchcard a '+p.business_name+'?',
                    scope: $scope,
                    buttons: [
                        {text: 'No'},
                        {
                            text: '<b>Sí</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html' });
                                
                                $.get(getServerPath(), {
                                    action: 'add_punchcard_place',
                                    place_id: p.place_id,
                                    business_name: p.business_name,
                                    admin_id: p.admin_id
                                }, function (r) {
                                    $ionicLoading.hide()
                                    console.log(r);
                                    var resp = $.trim(r)
                                    if (resp==1) {
                                        alert('Punchcard agregado correctamente');
                                        $scope.getPlaces();
                                        return;
                                    }
                
                                    alert('Ocurrio un problema con el servidor');
                                })
                            }
                        }
                    ]
                });
            }

            $scope.addNewApp = function () {
                $scope.username = sessionStorage.username;
                myPopup = $ionicPopup.show({
                    template:  "<label style='margin-top: 1rem;display: block;font-size: .8rem;' for='business_name;'>Nombre de App</label> \
                                <input ng-model='place.business_name' id='business_name' placeholder='Nombre'/><br/> \
                                <label style='margin-top: 1rem;display: block;font-size: .8rem;' for='admin_id;'>Usuario</label> \
                                <input ng-model='place.admin_id' id='admin_id' type='text' placeholder='e.g., administracion@pizzahut.com, dejar en blanco si se usara {{username}}'/> \
                                <label style='margin-top: 1rem;display: block;font-size: .8rem;' for='password;'>Password</label> \
                                <input ng-model='place.password' id='password' type='password' placeholder='Ingrese un password para ingresar a su usuario'/> \
                                <input ng-model='place.confirm_password' id='confirm_password' type='password' placeholder='Confirme el password ingresado nuevamente'/>\
                                <label style='margin-top: 1rem;display: block;font-size: .8rem;' for='ccImage;'>Logo principal</label> \
                                <input id='new_image' name='file_image' type='file' accept='image/*'/>",
                    title: 'Crear App',
                    cssClass: 'popup-pin',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Crear</b>',
                            type: 'button-stable',
                            onTap: function () {
                                var MAX_SIZE = LOGO_MAX_SIZE;
                                var business_name = $scope.place.business_name;
                                var admin_id = $scope.place.admin_id;                                

                                var passsword = $('#password').val();
                                var confirm_passsword = $('#confirm_password').val();

                                if(passsword !== confirm_passsword){
                                    alert('Los campos Password y Confirmar Password deben coincidir, favor intente de nuevo');
                                    $scope.createNewApp();
                                    $scope.place.passsword = '';
                                    $scope.place.confirm_passsword = '';
                                    return;
                                }

                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });

                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";


                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                if($.trim(admin_id) == '')
                                    admin_id = sessionStorage.username;


                                var form_data = new FormData();
                                //console.log(new_image);
                                form_data.append('action', 'create_new_app');
                                form_data.append('business_logo', new_image);
                                form_data.append('business_name', business_name);
                                form_data.append('admin_id', admin_id);
                                form_data.append('password', $('#password').val());

                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (d) {
                                        var data = $.trim(d);
                                        if (data == 0 || data == false) {
                                            alert('Ha ocurrido un problema.');
                                            $scope.getPlaces();
                                            $ionicLoading.hide();
                                        } else {
                                            $scope.place = {
                                                business_name: '',
                                                business_phone: '',
                                                facebook_id: '',
                                                admin_id: '',
                                                passsword: '',
                                                confirm_passsword: ''
                                            };
                                            $scope.getPlaces();
                                            $ionicLoading.hide();
                                            console.log(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.createNewApp = function () {
                myPopup = $ionicPopup.show({
                    template:  "<label style='margin-top: 1rem;display: block;font-size: .8rem;' for='business_name;'>Nombre de App</label> \
                                <input ng-model='place.business_name' id='business_name' placeholder='Nombre'/><br/> \
                                <label style='margin-top: 1rem;display: block;font-size: .8rem;' for='admin_id;'>Usuario</label> \
                                <input ng-model='place.admin_id' id='admin_id' type='text' placeholder='Ingrese el usuario con el que desea administrar la app. (e.g., administracion@pizzahut.com)'/> \
                                <label style='margin-top: 1rem;display: block;font-size: .8rem;' for='password;'>Password</label> \
                                <input ng-model='place.password' id='password' type='password' placeholder='Ingrese un password para ingresar a su usuario'/> \
                                <input ng-model='place.confirm_password' id='confirm_password' type='password' placeholder='Confirme el password ingresado nuevamente'/>\
                                <label style='margin-top: 1rem;display: block;font-size: .8rem;' for='ccImage;'>Logo principal</label> \
                                <input id='new_image' name='file_image' type='file' accept='image/*'/>",
                    title: 'Crear App',
                    cssClass: 'popup-pin',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Crear</b>',
                            type: 'button-stable',
                            onTap: function () {
                                var MAX_SIZE = LOGO_MAX_SIZE;
                                var business_name = $scope.place.business_name;
                                var business_phone = $scope.place.business_phone;
                                var facebook_id = $scope.place.facebook_id;
                                var admin_id = $scope.place.admin_id;                                

                                var passsword = $('#password').val();
                                var confirm_passsword = $('#confirm_password').val();

                                if(passsword !== confirm_passsword){
                                    alert('Los campos Password y Confirmar Password deben coincidir, favor intente de nuevo');
                                    $scope.createNewApp();
                                    $scope.place.passsword = '';
                                    $scope.place.confirm_passsword = '';
                                    return;
                                }

                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });

                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";


                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }


                                var form_data = new FormData();
                                //console.log(new_image);
                                form_data.append('action', 'create_new_app');
                                form_data.append('business_logo', new_image);
                                form_data.append('business_name', business_name);
                                form_data.append('business_phone', business_phone);
                                form_data.append('facebook_id', facebook_id);
                                form_data.append('admin_id', admin_id);
                                form_data.append('password', $('#password').val());

                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (d) {
                                        var data = $.trim(d);
                                        if (data == 0 || data == false) {
                                            alert('Ha ocurrido un problema.');
                                            $scope.getPlaces();
                                            $ionicLoading.hide();
                                        } else {
                                            $scope.place = {
                                                business_name: '',
                                                business_phone: '',
                                                facebook_id: '',
                                                admin_id: '',
                                                passsword: '',
                                                confirm_passsword: ''
                                            };
                                            $scope.getPlaces();
                                            $ionicLoading.hide();
                                            console.log(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.deletePlace = function(p){
                myPopup = $ionicPopup.show({
                    title: 'Eliminar App',
                    subTitle: 'Estas seguro que deseas eliminar la app: '+p.business_name+'?',
                    scope: $scope,
                    buttons: [
                        {text: 'No'},
                        {
                            text: '<b>Sí</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html' });
                                
                                $.get(getServerPath(), {
                                    action: 'delete_place',
                                    place_id: p.place_id
                                }, function (r) {
                                    $ionicLoading.hide()
                                    console.log(r);
                                    var resp = $.trim(r)
                                    if (resp==1) {
                                        alert('App eliminada correctamente');
                                        $scope.getPlaces();
                                        return;
                                    }
                
                                    alert('Ocurrio un problema con el servidor');
                                })
                            }
                        }
                    ]
                });
            }

            $scope.nameAppUrl = function(p){
                if(p.name_app==""){alert('Aun no se ha establecido la URL correctamente para esta App.'); return;}                
                window.open(baseUrl()+p.name_app, '_blank');
            };

            $rootScope.$on("getPlaces", function () {
                $scope.getPlaces();
            });
            $scope.getPlaces = function () {
                $('#loadingPlaces').show('slow')
                $('#contentPlaces').hide('slow')
                $.getJSON(getServerPath(), {
                    admin_id: sessionStorage.getItem('username'),
                    action: 'select_place'
                }, function (json) {
                    $('#loadingPlaces').hide('slow')
                    $('#contentPlaces').show('slow')
                    $scope.places = json.reverse();//sort(function(a,b){ return b.place_id - a.place_id });
                    //console.log('places: ' + JSON.stringify($scope.places));
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$apply();
                });
            }
            $scope.newPlace = function () {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_place.html',
                    title: 'Nuevo Lugar',
                    subTitle: 'Agrega el titulo de tu App.<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Save</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var logoUrl = $.trim($('#bl').val()).length != 0 ? $('#bl').prop('files')[0] : " ";
                                var name = $('#bn').val();

                                var IMAGE_SIZE = logoUrl.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                var form_data = new FormData();
                                form_data.append('action', 'insert_Place');
                                form_data.append('business_name', name);
                                form_data.append('business_logo', logoUrl);
                                form_data.append('admin_id', sessionStorage.getItem('username'));
                                if ($.trim(logoUrl).length != 0) {
                                    if ($.trim(name).length != 0) {
                                        $.ajax({
                                            url: getServerPath(),
                                            dataType: 'text',
                                            cache: false,
                                            contentType: false,
                                            processData: false,
                                            data: form_data,
                                            type: 'post',
                                            success: function (data) {
                                                var d = $.trim(data)
                                                if (d == '1') {
                                                    alert('Registrado Correctamente')
                                                    $scope.getPlaces();
                                                    $ionicLoading.hide()
                                                } else {
                                                    alert(data)
                                                    $ionicLoading.hide()
                                                }
                                            }
                                        });
                                    } else {
                                        alert('Please select the logo of your App');
                                        e.preventDefault();
                                    }
                                } else {
                                    alert('Please add the name of your App');
                                    e.preventDefault();
                                }
                            }
                        }
                    ]
                });
            }
            $scope.goDash = function (logoUrl, place_id, business_name, addon_puntos, name_app) {
                console.log('addon_puntos: ' + addon_puntos);
                sessionStorage.setItem('logoUrl', logoUrl);
                sessionStorage.setItem('place_id', place_id);
                sessionStorage.setItem('business_name', business_name);
                sessionStorage.setItem('addon_puntos', addon_puntos);
                sessionStorage.nameApp = name_app;
                $state.go('app.dash');
                $rootScope.$emit("getMenu", {});
                $rootScope.$emit("getPromos", {});
                $rootScope.$emit("getStores", {});
            }

            $scope.manageApp = function (p) {
                console.log('addon_puntos: ' + p.addon_puntos);
                sessionStorage.setItem('logoUrl', p.business_logo);
                sessionStorage.setItem('place_id', p.place_id);
                sessionStorage.setItem('business_name', p.business_name);
                sessionStorage.setItem('addon_puntos', p.addon_puntos);
                sessionStorage.nameApp = p.name_app;
                localStorage.place = JSON.stringify(p);
                //alert(localStorage.place);
                $state.go('app.personalize');
                $rootScope.$emit("getMenu", {});
                $rootScope.$emit("getPromos", {});
                $rootScope.$emit("getStores", {});
            }

            $scope.edit = function (id) {
                setTimeout(function () {
                    $('#bn').val($('#placeName' + id).text())
                }, 1000)
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_place.html',
                    title: 'Editar Lugar',
                    subTitle: 'Agrega el titulo de tu App.<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Save</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var logoUrl = $.trim($('#bl').val()).length != 0 ? $('#bl').prop('files')[0] : " ";
                                var name = $('#bn').val();

                                var IMAGE_SIZE = logoUrl.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                var form_data = new FormData();
                                form_data.append('action', 'update_place');
                                form_data.append('business_name', name);
                                form_data.append('business_logo', logoUrl);
                                form_data.append('place_id', id);
                                if (name.length != 0) {
                                    $.ajax({
                                        url: getServerPath(),
                                        dataType: 'text',
                                        cache: false,
                                        contentType: false,
                                        processData: false,
                                        data: form_data,
                                        type: 'post',
                                        success: function (data) {
                                            if (data.trim()  == '1' ) {
                                                alert('Actualizacion realizada exitosamente');
                                                $scope.getPlaces();
                                                $ionicLoading.hide();
                                            } else {
                                                alert(data);
                                                $ionicLoading.hide();
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    ]
                });
            }
        })
        .controller('storesCtrl', function ($scope, $state, APPCache, $rootScope, $ionicPopup, $ionicLoading) {
            checkKey(key);
            validateScope($scope);
            $scope.username = sessionStorage.getItem('username');
            console.log('username: ' + $scope.username);
            $rootScope.$on("getStores", function () {
                $scope.getPlaces();
            });

            $scope.deletePlaceLocation = function(s){
                myPopup = $ionicPopup.show({
                    title: 'Eliminar Sucursal',
                    subTitle: 'Estas seguro que deseas eliminar la sucursal: '+s.name+'?',
                    scope: $scope,
                    buttons: [
                        {text: 'No'},
                        {
                            text: '<b>Sí</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html' });
                                
                                $.get(getServerPath(), {
                                    action: 'delete_place_location',
                                    place_location_id: s.place_location_id
                                }, function (r) {
                                    $ionicLoading.hide()
                                    console.log(r);
                                    var resp = $.trim(r)
                                    if (resp==1) {
                                        alert('Sucursal eliminada correctamente');
                                        $scope.getStores();
                                        return;
                                    }
                                    $scope.getStores();
                                    alert('Ocurrio un problema con el servidor');
                                })
                            }
                        }
                    ]
                });
            }

            $scope.set_whatsapp_store = function (store) {
                $scope.object = {};

                $scope.object.value = store.whatsapp;
                myPopup = $ionicPopup.show({
                    template: '<input type="text" ng-model="object.value" ng-value="object.value" autofocus>',
                    title: 'Editar '+store.name,
                    subTitle: 'Actualizar el enlace de la sucursal',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html'});
                                return $scope.object;
                            }
                        }
                    ]
                });
              
                myPopup.then(function(res){
                    $.get(getServerPath(), {
                        action: 'set_whatsapp_store',
                        store_id: store.place_location_id,
                        whatsapp: res.value
                    }, function (r) {
                        $ionicLoading.hide()
                        if(r==1)
                        {
                            alert('Valor actualizado correctamente');
                            $scope.getStores();
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                    });
                });
            };               

            $scope.set_order_site = function (store) {
                $scope.object = {};

                $scope.object.value = store.order_site;
                myPopup = $ionicPopup.show({
                    template: '<input type="text" ng-model="object.value" ng-value="object.value" autofocus>',
                    title: 'Editar '+store.name,
                    subTitle: 'Actualizar el enlace de la sucursal',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html'});
                                return $scope.object;
                            }
                        }
                    ]
                });
              
                myPopup.then(function(res){
                    $.get(getServerPath(), {
                        action: 'set_order_site',
                        store_id: store.place_location_id,
                        order_site: res.value
                    }, function (r) {
                        $ionicLoading.hide()
                        if(r==1)
                        {
                            alert('Valor actualizado correctamente');
                            $scope.getStores();
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                    });
                });
            };            


            $scope.set_shipping_cost = function (store) {
                $scope.object = {};

                $scope.object.value = store.shipping_cost;
                myPopup = $ionicPopup.show({
                    template: '<input type="text" ng-model="object.value" ng-value="object.value" autofocus>',
                    title: 'Editar '+store.name,
                    subTitle: 'Actualizar el valor de shipping',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html'});
                                return $scope.object;
                            }
                        }
                    ]
                });
              
                myPopup.then(function(res){
                    $.get(getServerPath(), {
                        action: 'set_shipping_cost',
                        store_id: store.place_location_id,
                        shipping_cost: res.value
                    }, function (r) {
                        $ionicLoading.hide()
                        if(r==1)
                        {
                            alert('Valor actualizado correctamente');
                            $scope.getStores();
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                    });
                });
            };

            $scope.set_promo_day = function (store) {
                $scope.promo_day = {};

                $scope.promo_day.activated = store.promo_day;
                myPopup = $ionicPopup.show({
                    template: '<input type="text" ng-model="promo_day.activated" ng-value="promo_day.activated" autofocus>',
                    title: 'Editar '+store.name,
                    subTitle: 'Actualizar el día de promociones de la sucursal seleccionada',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html'});
                                return $scope.promo_day;
                            }
                        }
                    ]
                });
              
                myPopup.then(function(res){
                    $.get(getServerPath(), {
                        action: 'set_promo_day',
                        place_location_id: store.place_location_id,
                        promo_day: res.activated
                    }, function (r) {
                        $ionicLoading.hide()
                        if(r==1)
                        {
                            alert('Día de promociones actualizado correctamente');
                            $scope.getStores();
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                    });
                });
            };


            $scope.newStore = function () {
                sessionStorage.setItem('place_option', 'insert');
                $state.go('app.newPlace');
            }
            $scope.getStores = function () {
                $('#loadingStores').show('slow')
                $('#contentStores').hide('slow')
                $.getJSON(getServerPath(), {
                    action: 'select_Place_Locations',
                    place_id: sessionStorage.getItem('place_id')
                }, function (json) {
                    $('#loadingStores').hide('slow')
                    $('#contentStores').show('slow')
                    console.log(JSON.stringify(json));
                    $scope.stores = json;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$apply();
                });
            };
            $scope.gotoTables = function (id) {
                sessionStorage.setItem('store_id', id);
                sessionStorage.setItem('store_name', $('#name' + id).text());
                console.log('store: ' + sessionStorage.getItem('store_name'));
                $state.go('app.desk')
            };

            $scope.deleteStore = function(id){
                myPopup = $ionicPopup.show({
                    title: 'Eliminar Sucursal',
                    subTitle: 'Estas seguro que deseas eliminar permanentemente la sucursal seleccionada?',
                    scope: $scope,
                    buttons: [
                        {text: 'No'},
                        {
                            text: '<b>Si</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html' });
                                
                                $.get(getServerPath(), {
                                    action: 'delete_place_location',
                                    place_location_id: id
                                }, function (r) {
                                    $ionicLoading.hide()
                                    console.log(r);
                                    var resp = $.trim(r)
                                    if (resp==1) {
                                        alert('Sucursal eliminada correctamente');
                                        $scope.getStores();
                                        return;
                                    }
                
                                    alert('Ocurrio un problema con el servidor');
                                })
                            }
                        }
                    ]
                });
                
            }

            $scope.editPlaceLocation = function (store) {
                sessionStorage.place_option = 'update';
                sessionStorage.place_id_location = store.place_location_id;
                sessionStorage.placeName = store.name;
                sessionStorage.placeCity = store.ciudad;
                sessionStorage.placeLat = store.lat;
                sessionStorage.placeLon = store.lon;
                sessionStorage.min = store.min;

                // sessionStorage.setItem('place_option', 'update');
                // sessionStorage.setItem('place_id_location', id);
                // sessionStorage.setItem('placeName', $('#name' + id).text());
                // sessionStorage.setItem('placeCity', $('#city' + id).text());
                // sessionStorage.setItem('placeLat', $('#lat' + id).text());
                // sessionStorage.setItem('placeLon', $('#lon' + id).text());
                // sessionStorage.setItem('min', $('#min' + id).text());
                $state.go('app.newPlace');
            };
            $scope.editPasswordPlaceLocation = function (id) {
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/change_place_password.html',
                    title: 'Actualiza tu Password actual para ingresar a la Sucursal',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var newPassword = $('#newPassword').val();
                                var confirmPassword = $('#confirmPassword').val();

                                if ($.trim(newPassword).length == 0 || $.trim(confirmPassword).length == 0) {
                                    alert('Tienes que agregar tu password')
                                    e.preventDefault();
                                    $ionicLoading.hide()
                                    return;
                                }

                                if ($.trim(newPassword) !== $.trim(confirmPassword)) {
                                    alert('Tu nuevo Password debe coincidir en el campo de confirmación');
                                    e.preventDefault();
                                    $ionicLoading.hide()
                                    return;
                                }

                                $.get(getServerPath(), {
                                    action: 'update_place_pass',
                                    new_pass: newPassword,
                                    place_location_id: id
                                }, function (r) {
                                    $ionicLoading.hide()
                                    console.log(r);
                                    var resp = $.trim(r)
                                    if (isNaN(resp)) {
                                        alert('Ha ocurrido un error de nuestro lado');
                                    } else {
                                        if (resp == "1") {
                                            alert('Se ha actualizado el password de tu cuenta.');
                                        } else {
                                            alert('Ha ocurrido un error o parece que tu contraseña actual no coincide, favor intenta nuevamente.');
                                        }
                                    }
                                })
                            }
                        }
                    ]
                });
            };
            $scope.editPolitics = function (id) {
                var places = $scope.stores;
                console.log('places: ' + JSON.stringify(places));
                console.log('stores: ' + JSON.stringify($scope.stores));
                var res = alasql('SELECT * FROM ? WHERE place_location_id = "' + id + '"', [places]);
                console.log('res: ' + JSON.stringify(res));
                console.log('home_order_terms: ' + res[0].home_order_terms);
                setTimeout(function () {
                    $('#politics').val(res[0].home_order_terms)
                    //console.log($('#tblmenuStatus' + id).text());
                }, 500)
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/change_politics.html',
                    title: 'Actualiza o agrega una politica a tu sucursal',
                    scope: $scope,
                    cssClass: 'popup-pin',
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });

                                var politics = $('#politics').val();


                                $.get(getServerPath(), {
                                    action: 'update_politics',
                                    home_order_terms: politics,
                                    place_location_id: id
                                }, function (r) {
                                    $ionicLoading.hide()
                                    var resp = $.trim(r)
                                    if (isNaN(resp)) {
                                        alert('Ha ocurrido un error de nuestro lado');
                                    } else {
                                        if (resp == "0") {
                                            alert('Ha ocurrido un error o parece que la entrada de datos no es correcta, favor intenta nuevamente.');
                                        } else {
                                            alert('Se ha actualizado las politicas del restaurante.');
                                            $scope.getStores();
                                        }
                                    }
                                })
                            }
                        }]
                });
            };
            $scope.turnOnTienda = function (id) {
                myPopup = $ionicPopup.show({
                    title: 'Estas seguro que deseas activar esta sucursal para ordenes a domicilio?',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });

                                $.get(getServerPath(), {
                                    action: 'turn_on_home_delivery',
                                    place_location_id: id
                                }, function (r) {
                                    $ionicLoading.hide()
                                    var resp = $.trim(r)
                                    if (isNaN(resp)) {
                                        alert('Ha ocurrido un error de nuestro lado');
                                    } else {
                                        if (resp == "0") {
                                            alert('Ha ocurrido un error o parece que la entrada de datos no es correcta, favor intenta nuevamente.');
                                        } else {
                                            alert('Se ha activado la sucursal.');
                                            $scope.getStores();
                                        }
                                    }
                                })
                            }
                        }]
                });
            };
            $scope.turnOffTienda = function (id) {
                myPopup = $ionicPopup.show({
                    title: 'Estas seguro que deseas desactivar esta sucursal para ordenes a domicilio?',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });

                                $.get(getServerPath(), {
                                    action: 'turn_off_home_delivery',
                                    place_location_id: id
                                }, function (r) {
                                    $ionicLoading.hide()
                                    var resp = $.trim(r)
                                    if (isNaN(resp)) {
                                        alert('Ha ocurrido un error de nuestro lado');
                                    } else {
                                        if (resp == "0") {
                                            alert('Ha ocurrido un error o parece que la entrada de datos no es correcta, favor intenta nuevamente.');
                                        } else {
                                            alert('Se ha desactivado la sucursal.');
                                            $scope.getStores();
                                        }
                                    }
                                })
                            }
                        }]
                });
            }
            $scope.turnOnPick = function (id) {
                myPopup = $ionicPopup.show({
                    title: 'Estas seguro que deseas activar esta sucursal para ordenes para llevar?',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });

                                $.get(getServerPath(), {
                                    action: 'turn_on_pick_delivery',
                                    place_location_id: id
                                }, function (r) {
                                    $ionicLoading.hide()
                                    var resp = $.trim(r)
                                    if (isNaN(resp)) {
                                        alert('Ha ocurrido un error de nuestro lado');
                                    } else {
                                        if (resp == "0") {
                                            alert('Ha ocurrido un error o parece que la entrada de datos no es correcta, favor intenta nuevamente.');
                                        } else {
                                            alert('Se ha activado la sucursal.');
                                            $scope.getStores();
                                        }
                                    }
                                })
                            }
                        }]
                });
            };
            $scope.turnOffPick = function (id) {
                myPopup = $ionicPopup.show({
                    title: 'Estas seguro que deseas desactivar esta sucursal para ordenes para llevar?',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });

                                $.get(getServerPath(), {
                                    action: 'turn_off_pick_delivery',
                                    place_location_id: id
                                }, function (r) {
                                    $ionicLoading.hide()
                                    var resp = $.trim(r)
                                    if (isNaN(resp)) {
                                        alert('Ha ocurrido un error de nuestro lado');
                                    } else {
                                        if (resp == "0") {
                                            alert('Ha ocurrido un error o parece que la entrada de datos no es correcta, favor intenta nuevamente.');
                                        } else {
                                            alert('Se ha desactivado la sucursal.');
                                            $scope.getStores();
                                        }
                                    }
                                })
                            }
                        }]
                });
            }
        })
        .controller('imagesCtrl', function ($scope, $state, APPCache, $ionicPopup, $ionicLoading) {
            checkKey(key);
            validateScope($scope);
            $scope.getImages = function () {
                $('#loadingImages').show('slow')
                $('#contentImages').hide('slow')
                $.getJSON(getServerPath(), {
                    menu_id: sessionStorage.getItem('menuId'),
                    action: 'select_images'
                }, function (json) {
                    $('#loadingImages').hide('slow')
                    $('#contentImages').show('slow')
                    console.log(json);
                    $scope.images = json;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$apply();
                })
            }
            $scope.addImage = function () {
                var MAX_SIZE = PLATE_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_image.html',
                    title: 'Inserte Una Imagen',
                    subTitle: 'Seleccion una nueva imagen.<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Save</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";
                                var label = $('#label').val();

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                var form_data = new FormData();
                                form_data.append('action', 'insert_images');
                                form_data.append('img', new_image);
                                form_data.append('mylabel', label);
                                form_data.append('menu_id', sessionStorage.getItem('menuId'))
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            $scope.getImages();
                                            $ionicLoading.hide()
                                            alert('Registrado Correctamente');
                                        } else {
                                            alert(data);
                                            $ionicLoading.hide()
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            };

            $scope.deleteImage = function (id) {
                $ionicLoading.show({
                    templateUrl: 'dialogs/loader.html',
                });
                $.get(getServerPath(), {
                    action: 'delete_images',
                    image_id: id
                }, function (data) {
                    var d = $.trim(data);
                    if (d == '1') {
                        $ionicLoading.hide();
                        $scope.getImages();
                        alert('Eliminado');
                    } else {
                        $ionicLoading.hide();
                        alert(data);
                    }
                })
            }
        })
        .controller('registerCtrl', function ($scope, $state, APPCache) {
            $scope.register = function () {
                var admin_id = $('#admin_id').val();
                var pass = $('#pass').val();
                var con_pass = $('#con_pass').val();
                var first_name = $('#first_name').val();
                var last_name = $('#last_name').val();
                if (con_pass == pass) {
                    if (validateEmail(admin_id) == true) {
                        if ($.trim(pass).length != 0) {
                            if ($.trim(first_name).length != 0) {
                                if ($.trim(last_name).length != 0) {
                                    $.get(getServerPath(), {
                                        action: 'insert_Admin',
                                        admin_id: admin_id,
                                        pass: pass,
                                        first_name: first_name,
                                        last_name: last_name
                                    }, function (resp) {
                                        var resp = $.trim(resp);
                                        switch (resp) {
                                            case '1':
                                                alert('Succesfully Registeres you have 4 tables availables to purchase a larger package visit the store when you log in. Welcome to Ferby!');
                                                sessionStorage.setItem('admin_id', admin_id)
                                                $state.go('place');
                                                break;
                                            case '2':
                                                alert('This user is already taken please try another one');
                                                break;
                                            default:
                                                alert('Sorry something went wrong ' + resp + ' A ticket has been sent to customer support');
                                                break
                                        }
                                    });
                                } else {
                                    alert('Please fill up your last name')
                                }
                            } else {
                                alert('Please fill up your first name.');
                            }
                        } else {
                            alert('Please fill up a password');
                        }
                    } else {
                        alert('Not a valid email form.');
                    }
                } else {
                    alert('Password do not match.');
                }
            }
        })
        .controller('promosCtrl', function ($scope, $state, $ionicPopup, APPCache, $rootScope, $ionicLoading) {
            checkKey(key);
            validateScope($scope);
            $scope.push = {};
            $rootScope.$on("getPromos", function () {
                $scope.getPromos();
            });
            $scope.getPromos = function () {
                $('#loadingPromos').show('slow')
                $('#contentPromos').hide('slow')
                $.getJSON(getServerPath(), {
                    action: "selectAllPromo",
                    place_id: sessionStorage.getItem('place_id')
                }, function (json) {
                    $('#loadingPromos').hide('slow')
                    $('#contentPromos').show('slow')
                    $scope.place_id = json;
                    $scope.$apply();
                    $scope.$broadcast('scroll.refreshComplete');
                })
            }

            $scope.goToCuponEvent = function () {
                $.ajax({
                    url: getServerPath() + '?action=next_cupon_code&place_id='+sessionStorage.place_id,
                    dataType: 'json',
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'get',
                    success: function (res) {
                        localStorage.next_cupon_code = res;
                    }
                });
                $state.go('app.events')
            };

            $scope.goToCuponCode = function () {
                $.ajax({
                    url: getServerPath() + '?action=next_cupon_code&place_id='+sessionStorage.place_id,
                    dataType: 'json',
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'get',
                    success: function (res) {
                        localStorage.next_cupon_code = res;
                    }
                });
                $state.go('app.cupon_code')
            };

            

            $scope.insertPromo = function () {
                var MAX_SIZE = PLATE_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_promo.html',
                    title: 'Insertar Promo',
                    subTitle: 'Agrega los campos de la promo.<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Save</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var promoImage = $.trim($('#promoImage').val()).length != 0 ? $('#promoImage').prop('files')[0] : " ";
                                var promoTitle = $('#promoTitle').val();
                                var promoDesc = $('#promoDesc').val();
                                var promoType = $('#promoType').val();

                                var IMAGE_SIZE = promoImage.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                var form_data = new FormData();
                                console.log(promoImage);
                                form_data.append('action', 'insert_promo');
                                form_data.append('img', promoImage);
                                form_data.append('title', promoTitle);
                                form_data.append('description', promoDesc);
                                form_data.append('type', promoType);
                                form_data.append('place_id', sessionStorage.getItem('place_id'));
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (d) {
                                        var data = $.trim(d);
                                        if (data == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getPromos();
                                            $ionicLoading.hide();
                                        } else {
                                            $ionicLoading.hide();
                                            console.log(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.pushNotification = function () {
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_push.html',
                    title: 'Lanzar Push Notification',
                    subTitle: 'Agrega los campos de la notificacion push.<br>*Se recomienda un titulo y mensaje corto menor a 100 caracteres',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Save</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });

                                //console.log('ws: '+getServerPath()+"action=push_place_tokens&place_id="+sessionStorage.place_id+"&title="+$scope.push.title+"&body="+$scope.push.body);

                                $.get(getServerPath(), {
                                    action: 'push_place_tokens',
                                    place_id: sessionStorage.getItem('place_id'),
                                    title: $scope.push.title,
                                    body: $scope.push.body,
                                    cType: $("#cType").val()
                                }, function (r) {
                                    $ionicLoading.hide()
                                    if(r==9)
                                    {
                                        alert('Ha ocurrido un error al enviar las notificaciones push');
                                        $scope.getPromos();
                                        $ionicLoading.hide(); 
                                        return;
                                    }

                                    alert('Notificaciones enviadas! (Recuerda que las notificaciones pueden estar en cola cuando tienes muchos usuarios en tu App, el tiempo depende de cantidad y respuesta de servidores GooglePush)');
                                    $scope.getPromos();
                                    $ionicLoading.hide(); 
                                });
                                
                            }
                        }
                    ]
                });
            }

            $scope.deletePromo = function (id) {
                myPopup = $ionicPopup.show({
                    template: 'Estas seguro que deseas eliminar la promocion de {{promotit}} ?',
                    title: 'Eliminar promo',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Save</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var form_data = new FormData();
                                form_data.append('action', 'delete_promo');
                                form_data.append('promo_id', id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (d) {
                                        $ionicLoading.hide()
                                        var data = $.trim(d);
                                        if (data == '1') {
                                            alert('Deleted Succesfully');
                                            $scope.getPromos();
                                        } else {
                                            console.log(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
                setTimeout(function () {
                    $scope.promotit = $('#tblTitle' + id).text()
                }, 500)
            }

            $scope.updatePromo = function (id) {
                var MAX_SIZE = PLATE_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_promo.html',
                    title: 'Editar Promo',
                    subTitle: 'Edita los campos de la promo.<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Save</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var promoImage = $.trim($('#promoImage').val()).length != 0 ? $('#promoImage').prop('files')[0] : " ";
                                var promoTitle = $('#promoTitle').val();
                                var promoDesc = $('#promoDesc').val();
                                var promoType = $('#promoType').val();

                                var IMAGE_SIZE = promoImage.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                var form_data = new FormData();
                                console.log(promoImage);
                                form_data.append('action', 'update_promo');
                                form_data.append('promo_id', id);
                                form_data.append('img', promoImage);
                                form_data.append('title', promoTitle);
                                form_data.append('description', promoDesc);
                                form_data.append('type', promoType);
                                form_data.append('place_id', sessionStorage.getItem('place_id'));
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (d) {
                                        $ionicLoading.hide();
                                        var data = $.trim(d);
                                        if (data == '1') {
                                            alert('Succesfully Updated');
                                            $scope.getPromos();
                                        } else {
                                            console.log(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
                setTimeout(function () {
                    $('#promoTitle').val($('#tblTitle' + id).text())
                    $('#promoDesc').val($('#tblDesc' + id).text())
                    $('#promoType').val($('#tblType' + id).text())
                }, 500)
            }
        })
        .controller('reportsCtrl', function ($scope, $state, $ionicPopup, APPCache, $rootScope, $ionicLoading) {
            validateScope($scope);
            checkKey(key);

           $scope.cupon_redeems_report = function(){
                $.getJSON(getServerPath(), {
                    place_id: sessionStorage.getItem('place_id'),
                    action: 'cupon_redeems_report'
                }, function (json) {
                   buildData(json,"RedencionDeCupones")
                })
            }

            $scope.reporteDeVentas = function(){
                $.getJSON(getServerPath(), {
                    place_id: sessionStorage.getItem('place_id'),
                    action: 'reporte_de_ventas'
                }, function (json) {
                   buildData(json,"ReporteDeVentas")
                })
            }
           $scope.pointsTransactions = function(){
                $.getJSON(getServerPath(), {
                    place_id: sessionStorage.getItem('place_id'),
                    action: 'pointsTransactions'
                }, function (json) {
                   buildData(json,"TransaccionesDePuntos")
                })
            }
            $scope.checkInsTransactions = function(){
                 $.getJSON(getServerPath(), {
                    place_id: sessionStorage.getItem('place_id'),
                    action: 'checkInsTransactions'
                }, function (json) {
                   buildData(json,"checkInsTransactions")
                })
            }

            $scope.goToWhatsAppClicksReport = function(){
                $state.go('app.whatsapp-clicks-report');
            }
        })
        .controller('whatsappClicksReportCtrl', function($scope, $state, $rootScope, $ionicLoading, $ionicHistory){
            checkKey(key);
            sessionStorage.base_path = baseUrl();

            $scope.nameApp = sessionStorage.nameApp;
            $scope.basePath = baseUrl();


            $scope.initWhatsappClicksReport = function () {
                $('#loadingMenu').show('slow')
                $('#contentMenu').hide('slow')

                $.getJSON(getServerPath(), {
                    action: "view_whatsapp_clicks",
                    place_id: sessionStorage.getItem('place_id')
                }, function (json) {
                    $('#loadingMenu').hide('slow')
                    $('#contentMenu').show('slow')
                    $scope.menu = json;
                    $scope.$apply();
                    //$scope.dtInstance.rerender(); 
                })
            }

            $scope.exportarWhatsAppClicks = function(){
                buildData($scope.menu,"reporteClicksCotizacionesWhatsapp")
            }
        })
        .controller('optionsCtrl', function ($scope, $state, $ionicPopup, APPCache, $ionicLoading) {
            checkKey(key);
            validateScope($scope);
            $scope.option = { option_stock: 0 , option_price: 0, option_conversion: ""};
            $scope.type = { show: 0 , text: "0" , number: "0" };
            $scope.place = JSON.parse(localStorage.place);
            var oFileIn, typeSelected;
            $(function () {
                oFileIn = document.getElementById('my_file_input');
                if (oFileIn.addEventListener) {
                    oFileIn.addEventListener('change', filePicked, false);
                }
            });

            $scope.set_params = function (option) {
                $scope.object = {};
                $scope.optionSelected = option;

                var template = "";

                Object.keys(option.params).forEach(function(key,index) {
                    template += '<p>Parámetro '+(index+1)+'</p>'
                    template += '<input type="text" ng-model="optionSelected.params.param'+(index+1)+'" ng-value="optionSelected.params.param'+(index+1)+'" autofocus>'
                });

                $scope.object.params = option.params;
                $scope.object.cod_option = option.cod_option;

                myPopup = $ionicPopup.show({
                    template: template,
                    title: 'Editar '+option.option_name,
                    subTitle: 'Actualizar los parámetros de la opción',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html'});
                                return $scope.object;
                            }
                        }
                    ]
                });
              
                myPopup.then(function(res){                    
                    $.get(getServerPath(), {
                        action: 'set_option_param',
                        cod_option: res.cod_option,
                        option_param: JSON.stringify(res.params)
                    }, function (r) {
                        $ionicLoading.hide()
                        if(r==1)
                        {
                            alert('Parámetros actualizados correctamente');
                            $scope.getOptions();
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                    });
                });
            };

            $scope.optionChange = function(type){
                let type_code = $('#optionGroup').val()
                typeSelected = $scope.types.find(f => f.type_code == type_code);
                $scope.type.show = 1;
                $scope.option.option_price = 0;

                if(typeSelected.type_text == "0"){
                    $('#locationParam').hide();
                    $('#textParam').hide();
                    $('#numberParam').show();
                }else{
                    $('#textParam').show();
                    $('#numberParam').hide();
                    $('#locationParam').hide();
                    if(typeSelected.type_category == "MAPAS"){
                        $('#textParam').hide();
                        $('#numberParam').hide();
                        $('#locationParam').show();
                    }
                }

            }


            $scope.getTypes = function () {
                
                $.getJSON(getServerPath(), {
                    action: 'get_types'
                }, function (json) {
                    $scope.types = json;
                    $scope.$apply();
                })
            }


            $scope.add_option = function() {
            var MAX_SIZE = LOGO_MAX_SIZE;
            myPopup = $ionicPopup.show({
                templateUrl: 'dialogs/add_options.html',
                title: 'Inserte una nueva opcion',
                scope: $scope,
                buttons: [
                    {text: 'Cancelar'},
                    {
                        text: '<b>Insertar</b>',
                        type: 'button-stable',
                        onTap: function () {
                            $ionicLoading.show({
                                templateUrl: 'dialogs/loader.html',
                            });
                            var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                            var IMAGE_SIZE = new_image.size;
                            if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                $ionicLoading.hide()
                                return;
                            }

                            console.log('size image: ' + new_image.size);
                            $scope.option.group = $('#optionGroup').val()
                            
                            if(typeSelected.type_category == "MAPAS"){
                                $scope.params = {
                                    param1: $scope.option.lat,
                                    param2: $scope.option.lon
                                };
                            }else{
                                $scope.params = { param1: $scope.option.option_param };
                            }

                            var form_data = new FormData();
                            form_data.append('action', 'add_option');
                            form_data.append('img', new_image);
                            form_data.append('option_name', $scope.option.option_name);
                            form_data.append('option_price', $scope.option.option_price);
                            form_data.append('option_param', JSON.stringify($scope.params));
                            form_data.append('menu_id', sessionStorage.idMenu);
                            form_data.append('group', $scope.option.group);
                            form_data.append('option_stock', $scope.option.option_stock);
                            $.ajax({
                                url: getServerPath(),
                                dataType: 'text',
                                cache: false,
                                contentType: false,
                                processData: false,
                                data: form_data,
                                type: 'post',
                                success: function (data) {
                                    $ionicLoading.hide()
                                    console.log(data);
                                    var d = $.trim(data);
                                    if (d == '1') {
                                        $scope.getOptions();
                                        $ionicLoading.hide()
                                        alert('Registrado Correctamente');
                                    } else {
                                        console.log(data);
                                        $scope.getOptions();
                                        $ionicLoading.hide()
                                    }

                                    $scope.type = { show: 0 , text: "0" , number: "0" };
                                    $('#textParam').hide();
                                    $('#numberParam').hide();
                                }
                            });
                        }
                    }
                ]
            });
        }


            function filePicked(oEvent) {
                // Get The File From The Input
                var oFile = oEvent.target.files[0];
                var sFilename = oFile.name;
                // Create A File Reader HTML5
                var reader = new FileReader();

                // Ready The Event For When A File Gets Selected
                reader.onload = function (e) {
                    var data = e.target.result;
                    var cfb = XLS.CFB.read(data, {type: 'binary'});
                    var wb = XLS.parse_xlscfb(cfb);
                    // Loop Over Each Sheet
                    wb.SheetNames.forEach(function (sheetName) {
                        // Obtain The Current Row As CSV
                        var sCSV = XLS.utils.make_csv(wb.Sheets[sheetName]);
                        var oJS = XLS.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);

                        $("#my_file_output").html(sCSV);
                        console.log(oJS)
                        console.log(JSON.stringify(oJS))
                    });
                };

                // Tell JS To Start Reading The File.. You could delay this if desired
                reader.readAsBinaryString(oFile);
            }

            $scope.getOptions = function () {
                $('#loadingOption').show('slow')
                $('#contentOption').hide('slow')
                $.getJSON(getServerPath(), {
                    id_menu: sessionStorage.getItem('idMenu'),
                    action: 'select_option'
                }, function (json) {
                    $('#loadingOption').hide('slow')
                    $('#contentOption').show('slow')
                    console.log(json);
                    $scope.options = json;
                    for(var key in $scope.options){
                        var param = JSON.parse($scope.options[key].option_param);
                        $scope.options[key].params = param;
                    }
                    console.log('options: '+JSON.stringify($scope.options));
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$apply();
                })

                $scope.getTypes();
            }

            $scope.deleteOptions = function () {
                $('#loadingOption').show('slow')
                $('#contentOption').hide('slow')
                $.getJSON(getServerPath(), {
                    action: 'delete_options',
                    id_menu: sessionStorage.getItem('idMenu')
                }, function (json) {
                    $('#loadingOption').hide('slow')
                    $('#contentOption').show('slow')
                    console.log(json);
                    $scope.options = json;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$apply();
                })
            }

            $scope.deleteMenuOptions = function () {
                myPopup = $ionicPopup.show({
                    title: 'Eliminar todas las opciones',
                    subTitle: 'Estas seguro que deseas eliminar permanentemente todas las opciones de este Menú?',
                    scope: $scope,
                    buttons: [
                        {text: 'No'},
                        {
                            text: '<b>Si</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $('#loadingOption').show('slow')
                                $('#contentOption').hide('slow')
                                $.getJSON(getServerPath(), {
                                    action: 'delete_menu_options',
                                    menu_id: sessionStorage.getItem('idMenu')
                                }, function (response) {
                                    $('#loadingOption').hide('slow')
                                    $('#contentOption').show('slow')
                                    console.log('response: ' + response);
                                    if (response == 1)
                                        alert('Opciones eliminadas correctamente.');
                                    $scope.$broadcast('scroll.refreshComplete');
                                    $scope.getOptions();
                                    $scope.$apply();

                                })
                            }
                        }
                    ]
                });


            }

            $scope.loadExcel = function () {
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_excel.html',
                    title: 'Cargar Archivo Excel',
                    scope: $scope,
                    buttons: [
                        {text: 'No'},
                        {
                            text: '<b>Yes</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                var group = $('#optionGroup').val();
                                var fl = $.trim($('#my_file_input').val()).length != 0 ? $('#my_file_input').prop('files')[0] : " ";


                                var exceljson = filePicked(fl);
                                function filePicked(oFile) {
                                    var sFilename = oFile.name;
                                    // Create A File Reader HTML5
                                    var reader = new FileReader();

                                    // Ready The Event For When A File Gets Selected
                                    reader.onload = function (e) {
                                        var data = e.target.result;
                                        var cfb = XLS.CFB.read(data, {type: 'binary'});
                                        var wb = XLS.parse_xlscfb(cfb);
                                        // Loop Over Each Sheet
                                        wb.SheetNames.forEach(function (sheetName) {
                                            // Obtain The Current Row As CSV
                                            //var sCSV = XLS.utils.make_csv(wb.Sheets[sheetName]);
                                            var oJS = XLS.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);

                                            //$("#my_file_output").html(sCSV);
                                            console.log(oJS)
                                            //alert(JSON.stringify(oJS))
                                            $.get(getServerPath(), {
                                                action: 'insert_excel',
                                                excel: JSON.stringify(oJS),
                                                menu_id: sessionStorage.getItem('idMenu'),
                                                group: group
                                            }, function (resp) {
                                                var resp = $.trim(resp);
                                                console.log(resp)
                                                switch (resp) {
                                                    case '1':
                                                        alert('Registrado Correctamente')
                                                        $scope.getOptions();
                                                        break;
                                                    default:
                                                        alert('Si no se han cargado los datos favor consulta con el administrador.');
                                                        break;
                                                }
                                            })

                                        });
                                    };

                                    // Tell JS To Start Reading The File.. You could delay this if desired
                                    reader.readAsBinaryString(oFile);
                                }

                                //console.log('excel json: '+JSON.stringify(exceljson));

                            }
                        }
                    ]
                });
            };
            $scope.downloadExample = function () {
                alert('Se ha descargado una plantilla de ejemplo en tus descargas para que puedas subir fácilmente tus opciones, favor no alterar ni usar otro archivo.')
            }
            $scope.updateOptions = function (id) {
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_option.html',
                    title: 'Editar Opcion',
                    scope: $scope,
                    buttons: [
                        {text: 'No'},
                        {
                            text: '<b>Yes</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                var group = $('#optionGroup').val()
                                var name = $('#optionName').val()
                                var price = $('#optionPrice').val()
                                var inventory = $('#inventory').val()
                                var optionConv = "";
                                $.get(getServerPath(), {
                                    action: 'update_option',
                                    optionId: id,
                                    name: name,
                                    group: group,
                                    price: price,
                                    inventory: inventory,
                                    optionConv: optionConv
                                }, function (resp) {
                                    var resp = $.trim(resp);
                                    switch (resp) {
                                        case '1':
                                            alert('Updated registered')
                                            $scope.getOptions();
                                            break;
                                        default:
                                            alert(resp);
                                            break;
                                    }
                                })
                            }
                        }
                    ]
                });
                setTimeout(function () {
                    $('#optionName').val($('#optionName' + id).text())
                    $('#optionPrice').val($('#optionPrice' + id).text())
                    $('#optionGroup').val($('#optionGroup' + id).text())
                    $('#inventory').val($('#optionStock' + id).text())
                    console.log('option price: ' + $('#optionPrice').val($('#optionPrice' + id).text()))
                }, 500)
            }
            $scope.insertOptions = function () {
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_option.html',
                    title: 'Nueva Opcion',
                    scope: $scope,
                    buttons: [
                        {text: 'No'},
                        {
                            text: '<b>Yes</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                var name = $('#optionName').val()
                                var price = $('#optionPrice').val()
                                var group = $('#optionGroup').val()
                                var inventory = $('#inventory').val()
                                var optionConv = ""
                                $.get(getServerPath(), {
                                    action: 'insert_option',
                                    menu_id: sessionStorage.getItem('idMenu'),
                                    name: name,
                                    group: group,
                                    price: price,
                                    inventory: inventory,
                                    optionConv: optionConv
                                }, function (resp) {
                                    var resp = $.trim(resp);
                                    switch (resp) {
                                        case '1':
                                            alert('Registrado Correctamente')
                                            $scope.getOptions();
                                            break;
                                        default:
                                            alert(resp);
                                            break;
                                    }
                                })
                            }
                        }
                    ]
                });
            }
            $scope.deleteOptions = function (id) {
                $.get(getServerPath(), {
                    optionId: id,
                    action: 'delete_option'
                }, function (resp) {
                    var resp = $.trim(resp);
                    switch (resp) {
                        case '1':
                            alert('Registrado Correctamente')
                            $scope.getOptions();
                            break;
                        default:
                            alert(resp);
                            break;
                    }
                })
            }
        })
        .controller('newPlaceCtrl', function ($scope, $state, APPCache, $ionicLoading) {
            checkKey(key);
            var action = '';
            var place_id_location = '';
            var succMessage = '';
            $scope.initialize = function () {
                var lat, lon, zoom;
                if (sessionStorage.getItem('place_option') == 'insert') {
                    action = 'insert_Place_Locations';
                    succMessage = 'Succesfully inserted'
                    lat = 1.1;
                    lon = 1.1;
                    zoom = 2;
                    $('#min').val('0');
                    $scope.btnMes = 'Add Place';
                } else {
                    action = 'update_Place_Locations';
                    succMessage = 'Succesfully saved'
                    place_id_location = sessionStorage.getItem('place_id_location');
                    $('#name').val(sessionStorage.getItem('placeName'));
                    $('#city').val(sessionStorage.getItem('placeCity'));
                    $('#lat').val(sessionStorage.getItem('placeLat'));
                    $('#lng').val(sessionStorage.getItem('placeLon'));
                    $('#min').val(sessionStorage.getItem('min'));
                    lat = sessionStorage.getItem('placeLat');
                    lon = sessionStorage.getItem('placeLon');
                    zoom = 16;
                    $scope.btnMes = 'Edit Place';
                }
                var e = new google.maps.LatLng(lat, lon), t = {zoom: zoom, center: e, panControl: !0, scrollwheel: !1, scaleControl: !0, overviewMapControl: !0, overviewMapControlOptions: {opened: !0}, mapTypeId: google.maps.MapTypeId.HYBRID};
                map = new google.maps.Map(document.getElementById("map"), t), geocoder = new google.maps.Geocoder, marker = new google.maps.Marker({position: e, map: map}), map.streetViewControl = !1, infowindow = new google.maps.InfoWindow({content: "(1.10, 1.10)"}), google.maps.event.addListener(map, "click", function (e) {
                    marker.setPosition(e.latLng);
                    var t = e.latLng, o = "(" + t.lat().toFixed(6) + ", " + t.lng().toFixed(6) + ")";
                    infowindow.setContent(o), document.getElementById("lat").value = t.lat().toFixed(6), document.getElementById("lng").value = t.lng().toFixed(6), document.getElementById("latlngspan").innerHTML = o, document.getElementById("coordinatesurl").value = "http://www.latlong.net/c/?lat=" + t.lat().toFixed(6) + "&long=" + t.lng().toFixed(6), document.getElementById("coordinateslink").innerHTML = '&lt;a href="http://www.latlong.net/c/?lat=' + t.lat().toFixed(6) + "&amp;long=" + t.lng().toFixed(6) + '" target="_blank"&gt;(' + t.lat().toFixed(6) + ", " + t.lng().toFixed(6) + ")&lt;/a&gt;", dec2dms()
                }), google.maps.event.addListener(map, "mousemove", function (e) {
                    var t = e.latLng;
                    document.getElementById("mlat").innerHTML = "(" + t.lat().toFixed(6) + ", " + t.lng().toFixed(6) + ")"
                })
            }
            $scope.insert_place = function () {
                
                var name = $('#name').val();
                var city = $('#city').val();
                var lat = $('#lat').val();
                var lon = $('#lng').val();
                var min = $('#min').val();
                var place_id = sessionStorage.getItem('place_id')
                if ($.trim(city) == 0) {
                    alert('Please Fill a City');
                    return;
                }

                $ionicLoading.show({
                    templateUrl: 'dialogs/loader.html',
                });

                if ($.trim(name) != 0) {
                    if ($.trim(lat) != 0) {
                        $.get(getServerPath(), {
                            action: action,
                            name: name,
                            city: city,
                            lat: lat,
                            lon: lon,
                            place_location_id: place_id_location,
                            place_id: place_id,
                            min: min
                        }, function (resp) {
                            var resp = $.trim(resp);
                            $ionicLoading.hide()
                            switch (resp) {
                                case '1':
                                    alert(succMessage);
                                    break;
                                default:
                                    alert(resp)
                                    break;
                            }
                        });
                    } else {
                        alert('Please fill up a Latitud and Langitud clicking on the restaurant location on the map');
                    }
                } else {
                    alert('Please Fill a Name');
                }

            }
        })
        .controller('waiterCtrl', function ($scope, $state, $ionicPopup, APPCache) {
            checkKey(key);
            validateScope($scope);
            $scope.loadWaiters = function () {
                $.getJSON(getServerPath(), {
                    action: 'select_Waiter',
                    place_id: sessionStorage.getItem('place_id'),
                }, function (json) {
                    $scope.waiter = json;
                })
            };

            $scope.restorePass = function (id) {
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/restore_pass_waiter.html',
                    title: 'Nuevo Lugar',
                    subTitle: 'Agrega el nombre de tu restaurante',
                    scope: $scope,
                    buttons: [
                        {text: 'No'},
                        {
                            text: '<b>Yes</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $.get(getServerPath(), {
                                    action: 'reset_waiter_pass',
                                    waiter_id: id,
                                }, function (resp) {
                                    var resp = $.trim(resp);
                                    switch (resp) {
                                        case '1':
                                            alert('Succesfully restored password to ferby of ' + id)
                                            break;
                                        default:
                                            alert(resp);
                                            break;
                                    }
                                })
                            }
                        }
                    ]
                });
            };
            $scope.updateWaiter = function (id) {
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/update_waiter.html',
                    title: 'Nuevo Lugar',
                    subTitle: 'Agrega el nombre de tu restaurante',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Save</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                var waiterFirst_Name = $('#uwaiterFirst_Name').val();
                                var waiterLast_Name = $('#uwaiterLast_Name').val();
                                var waiterPhone_Num = $('#uwaiterPhone_Num').val();
                                if ($.trim(waiterFirst_Name).length != 0) {
                                    if ($.trim(waiterLast_Name).length != 0) {
                                        $.get(getServerPath(), {
                                            action: 'update_Waiter',
                                            waiter_id: id,
                                            first_name: waiterFirst_Name,
                                            last_name: waiterLast_Name,
                                            number: waiterPhone_Num,
                                            place_id: sessionStorage.getItem('place_id')
                                        }, function (resp) {
                                            var resp = $.trim(resp);
                                            switch (resp) {
                                                case '1':
                                                    alert('Succesfully Updated');
                                                    $scope.loadWaiters();
                                                    break;
                                                default:
                                                    alert(resp);
                                                    break;
                                            }
                                        });
                                    } else {
                                        alert('Please fill up the waiter last name');
                                        e.preventDefault();
                                    }
                                } else {
                                    alert('Please fill up the waiter first name');
                                    e.preventDefault();
                                }
                            }
                        }
                    ]
                });
                $('#waiterFirst_Name').val($('#wfist_name' + id).text());
                $('#waiterLast_Name').val($('#wlast_name' + id).text());
                $('#waiterPhone_Num').val($('#wnumber' + id).text());
            }
            $scope.newWaiter = function () {
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_waiter.html',
                    title: 'Nuevo Lugar',
                    subTitle: 'Agrega el nombre de tu restaurante',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Save</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                var waiterEmail = $('#waiterEmail').val();
                                var waiterFirst_Name = $('#waiterFirst_Name').val();
                                var waiterLast_Name = $('#waiterLast_Name').val();
                                var waiterPhone_Num = $('#waiterPhone_Num').val();
                                if ($.trim(waiterEmail).length != 0) {
                                    if (validateEmail(waiterEmail) == true) {
                                        if ($.trim(waiterFirst_Name).length != 0) {
                                            if ($.trim(waiterLast_Name).length != 0) {
                                                $.get(getServerPath(), {
                                                    action: 'insert_Waiter',
                                                    waiter_id: waiterEmail,
                                                    first_name: waiterFirst_Name,
                                                    last_name: waiterLast_Name,
                                                    number: waiterPhone_Num,
                                                    place_id: sessionStorage.getItem('place_id')
                                                }, function (resp) {
                                                    var resp = $.trim(resp);
                                                    switch (resp) {
                                                        case '1':
                                                            alert('Registrado Correctamente');
                                                            $scope.loadWaiters();
                                                            break;
                                                        default:
                                                            alert(resp);
                                                            break;
                                                    }
                                                });
                                            } else {
                                                alert('Please fill up the waiter last name');
                                                e.preventDefault();
                                            }
                                        } else {
                                            alert('Please fill up the waiter first name');
                                            e.preventDefault();
                                        }
                                    } else {
                                        alert('Edit the waiter mail, it is not a valid email format.');
                                        e.preventDefault();
                                    }
                                } else {
                                    alert('Please fill up the waiter email');
                                    e.preventDefault();
                                }
                            }
                        }
                    ]
                });
            }
        })
        .controller('subsCtrl', function ($scope, $state) {
            $scope.goToPush = function () {
                console.log('GO TO PUSH')
                $state.go('app.push');
            }
            $scope.goToMail = function () {
                $state.go('app.mail');
            }
        })
        .controller('pushCtrl', function ($scope, $state, $ionicLoading) {
            $scope.sendNotifications = function () {
                console.log('entro a sendnotification')
                $ionicLoading.show({
                    templateUrl: 'dialogs/loader.html',
                });
                var message = $('#message').val();
                $.get(getServerPath(), {
                    action: 'massive_notifications_place',
                    place_id: sessionStorage.getItem('place_id'),
                    message: message
                }, function (r) {
                    console.log('message: ' + message);
                    alert('Se ha enviado las notificaciones a sus suscriptores.')
                    $ionicLoading.hide()
                }
                );
            };
        })
        .controller('mailCtrl', function ($scope, $state) {
            checkKey(key);
            $scope.sendEmails = function () {
                console.log('entro a sendEmails')
                var logo = sessionStorage.getItem('logoUrl');
                var mailImage = $.trim($('#mailImage').val()).length != 0 ? $('#mailImage').prop('files')[0] : " ";
                var message = $('#message').val();
                var emailTitle = $('#emailTitle').val();
                if ($.trim(message).length != 0) {
                    if ($.trim(emailTitle).length != 0) {
                        var form_data = new FormData();
                        form_data.append('action', 'massive_emails_place');
                        form_data.append('place_id', sessionStorage.getItem('place_id'));
                        form_data.append('subject', emailTitle);
                        form_data.append('message', message);
                        form_data.append('img', mailImage);
                        form_data.append('logo', logo);
                        $.ajax({
                            url: getServerPath(),
                            dataType: 'text',
                            cache: false,
                            contentType: false,
                            processData: false,
                            data: form_data,
                            type: 'post',
                            success: function (d) {
                                console.log('REPLY: ' + d);
                            }
                        });
                    } else {
                        alert('Debes Llenar el campo de Titulo')
                    }
                } else {
                    alert('Debes Llenar el campo de mensaje')
                }
            };

        })
        .controller('qrPrintCtrl', function ($scope, $state, $ionicHistory) {

            $scope.startCreate = function () {
                alert('start')
                $('#qrcode').find('img').remove()
                var qrcode = new QRCode(document.getElementById("qrcode"), {
                    text: localStorage.getItem('idProd'),
                    width: 150,
                    height: 150,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });

                setTimeout(function () {
                    capture(localStorage.getItem('idProd'))
                }, 500)
            }
            function capture(txt) {
                html2canvas($("#cap").find('img'), {
                    onrendered: function (canvas) {
                        var myImage = canvas.toDataURL("image/png");
                        var a = document.createElement('a');
                        a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
                        a.download = txt + '.jpg';
                        a.click();
                    }
                });
            }
        })
        .controller('qrCtrl', function ($scope, $state, $ionicHistory) {
            checkKey(key);
            $('#tableName').text(sessionStorage.getItem('deskName'));
            $('#storeName').text(sessionStorage.getItem('store_name') + '  ');
            console.log('#storeName ' + sessionStorage.getItem('store_name'));
            console.log('sessionStorage')
            $scope.makeQr = function () {
                console.log('QR')
                var id = sessionStorage.getItem('idDesk')
                var name = sessionStorage.getItem('deskName')
                console.log(name)
                console.log(id)
                setTimeout(function () {
                    generate(id, name)
                }, 500)
            }
            $scope.gotoBack = function () {
                if (sessionStorage.getItem('deskMode') == 'res') {
                    $state.go('tab.desk');
                } else {
                    $state.go('app.desk');
                }
            }
            function generate(id, name) {
                var size = $('#size').val()
                console.log($.trim(size).length);
                if ($.trim(size).length == 0) {
                    console.log('LN is 0')
                    startCreate(250, id, name)
                } else {
                    if (isNaN(size)) {
                        alert("No es un numero")
                    } else {
                        console.log('LN is not nan and valid size')
                        startCreate(size, id, name)
                    }
                }
            }

            function startCreate(sz, id, name) {
                console.log(sz)
                console.log(id)
                console.log(name)
                $('#qrcode').find('img').remove()
                var qrcode = new QRCode(document.getElementById("qrcode"), {
                    text: id,
                    width: 150,
                    height: 150,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });

                setTimeout(function () {
                    capture(name)
                }, 500)
            }

            function capture(txt) {
                html2canvas($("#cap"), {
                    onrendered: function (canvas) {
                        var myImage = canvas.toDataURL("image/png");
                        var a = document.createElement('a');
                        a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
                        a.download = txt + '.jpg';
                        a.click();
                    }
                });
            }
        })
        .controller('domiciliosCtrl', function ($scope, $state, $rootScope, $ionicHistory) {
            checkKey(key);
            buttons = 1;
            clearInterval(idleInterval);
            var idleTime = 0;
            idleInterval = setInterval(function () {
                timerIncrement()
            }, 1000); // 1 minute
            $scope.inicio = function () {
                $scope.getPlace();
                $.getJSON(getServerPath(), {
                    action: 'getOtherPlaces',
                    place_loc_id: sessionStorage.getItem('store_id')
                }, function (json) {
                    otherDom = json
                })
                console.log('inicio')
                $('#loadingDom').show('slow')
                $('#contentDom').hide('slow')
                $.getJSON(getServerPath(), {action: "selectDomicilio", place_id: sessionStorage.getItem('store_id'), status: 6}, function (json) {
                    selectDomicilio = json;
                    $scope.ordenes = json;
                    $rootScope.$emit("updateDom", {len: json.length});
                    $scope.$apply();
                    $scope.$broadcast('scroll.refreshComplete');
                    $('#contentDom').show('slow')
                    $('#loadingDom').hide('slow')
                })
            }

            $scope.getPlace = function(){
                console.log('get place from store start');
                $.getJSON(getServerPath(), {
                    action: 'get_place_by_place_location',
                    place_location_id: sessionStorage.store_id
                }, function (place) {
                    localStorage.place = JSON.stringify(place);
                    console.log('get place from store end');
                    console.log('JSON place: '+JSON.stringify(place));
                    localStorage.place_id = place.place_id;

                })
            }


            $scope.goToDetalle = function (bill_id) {
                sessionStorage.setItem('bill_id', bill_id)
                $state.go('tab.domiciliosDetalle')
            }
            //Zero the idle timer on mouse movement.
            $('#cntentMain').mousemove(function (e) {
                console.log('mouse move')
                idleTime = 0;
            });
            $('#cntentMain').keypress(function (e) {
                console.log('Key Press')
                idleTime = 0;
            });


            function timerIncrement() {
                idleTime = idleTime + 1;
                if (idleTime > 60) { // 1 minutes
                    $scope.inicio();
                    idleTime = 0;
                    console.log("idle")
                }
            }
        })
        .controller('tabsCtrl', function ($scope, $state, $rootScope) {

            $scope.data = {
                rest: 0,
                dom: 0,
            };

            $rootScope.$on('updateRes', function (event, iResult) {//receive the data as second parameter
                $scope.setrest(iResult.len)
            });

            $rootScope.$on('updateDom', function (event, iResult) {//receive the data as second parameter
                $scope.setdom(iResult.len)
            });

            $scope.setrest = function (v) {
                $scope.data['rest'] = v;
                $scope.$apply();
            }

            $scope.setdom = function (v) {
                $scope.data['dom'] = v;
                $scope.$apply();
            }

            $scope.restore = function () {
                console.log('HOLA');
                $state.go('tab.domicilios');

            }

        })
        .controller('domiciliosDetalleCtrl', function ($scope, $state, $ionicHistory, $ionicPopup, $ionicLoading) {
            checkKey(key);
            validateScope($scope);
            var lat, lon, zoom;
            $scope.deleteOrder = function () {
                myPopup = $ionicPopup.show({
                    title: 'Deseas Eliminar Completamente Esta Orden ?',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Eliminar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $.get(getServerPath(), {
                                    action: "update_Bill",
                                    bill_id: sessionStorage.getItem('bill_id'),
                                    status: 0
                                }, function (data) {
                                    if ($.trim(data) == '1') {
                                        alert('Se ha eliminado este pedido')
                                        $ionicHistory.goBack();
                                    } else {
                                        console.log(data);
                                        alert('Ocurrio un error')
                                    }
                                })
                            }
                        }
                    ]
                });
            }

            $scope.update_Bill_Data = function () {
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/edit_Pedido.html',
                    title: 'Editar Pedido',
                    scope: $scope,
                    cssClass: 'my-custom-popup',
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar Campos Editados</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                if ($.trim($('#telPed').val()) != 0) {
                                    if ($.trim($('#nombrePed').val()) != 0) {
                                        if ($.trim($('#addrPed').val()) != 0) {
                                            if (validateEmail($('#mailPed').val()) == true) {
                                                if ($.trim($('#deliveryPed').text()) == '') {
                                                    startUpdate($('#nombrePed').val(), $('#mailPed').val(), $('#telPed').val(), $('#rtnPed').val(), $('#addrPed').val(), 0)
                                                } else {
                                                    var d = new Date();//HOY
                                                    var inputDate = new Date($('#deliveryPed').text());//dia select
                                                    console.log(inputDate.setHours(0, 0, 0, 0));
                                                    console.log(d.setHours(0, 0, 0, 0))
                                                    startUpdate($('#nombrePed').val(), $('#mailPed').val(), $('#telPed').val(), $('#rtnPed').val(), $('#addrPed').val(), $('#deliveryPed').text())
                                                    // if (inputDate.setHours(0, 0, 0, 0) <= d.setHours(0, 0, 0, 0)) {
                                                    //     alert('La Fecha que seleccionaste no es válida, selecciona un dia mayor a hoy.')
                                                    //     e.preventDefault();
                                                    // } else {
                                                    //     startUpdate($('#nombrePed').val(), $('#mailPed').val(), $('#telPed').val(), $('#rtnPed').val(), $('#addrPed').val(), $('#deliveryPed').text())
                                                    // }
                                                }
                                            } else {
                                                $ionicLoading.hide();
                                                alert('Debes darnos un formato valido de email')
                                                e.preventDefault();
                                            }
                                        } else {
                                            $ionicLoading.hide();
                                            alert('Debes darnos una direccion escrita con referencias')
                                            e.preventDefault();
                                        }
                                    } else {
                                        $ionicLoading.hide();
                                        alert('Debes digitar tu nombre')
                                        e.preventDefault();
                                    }
                                } else {
                                    $ionicLoading.hide();
                                    alert('Debes digitar tu numero telefonico')
                                    e.preventDefault();
                                }
                            }}
                    ]
                })
                setTimeout(function () {
                    $('#nombrePed').val($('#nmnPed').text())
                    $('#mailPed').val($('#mlPed').text())
                    $('#telPed').val($('#tlPed').text())
                    $('#rtnPed').val($('#rtPed').text())
                    $('#addrPed').val($('#adrPed').text())
                    $scope.datetimeValue = $('#fcfPed').text()
                    $scope.$apply()
                }, 500)
            }

            function startUpdate(name, mail, tel, rtn, addr, delivery) {
                console.log(delivery);
                $.get(getServerPath(), {
                    action: 'update_Bill_Header',
                    bill_id: sessionStorage.getItem('bill_id'),
                    nombrePed: name,
                    mailPed: mail,
                    telPed: tel,
                    rtnPed: rtn,
                    addrPed: addr,
                    deliveryPed: delivery
                }, function (data) {
                    if ($.trim(data) == 1) {
                        alert('actualizado exitosamente')
                        $ionicHistory.goBack();
                    } else {
                        alert('Ocurrio un error de nuestro lado')
                    }
                })
            }

            $scope.deletebillDetailImg = function (id) {
                var src = $('#detImg' + id).attr('src');
                console.log(src)
                imageExists(src, function (exists) {
                    myPopup = $ionicPopup.show({
                        title: 'Deseas eliminar esta imagen?',
                        scope: $scope,
                        buttons: [
                            {text: 'Cancelar'},
                            {
                                text: '<b>Eliminar</b>',
                                type: 'button-stable',
                                onTap: function (e) {
                                    $.get(getServerPath(), {
                                        action: 'suppress_img',
                                        bill_detail_id: id,
                                    }, function (data) {
                                        if ($.trim(data) == '1') {
                                            alert('Se ha eliminado esta imagen')
                                            $ionicHistory.goBack();
                                        } else {
                                            console.log(data);
                                            alert('Ocurrio un error')
                                        }
                                    })
                                }
                            }
                        ]
                    });
                }, function () {
                    alert('No hay imagen para este registro')
                });



                function imageExists(url, callback, error) {
                    var img = new Image();
                    img.onload = function () {
                        callback();
                    };
                    img.onerror = function () {
                        error();
                    };
                    img.src = url;
                }
            }

            $scope.buttons = buttons;
            $scope.otherDom = otherDom;
            $scope.transfer = function () {
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/otherPlaces.html',
                    title: 'Tranferir Orden',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Trasnferir</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                var oId = $('#oId').val()
                                alert(oId);
                                $.get(getServerPath(), {
                                    action: 'transfer',
                                    place_loc_id: oId,
                                    bill_id: sessionStorage.getItem('bill_id'),
                                }, function (data) {
                                    if ($.trim(data) == '1') {
                                        $ionicHistory.goBack();
                                    } else {
                                        console.log(data);
                                        alert('Ocurrio un error')
                                    }
                                })
                            }
                        }
                    ]
                });
            }

            $scope.updateImg = function (id) {
                var form_data = new FormData();
                var imgBill = $.trim($('#menuImage' + id).val()).length != 0 ? $('#menuImage' + id).prop('files')[0] : " ";
                if ($.trim(imgBill).length > 0) {
                    form_data.append('action', 'update_bill_Image');
                    form_data.append('bill_detail_id', id);
                    form_data.append('file', imgBill);
                    $.ajax({
                        url: getServerPath(),
                        dataType: 'text',
                        cache: false,
                        contentType: false,
                        processData: false,
                        data: form_data,
                        type: 'post',
                        success: function (d) {
                            $ionicLoading.hide();
                            var data = $.trim(d);
                            if (data == '1') {
                                alert('Succesfully Updated');
                                $scope.gobck();
                            } else {
                                alert('Ha Ocurrido un Error')
                            }
                        }
                    });
                } else {
                    alert('No has seleccionado ninguna imagen')
                }
            }

            $scope.inicio = function () {
                
                //console.log('select domicilio: '+JSON.stringify(selectDomicilio))
                var res = alasql('SELECT * FROM ? WHERE bill_id = "' + sessionStorage.getItem('bill_id') + '"', [selectDomicilio]);
                $scope.orden = res;
                $scope.$apply();


                $scope.gobck = function () {
                    $ionicHistory.goBack()
                }

                $.getJSON(getServerPath(), {
                    action: 'queryBill',
                    bill_id: sessionStorage.getItem('bill_id')
                }, function (json) {
                    $scope.detail = json;
                    $scope.imgUrl = getImagePath();
                    $scope.$apply();
                })
                if (res[0].latitud == 'x') {
                    $('#mapCont').hide('slow');
                } else {
                    $('#mapCont').show('slow');
                    lat = res[0].latitud;
                    lon = res[0].longitud;
                    console.log('lat: ' + lat);
                    console.log('lon: ' + lon);
                    zoom = 16;
                    var hrefMap = 'https://www.google.hn/maps/place/' +lat + ','+ lon +'/' +lat + ','+ lon +',15.44z'
                    $('#coord').text(hrefMap);
                    var e = new google.maps.LatLng(lat, lon), t = {zoom: zoom, center: e, panControl: !0, scrollwheel: !1, scaleControl: !0, overviewMapControl: !0, overviewMapControlOptions: {opened: !0}, mapTypeId: google.maps.MapTypeId.ROADMAP};
                    map = new google.maps.Map(document.getElementById("map"), t), geocoder = new google.maps.Geocoder, marker = new google.maps.Marker({position: e, map: map}), map.streetViewControl = !1, infowindow = new google.maps.InfoWindow({content: "(1.10, 1.10)"}), google.maps.event.addListener(map, "mousemove", function (e) {
                        var t = e.latLng;
                       // document.getElementById("mlat").innerHTML = "(" + t.lat().toFixed(6) + ", " + t.lng().toFixed(6) + ")"
                    })
                }
            }

            $scope.copyToClipboard = function(elementId) {
                                    // Create a "hidden" input
                  var aux = document.createElement("input");

                  // Assign it the value of the specified element
                  aux.setAttribute("value", document.getElementById(elementId).innerHTML);

                  // Append it to the body
                  document.body.appendChild(aux);

                  // Highlight its content
                  aux.select();

                  // Copy the highlighted text
                  document.execCommand("copy");

                  // Remove it from the body
                  document.body.removeChild(aux);
              alert('Se copiaron las coordenadas en el portapapeles.')
            }

            $scope.recibido = function () {
                $.get(getServerPath(), {
                    action: 'dismiss_homeDelivery',
                    bill_id: sessionStorage.getItem('bill_id')
                }, function (data) {

                    if ($.trim(data) == '0'){
                        alert('Algo salio mal en nuestro sistema');
                        return;
                    } 

                    
                    if (parseInt($('#puntos').text()) > 0) {
                        alert('Esta Orden contiene puntos, recuerda despacharla para acreditarle los puntos al cliente')
                    }
                    
                    $ionicHistory.goBack();
                        
                })
            }
        })
        .controller('domiciliosDetalle2Ctrl', function ($scope, $state, $ionicHistory, $ionicPopup, $ionicLoading) {
            checkKey(key);
            validateScope($scope);
            $scope.deleteOrder = function () {
                myPopup = $ionicPopup.show({
                    title: 'Deseas Eliminar Completamente Esta Orden ?',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Eliminar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $.get(getServerPath(), {
                                    action: 'delete_Bill',
                                    bill_id: sessionStorage.getItem('bill_id'),
                                }, function (data) {
                                    if ($.trim(data) == '1') {
                                        alert('Se ha eliminado este pedido')
                                        $ionicHistory.goBack();
                                    } else {
                                        console.log(data);
                                        alert('Ocurrio un error')
                                    }
                                })
                            }
                        }
                    ]
                });
            }

            $scope.update_Bill_Data = function () {
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/edit_Pedido.html',
                    title: 'Editar Pedido',
                    scope: $scope,
                    cssClass: 'my-custom-popup',
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar Campos Editados</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                if ($.trim($('#telPed').val()) != 0) {
                                    if ($.trim($('#nombrePed').val()) != 0) {
                                        if ($.trim($('#addrPed').val()) != 0) {
                                            if (validateEmail($('#mailPed').val()) == true) {
                                                if ($.trim($('#deliveryPed').text()) == '') {
                                                    startUpdate($('#nombrePed').val(), $('#mailPed').val(), $('#telPed').val(), $('#rtnPed').val(), $('#addrPed').val(), 0)
                                                } else {
                                                    var d = new Date();//HOY
                                                    var inputDate = new Date($('#deliveryPed').text());//dia select
                                                    console.log(inputDate.setHours(0, 0, 0, 0));
                                                    console.log(d.setHours(0, 0, 0, 0))
                                                    if (inputDate.setHours(0, 0, 0, 0) <= d.setHours(0, 0, 0, 0)) {
                                                        alert('La Fecha que seleccionaste no es válida, selecciona un dia mayor a hoy.')
                                                        e.preventDefault();
                                                    } else {
                                                        startUpdate($('#nombrePed').val(), $('#mailPed').val(), $('#telPed').val(), $('#rtnPed').val(), $('#addrPed').val(), $('#deliveryPed').text())
                                                    }
                                                }
                                            } else {
                                                $ionicLoading.hide();
                                                alert('Debes darnos un formato valido de email')
                                                e.preventDefault();
                                            }
                                        } else {
                                            $ionicLoading.hide();
                                            alert('Debes darnos una direccion escrita con referencias')
                                            e.preventDefault();
                                        }
                                    } else {
                                        $ionicLoading.hide();
                                        alert('Debes digitar tu nombre')
                                        e.preventDefault();
                                    }
                                } else {
                                    $ionicLoading.hide();
                                    alert('Debes digitar tu numero telefonico')
                                    e.preventDefault();
                                }
                            }}
                    ]
                })
                setTimeout(function () {
                    $('#nombrePed').val($('#nmnPed').text())
                    $('#mailPed').val($('#mlPed').text())
                    $('#telPed').val($('#tlPed').text())
                    $('#rtnPed').val($('#rtPed').text())
                    $('#addrPed').val($('#adrPed').text())
                    $scope.datetimeValue = $('#fcfPed').text()
                    $scope.$apply()
                }, 500)
            }

            function startUpdate(name, mail, tel, rtn, addr, delivery) {
                console.log(delivery);
                $.get(getServerPath(), {
                    action: 'update_Bill_Header',
                    bill_id: sessionStorage.getItem('bill_id'),
                    nombrePed: name,
                    mailPed: mail,
                    telPed: tel,
                    rtnPed: rtn,
                    addrPed: addr,
                    deliveryPed: delivery
                }, function (data) {
                    console.log(data);
                })
            }

            $scope.deletebillDetailImg = function (id) {
                var src = $('#detImg' + id).attr('src');
                console.log(src)
                imageExists(src, function (exists) {
                    myPopup = $ionicPopup.show({
                        title: 'Deseas eliminar esta imagen?',
                        scope: $scope,
                        buttons: [
                            {text: 'Cancelar'},
                            {
                                text: '<b>Eliminar</b>',
                                type: 'button-stable',
                                onTap: function (e) {
                                    $.get(getServerPath(), {
                                        action: 'suppress_img',
                                        bill_detail_id: id,
                                    }, function (data) {
                                        if ($.trim(data) == '1') {
                                            alert('Se ha eliminado esta imagen')
                                            $ionicHistory.goBack();
                                        } else {
                                            console.log(data);
                                            alert('Ocurrio un error')
                                        }
                                    })
                                }
                            }
                        ]
                    });
                }, function () {
                    alert('No hay imagen para este registro')
                });



                function imageExists(url, callback, error) {
                    var img = new Image();
                    img.onload = function () {
                        callback();
                    };
                    img.onerror = function () {
                        error();
                    };
                    img.src = url;
                }
            }

            $scope.buttons = buttons;
            $scope.otherDom = otherDom;
            $scope.transfer = function () {
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/otherPlaces.html',
                    title: 'Tranferir Orden',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Trasnferir</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                var oId = $('#oId').val()
                                alert(oId);
                                $.get(getServerPath(), {
                                    action: 'transfer',
                                    place_loc_id: oId,
                                    bill_id: sessionStorage.getItem('bill_id'),
                                }, function (data) {
                                    if ($.trim(data) == '1') {
                                        $ionicHistory.goBack();
                                    } else {
                                        console.log(data);
                                        alert('Ocurrio un error')
                                    }
                                })
                            }
                        }
                    ]
                });
            }

            $scope.updateImg = function (id) {
                var form_data = new FormData();
                var imgBill = $.trim($('#menuImage' + id).val()).length != 0 ? $('#menuImage' + id).prop('files')[0] : " ";
                if ($.trim(imgBill).length > 0) {
                    form_data.append('action', 'update_bill_Image');
                    form_data.append('bill_detail_id', id);
                    form_data.append('file', imgBill);
                    $.ajax({
                        url: getServerPath(),
                        dataType: 'text',
                        cache: false,
                        contentType: false,
                        processData: false,
                        data: form_data,
                        type: 'post',
                        success: function (d) {
                            $ionicLoading.hide();
                            var data = $.trim(d);
                            if (data == '1') {
                                alert('Succesfully Updated');
                                $scope.gobck();
                            } else {
                                alert('Ha Ocurrido un Error')
                            }
                        }
                    });
                } else {
                    alert('No has seleccionado ninguna imagen')
                }
            }

            $scope.inicio = function () {
                var lat, lon, zoom;
                //console.log('select domicilio: '+JSON.stringify(selectDomicilio))
                var res = alasql('SELECT * FROM ? WHERE bill_id = "' + sessionStorage.getItem('bill_id') + '"', [selectDomicilio]);
                $scope.orden = res;
                $scope.$apply();


                $scope.gobck = function () {
                    $ionicHistory.goBack()
                }

                $.getJSON(getServerPath(), {
                    action: 'queryBill',
                    bill_id: sessionStorage.getItem('bill_id')
                }, function (json) {
                    $scope.detail = json;
                    $scope.imgUrl = getImagePath();
                    $scope.$apply();
                })
                if (res[0].latitud == 'x') {
                    $('#map').hide('slow');
                } else {
                    $('#map').show('slow');
                    lat = res[0].latitud;
                    lon = res[0].longitud;
                    console.log('lat: ' + lat);
                    console.log('lon: ' + lon);
                    zoom = 16;
                    var e = new google.maps.LatLng(lat, lon), t = {zoom: zoom, center: e, panControl: !0, scrollwheel: !1, scaleControl: !0, overviewMapControl: !0, overviewMapControlOptions: {opened: !0}, mapTypeId: google.maps.MapTypeId.ROADMAP};
                    map = new google.maps.Map(document.getElementById("map"), t), geocoder = new google.maps.Geocoder, marker = new google.maps.Marker({position: e, map: map}), map.streetViewControl = !1, infowindow = new google.maps.InfoWindow({content: "(1.10, 1.10)"}), google.maps.event.addListener(map, "mousemove", function (e) {
                        var t = e.latLng;
                        document.getElementById("mlat").innerHTML = "(" + t.lat().toFixed(6) + ", " + t.lng().toFixed(6) + ")"
                    })
                }
            }
            $scope.recibido = function () {
                $.get(getServerPath(), {
                    action: 'dismiss_homeDelivery',
                    bill_id: sessionStorage.getItem('bill_id')
                }, function (data) {
                    if ($.trim(data) == '1') {
                        $ionicHistory.goBack();
                    } else {
                        alert('Algo salio mal en nuestro sistema')
                    }
                })
            }
        })
        .controller('AlldomiciliosCtrl', function ($scope, $state, $ionicPopup, $ionicHistory, $ionicLoading) {
            checkKey(key);
            validateScope($scope);
            buttons = 0;
            $scope.store = sessionStorage.getItem('store_id');
            $scope.inicio = function () {
                console.log('inicio')
                sessionStorage.setItem('viewState', "AllDomicilios");
                $('#loadingAllDom').show('slow')
                $('#contentAllDom').hide('slow')
                $.getJSON(getServerPath(), {action: "select_all_domicilio_place", place_id: sessionStorage.getItem('store_id')}, function (json) {
                    selectDomicilio = json;
                    console.log(JSON.stringify(json))
                    $scope.ordenes = json;
                    $scope.$apply();
                    $scope.$broadcast('scroll.refreshComplete');
                    $('#contentAllDom').show('slow')
                    $('#loadingAllDom').hide('slow')
                })
            }

            $scope.goToDetalle = function (bill_id) {
                sessionStorage.setItem('bill_id', bill_id)
                $state.go('tab.domiciliosDetalle')
            }

            $scope.updateMotorista = function (id) {
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/update_motorista.html',
                    title: 'Asignar Motorista',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Save</b>',
                            type: 'button-stable',
                            onTap: function () {

                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });

                                $.ajax({
                                    url: getServerPath() + '?action=update_motorista&motorista=' + $('#motor').val() + '&bill_id=' + id,
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    type: 'get',
                                    success: function (d) {

                                        $ionicLoading.hide()
                                        var data = $.trim(d);
                                        if (data == '1') {
                                            alert('Listo!');
                                            $scope.inicio();
                                        } else {
                                            alert('Algo Salio Mal')
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.packOff = function (bill_id) {
                myPopup = $ionicPopup.show({
                    title: 'Estas seguro que marcar como despachado este pedido?',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Despachar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                console.log('url: ' + getServerPath() + '?action=update_Bill&status=8&bill_id' + bill_id);
                                $.get(getServerPath(), {
                                    action: 'update_Bill',
                                    status: 8,
                                    bill_id: bill_id
                                }, function (resp) {
                                    console.log('despachar: '+resp);
                                    alert('Orden despachada');
                                    $ionicLoading.hide();
                                    $scope.inicio();
                                }).fail(function () {
                                    alert('No pudimos conectarnos a Ferby, revisa tu conexión de internet.');
                                })
                            }
                        }]
                });
            }

            $scope.gobck = function () {
                $ionicHistory.goBack()
            }

        })
        .controller('qrCatalogCtrl', function ($scope, $state, $ionicLoading, $ionicPlatform, $ionicPopup, $rootScope) {
            $ionicPlatform.ready(function () {
                $('#qrcode').find('img').remove()
                var qrcode = new QRCode(document.getElementById("qrcode"), {
                    text: 'https://app.almacenesxtra.com/app/#/side/loginBill?place_id=' + sessionStorage.getItem('place_id'),
                    width: 150,
                    height: 150,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });

                setTimeout(function () {
                    $('#qrcode').find('img').css('height', 'auto').css('width', '50%').css('margin-left', '25%').css('margin-bottom', '10px')
                }, 500)

            })

            $scope.gotoqrPrint = function (id) {
                localStorage.setItem('idProd', id)
                $state.go('app.qrPrint');
            }

            $scope.expand = function () {

                if ($('#colapse').css('display') == 'none') {
                    $('#colapse').show('slow')
                    $('#arrow').removeClass('ion-chevron-up').addClass('ion-chevron-down')
                } else {
                    $('#arrow').removeClass('ion-chevron-down').addClass('ion-chevron-up')
                    $('#colapse').hide('slow')
                }
                setTimeout(function () {
                    $scope.$apply();
                }, 500)
            }


            $scope.updateQrCatalog = function (id) {
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/update_qrCatalog.html',
                    title: 'Editar Qr Catalogo',
                    subTitle: 'Edita los campos del catalogo',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Save</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var qrImage = $.trim($('#qrImage').val()).length != 0 ? $('#qrImage').prop('files')[0] : " ";
                                var qrTitle = $('#qrTitle').val();
                                var qrDesc = $('#qrDesc').val();

                                var qrState = $('#qrState').val();
                                var form_data = new FormData();
                                console.log(qrImage);
                                form_data.append('action', 'update_qr_catalog');
                                form_data.append('reg_id', id);
                                form_data.append('img', qrImage);
                                form_data.append('title', qrTitle);
                                form_data.append('desc', qrDesc);

                                form_data.append('status', qrState);
                                form_data.append('place_id', sessionStorage.getItem('place_id'));
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (d) {
                                        $ionicLoading.hide();
                                        var data = $.trim(d);
                                        if (data == '1') {
                                            alert('Succesfully Updated');
                                            $scope.getQrCatalog();
                                        } else {
                                            console.log(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
                setTimeout(function () {
                    $('#qrTitle').val($('#tblTitle' + id).text())
                    $('#qrDesc').val($('#tblDesc' + id).text())

                    $('#qrState').val($('#tblStatus' + id).text())
                }, 500)
            }

            $scope.deleteQrCatalog = function (id) {
                myPopup = $ionicPopup.show({
                    template: 'Estas seguro que deseas eliminar la del catalogo {{promotit}} ?',
                    title: 'Eliminar De Catalogo',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Save</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var form_data = new FormData();
                                form_data.append('action', 'delete_qr_catalog');
                                form_data.append('reg_id', id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (d) {
                                        $ionicLoading.hide()
                                        var data = $.trim(d);
                                        if (data == '1') {
                                            alert('Deleted Succesfully');
                                            $scope.getQrCatalog();
                                        } else {
                                            console.log(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
                setTimeout(function () {
                    $scope.promotit = $('#tblTitle' + id).text()
                }, 500)
            }

            $scope.insertQrCatalog = function () {
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_qrCatalog.html',
                    title: 'Editar Plato',
                    subTitle: 'Edita los campos del menu',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Save</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var qrImage = $.trim($('#qrImage').val()).length != 0 ? $('#qrImage').prop('files')[0] : " ";
                                var qrTitle = $('#qrTitle').val();
                                var qrDesc = $('#qrDesc').text();

                                var form_data = new FormData();
                                console.log(qrImage);
                                form_data.append('action', 'insert_qr_catalog');
                                form_data.append('img', qrImage);
                                form_data.append('title', qrTitle);
                                form_data.append('desc', qrDesc);
                                form_data.append('place_id', sessionStorage.getItem('place_id'));
                                console.log(qrDesc);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (d) {
                                        var data = $.trim(d);
                                        if (data == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getQrCatalog();
                                            $ionicLoading.hide();
                                        } else {
                                            $ionicLoading.hide();
                                            console.log(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.getQrCatalog = function () {

                $('#loadingQr').show('slow')
                $('#contentQr').hide('slow')
                console.log(sessionStorage.getItem('place_id'));
                $.getJSON(getServerPath(), {
                    action: "select_qr_catalog",
                    place_id: sessionStorage.getItem('place_id')
                }, function (json) {
                    console.log(json)
                    $('#loadingQr').hide('slow')
                    $('#contentQr').show('slow')
                    $scope.qrs = json;
                    $scope.$apply();
                    $scope.$broadcast('scroll.refreshComplete');
                })
            }
        })        
        .controller('personalizeCtrl', function ($scope, $state, $ionicPopup, $ionicHistory, $ionicLoading) {
           checkKey(key);
           $("#linkEmul").val("https://app.almacenesxtra.com/AppEmulator");
           $("#ifr").attr("src","https://app.almacenesxtra.com/AppEmulator");

           $scope.moreIcons = function(){
               window.open("https://www.flaticon.com")
           }
           $scope.getFBID = function(){
                window.open("https://findmyfbid.com/")
            }

            validateScope($scope);
            //buttons = 0;
            $scope.settingImg = {};
            $scope.checkinImg = {};
            $scope.personalize = {};
            $scope.personalize.search = '';
            if(sessionStorage.business_name != null && sessionStorage.business_name != undefined)
                $scope.personalize.search = sessionStorage.business_name;

            $scope.toggle = {};
            $scope.toggle.ordenes = 0;
            $scope.toggle.redes = 0;
            $scope.toggle.fondos = 0;
            $scope.toggle.colores = 0;

            $scope.places = [];
            $scope.allPlaces = [];
            $scope.settings = [];
            $scope.checkinOptions = {};

            $scope.selectedPlace = {};

            $scope.set_rate_app_playstore = function (place) {
                $scope.rate_app = {};

                $scope.rate_app.playstore = place.rate_app_playstore;
                myPopup = $ionicPopup.show({
                    template: '<input type="text" ng-model="rate_app.playstore" ng-value="rate_app.playstore" autofocus>',
                    title: 'Editar '+place.rate_app_playstore,
                    subTitle: 'Actualizar el link playstore del negocio seleccionado',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html'});
                                return $scope.rate_app;
                            }
                        }
                    ]
                });
              
                myPopup.then(function(res){
                    $.get(getServerPath(), {
                        action: 'set_rate_app_playstore',
                        place_id: place.place_id,
                        rate_app_playstore: res.playstore
                    }, function (r) {
                        $ionicLoading.hide()
                        if(r==1)
                        {
                            alert('Link actualizado correctamente');
                            $scope.getPersonalizeSettings();
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                    });
                });
            };            

            $scope.set_img_rate_app = function (place_id) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elige una nueva imagen (De preferencia con arte simple y plano).<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_img_rate_app');
                                form_data.append('img', new_image);
                                form_data.append('place_id', place_id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        $ionicLoading.hide()
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getPersonalizeSettings();
                                        } else {
                                            alert(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.switch_show_rate_app = function(turn, p){
                console.log('SWITCH: '+JSON.stringify(+ turn));
                console.log('PLACE: '+JSON.stringify(p));
                $.get(getServerPath(), {
                        action: 'switch_show_rate_app',
                        place_id: p.place_id,
                        show_rate_app: + turn
                    }, function (r) {
                        if(r==1)
                        {
                            setTimeout(function () {
                                $scope.getPersonalizeSettings();
                            }, 500)
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                        console.log('error: '+JSON.stringify(r));
                });
            }

            $scope.set_rate_app_text = function (place) {
                $scope.rate_app = {};

                $scope.rate_app.text = place.rate_app_text;
                myPopup = $ionicPopup.show({
                    template: '<input type="text" ng-model="rate_app.text" ng-value="rate_app.text" autofocus>',
                    title: 'Editar '+place.business_name,
                    subTitle: 'Actualizar el texto del boton',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html'});
                                return $scope.rate_app;
                            }
                        }
                    ]
                });
              
                myPopup.then(function(res){
                    $.get(getServerPath(), {
                        action: 'set_rate_app_text',
                        place_id: place.place_id,
                        rate_app_text: res.text
                    }, function (r) {
                        $ionicLoading.hide()
                        if(r==1)
                        {
                            alert('Texto actualizado correctamente');
                            $scope.getPersonalizeSettings();
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                    });
                });
            };                

            $scope.set_redeem_name = function (setting) {
                $scope.set = {};

                $scope.set.redeem_name = setting.redeem_name;
                myPopup = $ionicPopup.show({
                    template: '<input type="text" ng-model="set.redeem_name" ng-value="set.redeem_name" autofocus>',
                    title: 'Editar '+setting.redeem_name,
                    subTitle: 'Actualizar el texto del boton',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html'});
                                return $scope.set;
                            }
                        }
                    ]
                });
              
                myPopup.then(function(res){
                    $.get(getServerPath(), {
                        action: 'set_redeem_name',
                        place_id: setting.setting_place_id,
                        redeem_name: res.redeem_name
                    }, function (r) {
                        $ionicLoading.hide()
                        if(r==1)
                        {
                            alert('Texto actualizado correctamente');
                            $scope.getPersonalizeSettings();
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                    });
                });
            };          

            $scope.set_img_reservar = function (place_id) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elige una nueva imagen (De preferencia con arte simple y plano).<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_img_reservar');
                                form_data.append('img', new_image);
                                form_data.append('place_id', place_id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        $ionicLoading.hide()
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getPersonalizeSettings();
                                        } else {
                                            alert(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.switch_show_reservar = function(turn, p){
                console.log('SWITCH: '+JSON.stringify(+ turn));
                console.log('PLACE: '+JSON.stringify(p));
                $.get(getServerPath(), {
                        action: 'switch_show_reservar',
                        place_id: p.place_id,
                        show_reservar: + turn
                    }, function (r) {
                        if(r==1)
                        {
                            setTimeout(function () {
                                $scope.getPersonalizeSettings();
                            }, 500)
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                        console.log('error: '+JSON.stringify(r));
                });
            }

            $scope.set_subscription = function (place) {
                $scope.subscription = {};

                $scope.subscription.link = place.subscription_link;
                myPopup = $ionicPopup.show({
                    template: '<input type="text" ng-model="subscription.link" ng-value="subscription.link" autofocus>',
                    title: 'Editar '+place.subscription_link,
                    subTitle: 'Actualizar el link del negocio seleccionado',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html'});
                                return $scope.subscription;
                            }
                        }
                    ]
                });
              
                myPopup.then(function(res){
                    $.get(getServerPath(), {
                        action: 'set_subscription_link',
                        place_id: place.place_id,
                        subscription_link: res.link
                    }, function (r) {
                        $ionicLoading.hide()
                        if(r==1)
                        {
                            alert('Link actualizado correctamente');
                            $scope.getPersonalizeSettings();
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                    });
                });
            };            

            $scope.set_img_subscription_link = function (place_id) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elige una nueva imagen (De preferencia con arte simple y plano).<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_img_subscription_link');
                                form_data.append('img', new_image);
                                form_data.append('place_id', place_id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        $ionicLoading.hide()
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getPersonalizeSettings();
                                        } else {
                                            alert(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.switch_show_subscription_link = function(turn, p){
                console.log('SWITCH: '+JSON.stringify(+ turn));
                console.log('PLACE: '+JSON.stringify(p));
                $.get(getServerPath(), {
                        action: 'switch_show_subscription_link',
                        place_id: p.place_id,
                        show_subscription_link: + turn
                    }, function (r) {
                        if(r==1)
                        {
                            setTimeout(function () {
                                $scope.getPersonalizeSettings();
                            }, 500)
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                        console.log('error: '+JSON.stringify(r));
                });
            }

            $scope.set_subscription_link_text = function (place) {
                $scope.subscription_link = {};

                $scope.subscription_link.text = place.subscription_link_text;
                myPopup = $ionicPopup.show({
                    template: '<input type="text" ng-model="subscription_link.text" ng-value="subscription_link.text" autofocus>',
                    title: 'Editar '+place.business_name,
                    subTitle: 'Actualizar el texto del boton',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html'});
                                return $scope.subscription_link;
                            }
                        }
                    ]
                });
              
                myPopup.then(function(res){
                    $.get(getServerPath(), {
                        action: 'set_subscription_link_text',
                        place_id: place.place_id,
                        subscription_link_text: res.text
                    }, function (r) {
                        $ionicLoading.hide()
                        if(r==1)
                        {
                            alert('Texto actualizado correctamente');
                            $scope.getPersonalizeSettings();
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                    });
                });
            };            

            $scope.set_img_help_link = function (place_id) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elige una nueva imagen (De preferencia con arte simple y plano).<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_img_help_link');
                                form_data.append('img', new_image);
                                form_data.append('place_id', place_id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        $ionicLoading.hide()
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getPersonalizeSettings();
                                        } else {
                                            alert(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.switch_show_help_link = function(turn, p){
                console.log('SWITCH: '+JSON.stringify(+ turn));
                console.log('PLACE: '+JSON.stringify(p));
                $.get(getServerPath(), {
                        action: 'switch_show_help_link',
                        place_id: p.place_id,
                        show_help_link: + turn
                    }, function (r) {
                        if(r==1)
                        {
                            setTimeout(function () {
                                $scope.getPersonalizeSettings();
                            }, 500)
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                        console.log('error: '+JSON.stringify(r));
                });
            }



            $scope.set_img_instagram = function (place_id) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elige una nueva imagen (De preferencia con arte simple y plano).<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_img_instagram');
                                form_data.append('img', new_image);
                                form_data.append('place_id', place_id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        $ionicLoading.hide()
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getPersonalizeSettings();
                                        } else {
                                            alert(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.switch_show_instagram = function(turn, p){
                console.log('SWITCH: '+JSON.stringify(+ turn));
                console.log('PLACE: '+JSON.stringify(p));
                $.get(getServerPath(), {
                        action: 'switch_show_instagram',
                        place_id: p.place_id,
                        show_instagram: + turn
                    }, function (r) {
                        if(r==1)
                        {
                            setTimeout(function () {
                                $scope.getPersonalizeSettings();
                            }, 500)
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                        console.log('error: '+JSON.stringify(r));
                });
            }

           
            $scope.reloadIframe  = function(){
                document.getElementById('ifr').src = document.getElementById('ifr').src;
            }

            $scope.getSettingImg = function(place_id){
                let setting = {};
                if($scope.settings.length > 0){
                    setting = $scope.setting.find(f => f.setting_place_id == place_id);
                    return setting.redeem_icon;
                }
            }

            $scope.set_img_track_orders = function (place_id) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elige una nueva imagen (De preferencia con arte simple y plano).<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_img_track_orders');
                                form_data.append('img', new_image);
                                form_data.append('place_id', place_id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        $ionicLoading.hide()
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getPersonalizeSettings();
                                        } else {
                                            alert(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.switch_show_track_orders = function(turn, p){
                console.log('SWITCH: '+JSON.stringify(+ turn));
                console.log('PLACE: '+JSON.stringify(p));
                $.get(getServerPath(), {
                        action: 'switch_show_track_orders',
                        place_id: p.place_id,
                        show_track_orders: + turn
                    }, function (r) {
                        if(r==1)
                        {
                            setTimeout(function () {
                                $scope.getPersonalizeSettings();
                            }, 500)
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                        console.log('error: '+JSON.stringify(r));
                });
            }
            $scope.set_img_shop = function (place_id) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elige una nueva imagen (De preferencia con arte simple y plano).<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_img_shop');
                                form_data.append('img', new_image);
                                form_data.append('place_id', place_id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        $ionicLoading.hide()
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getPersonalizeSettings();
                                        } else {
                                            alert(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.switch_show_shop = function(turn, p){
                console.log('SWITCH: '+JSON.stringify(+ turn));
                console.log('PLACE: '+JSON.stringify(p));
                $.get(getServerPath(), {
                        action: 'switch_show_shop',
                        place_id: p.place_id,
                        show_shop: + turn
                    }, function (r) {
                        if(r==1)
                        {
                            setTimeout(function () {
                                $scope.getPersonalizeSettings();
                            }, 500)
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                        console.log('error: '+JSON.stringify(r));
                });
            }

            $scope.set_img_promos = function (place_id) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elige una nueva imagen (De preferencia con arte simple y plano).<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_img_promos');
                                form_data.append('img', new_image);
                                form_data.append('place_id', place_id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        $ionicLoading.hide()
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getPersonalizeSettings();
                                        } else {
                                            alert(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.switch_show_promos = function(turn, p){
                console.log('SWITCH: '+JSON.stringify(+ turn));
                console.log('PLACE: '+JSON.stringify(p));
                $.get(getServerPath(), {
                        action: 'switch_show_promos',
                        place_id: p.place_id,
                        show_promos: + turn
                    }, function (r) {
                        if(r==1)
                        {
                            setTimeout(function () {
                                $scope.getPersonalizeSettings();
                            }, 500)
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                        console.log('error: '+JSON.stringify(r));
                });
            }

            $scope.set_img_addon_check_in = function (place_id) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elige una nueva imagen (De preferencia con arte simple y plano).<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_img_addon_check_in');
                                form_data.append('img', new_image);
                                form_data.append('place_id', place_id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        $ionicLoading.hide()
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getPersonalizeSettings();
                                        } else {
                                            alert(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.set_img_addon_puntos = function (place_id) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elige una nueva imagen (De preferencia con arte simple y plano).<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_img_addon_puntos');
                                form_data.append('img', new_image);
                                form_data.append('place_id', place_id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        $ionicLoading.hide()
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getPersonalizeSettings();
                                        } else {
                                            alert(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }


            $scope.switch_addon_puntos = function(turn, p){
                console.log('SWITCH: '+JSON.stringify(+ turn));
                console.log('PLACE: '+JSON.stringify(p));
                $.get(getServerPath(), {
                        action: 'switch_addon_puntos',
                        place_id: p.place_id,
                        addon_puntos: + turn
                    }, function (r) {
                        if(r==1)
                        {
                            setTimeout(function () {
                                $scope.getPersonalizeSettings();
                            }, 500)
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                        console.log('error: '+JSON.stringify(r));
                });
            }

            $scope.switch_addon_check_in = function(turn, p){
                console.log('SWITCH: '+JSON.stringify(+ turn));
                console.log('PLACE: '+JSON.stringify(p));
                $.get(getServerPath(), {
                        action: 'switch_addon_check_in',
                        place_id: p.place_id,
                        addon_check_in: + turn
                    }, function (r) {
                        if(r==1)
                        {
                            setTimeout(function () {
                                $scope.getPersonalizeSettings();
                            }, 500)
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                        console.log('error: '+JSON.stringify(r));
                });
            }


            $scope.set_img_coupons = function (place_id) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elige una nueva imagen (De preferencia con arte simple y plano).<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_img_coupons');
                                form_data.append('img', new_image);
                                form_data.append('place_id', place_id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        $ionicLoading.hide()
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getPersonalizeSettings();
                                        } else {
                                            alert(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.switch_show_coupons = function(turn, p){
                console.log('SWITCH: '+JSON.stringify(+ turn));
                console.log('PLACE: '+JSON.stringify(p));
                $.get(getServerPath(), {
                        action: 'switch_show_coupons',
                        place_id: p.place_id,
                        show_coupons: + turn
                    }, function (r) {
                        if(r==1)
                        {
                            setTimeout(function () {
                                $scope.getPersonalizeSettings();
                            }, 500)
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                        console.log('error: '+JSON.stringify(r));
                });
            }


            $scope.set_phone_img = function (place_id) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elige una nueva imagen (De preferencia con arte simple y plano).<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_phone_img');
                                form_data.append('img', new_image);
                                form_data.append('place_id', place_id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        $ionicLoading.hide()
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getPersonalizeSettings();
                                        } else {
                                            alert(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.switch_show_phone = function(turn, p){
                console.log('SWITCH: '+JSON.stringify(+ turn));
                console.log('PLACE: '+JSON.stringify(p));
                $.get(getServerPath(), {
                        action: 'switch_show_phone',
                        place_id: p.place_id,
                        show_phone: + turn
                    }, function (r) {
                        if(r==1)
                        {
                            setTimeout(function () {
                                $scope.getPersonalizeSettings();
                            }, 500)
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                        console.log('error: '+JSON.stringify(r));
                });
            }


            $scope.set_messenger_img = function (place_id) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elige una nueva imagen (De preferencia con arte simple y plano).<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_messenger_img');
                                form_data.append('img', new_image);
                                form_data.append('place_id', place_id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        $ionicLoading.hide()
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getPersonalizeSettings();
                                        } else {
                                            alert(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.switch_show_messenger = function(turn, p){
                console.log('SWITCH: '+JSON.stringify(+ turn));
                console.log('PLACE: '+JSON.stringify(p));
                $.get(getServerPath(), {
                        action: 'switch_show_messenger',
                        place_id: p.place_id,
                        show_messenger: + turn
                    }, function (r) {
                        if(r==1)
                        {
                            setTimeout(function () {
                                $scope.getPersonalizeSettings();
                            }, 500)
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                        console.log('error: '+JSON.stringify(r));
                });
            }

            $scope.switch_show_scanner = function(turn, p){
                console.log('SWITCH: '+JSON.stringify(+ turn));
                console.log('PLACE: '+JSON.stringify(p));
                $.get(getServerPath(), {
                        action: 'switch_show_scanner',
                        place_id: p.place_id,
                        show_scanner: + turn
                    }, function (r) {
                        if(r==1)
                        {
                            setTimeout(function () {
                                $scope.getPersonalizeSettings();
                            }, 500)
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                        console.log('error: '+JSON.stringify(r));
                });
            }



            $scope.set_img_locations = function (place_id) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elige una nueva imagen (De preferencia con arte simple y plano).<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_img_locations');
                                form_data.append('img', new_image);
                                form_data.append('place_id', place_id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        $ionicLoading.hide()
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getPersonalizeSettings();
                                        } else {
                                            alert(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.switch_show_locations = function(turn, p){
                console.log('SWITCH: '+JSON.stringify(+ turn));
                console.log('PLACE: '+JSON.stringify(p));
                $.get(getServerPath(), {
                        action: 'switch_show_locations',
                        place_id: p.place_id,
                        show_locations: + turn
                    }, function (r) {
                        if(r==1)
                        {
                            setTimeout(function () {
                                $scope.getPersonalizeSettings();
                            }, 500)
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                        console.log('error: '+JSON.stringify(r));
                });
            }


            $scope.set_img_events = function (place_id) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elige una nueva imagen (De preferencia con arte simple y plano).<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_img_events');
                                form_data.append('img', new_image);
                                form_data.append('place_id', place_id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        $ionicLoading.hide()
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getPersonalizeSettings();
                                        } else {
                                            alert(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.switch_show_events = function(turn, p){
                console.log('SWITCH: '+JSON.stringify(+ turn));
                console.log('PLACE: '+JSON.stringify(p));
                $.get(getServerPath(), {
                        action: 'switch_show_events',
                        place_id: p.place_id,
                        show_events: + turn
                    }, function (r) {
                        if(r==1)
                        {
                            setTimeout(function () {
                                $scope.getPersonalizeSettings();
                            }, 500)
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                        console.log('error: '+JSON.stringify(r));
                });
            }

            $scope.switch_show_facebook = function(turn, p){
                console.log('SWITCH: '+JSON.stringify(+ turn));
                console.log('PLACE: '+JSON.stringify(p));
                $.get(getServerPath(), {
                        action: 'switch_show_facebook',
                        place_id: p.place_id,
                        show_facebook: + turn
                    }, function (r) {
                        if(r==1)
                        {
                            setTimeout(function () {
                                $scope.getPersonalizeSettings();
                            }, 500)
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                        console.log('error: '+JSON.stringify(r));
                });
            }


            $scope.activatePoints = function (place) {

                myPopup = $ionicPopup.show({
                    //template: '<input type="text" ng-model="business_phone.phone" ng-value="business_phone.phone" autofocus>',
                    //title: 'Activar Sistema de Puntoss',
                    title: 'Está seguro que desea activar el sistema de puntos para '+place.business_name+'?',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Activar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html'});
                                //return $scope.business_phone;
                            }
                        }
                    ]
                });
              
                myPopup.then(function(res){
                    $.get(getServerPath(), {
                        action: 'activate_points',
                        place_id: place.place_id
                    }, function (r) {
                        $ionicLoading.hide()
                        if(r==1)
                        {
                            alert('Sistema de puntos activado correctamente.');
                            $scope.getPersonalizeSettings();
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                    });
                });

            };

            $scope.set_fcm = function (place) {
                $scope.fcm = {};

                $scope.fcm.key = place.fcm_key;
                myPopup = $ionicPopup.show({
                    template: '<input type="text" ng-model="fcm.key" ng-value="fcm.key" autofocus>',
                    title: 'Editar la clave heredada de FireBase Console ',
                    subTitle: 'Actualizar el API key del negocio seleccionado',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html'});
                                return $scope.fcm;
                            }
                        }
                    ]
                });
              
                myPopup.then(function(res){
                    $.get(getServerPath(), {
                        action: 'set_fcm_key',
                        place_id: place.place_id,
                        fcm_key: res.key
                    }, function (r) {
                        $ionicLoading.hide()
                        if(r==1)
                        {
                            alert('Key actualizado correctamente');
                            $scope.getPersonalizeSettings();
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                    });
                });
            };                

            $scope.toggleOrdenes = function(){
                if($scope.toggle.ordenes == 0)
                    $scope.toggle.ordenes = 1;
                else
                    $scope.toggle.ordenes = 0;
                $scope.$apply();
            }

            $scope.toggleRedes = function(){
                if($scope.toggle.redes == 0)
                    $scope.toggle.redes = 1;
                else
                    $scope.toggle.redes = 0;
                $scope.$apply();
            }

            $scope.toggleFondos = function(){
                if($scope.toggle.fondos == 0)
                    $scope.toggle.fondos = 1;
                else
                    $scope.toggle.fondos = 0;
                $scope.$apply();
            }

            $scope.toggleColores = function(){
                if($scope.toggle.colores == 0)
                    $scope.toggle.colores = 1;
                else
                    $scope.toggle.colores = 0;
                $scope.$apply();
            }

            $scope.getPersonalizeSettings = function () {
                console.log('inicio')
                //$('#loadingAllDom').show('slow')
                //$('#contentAllDom').hide('slow')
                $.getJSON(getServerPath(), {action: "select_place", admin_id: sessionStorage.getItem('username')}, function (json) {
                    //selectDomicilio = json;
                    //sessionStorage.json = JSON.stringify(json);
                    console.log(JSON.stringify(json))
                    $scope.allPlaces = json;
                    $scope.places =  $scope.allPlaces.filter(f => f.place_id == sessionStorage.place_id);
                    
                    $scope.$apply();

                    $.getJSON(getServerPath(), {action: "select_all_settings"}, function (json) {
                        console.log(' settings json: '+JSON.stringify(json));
                        $scope.settings = json;
                        $scope.setting = json.find(f => f.setting_place_id == sessionStorage.place_id);

                        console.log(' setting: '+JSON.stringify($scope.setting));

                        $scope.settingImg = imgPath($scope.setting.redeem_icon);

                        console.log('settingImg: '+$scope.settingImg);
                        $scope.$apply();
                        
                    })

                    $.getJSON(getServerPath(),{action: "select_checkin_options", place_id: sessionStorage.place_id}, function(json){
                        $scope.checkinOptions = json;
                        $scope.checkinImg = imgPath(json.checkin_icon);
                        $scope.$apply();
                        //console.log('checkin img: '+$scope.checkinImg);
                    });

                    $scope.reloadIframe();
                    //$scope.$broadcast('scroll.refreshComplete');
                    //$('#contentAllDom').show('slow')
                    //$('#loadingAllDom').hide('slow')
                })

                
            }

            $scope.search = function(){
                $scope.places =  $scope.allPlaces.filter(f => f.place_id == sessionStorage.place_id);                
            }

            $scope.nameAppUrl = function(p){
                if(p.name_app==""){alert('Aun no se ha establecido la URL correctamente para esta App.'); return;}                
                window.open(baseUrl()+p.name_app, '_blank');
            };

            $scope.set_background = function (place_id, onetwo) {
                var MAX_SIZE = BG_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elige una nueva imagen para actualizar.<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + " MBs, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                var form_data = new FormData();
                                form_data.append('action', 'set_background' + onetwo);
                                form_data.append('img', new_image);
                                form_data.append('place_id', place_id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            $scope.getPersonalizeSettings();
                                            $ionicLoading.hide()
                                            alert('Registrado Correctamente');
                                        } else {
                                            alert(data);
                                            $ionicLoading.hide()
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            };

            $scope.validPhone = function(p){
                return p.business_phone.trim() == ""? "Sin Actualizar" : p.business_phone;
            };
            $scope.validFB = function(p){
                return p.facebook_id.trim() == ""? "Sin Actualizar" : p.facebook_id;
            };

            $scope.validInstagram = function(p){
                return p.instagram_username.trim() == ""? "Sin Actualizar" : p.instagram_username;
            };

            $scope.validHelpLink = function(p){
                return p.help_link.trim() == ""? "Sin Actualizar" : p.help_link;
            };

            $scope.validField = function(p){
                if(p == null) return 'Sin Actualizar';
                return p.trim() == ""? "Sin Actualizar" : p;
            };

            $scope.validText = function(p){
                return p.name_app.trim() == ""? "Sin Actualizar" : p.name_app;
            };

            $scope.set_help = function (place) {
                $scope.help = {};

                $scope.help.link = place.help_link;
                myPopup = $ionicPopup.show({
                    template: '<input type="text" ng-model="help.link" ng-value="help.link" autofocus>',
                    title: 'Editar '+place.help_link,
                    subTitle: 'Actualizar el link del negocio seleccionado',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html'});
                                return $scope.help;
                            }
                        }
                    ]
                });
              
                myPopup.then(function(res){
                    $.get(getServerPath(), {
                        action: 'set_help_link',
                        place_id: place.place_id,
                        help_link: res.link
                    }, function (r) {
                        $ionicLoading.hide()
                        if(r==1)
                        {
                            alert('Link actualizado correctamente');
                            $scope.getPersonalizeSettings();
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                    });
                });
            };

            $scope.set_instagram = function (place) {
                $scope.instagram = {};

                $scope.instagram.username = place.instagram_username;
                myPopup = $ionicPopup.show({
                    template: '<input type="text" ng-model="instagram.username" ng-value="instagram.username" autofocus>',
                    title: 'Editar '+place.instagram_username,
                    subTitle: 'Actualizar el instagram del negocio seleccionado',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html'});
                                return $scope.instagram;
                            }
                        }
                    ]
                });
              
                myPopup.then(function(res){
                    $.get(getServerPath(), {
                        action: 'set_instagram_username',
                        place_id: place.place_id,
                        instagram_username: res.username
                    }, function (r) {
                        $ionicLoading.hide()
                        if(r==1)
                        {
                            alert('Instagram actualizado correctamente');
                            $scope.getPersonalizeSettings();
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                    });
                });
            };

            $scope.set_business_phone = function (place) {
                $scope.business_phone = {};

                $scope.business_phone.phone = place.business_phone;
                myPopup = $ionicPopup.show({
                    template: '<input type="text" ng-model="business_phone.phone" ng-value="business_phone.phone" autofocus>',
                    title: 'Editar '+place.business_name,
                    subTitle: 'Actualizar el telefono del negocio seleccionado',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html'});
                                return $scope.business_phone;
                            }
                        }
                    ]
                });
              
                myPopup.then(function(res){
                    $.get(getServerPath(), {
                        action: 'set_business_phone',
                        place_id: place.place_id,
                        business_phone: res.phone
                    }, function (r) {
                        $ionicLoading.hide()
                        if(r==1)
                        {
                            alert('Telefono actualizado correctamente');
                            $scope.getPersonalizeSettings();
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                    });
                });
            };

            $scope.set_name_app = function (place) {
                $scope.name_app = {};

                $scope.name_app.name_app = place.name_app;
                myPopup = $ionicPopup.show({
                    template: '<input type="text" ng-model="name_app.name_app" ng-value="name_app.name_app" autofocus>',
                    title: 'Editar '+place.name_app,
                    subTitle: 'Actualizar la ruta de la App seleccionada',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html'});
                                return $scope.name_app;
                            }
                        }
                    ]
                });
              
                myPopup.then(function(res){
                    $.get(getServerPath(), {
                        action: 'set_name_app',
                        place_id: place.place_id,
                        name_app: res.name_app
                    }, function (r) {
                        $ionicLoading.hide()
                        if(r==1)
                        {
                            alert('Ruta del app actualizada correctamente');
                            $scope.getPersonalizeSettings();
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                    });
                });
            };

            $scope.set_facebook_id = function (place) {
                $scope.facebook = {};

                $scope.facebook.id = place.facebook_id;
                myPopup = $ionicPopup.show({
                    template: '<input type="number" ng-model="facebook.id" ng-value="facebook.id" autofocus>',
                    title: 'Editar '+place.business_name,
                    subTitle: 'Actualiza el id facebook de su pagina',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html'});
                                return $scope.facebook;
                            }
                        }
                    ]
                });
              
                myPopup.then(function(res){
                    $.get(getServerPath(), {
                        action: 'set_facebook_id',
                        place_id: place.place_id,
                        facebook_id: res.id
                    }, function (r) {
                        $ionicLoading.hide()
                        if(r==1)
                        {
                            alert('Id de Facebook actualizado correctamente');
                            $scope.getPersonalizeSettings();
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                    });
                });
            };

            $scope.set_desk_text = function (place) {
                $scope.desk = {};

                $scope.desk.text = place.desk_text;
                myPopup = $ionicPopup.show({
                    template: '<input type="text" ng-model="desk.text" ng-value="desk.text" autofocus>',
                    title: 'Editar '+place.business_name,
                    subTitle: 'Actualizar el texto del boton',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html'});
                                return $scope.desk;
                            }
                        }
                    ]
                });
              
                myPopup.then(function(res){
                    $.get(getServerPath(), {
                        action: 'set_desk_text',
                        place_id: place.place_id,
                        desk_text: res.text
                    }, function (r) {
                        $ionicLoading.hide()
                        if(r==1)
                        {
                            alert('Texto actualizado correctamente');
                            $scope.getPersonalizeSettings();
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                    });
                });
            };

            $scope.set_pick_text = function (place) {
                $scope.pick = {};

                $scope.pick.text = place.pick_text;
                myPopup = $ionicPopup.show({
                    template: '<input type="text" ng-model="pick.text" ng-value="pick.text" autofocus>',
                    title: 'Editar '+place.business_name,
                    subTitle: 'Actualizar el texto del boton',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html'});
                                return $scope.pick;
                            }
                        }
                    ]
                });
              
                myPopup.then(function(res){
                    $.get(getServerPath(), {
                        action: 'set_pick_text',
                        place_id: place.place_id,
                        pick_text: res.text
                    }, function (r) {
                        $ionicLoading.hide()
                        if(r==1)
                        {
                            alert('Texto actualizado correctamente');
                            $scope.getPersonalizeSettings();
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                    });
                });
            };

            $scope.set_home_text = function (place) {
                $scope.home = {};

                $scope.home.text = place.home;
                myPopup = $ionicPopup.show({
                    template: '<input type="text" ng-model="home.text" ng-value="home.text" autofocus>',
                    title: 'Editar '+place.business_name,
                    subTitle: 'Actualizar el texto del boton',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({ templateUrl: 'dialogs/loader.html'});
                                return $scope.home;
                            }
                        }
                    ]
                });
              
                myPopup.then(function(res){
                    $.get(getServerPath(), {
                        action: 'set_home_text',
                        place_id: place.place_id,
                        home_text: res.text
                    }, function (r) {
                        $ionicLoading.hide()
                        if(r==1)
                        {
                            alert('Texto actualizado correctamente');
                            $scope.getPersonalizeSettings();
                            return;
                        }
                        console.log('response set_home_text: '+r);
                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                    });
                });
            };

            $scope.set_button_color_theme = function (place_id) {
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_color.html',
                    title: 'Elija un Color',
                    subTitle: 'Elige un nuevo color para actualizar',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_color = $.trim($('#new_color').val());
                                var button_color_theme = $scope.HexToRgb(new_color);

                                $.get(getServerPath(), {
                                    action: 'set_button_color_theme',
                                    place_id: place_id,
                                    button_color_theme: button_color_theme
                                }, function (r) {
                                    $ionicLoading.hide()
                                    console.log(r);
                                    var resp = $.trim(r)
                                    if (isNaN(resp)) {
                                        alert('Ha ocurrido un error de nuestro lado');
                                    } else {
                                        if (resp == "1") {
                                            alert('Se ha actualizado el color de botones de tu App.');
                                        } else {
                                            alert('Ha ocurrido un error con la base de datos.');
                                        }
                                    }
                                    $scope.getPersonalizeSettings();
                                });
                            }
                        }
                    ]
                });
            };

            $scope.set_home_square_color = function (place_id) {
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_color.html',
                    title: 'Elija un color',
                    subTitle: 'Actualiza tu pantalla de inicio de la App',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_color = $.trim($('#new_color').val());
                                var home_square_color = $scope.HexToRgb(new_color);

                                $.get(getServerPath(), {
                                    action: 'set_home_square_color',
                                    place_id: place_id,
                                    home_square_color: home_square_color
                                }, function (r) {
                                    $ionicLoading.hide()
                                    console.log(r);
                                    var resp = $.trim(r)
                                    if (isNaN(resp)) {
                                        alert('Ha ocurrido un error de nuestro lado');
                                    } else {
                                        if (resp == "1") {
                                            alert('Se ha actualizado el cuadro de home de tu App.');
                                        } else {
                                            alert('Ha ocurrido un error con la base de datos.');
                                        }
                                    }
                                    $scope.getPersonalizeSettings();
                                })
                            }
                        }
                    ]
                });
            };

            $scope.set_map_img = function (place_id) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elige una nueva imagen (De preferencia con arte simple y plano).<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_map_img');
                                form_data.append('img', new_image);
                                form_data.append('place_id', place_id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        $ionicLoading.hide()
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getPersonalizeSettings();
                                        } else {
                                            alert(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.set_business_logo = function (place_id) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elige un nuevo logo para su empresa.<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_business_logo');
                                form_data.append('img', new_image);
                                form_data.append('place_id', place_id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            $scope.getPersonalizeSettings();
                                            $ionicLoading.hide()
                                            alert('Registrado Correctamente');
                                        } else {
                                            alert(data);
                                            $ionicLoading.hide()
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.set_messenger_img = function (place_id) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elige una nueva imagen (De preferencia con arte simple y plano).<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_messenger_img');
                                form_data.append('img', new_image);
                                form_data.append('place_id', place_id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        $ionicLoading.hide()
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getPersonalizeSettings();
                                        } else {
                                            alert(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.set_scanner_img = function (place_id) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elige una nueva imagen (De preferencia con arte simple y plano).<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_scanner_img');
                                form_data.append('img', new_image);
                                form_data.append('place_id', place_id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        $ionicLoading.hide()
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getPersonalizeSettings();
                                        } else {
                                            alert(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.set_promo_img = function (place_id) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elige una nueva imagen (De preferencia con arte simple y plano).<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                //console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_promo_img');
                                form_data.append('img', new_image);
                                form_data.append('place_id', place_id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        $ionicLoading.hide()
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getPersonalizeSettings();
                                        } else {
                                            alert(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.set_facebook_img = function (place_id) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elige una nueva imagen (De preferencia con arte simple y plano).<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_facebook_img');
                                form_data.append('img', new_image);
                                form_data.append('place_id', place_id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        $ionicLoading.hide()
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getPersonalizeSettings();
                                        } else {
                                            alert(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }



            $scope.set_desk_img = function (place_id) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elige una nueva imagen (De preferencia con arte simple y plano).<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_desk_img');
                                form_data.append('img', new_image);
                                form_data.append('place_id', place_id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        $ionicLoading.hide()
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getPersonalizeSettings();
                                        } else {
                                            alert(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.set_pick_img = function (place_id) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elige una nueva imagen (De preferencia con arte simple y plano).<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_pick_img');
                                form_data.append('img', new_image);
                                form_data.append('place_id', place_id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        $ionicLoading.hide()
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getPersonalizeSettings();
                                        } else {
                                            alert(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.set_home_img = function (place_id) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elige una nueva imagen (De preferencia con arte simple y plano).<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_home_img');
                                form_data.append('img', new_image);
                                form_data.append('place_id', place_id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        $ionicLoading.hide()
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            alert('Registrado Correctamente');
                                            $scope.getPersonalizeSettings();
                                        } else {
                                            alert(data);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }

            $scope.set_bg_app = function (place_id) {
                var MAX_SIZE = LOGO_MAX_SIZE;
                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/insert_background.html',
                    title: 'Inserte una Imagen',
                    subTitle: 'Elige un nuevo para tu App.<br>*Su imagen no debe exceder a ' + MAX_SIZE / 1048576 + 'MB',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function () {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });
                                var new_image = $.trim($('#new_image').val()).length != 0 ? $('#new_image').prop('files')[0] : " ";

                                var IMAGE_SIZE = new_image.size;
                                if (IsValidSize(IMAGE_SIZE, MAX_SIZE) === false) {
                                    alert('La imagen seleccionada es mayor a ' + MAX_SIZE / 1048576 + "MB, debe elegir una imagen de menor tamaño.");
                                    $ionicLoading.hide()
                                    return;
                                }

                                console.log('size image: ' + new_image.size);

                                var form_data = new FormData();
                                form_data.append('action', 'set_background_app');
                                form_data.append('img', new_image);
                                form_data.append('place_id', place_id);
                                $.ajax({
                                    url: getServerPath(),
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: form_data,
                                    type: 'post',
                                    success: function (data) {
                                        var d = $.trim(data);
                                        if (d == '1') {
                                            $scope.getPersonalizeSettings();
                                            $ionicLoading.hide()
                                            alert('Registrado Correctamente');
                                        } else {
                                            alert(data);
                                            $ionicLoading.hide()
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }





            $scope.HexToRgb = function (hex) {
                hex = hex.replace('#', '');
                var r = parseInt(hex.slice(0, 2), 16);
                var g = parseInt(hex.slice(2, 4), 16);
                var b = parseInt(hex.slice(4, 6), 16);
                return 'rgb(' + r + ', ' + g + ', ' + b + ')';
            };

            $scope.change_style_color = function (color) {
                var style = " background-color: " + color;
                style += "; border-color: " + color;
                return style;
            };

            $scope.switchHome = function(turn, p){
                console.log('SWITCH: '+JSON.stringify(+ turn));
                console.log('PLACE: '+JSON.stringify(p));
                $.get(getServerPath(), {
                        action: 'switch_home',
                        place_id: p.place_id,
                        home_order: + turn
                    }, function (r) {
                        if(r==1)
                        {
                            setTimeout(function () {
                                $scope.getPersonalizeSettings();
                            }, 500)
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                        console.log('error: '+JSON.stringify(r));
                });
            }

            $scope.switchDesk = function(turn, p){
                console.log('SWITCH: '+JSON.stringify(+ turn));
                console.log('PLACE: '+JSON.stringify(p));
                $.get(getServerPath(), {
                        action: 'switch_desk',
                        place_id: p.place_id,
                        desk_order: + turn
                    }, function (r) {
                        if(r==1)
                        {
                            setTimeout(function () {
                                $scope.getPersonalizeSettings();
                            }, 500)
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                        console.log('error: '+JSON.stringify(r));
                });
            }



            $scope.switchPick = function(turn, p){
                console.log('SWITCH: '+JSON.stringify(+ turn));
                console.log('PLACE: '+JSON.stringify(p));
                $.get(getServerPath(), {
                        action: 'switch_pick',
                        place_id: p.place_id,
                        pick_order: + turn
                    }, function (r) {
                        if(r==1)
                        {
                            setTimeout(function () {
                                $scope.getPersonalizeSettings();
                            }, 500)
                            return;
                        }

                        alert('Ocurrio un problema, si el registro no guardo intenta nuevamente o contacta a administracion.');
                        console.log('error: '+JSON.stringify(r));
                });
            }

            $scope.gobck = function () {
                $ionicHistory.goBack()
            };

        })
        .controller('settingsCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, $rootScope) {
            checkKey(key);
            validateScope($scope);
            $scope.logout = function () {
                key = '';
                checkKey(key);
            }
            $scope.getDets = function () {
                $('#loadingStores').show('slow')
                $('#contentStores').hide('slow')
                $.getJSON(getServerPath(), {
                    action: 'select_place_locations_det',
                    place_id: sessionStorage.getItem('store_id')
                }, function (json) {
                    $('#loadingStores').hide('slow')
                    $('#contentStores').show('slow')
                    console.log(JSON.stringify(json));
                    $scope.stores = json;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$apply();
                });
            };
            $scope.turnOnTienda = function (id) {
                myPopup = $ionicPopup.show({
                    title: 'Estas seguro que deseas activar esta sucursal para ordenes a domicilio?',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });

                                $.get(getServerPath(), {
                                    action: 'turn_on_home_delivery',
                                    place_location_id: id
                                }, function (r) {
                                    $ionicLoading.hide()
                                    var resp = $.trim(r)
                                    if (isNaN(resp)) {
                                        alert('Ha ocurrido un error de nuestro lado');
                                    } else {
                                        if (resp == "0") {
                                            alert('Ha ocurrido un error o parece que la entrada de datos no es correcta, favor intenta nuevamente.');
                                        } else {
                                            alert('Se ha activado la sucursal.');
                                            $scope.getDets();
                                        }
                                    }
                                })
                            }
                        }]
                });
            };
            $scope.turnOffTienda = function (id) {
                myPopup = $ionicPopup.show({
                    title: 'Estas seguro que deseas desactivar esta sucursal para ordenes a domicilio?',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });

                                $.get(getServerPath(), {
                                    action: 'turn_off_home_delivery',
                                    place_location_id: id
                                }, function (r) {
                                    $ionicLoading.hide()
                                    var resp = $.trim(r)
                                    if (isNaN(resp)) {
                                        alert('Ha ocurrido un error de nuestro lado');
                                    } else {
                                        if (resp == "0") {
                                            alert('Ha ocurrido un error o parece que la entrada de datos no es correcta, favor intenta nuevamente.');
                                        } else {
                                            alert('Se ha desactivado la sucursal.');
                                            $scope.getDets();
                                        }
                                    }
                                })
                            }
                        }]
                });
            }
            $scope.turnOnPick = function (id) {
                myPopup = $ionicPopup.show({
                    title: 'Estas seguro que deseas activar esta sucursal para ordenes a para llevar?',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });

                                $.get(getServerPath(), {
                                    action: 'turn_on_pick_delivery',
                                    place_location_id: id
                                }, function (r) {
                                    $ionicLoading.hide()
                                    var resp = $.trim(r)
                                    if (isNaN(resp)) {
                                        alert('Ha ocurrido un error de nuestro lado');
                                    } else {
                                        if (resp == "0") {
                                            alert('Ha ocurrido un error o parece que la entrada de datos no es correcta, favor intenta nuevamente.');
                                        } else {
                                            alert('Se ha activado la sucursal.');
                                            $scope.getDets();
                                        }
                                    }
                                })
                            }
                        }]
                });
            };
            $scope.turnOffPick = function (id) {
                myPopup = $ionicPopup.show({
                    title: 'Estas seguro que deseas desactivar esta sucursal para ordenes a para llevar?',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Actualizar</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                $ionicLoading.show({
                                    templateUrl: 'dialogs/loader.html',
                                });

                                $.get(getServerPath(), {
                                    action: 'turn_off_pick_delivery',
                                    place_location_id: id
                                }, function (r) {
                                    $ionicLoading.hide()
                                    var resp = $.trim(r)
                                    if (isNaN(resp)) {
                                        alert('Ha ocurrido un error de nuestro lado');
                                    } else {
                                        if (resp == "0") {
                                            alert('Ha ocurrido un error o parece que la entrada de datos no es correcta, favor intenta nuevamente.');
                                        } else {
                                            alert('Se ha desactivado la sucursal.');
                                            $scope.getDets();
                                        }
                                    }
                                })
                            }
                        }]
                });
            }
        })
//functional Classes

function IsValidSize(size, MAX_SIZE) {
    if (size > MAX_SIZE)
        return false;
    return true;
}

function validateEmail(x) {
    var atpos = x.indexOf("@");
    var dotpos = x.lastIndexOf(".");
    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {
        return false;
    } else {
        return true;
    }
}

function getImagePath() {
    //var img = 'http://localhost/ferbyWeb/img/';
    var img = 'https://app.almacenesxtra.com/img/';
    return img
}



var _0x5546 = ["\x68\x74\x74\x70\x3A\x2F\x2F\x66\x65\x72\x62\x79\x2E\x73\x74\x6F\x6C\x7A\x2D\x65\x6E\x67\x69\x6E\x65\x65\x72\x69\x6E\x67\x2E\x63\x6F\x6D\x2F\x77\x73\x2F\x77\x73\x4D\x61\x69\x6E\x2E\x70\x68\x70", "\x68\x74\x74\x70\x3A\x2F\x2F\x66\x65\x72\x62\x79\x2E\x73\x74\x6F\x6C\x7A\x2D\x65\x6E\x67\x69\x6E\x65\x65\x72\x69\x6E\x67\x2E\x63\x6F\x6D\x2F\x69\x6D\x67\x2F", "\x62\x65\x62\x65\x39\x66\x66\x34\x65\x62\x39\x36\x64\x62\x32\x38\x62\x33\x62\x61\x35\x36\x33\x39\x65\x63\x64\x33\x33\x37\x34\x62\x38\x35\x33\x32\x35\x66\x39\x63", "\x6C\x6F\x63\x61\x74\x69\x6F\x6E", "\x23\x2F\x6C\x6F\x67\x69\x6E"];


function getImagePath() {
    //var img = 'http://localhost/ferbyWeb/img/';
    var img = 'https://app.almacenesxtra.com/img/';
    return img
}

function getServerKey() {
}

function checkKey() {
}
//  function getServerPath() {
//      var _0xa847x2 = _0x5546[0];
//      return _0xa847x2
//  }
//  function getImagePath() {
//      var _0xa847x4 = _0x5546[1];
//      return _0xa847x4
//  }
function getServerKey() {
    return _0x5546[2]
}
function checkKey(_0xa847x7) {
    if (_0xa847x7 == _0x5546[2]) {
        return true
    } else {
        window[_0x5546[3]] = _0x5546[4]
    }
}
