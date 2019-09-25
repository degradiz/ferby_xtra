angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ion-floating-menu'])
.run(function ($ionicPlatform, $rootScope, $state, $ionicHistory) {
    $ionicPlatform.ready(function () {

        if(localStorage.device_token == undefined || localStorage.device_token == 'undefined')
            localStorage.device_token = generateToken();

        localStorage.setItem('devMode', 'prod')
        if (localStorage.getItem('unreadTotal') == null) {
            localStorage.setItem('unreadTotal', 0);
        }

        localStorage.setItem('id', '100015899701211');
        if(typeof cordova !== "undefined")
            if (cordova.platformId === "ios" && window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

      

    });
})
.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    $stateProvider
    .state('tab', {
        url: '/tab',
        abstract: true,
        cache: false,
        templateUrl: 'templates/tabs.html',
        controller: 'ctrlTab'
    })
    .state('welcome', {
        url: '/welcome',
        cache: false,
        templateUrl: 'templates/welcome.html',
        controller: 'welcomeCtrl'
    })
    .state('tab.searchMenu', {
        url: '/searchMenu',
        cache: true,
        views: {
            'tab-menu': {
                templateUrl: 'templates/searchMenu.html',
                controller: 'searchMenuCtrl'
            }
        }
    })
    .state('tab.promoPair', {
        url: '/promos-pair',
        cache: true,
        views: {
            'tab-menu': {
                templateUrl: 'templates/promoPair.html',
                controller: 'promoPairCtrl'
            }
        }
    })
    .state('tab.categories', {
        url: '/categories',
        cache: true,
        views: {
            'tab-menu': {
                templateUrl: 'templates/categories.html',
                controller: 'categoriesCtrl'
            }
        }
    })
    .state('tab.cuenta', {
        url: '/cuenta',
        cache: false,
        views: {
            'tab-cuenta': {
                templateUrl: 'templates/cuenta.html',
                controller: 'cuentaCtrl',
            }
        }
    })
    .state('tab.confirm', {
       url: '/confirm',
       cache: false,
       views: {
           'tab-cuenta': {
               templateUrl: 'templates/confirm.html',
               controller: 'confirmCtrl',
           }
       }
    })
    .state('tab.confirm-form', {
        url: '/confirm-form',
        cache: false,
        views: {
            'tab-cuenta': {
                templateUrl: 'templates/confirm.html',
                controller: 'confirmCtrl',
            }
        }
     })
    .state('side.loginBill', {
        url: '/loginBill',
          cache: false,
     views: {
            'menuContent': {
                templateUrl: 'templates/loginBill.html',
                controller: 'loginBillCtrl'}
            }
    
    })
    .state('side.stamps', {
        url: '/stamps',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/stamps.html',
                controller: 'stampsCtrl'
            }
        }
    })
    .state('side.track_orders', {
        url: '/track_orders',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/track_orders.html',
                controller: 'trackOrdersCtrl'
            }
        }
    })
    .state('taxi', {
        url: '/taxi',
        templateUrl: 'templates/taxi.html',
        controller: 'taxiCtrl'
    })
    .state('asistencia-gps', {
        url: '/asistencia-gps',
        templateUrl: 'templates/asistencia-gps.html',
        controller: 'taxiCtrl'
    })
    .state('politicas', {
        url: '/politicas',
        templateUrl: 'templates/politicas.html',
          controller: 'politicasCtrl'
    })
    .state('mantenimiento-gps', {
        url: '/mantenimiento-gps',
        templateUrl: 'templates/mantenimiento-gps.html',
        controller: 'taxiCtrl'
    })
    .state('fast-category', {
        url: '/fast-category',
        templateUrl: 'templates/fast-category.html',
        controller: 'taxiCtrl'
    })
    .state('tab.menuDet', {
        url: '/menuDet',
        cache: false,
        views: {
            'tab-menu': {
                templateUrl: 'templates/menuDet.html',
                controller: 'menuDetCtrl'
            }
        }
    })
    .state('tab.cupon', {
        url: '/cupon',
        cache: true,
        views: {
            'tab-cupon': {
                templateUrl: 'templates/cupon.html',
                controller: 'cuponCtrl'
            }
        }
    })
    .state('enterClient', {
        url: '/enterClient',
        cache: true,
        templateUrl: 'templates/enterClient.html',
        controller: 'enterClientCtrl'
    })
    .state('tab.menu', {
        url: '/menu',
        cache: false,
        views: {
            'tab-menu': {
                templateUrl: 'templates/menu.html',
                controller: 'menuCtrl'
            }
        }
    })
    .state('tab.promos', {
        url: '/promos',
        views: {
            'tab-promos': {
                templateUrl: 'templates/promos.html',
                controller: 'promosCtrl'
            }
        }
    })
    .state('tab.scratch', {
        url: '/scratch',
        views: {
            'tab-scratch': {
                templateUrl: 'templates/scratch.html',
                controller: 'scratchCtrl'
            }
        }
    })

    .state('sent', {
        url: '/sent',
        cache: false,
        templateUrl: 'templates/sent.html',
        controller: 'sentCtrl'
    })
    .state('contactUs', {
        url: '/contactUs',
        cache: true,
        templateUrl: 'templates/contactUs.html',
        controller: 'contactUsCtrl'
    })
    .state('side.placeMap', {
        url: '/submenu',
        cache: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/placeMap.html',
                controller: 'placeMapCtrl'
            }
        }
    })
    .state('side.homeOrderPlaces', {
        url: '/submenu',
        cache: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/homeOrderPlaces.html',
                controller: 'homeOrderPlacesCtrl'
            }
        }
    })
    .state('side.domicilios', {
        url: '/domicilios',
        views: {
            'menuContent': {
                templateUrl: 'templates/domicilios.html',
                controller: 'domiciliosCtrl'
            }
        }
    })
    .state('side.add_user_id', {
        url: '/add_user_id',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/add_user_id.html',
                controller: 'add_user_idCtrl'
            }
        }
    })
    .state('side.query-checkin', {
        url: '/query-checkin',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/query-checkin.html',
                controller: 'queryCheckinCtrl'
            }
        }
    })
    .state('side.view_user_points', {
        url: '/view_user_points',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/view_user_points.html',
                controller: 'view_user_pointsCtrl'
            }
        }
    })
    .state('side.view_user_checkins', {
        url: '/view_user_checkins',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/view_user_checkins.html',
                controller: 'viewUserCheckinsCtrl'
            }
        }
    })
    .state('side.domiciliosDetalle', {
        url: '/domiciliosDetalle',
        views: {
            'menuContent': {
                templateUrl: 'templates/domiciliosDetalle.html',
                controller: 'domiciliosDetalleCtrl'
            }
        }
    })
    .state('side.promosOnline', {
        url: '/promosOnline',
        views: {
            'menuContent': {
                templateUrl: 'templates/promoOnline.html',
                controller: 'promosOnlineCtrl'
            }
        }
    })
    .state('side.list-events', {
        url: '/list-events',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/list-events.html',
                controller: 'listEventsCtrl'
            }
        }
    })
    .state('side.list-coupons', {
        url: '/list-coupons',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/list-coupons.html',
                controller: 'listCouponsCtrl'
            }
        }
    })
    .state('side.list-scratch', {
        url: '/list-scratch',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/list-scratch.html',
                controller: 'listScratchCtrl'
            }
        }
    })

    .state('side.list-scratch-assign', {
        url: '/list-scratch-assign',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/list-scratch-assign',
                controller: 'listScratchCtrl'
            }
        }
    })

    .state('side.list-lottery', {
        url: '/list-lottery',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/list-lottery.html',
                controller: 'listLotteryCtrl'
            }
        }
    })

    .state('side.list-number-lottery', {
        url: '/list-number-lottery',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/list-number-lottery.html',
                controller: 'listLotteryCtrl'
            }
        }
    })

        .state('side.notif', {
        url: '/notif',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/notif.html',
                controller: 'notifCtrl'
            }
        }
    })

    .state('side.list-promos', {
        url: '/list-promos',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/list-promos.html',
                controller: 'listPromosCtrl'
            }
        }
    })
    .state('side', {
        url: '/side',
        abstract: true,
        cache:false,
        templateUrl: 'templates/side.html',
        controller: 'sideCtrl'
    })
    // Each tab has its own nav history stack:
    // if none of the above states are matched, use this as the fallback
   
    if(localStorage.user_id == null || localStorage.user_id == ""){

            $urlRouterProvider.otherwise('enterClient');
        
    }else{
        if(localStorage.user_id == "0"){
            $urlRouterProvider.otherwise('enterClient');
        }else{
              $urlRouterProvider.otherwise('/side/loginBill');
        }
    }
});

