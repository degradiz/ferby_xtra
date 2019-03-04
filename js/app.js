angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ion-datetime-picker','xlsx-model'])
        .run(function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }
            });
        })

        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                    .state('app', {
                        url: '/app',
                        abstract: true,
                        cache: false,
                        templateUrl: 'templates/app.html',
                        controller: 'AppCtrl'
                    })

                    .state('tab', {
                        url: '/tab',
                        abstract: true,
                        cache: false,
                        templateUrl: 'templates/tabs.html',
                        controller: 'tabsCtrl'
                    })

                    .state('tab.orders', {
                        url: '/orders',
                        cache: false,
                        views: {
                            'tab-orders': {
                                templateUrl: 'templates/orders.html',
                                controller: 'ordersCtrl'
                            }
                        }
                    })
                    .state('tab.bills', {
                        url: '/bills',
                        cache: false,
                        views: {
                            'tab-bills': {
                                templateUrl: 'templates/bills.html',
                                controller: 'billsCtrl'
                            }
                        }
                    })
                    .state('tab.user-points', {
                        url: '/user-points',
                        cache: false,
                        views: {
                            'tab-user-points': {
                                templateUrl: 'templates/user-points.html',
                                controller: 'userPointsCtrl'
                            }
                        }
                    })
                    .state('tab.request-userpoints', {
                        url: '/request-userpoints',
                        cache: false,
                        views: {
                            'tab-request-userpoints': {
                                templateUrl: 'templates/request-userpoints.html',
                                controller: 'requestUserpointsCtrl'
                            }
                        }
                    })
                    .state('tab.request-checkpoints', {
                        url: '/request-checkpoints',
                        cache: false,
                        views: {
                            'tab-request-checkpoints': {
                                templateUrl: 'templates/request-checkpoints.html',
                                controller: 'requestCheckpointsCtrl'
                            }
                        }
                    })
                    .state('tab.log-userpoints', {
                        url: '/log-userpoints',
                        cache: false,
                        views: {
                            'tab-request-userpoints': {
                                templateUrl: 'templates/log-userpoints.html',
                                controller: 'logUserpointsCtrl'
                            }
                        }
                    })
                    .state('tab.sent', {
                        url: '/sent',
                        cache: false,
                        views: {
                            'tab-sent': {
                                templateUrl: 'templates/sent.html',
                                controller: 'sentCtrl'
                            }
                        }
                    })
                    .state('login', {
                        url: '/login',
                        cache: false,
                        templateUrl: 'templates/login.html',
                        controller: 'loginCtrl'
                    })
                    .state('restLogin', {
                        url: '/restLogin',
                        cache: false,
                        templateUrl: 'templates/restLogin.html',
                        controller: 'restLoginCtrl'
                    })
                    .state('register', {
                        url: '/register',
                        cache: false,
                        templateUrl: 'templates/register.html',
                        controller: 'registerCtrl'
                    })
                    .state('app.dash', {
                        url: '/dash',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/dash.html',
                                controller: 'dashCtrl'
                            }
                        }
                    })
                    .state('app.cat', {
                        url: '/cat',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/cat.html',
                                controller: 'catCtrl'
                            }
                        }
                    })
                    .state('app.promos', {
                        url: '/promos',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/promos.html',
                                controller: 'promosCtrl'
                            }
                        }
                    })
                    .state('app.events', {
                        url: '/events',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/events.html',
                                controller: 'eventsCtrl'
                            }
                        }
                    })
                    .state('app.cupon_code', {
                        url: '/cupon_code',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/cupon_code.html',
                                controller: 'cuponCodeCtrl'
                            }
                        }
                    })
                    .state('app.import-products', {
                        url: '/import-products',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/import-products.html',
                                controller: 'importProductsCtrl'
                            }
                        }
                    })
                    .state('app.push', {
                        url: '/push',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/push.html',
                                controller: 'pushCtrl'
                            }
                        }
                    })
                    .state('app.mail', {
                        url: '/mail',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/mail.html',
                                controller: 'mailCtrl'
                            }
                        }
                    })
                    .state('app.menu', {
                        url: '/menu',
                        cache: true,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/menu.html',
                                controller: 'menuCtrl'
                            }
                        }
                    })
                    .state('app.subs', {
                        url: '/subs',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/subs.html',
                                controller: 'subsCtrl'
                            }
                        }
                    })
                    .state('app.waiter', {
                        url: '/waiter',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/waiter.html',
                                controller: 'waiterCtrl'
                            }
                        }
                    })
                    .state('place', {
                        url: '/place',
                        cache: false,
                        templateUrl: 'templates/place.html',
                        controller: 'placeCtrl'
                    })
                    .state('app.stores', {
                        url: '/stores',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/stores.html',
                                controller: 'storesCtrl'
                            }
                        }
                    })
                    .state('app.images', {
                        url: '/images',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/images.html',
                                controller: 'imagesCtrl'
                            }
                        }
                    })
                    .state('app.newPlace', {
                        url: '/newPlace',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/newPlace.html',
                                controller: 'newPlaceCtrl'
                            }
                        }
                    })
                    .state('app.desk', {
                        url: '/desk',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/desk.html',
                                controller: 'deskCtrl'
                            }
                        }
                    })
                    .state('tab.desk', {
                        url: '/desk',
                        cache: false,
                        views: {
                            'tab-desk': {
                                templateUrl: 'templates/desk.html',
                                controller: 'deskCtrl'
                            }
                        }
                    })

                    .state('tab.qr', {
                        url: '/qr',
                        cache: false,
                        views: {
                            'tab-desk': {
                                templateUrl: 'templates/qr.html',
                                controller: 'qrCtrl'
                            }
                        }
                    })

                    .state('app.options', {
                        url: '/option',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/options.html',
                                controller: 'optionsCtrl'
                            }
                        }
                    })
                    .state('import-products', {
                        url: '/import-products',
                        cache: false,
                        views: {
                                templateUrl: 'templates/import-products.html',
                                controller: 'importProductsCtrl'
                        }
                    })
                    .state('app.qr', {
                        url: '/qr',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/qr.html',
                                controller: 'qrCtrl'
                            }
                        }
                    })
                    .state('app.reports', {
                        url: '/reports',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/reports.html',
                                controller: 'reportsCtrl'
                            }
                        }
                    })
                    .state('app.whatsapp-clicks-report', {
                        url: '/whatsapp-clicks-report',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/whatsapp-clicks-report.html',
                                controller: 'whatsappClicksReportCtrl'
                            }
                        }
                    })
                    .state('tab.domicilios', {
                        url: '/domicilios',
                        cache: false,
                        views: {
                            'tab-domicilios': {
                                templateUrl: 'templates/domicilios.html',
                                controller: 'domiciliosCtrl'
                            }
                        }
                    })
                    .state('tab.domiciliosDetalle', {
                        url: '/domiciliosDetalle',
                        cache: false,
                        views: {
                            'tab-domicilios': {
                                templateUrl: 'templates/domiciliosDetalle.html',
                                controller: 'domiciliosDetalleCtrl'
                            }
                        }
                    }).
                    state('tab.Alldomicilios', {
                        url: '/Alldomicilios',
                        cache: false,
                        views: {
                            'tab-domicilios': {
                                templateUrl: 'templates/AllDomicilios.html',
                                controller: 'AlldomiciliosCtrl'
                            }
                        }
                    })
                    .state('app.personalize', {
                        url: '/personalize',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/personalize.html',
                                controller: 'personalizeCtrl'
                            }
                        }
                    })
                    .state('tab.settings', {
                        url: '/settings',
                        cache: false,
                        views: {
                            'tab-settings': {
                                templateUrl: 'templates/settings.html',
                                controller: 'settingsCtrl'
                            }
                        }
                    })
                    .state('app.qrPrint', {
                        url: '/qrPrint',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/qrPrint.html',
                                controller: 'qrPrintCtrl'
                            }
                        }
                    })
                    .state('app.qrCatalog', {
                        url: '/qrCatalog',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/qrCatalog.html',
                                controller: 'qrCatalogCtrl'
                            }
                        }
                    });
            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/login');
        });
