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
                
                                    alert('Ocurrio un problema con el servidor');
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
            uuid: 123
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
                           JsBarcode("#barcd" + i , $scope.coupons[i].cupon_code, {displayValue: false});

                    }
                },2000)
                $scope.$apply();
            });    
        }
    })

    .controller('listPromosCtrl', function($scope, $state, $rootScope, $ionicModal){
        checkKey($state);
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
            var ref = window.open('https://xtra.myferby.com:8888/preguntas-frecuentes-nichas-coins/', '_blank', 'location=no');
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
            var ref = window.open('https://xtra.myferby.com:8888/preguntas-frecuentes-nichas-coins/', '_blank', 'location=no');
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
            var ref = window.open('https://xtra.myferby.com:8888/preguntas-frecuentes-nichas-coins/', '_blank', 'location=no');
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
            var ref = window.open('https://xtra.myferby.com:8888/preguntas-frecuentes-nichas-coins/', '_blank', 'location=no');
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
    .controller('sideCtrl', function ($scope, $state, $ionicHistory, $rootScope, $ionicSideMenuDelegate) {
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


        $scope.logOut = function () {
            localStorage.setItem('id', '0');
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('enterClient');
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
    .controller('loginBillCtrl', function ($scope, $ionicPopup, $state, $ionicHistory, $ionicModal, $ionicBackdrop, $ionicLoading, $rootScope, $ionicPlatform) {
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
        

        $rootScope.basePath = $scope.baseImgUrl;

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
            $state.go('side.list-coupons');
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
            window.open(encodeURI(h), '_system');
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
                $.get(getServerPath() + '?action=update_place_token&uuid=' + device.uuid + '&token=' + localStorage.gcmToken+"&place_id="+Theme_id+"&platform="+device.platform,
                
                function (resp) {
                    console.log('token updated: '+resp);
                });
            }
        });

        $scope.loadThemeLoginBill = function () {
          //  Theme_id = getParameterByName("store_id");
            auth_place_id = '[{"place_id": "'+ Theme_id +'"}]'; 
            $scope.getSpecialCategories();            
            $scope.getTypes();           
            if (loaded == 0) {
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
                        $(".bar").css("background-color", localStorage.getItem('th_home_square_color'))  
                        $(".bar").css("border-color", localStorage.getItem('th_home_square_color')) 
                        $scope.getSettings();
                        $scope.getCheckinOptions();
                        $scope.uiStart();
                        loaded = 1;
                        //$scope.$apply();
                        $rootScope.$emit("getSide", {});
                        $ionicLoading.hide()    

                    },
                    error: function (d) {
                        $('#ctLoader').hide();
                        if (d.statusText == 'abort') {
                            return;
                        }
                        customizeAlert('Ocurrio un error no pudimos cargar tus pedidos. Asegurate que estas correctamento conectado a Internet')
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
                $('ion-content').css("background-image", "url(" + getImgPath() + localStorage.background_app + ")")
                $('#thmBackground').css("background-image", "url(" + getImgPath() + localStorage.getItem('th_business_background2') + ")")
                $('#logoImg2').attr("src", getImgPath() + localStorage.getItem('th_business_logo'))
                var colour = localStorage.getItem('th_home_square_color'), new_col = colour.replace(/rgb/i, "rgba");
                // $( "<style>.new-color {background-color : "+"#D30712"+"}</style>" ).appendTo( "ion-view" )
                new_col = new_col.replace(/\)/i, ',0.6)');
                //$('#innerCard').css("background-color", new_col)
                $('buttonUI').css('background', localStorage.getItem('th_button_color_theme'))
                $(".bar").css("background-color", localStorage.getItem('th_home_square_color'))  
                $(".bar").css("border-color", localStorage.getItem('th_home_square_color')) 
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
        $scope.actualPlate.img = $scope.actualPlate.img.replace("https://xtra.myferby.com/img/","").length == 0? "" : $scope.actualPlate.img;
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
                window.open("https://api.whatsapp.com/send?phone="+ localStorage.th_phone+ "&text=" + encodeURIComponent("https://xtra.myferby.com/AppEmulator/products.php?id="+id)+" Hola, cuándo volveran a tener el producto: "+$scope.actualPlate.name, '_system');
                return;
            }
            window.open("https://api.whatsapp.com/send?phone="+ localStorage.th_phone+ "&text=" + encodeURIComponent("https://xtra.myferby.com/AppEmulator/products.php?id="+id)+" Hola, cuándo volveran a tener el producto: "+$scope.actualPlate.name, "_system", "location=no");
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
                window.open("https://api.whatsapp.com/send?phone="+ localStorage.th_phone+ "&text=" + encodeURIComponent("https://xtra.myferby.com/AppEmulator/products.php?id="+id)+" Hola, cuándo volveran a tener el producto: "+$scope.actualPlate.name, '_system');
                return;
            }
            window.open("https://api.whatsapp.com/send?phone="+ localStorage.th_phone+ "&text=" + encodeURIComponent("https://xtra.myferby.com/AppEmulator/products.php?id="+id)+" Hola, cuándo volveran a tener el producto: "+$scope.actualPlate.name, "_system", "location=no");
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
                            customizeAlert('Ocurrio un error, no pudimos agregar tu orden')

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
    .controller('enterClientCtrl', function ($scope, $ionicPopup, $state, $ionicHistory, $ionicPlatform, $rootScope, $ionicLoading) {
        buildScopeStyleSettings($scope);
        Waves.attach('button')
        Waves.attach('.waves-block')
        Waves.init();

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

                    localStorage.setItem('th_business_name', d[0].business_name)
                    localStorage.setItem('th_business_logo', d[0].business_logo)
                    localStorage.setItem('th_business_background1', d[0].business_background1)
                    localStorage.setItem('th_business_background2', d[0].business_background2)
                    localStorage.setItem('th_button_color_theme', d[0].button_color_theme)
                    localStorage.setItem('th_home_square_color', d[0].home_square_color)
                    $('#myRefHeight').css("background-image", "url(" + getImgPath() + localStorage.getItem('th_business_background1') + ")")
                    $('#logoImg').attr("src", getImgPath() + localStorage.getItem('th_business_logo'))
                    $ionicLoading.hide()
                    loaded = 1;
                },
                error: function (d) {
                    $('#ctLoader').hide();
                    if (d.statusText == 'abort') {
                        return;
                    }
                    customizeAlert('Ocurrio un error no pudimos cargar tus pedidos. Asegurate que estas correctamento conectado a Internet')
                },
                //  timeout: 7000
            });
        }

        $scope.invited = function () {
            localStorage.setItem('id', '100015899701211');
            localStorage.setItem('name', 'Invitado');
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('loginBill');
            $rootScope.$emit("getSide", {});
        }

        $scope.showTerms = function () {
            myPopup = $ionicPopup.show({
                templateUrl: 'dialogs/terms.html',
                title: 'Termino de Uso',
                scope: $scope,
                buttons: [
                    { text: 'Entendido' },
                ]
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


        $scope.fb = function () {
            var fbLoginSuccess = function (userData) {
                if (userData.authResponse) {
                    facebookConnectPlugin.api("/" + userData.authResponse.userID + '/?fields=id,name,birthday,gender,picture,email', null,
                        function (response) {
                            initfb(response)
                        });
                }
            }
            facebookConnectPlugin.login(["public_profile", "email", "user_birthday"],
                fbLoginSuccess,
                function (error) { customizeAlert("Intenta hacer login con FB de nuevo o entra como invitado.") }
            );
        }

        function initfb(response) {
            var str

            var name = response.name
            var id = response.id
            //var birthday = response.birthday
            var birthday = '1993-12-12'
            var gender = response.gender
            var email = response.email
            var pic = 'picture'
            localStorage.setItem('name', name);
            localStorage.setItem('id', id);
            insertClient(id, name, gender, birthday, pic, '1', email)
        }

        function extractEmails(text) {
            return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
        }

        function insertClient(user, name, gender, bday, profilePicture, receiveNotification, mail) {
            $.get(getServerPath(),
                {
                    action: 'insert_Client',
                    username: user,
                    password: '1',
                    sex: gender,
                    bday: bday,
                    name: name,
                    email: mail,
                    profile_picture: profilePicture,
                    recieve_notification: receiveNotification,
                    gcm: localStorage.getItem('gcmToken')
                },
                function (resp) {
                    $ionicHistory.nextViewOptions({
                        disableAnimate: true,
                        disableBack: true
                    });
                    $state.go('loginBill');
                    $rootScope.$emit("getSide", {});
                }).fail(function () {
                    customizeAlert('No pudimos conectarnos a Ferby, revisa tu conexión de internet.');
                })
        }
        function insertMail(emails, user) {
            $.get(getServerPath() + '?action=insert_emails&emailStr=' + emails + '&userId=' + user,
                {
                },
                function (resp) {
                }).fail(function () {
                    //customizeAlert('No pudimos conectarnos a Ferby, revisa tu conexión de internet.');
                })
        }
        var h = $(window).height() * 0.9;
        $('#header').css('height', h);
        $scope.gotoTestView = function () {
            $state.go('tab.galleryProduct3');
        }
        $scope.register = function () {
            myPopup = $ionicPopup.show({
                templateUrl: 'dialogs/newClient.html',
                title: 'Welcome, thanks for registering. Complete the form',
                subTitle: 'Complete the form',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            var name = $('#clientFirstName').val() + ' ' + $('#clientLastName').val();
                            var user = $('#clientUserName').val();
                            var password = $('#clientPassword').val();
                            var confirmPassword = $('#confirmClientPassword').val();
                            var sex = $('#clientSex').val();
                            var month = $('#clientMonth').val();
                            var year = $('#clientYear').val();

                            if (validateEmail(user) == false) {
                                customizeAlert('Correo incorrecto');
                                e.preventDefault();
                                return;
                            }

                            if ($.trim(password).length == 0 || $.trim(confirmPassword).length == 0) {
                                customizeAlert('Tienes que agregar tu password')
                                e.preventDefault();
                                return;
                            }
                            var fecha = year + "-" + month + "-01"
                            $.get(getServerPath(),
                                {
                                    action: 'insert_Client_Manual',
                                    username: user,
                                    name: name,
                                    password: password,
                                    sex: sex,
                                    bday: fecha,
                                    recieve_notification: '1'
                                }, function (resp) {
                                    switch (resp) {
                                        case '1':
                                            customizeAlert('Usuario ingresado correctamente.')
                                            break;
                                        case '2':
                                            customizeAlert('El usuario ya existe.')
                                            break;

                                        default:
                                            customizeAlert('Ha ocurrido un error, se ha enviado un correo para resolverlo.')
                                            break;
                                    }
                                    customizeAlert(resp + ' insert_Client_Manual')
                                }).fail(function () {
                                    customizeAlert('No pudimos conectarnos a Ferby, revisa tu conexión de internet.');
                                })

                        }
                    }
                ]
            });

            setTimeout(function () {
                fillYear()
            }, 500);

            function fillMonth() {
                var x = 1;
                var html = '';
                for (var i = 0; i < 12; i++) {
                    html += "<option value=" + x + ">" + x + "</option>";
                    if (x == 12) {
                        $('#clientMonth').append(html);

                    }
                    x++
                }
            }

            function fillYear() {
                var x = 1940;
                var html = '';
                for (var i = 0; i < 65; i++) {
                    html += "<option value=" + x + ">" + x + "</option>";
                    if (i == 65 - 1) {
                        $('#clientYear').append(html);
                        fillMonth()
                    }
                    x++
                }
            }

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
                        customizeAlert('Ocurrio un error, no pudimos agregar tu orden')

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
            $(".bar").css("background-color", localStorage.getItem('th_home_square_color'))  
            $(".bar").css("border-color", localStorage.getItem('th_home_square_color'))             
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
                        customizeAlert('Ocurrio un error no pudimos cargar tus pedidos. Asegurate que estas correctamento conectado a Internet')
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


    var mapstyle = [
        {
            "featureType": "administrative",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#1d1d1d"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#626060"
                },
                {
                    "weight": "1"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#181818"
                }
            ]
        },
        {
            "featureType": "administrative.country",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "administrative.neighborhood",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#181818"
                },
                {
                    "weight": "1"
                },
                {
                    "gamma": "1"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "lightness": 45
                },
                {
                    "color": "#000000"
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "weight": "0.97"
                },
                {
                    "color": "#7f8c8d"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.text",
            "stylers": [
                {
                    "weight": "2"
                },
                {
                    "visibility": "on"
                },
                {
                    "color": "#696464"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#181818"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#232222"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#00202c"
                },
                {
                    "visibility": "on"
                }
            ]
        }
    ]