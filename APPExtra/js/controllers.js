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

.controller('listScratchCtrl', function($scope, $ionicPopup,$ionicLoading, $state, $rootScope, $ionicModal,$ionicScrollDelegate){

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
                localStorage.setItem('scratch_generated_id', scratched_id);
                setTimeout(function(){
                    $ionicScrollDelegate.freezeAllScrolls(true);
                    $ionicScrollDelegate.$getByHandle('mainScroll').getScrollView().options.scrollingY = false;
                },1000);
                
                $state.go('side.scratch');
            }else{
                alert("Esta opcion es solo para usuarios registrados");
            }
            
    }


    

    $scope.getScratchGenerated = function(){
        setTimeout(function(){
                    $ionicScrollDelegate.freezeAllScrolls(true);
                    $ionicScrollDelegate.$getByHandle('mainScroll').getScrollView().options.scrollingY = false;
                },1000);
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

           
                $ionicScrollDelegate.$getByHandle('mainScroll').freezeScroll(true);


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
      
  image.src = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/7S/sUGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAFQcAVoAAxslRxwCAAACAAAcAkEAIUFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKRwCNwAIMjAxOTA5MDkcAjwACzEyMDkzNSswMDAwAAA4QklNBCUAAAAAABBCgWd91qD/o2asiDfhSYj8OEJJTQQ6AAAAAAERAAAAEAAAAAEAAAAAAAtwcmludE91dHB1dAAAAAUAAAAAUHN0U2Jvb2wBAAAAAEludGVlbnVtAAAAAEludGUAAAAAQ2xybQAAAA9wcmludFNpeHRlZW5CaXRib29sAAAAAAtwcmludGVyTmFtZVRFWFQAAAASAEUAUABTAE8ATgAgAEwAMwA5ADUAIABTAGUAcgBpAGUAcwAAAAAAD3ByaW50UHJvb2ZTZXR1cE9iamMAAAARAEEAagB1AHMAdABlACAAZABlACAAcAByAHUAZQBiAGEAAAAAAApwcm9vZlNldHVwAAAAAQAAAABCbHRuZW51bQAAAAxidWlsdGluUHJvb2YAAAAJcHJvb2ZDTVlLADhCSU0EOwAAAAACLQAAABAAAAABAAAAAAAScHJpbnRPdXRwdXRPcHRpb25zAAAAFwAAAABDcHRuYm9vbAAAAAAAQ2xicmJvb2wAAAAAAFJnc01ib29sAAAAAABDcm5DYm9vbAAAAAAAQ250Q2Jvb2wAAAAAAExibHNib29sAAAAAABOZ3R2Ym9vbAAAAAAARW1sRGJvb2wAAAAAAEludHJib29sAAAAAABCY2tnT2JqYwAAAAEAAAAAAABSR0JDAAAAAwAAAABSZCAgZG91YkBv4AAAAAAAAAAAAEdybiBkb3ViQG/gAAAAAAAAAAAAQmwgIGRvdWJAb+AAAAAAAAAAAABCcmRUVW50RiNSbHQAAAAAAAAAAAAAAABCbGQgVW50RiNSbHQAAAAAAAAAAAAAAABSc2x0VW50RiNQeGxAcsAAAAAAAAAAAAp2ZWN0b3JEYXRhYm9vbAEAAAAAUGdQc2VudW0AAAAAUGdQcwAAAABQZ1BDAAAAAExlZnRVbnRGI1JsdAAAAAAAAAAAAAAAAFRvcCBVbnRGI1JsdAAAAAAAAAAAAAAAAFNjbCBVbnRGI1ByY0BZAAAAAAAAAAAAEGNyb3BXaGVuUHJpbnRpbmdib29sAAAAAA5jcm9wUmVjdEJvdHRvbWxvbmcAAAAAAAAADGNyb3BSZWN0TGVmdGxvbmcAAAAAAAAADWNyb3BSZWN0UmlnaHRsb25nAAAAAAAAAAtjcm9wUmVjdFRvcGxvbmcAAAAAADhCSU0D7QAAAAAAEAEsAAAAAQABASwAAAABAAE4QklNBCYAAAAAAA4AAAAAAAAAAAAAP4AAADhCSU0EDQAAAAAABAAAAEA4QklNBBkAAAAAAAQAAAAgOEJJTQPzAAAAAAAJAAAAAAAAAAABADhCSU0nEAAAAAAACgABAAAAAAAAAAI4QklNA/UAAAAAAEgAL2ZmAAEAbGZmAAYAAAAAAAEAL2ZmAAEAoZmaAAYAAAAAAAEAMgAAAAEAWgAAAAYAAAAAAAEANQAAAAEALQAAAAYAAAAAAAE4QklNA/gAAAAAAHAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAOEJJTQQAAAAAAAACAAI4QklNBAIAAAAAAAYAAAAAAAA4QklNBDAAAAAAAAMBAQEAOEJJTQQtAAAAAAACAAA4QklNBAgAAAAAABUAAAABAAACQAAAAkAAAAABAAC9gAAAOEJJTQQeAAAAAAAEAAAAADhCSU0EGgAAAAADQwAAAAYAAAAAAAAAAAAADDgAAAvYAAAABwByAGEAcwBwAGEAZABvAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAvYAAAMOAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAABAAAAABAAAAAAAAbnVsbAAAAAIAAAAGYm91bmRzT2JqYwAAAAEAAAAAAABSY3QxAAAABAAAAABUb3AgbG9uZwAAAAAAAAAATGVmdGxvbmcAAAAAAAAAAEJ0b21sb25nAAAMOAAAAABSZ2h0bG9uZwAAC9gAAAAGc2xpY2VzVmxMcwAAAAFPYmpjAAAAAQAAAAAABXNsaWNlAAAAEgAAAAdzbGljZUlEbG9uZwAAAAAAAAAHZ3JvdXBJRGxvbmcAAAAAAAAABm9yaWdpbmVudW0AAAAMRVNsaWNlT3JpZ2luAAAADWF1dG9HZW5lcmF0ZWQAAAAAVHlwZWVudW0AAAAKRVNsaWNlVHlwZQAAAABJbWcgAAAABmJvdW5kc09iamMAAAABAAAAAAAAUmN0MQAAAAQAAAAAVG9wIGxvbmcAAAAAAAAAAExlZnRsb25nAAAAAAAAAABCdG9tbG9uZwAADDgAAAAAUmdodGxvbmcAAAvYAAAAA3VybFRFWFQAAAABAAAAAAAAbnVsbFRFWFQAAAABAAAAAAAATXNnZVRFWFQAAAABAAAAAAAGYWx0VGFnVEVYVAAAAAEAAAAAAA5jZWxsVGV4dElzSFRNTGJvb2wBAAAACGNlbGxUZXh0VEVYVAAAAAEAAAAAAAlob3J6QWxpZ25lbnVtAAAAD0VTbGljZUhvcnpBbGlnbgAAAAdkZWZhdWx0AAAACXZlcnRBbGlnbmVudW0AAAAPRVNsaWNlVmVydEFsaWduAAAAB2RlZmF1bHQAAAALYmdDb2xvclR5cGVlbnVtAAAAEUVTbGljZUJHQ29sb3JUeXBlAAAAAE5vbmUAAAAJdG9wT3V0c2V0bG9uZwAAAAAAAAAKbGVmdE91dHNldGxvbmcAAAAAAAAADGJvdHRvbU91dHNldGxvbmcAAAAAAAAAC3JpZ2h0T3V0c2V0bG9uZwAAAAAAOEJJTQQoAAAAAAAMAAAAAj/wAAAAAAAAOEJJTQQRAAAAAAABAQA4QklNBBQAAAAAAAQAAABSOEJJTQQMAAAAACULAAAAAQAAAJsAAACgAAAB1AABJIAAACTvABgAAf/Y/+0ADEFkb2JlX0NNAAL/7gAOQWRvYmUAZIAAAAAB/9sAhAAMCAgICQgMCQkMEQsKCxEVDwwMDxUYExMVExMYEQwMDAwMDBEMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAQ0LCw0ODRAODhAUDg4OFBQODg4OFBEMDAwMDBERDAwMDAwMEQwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCACgAJsDASIAAhEBAxEB/90ABAAK/8QBPwAAAQUBAQEBAQEAAAAAAAAAAwABAgQFBgcICQoLAQABBQEBAQEBAQAAAAAAAAABAAIDBAUGBwgJCgsQAAEEAQMCBAIFBwYIBQMMMwEAAhEDBCESMQVBUWETInGBMgYUkaGxQiMkFVLBYjM0coLRQwclklPw4fFjczUWorKDJkSTVGRFwqN0NhfSVeJl8rOEw9N14/NGJ5SkhbSVxNTk9KW1xdXl9VZmdoaWprbG1ub2N0dXZ3eHl6e3x9fn9xEAAgIBAgQEAwQFBgcHBgU1AQACEQMhMRIEQVFhcSITBTKBkRShsUIjwVLR8DMkYuFygpJDUxVjczTxJQYWorKDByY1wtJEk1SjF2RFVTZ0ZeLys4TD03Xj80aUpIW0lcTU5PSltcXV5fVWZnaGlqa2xtbm9ic3R1dnd4eXp7fH/9oADAMBAAIRAxEAPwDk2tc9wYwFznEBrQJJJ0DWhaL+lY2O81ZufVRkNMWUsY+0sPdlllTfS9Rv57a32JuiezIvym/zmJjW3VHwfHpVWf1qn2+qz+WxZyonilIxEuERA2+biP8Aee1PFKRiDwiIG2/Ef7zofYelf+Wbf+2Lf/IpfYelf+Wbf+2Lf/IrPSR4Jf5yX/jf/eJ4Jfvy/wCZ/wB66H2HpX/lm3/ti3/yKX2HpX/lm3/ti3/yKz0kuCX+cl/43/3iuCX78v8Amf8Aeuh9h6V/5Zt/7Yt/8il9h6V/5Zt/7Yt/8is9JLgl/nJf+N/94rgl/nJf8z/vXQ+w9K/8s2/9sW/+RS+w9K/8s2/9sW/+RWeklwS/zkv/ABv/ALxXBL9+X/M/710PsPSv/LNv/bFv/kUvsPSv/LNv/bFv/kVnpSEuCX+cl/43/wB4rgl/nJf8z/vXQ+w9K/8ALNv/AGxb/wCRS+w9K/8ALNv/AGxb/wCRWeklwS/zkv8Axv8A7xXBL9+X/M/710PsPSv/ACzb/wBsW/8AkUvsPSv/ACzb/wBsW/8AkVnpJcEv85L/AMb/AO8VwS/fl/zP+9dD7D0r/wAs2/8AbFv/AJFL7D0r/wAs2/8AbFv/AJFZ6SXBL/OS/wDG/wDvFcEv85L/AJn/AHrZzMC7E9NznNtovG6jIqJNbwNH7dwY9r63fzlVrGW1qstDEPq9Hz6H6toNWTX/ACXbxi2R/wAbXd7/APiqlnoRMiJRscUTw8VeUrr97hkgGREhY4onh4vDf/ov/9DD6R9HqH/hK3/qqlnLR6R9HqH/AISt/wCqqWcqMPnn/g/9F7aPzz/wfyUlIRsXIOLkV5Arrt9Mz6dzQ+tw7ssrd+a5endEzelZ/TxldPpqoI9ttTWMa6t0fQdsa3/rdn+EUfMcxLCL4OKPe618WHmuZlgAPtmcTpxXVHxfMsLDyM7KqxMVnqXXO2sb+LnO/dYxvueuuHROlNrf06sV/ZsD39Z6s9oLtw932LEcd2y130X+l/Ms/R/z/st0Mj0cfPyKOksbV1jqDN2Xl8Nxsca2ZT+PTtv+ns/wln6ez/B7+V671jHfRX0bpQLOlYpnefpZFv5+Tcf6383/AOqq6a4yz5mUODixiuLyv9OX/qGP/VWv7uTmZxEAccQBLy/1kv8A1DH/AKq1Os9Soz8mcTGrxMSr20VMY1riP9Je5n85a/b+97FnpJK9CIhERGw0dCERCIiNgqVLY/Zv2nYNC6DEn+Ut76qfWOvpWR6GY1pw7T/OhoL6nH/CAxvfT/pav+uVfuW951V2Lfh2DLe1+C9m61zjNZr+l6gc3/OqfX7/APRe9VeY5yeGVHFcSdJCXzDwHD8zT5jnJ4cggcVxO0+L5vKPD8zwXQOkYzcd3XerNP7PoO2ioiTkWzDa62f4Vm//AD3/APB13rS6nmDobPtVlNLeuZjf0OOxjfTwqJ3Vtazbtdk/yv8ASf8AB1/rFjL6tVj00dayaAyqlvp/V/pjxAAAA/aGSwfydrq/3Gen6f8A3IXF5WVkZmRZlZLzbfc7dY88kn/qf5LU3HCWeZnO+AGjH9H0/wCSH/qaf6f82txwnzGQzyaQGnD00/yQ/wDU0/05/q0bnOc4ucS5zjJJ1JJ7lMktz6r9bxOm5Xp59FdmJadbjW19lTv9K0lrnvq/0tX9ur3/AM5bySlGBlGPGR+js3MkpQgZRjxkfojRw+eFt/V7otOUy3qnUnel0nC1tcf8I4fRx2fe31Nv/FM99i9Dz24+RiOrsNb8O6uXGR6RrI3ervb7dmz9I238z+cXNX53T68ajPtr29E6edvSMD6Jyr2/9rLWu/wLXbnb7P8AjH/pP0V1E87LLGUIxMJWI8UTxH1fow/1kv8Amfzjn/fp5oGMIGEieGweI/3Yf6yX/M/nGvn2YnS6j1TLwqK87LaR03pnpsDaKf8AuVl1tbtde/6Xv/4r/SfZ+QssfbY62w7nvJc53iSZKP1DqGV1LMszct2+60yY4A/NYwfmsZ+aqyt4MPtjU3I7/wBUD5YRbvL4fbjctZn5u0f6kf6sW/gf8n9U/wCJq/8AP9CoK/gf8n9U/wCJq/8AP9CoJ8Pmyf3v+4gvh80/7w/6MX//0cPpH0eof+Erf+qqWctHpH0eof8AhK3/AKqpZyow+ef+D/0Xto/PP/B/JS7HoWFf0HEblOYbusdWb6XT+nyQAz6Zycxv7jP5z3fzbP8Arv2ej0TpdWBit691SsvbuDenYUe++0/zb9v+i/c/7c/4O+91Lq1nSKrMiy1l/wBYuoti6ytwc3Fr/Nx6i0u27P8Az5+l/wAHV61bmMpyH2oR4gTwntOX7v8As8f+Vl/1NqczkOU+1jHFG6l/XlH9D/Zw/wArL/qb0eD0+jBw3tFjcrJue45+To42XD22ss/kUz6bcf8Awf8AbXHfWr6sP6cR1DEYT0+4+5on9C8/4N3/AAL/APA2f9Zf/wALjYvVepYddleJlW0MtO6wMcRJ/eSu6n1PIYa78u+1h0LH2PcCP6rnJYeVy48xmJgxlpIfvD/0H9FWHlM2LKZjICCfVY+eP/c8P6LVSSR8HCyM/KrxMZodbYdJMNAHuc97vzWMb7nK6SACToA3SQASTQGpLY6L0fJ6xnMxKPYPpXXES2tg+lY7/vjV2eLTg5opoa5tP1Y6a9tVJtd/TMndpvcfp4zb3f8AF2Wf8H/R6NbOmUNd0DGzasfAqh/V89z2sfkP/wC4eLrvcz81/p/zdf8A7N4HX+tnqlzKqG+j07FGzEoAgBo9vqOb++//AMDZ7P5b6BOTmMgABjAeoEj5I/oz/wBrk/Q/zeNz5jJzOShcIAXEkfID/lP9rP8AQ/zWN9B6r0qrq9b8PJa6H6stDZdW8fRtb/39n57F5p1PpmZ0rMfhZjNlrOCNWvafo21O/Orf/r71CzqPULQBblXPAEAOscYA7auQCSeTKl5Tlp4LBmJRJvhrZm5TlsmCwZiUD+jX6XcSWVrpnTcvqmbXhYjd1th5P0WtH0rLHfmsYhY2NkZeRXjYzDbfa7bWxvJJXYUYtHTmu6Bi5NdN9gDutdTL2sbW0/8AaTGfYWfpHfQ/1/V3583tio6zP/Mj+lkl/L1snMZ/bFRozIsf1I/5yX8vW26MbCyKm9Hpu2/V/pZDeoZr37G5FxcHfZKrC79HR6z/ANNsd/xf+Ctt1up9Lxuo0nAvrDayIr2Ng1Fo21upb+b6f0dn+j/RrgvrD1mnL9Pp3Tm+l0rD0oYNN7tZvfPx9m/3/wCE/nLVSPWOrFjWfbcjYwBrW+q8AAaBoG5VPueXIITEvblxcdS+b+9L/WS/SaQ5LLIRmJ8BsyqXzWf8pL/WT/SV1XpeZ0nNfhZjNtjNWuH0XtP0Laz+cx//AJh9NU1Oy6207rXusPi8lx/6SgtGN0OLU9adOPEIjiIMq1I0DfwP+T+qf8TV/wCf6FQV/A/5P6p/xNX/AJ/oVBNh82T+9/3EFsPmn/eH/Ri//9LD6R9HqH/hK3/qqlnLR6R9HqH/AISt/wCqqWcqMPnn/g/9F7aPzz/wfyXJJ5JMaa+ATIlDKn3MZbZ6NbiA60guDQfzyxvudt/krsKf8XdT622v6lvY4BwNVQIc0jc1zLDd7muQy58eKuM8N7aSKzNzGLDXuHhvb0yP/ReLWrX9Xss9OZn3PFQyHBmHjw5117nfzfpVt/Mf++5/8v8A0XqbNf1QxMDOuzeo3h3RcNotkwLLHfm4rq59vv8A+3v8H9Oz0bXUurW9Or/a+axres5bC3pmEdRh4x9vrPZ/p7P/AFD/ADfrVKCfNGZgMBEr/H+p/wCrZf5Ngyc2ZGMcHqvr3l/m/wD1bL/JvM9Y6QzpL68ezJbdmEbr6a2+2qQC1rrt3vs/sLNUnvfY91lji97yXPe4ySTq5znH85yirUBIRAlLil1lXD+DbgJCIEpcUupqlJLY6H9XLetB5pyqanVH31v3mwA8P2NZt2f21qZv1Avx8Z76cwZGQ0S2kVlgd4sbY6x3v/c9ijnzWGEuGU6N1tJinzeCE+CU6l2qTzWFhZGflV4mM3fbaYaOwHLnuP5rGN+mtMfVbL9fJY/Jx204LZy8qXmpj++Pu9PdbkN/0dbP+C/nVv8ATumHpdLek4T2jrmawWdQzOW4eP8AS+n/AKT9xu732/pv5v7OsHr/AFfGtrr6R0kGvpOGYYT9K6z8/Jt/rf4P/P8A+Dqi97LkycOKhDT1Efo9cn+F/ko/9UYRzGTLk4cWkP3iP0f85/hf5GP/AFRxTAcQ0y3UA8SPgmSWv0H6vnrbrGV5dVFlWrqnhxeW6fpGNaNrmfve9WZzjCPFI0B1bc5xxxMpmojcuQjYmLfmZNeLjMNl1p2saPxJ/dY1vue9dTl/4vn0Y73VZwuvDZrr9LY1xH5nqG123d+b7FY6V027pFVfT8Ta76w9SZuut5bh435z3u/0n/ny7/i6vWrz5zGYy9uQlMdD6a/ry/qRa0+exGBOM8Uul3Gv68uL9CLiN+qmUcu/HOTRsw2b8zJBf6VR59Fz3Mbvv2/mMb/01i2BjbHNrdvYCQ15G3cJ9rtn5u5bn1h6tjem3ovSDHTcZ02WzLsm7/CZFz/z27vof+Q9D0sFSYPdI4sh3+WNVp+9L+tL91l5c5ZR4sh3+WNcJr96X9aX7rfwP+T+qf8AE1f+f6FQV/A/5P6p/wATV/5/oVBPh82T+9/3EF8Pmn/eH/Ri/wD/08PpH0eof+Erf+qqWctHpH0eof8AhK3/AKqpZyow+ef+D/0Xto/PP/B/JS7L6h9S6htyMJ4DumUMda+952txz7n/AEj/AIO6Hbqv+v8A+k38x0vpuV1TNZh4rZe/VzvzWNH0rH/yW/8AmC7BtfTbMQ4FL/S+rXTHb8/J4OZe3afTDm/zlW/Z9D+c/RVUf9p3qDnMkOE4zqTr34L9Mf8Aqk/8nFq89OBh7RHETR7+32l/tJfLji3cSp/Vr2dUyAW9MocXdOxnDW149v7RyGf+2lbv/V/E/WHH6jT1a49Rd6t9p9Rt35r2HSt9f7rNrdmz/BfzS6PG+v8AjP8AXZmYzq6g79UbQGnbXG0VWh762+3b9Nipdd+tPSeq9P8AshwrTYwl1GQ57WurcfDa1+6uz/C1f+jFBy8M2LN/Nfq+Hg6egfN83/pRh5aPMYsuuL0H06cPoh83zf8ApR5dJJJaTptjBzsnp+VXl4r/AE7qjIPYj85j2/nMf+cvRc3q+R9kw9uKW9X6i0fZ8B5nafzrr/3capv6X3+//B2f4b0+V+r/AE2jDob17qdZtra4N6fhj6WRcT+j9uv6Nr/9fZsu1svrb+gPOZmsbl9f6htdkVzDKMYGfslbhu2fyP8AhP09nq/o/tGdzXBmyRjGPHKJI/vyj80P7mP/ACn/AIW5nN8OXLEQhxyhcf78v3P9nj/ykv8Aqa3X+m5+D0O2vBebnWuNvWMjX1rv+E/8K1u+nV+ZV/6Erh16A/689CZaLGDJeImBW0ET+ad9rVxnV7emX51l3TK7KMaz3CmwNG1xPubXsc79F+4pOROUCUcmMxs8XHVcX97/ALll5E5QDHJjMb9XHVX/AFZf9y0kXFysjDyK8rGsNV9J3MsbyD/35v7zUJdB9Xul4lVB671Zm7DpdGLjRJyLphlbWfns3t/t/wDF1WqzlyRhAmWt+kR/flL9BtZskYQJkOK/SI/vmX6D1l3Wct3SsK9+JHVeoDbjYAOj3/6c67qsTZ+ns9R36P8Am/U/wqodY6V1PG6JkMxLfXzsg+r1W8T6lzY99dDvzaKf9D+fR/bqQs/q+R0Qu6nnBmR9YM8DbQ6TXjYwP8wGtO73fR/l2/8AF2faDO+vfRQ9loryd0AlrWs9p/d3utbu2/vbVlDHkHDPDj44mfEf0oy4D8v+zj+j/j/uORDFlHDLFj4o8XFp6oyMf0P9lH9D9/5/3HgUlodbyumZee/J6bS/Gqt9z6X7YDz9J1Wz6DH/AOj/AO+LPWxE2ASDG+hdqEjKIJBiSPlO8W/gf8n9U/4mr/z/AEKgr+B/yf1T/iav/P8AQqCbD5sn97/uILYfNP8AvD/oxf/Uw+kfR6h/4St/6qpZy0ekfR6h/wCErf8AqqlnKjD55/4P/Re2j88/8H8nVx+u/ZOkWdOw6PRtyT+t5e+bHt1/RM9jfRZtO38//Cf6RQ6l1zJz8WjCFVWLh4v81j0BwbP79hsfY6yz3O9/8uz/AEiz667LXiuppe92jWNBJPwa1Xqvq/127+b6fkEHgmtzR/nPDWoGGGMuI0JXx3I/pfLxepYYYIS4pUJXx3I/pHTi9TnqbKbrA51dbnhgLnloJAA1LnR9FX8L6v8AU8vqw6T6TqskGbtw0rZoXWvj8za72f6RdSWdMbhPqrea/qz0xw+0Pbq/OyR/gWRt9Wr1Ppv+hZ/g/wBBX6lDMvMiHCIjj4tdP3f0f70p/wCTiszc1GBAj6yaOn7svl/wsn+Ti8TZi5NVTL7KXsqt/m7HNIa7v+je4bX/ANlSw34leSx+ZU6/HaZfSx2wvj6LPUh2xjnfT2+/Yj9Y6vk9XzDk3+1jRtppH0a2D6NbP+/qipY8UoDjHDIjURPy/wCEzR4pQ9Y4ZEaiJ+X/AAnof+d9n7Sd1E4lb3VN9PApc4irHZG07K2BnqWu9v6T9H/579LCyMi/KvfkZDzZdadz3nkkp6cXKvMUU2Wk8bGOd/1IR7+j9Wx6HZGRhX00sgOssrcwCTtb9MD85NhDDjPp4YmhDfX+6shDDjl6eGMiBDfWv3WmiMove9rGVvc9+rGtaSSOPa0fSXRdB6XX0/Fr691Go2vscGdKwh9O606V2bf3d381/wBvf6D1rfXeq5HRxZV63qfWDNaDnZLDpj1n3V4WL/ovb/6W+n6HpRy5k+5wY4cfTiuo8X6f+Bj/AEpf9TY5c1eT28ceM7cV6cUfn/wMf6cv8B5Sg01ZLTmVOsqrd+lpDvTcY/we/a70/d9P2rZs+tj39SZn/Y6y3FYK+n4rnH0qBG3eGV+n6lu1vtf7Nn/W6tmArGLgZ2Zu+yY9uRsjd6THPifo7tgO3dClyY8cvVk6Dhsmh6vm/wAZlyYscvVk6DhsnhjUvm/xmOVlX5mTZlZDzZda7c9x/IP3Wt+ixqCtb/mp9YhU604NjWtBcd20OgCfbWXeo938hrVa+r3SMVuO/r3V2/5OxzFFREnIu/MqrZ/hGb/7D3/8HXemnNijA8JEuGoiENTf6EBFBz4oQJjIS4aiIwPEeL9GEQ4/7Pz5qH2a2cj+YGx36SBuPo+39Jz+Yh30XY9rqb2OqtZG6t4hwkbvc0/RXY9X6pf0lpzcoh31hzmRVVy3Cxz9FjZ/7UP/AD/+E/8AZji3Oc5xc4lznElziZJJ5JKWDJkyDilERj4a8Uv0uH+pH/no5fLPKOIxAj0r9KXXh/qf9NvYH/J/VP8Aiav/AD/QqCv4H/J/VP8Aiav/AD/QqCfD5sn97/uIMkPmn/eH/Ri//9XD6R9HqH/hK3/qqlnLR6R9HqH/AISt/wCqqWcqMPnn/g/9F7aPzz/wfyZMe+t7bK3Fj2EOY9pggjVrmuH0XNXov1Y+tFfVqDiZZDOpVifAXNA1trH+mb/h6v8Ar1X5/pecgFxDWglxMADUkldp0vpl/Ra68PFa2z6ydSbJcdW4WOfpWv8A+F/9G/o/f/2pg52OOUKlXHrwHt+8Zf6v95q/EI45YwJfzn+TP7v78pf6v9908u2zPy7ukYTvT9ob1TNYBurq92zBqf8AnZF26z/iP0n/AAy43r/WHZtjMOio4vTsGa8bFiCI9rrbwf8ADv8A+h/27ZZ3fSbOkNw7cDpdot+xPIyXn6T7HfzmU95/nfVf7PV/4P0/5v01g/W/pOBfSep4+TQzNYP1ig2sDrWj/C1t3f0hn57P8Mz/AIX+dqcpKEM4xyiaA9JP78v05R/rf+NtTlMkIZhGUSOkDIaiZ/TnH+v/AONvGJJJLWdh2/q19ZcjouRseXWYFp/TUg6tP+np/wCEb+d/pv8Att9fe5+dgHAdn2Wts6e5m51n0mvY72+ntP03WfzXpfvrzvoHRH9Xyy17/Rw8cepmZJgBlY9x9zvbvftdt/7c/MXW0WdNsOP1HLLcH6v4dgq6PiuBAttJ2/b72n3O2+97PU/4S+z/AAnr5vO48UpitJ2Pc4f0v3Y/7WTlc9DEcoMQeMfznD+l+5H/AGsv+g1updTzOnUt61mU+n1G9pp6Vilssw6Y+nZ+Z9rsrPu/7b/m/wBDXxNlj7HusscX2PJc97jLnOJlznOP0nOXrGfgUZzLMTNbNFw9xJAIP5ttb3e31GfmPXmXV+mP6XnWYjrWXtbrXdWQQ5hPtd7S7036e+tO+H5YSExVTv6cA+WMf7rJ8Oy45cUa4cn4e3+jGP8AdaSudL6pl9Ly25eK6HDR7D9F7fzq7B+6qav9G6Rk9YzmYlHtH0rbSJbWwfSsd/31XsnBwS9yuCvVe1N7IYCEvcrgr1Xtwvo2N1nB6h0z9pVWelTWD6+861OaNz22R+7+Z/pFjZObb9lH1ivxXHHxR/kfBLfa3dx1PMa3993ur/c/M/weQkHdNdi6D0/qt0k6d352SDyfo+rV6n/W7bP+C/ou5Z1Dp+RVXlfaKXY+Q2QbXsAc1w2vZYyxw/4u2v8A62sWcRjJlGJkJS4T/Vh/muL/ADk4/O4dDGdIExMuv6MP81xf52UPn/cfLMrKyMzIsysmw232u3WPdyT/AK/RahLY+svTOnYObu6Zk1ZGJfLmMrsbY6o/nVP2Od7Nf0NjljraxyjKAMRQrQbV4O5inGcIyiKiRoK4eH+rTfwP+T+qf8TV/wCf6FQV/A/5P6p/xNX/AJ/oVBCHzZP73/cQVD5p/wB4f9GL/9bD6R9HqH/hK3/qqlnLR6R9HqH/AISt/wCqqWcqMPnn/g/9F7aPzz/wfyeg6M7pnScM9YyLK8nqJ0wcIODtjtW/aMnb9Dj2N/8ARtlfomzuu0YeA+np+UczqfUCXdS6htcyO3oY/qNrds2/o6/b7K/67PQ5lJMPLQlPjmTI2DR+Wo/JD+5H52M8tGU+OZMjd1+jQ+SH9yKoSgJJKdnUj4eKcvJrxxZXSHmDbc4MY0fnPe95b9FASSN0a0Qbo0aPd7A5X1eBHRxlNp6LhkPynjcbM24a7R6Qc77PuZ77P+L9L/A2LB651m3q2X6hHp41Q2YtA0axn9Vvt3vj3/8Abf8AN11rNSUGLloQlxWZSo6y/el/OT/vzYcXLRhLisyl/W7y+ef9+ajrzr8UkklOzsq2epY2vc1m8hu55hokxue781q6gZvQsSivouLmGvEtHqdV6gxjzZcR/wBo8cbdzGu+h7/0bK/+vevyqSjy4RkriJAjrQ/e/Rl/gMWXCMlXIgDWh+9+jL/A/Rdf6wdbHUbWY+K30emYvtxaBoIA2+q8fvu/6H/Ger6mRASSTseOOOIhEUB/K1+PHGERGI0H8rUkkknLm/gf8n9U/wCJq/8AP9CoK/gf8n9U/wCJq/8AP9CoJkPmyf3v+4gsh80/7w/6MX//18PpH0eof+Erf+qqWctHpH0eof8AhK3/AKqpZyow+ef+D/0Xto/PP/B/JSSSSkXva/VPpOAPqzndYy+m/tS9tuzHx9pc5waGM/RbG2O91tz/AFPZ/g1b6t9Vul5PX+jYOJitxLL63ZHVMdji4Mqb6Z2u2/R3v9bG9VitY+Vd0joX1Y6biZApvzsip97vb/NPP2nJrd6k/wDciti0s67A6Jf1b6xX1sJsbTj0tpLRZY2G77N+76dl9ux//BYXqKQRFa9K4v8ApF5+efN785xlK8hyDCBKXr1+7YxwfJ6f51yuq9D6Bn4fTXYOLTiszep/Z3W1w0uprOUx/pv/AOH+z/ov+toX1gP1Twh1PpOZ02rBsooB6Ze2t++95rc7e26qv/B37Kv0tz/U/wAMta3pv1f6v0zo3TnWOwceyv7Th41dgFm4NrcK/Vt9Rz31MyXO/wBJ+eg5GNc/o/TOk/WB1WT1WzLrFUuabBTXZ611r7Dt9T9Rpsrsu2fpPUr9T9MiRvoP2f3VkMusOKeSoyl6OKUcsI8fEMvF6o5OCOLgyqp6B0bEv6R0i7o9eVkZFBOblw7bW6tjd1j3bHNf6929n85WgdK+rXQKLn+vhMub1DPtx8Jlp37KaG3Oe5s+7a5+Nkbf+D+zKt136x9fyfraehdJzBj47jXSXMbW6JYLcm71LG7/ANCxz/o2f4L99blPUOiXfWWjpNVBdf0bHcaMk2eysPbVU+po3/pn+k+r3v3pDhvbY1qETPMQxgylL9biOaQhOcjGPqlCc+Lg4P1k8UPR+4+cdR6eMr605PTMCttQfmOx6WNB2tAf6UwPzGbd712XW+g9DZ0TqNXTcCo5WJZRhVXcvNthxRu3/v8A60zd/wAJvVP6rU4zOt9b+s+YQMfDtyDUZBJe5z7LnVe76TKP0f8AL+0rYxOo9Gv6Lj9QYz7Bj5/Um5F7Xv3E2i7f6tjtx2NsyMav/g2f8WmxAIO2t/Y2eaz5OPEI8fDh9uMuE6SzS/WShL9/9XBaron1ao6tV9WWdLqyB9kOTfmWEG0Dd6I9+31PUe//AEdlXp/4JYWd0LpVP1Vp+yY4fl9Uzzj4eS/WwVvus+zO3/y8Wiv/ALdXQZrbOiZPXvrFm21Mfk1Mq6YA4ucSyuGV7S3/AA1/pe1n/Cf4NOOn42ZX9Xs2nKpf0bpFZfbY5+2XMrYzHf8AR2N9Gyv9L6r6/TTjEGxQ/wDQbprQzTjwz45mNxlKXFOUcmeGOWWcP8LJPHjRP6B9W2dcyt2HjjA6XgtsvZtk+pa59m+yT7vSxsT/AMHXlrnb3F8Bu4k7RoBPZq9H6l1Ss/VbrnVq3s3dWyHVYzhy+hvp9OZ7XQ/3U0ZFy83TJ1Yrz+3Z0/hYnWQzlI0Y4vUb9WOP63/xyakkkk10W/gf8n9U/wCJq/8AP9CoK/gf8n9U/wCJq/8AP9CoJkPmyf3v+4gsh80/7w/6MX//0MPogNl+RjN1sysa6qoeL49ZjB/Kt9L0mfy1nKTHvre2ytxY9hDmuaYII1a5rh+c1aD+p4WS43ZmA2zIdrZbTY6kPPex9IbZU2x35/o+kz/g1RPFGRkI8QkBtV8Uf7z2p4oyJA4hIDbfiH95zUlofa+jf+Vz/wD2IP8A6SS+19G/8rn/APsQf/SSPHL/ADcv/G/+/Txy/cl/zP8AvnPgeCUDwWh9r6N/5XP/APYg/wDpJL7X0b/yuf8A+xB/9JIcZ/zcv/G/+/Vxy/zcv+Z/3znwPBKB4LQ+19G/8rn/APsQf/SSX2vo3/lc/wD9iD/6SS4z/m5f+N/9+rjl+5L/AJn/AHznwOEoHC0PtfRv/K5//sQf/SSX2vo3/lc//wBiD/6SS45f5uX/AI3/AN+rjl+5L/mf9858BIgFaH2vo3/lc/8A9iD/AOkkvtfRv/K5/wD7EH/0klxn/Ny/8b/79XHL9yX/ADP++bv1i+stPXascu6fXjZdDWsOQx7iDW0O/Q107Wsqr9R+/wDwiwoHgtD7X0b/AMrn/wDsQf8A0kl9r6N/5XP/APYg/wDpJEzkd8cj/wCF/wDfrMURiiIQxyERsLEv+lNz4HKS0PtfRv8Ayuf/AOxB/wDSSX2vo3/lc/8A9iD/AOkkuOX+bl/43/36/jl+5L/mf9856S0PtfRv/K5//sQf/SSX2vo//lc//wBiHf8ApJLjl/m5f+N/9+rjl+5L/mf98rDHp9I6hc+Q270sevzfvGU6P+Lrx/f/AMZWs9WczOflbGBjaMekEU49c7GT9N3vL3vssj9JbY/1H/5irIREgJSr1SPFw/ZGv73DFAEgJSr1SPFw/hX95//ZADhCSU0EIQAAAAAAXQAAAAEBAAAADwBBAGQAbwBiAGUAIABQAGgAbwB0AG8AcwBoAG8AcAAAABcAQQBkAG8AYgBlACAAUABoAG8AdABvAHMAaABvAHAAIABDAEMAIAAyADAAMQA5AAAAAQA4QklNBAEAAAAAAR4ABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAABAAEAAAAAAAAAAAAAAAAAAAAAAAAAAQCx7FwAgrOsALHsXACCs6wAsexcAIKzrAACALKhgAB8/rkAscJ1AHbhmwC1BCwAdpACAAEAtQiDAHaLJQC1CIMAdoslALUIgwB2iyUAAQC4t1MAdoslALi3UwB2iyUAuLdTAHaLJQABALlJ/ACCctQAuUn8AIJy1AC5SfwAgnLUAAEAubK+AIeu8gC5sr4Ah67yALmyvgCHrvIAAQC1xRMAiN2NALXFEwCI3Y0AtcUTAIjdjQABALN6bwCIcXoAs3pvAIhxegCzem8AiHF6OEJJTQQGAAAAAAAHAAgAAAABAQD/4SnGRXhpZgAATU0AKgAAAAgADQEAAAMAAAABC9gAAAEBAAMAAAABD6QAAAECAAMAAAADAAAItgEGAAMAAAABAAIAAAESAAMAAAABAAEAAAEVAAMAAAABAAMAAAEaAAUAAAABAAAIvAEbAAUAAAABAAAIxAEoAAMAAAABAAIAAAExAAIAAAAiAAAIzAEyAAIAAAAUAAAI7odpAAQAAAABAAAJAuocAAcAAAgMAAAAqgAAEaoc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAgACAEsAAAAAQAAASwAAAABAABBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykAMjAxOToxMDoxNSAxNzozMDozMAAACZAAAAcAAAAEMDIzMZADAAIAAAAUAAARgJAEAAIAAAAUAAARlJKRAAIAAAADMDAAAJKSAAIAAAADMDAAAKABAAMAAAAB//8AAKACAAQAAAABAAAL2KADAAQAAAABAAAMOOocAAcAAAgMAAAJdAAAAAAc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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dGVEYXRlPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj48L3g6eG1wbWV0YT4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0ndyc/Pv/bAEMAAgEBAgEBAgICAgICAgIDBQMDAwMDBgQEAwUHBgcHBwYHBwgJCwkICAoIBwcKDQoKCwwMDAwHCQ4PDQwOCwwMDP/bAEMBAgICAwMDBgMDBgwIBwgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDP/AABEIASwBLAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T1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';
  image.onload = function() {
    ctx.drawImage(image, 0, 0);
    $('.winner-box').css({visibility: 'visible'});
  };
  brush.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAxCAYAAABNuS5SAAAKFklEQVR42u2aCXCcdRnG997NJtlkk83VJE3apEma9CQlNAR60UqrGSqW4PQSO9iiTkE8BxWtlGMqYCtYrLRQtfVGMoJaGRFliijaViwiWgQpyCEdraI1QLXG52V+n/5nzd3ENnX/M8/sJvvt933/533e81ufL7MyK7NOzuXPUDD0FQCZlVn/+xUUQhkXHny8M2TxGsq48MBjXdAhL9/7YN26dd5nI5aVRrvEc0GFEBNKhbDjwsHh3qP/FJK1EdYIedOFlFAOgREhPlICifZDYoBjTna3LYe4xcI4oSpNcf6RvHjuAJRoVszD0qFBGmgMChipZGFxbqzQkJWVZUSOF7JRX3S4LtLTeyMtkkqljMBkPzHRs2aYY5PcZH/qLY1EIo18byQ6hBytIr3WCAXcV4tQHYvFxg3w3N6+Bh3OQolEoqCoqCinlw16JzTFJSE6PYuZKqvztbC2ex7bzGxhKu+rerjJrEEq+r9ieElJSXFDQ0Mh9zYzOzu7FBUWcO4Q9xbD6HYvhXhGLccVD5ZAPyfMqaioyOrBUgEv8FZXV8caGxtz8vLykhCWTnZIKmsKhUJnEYeKcKk2YYERH41G7UYnck1/WvAPOxsdLJm2+bEY0Ay0RNeqkytXQkoBZM4U5oOaoYSUkBGRtvnesrBZK4e4F6ypqSkuLy+v4KI99ZQxkfc6vZ4jNAl1wkbhG8LrhfNBCdkxmhYacvj/GOce+3K9MHHbDHUmicOufREELRIWch/DljzMsglutr+VIJO5KjGrVfZAnpF8mnCd8G5hrnC60Cl8T/iw8C1hKd9P9eDCMcgo5HwBx8BB/g7xeRPkrBbeJ3xTeAxjvRGVV3NcshfPG1JX4tVDQae47GuVOknCi23xHr5nyrxe2C1sFlYJ7xe+Jlwm7BRulItP0ms957RzTMK1ws41jMS8eDxehopaOCYfxc3AIHcIX+K6nxW+ImyVF1i8PQ8DTuwtdC1atCja3NwcHkq5EuXmo85G+jq+yMm28V4q/zcIPxV+K9zPxnbgTi0ocybu6wX66fx/vfAB4T1gHt8xI1wlXMF5zEXnQKC56ruEjwhvEa4WrrXvK/Yt5Pt5I1UveeVKyKmT+lpG2gQ2npMmez8ZzFT3e+HXwj7hKXNf6rFZbDpJUjESLdFsFX4mfFv4Fd/7qPBm4UPCJ4RNwncwym4UfYVUtiAcDk/T+3NRmylwWzAY7BCBCwYYogZPnrJoRNm2IDc3tw4FVKXFm95UmGLzkTTFpog524WnhQPCQeGvwiPCCuFCYmk5GbEJt3tOeF54HPVeLLyXxHOv8BPhYaFLeFU4gsI7OWeZk3g+hpJNvVMGIIqhdRvy+biVISouq2TBqWxoIL1wgBhU5AR1SzJvFR4UnhX+Bl4RfsFGP0npUkTymIQ7fh8Cf4l6F0LgXkj6o3O+buGfwj+ElzGQETaNeJqPhxiahckYq8KJ9V6mP+4pTIATjsGCA8lCQVy9VbhB2CM8itu9IBxlkx6O4nbmmpcSi0KUExa3Psfn23DZC4lhlhRuIWs/R1Y9BrpR4WHcfiOq34bLl5DJm1B7BANPGO4+2OJfDcVwX+RZkL5d+DRqeRJ360IJx1CFp4w/8/lhVGXxay1xKp8asQ31rSbgz2az1aBBWCZsgKTfEFe7uM4xYus9KHWXcBv3eolwJe67hJLIN6yubMVpW1tbbllZWVxtzjRquvQe9981IG3RZHUQttH7hB8IP0cdLwp/YnNHcdsjEP1xsEruO56i2Fy3UWXMskAgYAH/EjOiCD6NDc/XZ4v12RqSy3WQ9rJD3jPClwkZz2Aoy8JnUEjPcwYWfgfHvcIW84h308mABQP4Xp02OY44M4tSZSfx7UXIewU3NpXuxw0vJzauYDP1XM8y8Ttx67fhylYrdlAMW1x7h/BF3NWI+4PwFwjbSha26/xQuBmib6HDqeI+m4m5wzrj9A/xO+O5qbm4yizcbDOKfAjVWeC/WzAFLSeI+4hN9WzQ65EvED7D8Tt4vwE33O64rIfD1JW3k6xeQoX3UN6chyG8In4tcbHuRAyKw2ktVIIM2U5XcA7t2FKy5vWQeBexbbrTpvmZiJwN6e3EwKspW/ajqBuAKfKQk8m7KIce5bgnMNQDkLWPUmkj511DSVV5HJOd417FzrDAK7RjZLMZiURigmLVFCYs5tI2PFhpcUj/n6z6sp72LwJKiU2rUdp62rA7IX4XytpJ3Weh4XfE1/0kk/uoFX8kbCHudZLld5E8vJIs2+mbT8iznaR60DHMBt0EE1DySVlSsOBvyrL6zkZG5qI2T/QSBYTHMYAlq2tw1+0MFO4kVj5GSbSbgvkA8fQQr1uIdfdD5mZ1GhZbP0XfuwlPmOp0SNkYbkQV2JdlEsq69VJS+rTER+NtZVC+TX+NRFq1XGeiHXbGUHMg6lk2/DiZ+mHU8wTueoTXLtS3F5e9l2PNZW9lyrOB5LGSmJokzMQ6OjqCA3wsMXLLhqrWoZgKe3lyZ5YtLiwsLLfMLhJL0ibW3rKa7oMQ+Ajq6gKHcMeHeP8qZcpRMvyt1J97SRabcNP1ZGsbKhSb6lF+5GR6shUnlqTSyPM7LZxV/PUqjOfTH6cvqx+XyN3aCfBPUWh3UZIcxC2/jgu/BJ7Eve/G1R/EXS9gaLCc0dgySqIm7jV4MhEYdAaN4R4eRHkBusJp3GNp56iSOscyYN0DaUch8Ai13X6yrg0PvotCO8nme0geKymBaulc1qO+NbxOOpHZtrcHR+nT6+wePvcnk8k8qv6iNBdyH4/OoGR5gXbv75D4NIX3NoruLSjtKmLlbTwCKER1NmV+QIqfS13aai0izUHsRKksAQE5g0w4fuehj9f+xb25Ym1tbcIhuw2COmkBn2cAcQAFbsclV1BTns49JZio3EQWPkgCySJpFIu8aor0UfeLigDTlUTa/8eimhRGuUiKOZPYtYNabh9EGik3Mkk+A9I8JTWoAiik/LEpzY8tY4uwWc4AJMjxQd8oXRHU8JqbW32orNyAiubZo0WR5wX9KyHrLpLD52nrxhFHa1CVV5w3081cRu/7BYichpEqfafA7/sCzhT7tVkhLZvhTeB8Gv1r6U+ty/gqtWHQCSNTcPOl9NmXM1S4hgRjBjjL1MdUJ8cx3uhe3d3dfh5Meb8qyKWsuJRidwtN/h20XEtxvTwya7tKncU8ACqmXVwLict5fy6TnFhra2uW7xT8dWk2BHptVBOx8GLKjo3g7bhrBQq1sdVsCvEkhLZIac1y/zmUSO0oO8fX/0P2Ub3cwaWpZSITnLnOpDlBWTIfMleJqFb10jXCBJUlMyORSIP14LhqNef6v/05bpZTdHulUyXKsufDNdRxZ4vIhSKwhQFG5vfLfcwZsx2X92Jhje8/P8OI+TK/oO+zeA84WTzkvI/6RuB3y6f68qf11xnyMiuzMms4178AwArmZmkkdGcAAAAASUVORK5CYII=';
  
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
            scratch_id: localStorage.scratch_generated_id,
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