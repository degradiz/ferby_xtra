var purchMin, places, ctName, sendType, precioBase, menuarray, catarray, specialCatArray, typeActionArray, promoarray, optionsArray, galleryArray, xhr, gbDesk, lat, lon, politics, selectDomicilio, homeOrder, deliveryType, plName;
var hasOrder = 'false';
var isOnline = 0;
var membership = '1';
var menuType = '';
var chatmode = 0;
var auth_place_id = '4';
var Theme_id = 4;
var loaded = 0;
var myPopup = {};
var rev = 0;
var modo = 0; 
var raspado = 0;

angular.module('starter.controllers', ["ion-datetime-picker"])
.controller('trackOrdersCtrl', function($scope, $ionicLoading, $state, $ionicPopup){
    if(loaded==0)
        $state.go('loginBill');
    $scope.logoImage = getImgPath() + localStorage.getItem('th_business_logo')
    $scope.orders = [];

    buildScopeStyleSettings($scope);

    $scope.untrackOrder = function(b){
        myPopup = $ionicPopup.show({
            title: 'Eliminar registro',
            subTitle: 'La orden no será eliminada, solamente el registro de forma permanente a este dispositivo.',
            scope: $scope,
            buttons: [
            {text: 'Cancelar'},
            {
                text: '<b>Ok</b>',
                type: 'button-stable',
                onTap: function (e) {
                    $ionicLoading.show({ templateUrl: 'dialogs/loader.html' });

                    $.get(getServerPath(), {
                        action: 'untrack_order',
                        bill_id: b.bill_id
                    }, function (r) {
                        $ionicLoading.hide()
                        console.log(r);
                        var resp = $.trim(r)
                        if (resp==1) {
                            alert('Registro eliminado correctamente');
                            $scope.getTrackinOrders();
                            return;
                        }

                        alert('Ocurrió un problema con el servidor');
                    })
                }
            }
            ]
        });
    }
    
    $scope.goToHome = function(){
        $state.go('side.loginBill');
    }

    $scope.openwa = function () {
        window.location = "https://api.whatsapp.com/send?phone=" + localStorage.th_phone
    }

    setTimeout(function () {
        $('.banner').css("background-image", "url(" + getImgPath() + localStorage.getItem('th_business_background1') + ")")
    }, 200)
    setTimeout(function () {
        $('#floating-menu').addClass('active');
    }, 2000)

    $('.buttonUI').css('background', localStorage.getItem('th_button_color_theme'))
    $('#crcButton').css('background', localStorage.getItem('th_button_color_theme'))

        $scope.getTrackinOrders = function () { //Función que llama al WS el action get_user_points que devuelve los puntos acumulados por la identidad guardada previamente en la caché user_id
            $ionicLoading.show({
                templateUrl: 'dialogs/loader.html'
            })
            
            $.get(getServerPath(), {
                action: 'track_id_orders',
                track_id: localStorage.track_id,
                place_id: Theme_id
            }, function (resp) {
                $scope.orders = JSON.parse(resp);
                console.log('orders: '+$scope.orders)
                //var resp = $.trim(resp);                
                $scope.$apply();
                $ionicLoading.hide();
            });
        }

        $scope.editCheckinUser = function () {
            $state.go('side.query-checkin');
        }

    })
.controller('stampsCtrl', function($scope, $ionicLoading, $state){
    if(loaded==0)
        $state.go('loginBill');
    $scope.logoImage = getImgPath() + localStorage.getItem('th_business_logo')
    $scope.stamps = [];
    $scope.user = {}


    buildScopeStyleSettings($scope);
    
    $scope.goToHome = function(){
        $state.go('loginBill');
    }

    $scope.openwa = function () {
        window.location = "https://api.whatsapp.com/send?phone=" + localStorage.th_phone
    }

    setTimeout(function () {
        $('.banner').css("background-image", "url(" + getImgPath() + localStorage.getItem('th_business_background1') + ")")
    }, 200)
    setTimeout(function () {
        $('#floating-menu').addClass('active');
    }, 2000)

    $('.buttonUI').css('background', localStorage.getItem('th_button_color_theme'))
    $('#crcButton').css('background', localStorage.getItem('th_button_color_theme'))

        $scope.getStamps = function () { //Función que llama al WS el action get_user_points que devuelve los puntos acumulados por la identidad guardada previamente en la caché user_id
            $ionicLoading.show({
                templateUrl: 'dialogs/loader.html'
            })
            $scope.user.identidad = localStorage.user_id;
            $.get(getServerPath(), {
                action: 'get_user_checkins',
                username: localStorage.user_id,
                place_id: Theme_id
            }, function (resp) {
                //var resp = $.trim(resp);
                //$scope.stamps = new Array(6);
                for (var i = resp - 1; i >= 0; i--) {
                    $scope.stamps.push({stamp: "stamp"})
                }
                //$scope.userPoints = resp;// PARA QUE LOS PUNTOS DEN RESULTADO EN SU CALCULO DEBE EXISTIR LOS REGISTROS DEL PLACE EN LA TABLA ALLIANCE Y PLACE_ALLIANCE
                $scope.$apply();
                $ionicLoading.hide();
            });
        }

        $scope.editCheckinUser = function () {
            $state.go('side.query-checkin');
        }

    })
.controller('listEventsCtrl', function($scope, $state, $rootScope, $ionicModal){
    checkKey($state);
    $scope.wi = $(document).width();
    buildScopeStyleSettings($scope);
    $scope.events = [];
    $scope.fullImageSrc = {};
    $scope.openModal = function (scope) {
        $ionicModal.fromTemplateUrl('dialogs/image-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });

    };

    $scope.closeModal = function () {
        $scope.modal.hide();
    };


    $scope.modalImage = function(img) {
        $scope.fullImageSrc = $rootScope.basePath+img;

        $scope.openModal();
    }

    setTimeout(function () {
        $('.buttonUI').css('background-color', localStorage.getItem('th_button_color_theme'))

        $('#bck3cat').css("background-image", "url(" + getImgPath() + localStorage.getItem('th_business_background1') + ")")
    }, 500)

    $scope.eventInit = function(){
        console.log('coupon init');
        $.getJSON(getServerPath(), {
            action: 'select_cupon_code',
            place_id: Theme_id
        }, function (r) {
            console.log('r: '+JSON.stringify(r));
            $scope.events = r.filter(f => f.cupon_type == 2 && f.cupon_status == 0);
            $scope.$apply();
        });    
    }

})    
.controller('listCouponsCtrl', function($scope, $state, $rootScope, $ionicModal){

   localStorage.showCuponBadge = 0;
   localStorage.contadorCupones = 0;

    checkKey($state);
    $scope.wi = $(document).width();
    buildScopeStyleSettings($scope);
    $scope.coupons = [];
    $scope.fullImageSrc = {};
    $scope.openModal = function (scope) {
        $ionicModal.fromTemplateUrl('dialogs/image-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });

    }; 

    $scope.closeModal = function () {
        $scope.modal.hide();
    };


    $scope.modalImage = function(img) {
        $scope.fullImageSrc = $rootScope.basePath+img;

        $scope.openModal();
    }

    setTimeout(function () {
        $('.buttonUI').css('background-color', localStorage.getItem('th_button_color_theme'))

        $('#bck3cat').css("background-image", "url(" + getImgPath() + localStorage.getItem('th_business_background1') + ")")
    }, 500)

    $scope.couponInit = function(){
        console.log('coupon init');
            //asignar si no tiene asignado
            $.getJSON(getServerPath(), {
                action: 'select_cupon_code_uuid',
                place_id: Theme_id ,
                uuid: device.uuid
            }, function (r) {
                //console.log('r: '+JSON.stringify(r));
                $scope.coupons = r.filter(f => f.cupon_type == 1 && f.cupon_status == 0);
                $scope.$apply();

                setTimeout(function(){
                    for (var i = 0; i < $scope.coupons.length;  i++ ){
                        //console.log($scope.coupons)
                           //console.log($scope.coupons[i].cupon_code)
                           var cuponcd = "#" + $scope.coupons[i].cupon_code
                           //console.log(cuponcd);
                           JsBarcode("#barcd" + i , $scope.coupons[i].cupon_code, {format: "CODE128",displayValue: false});

                       }
                   },2000)
                $scope.$apply();
            });    
        }
    })

.controller('listScratchCtrl', function($scope, $ionicPopup,$ionicLoading, $state, $rootScope, $ionicModal){

   localStorage.showRaspablesBadge = 0;
   localStorage.contadorRaspables = 0;

    checkKey($state);
    $scope.wi = $(document).width();
    buildScopeStyleSettings($scope);
    $scope.raspables = [];
    $scope.fullImageSrc = {};
    $scope.openModal = function (scope) {
        $ionicModal.fromTemplateUrl('dialogs/image-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });

    }; 

    $scope.closeModal = function () {
        $scope.modal.hide();
    };



    $scope.openScratch = function(){
       
            if (localStorage.isguest == 0){
                $state.go('side.list-scratch');
            }else{
                alert("Esta opcion es solo para usuarios registrados");
            }
            
    }

    $scope.openAssignScratch = function(scratch_id){
        //console.log('number lottery init');
            if (localStorage.isguest == 0){
                localStorage.setItem('scratch_id', scratch_id);
                $state.go('side.list-scratch-assign');
            }else{
                alert("Esta opcion es solo para usuarios registrados");
            }
            
    }

    $scope.reclamarscratch = function(scratch_id,generated_id){
        console.log('Reclamar ' + scratch_id + ' - ' + generated_id);

        var resp = 0;

        myPopup = $ionicPopup.show({
                template: '<label>Clave</label> <input type="password" id="passtienda" autofocus="true">',
                title: 'Reclamar',
                subTitle: '',
                scope: $scope,
                buttons: [
                { text: 'Cancelar',type: 'button-assertive' },
                {
                    text: 'Aceptar',
                    type: 'button button-balanced',
                    onTap: function (e) {
                        passtienda = $('#passtienda').val();
                        

                        $ionicLoading.show({
                            templateUrl: 'dialogs/loader.html'
                        })


                        $.getJSON(getServerPath(), {
                            action: 'reclamarscratch',
                            identidad: localStorage.user_id,
                            scratch_id: scratch_id,
                            scratch_generated_id: generated_id,
                            clave: passtienda
                        }, function (r) {
                            //console.log('r: '+JSON.stringify(r));
                            $scope.reclamados = r;
                            $scope.$apply();
                            // console.log($scope.reclamados);
                            resp = $.trim($scope.reclamados)
                            $ionicLoading.hide()
                            console.log('resp: ' + resp);
                            if (resp == 1) {
                                customizeAlert('Raspable reclamado correctamente');
                                $scope.scratchassignInit();
                                return;
                            }

                            customizeAlert('Error de validación');

                        });  
                        
                    }
                }
                ]
            });
       
    }


    $scope.modalImage = function(img) {

        $scope.fullImageSrc = baseUrl()+'v2/assets/uploads/img/scratch/'+img;

        $scope.openModal();
    }

    setTimeout(function () {
        $('.buttonUI').css('background-color', localStorage.getItem('th_button_color_theme'))

        $('#bck3cat').css("background-image", "url(" + getImgPath() + localStorage.getItem('th_business_background1') + ")")
    }, 500)

    $scope.scratchInit = function(){
        $scope.basePath = baseUrl()+'v2/assets/uploads/img/scratch/';
        console.log('scratch init');
            //listar los que aun no ha raspado y los que tiene premiados sin reclamar
            $.getJSON(getServerPath(), {
                action: 'select_scratch',
                identidad: localStorage.user_id
            }, function (r) {
                //console.log('r: '+JSON.stringify(r));
                $scope.raspables = r;
                $scope.$apply();

                setTimeout(function(){
                    for (var i = 0; i < $scope.raspables.length;  i++ ){
                        //console.log($scope.raspables)
                           //console.log($scope.raspables[i].generated_id)
                           var raspablecd = "#" + $scope.raspables[i].generated_id
                           //console.log(cuponcd);
                           JsBarcode("#barcd" + i , $scope.raspables[i].generated_id, {format: "CODE128",displayValue: false});

                       }
                   },2000)
                $scope.$apply();
            });    
        }

    $scope.scratchassignInit = function(){
   raspado = 0
        $scope.basePath = baseUrl()+'v2/assets/uploads/img/scratch/';
        console.log('scratch assign init');
            //listar los que aun no ha raspado y los que tiene premiados sin reclamar
            $.getJSON(getServerPath(), {
                action: 'select_scratch_identidad',
                identidad: localStorage.user_id,
                scratch_id: localStorage.getItem('scratch_id')
            }, function (r) {
               
                console.log('r: '+JSON.stringify(r));
                $scope.raspables = r;
                $scope.$apply();
           
                setTimeout(function(){
                   
                    initScratch("scratch-container")
                    for (var i = 0; i < $scope.raspables.length;  i++ ){
                          // var $scratchit = $('#scratchit'+i).scratchIt();
                       }

                   },1000)
                $scope.$apply();
            });    
        }

    $scope.openScratchGenerated = function(scratched_id,scratch_generated_id){
        //console.log('number lottery init');
            if (localStorage.isguest == 0){
                localStorage.setItem('generated_scratched_id', scratch_generated_id);
                localStorage.setItem('scratched_id', scratched_id);
                $state.go('side.scratch');
            }else{
                alert("Esta opcion es solo para usuarios registrados");
            }
            
    }


    

    $scope.getScratchGenerated = function(){
  
        $scope.basePath = baseUrl()+'v2/assets/uploads/img/scratch/';
        console.log('scratch assign init');
            //listar los que aun no ha raspado y los que tiene premiados sin reclamar
            $.getJSON(getServerPath(), {
                action: 'select_scratch_generated',
                identidad: localStorage.user_id,
                scratch_id: localStorage.getItem('scratch_generated_id'),
                generated_id: localStorage.getItem('generated_scratched_id')
            }, function (r) {
               
                console.log('r: '+JSON.stringify(r));
                $scope.raspables = r;
                $scope.$apply();
                setTimeout(function(){
                   
                    initScratch("scratch-container")
                    for (var i = 0; i < $scope.raspables.length;  i++ ){
                          // var $scratchit = $('#scratchit'+i).scratchIt();
                       }

                   },1000)
                $scope.$apply();
                
            });    
    }
        

    })

.controller('listLotteryCtrl', function($scope, $state, $rootScope, $ionicModal){

   localStorage.showRifasBadge = 0;
   localStorage.contadorRifas = 0;

    checkKey($state);
    $scope.wi = $(document).width();
    buildScopeStyleSettings($scope);
    $scope.rifas = [];
    $scope.fullImageSrc = {};
    $scope.openModal = function (scope) {
        $ionicModal.fromTemplateUrl('dialogs/image-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });

    }; 

    $scope.closeModal = function () {
        $scope.modal.hide();
    };


    $scope.modalImage = function(img) {
        
        $scope.fullImageSrc = baseUrl()+'v2/assets/uploads/img/scratch/'+img;

        $scope.openModal();
    }

     $scope.openNumberLottery = function(lottery_id){
        //console.log('number lottery init');
            if (localStorage.isguest == 0){
                localStorage.setItem('lottery_id', lottery_id);
                $state.go('side.list-number-lottery');
            }else{
                alert("Esta opcion es solo para usuarios registrados");
            }
            
    }

    $scope.openLottery = function(){
        //console.log('number lottery init');
            if (localStorage.isguest == 0){
                //localStorage.setItem('lottery_id', lottery_id);
                $state.go('side.list-lottery');
            }else{
                alert("Esta opcion es solo para usuarios registrados");
            }
            
    }

    $scope.numberlotteryInit = function(){


        $scope.basePath = baseUrl()+'v2/assets/uploads/img/lottery/';
        console.log('number lottery init');
            //listar los que aun no ha raspado y los que tiene premiados sin reclamar
            $.getJSON(getServerPath(), {
                action: 'select_number_lottery_identidad',
                identidad: localStorage.user_id,
                lottery: localStorage.getItem('lottery_id')
            }, function (r) {
                //console.log('r: '+JSON.stringify(r));
                $scope.numeros_rifa = r;
                $scope.$apply();

            }); 

    }

    setTimeout(function () {
        $('.buttonUI').css('background-color', localStorage.getItem('th_button_color_theme'))

        $('#bck3cat').css("background-image", "url(" + getImgPath() + localStorage.getItem('th_business_background1') + ")")
    }, 500)

    $scope.lotteryInit = function(){
        $scope.basePath = baseUrl()+'v2/assets/uploads/img/lottery/';
        console.log('lottery init');
            //listar los que aun no ha raspado y los que tiene premiados sin reclamar
            $.getJSON(getServerPath(), {
                action: 'select_lottery_identidad',
                identidad: localStorage.user_id
            }, function (r) {
                //console.log('r: '+JSON.stringify(r));
                $scope.rifas = r;
                $scope.$apply();

                setTimeout(function(){
                    for (var i = 0; i < $scope.rifas.length;  i++ ){
                        //console.log($scope.rifas)
                         //  console.log($scope.rifas[i].rifa)
                          // var rifacd = "#" + $scope.rifas[i].numero
                         //  console.log(rifacd);
                         //  JsBarcode("#barcd" + i ,  $scope.rifas[i].numero, {format: "CODE128",displayValue: false});

                       }
                   },2000)
                $scope.$apply();
            });    
        }
    })

.controller('listPromosCtrl', function($scope, $state, $rootScope, $ionicModal){
    localStorage.showPromosBadge = 0
    checkKey($state);
    localStorage.contadorPromos = 0;
    $scope.wi = $(document).width();
    buildScopeStyleSettings($scope);
    $scope.promos = [];
    $scope.fullImageSrc = {};
    $scope.openModal = function (scope) {
        $ionicModal.fromTemplateUrl('dialogs/image-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });

    };

    $scope.closeModal = function () {
        $scope.modal.hide();
    };


    $scope.modalImage = function(img) {
        $scope.fullImageSrc = $rootScope.basePath+img;

        $scope.openModal();
    }


    setTimeout(function () {
        $('.buttonUI').css('background-color', localStorage.getItem('th_button_color_theme'))

        $('#bck3cat').css("background-image", "url(" + getImgPath() + localStorage.getItem('th_business_background1') + ")")
    }, 500)

    $scope.promoInit = function(){
        console.log('promo init');
        $.getJSON(getServerPath(), {
            action: 'select_promotions',
            place_id: Theme_id
        }, function (r) {
            console.log('r: '+JSON.stringify(r));
            $scope.promos = r;
            $scope.$apply();
        });    
    }

})
.controller('add_user_idCtrl', function ($scope, $state) {
    if(loaded==0)
        $state.go('loginBill');
    localStorage.place_location = '{}';
    buildScopeStyleSettings($scope);

    $scope.goToHome = function(){
        $state.go('loginBill');
    }

    $scope.openwa = function () {
        window.location = "https://api.whatsapp.com/send?phone=" + localStorage.th_phone
    }
    setTimeout(function () {
        $('.banner').css("background-image", "url(" + getImgPath() + localStorage.getItem('th_business_background1') + ")")
    }, 200)
    setTimeout(function () {
        $('#floating-menu').addClass('active');
    }, 2000)

    $('.buttonUI').css('background', localStorage.getItem('th_button_color_theme'))
    $('#crcButton').css('background', localStorage.getItem('th_button_color_theme'))

    $scope.add_user_id_init = function () {
        $scope.identidad = localStorage.user_id;
            //$scope.$apply();
        }
        $scope.faq = function () {
            var ref = window.open('https://app.almacenesxtra.com:8888/preguntas-frecuentes-nichas-coins/', '_blank', 'location=no');
        }
        $scope.cleanForm = function () {
            $('#user_id').val('');
        }

        $scope.updateUserId = function () {

            var user_id = $('#user_id').val(); //Captura el número de identidad

            var validate = validateGiftUser(user_id);
            if (validate != true) {
                alert(validate);
                return;
            }
            localStorage.identidad = user_id;
            localStorage.user_id = user_id;

            $state.go('side.view_user_points');
        }


    })
.controller('view_user_pointsCtrl', function ($scope, $state, $ionicLoading) {
    if(loaded==0)
        $state.go('loginBill');
    buildScopeStyleSettings($scope);
    
    $scope.goToHome = function(){
        $state.go('loginBill');
    }

    $scope.openwa = function () {
        window.location = "https://api.whatsapp.com/send?phone=" + localStorage.th_phone
    }

    setTimeout(function () {
        $('.banner').css("background-image", "url(" + getImgPath() + localStorage.getItem('th_business_background1') + ")")
    }, 200)
    setTimeout(function () {
        $('#floating-menu').addClass('active');
    }, 2000)

    $('.buttonUI').css('background', localStorage.getItem('th_button_color_theme'))
    $('#crcButton').css('background', localStorage.getItem('th_button_color_theme'))

    $scope.view_user_points_init = function () {
        $scope.identidad = localStorage.user_id;
        $scope.getPoints();         
    }

    $scope.faq = function () {
        var ref = window.open('https://app.almacenesxtra.com:8888/preguntas-frecuentes-nichas-coins/', '_blank', 'location=no');
    }

        $scope.getPoints = function () { //Función que llama al WS el action get_user_points que devuelve los puntos acumulados por la identidad guardada previamente en la caché user_id
            $ionicLoading.show({
                templateUrl: 'dialogs/loader.html'
            })
            $.get(getServerPath(), {
                action: 'get_user_points',
                username: localStorage.user_id,
                place_id: Theme_id
            }, function (resp) {
                var resp = $.trim(resp);
                $scope.userPoints = resp;// PARA QUE LOS PUNTOS DEN RESULTADO EN SU CALCULO DEBE EXISTIR LOS REGISTROS DEL PLACE EN LA TABLA ALLIANCE Y PLACE_ALLIANCE
                $scope.$apply();
                $ionicLoading.hide();
            });
        }

        $scope.editUserId = function () {
            $state.go('side.add_user_id');
        }
    })
.controller('queryCheckinCtrl', function ($scope, $state) {
    if(loaded==0)
        $state.go('loginBill');
    localStorage.place_location = '{}';
    $scope.user = {}
    buildScopeStyleSettings($scope);

    $scope.goToHome = function(){
        $state.go('loginBill');
    }

    $scope.openwa = function () {
        window.location = "https://api.whatsapp.com/send?phone=" + localStorage.th_phone
    }
    setTimeout(function () {
        $('.banner').css("background-image", "url(" + getImgPath() + localStorage.getItem('th_business_background1') + ")")
    }, 200)
    setTimeout(function () {
        $('#floating-menu').addClass('active');
    }, 2000)

    $('.buttonUI').css('background', localStorage.getItem('th_button_color_theme'))
    $('#crcButton').css('background', localStorage.getItem('th_button_color_theme'))

    $scope.queryCheckinInit = function () {
        $scope.user.identidad = localStorage.user_id;
            //$scope.$apply();
        }
        $scope.faq = function () {
            var ref = window.open('https://app.almacenesxtra.com:8888/preguntas-frecuentes-nichas-coins/', '_blank', 'location=no');
        }
        $scope.cleanForm = function () {
            $scope.user = {};
        }

        $scope.queryUserCheckins = function () {


            var validate = validateCheckinUser($scope.user.identidad);
            if (validate != true) {
                alert(validate);
                return;
            }
            localStorage.identidad = $scope.user.identidad;
            localStorage.user_id = $scope.user.identidad;

            $state.go('side.stamps');
        }


    })
.controller('viewUserCheckinsCtrl', function ($scope, $state, $ionicLoading) {
    if(loaded==0)
        $state.go('loginBill');
    buildScopeStyleSettings($scope);
    
    $scope.goToHome = function(){
        $state.go('loginBill');
    }

    $scope.openwa = function () {
        window.location = "https://api.whatsapp.com/send?phone=" + localStorage.th_phone
    }

    setTimeout(function () {
        $('.banner').css("background-image", "url(" + getImgPath() + localStorage.getItem('th_business_background1') + ")")
    }, 200)
    setTimeout(function () {
        $('#floating-menu').addClass('active');
    }, 2000)

    $('.buttonUI').css('background', localStorage.getItem('th_button_color_theme'))
    $('#crcButton').css('background', localStorage.getItem('th_button_color_theme'))

    $scope.viewUserCheckinsInit = function () {
        $scope.identidad = localStorage.user_id;
        $scope.getPoints();         
    }

    $scope.faq = function () {
        var ref = window.open('https://app.almacenesxtra.com:8888/preguntas-frecuentes-nichas-coins/', '_blank', 'location=no');
    }

        $scope.getPoints = function () { //Función que llama al WS el action get_user_points que devuelve los puntos acumulados por la identidad guardada previamente en la caché user_id
            $ionicLoading.show({
                templateUrl: 'dialogs/loader.html'
            })
            $.get(getServerPath(), {
                action: 'get_user_checkins',
                username: localStorage.user_id,
                place_id: Theme_id
            }, function (resp) {
                var resp = $.trim(resp);
                $scope.userPoints = resp;// PARA QUE LOS PUNTOS DEN RESULTADO EN SU CALCULO DEBE EXISTIR LOS REGISTROS DEL PLACE EN LA TABLA ALLIANCE Y PLACE_ALLIANCE
                $scope.$apply();
                $ionicLoading.hide();
            });
        }

        $scope.editCheckinUser = function () {
            $state.go('side.query-checkin');
        }
    })
.controller('contactUsCtrl', function ($scope, $state) {


    var h = $(window).height() * 0.93;
    var w = $(window).width();
    $('#mContact').css('height', h);
    $('#mContact').css('width', w);
    $('#mContact').attr("src", localStorage.getItem("urlStore"));
})
.controller('placeMapCtrl', function ($scope, $state) {
    Waves.attach('button')
    Waves.attach('.waves-block')
    Waves.init();
    var geoUrl = ""
    $scope.openPureMap = function () {
        window.location = geoUrl;
    }
    $scope.inicio = function () {
            //lat = 1;
            //lon = 1;
            $scope.latitude = lat;
            $scope.longitude = lon;
            geoUrl = 'geo:0,0?q=' + lat + ',' + lon + ' (' + plName + ');'
            var zoom = 16;
            var e = new google.maps.LatLng(lat, lon), t = { zoom: zoom, center: e, panControl: !0, scrollwheel: !1, scaleControl: !0, overviewMapControl: !0, overviewMapControlOptions: { opened: !0 }, mapTypeId: google.maps.MapTypeId.ROADMAP };
            map = new google.maps.Map(document.getElementById("map"), t), geocoder = new google.maps.Geocoder, marker = new google.maps.Marker({ position: e, map: map }), map.streetViewControl = !1, infowindow = new google.maps.InfoWindow({ content: "(1.10, 1.10)" }), google.maps.event.addListener(map, "click", function (e) {
                marker.setPosition(e.latLng);
                var t = e.latLng, o = "(" + t.lat().toFixed(6) + ", " + t.lng().toFixed(6) + ")";
                infowindow.setContent(o), document.getElementById("lat").value = t.lat().toFixed(6), document.getElementById("lng").value = t.lng().toFixed(6), document.getElementById("latlngspan").innerHTML = o, document.getElementById("coordinatesurl").value = "http://www.latlong.net/c/?lat=" + t.lat().toFixed(6) + "&long=" + t.lng().toFixed(6), document.getElementById("coordinateslink").innerHTML = '&lt;a href="http://www.latlong.net/c/?lat=' + t.lat().toFixed(6) + "&amp;long=" + t.lng().toFixed(6) + '" target="_blank"&gt;(' + t.lat().toFixed(6) + ", " + t.lng().toFixed(6) + ")&lt;/a&gt;", dec2dms()
            }), google.maps.event.addListener(map, "mousemove", function (e) {
                var t = e.latLng;
                document.getElementById("mlat").innerHTML = "(" + t.lat().toFixed(6) + ", " + t.lng().toFixed(6) + ")"
            })
        }
    })
.controller('homeOrderPlacesCtrl', function ($scope, $state, $ionicLoading) {
    Waves.attach('button')
    Waves.attach('.waves-block')
    Waves.init();
    $scope.getPlaces = function () {

        xhr = $.ajax({
            url: getServerPath() + "?action=select_Filt_Locations&filt=" + auth_place_id,
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            type: 'get',
            success: function (data) {
                var res = alasql('SELECT * FROM ? WHERE home_order = "1" ', [data]);
                $scope.places = res;
                $scope.$apply();
            },
            error: function (d) {
                $ionicLoading.hide();
            },
        });
    }

    $scope.goToRest = function (place_loc, terms) {
        localStorage.setItem('place_loc', place_loc)
        menuType = 'HOMEDELIVERY';
        politics = terms;
        $state.go('welcome');
    }

    $scope.goToMap = function (latitud, longitud, id) {
        lat = latitud;
        lon = longitud;
        plName = $("#plName" + id).text();
        $state.go('side.placeMap')
    }
})
.controller('sideCtrl', function ($scope, $state, $ionicHistory, $rootScope, $ionicSideMenuDelegate, $ionicPopover,$ionicLoading) {

$rootScope.$on("UpdatePuntos", function () {
     $scope.updatePuntos();
});

$scope.isguest = localStorage.isguest;
setTimeout(function(){
 $scope.$apply();
},1500)

 $scope.popover3 = $ionicPopover.fromTemplate('<ion-popover-view><div style="width:100%;background-color:red;color:white">Xtra Cash</div><div style="width:100%"><p style="width:100%;text-align:center">Actualmente tienes</p><br><div style="width:100%"><p id="puntos" style="width:100%;font-size:38px;text-align:center"></p></div><br><img style="width:50%;margin-left:25%" src="./images/moneda.png" /></div><p style="text-align:center;font-size:12px">1 Xtra Cash equivale a 1 Lempira</p><ul class="list"><li class="item"><a href="#/enterClient" class="button button-assertive">Cambiar de Usuario</a><a href="#/politicas"><br ><img style="width:20px" src="./img/politicas.png" /><span style="line-heigth:50px">Politicas de Uso</span></a></li></ul><br></ion-popover-view>');
   $scope.openPopover = function($event) {
  
      $scope.popover3.show($event);
      setTimeout(function(){
        $("#puntos").empty();
        $("#puntos").text(localStorage.puntosActuales);
      },150)
  };

  $scope.updatePuntos = function(){
    $ionicLoading.show({
                templateUrl: 'dialogs/loader.html'
            })
    $.get(getServerPath(), {
                action: 'get_user_points',
                username: localStorage.user_id,
                place_id: Theme_id
            }, function (resp) {
                alert("¡Puntos Actualizado!")
                $ionicLoading.hide()
                localStorage.puntosActuales = resp;
            });
  }

  $scope.closePopover = function() {
      $scope.popover3.hide();
  };

   //Cleanup the popover when we're done with it!
   $scope.$on('$destroy', function() {
      $scope.popover3.remove();
  });

   // Execute action on hide popover
   $scope.$on('popover.hidden', function() {
      // Execute action
  });

   // Execute action on remove popover
   $scope.$on('popover.removed', function() {
      // Execute action
  });
   Waves.attach('button')
   Waves.attach('.waves-block')
   Waves.init();
   $scope.id = localStorage.getItem('id');
   $scope.wa = {};
   $scope.wa.phone = (localStorage.th_phone !== undefined && localStorage.th_phone !== 'undefined')? localStorage.th_phone : '';

   $rootScope.$on("getSide", function () {
    $scope.init();
});

   $scope.$watch(function () {
    return $ionicSideMenuDelegate.getOpenRatio();
}, function (value) {
    if ($ionicSideMenuDelegate.getOpenRatio() == '1') {

    } else {
    }
})

   setTimeout(function () {
    $('#floating-menu').addClass('active');
}, 2000)

   $scope.openwa = function () {
    window.location = "https://api.whatsapp.com/send?phone=" + localStorage.th_phone
}

$scope.back = function(){
    $state.go('loginBill');
}

$scope.goToHome = function(){
    $state.go('loginBill');
}

$scope.init = function () {
    var fbProfile = "https://graph.facebook.com/" + localStorage.getItem('id') + "/picture?type=large"
    $scope.name = localStorage.getItem('name');
    $("#fbProfileImage").attr('src', fbProfile);
    $scope.unread = localStorage.getItem('unreadTotal');
    $scope.getServices();
    getPoints($scope);

            //$scope.getPoints(); // Obtener puntos para mostrarlos en el SideBar
            //$scope.$apply();

            $('#bck2Side').css("background-image", "url(" + getImgPath() + localStorage.getItem('th_business_background1') + ")")
        }

        $scope.getServices = function () {
            $scope.logoImage = getImgPath() + localStorage.getItem('place_logo')

            xhr = $.ajax({
                url: getServerPath() + "?action=getAllServices&tipo_menu=" + GetTipoMenu(menuType) + "&place_id=" + Theme_id,
                dataType: 'text',
                cache: false,
                contentType: false,
                processData: false,
                type: 'get',
                success: function (resp) {
                    console.log('ws: '+getServerPath() + "?action=getAllServices&tipo_menu=" + GetTipoMenu(menuType) + "&place_id=" + Theme_id)
                    var obj = JSON.parse(resp);
                    catarray = obj.getCatMenu;
                    menuarray = obj.select_menu_rest;
                    localStorage.menuarray = JSON.stringify(menuarray);
                    promoarray = obj.getPromos;
                    galleryArray = obj.select_place_images;
                    optionsArray = obj.select_options;
                    //$rootScope.$emit("getPromos", {});
                    //$rootScope.$emit("getCategories", {});
                    //$rootScope.$emit("getMenuDet", {});

                },
                error: function (d) {
                    if (request.statusText == 'abort') {
                        return;
                    }
                    customizeAlert('We could not connect to Ferby, please check your internet connection');
                },
                timeout: 7000
            });

        }


        $scope.chat = function () {
            chatmode = 1
            localStorage.setItem('openMode', 1);
            $state.go('side.chats')
        }
        $scope.submenu = function () {
            $state.go('side.submenu')
        }

        $scope.contactUs = function () {
            $state.go('side.contactUs')
        }

        $scope.homeOrder = function () {
            $state.go('side.homeOrderPlaces')
        }


    })

.controller('notifCtrl',function($scope, $ionicPopup, $state, $ionicHistory,$ionicLoading){
    try{
            localStorage.contadorNotificaciones = 0; 
            var jss = JSON.parse(localStorage.notificaciones);
            $scope.notif = jss.reverse();
            $scope.$apply();
    }catch(e){
        //alert(e.message);
    }

})

.controller('loginBillCtrl', function ($ionicPopover,$scope, $ionicPopup, $state, $ionicHistory, $ionicModal, $ionicBackdrop, $ionicLoading, $rootScope, $ionicPlatform) {

$scope.rateme = function(){
        setTimeout(function(){
                $ionicPopup.show({
                templateUrl: 'dialogs/rate.html',
                title: 'Regálanos 5 estrellas',
                scope: $scope,
                buttons: [
                { text: 'Después' },
                {
                    text: '<b>Claro!</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        window.location = "https://apps.apple.com/hn/app/almacenes-xtra/id1467840760?mt=8";
                        localStorage.rated = 1;
                    }
                }
                ]
            });
        },3000)
}

if(localStorage.rated == null){
        if (Math.random() >= 0.5) {
    $scope.rateme();
 }
}

   $ionicPlatform.registerBackButtonAction(function (event) {
    event.preventDefault();
}, 100);
    Waves.attach('button')
    Waves.attach('.waves-block')
    Waves.init();
    $scope.place = {};
    $scope.imagesUrl = {};
    $scope.settings = {};
    $scope.addon_puntos = {};
    $scope.addon_check_in = {};
    $scope.desk_order = {};
    $scope.pick_order = {};
    $scope.home_order = {};
    $scope.map = {};
    $scope.wa = {};
    $scope.fb = {};

    $scope.baseImgUrl = baseUrl()+"img/";
    $scope.specialCategories = [];
$scope.isguest = localStorage.isguest;

if(localStorage.contadorNotificaciones == null){ 
    localStorage.contadorNotificaciones = "0";
    $scope.contadorNotificaciones = 0;

    localStorage.contadorCupones = "0";
    $scope.contadorCupones = 0;

    localStorage.contadorPromos = "0";
    $scope.contadorPromos = 0;

    localStorage.contadorArrivals = "0";
    $scope.contadorArrivals = 0;

    localStorage.notificaciones = "[]";

}else{
    $scope.contadorNotificaciones = localStorage.contadorNotificaciones;
    $scope.contadorCupones = localStorage.contadorCupones;
    $scope.contadorPromos = localStorage.contadorPromos;
    $scope.contadorArrivals = localStorage.contadorArrivals;

}



$scope.gotonotif = function(){
   // alert("letsgo")
    $state.go("side.notif");
}
   $scope.registerPlease = function(){
    $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
        $state.go("enterClient")
   }
 
   if(localStorage.isguest == 1){
      $scope.nombre = "Invitado";  
   }else{
      $scope.nombre = "Bienvenido, " + localStorage.nombreDelCliente;  

   }
 

        setTimeout(function(){
                if(localStorage.showCuponBadge == 1){
                      $("#showCuponBadge").show();
                      $("#cuponesIMG").addClass("animated bounce");
                }else{

                    $("#showCuponBadge").hide();
                      $("#cuponesIMG").removeClass("animated bounce");
                }
                if(localStorage.showPromosBadge == 1){
                     $("#showPromosBadge").show();
                      $("#promosIMG").addClass("animated bounce");
                }else{
                     $("#showPromosBadge").hide();
                      $("#promosIMG").removeClass("animated bounce");
                }
                if(localStorage.showNewBadge == 1){
                  $("#showNewBadge").show();
                  $("#newIMG").addClass("animated bounce");
                }else{
                     $("#showNewBadge").hide();
                  $("#newIMG").removeClass("animated bounce");
                }
        },3000)

    setTimeout(function(){
          var push = PushNotification.init({
            "android": {},
            browser: {
                pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            },
            "ios": { "alert": "true", "badge": "true", "sound": "true" }, "windows": {}
        });
        
        push.on('registration', function (data) {
          localStorage.setItem('gcmToken', data.registrationId);
          setTimeout(function(){
            console.log(data.registrationId);
                         $.get(getServerPath() + '?action=update_place_token&uuid=' + device.uuid + '&token=' + localStorage.gcmToken+"&place_id="+Theme_id+"&platform="+device.platform,
                    function (resp) {
                 
                    });

                        $.get(getServerPath() + '?action=updateUserTokenIdentidad&identidad=' + localStorage.user_id + '&token=' + localStorage.gcmToken + "&platform=" + device.platform,
                    function (resp) {
                           // alert(resp);
                    }); 
          },250)

        });

        push.on('notification', function (data) {
          if( localStorage.lastmessage != data.message ){
                 var contadorNotificaciones = parseInt(localStorage.contadorNotificaciones);
                 contadorNotificaciones = contadorNotificaciones + 1;
                 localStorage.contadorNotificaciones = contadorNotificaciones; 
                 $scope.contadorNotificaciones = localStorage.contadorNotificaciones;
                 console.log(localStorage.notificaciones);
                 var tmparray = JSON.parse(localStorage.notificaciones);
                 tmparray.push({"msg": data.message, "title": data.title});
                 localStorage.notificaciones = JSON.stringify(tmparray);
                 localStorage.lastmessage = data.message;
                alert(data.message);
              
                if(data.additionalData.contentType == "c"){
                var contadorCupones = parseInt(localStorage.contadorCupones);
                 contadorCupones = contadorCupones + 1;
                 localStorage.contadorCupones = contadorCupones; 
                 $scope.contadorCupones = localStorage.contadorCupones;}

               
                if(data.additionalData.contentType == "p"){
                var contadorPromos = parseInt(localStorage.contadorPromos);
                 contadorPromos = contadorPromos + 1;
                 localStorage.contadorPromos = contadorPromos; 
                 $scope.contadorPromos = localStorage.contadorPromos;}

                if(data.additionalData.contentType == "n"){
                var contadorArrivals = parseInt(localStorage.contadorArrivals);
                 contadorArrivals = contadorArrivals + 1;
                 localStorage.contadorArrivals = contadorArrivals; 
                 $scope.contadorArrivals = localStorage.contadorArrivals;}


                  $scope.$apply();


            }

                
            //alert(JSON.stringify(data.message));

             if(data.additionalData.contentType == "l"){
                     alert(data.message);
                     $rootScope.$emit("UpdatePuntos", {});
              }

            if(data.additionalData.dismissed != undefined){
              
                if(data.additionalData.contentType == "c"){
                    //localStorage.contadorCupones

                
                   setTimeout(function(){$state.go("side.list-coupons")},1000);
              }
            
              if(data.additionalData.contentType == "p"){
                 setTimeout(function(){$state.go("side.list-promos")},1000);
              }

              if(data.additionalData.contentType == "n"){
                 setTimeout(function(){
                     var target = "_blank";
                     let color = rgbToHex(localStorage.th_home_square_color);
                     var ref = cordova.InAppBrowser.open(encodeURI("https://www.google.com"), target, 'location=yes,hideurlbar=yes,toolbarcolor='+color);
                 ref.addEventListener('exit', function(event) { 
                        localStorage.showNewBadge = 0;
                           $("#showNewBadge").hide();
                  $("#newIMG").removeClass("animated bounce");

                 });  
                 },1000);
              }
            }else{             
                if(data.additionalData.contentType == "c"){
                  setTimeout(function(){
                  $("#showCuponBadge").show();
                  $("#cuponesIMG").addClass("animated bounce");
                  localStorage.showCuponBadge = 1
                },1000)}
                if(data.additionalData.contentType == "p"){
                    setTimeout(function(){
                      $("#showPromosBadge").show();
                      $("#promosIMG").addClass("animated bounce");
                      localStorage.showPromosBadge = 1
                     },1000) 
                  }
                  if(data.additionalData.contentType == "n"){
                    setTimeout(function(){
                  $("#showNewBadge").show();
                  $("#newIMG").addClass("animated bounce");
                  localStorage.showNewBadge = 1
                },1000)}
              }
        });

        
        push.on('error', function (e) {
            console.log(e.message);
            alert(e.message);
        });
    },3000)

    $rootScope.basePath = $scope.baseImgUrl;

  
            $.get(getServerPath(), {
                action: 'get_user_points',
                username: localStorage.user_id,
                place_id: Theme_id
            }, function (resp) {
                localStorage.puntosActuales = resp;
            });
        


    $scope.trackOrders = function(){
        $state.go('side.track_orders');
    }

    $scope.validateToken = function(){
        if(localStorage.track_id == null || localStorage.track_id == undefined || localStorage.track_id == 'undefined' || localStorage.track_id == '')
          localStorage.track_id = generateToken();
  }

  $scope.fullImageSrc = {};
  $scope.openModal = function (scope) {
    $ionicModal.fromTemplateUrl('dialogs/image-modal.html', {
        scope: scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
        $scope.modal.show();
    });

};

$scope.closeModal = function () {
    $scope.modal.hide();
};

$scope.modalImage = function(img) {
    $scope.fullImageSrc = $rootScope.basePath+img;

    $scope.openModal($scope);
}

var myPopup;
rev = 1;
$scope.cancelLoad = function () {
    $ionicPopup.hide()
};

$rootScope.$on("getServices", function () {
    $scope.getServices();
});

$scope.getSpecialCategories = function(){
    console.log('promo init');
    $.getJSON(getServerPath(), {
        action: 'select_category',
        place_id: Theme_id
    }, function (r) {

        $scope.specialCategories = r.filter(function(s){ return (s.category_home == 1 && s.status == 1)});
        $scope.specialCategories.sort(function (a, b) {
            if (a.category_id < b.category_id) {
              return 1;
          }
          if (a.category_id > b.category_id) {
              return -1;
          }
                    // a must be equal to b
                    return 0;
                });
        specialCatArray = $scope.specialCategories;
        console.log('special categories: '+JSON.stringify($scope.specialCategories));
        $scope.$apply();
    });    
}

$scope.getTypes = function(){
    console.log('promo init');
    $.getJSON(getServerPath(), {
        action: 'get_types'
    }, function (r) {

        $scope.types = r;
        typeActionArray = $scope.types
        console.log('types: : '+JSON.stringify($scope.types));
        $scope.$apply();
    });    
}

$scope.obtenerServicio = function (category) {
    console.log('categorySelected: '+JSON.stringify(category));
    localStorage.category_id = category.category_id;
    let type = typeActionArray.find(f => f.type_code == category.category_type && f.type_category == "CATEGORY");
    $scope.getPlacesLocation('HOMEDELIVERY', 0, 'domicilio',type.type_action);
            //$state.go(type.type_action);
        }

        if (localStorage.user_id == null) {
            localStorage.user_id = '';
        }

        $scope.openEvents = function(){
            $state.go('side.list-events');
        }

        $scope.openCoupons = function(){
            if (localStorage.isguest == 0){
                $state.go('side.list-coupons');
            }else{
                alert("Esta opcion es solo para usuarios registrados");
            }
            
        }

        $scope.openScratch = function(){
            if (localStorage.isguest == 0){
                $state.go('side.list-scratch');
            }else{
                alert("Esta opcion es solo para usuarios registrados");
            }
            
        }

        $scope.openLottery = function(){
            if (localStorage.isguest == 0){
                $state.go('side.list-lottery');
            }else{
                alert("Esta opcion es solo para usuarios registrados");
            }
            
        }

        $scope.openNumberLottery = function(){
            if (localStorage.isguest == 0){
                $state.go('side.list-number-lottery');
            }else{
                alert("Esta opcion es solo para usuarios registrados");
            }
            
        }

        $scope.openPromos = function(){
            $state.go('side.list-promos');
        }

        $scope.openWhatsApp = function (phone) {
            window.location = "https://api.whatsapp.com/send?phone=" + phone
        }

        $scope.openwa = function () {
            window.location = "https://api.whatsapp.com/send?phone=" + localStorage.th_phone
        }

        $scope.openWeb = function(h){
            localStorage.contadorArrivals = 0;
            //$scope.$apply();
            $scope.contadorArrivals = 0;
              if(typeof cordova === "undefined"){
                localStorage.setItem("urlStore",h);
                //window.open(encodeURI(h), '_system');
                $state.go("contactUs");
                return;
            }           

            document.addEventListener("deviceready", onDeviceReady, false);
            function onDeviceReady() {
                var target = "_blank";
                let color = rgbToHex(localStorage.th_home_square_color);
                var ref = cordova.InAppBrowser.open(encodeURI(h), target, 'location=yes,hideurlbar=yes,toolbarcolor='+color);
                ref.addEventListener('exit', function(event) { 
                        localStorage.showNewBadge = 0;
                           $("#showNewBadge").hide();
                  $("#newIMG").removeClass("animated bounce");

                 });  
                       

            }
        }

        $scope.openHelpLink = function(h){

           if(typeof cordova === "undefined"){
            localStorage.setItem("urlStore",h);
                //window.open(encodeURI(h), '_system');
                $state.go("contactUs");
                return;
            }           

            document.addEventListener("deviceready", onDeviceReady, false);
            function onDeviceReady() {
                var target = "_blank";
                let color = rgbToHex(localStorage.th_home_square_color);
                var ref = cordova.InAppBrowser.open(encodeURI(h), target, 'location=yes,hideurlbar=yes,toolbarcolor='+color);
                //ref.addEventListener('loadstart', function(event) { alert(event.url); });                

            }

        }

        $scope.openFB = function () {
            if(typeof cordova === "undefined"){
                window.open("https://facebook.com/"+localStorage.facebook_id, '_system');
                return;
            }
            //  window.open("fb://page?id=176799912926449", '_system')
            //window.location = "https://facebook.com/" + localStorage.facebook_id
            window.open("fb://page/"+localStorage.facebook_id, '_system');
            //window.open("https://facebook.com/"+localStorage.facebook_id, '_system');
        }

        $scope.openInstagram = function(p){
            if(typeof cordova === "undefined"){
                window.open("https://www.instagram.com/"+p.instagram_username, '_system');
                return;
            }
            window.open("instagram://user?username=" + p.instagram_username, "_system", "location=no");
            return;
        }

        $scope.openME = function () {
            //  window.open("fb://page?id=176799912926449", '_system')
            window.open("http://m.me/"+localStorage.facebook_id, '_system');
        }

             $scope.scan = function(){
                            cordova.plugins.barcodeScanner.scan(
                                function (result) {
                                    var ref = cordova.InAppBrowser.open(result.text, '_blank', 'location=no');
                                                },
                                  function (error) {
                                        console.log("Scanning failed: " + error);
                                             },
                                    {
                                preferFrontCamera : false, // iOS and Android
                                showFlipCameraButton : false, // iOS and Android
                                showTorchButton : true, // iOS and Android
                                torchOn: true, // Android, launch with the torch switched on (if available)
                                saveHistory: true, // Android, save scan history (default false)
                                prompt : "Place a barcode inside the scan area", // Android
                                resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                                formats : "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
                                orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
                                disableAnimations : true, // iOS
                                disableSuccessBeep: false // iOS and Android
                             }
                );
            }

        $scope.getReservations = function(){

            $ionicLoading.show({
                templateUrl: 'dialogs/loader.html'
            })

            $.getJSON(getServerPath(), {

                action: 'select_Filt_Locations',
                filt: auth_place_id

            }, function (json) {
                $scope.placesLocation = json;
                
                $scope.$apply();
                $ionicLoading.hide();

                if($scope.placesLocation.length == 1 ){
                    $scope.openHelpLink($scope.placesLocation[0].order_site)
                    return;
                }

                myPopup = $ionicPopup.show({
                    templateUrl: 'dialogs/reservations.html',
                    title: '',
                    subTitle: '',
                    scope: $scope,
                    buttons: [
                    { text: 'Cancel' }
                    ]
                });
            }).fail(function () {
                $ionicLoading.hide();
                customizeAlert('No pudimos conectarnos a Ferby, revisa tu conexión de internet.');
            })
        }

        setTimeout(function () {
            if (localStorage.getItem('id') == '10154559098470569') {
                localStorage.setItem('id', '100015899701211');
                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
                $state.go('enterClient');
            }
        }, 1500)

        $scope.$on('$destroy', function () {
            if($scope.modal)
                $scope.modal.remove();
            if(typeof myPopup.close === "function")
                myPopup.close();
        });

        $scope.getSettings = function(){
            xhr = $.ajax({
                url: getServerPath() + "?action=select_place_settings&place_id=" + Theme_id,
                dataType: 'text',
                cache: false,
                contentType: false,
                processData: false,
                type: 'get',
                success: function (resp) {
                    var setting = JSON.parse(resp);
                    setting.redeem_icon_url = imgPath(setting.redeem_icon);
                    localStorage.placeSettings = JSON.stringify(setting);
                    
                    
                },
                error: function (d) {
                    if (request.statusText == 'abort') {
                        return;
                    }
                    $ionicLoading.hide();
                    customizeAlert('No pudimos conectarnos a Ferby, revisa tu conexión de internet.');
                },
                timeout: 7000
            });
        }

        $scope.getCheckinOptions = function(){
            console.log('ws: ')
            console.log(getServerPath() + "?action=select_checkin_options&place_id=" + Theme_id)
            xhr = $.ajax({
                url: getServerPath() + "?action=select_checkin_options&place_id=" + Theme_id,
                dataType: 'text',
                cache: false,
                contentType: false,
                processData: false,
                type: 'get',
                success: function (resp) {
                    var checkinOptions = JSON.parse(resp);
                    checkinOptions.checkin_icon_url = imgPath(checkinOptions.checkin_icon);
                    localStorage.checkinOptions = JSON.stringify(checkinOptions);
                    
                    
                },
                error: function (d) {
                    if (request.statusText == 'abort') {
                        return;
                    }
                    $ionicLoading.hide();
                    customizeAlert('No pudimos conectarnos a Ferby, revisa tu conexión de internet.');
                },
                timeout: 7000
            });
        }

        $rootScope.$on('UpdateToken', function (event, iResult) {//receive the data as second parameter
            document.addEventListener("deviceready", onDeviceReady, false);
            function onDeviceReady() {
                console.log('WS: '+getServerPath() + '?action=update_place_token&uuid=' + device.uuid + '&token=' + localStorage.gcmToken+"&place_id="+Theme_id+"&platform="+device.platform);
               
            }
        });

        $scope.loadThemeLoginBill = function () {
    
       $("#myRadHeight").hide();
       $("ion-content").css("filter","brightness(0%)")
        $ionicLoading.show({templateUrl: 'dialogs/loader.html'})
        setTimeout(function(){
       
            $("ion-content").css("filter","brightness(100%)")
            $("#myRadHeight").show();
            $ionicLoading.hide();
        },1000)
          
          //  Theme_id = getParameterByName("store_id");
          auth_place_id = '[{"place_id": "'+ Theme_id +'"}]'; 
          $scope.getSpecialCategories();            
          $scope.getTypes();
          loaded = 0;           
          if (loaded == 0) {
         
            
            xhr = $.ajax({
                url: getServerPath() + "?action=select_theme&place_id=" + Theme_id,
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false,
                type: 'get',
                success: function (d) {
                    console.log(JSON.stringify(d));
                    $scope.place = d[0];
                    localStorage.placeTheme = JSON.stringify(d[0]);
                    localStorage.setItem('th_business_name', d[0].business_name)
                    localStorage.setItem('th_business_logo', d[0].business_logo)
                    localStorage.setItem('th_business_background1', d[0].business_background1)
                    localStorage.setItem('th_business_background2', d[0].business_background2)
                    localStorage.setItem('th_button_color_theme', d[0].button_color_theme)
                    localStorage.setItem('th_home_square_color', d[0].home_square_color) 
                    localStorage.setItem('th_phone', d[0].business_phone) 
                    localStorage.background_app = d[0].background_app;
                        localStorage.addon_puntos = d[0].addon_puntos; //Guarda en caché si la tienda admite Sistema de Puntos
                        localStorage.addon_check_in = d[0].addon_check_in; //Guarda en caché si la tienda admite Sistema de Checkins
                        localStorage.desk_order = d[0].desk_order; //Guarda en caché si la tienda admite Reservar en Mesa
                        localStorage.calendar_order = d[0].calendar_order;
                        localStorage.desk_icon_url = imgPath(d[0].desk_img);
                        localStorage.desk_text = d[0].desk_text;
                        localStorage.home_icon_url = imgPath(d[0].home_img);
                        localStorage.home_text = d[0].home_text;
                        localStorage.pick_order = d[0].pick_order; //Guarda en caché si la tienda admite Para Llevar
                        localStorage.pick_icon_url = imgPath(d[0].pick_img);
                        localStorage.pick_text = d[0].pick_text;
                        localStorage.map_directions = d[0].map_directions; //Guarda en caché si la tienda admite Conducir al Local
                        localStorage.map_text = d[0].map_text;
                        localStorage.whatsapp_order = d[0].whatsapp_order;
                        localStorage.stock_order = d[0].stock_order;
                        localStorage.facebook_id = d[0].facebook_id;
                        localStorage.phone_icon_url = imgPath(d[0].phone_img);
                        localStorage.promo_icon_url = imgPath(d[0].promo_img);
                        localStorage.fb_icon_url = imgPath(d[0].facebook_img);
                        localStorage.me_icon_url = imgPath(d[0].messenger_img);
                        $scope.addon_puntos.visible = d[0].addon_puntos;
                        $scope.addon_check_in.visible = d[0].addon_check_in;
                        $scope.desk_order.visible = localStorage.desk_order;
                        $scope.pick_order.visible = localStorage.pick_order;
                        $scope.desk_order.text = localStorage.desk_text;
                        $scope.pick_order.text = localStorage.pick_text;
                        $scope.home_order.text = localStorage.home_text;
                        $scope.desk_order.img = localStorage.desk_icon_url;
                        $scope.pick_order.img = localStorage.pick_icon_url;
                        $scope.home_order.img = localStorage.home_icon_url;

                        $scope.wa.phone = localStorage.th_phone;
                      //  $(".bar").css("background-color", localStorage.getItem('th_home_square_color'))  
                      //  $(".bar").css("border-color", localStorage.getItem('th_home_square_color')) 
                        $scope.getSettings();
                        $scope.getCheckinOptions();
                        $scope.uiStart();
                        loaded = 1;
                        //$scope.$apply();
                        $rootScope.$emit("getSide", {});
                      

                    },
                    error: function (d) {
                        $('#ctLoader').hide();
                        if (d.statusText == 'abort') {
                            return;
                        }
                        customizeAlert(' Asegurate que estas correctamento conectado a Internet')
                    },
                });
                //$rootScope.$emit("getServices", {});
            } else {
                $scope.uiStart();
            }



        }



        $rootScope.cancel = function () {
            $ionicLoading.hide();
            customizeAlert('Si el proceso tomo demasiado tiempo, revisa tu conexion a internet.')
            xhr.abort();
            $ionicHistory.goBack()
        }

        $scope.cancelLoad = function () {
            $ionicPopup.hide()
        };


        var arr = String(localStorage.getItem('name')).split(" ")
        $scope.name = arr[0];

        $scope.uiStart = function () {
            setTimeout(function () {
                buildScopeStyleSettings($scope);
                $scope.settings = JSON.parse(localStorage.placeSettings);
                $scope.checkinOptions = JSON.parse(localStorage.checkinOptions);
                $scope.addon_puntos.visible = localStorage.addon_puntos;
                $scope.addon_check_in.visible = localStorage.addon_check_in;

                $scope.desk_order.visible = localStorage.desk_order;
                $scope.pick_order.visible = localStorage.pick_order;
                $scope.desk_order.text = localStorage.desk_text
                $scope.pick_order.text = localStorage.pick_text
                $scope.home_order.text = localStorage.home_text
                $scope.desk_order.img = localStorage.desk_icon_url;
                $scope.pick_order.img = localStorage.pick_icon_url;
                $scope.home_order.img = localStorage.home_icon_url;
                $scope.map.visible = localStorage.map_directions; //Guarda en caché si la tienda admite Conducir al Local
                $scope.map.text = localStorage.map_text;

                $scope.wa.phone = localStorage.th_phone;
                $scope.wa.img = localStorage.phone_icon_url;
                $scope.fb.id = localStorage.facebook_id;
                $scope.fb.facebook_img = localStorage.fb_icon_url;
                $scope.fb.messenger_img = localStorage.me_icon_url;


                var h = $(window).height() * 0.93;
                $('#myRadHeight').css('height', h);
              //  $('ion-content').css("background-image", "url(" + getImgPath() + localStorage.background_app + ")")
              //  $('#thmBackground').css("background-image", "url(" + getImgPath() + localStorage.getItem('th_business_background2') + ")")
                $('#logoImg2').attr("src", getImgPath() + localStorage.getItem('th_business_logo'))
                var colour = localStorage.getItem('th_home_square_color'), new_col = colour.replace(/rgb/i, "rgba");
                // $( "<style>.new-color {background-color : "+"#D30712"+"}</style>" ).appendTo( "ion-view" )
                new_col = new_col.replace(/\)/i, ',0.6)');
                //$('#innerCard').css("background-color", new_col)
                $('buttonUI').css('background', localStorage.getItem('th_button_color_theme'))
                //$(".bar").css("background-color", localStorage.getItem('th_home_square_color'))  
                //$(".bar").css("border-color", localStorage.getItem('th_home_square_color')) 
                var h = $(window).height() * 0.93;

                $scope.$apply();
                setTimeout(function(){  $(window).height() * 0.93; },700)
            }, 1000)
            $scope.$apply();

        };

        $scope.getPlacesLocation = function (type, filter, sType, type_action) {
            sendType = sType;
            deliveryType = filter;
            localStorage.type_action = type_action;
            $ionicLoading.show({
                templateUrl: 'dialogs/loader.html'
            })
            menuType = type;
            setTimeout(function () {
                $.getJSON(getServerPath(), {

                    action: 'select_Filt_Locations',
                    filt: auth_place_id

                }, function (json) {
                    if (filter == 0) {
                        var res = alasql('SELECT * FROM ? WHERE home_order = "1" ', [json]);
                        $scope.placesLocation = res;
                        places = res;
                    } else {
                        if (type == 'HOMEDELIVERY') {
                            var res = alasql('SELECT * FROM ? WHERE pick_order = "1" ', [json]);
                            $scope.placesLocation = res;
                            places = res;
                        }
                        else {
                            $scope.placesLocation = json;
                            places = json;
                        }

                    }
                    $scope.$apply();
                    $ionicLoading.hide();

                    if($scope.placesLocation.length == 1 ){
                        $scope.isNear($scope.placesLocation[0])
                        return;
                    }

                    myPopup = $ionicPopup.show({
                        templateUrl: 'dialogs/options.html',
                        title: '',
                        subTitle: '',
                        scope: $scope,
                        buttons: [
                        { text: 'Cancel' }
                        ]
                    });
                }).fail(function () {
                    $ionicLoading.hide();
                    customizeAlert('No pudimos conectarnos a Ferby, revisa tu conexión de internet.');
                })
            }, 700)
        }

        $scope.storesDirections = function () {
            $ionicLoading.show({
                templateUrl: 'dialogs/loader.html'
            })
            
            setTimeout(function () {
                $.getJSON(getServerPath(), {

                    action: 'select_Filt_Locations',
                    filt: auth_place_id

                }, function (json) {

                    $scope.placesLocation = json;
                    places = json;
                    
                    $scope.$apply();
                    $ionicLoading.hide();
                    myPopup = $ionicPopup.show({
                        templateUrl: 'dialogs/place-directions.html',
                        title: '',
                        subTitle: '',
                        scope: $scope,
                        buttons: [
                        { text: 'Cancel' }
                        ]
                    });
                }).fail(function () {
                    $ionicLoading.hide();
                    customizeAlert('No pudimos conectarnos a Ferby, revisa tu conexión de internet.');
                })
            }, 700)
        }

        $scope.homeOrder = function () {
            $state.go('side.homeOrderPlaces')
        }

        $scope.loginPoints = function () {
            if (localStorage.user_id == '')
                $state.go('side.add_user_id');
            else
                $state.go('side.view_user_points');
        }
        $scope.loginCheckins = function () {
            if (localStorage.user_id == '')
                $state.go('side.query-checkin');
            else
                $state.go('side.stamps');
        }

        $scope.isNear = function (place_location) {
            storeName = $('#').text();
            politics = $('#politics' + place_location.place_location_id).text()
            purchMin = $('#min' + place_location.place_location_id).text()
            hasOrder = 'false';
            localStorage.home_order_terms = place_location.home_order_terms;
            politics = place_location.home_order_terms;

            $ionicLoading.show({
                templateUrl: 'dialogs/loader.html'
            })
            if (localStorage.bill_id != undefined && localStorage.bill_id != ''){
                hasOrder = 'true';
            }
            localStorage.place_location = JSON.stringify(place_location);
            localStorage.promo_day = place_location.promo_day;
            localStorage.setItem('place_loc', place_location.place_location_id);
            localStorage.store_id = place_location.place_location_id;


            $.getJSON(getServerPath(), {
                action: 'login_bill',
                bill_id: place_location.place_location_id
            }, function (json) {
                var lat = json[0].lat;
                var lon = json[0].lon;
                localStorage.setItem('place_lat', lat)
                localStorage.setItem('place_lon', lon)
                localStorage.setItem('place_logo', json[0].business_logo)
                localStorage.setItem('place_name', json[0].business_name)
                localStorage.setItem('place_id', json[0].place_id)
                if ($.trim(politics) != "") 
                    customizeAlert(politics);
                $scope.getServices();
                myPopup.close();
                isOnline = 0;

            }).error(function () {
                $ionicLoading.hide();
                customizeAlert('No pudimos conectarnos a Ferby, revisa tu conexión de internet.');
            })
        };


        $scope.myPosition = function () {
            var onSuccess = function (position) {
                customizeAlert('Mi posicion actual:\nlat: ' + position.coords.latitude + '\nlon: ' + position.coords.longitude);
            };
            function onError(error) {
                customizeAlert('code: ' + error.code + '\n' +
                    'message: ' + error.message + '\n');
            }
            navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 7000 });
        }

        $scope.loginPoints = function () {
            if (localStorage.user_id == '')
                $state.go('side.add_user_id');
            else
                $state.go('side.view_user_points');
        }

        $scope.getServices = function () {
            $scope.logoImage = getImgPath() + localStorage.getItem('place_logo')

            xhr = $.ajax({
                url: getServerPath() + "?action=getAllServices&tipo_menu=" + GetTipoMenu(menuType) + "&place_id=" + localStorage.getItem('place_id'),
                dataType: 'text',
                cache: false,
                contentType: false,
                processData: false,
                type: 'get',
                success: function (resp) {
                    var obj = JSON.parse(resp);
                    catarray = obj.getCatMenu.filter(f => f.category_home == 0 && f.category_type == 1);
                    menuarray = obj.select_menu_rest;
                    promoarray = obj.getPromos;
                    galleryArray = obj.select_place_images;
                    optionsArray = obj.select_options;
                    $rootScope.$emit("getPromos", {});
                    $rootScope.$emit("getCategories", {});
                    $rootScope.$emit("getMenuDet", {});
                    $ionicLoading.hide();
                    // if (menuType == "HOMEDELIVERY")
                    //     if ($.trim(politics) != "") {
                    //         if (deliveryType == 0) {
                    //             //customizeAlert(politics);
                    //         }
                    //     }
                    rev = 1;
                    $state.go(localStorage.type_action);

                },
                error: function (d) {
                    if (request.statusText == 'abort') {
                        return;
                    }
                    $ionicLoading.hide();
                    customizeAlert('No pudimos conectarnos a Ferby, revisa tu conexión de internet.');
                },
                timeout: 7000
            });
        }

    })
.controller('welcomeCtrl', function ($scope, $state, $ionicLoading, $rootScope, $ionicPopup) {
    Waves.attach('button')
    Waves.attach('.waves-block')
    Waves.init();


    $scope.getServices = function () {
        $scope.logoImage = getImgPath() + localStorage.getItem('place_logo')

        xhr = $.ajax({
            url: getServerPath() + "?action=getAllServices&tipo_menu=" + GetTipoMenu(menuType) + "&place_id=" + localStorage.getItem('place_id'),
            dataType: 'text',
            cache: false,
            contentType: false,
            processData: false,
            type: 'get',
            success: function (resp) {
                var obj = JSON.parse(resp);
                catarray = obj.getCatMenu;
                menuarray = obj.select_menu_rest;
                promoarray = obj.getPromos;
                galleryArray = obj.select_place_images;
                optionsArray = obj.select_options;
                $rootScope.$emit("getPromos", {});
                $rootScope.$emit("getCategories", {});
                $rootScope.$emit("getMenuDet", {});
                $ionicLoading.hide();
                if (menuType == "HOMEDELIVERY")
                    if ($.trim(politics) != "") {
                        if (deliveryType == 0) {
                            customizeAlert(politics);
                        }
                    }
                    $scope.navTo(1)

                },
                error: function (d) {
                    if (request.statusText == 'abort') {
                        return;
                    }
                    $ionicLoading.hide();
                    customizeAlert('No pudimos conectarnos a Ferby, revisa tu conexión de internet.');
                },
                timeout: 7000
            });
    }

    $scope.navTo = function (navCase) {
        switch (navCase) {
            case 1:
            $state.go('tab.categories');
            break;
            case 2:
            $state.go('tab.promos');
            break;
            case 3:
            $state.go('tab.cupon');
            break;
            case 4:
            $state.go('tab.survey');
            break;
            case 5:
            $state.go('searchMenu');
            break;
            case 6:
            $state.go('tab.cuenta');
            break;
        }
    }
})
.controller('menuDetCtrl', function ($scope, $state, $ionicPopup, $ionicBackdrop, $ionicModal, $ionicPlatform, $ionicLoading, $rootScope, $ionicHistory, $ionicScrollDelegate) {
    checkKey($state);
    $scope.wi = $(document).width();
    buildScopeStyleSettings($scope);
    var p = alasql('SELECT * FROM ? WHERE type = "1"', [promoarray]);
    $scope.p = p.length
    $scope.actualPlate = {};
    $scope.actualPlate = JSON.parse(localStorage.actualPlate);
    $scope.actualPlate.img = $scope.actualPlate.img.replace("https://app.almacenesxtra.com/img/","").length == 0? "" : $scope.actualPlate.img;
    $scope.fullImageSrc = $scope.actualPlate.img;
    $scope.showImage = {};
    $scope.showImage = 0;
    $scope.hide = false;
    $scope.zoomMin = 1;
    $scope.whatsapp_order = localStorage.whatsapp_order;
    $scope.stock_order = localStorage.stock_order;
    $scope.promo_day = localStorage.promo_day;
    $scope.stock = {};
    $scope.menu_options = optionsArray.filter(function(f){ return f.menu_id == $scope.actualPlate.id; });
    var optionsSelected = [];

    $scope.hideImage = function(){
        $scope.showImage = 1;
    }

    $scope.cotizarPorWhatsApp = function (id) {

        $.get( getServerPath(), {
            action: "add_whatsapp_click",
            id: id
        }, function( resp ) {
                //console.log('shared whatsapp: '+resp ); 
            });


        if(typeof cordova === "undefined"){
            window.open("https://api.whatsapp.com/send?phone="+ localStorage.th_phone+ "&text=" + encodeURIComponent("https://app.almacenesxtra.com/AppEmulator/products.php?id="+id)+" Hola, cuándo volveran a tener el producto: "+$scope.actualPlate.name, '_system');
            return;
        }
        window.open("https://api.whatsapp.com/send?phone="+ localStorage.th_phone+ "&text=" + encodeURIComponent("https://app.almacenesxtra.com/AppEmulator/products.php?id="+id)+" Hola, cuándo volveran a tener el producto: "+$scope.actualPlate.name, "_system", "location=no");
        return;
    }

    $scope.informacionExistenciasWhatsApp = function (id) {
        $.get( getServerPath(), {
            action: "add_whatsapp_click",
            id: id
        }, function( resp ) {
                //console.log('shared whatsapp: '+resp ); 
            });

        if(typeof cordova === "undefined"){
            window.open("https://api.whatsapp.com/send?phone="+ localStorage.th_phone+ "&text=" + encodeURIComponent("https://app.almacenesxtra.com/AppEmulator/products.php?id="+id)+" Hola, cuándo volveran a tener el producto: "+$scope.actualPlate.name, '_system');
            return;
        }
        window.open("https://api.whatsapp.com/send?phone="+ localStorage.th_phone+ "&text=" + encodeURIComponent("https://app.almacenesxtra.com/AppEmulator/products.php?id="+id)+" Hola, cuándo volveran a tener el producto: "+$scope.actualPlate.name, "_system", "location=no");
        return;

    }


    setTimeout(function () {
        $('.buttonUI').css('background-color', localStorage.getItem('th_button_color_theme'))

        $('#bck3cat').css("background-image", "url(" + getImgPath() + localStorage.getItem('th_business_background1') + ")")
    }, 500);

    $scope.showPedir = false;
    $scope.cancelLoad = function () {
        $ionicPopup.hide()
    };
    setTimeout(function () {
        $('.banner').css("background-image", "url(" + getImgPath() + localStorage.getItem('th_business_background1') + ")")
    }, 200)

    $scope.hideNavBar = function(){
        return $scope.hide;
    }

    $scope.promocionPar = function(id){
        $state.go('tab.promoPair');
    }

    $scope.scrollEvent = function() {
        var scrollamount = $ionicScrollDelegate.$getByHandle('scrollHandle').getScrollPosition().top;
            if (scrollamount > 10) { // Would hide nav-bar immediately when scrolled and show it only when all the way at top. You can fiddle with it to find the best solution for you
                $scope.hide = true;                
                $scope.$apply();
            } else {
                $scope.hide = false;
                $scope.$apply();
            }
        }

        $scope.agregarProductoDom = function () {
            if (hasOrder == 'false') {
                $ionicLoading.show({
                    templateUrl: 'dialogs/loader.html'
                })
                xhr = $.ajax({
                    url: getServerPath() + "?action=insert_Bill_qr&desk_id=120&place_loc=" + localStorage.getItem('place_loc'),
                    dataType: 'text',
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'get',
                    success: function (resp) {
                        $ionicLoading.hide();
                        var r = $.trim(resp)
                        if (isNaN(r)) {
                            customizeAlert('La cuenta es invalida o ya no está disponible.');
                        } else {
                            if (r == '-1') {
                                customizeAlert('El codigo QR no es valido, vuelve a interlo');
                                $ionicLoading.hide();
                            } else {
                                localStorage.setItem('bill_id', r);
                                hasOrder = 'true';
                                $ionicLoading.hide();
                                $scope.agregarProducto();
                            }
                        }
                    },
                    error: function (d) {
                        if (request.statusText == 'abort') {
                            return;
                        }
                        $ionicLoading.hide();
                        customizeAlert('No pudimos conectarnos a Ferby, revisa tu conexión de internet.');
                    },
                    timeout: 7000
                });
            } else {
                $scope.agregarProducto();
            }
        }

        $scope.agregarProductoPromoPair = function () {
            if (hasOrder == 'false') {
                $ionicLoading.show({
                    templateUrl: 'dialogs/loader.html'
                })
                xhr = $.ajax({
                    url: getServerPath() + "?action=insert_Bill_qr&desk_id=120&place_loc=" + localStorage.getItem('place_loc'),
                    dataType: 'text',
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'get',
                    success: function (resp) {
                        $ionicLoading.hide();
                        var r = $.trim(resp)
                        if (isNaN(r)) {
                            customizeAlert('La cuenta es invalida o ya no está disponible.');
                        } else {
                            if (r == '-1') {
                                customizeAlert('El codigo QR no es valido, vuelve a interlo');
                                $ionicLoading.hide();
                            } else {
                                localStorage.setItem('bill_id', r);
                                hasOrder = 'true';
                                $ionicLoading.hide();
                                $scope.elegirOpcionesPromoPair();
                            }
                        }
                    },
                    error: function (d) {
                        if (request.statusText == 'abort') {
                            return;
                        }
                        $ionicLoading.hide();
                        customizeAlert('No pudimos conectarnos a Ferby, revisa tu conexión de internet.');
                    },
                    timeout: 7000
                });
            } else {
                $scope.elegirOpcionesPromoPair();
            }
        }

        $scope.elegirOpcionesPromoPair = function () {
            var id = localStorage.getItem('menuId')
            myPopup = $ionicPopup.show({
                templateUrl: 'dialogs/productOptionsPromoPair.html',
                title: 'Agregue las opciones del producto',
                subTitle: '(Extras no incluidos en la promoción)',
                scope: $scope,
                buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Elegir Siguiente</b>',
                    type: 'button-positive',
                    onTap: function (e) {

                        var options = "";
                        var optPrice = 0;
                        menuComment = $('#comment').val();
                        menuQuantity = 1;

                        $ionicLoading.show({
                            templateUrl: 'dialogs/loader.html'
                        })
                        if (sz == 0) {
                            var firstUpload = {};
                            firstUpload.plate = $scope.actualPlate;
                            firstUpload.options = options;
                            firstUpload.comment = menuComment;
                            firstUpload.optionPrice = 0;
                            localStorage.firstUpload = JSON.stringify(firstUpload);
                            $ionicLoading.hide();
                            $state.go('tab.promoPair');

                        } else {
                            for (var i = 0; i < sz; i++) {
                                if (i == (sz - 1)) {
                                    if ($('#' + i + "sel").val() == 't123876t') {
                                        customizeAlert('Selecciona todas tus opciones.');
                                        $ionicLoading.hide();
                                        break;
                                    } else {
                                        var selValArr = String($('#' + i + "sel").val()).split('@%')
                                        options += selValArr[0] + ', ';
                                        optPrice = optPrice + parseFloat(selValArr[1]);

                                    }
                                    var firstUpload = {};
                                    firstUpload.plate = $scope.actualPlate;
                                    firstUpload.options = options;
                                    firstUpload.comment = menuComment;
                                    firstUpload.optionPrice = optPrice;
                                    localStorage.firstUpload = JSON.stringify(firstUpload);
                                    $ionicLoading.hide();
                                    $state.go('tab.promoPair');


                                } else {
                                    if ($('#' + i + "sel").val() == 't123876t') {
                                        customizeAlert('Selecciona todas tus opciones.');
                                        $ionicLoading.hide();
                                        break;
                                    } else {
                                        var selValArr = String($('#' + i + "sel").val()).split('@%')
                                        options += selValArr[0] + ', ';
                                        optPrice = optPrice + parseFloat(selValArr[1]);
                                    }
                                }
                            }
                        }
                    }
                }
                ]
            });
        }

        $scope.goBack = function () {
            $ionicHistory.goBack();
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.menu')
        };
        var myPopup2
        var sz = 0;
        $scope.allImages = [];
        $scope.showGallery = "false";

        $rootScope.$on('getMenuDet', function () {
            $scope.getGalleries();
            $scope.getOptions();
        });

        $scope.getGalleries = function () {
            $scope.allImages = galleryArray;
            $scope.$apply
        }

        $scope.getOptions = function () {
            $scope.options = optionsArray;
            $scope.$apply();
        }


        $scope.getCuenta = function () {
            $scope.actualCategorySelected = catarray.find(function(f){ return f.category_id == localStorage.catId;});
            $scope.actualCategoryImg = imgPath($scope.actualCategorySelected.category_img);
            $scope.buttonVisible = hasOrder;
            $scope.menuPuntos = $scope.actualPlate.menu_points; //Scope utilizado para los puntos del item guardado en caché cuando se ha seleccionado
            var res = alasql('SELECT * FROM ? WHERE menu_id = "' + $scope.actualPlate.id + '"', [optionsArray]);

            for (i = 0; i < res.length; i++) {
                res[i].group = String(res[i].group).toLowerCase()
                res[i].group = String(res[i].group).replace(/ /g, "")
            }
            var group = groupBy(res, 'group')
            var arr = []
            for (var key in group) {
                var proto = group[key];
                arr.push({ group: proto })
            }
            sz = objectSize(group);
            $scope.options = arr;
            function groupBy(xs, key) {
                return xs.reduce(function (rv, x) {
                    (rv[x[key]] = rv[x[key]] || []).push(x);
                    return rv;
                }, {});
            }
            
            $scope.getStock();

            var menuId = $scope.actualPlate.id;
            var images = $scope.allImages;
            var gallery = alasql('SELECT * FROM ? WHERE menu_id = "' + menuId + '"', [galleryArray]);
            if (gallery.length > 0)
                $scope.showGallery = "true";
            $scope.allImages = gallery;
            //$scope.$apply();

            $scope.zoomMin = 1;

            

        }

        $scope.getStock = function(){
            if(localStorage.stock_order == 0)
                return;


            xhr = $.ajax({
                url: getServerPath() + "?action=get_menu_items&menu_id=" + $scope.actualPlate.id,
                dataType: 'json',
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                type: 'get',
                success: function (response) {
                    $scope.actualPlate.menu_stock = response.menu.menu_stock;
                    $scope.menu_options = response.menu_options;
                },
                error: function (d) {console.log('No pudimos conectarnos a Ferby, revisa tu conexión de internet.');
            },
            timeout: 7000
        });



            $scope.stock.quantity = 9999;
            $scope.stock.message = "Disponible.";
            $scope.stock.color_message = "lightgreen";

            if($scope.actualPlate.menu_stock == -1){
                $scope.actualPlate.menu_stock = $scope.menu_options.map(function(m){return m.option_stock;}).reduce(function(accumulator,currentValue){ return accumulator+parseInt(currentValue); },0);
            }

            if($scope.actualPlate.menu_stock == 0 || $scope.actualPlate.menu_stock < -1){
                $scope.stock.quantity = $scope.actualPlate.menu_stock;
                $scope.stock.message = "No hay disponibles.";
                $scope.stock.color_message = "red";
                return;                
            }

            if($scope.actualPlate.menu_stock > 0 && $scope.actualPlate.menu_stock < 5){
                $scope.stock.quantity = $scope.actualPlate.menu_stock;
                $scope.stock.message = "¡Cómpralo! ¡Solo queda "+$scope.actualPlate.menu_stock+" disponble!";
                $scope.stock.color_message = "red";
                return;                
            }

            if($scope.actualPlate.menu_stock > 4 && $scope.actualPlate.menu_stock < 11){
                $scope.stock.quantity = $scope.actualPlate.menu_stock;
                $scope.stock.message = "Solo quedan "+$scope.stock.quantity+" disponibles en stock.";
                $scope.stock.color_message = "orange";                
                return;
            }

            if($scope.actualPlate.menu_stock > 10 && $scope.actualPlate.menu_stock < 21){
                $scope.stock.quantity = $scope.actualPlate.menu_stock;
                $scope.stock.message = "Solo quedan "+$scope.stock.quantity+" disponibles en stock.";
                $scope.stock.color_message = "yellow";                
                return;
            }

            if($scope.actualPlate.menu_stock > 20 && $scope.actualPlate.menu_stock < 50){
                $scope.stock.quantity = $scope.actualPlate.menu_stock;
                $scope.stock.message = "Quedan "+$scope.stock.quantity+" disponibles en stock.";
                $scope.stock.color_message = "green";                
                return;
            }
        }

        $scope.abrirCuenta = function () {
            myPopup2 = $ionicPopup.show({
                templateUrl: 'dialogs/newBill.html',
                title: 'Escanea el código QR en la mesa o pidele a un mesero un código ferby',
                scope: $scope,
                buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Escanear</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        $scope.scan();
                    }
                }
                ]
            });
        }
        $scope.showNumber = function () {
            var dis = $('#hideInput').css('display');
            if (dis == 'none') {
                $('#hideInput').show('slow')
            } else {
                $('#hideInput').hide('slow')
            }
        }
        $scope.introNumber = function () {
            myPopup2.close()
            $ionicLoading.show({
                templateUrl: 'dialogs/loader.html'
            })
            var billId = $('#billId').val();

            if ($.trim(billId) != "") {
                xhr = $.ajax({
                    url: getServerPath() + "?action=select_bill_id&bill_id=" + billId + "&pl_id=" + localStorage.getItem('place_loc'),
                    dataType: 'text',
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'get',
                    success: function (d) {
                        var r = $.trim(d)
                        if (r == "1") {
                            customizeAlert('Listo! Ya puedes ordenear.');
                            $scope.agregarProducto()
                            localStorage.setItem('bill_id', billId);
                            hasOrder = 'true';
                            $ionicLoading.hide();
                            $scope.getCuenta();
                            $scope.agregarProducto();
                        } else {
                            customizeAlert('La cuenta es invalida o ya no está disponible.')
                            $ionicLoading.hide();
                        }
                    },
                    error: function (d) {
                        if (d.statusText == 'abort') {
                            return;
                        }
                        $ionicLoading.hide();
                        customizeAlert('No pudimos conectarnos a Ferby, revisa tu conexión de internet.');
                    },
                    timeout: 7000
                });
            } else {
                customizeAlert('El campo de número Ferby esta vacío.')
                $ionicLoading.hide();
            }
        }

        $scope.agregarProducto = function () {
            var id = localStorage.getItem('menuId')
            var url = 'dialogs/productOptions.html';
            if($scope.actualPlate.menu_promotion == 1 && localStorage.promo_day == 1)
                url = 'dialogs/productOptionsPromoPair.html'
            myPopup = $ionicPopup.show({
                templateUrl: url,
                title: 'Agregue las opciones del producto',
                subTitle: '',
                scope: $scope,
                buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Ok</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        var options = "";
                        var optPrice = 0;
                        menuComment = $('#comment').val();
                        menuQuantity = $('#quantity').val();
                        if($scope.stock_order == 1){
                            if(parseInt(menuQuantity) > $scope.actualPlate.menu_stock){
                                alert('Unidades insuficientes');
                                return;
                            }
                        }

                        if(menuQuantity == null || menuQuantity == undefined)
                            menuQuantity = '1';

                        $ionicLoading.show({
                            templateUrl: 'dialogs/loader.html'
                        })
                        if (sz == 0) {
                            startUpload(illegalChar(options), illegalChar(menuComment), illegalChar(menuQuantity), 0)
                            console.log('sz==0');
                        } else {
                            for (var i = 0; i < sz; i++) {
                                if (i == (sz - 1)) {
                                    if ($('#' + i + "sel").val() == 't123876t') {
                                        customizeAlert('Selecciona todas tus opciones.');
                                        $ionicLoading.hide();
                                        break;
                                    } else {
                                        var selValArr = String($('#' + i + "sel").val()).split('@%')
                                        options += selValArr[0] + ', ';
                                        optPrice = optPrice + parseFloat(selValArr[1]);
                                        var cod_option = $("#"+i+"sel option:selected").attr("id");
                                        console.log('agregarProducto cod_option: '+cod_option);
                                        optionsSelected.push(cod_option);

                                    }
                                    startUpload(illegalChar(options), illegalChar(menuComment), illegalChar(menuQuantity), optPrice)
                                } else {
                                    if ($('#' + i + "sel").val() == 't123876t') {
                                        customizeAlert('Selecciona todas tus opciones.');
                                        $ionicLoading.hide();
                                        break;
                                    } else {
                                        var selValArr = String($('#' + i + "sel").val()).split('@%')
                                        options += selValArr[0] + ', ';
                                        optPrice = optPrice + parseFloat(selValArr[1]);
                                        var cod_option = $("#"+i+"sel option:selected").attr("id");
                                        console.log('agregarProducto cod_option: '+cod_option);
                                        optionsSelected.push(cod_option);
                                    }
                                }
                            }
                        }
                    }
                }
                ]
            });

            

            function startUpload(op, menuComment, menuQuantity, optTotal) {
                var precioTotal = parseFloat(parseFloat($scope.actualPlate.menu_price) + optTotal) * parseFloat(menuQuantity);
                var stringCodOptions = JSON.stringify(optionsSelected);
                console.log('ws start upload: '+getServerPath() + "?action=insert_Bill_Detail&menu_id=" + $scope.actualPlate.id + "&bill_id=" + localStorage.getItem('bill_id') + "&option_id=" + op + "&username=" + localStorage.getItem('id') + "&comment=" + menuComment + "&qty=" + menuQuantity + "&price=" + precioTotal+ "&cncOptions="+stringCodOptions);

                xhr = $.ajax({
                    url: getServerPath() + "?action=insert_Bill_Detail&menu_id=" + $scope.actualPlate.id + "&bill_id=" + localStorage.getItem('bill_id') + "&option_id=" + op + "&username=" + localStorage.getItem('id') + "&comment=" + menuComment + "&qty=" + menuQuantity + "&price=" + precioTotal+ "&cncOptions="+stringCodOptions,
                    dataType: 'text',
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'get',
                    async: true,
                    success: function (data) {
                        $ionicLoading.hide();
                        var d = $.trim(data);
                        if (d == 1) {
                            //$scope.goBack();
                            $rootScope.$emit("updateCart");
                            customizeAlert('Se agregó ' + menuQuantity + ' ' + op + ' ' + $scope.actualPlate.name + ' ' + menuComment)
                            $('.ion-ios-cart').removeClass('animated bounce');
                            setTimeout(function(){
                                $('.ion-ios-cart').addClass('animated bounce');
                            },500)
                            $('#seecart').show('slow')
                        } else if (d == -1) {
                            hasOrder = 'false';
                            $ionicHistory.goBack();
                            customizeAlert('La orden actual ha expirado, vuelve a escanear el codigo QR')

                            $scope.$apply()
                        } else {
                            customizeAlert('Ocurrió un error, no pudimos agregar tu orden')

                            $ionicLoading.hide();
                        }
                    },
                    error: function (request) {
                        $ionicLoading.hide();
                        if (request.statusText == 'abort') {
                            return;
                        }
                        customizeAlert('No pudimos conectarons a Ferby, revisa tu conexión de internet.');

                    }
                });
            }
        }
        $scope.goToGallery = function () {
            $state.go('tab.galleryProduct')
        }
        $scope.showImages = function (index) {
            $scope.activeSlide = index;
            $scope.showModal('dialogs/gallery-zoomview.html');
        };

        $scope.showModal = function (templateUrl) {
            $ionicModal.fromTemplateUrl(templateUrl, {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        }
        $scope.closeModal = function () {
            $scope.modal.hide();
            $scope.modal.remove()
        };
        $scope.updateSlideStatus = function (slide) {
            var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
            if (zoomFactor == $scope.zoomMin) {
                $ionicSlideBoxDelegate.enableSlide(true);
            } else {
                $ionicSlideBoxDelegate.enableSlide(false);
            }
        };
        $scope.scan = function () {
            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    if ($.trim(result.text) != "") {
                        $ionicLoading.show({
                            templateUrl: 'dialogs/loader.html'
                        })

                        xhr = $.ajax({
                            url: getServerPath() + "?action=insert_Bill_qr&desk_id=" + result.text + "&place_loc=" + localStorage.getItem('place_loc'),
                            dataType: 'text',
                            cache: false,
                            contentType: false,
                            processData: false,
                            type: 'get',
                            success: function (resp) {
                                $ionicLoading.hide();
                                var r = $.trim(resp)
                                if (isNaN(r)) {
                                    customizeAlert('La cuenta es invalida o ya no está disponible.');
                                } else {
                                    if (r == '-1') {

                                        customizeAlert('El codigo QR no es valido, vuelve a interlo');
                                        $ionicLoading.hide();
                                    } else {
                                        customizeAlert('Listo! Ya puedes ordenar');
                                        localStorage.setItem('bill_id', r);
                                        hasOrder = 'true';
                                        $ionicLoading.hide();
                                        $scope.getCuenta();
                                        $scope.agregarProducto();
                                    }
                                }
                            },
                            error: function (d) {
                                if (request.statusText == 'abort') {
                                    return;
                                }
                                $ionicLoading.hide();
                                customizeAlert('No pudimos conectarnos a Ferby, revisa tu conexión de internet.');
                            },
                            timeout: 7000
                        });
                    }
                },
                function (error) {
                    customizeAlert("Error de Scan");
                }
                );
        }

        $scope.openModal = function () {
            $ionicModal.fromTemplateUrl('dialogs/image-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });

        };

        $scope.closeModal = function () {
            $scope.modal.hide();
        };

        $scope.showImage = function (index) {
            $scope.openModal();
        }

    })
.controller('politicasCtrl',function($scope, $ionicPopup, $state, $ionicHistory, $ionicPlatform, $rootScope, $ionicLoading){

    $scope.noacepto = function(){
 
          alert("Debes Aceptar los términos y condiciones para ser un usuario registrado");
        localStorage.user_id = "";
                $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
        $state.go("enterClient");
    }

    $scope.acepto = function(){
     
                $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
        $state.go("side.loginBill");
    }

})

.controller('enterClientCtrl', function ($scope, $ionicPopup, $state, $ionicHistory, $ionicPlatform, $rootScope, $ionicLoading) {
   
    Waves.attach('button')
    Waves.attach('.waves-block')
    Waves.init();

    $scope.guester = function(){
        localStorage.isguest = 1;
        localStorage.user_id = "10";
        $state.go("side.loginBill");
    }


    $scope.ingresar = function(){

        if($("#nomIdentidad").val() == ""){alert("Debes llenar el campo identidad con el numero de tu identidad del registro nacional de las personas."); return;}
        if($("#nomReg").val() == ""){alert("Debes llenar el campo nombre."); return;}
        if($("#celReg").val() == ""){alert("Debes llenar el celular con tu numero actual de celular."); return;}

        if($.trim($("#nomIdentidad").val()).length != 13){alert("El numero de identidad debe contener 13 numeros."); return;}
        if($.trim($("#celReg").val()).length != 8){alert("El numero de celular debe contener 8 numeros."); return;}

        $ionicLoading.show({
            templateUrl: 'dialogs/loader.html'
        })

        $.get(getServerPath() + "?action=insert_xtraCliente&identidad=" + $("#nomIdentidad").val()  + "&nombre=" + $("#nomReg").val() + "&numero=" + $("#celReg").val() + "&email=" + $("#nomEmail").val() ,{},function(resp){
         $ionicLoading.hide();
         if($.trim(resp == "1")){
            localStorage.nombreDelCliente = $("#nomReg").val();
            localStorage.celularDelCliente = $("#celReg").val();
            localStorage.emailDelCliente = $("#nomEmail").val();
            localStorage.user_id = $("#nomIdentidad").val();
            localStorage.isguest = 0;
            $state.go("politicas");

        }else{
            alert("Ocurrió un error");
        }
    })
    }

    $scope.loadTheme = function () {
        $ionicLoading.show({
            templateUrl: 'dialogs/loader.html'
        })
        xhr = $.ajax({
            url: getServerPath() + "?action=select_theme&place_id=" + Theme_id,
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            type: 'get',
            success: function (d) {
                localStorage.setItem('th_business_logo', d[0].business_logo)
                $('#logoImg').attr("src", getImgPath() + localStorage.getItem('th_business_logo'))
                $ionicLoading.hide()
            },
            error: function (d) {
                $('#ctLoader').hide();
                if (d.statusText == 'abort') {
                    return;
                }
                customizeAlert('Ocurrió un error, Asegurate que estas correctamento conectado a Internet')
            },
        });
    }


    var h = $(window).height() * 1;
    $('#myRefHeight').height(h);
    $scope.fblogout = function () {
        facebookConnectPlugin.logout(function () { console.log('SUCCESS') }, function () { console.log('FAIL') });

    }

    $scope.logStat = function () {
        facebookConnectPlugin.getLoginStatus(function (userData) {
            if (userData.status == 'connected') {
                facebookConnectPlugin.api("/" + userData.authResponse.userID + '/?fields=id,name,birthday,gender,picture,email', null,
                    function (response) {
                        initfb(response);
                    });
            } else {
                $scope.fb();
            }
        }, function () { customizeAlert('FB ERROR') });
    }


    
    var h = $(window).height() * 0.9;
    $('#header').css('height', h);
    $scope.gotoTestView = function () {
        $state.go('tab.galleryProduct3');
    }

})
.controller('menuCtrl', function ($scope, $ionicPopup, $state, $ionicHistory, $rootScope, $ionicScrollDelegate) {
    checkKey($state);
    $scope.logoImage = getImgPath() + localStorage.getItem('place_logo')
    $scope.actualCategory = localStorage.actualCategory;
    buildScopeStyleSettings($scope);
    $scope.hide = false;
    setTimeout(function () {

        // $('.banner').css("background-image", "url(" + getImgPath() + localStorage.getItem('th_business_background1') + ")")
    }, 200)
    var p = alasql('SELECT * FROM ? WHERE type = "1"', [promoarray]);
    $scope.p = p.length
    Waves.attach('button')
    Waves.attach('.waves-block')
    Waves.init();
    $scope.wi = $(document).width();

    $scope.hideNavBar = function(){
        return $scope.hide;
    }

    $scope.scrollEvent = function() {
        var scrollamount = $ionicScrollDelegate.$getByHandle('scrollHandle').getScrollPosition().top;
            if (scrollamount > 70) { // Would hide nav-bar immediately when scrolled and show it only when all the way at top. You can fiddle with it to find the best solution for you
                $scope.hide = true;                
                $scope.$apply();
            } else {
                $scope.hide = false;
                $scope.$apply();
            }
        }


        $scope.goBack = function () {
            $ionicHistory.goBack();
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.categories')
        };

        $rootScope.$on("getGallery", function () {
            $scope.loadGalleries();
        });

        $scope.loadGalleries = function () {
            $scope.gallery = galleryArray;
            galleryArray = $scope.gallery;
        };


        $scope.exit = function () {
            if (localStorage.getItem('id') != '100015899701211') {
                $.get(getServerPath(), { action: 'updateOnlinePlace', username: localStorage.getItem('id'), value: 0 }, function (data) {
                });
            }
            $ionicHistory.nextViewOptions({
                disableAnimate: false,
                disableBack: true
            });
            $state.go('loginBill');
        }


        $scope.doRefresh = function () {
            $scope.ctName = ctName;
            $scope.categories = catarray;
            $scope.menu = menuarray;

            $scope.actualCategorySelected = catarray.find(function(f){ return f.category_id == localStorage.catId;});
            $scope.actualCategoryImg = imgPath($scope.actualCategorySelected.category_img);

            for (var i = 0; i < menuarray.length; i++) {

                if (menuarray[i].category_id == localStorage.getItem('catId')) {

                    $scope.plates = menuarray[i].plates;
                    //   $scope.$apply();
                    break;

                }

            }
            $scope.$broadcast('scroll.refreshComplete');
        };

        $scope.largeImage = function (id) {
            myPopup = $ionicPopup.alert({
                templateUrl: 'dialogs/largeImage.html',
                title: '',
                subTitle: '',
                scope: $scope,
                buttons: [
                { text: 'OK' }
                ]
            });

            setTimeout(function () {
                var imgSrc = $('#imgMenu' + id).attr('src');
                var title = $('#textId' + id).text();
                $('#recieveImage').attr('src', imgSrc)
                $('#recieveTitle').text(title)
                var w = $(window).height();
                $('.popup').css('width', w);
            }, 500)
        }

        $scope.goToMenuDetails = function(plate){
            localStorage.actualPlate = JSON.stringify(plate);
            menuImg = $('#imgMenu' + plate.id).attr('src');
            $state.go('tab.menuDet')
        }

        $scope.searchPlate = function () {
            $state.go('tab.searchMenu')
        }

        $scope.openCity = function (evt, cityName) {
            // Declare all variables
            var i, tabcontent, tablinks;

            // Get all elements with class="tabcontent" and hide them
            tabcontent = document.getElementsByClassName("tabcontent");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
            }

            // Get all elements with class="tablinks" and remove the class "active"
            tablinks = document.getElementsByClassName("tablinks");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }

            // Show the current tab, and add an "active" class to the link that opened the tab
            document.getElementById(cityName).style.display = "block";
            evt.currentTarget.className += " active";

            $scope.$apply();
        }
    })
.controller('searchMenuCtrl', function ($scope, $state) {
    checkKey($state);
    buildScopeStyleSettings($scope);
    Waves.attach('button')
    Waves.attach('.waves-block')
    Waves.init();
    var p = alasql('SELECT * FROM ? WHERE type = "1"', [promoarray]);
    $scope.p = p.length
    $scope.wi = $(document).width();
    setTimeout(function () {
        $('.banner').css("background-image", "url(" + getImgPath() + localStorage.getItem('th_business_background1') + ")")
    }, 200)
    setTimeout(function () {
        $('.buttonUI').css('background', localStorage.getItem('th_button_color_theme'))
    }, 250)

    $scope.qryCount = 1;

    $scope.getImagePath = function(img){
        if(img.length < 28){
            return imgPath(localStorage.th_business_logo);
        }

        return img;
    }

    $scope.searchMenu = function () {
        var platesArr = []
        var qry = $('#search').val()

        if ($.trim(qry) != "") {
            for (var i = 0; i < menuarray.length; i++) {
                platesArr.push(menuarray[i].plates)
                if (i == menuarray.length - 1) {
                    var merged = [].concat.apply([], platesArr);
                    var res = alasql('SELECT * FROM ? WHERE name LIKE "%' + qry + '%" OR description LIKE "%' + qry + '%" OR category_name LIKE "%'+ qry + '%"', [merged]);
                    $scope.qryCount = res.length;
                    $scope.plates = res;
                    $scope.$apply();
                }
            }
        } else {
            customizeAlert('No has buscado nada :(')
        }
    }

    $scope.navDetails = function(plate){
        localStorage.actualPlate = JSON.stringify(plate);
        menuImg = $('#imgMenu' + plate.id).attr('src');
        $state.go('tab.menuDet')
    }


})
.controller('promoPairCtrl', function ($scope, $state, $ionicPopup, $ionicLoading, $rootScope) {
    checkKey($state);
    buildScopeStyleSettings($scope);
    Waves.attach('button')
    Waves.attach('.waves-block')
    Waves.init();
    var p = alasql('SELECT * FROM ? WHERE type = "1"', [promoarray]);
    $scope.p = p.length;
    $scope.wi = $(document).width();
    var optionsSelected = [];
    setTimeout(function () {
        $('.banner').css("background-image", "url(" + getImgPath() + localStorage.getItem('th_business_background1') + ")")
    }, 200)
    setTimeout(function () {
        $('.buttonUI').css('background', localStorage.getItem('th_button_color_theme'))
    }, 250)
    var sz = 0;

    var platesArr = [];
    for (var i = 0; i < menuarray.length; i++) {
        platesArr.push(menuarray[i].plates)
        if (i == menuarray.length - 1) {
            var merged = [].concat.apply([], platesArr);
            var res = alasql('SELECT * FROM ? WHERE name LIKE "%' + '' + '%" OR description LIKE "%' + '' + '%" OR category_name LIKE "%'+ '' + '%"', [merged]);
            $scope.plates = res.filter(function(f){ return f.menu_promotion == 1;});
        }
    }



    $scope.qryCount = 1;

    $scope.getImagePath = function(img){
        if(img.length < 28){
            return imgPath(localStorage.th_business_logo);
        }

        return img;
    }

    $scope.searchMenu = function () {
        var platesArr = []
        var qry = $('#search').val()

        if ($.trim(qry) != "") {
            for (var i = 0; i < menuarray.length; i++) {
                platesArr.push(menuarray[i].plates)
                if (i == menuarray.length - 1) {
                    var merged = [].concat.apply([], platesArr);
                    var res = alasql('SELECT * FROM ? WHERE name LIKE "%' + qry + '%" OR description LIKE "%' + qry + '%" OR category_name LIKE "%'+ qry + '%"', [merged]);
                    $scope.qryCount = res.length;
                    $scope.plates = res;
                    $scope.$apply();
                }
            }
        } else {
            customizeAlert('No has buscado nada :(')
        }
    }

    $scope.navDetails = function(plate){
        localStorage.actualPlate = JSON.stringify(plate);
        menuImg = $('#imgMenu' + plate.id).attr('src');
        $state.go('tab.menuDet')
    }

    $scope.joinPromoPairOptions = function(actualPlate){

        var res = alasql('SELECT * FROM ? WHERE menu_id = "' + actualPlate.id + '"', [optionsArray]);

        for (i = 0; i < res.length; i++) {
            res[i].group = String(res[i].group).toLowerCase()
            res[i].group = String(res[i].group).replace(/ /g, "")
        }
        var group = groupBy(res, 'group')
        var arr = []
        for (var key in group) {
            var proto = group[key];
            arr.push({ group: proto })
        }
        sz = objectSize(group);
        $scope.options = arr;
        function groupBy(xs, key) {
            return xs.reduce(function (rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});
        }

    }

    $scope.elegirOpcionesSecondUpload = function (secondPlate) {
        $scope.joinPromoPairOptions(secondPlate);
        var firstUpload = JSON.parse(localStorage.firstUpload);
        $scope.uploads = [];
        $scope.platesSelected = [];
        $scope.platesSelected.push(secondPlate);
        $scope.platesSelected.push(firstUpload.plate);
            //$scope.uploads.push(firstUpload);
            localStorage.plates = JSON.stringify($scope.platesSelected);
            var id = localStorage.getItem('menuId')
            myPopup = $ionicPopup.show({
                templateUrl: 'dialogs/productOptionsPromoPair.html',
                title: 'Confirmar 2x1',
                scope: $scope,
                buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Agregar 2x1</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        var options = "";
                        var optPrice = 0;
                        menuComment = $('#comment').val();
                        menuQuantity = 1;
                        $ionicLoading.show({
                            templateUrl: 'dialogs/loader.html'
                        })
                        if (sz == 0) {
                            var secondUpload = {};
                            secondUpload.plate = secondPlate;
                            secondUpload.options = options;
                            secondUpload.comment = menuComment;
                            secondUpload.optionPrice = 0;
                            localStorage.secondUpload = JSON.stringify(secondUpload);
                                //$ionicLoading.hide();
                                console.log('salio a cuenta');
                                $scope.agregarProductosPromoPair();
                                //$scope.uploads.push(secondUpload);
                                //$state.go('tab.cuenta');
                                
                            } else {
                                for (var i = 0; i < sz; i++) {
                                    console.log('entro i: '+i)
                                    if (i == (sz - 1)) {
                                        if ($('#' + i + "sel").val() == 't123876t') {
                                            customizeAlert('Selecciona todas tus opciones.');
                                            $ionicLoading.hide();
                                            break;
                                        } else {
                                            var selValArr = String($('#' + i + "sel").val()).split('@%')
                                            options += selValArr[0] + ', ';
                                            optPrice = optPrice + parseFloat(selValArr[1]);
                                            optionsSelected.push({
                                                cod_option: $("#"+i+"sel option:selected").attr("id")
                                            });

                                        }
                                        var secondUpload = {};
                                        secondUpload.plate = secondPlate;
                                        secondUpload.options = options;
                                        secondUpload.comment = menuComment;
                                        secondUpload.optionPrice = optPrice;
                                        localStorage.secondUpload = JSON.stringify(secondUpload);
                                        //$ionicLoading.hide();
                                        $scope.agregarProductosPromoPair();
                                        //$scope.uploads.push(secondUpload);
                                        
                                        //$state.go('tab.cuenta');

                                        
                                    } else {
                                        if ($('#' + i + "sel").val() == 't123876t') {
                                            customizeAlert('Selecciona todas tus opciones.');
                                            $ionicLoading.hide();
                                            break;
                                        } else {
                                            var selValArr = String($('#' + i + "sel").val()).split('@%')
                                            options += selValArr[0] + ', ';
                                            optPrice = optPrice + parseFloat(selValArr[1]);
                                            optionsSelected.push({
                                                cod_option: $("#"+i+"sel option:selected").attr("id")
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                    ]
                });
}

$scope.agregarProductosPromoPair = function(){
    $scope.uploads = [];
    var first = JSON.parse(localStorage.firstUpload);
    var second = JSON.parse(localStorage.secondUpload);
    if(first.plate.menu_price > second.plate.menu_price){
        second.plate.menu_price = 0;
    }else{
        first.plate.menu_price = 0;
    }

    $scope.uploads.push(first);
    $scope.uploads.push(second);

    localStorage.finalUploads = JSON.stringify($scope.uploads);

    for(var u in $scope.uploads){
        var upload = $scope.uploads[u];
        console.log(u+': '+JSON.stringify(upload));
        startUpload(upload.options, upload.comment+' Promo: 2x1 '+first.plate.name+' y '+second.plate.name, upload.plate, 1, upload);
    }
    $state.go('tab.cuenta');
}

function startUpload(op, menuComment, plate, menuQuantity, upload) {
            //console.log('upload startupload: '+JSON.stringify(upload));
            var precioTotal = parseFloat(parseFloat(plate.menu_price) + upload.optionPrice) * 1;
            var stringCodOptions = JSON.stringify(optionsSelected);
            //console.log('total: '+precioTotal);
            console.log('ws start upload: '+getServerPath() + "?action=insert_Bill_Detail&menu_id=" + plate.id + "&bill_id=" + localStorage.getItem('bill_id') + "&option_id=" + op + "&username=" + localStorage.getItem('id') + "&comment=" + menuComment + "&qty=" + menuQuantity + "&price=" + precioTotal+ "&cncOptions="+stringCodOptions);
            xhr = $.ajax({
                url: getServerPath() + "?action=insert_Bill_Detail&menu_id=" + plate.id + "&bill_id=" + localStorage.getItem('bill_id') + "&option_id=" + op + "&username=" + localStorage.getItem('id') + "&comment=" + menuComment + "&qty=" + menuQuantity + "&price=" + precioTotal+ "&cncOptions="+stringCodOptions,
                dataType: 'text',
                cache: false,
                contentType: false,
                processData: false,
                type: 'get',
                async: true,
                success: function (data) {
                    $ionicLoading.hide();
                    var d = $.trim(data);
                    if (d == 1) {
                        //$scope.goBack();
                        $rootScope.$emit("updateCart");
                        //customizeAlert('Se agregó ' + menuQuantity + ' ' + op + ' ' + $scope.actualPlate.name + ' ' + menuComment)
                        $('.ion-ios-cart').removeClass('animated bounce');
                        setTimeout(function(){
                            $('.ion-ios-cart').addClass('animated bounce');
                        },500)
                        $('#seecart').show('slow')
                    } else if (d == -1) {
                        hasOrder = 'false';
                        $ionicHistory.goBack();
                        customizeAlert('La orden actual ha expirado, vuelve a escanear el codigo QR')

                        $scope.$apply()
                    } else {
                        customizeAlert('Ocurrió un error, no pudimos agregar tu orden')

                        $ionicLoading.hide();
                    }
                },
                error: function (request) {
                    $ionicLoading.hide();
                    if (request.statusText == 'abort') {
                        return;
                    }
                    customizeAlert('No pudimos conectarons a Ferby, revisa tu conexión de internet.');

                }
            });
        }


    })
.controller('promosCtrl', function ($scope, $state, $ionicPopup, $ionicHistory, $rootScope) {
    checkKey($state);
    buildScopeStyleSettings($scope);
    $scope.wi = $(document).width();
    setTimeout(function () {
        $('.banner').css("background-image", "url(" + getImgPath() + localStorage.getItem('th_business_background1') + ")")
    }, 200)

    $rootScope.$on("getPromos", function () {
        $scope.getPromos();
    });

    var val = localStorage.getItem('customLan');

    $scope.exit = function () {
        $.get(getServerPath(), { action: 'updateOnlinePlace', username: localStorage.getItem('id'), value: 0 }, function (data) {
        });
        $ionicHistory.nextViewOptions({
            disableAnimate: false,
            disableBack: true
        });
        $state.go('loginBill');
    }

    $scope.doRefresh = function () {
        $scope.getPromos();
        $scope.$broadcast('scroll.refreshComplete');

    };

    $scope.getPromos = function () {
        var res = alasql('SELECT * FROM ? WHERE type = "1"', [promoarray]);
        $scope.promociones = res;
        setTimeout(function () {
            $('.buttonUI').css('background', localStorage.getItem('th_button_color_theme'))
        }, 250)
    };

    $scope.largeImage = function (id) {
        myPopup = $ionicPopup.alert({
            templateUrl: 'dialogs/largeImage.html',
            title: '',
            subTitle: '',
            scope: $scope,
            buttons: [
            { text: 'Ordena en Menú' }
            ]
        });
        setTimeout(function () {
            var imgSrc = $('#imgPromo' + id).attr('src');
            var title = $('#textId' + id).text();

            $('#recieveImage').attr('src', imgSrc)
            $('#recieveTitle').text(title)
            var w = $(window).height();
            $('.popup').css('width', w);
        }, 500)
    }

    $scope.translate = function () {
        $state.go('translate');
    }
})


.controller('scratchCtrl', function ($scope, $state, $ionicPopup, $ionicHistory, $rootScope) {
    checkKey($state);

    buildScopeStyleSettings($scope);
    $scope.wi = $(document).width();
    setTimeout(function () {
        $('.banner').css("background-image", "url(" + getImgPath() + localStorage.getItem('th_business_background1') + ")")
    }, 200)

    $rootScope.$on("getScratch", function () {
        $scope.getScratch();
    });

    var val = localStorage.getItem('customLan');

    $scope.exit = function () {
        $.get(getServerPath(), { action: 'updateOnlinePlace', username: localStorage.getItem('id'), value: 0 }, function (data) {
        });
        $ionicHistory.nextViewOptions({
            disableAnimate: false,
            disableBack: true
        });
        $state.go('loginBill');
    }

    $scope.doRefresh = function () {
        $scope.getScratch();
        $scope.$broadcast('scroll.refreshComplete');

    };

    $scope.getScratch = function () {
        var res = alasql('SELECT * FROM ? WHERE type = "1"', [scratcharray]);
        $scope.scratch = res;
        setTimeout(function () {
            $('.buttonUI').css('background', localStorage.getItem('th_button_color_theme'))
        }, 250)
    };

    

    $scope.largeImage = function (id) {
        myPopup = $ionicPopup.alert({
            templateUrl: 'dialogs/largeImage.html',
            title: '',
            subTitle: '',
            scope: $scope,
            buttons: [
            { text: 'Ordena en Menú' }
            ]
        });
        setTimeout(function () {
            var imgSrc = $('#imgScratch' + id).attr('src');
            var title = $('#textId' + id).text();

            $('#recieveImage').attr('src', imgSrc)
            $('#recieveTitle').text(title)
            var w = $(window).height();
            $('.popup').css('width', w);
        }, 500)
    }

    $scope.translate = function () {
        $state.go('translate');
    }
})



.controller('categoriesCtrl', function ($scope, $state, $rootScope, $ionicScrollDelegate, $ionicNavBarDelegate, $ionicHistory) {
    checkKey($state);
    buildScopeStyleSettings($scope);
    var p = alasql('SELECT * FROM ? WHERE type = "1"', [promoarray]);
    $scope.p = p.length
    $scope.wi = $(document).width();
    Waves.attach('button')
    Waves.attach('.waves-block')
    Waves.init();
    $scope.hide = false;

    setTimeout(function () {
        $rootScope.$emit("updateCart");
        $('.banner').css("background-image", "url(" + getImgPath() + localStorage.getItem('th_business_background1') + ")")
        $(".tabs").css("border-color", localStorage.getItem('th_home_square_color')) 
        $(".tabs").css("background-color", localStorage.getItem('th_home_square_color')) 
       // $(".bar").css("background-color", localStorage.getItem('th_home_square_color'))  
       // $(".bar").css("border-color", localStorage.getItem('th_home_square_color'))             
    }, 200)
    $scope.baseImgUrl = getImgPath();
    $('.buttonUI').css('background', localStorage.getItem('th_button_color_theme'))
    $('.color-button').css('background-color', localStorage.getItem('th_button_color_theme'));
    $('#crcButton').css('background', localStorage.getItem('th_button_color_theme'))
    $rootScope.$on("getCategories", function () {

        $scope.getCategories();
    });

    $scope.hideNavBar = function(){
        return $scope.hide;
    }

    $scope.scrollEvent = function() {
        var scrollamount = $ionicScrollDelegate.$getByHandle('scrollHandle').getScrollPosition().top;
            if (scrollamount > 100) { // Would hide nav-bar immediately when scrolled and show it only when all the way at top. You can fiddle with it to find the best solution for you
                $scope.hide = true;                
                $scope.$apply();
            } else {
                $scope.hide = false;
                $scope.$apply();
            }
        }

        $scope.getCategories = function () {
            var res = alasql('SELECT * FROM ? WHERE status = "1" ORDER BY name', [catarray]);
            $scope.categories = res;
            setTimeout(function () {
                $('.menu-button').css('background-color', '#2b252c')
            }, 250)


            $('#bckcat').css("background-image", "url(" + getImgPath() + localStorage.getItem('th_business_background1') + ")")


        };

        $scope.HasPlates = function (id) {
            var res = alasql('SELECT category_id FROM ? WHERE category_id="' + id + '"', [menuarray]);
            if (res.length > 0) {
                return true
            } else {
                return false
            }
        }

        $scope.gotoMenu = function (id) {
            localStorage.setItem('catId', id);
            ctName = $('#nm' + id).text()
            $rootScope.$emit("getMenu", {});
            localStorage.actualCategory = ctName;
            $state.go('tab.menu')
        }
        $scope.exit = function () {
            if (localStorage.getItem('id') != '100015899701211') {
                $.get(getServerPath(), { action: 'updateOnlinePlace', username: localStorage.getItem('id'), value: 0 }, function (data) {
                });
            }
            $ionicHistory.nextViewOptions({
                disableAnimate: false,
                disableBack: true
            });
            $scope.goToView();
            //$state.go('loginBill');
        }

        $scope.goToView = function () {
            switch (menuType) {
                case 'GUESTMENU':
                $state.go('side.submenu');
                break;
                default:
                $state.go('loginBill');
                break;
            }
        };

        $scope.searchPlate = function () {
            $state.go('tab.searchMenu')
        }
    })
    .directive('ngChange', function () {//nueva directiva para ngmodel 
        return {
            require: 'ngModel',
        }
    })
    .controller('cuentaCtrl', function ($scope, $ionicPopup, $state, $ionicLoading, $rootScope, $ionicScrollDelegate) {
        checkKey($state);
        buildScopeStyleSettings($scope);
        $scope.wi = $(document).width();
        $scope.hide = false;
        $scope.logoImage = getImgPath() + localStorage.getItem('place_logo')
        var totalLoc = 0;
        var p = alasql('SELECT * FROM ? WHERE type = "1"', [promoarray]);
        $scope.p = p.length
        setTimeout(function () {
            $('.banner').css("background-image", "url(" + getImgPath() + localStorage.getItem('th_business_background1') + ")")
            $('.color-button').css('background-color', localStorage.getItem('th_button_color_theme'));
        }, 200)
        $scope.sendType = sendType
        $scope.showPedir = true;
        $scope.promo_day = localStorage.promo_day;

        $scope.hideNavBar = function(){
            return $scope.hide;
        }

        $scope.scrollEvent = function() {
            var scrollamount = $ionicScrollDelegate.$getByHandle('scrollHandle').getScrollPosition().top;
            if (scrollamount > 40) { // Would hide nav-bar immediately when scrolled and show it only when all the way at top. You can fiddle with it to find the best solution for you
                $scope.hide = true;                
                $scope.$apply();
            } else {
                $scope.hide = false;
                $scope.$apply();
            }
        }

        $scope.getTables = function () {
            $scope.desks = gbDesk;
        };

        $scope.getBill = function () { // Función que retorna un detalle de la bill y así mismo el cálculo de puntos
            $.get(getServerPath(),
            {
                action: 'get_bill',
                bill_id: localStorage.getItem('bill_id')
            }, function (data) {

                    $scope.bill = JSON.parse(data); //Scope (bill) utilizado en el template para mostrar los puntos que acumula con la compra
                    localStorage.bill = data;
                }
                );
        };

        setTimeout(function () {
            $('.buttonUI').css('background', localStorage.getItem('th_button_color_theme'))
        }, 200)

        $scope.confirm = function () {
            if (totalLoc > 0) {
                if (sendType == 'domicilio') {
                    if (totalLoc < purchMin) {
                        alert('Tu orden de consumo debe ser mayor a L.' + purchMin + ', actualmente es de L.' + totalLoc)
                    } else {
                        $state.go('tab.confirm')
                    }
                } else {
                    $state.go('tab.confirm')
                }
            }

        }

        $scope.nuevaOrden = function () {
            myPopup2 = $ionicPopup.show({
                title: 'Este boton es nada mas para crear una nueva cuenta de pedidos, Los pedidos que ya enviaste no podran ser eliminados. Deseas Continuar?',
                scope: $scope,
                buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>OK</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        localStorage.setItem('bill_id', '')
                        hasOrder = 'false'
                        $state.go('tab.categories');
                    }
                }
                ]
            });
        }

        $scope.seguirOrdenando = function () {
            $state.go('tab.categories')
        }

        if (hasOrder != 'true') {
            if (menuType == 'LOCALMENU') {
                navigator.notification.alert('Presiona Abrir Cuenta y escanea el codigo QR que esta en tu mesa', null, "Tip", "OK");
            }
        }

        $scope.cancelLoad = function () {
            myPopup2.hide()
        };
        var myPopup2;
        $rootScope.$on("getCuenta", function () {
            $scope.getCuenta();
        });
        $scope.getCuenta = function () {
            $scope.getTables();
            $scope.getBill();
            $scope.shoppingCart = [];
            $scope.buttonVisible = hasOrder;
            $('#ctLoader').show();
            if (hasOrder == "true") {
                xhr = $.ajax({
                    url: getServerPath() + "?action=select_bill_detailById&billId=" + localStorage.getItem('bill_id'),
                    dataType: 'json',
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'get',
                    success: function (d) {
                        $('#ctLoader').hide()

                        var initialValue = 0;
                        
                        if($scope.promo_day == 1)
                            $scope.updatePromoCalculationsCart(d);
                        $scope.shoppingCart = d;
                        $scope.shoppingCart.sort(function(a,b){ return a.bill_detail_id < b.bill_detail_id});
                        $scope.total = $scope.shoppingCart.reduce(function(accumulator, currentValue){return accumulator+parseInt(currentValue.bill_detail_price);},initialValue);
                        totalLoc = $scope.total;
                        //$scope.shoppingCart = alasql('SELECT * FROM ? ORDER BY bill_detail_id DESC', [d]);
                        $scope.$apply();
                        
                        $scope.$broadcast('scroll.refreshComplete');

                        // var total_arr = alasql('SELECT SUM(bill_detail_price::NUMBER) as total FROM ?', [$scope.shoppingCart]);
                        // totalLoc = total_arr[0].total;
                        // if (sendType == 'domicilio') {
                        //     $scope.total = total_arr[0].total;
                        // } else {
                        //     $scope.total = total_arr[0].total;
                        // }
                        setTimeout(function () {
                            $('buttonUI').css('background', localStorage.getItem('th_button_color_theme'))
                        }, 500)

                    },
                    error: function (d) {
                        $('#ctLoader').hide();
                        if (d.statusText == 'abort') {
                            return;
                        }
                        customizeAlert(' Asegurate que estas correctamento conectado a Internet')
                    },
                    //  timeout: 7000
                });
            } else {
                $scope.$broadcast('scroll.refreshComplete');
            }
        }

        $scope.updatePromoCalculationsCart = function(cart){
            var filtPlates = [];
            var platesArr = [];
            var merged = []
            for (var i = 0; i < menuarray.length; i++) {
                platesArr.push(menuarray[i].plates)
                if (i == menuarray.length - 1) {
                    merged = [].concat.apply([], platesArr);
                    filtPlates = merged.filter(function(f){ return f.menu_promotion == 1;});
                }
            }

            var filtPromoPlates = cart.filter(function(cartObject){
                return filtPlates.map(function(filtPlate){ return filtPlate.id;}).includes(cartObject.menu_id);
            })

            var discountElementsLength = Math.floor(filtPromoPlates.length/2);

            for(var key in cart){
                var selected = cart[key];
                selected.menu_promotion = merged.find(function(f){ return f.id == selected.menu_id}).menu_promotion;
                selected.menu_price = merged.find(function(f){ return f.id == selected.menu_id}).menu_price;
            }

            cart.sort(function(a,b){ return a.menu_price > b.menu_price});
            cart.sort(function(a,b){ return a.menu_promotion < b.menu_promotion});

            for(var i = 0; i < discountElementsLength; i++){
                var selected = cart[i];
                selected.bill_detail_price = selected.bill_detail_price - selected.menu_price;
                selected.comment = selected.comment + " Descuento aplicado a excepción de extras";
            }
        }

        $scope.abrirCuenta = function () {
            myPopup2 = $ionicPopup.show({
                templateUrl: 'dialogs/newBill.html',
                title: 'Escanea el código QR en la mesa o pidele a un mesero un código ferby',
                scope: $scope,
                buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Escanear</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        $scope.scan();
                    }
                }
                ]
            });
        }

        $scope.introNumber = function () {
            myPopup2.close()
            $ionicLoading.show({
                templateUrl: 'dialogs/loader.html'
            })
            var deskId = $('#desk_Selected').val();
            var pass = $('#pass').val();
            if ($.trim(pass) != "") {
                xhr = $.ajax({
                    url: getServerPath() + "?action=insert_Bill_Pass&desk_id=" + deskId + "&place_loc=" + localStorage.getItem('place_loc') + "&passkey=" + pass,
                    dataType: 'text',
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'get',
                    success: function (d) {
                        var r = $.trim(d)
                        if (r == '000-000') {
                            customizeAlert('La clave no es correcta.')
                            $ionicLoading.hide();
                        } else {
                            if (isNaN(r)) {
                                customizeAlert('La cuenta es invalida o ya no está disponible.')
                                $ionicLoading.hide();
                            } else {
                                if (r == '-1') {
                                    customizeAlert('El codigo QR no es valido, vuelve a interlo');
                                } else {
                                    customizeAlert('Listo! Ya puedes ordenar');
                                    localStorage.setItem('bill_id', r);
                                    hasOrder = 'true';
                                    $ionicLoading.hide();
                                    $scope.getCuenta();
                                    $state.go('tab.categories');
                                }
                            }
                        }
                    },
                    error: function (d) {
                        if (d.statusText == 'abort') {
                            return;
                        }
                        $ionicLoading.hide();
                        customizeAlert('No pudimos conectarnos a Ferby, revisa tu conexión de internet.');
                    },
                    timeout: 7000
                });
            } else {
                customizeAlert('El campo de número Ferby esta vacío')
                $ionicLoading.hide();
            }
        }

        $scope.showNumber = function () {
            var dis = $('#hideInput').css('display');
            if (dis == 'none') {
                $('#hideInput').show('slow')
            } else {
                $('#hideInput').hide('slow')
            }
        }

        $scope.scan = function () {
            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    if ($.trim(result.text) != "") {
                        $ionicLoading.show({
                            templateUrl: 'dialogs/loader.html'
                        })
                        xhr = $.ajax({
                            url: getServerPath() + "?action=insert_Bill_qr&desk_id=" + result.text + "&place_loc=" + localStorage.getItem('place_loc'),
                            dataType: 'text',
                            cache: false,
                            contentType: false,
                            processData: false,
                            type: 'get',
                            success: function (resp) {
                                var r = $.trim(resp)
                                if (isNaN(r)) {
                                    customizeAlert('La cuenta es invalida o ya no está disponible.')
                                    $ionicLoading.hide();
                                } else {
                                    if (r == '-1') {
                                        customizeAlert('El codigo QR no es valido, vuelve a interlo');
                                    } else {
                                        customizeAlert('Listo! Ya puedes ordenar');
                                        localStorage.setItem('bill_id', r);
                                        hasOrder = 'true';
                                        $ionicLoading.hide();
                                        $scope.getCuenta();
                                        $state.go('tab.categories');
                                    }
                                }
                            },
                            error: function (d) {
                                if (d.statusText == 'abort') {
                                    return;
                                }
                                $ionicLoading.hide();
                                customizeAlert('No pudimos conectarnos a Ferby, revisa tu conexión de internet.');
                            },
                            timeout: 7000
                        });
                    }
                },
                function (error) {
                    customizeAlert("Error de Scan");
                });
        }

        $scope.cancelBillDetail = function (id) {
            $ionicLoading.show({
                templateUrl: 'dialogs/loader.html'
            })
            xhr = $.ajax({
                url: getServerPath() + "?action=update_bill_status_cancel&bill_detail_id=" + id,
                dataType: 'text',
                cache: false,
                contentType: false,
                processData: false,
                type: 'get',
                success: function (resp) {
                    var r = $.trim(resp)
                    if (r === "1") {
                        customizeAlert('Pedido cancelado.');
                        $ionicLoading.hide();
                        $rootScope.$emit("updateCart", {});
                        $scope.getCuenta();
                    } else {
                        customizeAlert('No es posible cancelar el pedido, ya est� siendo procesada en cocina.')
                        $ionicLoading.hide();
                        $scope.getCuenta();
                    }
                },
                error: function (d) {
                    if (d.statusText == 'abort') {
                        return;
                    }
                    $ionicLoading.hide();
                    customizeAlert('No pudimos conectarnos a Ferby, revisa tu conexi�n de internet.');
                },
                timeout: 7000,
                async: true
            });
        };

        $scope.fitHeightBanner = function(){
            console.log('scope '+JSON.stringify($scope.style));
            return $scope.style.texture.height.slice(0,-1)>20;
        }
    })

.controller('ctrlTab', function ($scope, $ionicHistory, $state, $rootScope) {
    $('#floating-menu').addClass('active');
    $scope.data = {
        cart: 0,
    };
    $scope.wa = {};
    $scope.wa.phone = localStorage.th_phone;
    $scope.openwa = function () {
        window.location = "https://api.whatsapp.com/send?phone=" + localStorage.th_phone
    }

    $scope.searchPlate = function () {
        $state.go('tab.searchMenu')
    }

    $scope.exit = function () {
        if (localStorage.getItem('id') != '100015899701211') {
            $.get(getServerPath(), { action: 'updateOnlinePlace', username: localStorage.getItem('id'), value: 0 }, function (data) {
            });
        }
        $ionicHistory.nextViewOptions({
            disableAnimate: false,
            disableBack: true
        });

        $state.go('loginBill');
    }

    setTimeout(function () {
        $('#floating-menu').removeClass('active');
    }, 2000)

    $scope.tabInit = function () {
        var c = alasql('SELECT * FROM ? WHERE type = "2"', [promoarray]);
        var p = alasql('SELECT * FROM ? WHERE type = "1"', [promoarray]);
        $scope.p = p.length
        $scope.c = c.length
        $scope.type = menuType;
            //$scope.$apply();
        }

        $rootScope.$on('updateCart', function (event, iResult) {//receive the data as second parameter
            $scope.updateCartBadges()
        });

        $scope.updateCartBadges = function () {
            xhr = $.ajax({
                url: getServerPath() + "?action=select_bill_detailById&billId=" + localStorage.getItem('bill_id'),
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false,
                type: 'get',
                success: function (d) {
                    var totalCart = d.map(function(bill){return parseInt(bill.qty,10)}).reduce(function(a,b){return a+b;},0);
                    $scope.data.cart = totalCart;
                    $scope.$apply();
                },
                error: function (d) {
                    if (d.statusText == 'abort') {
                        return;
                    }
                    
                },
            });
        }

    })
.controller('confirmCtrl', function ($scope, $state, $ionicPlatform, $ionicLoading, $ionicHistory, $ionicPopup) {
    checkKey($state);
    Waves.attach('button')
    Waves.attach('.waves-block')
    Waves.init();
    buildScopeStyleSettings($scope);
    $scope.politics = politics;
    $scope.confirm = {
        identidad: '',
        username: ''
    };
    $scope.delivery = {};
    $scope.calendar_order = 0;

    setTimeout(function () {
        $('.banner').css("background-image", "url(" + getImgPath() + localStorage.getItem('th_business_background1') + ")")
        if(localStorage.user_id.length == 13){
            $scope.confirm.identidad = localStorage.user_id;
            $scope.confirm.username = localStorage.user_id;
        }

    }, 200)

        //$scope.confirm.identidad = localStorage.user_id; //Scope utilizado para  mostrar la identidad si se guardó previamente en caché.

        $scope.acumulatePoints = function(){
            if($scope.placeTheme.addon_puntos == 0)
                return;
            if($scope.puntos.bill_points<=0)
                return;

            setTimeout(function () {

                if(localStorage.user_id.length!=13){
                    myPopup = $ionicPopup.show({
                        templateUrl: 'dialogs/update_id.html',
                        title: $scope.settings.title,
                        subTitle: $scope.settings.redeem_instruction+$scope.settings.redeem_name+', '+$scope.settings.redeem_description,
                        scope: $scope,
                        buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>OK</b>',
                            type: 'button-stable',
                            onTap: function (e) {
                                var validate = validateGiftUser($scope.confirm.username);
                                if (validate != true) {
                                    alert(validate);
                                    $scope.acumulatePoints();
                                    return;
                                }

                                localStorage.user_id = $scope.confirm.username;

                            }
                        }
                        ]
                    });
                }
                $scope.$apply;
            }, 1000)
        }

        $scope.init = function () {
            $scope.calendar_order = localStorage.calendar_order;
            $scope.confirm.calendar_order = localStorage.calendar_order;
            var dateObj = new Date();
            var month = dateObj.getUTCMonth() + 1; //months from 1-12
            var day = dateObj.getUTCDate();
            var year = dateObj.getUTCFullYear();
            $scope.today =  year + "-" + month + "-" + day;
            $scope.confirm.default_date = year + "-" + month + "-" + day;

            $scope.puntos = JSON.parse(localStorage.bill);
            $scope.acumulatePoints();
            
            if (deliveryType == 1) {
                $('#dir').hide();
                $('#dirContent').hide();
            } else {
                $scope.delivery.show = 1;
            }
            if (localStorage.getItem('nombre') != null) {
                $scope.sendType = sendType;
                $('#dir').val(localStorage.getItem('dir'))
                $scope.tel = localStorage.getItem('tel');
                $scope.nombre = localStorage.getItem('nombre');
                $scope.mail = localStorage.getItem('mail');
                $scope.identidad = localStorage.user_id;
                var res = alasql('SELECT * FROM ? WHERE place_location_id = "' + localStorage.getItem('place_loc') + '"', [places]);
                $scope.storeName = res[0].name;
                $scope.$apply();
            } else {
                var res = alasql('SELECT * FROM ? WHERE place_location_id = "' + localStorage.getItem('place_loc') + '"', [places]);
                $scope.storeName = res[0].name;
                $scope.sendType = sendType;
                $scope.$apply();
            }

        }

        $scope.cleanForm = function () {
            $('#dir').val('');
            $('#nombre').val('');
            $('#mail').val('');
            $('#tel').val('');
        }


        $scope.updatBillHomeDetail = function () {
            var lat, lng, mail, tel, dir, place_id, nom, dirText, date;
            lat = 'x';
            lng = 'y';

            if($scope.calendar_order == 1 && ($scope.confirm.default_date != $scope.today))
                date = $scope.confirm.default_date.toISOString().substring(0,10);
            else
                date = $scope.today;

            if (sendType == 'llevar') {
                dirText = 'PICK UP: ' + ". Pago en " + $("#tipoPago").val();
            } else {
                if (sendType == 'domicilio') {
                    dirText = 'DOMICILIO: ' + ' ' + $('#dir').val() + ". Pago en " + $("#tipoPago").val();
                    if ($('#dir').val() == '') {
                        alert('Debes llenar el espacio de direccion')
                        return
                    }
                } else {
                    dirText = 'PRE-ORDER: ' + ". Pago en " + $("#tipoPago").val();
                }
            }
            mail = $('#mail').val();
            tel = $('#tel').val();
            place_id = localStorage.getItem('place_loc')
            nom = $('#nombre').val();
            $ionicLoading.show({
                templateUrl: 'dialogs/loader.html'
            })

            if ($('#user_id').val() == null) {
                var user_id = '';
            } else {
                var user_id = $('#user_id').val()
            }

            localStorage.setItem('dir', $('#dir').val());
            localStorage.setItem('tel', $('#tel').val());
            localStorage.setItem('nombre', $('#nombre').val());
            localStorage.setItem('mail', $('#mail').val());
            if($scope.puntos.bill_points > 0 && $scope.placeTheme.addon_puntos == 1)
            {
                var validate = validateGiftUser(user_id);
                if (validate != true) {
                    alert(validate);
                    $ionicLoading.hide();
                    return;
                }
                localStorage.identidad = user_id;
            }

            setTimeout(function () {
               if (sendType == 'domicilio') {
                   if ($.trim(dirText) != 0) {
                   } else {
                      $ionicLoading.hide();
                      customizeAlert('Debes darnos una direccion escrita con referencias')
                  }
              }
              if ($.trim(tel) != 0) {
                if ($.trim(nom) != 0) {
                    if (validateEmail(mail) == true) {
                        if($scope.placeTheme.addon_cupones == 1){
                            if($scope.confirm.cupon)
                                dirText += " | Cupon: "+$scope.confirm.cupon;
                        }
                        xhr = $.ajax({
                            url: getServerPath() + "?action=update_bill_home_order&bill_id=" + localStorage.getItem('bill_id')
                            + "&longitud=" + lng
                            + "&latitud=" + lat
                            + "&nombre=" + illegalChar(nom)
                            + "&telefono1=" + illegalChar(tel)
                            + "&email=" + illegalChar(mail)
                            + "&direccion=" + illegalChar(dirText)
                            + "&place_loc_id=" + place_id
                                    + "&uuid=" + ""//+ device.uuid,
                                    + "&track_id=" + localStorage.track_id
                                    + "&deliveryDate=" + date
                                    + "&username=" + user_id
                                    + "&bill_token=" + localStorage.gcmToken,
                                    dataType: 'text',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    type: 'get',
                                    success: function (d) {
                                        localStorage.removeItem('bill_id')
                                        $ionicLoading.hide();
                                        var r = $.trim(d)
                                        if (r == "1") {
                                            $ionicHistory.nextViewOptions({
                                                disableAnimate: false,
                                                disableBack: true
                                            });
                                            $state.go('sent');
                                        } else {
                                            customizeAlert('Ha ocurrido un error de nuestro lado.')
                                        }
                                    },
                                    fail: function (d) {
                                        $ionicLoading.hide();
                                    }
                                });

                    } else {
                        $ionicLoading.hide();
                        customizeAlert('Debes darnos un formato valido de email')
                    }

                } else {
                    $ionicLoading.hide();
                    customizeAlert('Debes digitar tu nombre')
                }
            } else {
                $ionicLoading.hide();
                customizeAlert('Debes digitar tu numero telefonico')
            }
        }, 250)
        }
    })

.controller('sentCtrl', function ($scope, $state) {
    buildScopeStyleSettings($scope);
})
.controller('domiciliosCtrl', function ($scope, $state) {
    Waves.attach('button')
    Waves.attach('.waves-block')
    Waves.init();
    $scope.init = function () {

        xhr = $.ajax({
            url: getServerPath() + "?action=selectDomiciliouuid&uuid=" + device.uuid,
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            type: 'GET',
            success: function (json) {

                var js = JSON.parse(auth_place_id)
                var cnc = '';
                for (var i = 0; i < js.length; i++) {
                    if (i == 0) {
                        cnc += ' WHERE place_id = "' + js[i].place_id + '"';
                    } else {
                        cnc += ' OR place_id = "' + js[i].place_id + '"';
                    }
                    if (i == js.length - 1) {
                        var res = alasql('SELECT * FROM ? ' + cnc, [json]);
                        selectDomicilio = res;
                        $scope.bills = res;
                        $scope.$apply()
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                }
            },
            fail: function (d) {
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            }
        });

    }
    $scope.goToDetalle = function (bill_id) {
        sessionStorage.setItem('bill_id', bill_id)
        $state.go('side.domiciliosDetalle')
    }
})

.controller('taxiCtrl',function($scope,$state,$ionicPopup,$ionicLoading, $ionicScrollDelegate ){
    $scope.loading = {}
    $scope.catServices = []
    $scope.service = { value: "" };
    $scope.confirm = { qty: 1, comment: '', instrucciones: '', tel: '', mail: '', nombre: ''};
    $scope.addon_puntos = 0;
    $scope.settings = {};
    var zoom = 12;
    var accuracy = 500;


    $scope.getCatMenuServices = function(){
        console.log('getCatMenuServices init');
        $.getJSON(getServerPath(), {
            action: 'get_category_menu',
            category_id: localStorage.category_id
        }, function (r) {
            console.log('r: '+JSON.stringify(r));
            $scope.catServices = r;
            $scope.$apply();

            if(r == null)
            {
                alert('Por los momentos el servicio seleccionado está en mantenimiento, favor contactenos o utilice otro.');
                $state.go('loginBill');
                return;
            }
        });    
    }

    $scope.pedirTaxi = function () {
        $('#map').height($(document).height() * 1);
        $('#sigBtn').show('slow');
        $scope.getCatMenuServices();
        $scope.loadDefaults();
        if(localStorage.placeSettings != undefined || localStorage.placeSettings != 'undefined')
            $scope.settings = JSON.parse(localStorage.placeSettings);
        $scope.addon_puntos = localStorage.addon_puntos;

        $ionicLoading.show({
            templateUrl: 'dialogs/loader.html'
        })

        var latitude = localStorage.place_lat;
        var longitud = localStorage.place_lon;

        if(typeof cordova === "undefined"){
            $ionicLoading.hide();
            $scope.drawMap(latitude, longitud, accuracy, zoom);
            $scope.updateHtml();
            return;
        }

        cordova.plugins.diagnostic.isGpsLocationEnabled(function (enabled) {

            var onSuccess = function(position) {
                console.log('aqui sin error');
                latitude = position.coords.latitude;
                longitud = position.coords.longitude;
                accuracy = position.coords.accuracy;
                zoom = 16;

                    // Add the circle for this city to the map.
                    //circle = new google.maps.Circle(mapOpt);
                    $ionicLoading.hide()
                    $scope.drawMap(latitude, longitud, accuracy, zoom);
                    $scope.updateHtml();

                };
                function onError(error) {
                    console.log('aqui con error');
                    $ionicLoading.hide(); //alert('La app necesita Gps en Presicion Alta, ve a Ajustes -> ubicacion -> Modo y selecciona Presicion Alta'); $ionicHistory.goBack();
                    $scope.drawMap(latitude, longitud, accuracy, zoom);
                    $scope.updateHtml();
                    
                }

                if(enabled){
                    navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 7000 });
                    return;
                }

                console.log('aqui con error');
                $ionicLoading.hide(); //alert('La app necesita Gps en Presicion Alta, ve a Ajustes -> ubicacion -> Modo y selecciona Presicion Alta'); $ionicHistory.goBack();
                $scope.drawMap(latitude, longitud, accuracy, zoom);
                $scope.updateHtml();
                return;

            }, function (error) {
                console.log('aqui con error diagnostics');
                $ionicLoading.hide(); //alert(' Debes activar tu GPS para poder posicionarte'); $ionicHistory.goBack();
                $scope.drawMap(latitude, longitud, accuracy, zoom);
                $scope.updateHtml();
            });



    }

    $scope.updateHtml = function(){
        if (modo == "encomienda") {
            $('#sectionA').hide('slow');
            $('#sectionB').show('slow');
            $('#sectionF').show('slow');
        } else {
            $('#sectionA').hide('slow');
            $('#sectionB').show('slow');
            $('#sectionD').show('slow');
        }
    }

    $scope.drawMap = function(lat, long, accuracy, zoom){
        var circle;
        var latFixed = parseFloat(lat).toFixed(5);
        var longFixed = parseFloat(long).toFixed(5);

        localStorage.lat = latFixed;
        localStorage.lng = longFixed;

        var point = new google.maps.LatLng(latFixed, longFixed);
        var mapOptions = {
            zoom: zoom,
            center: point,                
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            radius: accuracy,
            mapTypeControl: false,
            streetViewControl: false,
            fullScreenControl: false
        };
        var map = new google.maps.Map(document.getElementById('map'), mapOptions);
            // Construct the circle for each value in citymap.
            // Note: We scale the area of the circle based on the population.
            console.log('point: '+JSON.stringify(point));
            var mapOpt = {
                strokeColor: '#f5a604',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#feca03',
                fillOpacity: 0.35,
                map: map,
                center: point,
                radius: accuracy,
                zoom: zoom
            };
            // Add the circle for this city to the map.
            circle = new google.maps.Circle(mapOpt);
        }

        $scope.serviceChange = function(){
            let serviceSelected = $('#services').val()
            $scope.service.value = serviceSelected;
            let productSelected = $scope.catServices.find(f => f.menu_id ==  serviceSelected);
            localStorage.bill_points = productSelected.menu_points;
        }

        $scope.defaultService = function(){
            setTimeout(function(){
                $("#services").prop("selectedIndex", 1);
                $scope.service.value = $scope.catServices[0].menu_id;
                localStorage.bill_points = $scope.catServices[0].menu_points;
                $scope.confirm.comment = "  ";
                $scope.confirm.instrucciones = "  ";
            },1000)
        }


        $scope.acumulatePoints = function(){
            setTimeout(function () {
                if($scope.addon_puntos == 1)
                    if (localStorage.user_id.length != 13) {
                        console.log('dialog update id');
                        var myPopup = $ionicPopup.show({
                            templateUrl: 'dialogs/update_id.html',
                            title: $scope.settings.redeem_title,
                            scope: $scope,
                            buttons: [
                            { text: 'Cancelar' },
                            {
                                text: '<b>Actualizar</b>',
                                type: 'button-stable',
                                onTap: function (e) {

                                    var validate = validateIdentidad($scope.confirm.username);
                                    if (validate != true) {
                                        alert(validate);
                                        $scope.acumulatePoints();
                                        return;
                                    }

                                    localStorage.user_id = $scope.confirm.username;
                                }
                            }
                            ]
                        });
                    } else $scope.confirm.username = localStorage.user_id;
                    $scope.$apply();
                }, 1000)
        }

        $scope.step2 = function () {
            console.log('hola');
            $scope.acumulatePoints();

            setTimeout(function () {
                if (localStorage.getItem('nombre') != null) {
                    $scope.tel = localStorage.getItem('tel');
                    $scope.nombre = localStorage.getItem('nombre');
                    $scope.mail = localStorage.getItem('mail');
                    $scope.$apply();
                }
            }, 1500)
            $('#sigBtn').hide('slow');
            $('#sectionE').show('slow');
          //  $('#map').hide('slow');
          $ionicScrollDelegate.scrollTop();
      }

      $scope.create_order = function(){
        console.log('create_order init');

        if($scope.service.value.trim() == ""){
            alert('Debes elegir un servicio antes de continuar.')
            return;
        }

        if($scope.validFormConfirm() == false){
            alert('Debes llenar correctamente los campos.');
            return;
        }

        if($scope.confirm.username != ''){
            localStorage.user_id = $scope.confirm.username;
            localStorage.identidad = $scope.confirm.username;
        }

        var menu_id = $scope.service.value;

        var order = {
            latitud: localStorage.lat,
            longitud: localStorage.lng,
            store_id: localStorage.store_id,
            nombre: $scope.confirm.nombre,
            telefono1: $scope.confirm.tel,
            email: $scope.confirm.mail,
            direccion: zoom == 12 ? "GPS NO DETECTADO: "+$scope.confirm.instrucciones : $scope.confirm.instrucciones,
            comment: $scope.confirm.comment,
            bill_username: $scope.confirm.username,
            bill_points: localStorage.bill_points,
            qty: $scope.confirm.qty,
            place_id: Theme_id,
            menu_id: menu_id,
            track_id: localStorage.track_id,
            bill_token: localStorage.gcmToken

        };

        order.action = "create_order";

        $ionicLoading.show({
            templateUrl: 'dialogs/loader.html'
        })

        $.getJSON(getServerPath(), order, function (r) {
            console.log('r: '+JSON.stringify(r));
            alert('Solicitud enviada, atento al celular que proximamente te contactaremos!');
            $ionicLoading.hide();
            $scope.setNewDefaults(order);
            $state.go('loginBill');
                //$scope.$apply();
            }); 
    }

    $scope.validFormConfirm = function(){

        var nombre = $('#nombre').val(); $scope.confirm.nombre = nombre;
        var tel = $('#tel').val(); $scope.confirm.tel = tel;
        var comment = $('#comment').val(); $scope.confirm.comment = comment;
        var instrucciones = $('#instrucciones').val(); $scope.confirm.instrucciones = instrucciones;

        if($scope.confirm.nombre.length < 2 ){
            alert('Ingrese correctamente el nombre')
            return false;
        }

            //alert('esta malo el nombre '+$scope.confirm.nombre);

            if($scope.confirm.tel.length < 4 ){
                alert('Ingrese correctamente el telefono')
                return false;
            }

            //alert('esta malo el telefono: '+$scope.confirm.tel)

            if($scope.confirm.comment.length < 1 ){
                alert('Ingrese correctamente la ubicacion destino')
                return false;
            }

            //alert('esta malo el comment: '+$scope.confirm.comment)

            if($scope.confirm.instrucciones.length < 1){
                alert('Ingrese correctamente la ubicacion origen')
                return false;
            }

                //alert('esta malo el instrucciones: '+$scope.confirm.instrucciones)

                return true;
            }

            $scope.setNewDefaults = function(order){

                localStorage.nombre = order.nombre;
                localStorage.telefono1 = order.telefono1;
                localStorage.email = (order.email == undefined  || order.email == "undefined" )? '': order.email;


                localStorage.lat = undefined;
                localStorage.lon = undefined;
            }

            $scope.loadDefaults = function(){

                if(localStorage.nombre !== undefined)
                  $scope.confirm.nombre = localStorage.nombre;

              if(localStorage.telefono1 !== undefined)
                  $scope.confirm.tel = localStorage.telefono1;

              if(localStorage.email !== undefined)
                  $scope.confirm.mail = localStorage.email;                    

          }
      })

.controller('domiciliosDetalleCtrl', function ($scope, $state) {
    Waves.attach('button')
    Waves.attach('.waves-block')
    Waves.init();
    $scope.inicio = function () {
        var lat, lon, zoom;
        var res = alasql('SELECT * FROM ? WHERE bill_id = "' + sessionStorage.getItem('bill_id') + '"', [selectDomicilio]);
        $.getJSON(getServerPath(), { action: "selectDomicilio", place_id: "1" }, function (json) {
                //var res = alasql('SELECT * FROM ? WHERE bill_id = "' + sessionStorage.getItem('bill_id') + '"', [selectDomicilio]);
                $scope.orden = res;
                $scope.$apply();
            })

        $.getJSON(getServerPath(), {
            action: 'queryBill',
            bill_id: sessionStorage.getItem('bill_id')
        }, function (json) {
            $scope.detail = json;
            $scope.$apply();
        })
        if (res[0].latitud == 'x') {
            $('#map').hide('slow');
        } else {
            $('#map').show('slow');
            lat = res[0].latitud;
            lon = res[0].longitud;
            zoom = 16;
            var e = new google.maps.LatLng(lat, lon), t = { zoom: zoom, center: e, panControl: !0, scrollwheel: !1, scaleControl: !0, overviewMapControl: !0, overviewMapControlOptions: { opened: !0 }, mapTypeId: google.maps.MapTypeId.HYBRID };
            map = new google.maps.Map(document.getElementById("map"), t), geocoder = new google.maps.Geocoder, marker = new google.maps.Marker({ position: e, map: map }), map.streetViewControl = !1, infowindow = new google.maps.InfoWindow({ content: "(1.10, 1.10)" }), google.maps.event.addListener(map, "click", function (e) {
                marker.setPosition(e.latLng);
                var t = e.latLng, o = "(" + t.lat().toFixed(6) + ", " + t.lng().toFixed(6) + ")";
                infowindow.setContent(o), document.getElementById("lat").value = t.lat().toFixed(6), document.getElementById("lng").value = t.lng().toFixed(6), document.getElementById("latlngspan").innerHTML = o, document.getElementById("coordinatesurl").value = "http://www.latlong.net/c/?lat=" + t.lat().toFixed(6) + "&long=" + t.lng().toFixed(6), document.getElementById("coordinateslink").innerHTML = '&lt;a href="http://www.latlong.net/c/?lat=' + t.lat().toFixed(6) + "&amp;long=" + t.lng().toFixed(6) + '" target="_blank"&gt;(' + t.lat().toFixed(6) + ", " + t.lng().toFixed(6) + ")&lt;/a&gt;", dec2dms()
            }), google.maps.event.addListener(map, "mousemove", function (e) {
                var t = e.latLng;
                document.getElementById("mlat").innerHTML = "(" + t.lat().toFixed(6) + ", " + t.lng().toFixed(6) + ")"
            })
        }
    }
})

function checkKey(state){
    if(rev==0)
        state.go('loginBill');
}

function getParameterByName(name, url) {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

  // function alert(vr){
  //       navigator.notification.confirm(vr, null, "", "OK")
  //   }

function initScratch(idElem){
  
   var isDrawing, lastPoint;
  var container    = document.getElementById('scratch-container'),
      canvas       = document.getElementById('scratch-canvas'),
      canvasWidth  = canvas.width,
      canvasHeight = canvas.height,
      ctx          = canvas.getContext('2d'),
      image        = new Image(),
      brush        = new Image(),
    scratched    = 35;
      
  image.src = 'data:image/jpeg;base64,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';
  image.onload = function() {
    ctx.drawImage(image, 0, 0);
    $('.winner-box').css({visibility: 'visible'});
  };
  brush.src = 'data:image/png;base64,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';
  
  canvas.addEventListener('mousedown', handleMouseDown, false);
  canvas.addEventListener('touchstart', handleMouseDown, false);
  canvas.addEventListener('mousemove', handleMouseMove, false);
  canvas.addEventListener('touchmove', handleMouseMove, false);
  canvas.addEventListener('mouseup', handleMouseUp, false);
  canvas.addEventListener('touchend', handleMouseUp, false);
  
  function distanceBetween(point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
  }
  
  function angleBetween(point1, point2) {
    return Math.atan2( point2.x - point1.x, point2.y - point1.y );
  }
  
  function getFilledInPixels(stride) {
    if (!stride || stride < 1) { stride = 1; }
    
    var pixels   = ctx.getImageData(0, 0, canvasWidth, canvasHeight),
        pdata    = pixels.data,
        l        = pdata.length,
        total    = (l / stride),
        count    = 0;
    
    for(var i = count = 0; i < l; i += stride) {
      if (parseInt(pdata[i]) === 0) {
        count++;
      }
    }
    
    return Math.round((count / total) * 100);
  }
  
  function getMouse(e, canvas) {
    var offsetX = 0, offsetY = 0, mx, my;

    if (canvas.offsetParent !== undefined) {
      do {
        offsetX += canvas.offsetLeft;
        offsetY += canvas.offsetTop;
      } while ((canvas = canvas.offsetParent));
    }

  if (!hasTouch()) {
    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;
  } else {
    var touch = e.touches[0];
    mx = touch.pageX - offsetX;
    my = touch.pageY - offsetY;
  }

    return {x: mx, y: my};
  }
  
  function handlePercentage(filledInPixels,scratched) {
    filledInPixels = filledInPixels || 0;
    console.log(filledInPixels + '%');
    if (filledInPixels > scratched) {
        if(raspado == 0){
            raspado = 1;
            sendScratch();
        }
      
      $('#scratch-canvas').fadeOut('slow');
    }
  }
  
  function handleMouseDown(e) {
    isDrawing = true;
    lastPoint = getMouse(e, canvas);
  }

  function handleMouseMove(e) {
    if (!isDrawing) { return; }
    
    e.preventDefault();

    var currentPoint = getMouse(e, canvas),
        dist = distanceBetween(lastPoint, currentPoint),
        angle = angleBetween(lastPoint, currentPoint),
        x, y;
    
    for (var i = 0; i < dist; i++) {
      x = lastPoint.x + (Math.sin(angle) * i) - 25;
      y = lastPoint.y + (Math.cos(angle) * i) - 25;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.drawImage(brush, x, y);
    }
    
    lastPoint = currentPoint;
    handlePercentage(getFilledInPixels(32),scratched);
  }

  function handleMouseUp(e) {
    isDrawing = false;
  }
  
  function hasTouch() {
  return (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
  }
  setTimeout(function(){$("#" + idElem).show();},500)
  
}

function sendScratch(){
 
        var resp = 0;
        
        $.getJSON(getServerPath(), {
            action: 'rasparscratch',
            identidad: localStorage.user_id,
            scratch_id: localStorage.scratched_id,
            generated_id: localStorage.generated_scratched_id
        }, function (r) {
            //console.log('r: '+JSON.stringify(r));
            $scope.reclamados = r;
            $scope.$apply();
            // console.log($scope.reclamados);
            resp = $.trim($scope.reclamados)
            $ionicLoading.hide()
            console.log('resp: ' + resp);
            if (resp == 1) {
                customizeAlert('Raspable raspado correctamente');
                
                return;
            }

            customizeAlert('Error de raspado');

        });  
}