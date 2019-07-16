function getServerPath() {
    //var serverPath = 'http://localhost/Github/ferby_xtra/ws/wsMain.php';
    var serverPath = 'https://app.almacenesxtra.com/ws/wsMain.php';
   // var serverPath = 'https://app.almacenesxtra.com/ws/wsMain.php'; 
    return serverPath;
}

function rgbToHex(color) {
    color = ""+ color;
    if (!color || color.indexOf("rgb") < 0) {
        return;
    }

    if (color.charAt(0) == "#") {
        return color;
    }

    var nums = /(.*?)rgb\((\d+),\s*(\d+),\s*(\d+)\)/i.exec(color),
        r = parseInt(nums[2], 10).toString(16),
        g = parseInt(nums[3], 10).toString(16),
        b = parseInt(nums[4], 10).toString(16);

    return "#"+ (
        (r.length == 1 ? "0"+ r : r) +
        (g.length == 1 ? "0"+ g : g) +
        (b.length == 1 ? "0"+ b : b)
    );
}

function generateToken() {
    let token = Math.floor(Math.random() * 100)*Math.random() * 25;
    return token;
}

function baseUrl(){
    //return 'http://localhost/ferby_xtra/';
    return 'https://app.almacenesxtra.com/';
}

function imgPath(img){
    return baseUrl()+'img/'+img;
}

function validateIdentidad(id) {
    console.log(id);
    if (isNaN(id) == true)
        return 'Debe contener solo numeros';

    if (id.length != 13)
        return 'Debe contener 13 numeros';

    return true;
}

function redirectPostOnNewTab(url, data) {
    var form = document.createElement('form');
    document.body.appendChild(form);
    form.method = 'post';
    form.action = url;
    form.target= "_blank";
    for (var name in data) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = data[name];
        form.appendChild(input);
    }
    form.submit();
}

function postData(url, data) {
    var form = document.createElement('form');
    document.body.appendChild(form);
    form.method = 'post';
    form.action = url;
    for (var name in data) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = data[name];
        form.appendChild(input);
    }
    form.submit();
}

function illegalChar(txt) {
    var res = String(txt).replace(/#/g, "num");
    res = res.replace(/'/g, '`');
    res = res.replace(/"/g, '`');
    return res;
}

function validateGiftUser(id) {
    if(localStorage.addon_puntos == 0){
        return true;
    }

    var sets = JSON.parse(localStorage.placeSettings);

    if(sets.redeem_free_format == 1){
        return true;
    }
        
    if (isNaN(id) == true)
        return 'La identidad debe contener solo numeros';

    if(id.length != sets.redeem_length_format)
        return 'El formato ingresado debe contener '+sets.redeem_length_format+' caracteres';    
    
    return true;
}

function validateCheckinUser(id) {
    if(localStorage.addon_check_in == 0){
        return true;
    }

    var options = JSON.parse(localStorage.checkinOptions);

    if(options.checkin_free_format == 1){
        return true;
    }
        
    if (isNaN(id) == true)
        return 'La identidad debe contener solo numeros';

    if(id.length != options.checkin_length_format)
        return 'El formato ingresado debe contener '+options.checkin_length_format+' caracteres';    
    
    return true;
}

function filtroRecibidas(obj) {
    return obj.status === '7';
}

function filtroDespachadas(obj) {
    return obj.status === '8';
}

function buildStyle(jsonString){
    var style = {
        texture: {},
        logo: {}
    };
    if(jsonString !== undefined && jsonString !== "undefined")
        return style;
    var json = JSON.parse(jsonString);
    style.texture.height = json.texture_height;
    style.logo.position = json.texture_logo_position;
    style.texture.text = json.texture_text;
    style.background_app = json.background_app;
    return style;
}

function buildScopeStyleSettings(scope){
    scope.settings = {};
    if(localStorage.placeSettings !== undefined && localStorage.placeSettings !== "undefined")
        scope.settings = JSON.parse(localStorage.placeSettings);
    scope.wa = {};
    scope.wa.phone = localStorage.th_phone;
    scope.checkinOptions = {};
    if(localStorage.checkinOptions !== undefined && localStorage.checkinOptions !== "undefined")
        scope.checkinOptions = JSON.parse(localStorage.checkinOptions);
    scope.style = {};
    scope.style = buildStyle(localStorage.placeTheme); 
    $('ion-content').css("background-image", "url(" + getImgPath() + scope.style.background_app + ")")
    setTimeout(function () {
        $('.buttonClass').css('background-color', 'rgb(88, 15, 15)');

        if(localStorage.th_home_square_color != undefined && localStorage.th_home_square_color != "undefined"){
            $('ion-floating-menu').attr('button-color', localStorage.getItem('th_button_color_theme'));
            $(".bar").css("background-color", localStorage.getItem('th_home_square_color'))  
            $(".bar").css("border-color", localStorage.getItem('th_home_square_color')) 
        }
    }, 200)
    scope.place_location = {};
    if(localStorage.place_location !== undefined && localStorage.place_location !== "undefined")
        scope.place_location = JSON.parse(localStorage.place_location);
    scope.placeTheme = {};
    if(localStorage.placeTheme !== undefined && localStorage.placeTheme !== "undefined")
        scope.placeTheme = JSON.parse(localStorage.placeTheme);
    scope.logoImage = getImgPath() + localStorage.getItem('th_business_logo');    
    scope.addon_puntos = localStorage.addon_puntos; //Scope utilizado para permitir que la app muestre o no los puntos de un Menú, esto por si se habilita o deshabilitan los puntos en una App    

    scope.$on('$destroy', function () {
        if(scope.modal)
            scope.modal.remove();
        if(typeof myPopup.close === "function")
            myPopup.close();
    });
}


function loginSession(user, profilePicture) {
    localStorage.setItem('username', user);
    localStorage.setItem('profilePicture', user);
}

function validateEmail(x) {//
    var atpos = x.indexOf("@");
    var dotpos = x.lastIndexOf(".");
    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {
        return false;
    } else {
        return true;
    }
}

function getImgPath() {
    //var img = 'http://localhost/ferby_xtra/img/'
    // var img = 'http://192.168.1.67/img/'
    var img = 'https://app.almacenesxtra.com/img/'
    return img
}

function failResponse() {
    customizeAlert('No pudimos conectarnos a Ferby, revisa tu conexión de internet.');
}

function Deg2Rad(deg) {
    return deg * Math.PI / 180;
}

function PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
    lat1 = Deg2Rad(lat1);
    lat2 = Deg2Rad(lat2);
    lon1 = Deg2Rad(lon1);
    lon2 = Deg2Rad(lon2);
    var R = 6371; // km
    var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
    var y = (lat2 - lat1);
    var d = Math.sqrt(x * x + y * y) * R;
    var m = d * 1000
    return m;
}

var sortByProperty = function (property) {
    return function (x, y) {
        return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
    };
};

function objectSize(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key))
            size++;
    }
    return size;
}

function customizeAlert(txt) {
    //navigator.notification.alert(txt, null, "", "OK");
    alert(txt);
}

function GetTipoMenu(type) {
    switch (type) {
        case 'LOCALMENU': return '2'; //Every type menu != 2 e.g. 1,3
        case 'HOMEDELIVERY': return '1'; //Every type menu != 1 e.g. 2,3
        default: return 'null';
    }
}
function illegalChar(txt) {
    var res = txt.replace(/#/g, "num");
    res = res.replace(/'/g, '`');
    res = res.replace(/"/g, '`');
    return res;
}


 function getPoints(scope) { //Función que llama al WS el action get_user_points que devuelve los puntos acumulados por la identidad guardada previamente en la caché user_id
    $.get(getServerPath(), {
        action: 'get_user_points',
        username: localStorage.user_id,
        place_id: Theme_id
        //place_id: 9
    }, function (resp) {
        var resp = $.trim(resp);
        scope.userPoints = resp;// PARA QUE LOS PUNTOS DEN RESULTADO EN SU CALCULO DEBE EXISTIR LOS REGISTROS DEL PLACE EN LA TABLA ALLIANCE Y PLACE_ALLIANCE
    });
}

