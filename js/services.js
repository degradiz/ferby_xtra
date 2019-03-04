angular.module('starter.services', [])

.factory('APPCache', function ($cacheFactory) {
     return $cacheFactory('APPCache', {
        capacity: 50
    });
});