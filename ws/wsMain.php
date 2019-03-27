<?php header('Access-Control-Allow-Headers: X-Requested-With, origin, content-type'); ?>
<?php
require 'classes/connection.php';
require 'classes/secrets.php';
require 'classes/fileUpload.php';
require 'entities/admin.php';
require 'entities/place.php';
require 'entities/placeLocation.php';
require 'entities/subscriptions.php';
require 'entities/cliente.php';
require 'entities/username.php';
require 'entities/desk.php';
require 'entities/waiter.php';
require 'entities/category.php';
require 'entities/menu.php';
require 'entities/user_searchs.php';
require 'entities/bill.php';
require 'entities/bill_detail.php';
require 'entities/gift_points.php';
require 'entities/check_in.php';
require 'entities/loyal_users.php';
require 'entities/receipt_points.php'; 
require 'entities/sale.php';
require 'entities/promo.php';
require 'entities/images.php';
require 'entities/funciones.php';
require 'entities/chats.php';
require 'entities/options.php';
require 'entities/gallery.php';
require 'entities/reportes.php';
require 'entities/qrcatalog.php';
require 'entities/app_details.php';
require 'entities/featured_promo.php';
require 'entities/ferby_banners.php';
require 'entities/place_users.php';
require 'entities/type_action.php';
require 'entities/personalize.php';
require 'extras/contacts_referred.php';
require 'receptorfile.php';
require 'woo-ferby/push-woo-to-ferby.php';

function utf8_converter($array) {
    array_walk_recursive($array, function(&$item, $key) {
        if (!mb_detect_encoding($item, 'utf-8', true)) {
            $item = utf8_encode($item);
        }
    });
    return $array;
}

//echo generate_cupon_code(9);
//accumulate_points(3766);
$action = isset($_GET["action"]) ? $_GET["action"] : (isset($_POST["action"]) ? $_POST["action"] : "0");

switch ($action) {

//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//T  Y  P  E   A  C  T  I  O  N
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    case 'get_types': //CONSUMIDO
        $result = get_types();
        print json_encode($result);
        break;


//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//W  O  O    F  E  R  B  Y
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    case 'app_push_woo_ferby': //CONSUMIDO
        $parameters = new stdClass();
        $parameters = isset($_POST['object_data']) ? $_POST['object_data'] : "";
        if($parameters === "")
            return;

        $parameters = (object)json_decode($parameters);
        
        pushWooFerbyOrder($parameters);
        break;
    case 'push_woo_ferby': //CONSUMIDO
        $parameters = new stdClass();
        $parameters = isset($_POST['object_data']) ? (object)$_POST['object_data'] : NULL;
        if($parameters == NULL)
            return;
        
        pushWooFerbyOrder($parameters);
        break;
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//A  D  M  I  N  I  S  T  R  A  T  O  R
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    case 'insert_Admin': //CONSUMIDO
        $admin_id = $_GET['admin_id'];
        $pass = $_GET['pass'];
        $first_name = $_GET['first_name'];
        $last_name = $_GET['last_name'];
        insert_Admin($admin_id, $pass, $first_name, $last_name);
        break;
    case 'update_Admin':
        $admin_id = $_GET['admin_id'];
        $first_name = $_GET['first_name'];
        $last_name = $_GET['last_name'];
        update_Admin($admin_id, $first_name, $last_name);
        break;
    case 'update_Table_Max':
        $max_tables = $_GET['max_tables'];
        $admin_id = $_GET['admin_id'];
        update_Table_Max($admin_id, $max_tables);
        break;
    case 'update_User_Status':
        $status = $_GET['status'];
        $admin_id = $_GET['admin_id'];
        update_User_Status($admin_id, $status);
        break;
    case 'update_Pass_Admin':
        $token = $_GET['token'];
        $pass = $_GET['pass'];
        $admin_id = $_GET['admin_id'];
        update_Pass_Admin($token, $pass, $admin_id, $option);
        break;
    case 'login_admin': // CONSUMIDO
        $admin_id = $_GET['admin_id'];
        $pass = $_GET['pass'];
        login_admin($admin_id, $pass);
        break;
    case 'login_admin_app': // CONSUMIDO
        $admin_id = $_GET['admin_id'];
        $pass = $_GET['pass'];
        login_admin_app($admin_id, $pass);
        break;
    case 'login_admin_places': // CONSUMIDO
        $admin_id = $_GET['admin_id'];
        $pass = $_GET['pass'];
        login_admin_places($admin_id, $pass);
        break;
    case 'select_admin':
        $admin_id = $_GET['admin_id'];
        select_admin($admin_id);
        break;
    case 'update_admin_pass':
        $old_pass = $_GET['old_pass'];
        $new_pass = $_GET['new_pass'];
        $user = $_GET['user'];
        change_admin_pass($old_pass, $new_pass, $user);
        break;
    case 'insert_gcm_admin':
        $uuid = $_GET['uuid'];
        $gcmToken = $_GET['gcmToken'];
        $admin_id = $_GET['admin_id'];
        $platform = isset($_GET["platform"]) ? $_GET["platform"] : (isset($_POST["platform"]) ? $_POST["platform"] : "Android");
        insert_gcm_place_admin($uuid, $gcmToken, $admin_id, $platform);
        break;
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//P  L   A   C  E
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    case 'delete_place':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $result = delete_place($parameters);
        print json_encode($result);
        break;   
    case 'switch_show_shop':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->show_shop = $_GET["show_shop"];
        $result = switch_show_shop($parameters);
        print json_encode($result);
        break;
    case 'switch_show_locations':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->show_locations = $_GET["show_locations"];
        $result = switch_show_locations($parameters);
        print json_encode($result);
        break;
    case 'switch_show_events':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->show_events = $_GET["show_events"];
        $result = switch_show_events($parameters);
        print json_encode($result);
        break;
    case 'switch_show_promos':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->show_promos = $_GET["show_promos"];
        $result = switch_show_promos($parameters);
        print json_encode($result);
        break;
    case 'switch_show_coupons':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->show_coupons = $_GET["show_coupons"];
        $result = switch_show_coupons($parameters);
        print json_encode($result);
        break;
    case 'switch_addon_check_in':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->addon_check_in = $_GET["addon_check_in"];
        $result = switch_addon_check_in($parameters);
        print json_encode($result);
        break;
    case 'switch_addon_puntos':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->addon_puntos = $_GET["addon_puntos"];
        $result = switch_addon_puntos($parameters);
        print json_encode($result);
        break;
    case 'switch_map_directions':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->map_directions = $_GET["map_directions"];
        $result = switch_map_directions($parameters);
        print json_encode($result);
        break;
    case 'switch_show_messenger':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->show_messenger = $_GET["show_messenger"];
        $result = switch_show_messenger($parameters);
        print json_encode($result);
        break;
    case 'switch_show_phone':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->show_phone = $_GET["show_phone"];
        $result = switch_show_phone($parameters);
        print json_encode($result);
        break;
    case 'switch_show_facebook':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->show_facebook = $_GET["show_facebook"];
        $result = switch_show_facebook($parameters);
        print json_encode($result);
        break;
    case 'create_new_app'://CONSUMIDO
        $parameters = new stdClass();
        $parameters->business_logo = isset($_FILES["business_logo"]) ? $_FILES["business_logo"] : (isset($_FILES["business_logo"]) ? $_FILES["business_logo"] : "");
        $parameters->business_name = isset($_GET["business_name"]) ? $_GET["business_name"] : (isset($_POST["business_name"]) ? $_POST["business_name"] : "");
        $parameters->business_phone = isset($_GET["business_phone"]) ? $_GET["business_phone"] : (isset($_POST["business_phone"]) ? $_POST["business_phone"] : "");
        $parameters->facebook_id = isset($_GET["facebook_id"]) ? $_GET["facebook_id"] : (isset($_POST["facebook_id"]) ? $_POST["facebook_id"] : "");
        $parameters->admin_id = isset($_GET["admin_id"]) ? $_GET["admin_id"] : (isset($_POST["admin_id"]) ? $_POST["admin_id"] : "");
        $parameters->password = isset($_GET["password"]) ? $_GET["password"] : (isset($_POST["password"]) ? $_POST["password"] : "ferby");
        $response = create_new_app($parameters);
        print json_encode($response);
        break;
    case 'get_place':
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        $place = get_place($place_id);
        print json_encode($place);
        break;
    case 'insert_Place'://CONSUMIDO
        $admin_id = isset($_GET["admin_id"]) ? $_GET["admin_id"] : (isset($_POST["admin_id"]) ? $_POST["admin_id"] : "0");
        $business_logo = isset($_FILES["business_logo"]) ? $_FILES["business_logo"] : (isset($_FILES["business_logo"]) ? $_FILES["business_logo"] : "0");
        $business_name = isset($_GET["business_name"]) ? $_GET["business_name"] : (isset($_POST["business_name"]) ? $_POST["business_name"] : "0");
        insert_Place($admin_id, $business_name, $business_logo);
        break;
    case 'activate_points'://CONSUMIDO
        $parameters = new stdClass();
        $parameters->place_id = $_GET['place_id'];
        $res = activate_points($parameters);
        echo $res;
        break;
    case 'select_place'://CONSUMIDO
        $admin_id = $_GET['admin_id'];
        select_place($admin_id);
        break;
    case 'get_place_by_admin_id'://CONSUMIDO
        $parameters = new stdClass();
        $parameters->admin_id = $_GET['admin_id'];
        $place = get_place_by_admin_id($parameters);
        print json_encode($place);
        break;
    case 'get_place_by_place_location'://CONSUMIDO
        $place_location_id = $_GET['place_location_id'];
        $place = get_place_by_place_location($place_location_id);
        print json_encode($place);
        break;
    case 'select_all_settings'://CONSUMIDO
        $result = select_all_settings();
        print json_encode($result);
        break;
    case 'select_theme'://CONSUMIDO
        $place_id = $_GET['place_id'];
        select_theme($place_id);
        break;
    case 'select_place_settings'://CONSUMIDO
        $parameters = new stdClass();
        $parameters->place_id = $_GET['place_id'];
        $setting = select_place_settings($parameters);
        print json_encode($setting);
        break;
    case 'select_checkin_options'://CONSUMIDO
        $parameters = new stdClass();
        $parameters->place_id = $_GET['place_id'];
        $setting = select_checkin_options($parameters);
        print json_encode($setting);
        break;
    case 'update_place'://CONSUMIDO
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        $business_logo = isset($_FILES["business_logo"]) ? $_FILES["business_logo"] : (isset($_FILES["business_logo"]) ? $_FILES["business_logo"] : "0");
        $business_name = isset($_GET["business_name"]) ? $_GET["business_name"] : (isset($_POST["business_name"]) ? $_POST["business_name"] : "0");
        update_Place($place_id, $business_name, $business_logo);
        break;
    case 'addGcm':
        $uuid = $_GET['uuid'];
        $gcmToken = $_GET['gcmToken'];
        $place_Id = $_GET['place_Id'];
        $platform = isset($_GET["platform"]) ? $_GET["platform"] : (isset($_POST["platform"]) ? $_POST["platform"] : "Android");
        insert_place_user($uuid, $gcmToken, $place_Id,$platform);
        break;
    case 'addAdminGcm':
        $uuid = $_GET['uuid'];
        $gcmToken = $_GET['gcmToken'];
        $place_Id = $_GET['place_Id'];
        $platform = isset($_GET["platform"]) ? $_GET["platform"] : (isset($_POST["platform"]) ? $_POST["platform"] : "Android");
        insert_place_admin_user($uuid, $gcmToken, $place_Id,$platform);
        break;
    case 'select_producs_from_place':
        $place_Id = $_GET['place_Id'];
        select_producs_from_place($place_Id);
        break;
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//P  L  A  C  E    L  O  C  A  T  I  O  N  S
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬   
    case 'insert_Place_Locations'://CONSUMIDO
        $name = $_GET['name'];
        $city = $_GET['city'];
        $lat = $_GET['lat'];
        $lon = $_GET['lon'];
        $place_id = $_GET['place_id'];
        $min = $_GET['min'];
        insert_Place_Locations($name, $lat, $lon, $place_id, $city, $min);
        break;

    case 'set_whatsapp_store':
        $parameters = new stdClass();
        $parameters->store_id = $_GET["store_id"];
        $parameters->whatsapp = $_GET["whatsapp"];
        $res = set_whatsapp_store($parameters);
        print json_encode($res);
        break;

    case 'set_order_site':
        $parameters = new stdClass();
        $parameters->store_id = $_GET["store_id"];
        $parameters->order_site = $_GET["order_site"];
        $res = set_order_site($parameters);
        print json_encode($res);
        break;

    case 'set_shipping_cost':
        $parameters = new stdClass();
        $parameters->store_id = $_GET["store_id"];
        $parameters->shipping_cost = $_GET["shipping_cost"];
        $res = set_shipping_cost($parameters);
        print json_encode($res);
        break;

    case 'set_promo_day':
        $parameters = new stdClass();
        $parameters->place_location_id = $_GET["place_location_id"];
        $parameters->promo_day = $_GET["promo_day"];
        set_promo_day($parameters);
        break;

    case 'delete_place_location':
        $parameters = new stdClass();
        $parameters->place_location_id = $_GET["place_location_id"];
        delete_place_location($parameters);
        break;
    case 'update_Place_Locations'://CONSUMIDO
        $name = $_GET['name'];
        $city = $_GET['city'];
        $lat = $_GET['lat'];
        $lon = $_GET['lon'];
        $place_Location_id = $_GET['place_location_id'];
        $min = $_GET['min'];
        udpate_Place_Locations($name, $lat, $lon, $place_Location_id, $city, $min);
        break;
    case 'select_Place_Locations'://CONSUMIDO
        $place_id = $_GET['place_id'];
        select_place_Locations($place_id);
        break;
    case 'select_place_locations_det'://CONSUMIDO
        $place_id = $_GET['place_id'];
        select_place_locations_det($place_id);
        break;
    case'select_All_Place_Locations':
        select_All_Place_Locations();
        break;
    case'select_Filt_Locations':
        $filt = $_GET['filt'];
        select_Filt_Locations($filt);
        break;
    case 'update_place_pass':
        $new_pass = $_GET['new_pass'];
        $place_location_id = $_GET['place_location_id'];
        change_place_pass($new_pass, $place_location_id);
        break;
    case 'update_politics':
        $home_order_terms = $_GET['home_order_terms'];
        $place_location_id = $_GET['place_location_id'];
        change_politics($home_order_terms, $place_location_id);
        break;
    case 'turn_on_home_delivery':
        $place_location_id = $_GET['place_location_id'];
        $switch = 1;
        switch_home_delivery($switch, $place_location_id);
        break;
    case 'turn_off_home_delivery':
        $place_location_id = $_GET['place_location_id'];
        $switch = 0;
        switch_home_delivery($switch, $place_location_id);
        break;
    case 'turn_on_pick_delivery':
        $place_location_id = $_GET['place_location_id'];
        $switch = 1;
        switch_pick_delivery($switch, $place_location_id);
        break;
    case 'turn_off_pick_delivery':
        $place_location_id = $_GET['place_location_id'];
        $switch = 0;
        switch_pick_delivery($switch, $place_location_id);
        break;
    case 'get_orders_by_place':
        $place_id = $_GET['place_id'];
        $status = $_GET['status'];
        get_orders_by_place($place_id, $status);
        break;
    case 'get_orders_by_admin':
        $admin_id = $_GET['admin_id'];
        $status = $_GET['status'];
        get_orders_by_admin($admin_id, $status);
        break;

//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//G  I  F  T   P  O  I  N  T  S
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    case 'add_puntos_place':
        $parameters = new stdClass();
        $parameters->place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "");
        $parameters->business_name = isset($_GET["business_name"]) ? $_GET["business_name"] : (isset($_POST["business_name"]) ? $_POST["business_name"] : "");
        $parameters->admin_id = isset($_GET["admin_id"]) ? $_GET["admin_id"] : (isset($_POST["admin_id"]) ? $_POST["admin_id"] : "");
        $result = add_puntos_place($parameters);
        print json_encode($result);
        break;
    case 'add_punchcard_place':
        $parameters = new stdClass();
        $parameters->place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "");
        $parameters->business_name = isset($_GET["business_name"]) ? $_GET["business_name"] : (isset($_POST["business_name"]) ? $_POST["business_name"] : "");
        $parameters->admin_id = isset($_GET["admin_id"]) ? $_GET["admin_id"] : (isset($_POST["admin_id"]) ? $_POST["admin_id"] : "");
        $result = add_punchcard_place($parameters);
        print json_encode($result);
        break;
    case 'select_gift_points'://CONSUMIDO
        $username = isset($_GET["username"]) ? $_GET["username"] : (isset($_POST["username"]) ? $_POST["username"] : "0");
        select_gift_points($username);
        break;
    case 'redeem_points'://CONSUMIDO
        $parameters = new stdClass();
        $parameters->place_id = $_GET['place_id'];
        $parameters->place_location_id = $_GET['place_location_id'];
        $parameters->gift_username = $_GET['username'];
        $parameters->gift_points = $_GET['gift_points'];
        $parameters->gift_bill_id = isset($_GET["gift_bill_id"]) ? $_GET["gift_bill_id"] : (isset($_POST["gift_bill_id"]) ? $_POST["gift_bill_id"] : "0");
        redeem_points($parameters);
        break;
    case 'get_user_points':
        $username = $_GET['username'];
        $place_id = $_GET['place_id'];
        get_alliance_points($username, $place_id);
        break;

    case 'insertPoints_manually':
        $username = $_GET['identidad'];
        $factura = $_GET['factura'];
        $place_id = $_GET['place_id'];
        $amt = $_GET['amt'];
        insertPoints_manually($username,$factura,$place_id,$amt);
        break;    

    case 'get_place_points':
        $username = $_GET['username'];
        $place_id = $_GET['place_id'];
        get_alliance_points($username, $place_id);
        break;
break;

//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//L  O  Y  A  L   U  S  E  R  S
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    case 'select_loyal_user':
        $parameters = new stdClass();
        $parameters->username = $_GET['username'];
        $loyal_users = select_loyal_user($parameters);
        print json_encode($loyal_users);
        break;

//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//C  H  E  C  K   I  N
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    case 'select_loyal_username':
        $parameters = new stdClass();
        $parameters->username = $_GET['username'];
        $check_ins = select_loyal_username($parameters);
        print json_encode($check_ins);
        break;
    case 'get_user_check_log':
        $parameters = new stdClass();
        $parameters->username = $_GET['username'];
        $parameters->place_id = $_GET['place_id'];
        $check_ins = get_user_check_log($parameters);
        print json_encode($check_ins);
        break;
    case 'get_user_checkins':
        $parameters = new stdClass();
        $parameters->username = $_GET['username'];
        $parameters->place_id = $_GET['place_id'];
        get_user_checkins($parameters);
        break;
    case 'redeem_check'://CONSUMIDO
        $parameters = new stdClass();
        $parameters->place_id = $_GET['place_id'];
        $parameters->store_id = $_GET['store_id'];
        $parameters->username = $_GET['username'];
        $parameters->check_points = $_GET['check_points'];
        $parameters->transaction_entry = isset($_GET["transaction_entry"]) ? $_GET["transaction_entry"] : (isset($_POST["transaction_entry"]) ? $_POST["transaction_entry"] : "");
        redeem_check($parameters);
        break;
    case 'check_in'://CONSUMIDO
        $parameters = new stdClass();
        $parameters->place_id = $_GET['place_id'];
        $parameters->store_id = $_GET['store_id'];
        $parameters->username = $_GET['username'];
        $parameters->check_points = isset($_GET["check_points"]) ? $_GET["check_points"] : (isset($_POST["check_points"]) ? $_POST["check_points"] : "1");
        $parameters->transaction_entry = isset($_GET["transaction_entry"]) ? $_GET["transaction_entry"] : (isset($_POST["transaction_entry"]) ? $_POST["transaction_entry"] : "");
        echo check_in($parameters);
        break;

    case 'delete_checkin'://CONSUMIDO
        $parameters = new stdClass();
        $parameters->check_in_id = $_GET['check_in_id'];
        echo delete_checkin($parameters);
        break;

     case 'insert_loyal_username':
        $parameters = new stdClass();
        $parameters->username = isset($_GET["identidad"]) ? $_GET["identidad"] : (isset($_POST["identidad"]) ? $_POST["identidad"] : "0");
        $parameters->Nombre = isset($_GET["Nombre"]) ? $_GET["Nombre"] : (isset($_POST["Nombre"]) ? $_POST["Nombre"] : "0");
        $parameters->numero = isset($_GET["numero"]) ? $_GET["numero"] : (isset($_POST["numero"]) ? $_POST["numero"] : "0");
        $parameters->email = isset($_GET["email"]) ? $_GET["email"] : (isset($_POST["email"]) ? $_POST["email"] : "0");
        insert_loyal_username($parameters);
     break;


//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//P  L  A  C  E   U  S  E  R  S
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    case 'notify_unchecked_bills'://CONSUMIDO
        notify_unchecked_bills();
        break;


//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//R  E   C  E  I  P  T  P  O  I  N  T  S
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    case 'select_receipt_points'://CONSUMIDO
        $parameters = new stdClass();
        $parameters->username = isset($_GET["username"]) ? $_GET["username"] : (isset($_POST["username"]) ? $_POST["username"] : "0");
        $parameters->place_location_id = $_GET['place_location_id'];
        select_receipt_points($parameters);
        break;
    case 'select_all_receipt_points'://CONSUMIDO
        $parameters = new stdClass();
        $parameters->place_location_id = $_GET['place_location_id'];
        select_all_receipt_points($parameters);
        break;
    case 'select_receipt_points_of_day'://CONSUMIDO
        $parameters = new stdClass();
        $parameters->place_location_id = $_GET['place_location_id'];
        $parameters->year = $_GET['year'];
        $parameters->month = $_GET['month'];
        $parameters->day = $_GET['day'];
        select_receipt_points_of_day($parameters);
        break;
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//A  P  P   D  E  T  A  I  L  S
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    case 'select_apps':
        select_apps();
        break;
    case 'detail_app':
        $app_id = $_GET['app_id'];
        detail_app($app_id);
        break;

//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//F  E  A  T  U  R  E  D   P  R  O  M  O
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    case 'select_featured_promos':
        select_featured_promos();
        break;
    case 'detail_ferby_banners':
        detail_ferby_banners();
        break;
    case 'detail_promo':
        $place_id = $_GET['place_id'];
        detail_promo($place_id);
        break;

//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//S  U  B  S  C  R  I  B  E  R  S
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬    
    case 'insert_subscription':
        $place_id = $_GET['place_id'];
        $user_id = $_GET['user_id'];
        $loc_id = isset($_GET["loc_id"]) ? $_GET["loc_id"] : (isset($_POST["loc_id"]) ? $_POST["loc_id"] : "0");
        insert_subscription($place_id, $user_id, $loc_id);
        break;
    case 'insert_sub':
        $place_id = $_GET['place_id'];
        $user_id = $_GET['user_id'];
        $loc_id = $_GET['loc_id'];
        insert_sub($place_id, $user_id);
        break;
    case 'subscribe_place':
        $place_id = $_GET['place_id'];
        $user_id = $_GET['user_id'];
        update_subscribe($place_id, $user_id, 1);
        break;
    case 'subscribe_again':
        $place_id = $_GET['place_id'];
        $user_id = $_GET['user_id'];
        update_subscribe($place_id, $user_id, 1);
        break;
    case 'unsubscribe':
        $place_id = $_GET['place_id'];
        $user_id = $_GET['user_id'];
        update_subscribe($place_id, $user_id, 0);
        break;
    case 'select_subscribed_places':
        $user_id = $_GET['user_id'];
        select_subscribed_places($user_id);
        break;
    case 'select_unsubscribed_places':
        $user_id = $_GET['user_id'];
        select_unsubscribed_places($user_id);
        break;
    case 'select_places_not_subscribed':
        $user_id = $_GET['user_id'];
        select_places_not_subscribed($user_id);
        break;
    case 'select_Count_Subscription':
        $place_id = $_GET['place_id'];
        select_Count_Subscription($place_id);
        break;
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//V I S I T O R
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬    
    case'select_count_visitor':
        $place_id = $_GET['place_id'];
        select_count_visitor($place_id);
        break;
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
// C  U  S  T  O  M  E  R  S
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    case 'insert_Client':
        $username = $_GET['username'];
        $password = $_GET['password'];
        $name = $_GET['name'];
        $email = $_GET['email'];
        $sex = $_GET['sex'];
        $bday = $_GET['bday'];
        $profile_picture = $_GET['profile_picture'];
        $recieve_notification = $_GET['recieve_notification'];
        $gcm = $_GET['gcm'];
        insert_Client($username, $password, $name, $email, $sex, $bday, $profile_picture, $recieve_notification, $gcm);
        break;
    case 'insert_Client_Man':
        $username = $_GET['username'];
        $password = $_GET['password'];
        $name = $_GET['name'];
        $email = $_GET['email'];
        $sex = $_GET['sex'];
        $bday = $_GET['bday'];
        $profile_picture = $_GET['profile_picture'];
        $recieve_notification = $_GET['recieve_notification'];
        insert_Client_Man($username, $password, $name, $sex, $bday, $recieve_notification);
        break;
    case 'update_Pass_Client':
        $token = $_GET['token'];
        $pass = $_GET['pass'];
        $user_id = $_GET['user'];
        update_Pass_Client($token, $pass, $user_id);
        break;
    case 'login_client':
        $client_id = $_GET['client_id'];
        $pass = $_GET['pass'];
        login_client($client_id, $pass);
        break;
    case 'select_Addr':
        $username = $_GET['username'];
        break;
    case 'change_client_pass':
        $client_id = $_GET['client_id'];
        $new_Pass = $_GET['new_Pass'];
        $old_Pass = $_GET['old_Pass'];
        change_client_pass($client_id, $new_Pass, $old_Pass);
        break;
    case 'login_bill':
        $bill_id = $_GET['bill_id'];
        login_order($bill_id);
        break;
    case 'insert_emails':
        $emailStr = $_GET['emailStr'];
        $userId = $_GET['userId'];
        user_mails($userId, $emailStr);
        break;
    case 'insert_mac_id':
        $mac_id = $_GET['mac_id'];
        $username = $_GET['username'];
        user_mac_id($mac_id, $username);
        break;
    case 'add_username':
        $username = $_GET['username'];
        $password = $_GET['password'];
        $name = $_GET['name'];
        $email = $_GET['email'];
        $bday = $_GET['bday'];
        $place_id = $_GET['place_id'];
        add_username($username, $password, $name, $bday, $email, $place_id);
        break;
    case 'get_users':
        $place_id = $_GET['place_id'];
        get_users($place_id);
        break;
    
    case 'login_activated_user':
        $username = $_GET['username'];
        $password = $_GET['password'];
        login_activated_user($username, $password);
        break;
    case 'activate_user':
        $username = $_GET['username'];
        activate_user($username);
        break;
    case 'deactivate_user':
        $username = $_GET['username'];
        deactivate_user($username);
        break;
    case 'generate_code_user':
        $username = $_GET['username'];
        $place_id = $_GET['place_id'];
        generate_code_user($username, $place_id);
        break;
    case 'generate_code_email':
        $email = $_GET['email'];
        $place_id = $_GET['place_id'];
        generate_code_email($email, $place_id);
        break;
    case 'recovery_code_access':
        $token = $_GET['token'];
        recovery_code_access($token);
        break;
    case 'new_password':
        $username = $_GET['username'];
        $place_id = $_GET['place_id'];
        $password = $_GET['password'];
        new_password($username, $place_id, $password);
        break;

//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//W  A  I  T  E  R
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    case 'insert_Waiter'://CONSUMIDO
        $waiter_id = $_GET['waiter_id'];
        $first_name = $_GET['first_name'];
        $last_name = $_GET['last_name'];
        $number = $_GET['number'];
        $place_id = $_GET['place_id'];
        insert_Waiter($waiter_id, $first_name, $last_name, $number, $place_id);
        break;
    case 'update_Waiter'://CONSUMIDO
        $waiter_id = $_GET['waiter_id'];
        $first_name = $_GET['first_name'];
        $last_name = $_GET['last_name'];
        $number = $_GET['number'];
        update_Waiter($waiter_id, $first_name, $last_name, $number);
        break;
    case 'login_waiter':
        $waiter_id = $_GET['waiter_id'];
        $password = $_GET['password'];
        login_waiter($waiter_id, $password);
        break;
    case 'reset_waiter_pass':
        $waiter_id = $_GET['waiter_id'];
        update_waiter_pass($waiter_id);
        break;
    case 'asign_waiter':
        $waiter_id = $_GET['waiter_id'];
        $desk_id = $_GET['desk_id'];
        asign_waiter($waiter_id, $desk_id);
        break;
    case 'unasign_waiter':
        $tablexwaiter_id = $_GET['tablexwaiter_id'];
        unassign_waiter($tablexwaiter_id);
        break;
    case 'select_Waiter':
        $place_id = $_GET['place_id'];
        select_Waiter($place_id);
        break;
    case 'change_waiter_pass':
        $waiter_id = $_GET['waiter_id'];
        $old_password = $_GET['old_password'];
        $new_password = $_GET['new_password'];
        change_pass_waiter($waiter_id, $old_password, $new_password);
        break;
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//T  A  B  L  E  S
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    case 'insert_desk'://CONSUMIDO
        $place_location_id = $_GET['place_location_id'];
        $desk_name = $_GET['desk_nm'];
        insert_desk($place_location_id, $desk_name);
        break;
    case'update_desk':
        $desk_name = $_GET['desk_name'];
        $desk_id = $_GET['desk_id'];
        $status = $_GET['status'];
        update_desk_name($desk_name, $desk_id, $status);
        break;
    case'update_desk_status':
        $desk_id = $_GET['desk_id'];
        $status = $_GET['status'];
        update_desk_status($status, $desk_id);
        break;
    case'select_desk':
        $place_location_id = $_GET['place_location_id'];
        select_desk($place_location_id);
        break;
    case'delete_desk':
        $desk_id = $_GET['desk_id'];
        delete_desk($desk_id);
        break;
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//C  A  T  E  G  O  R  I  E  S
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ 
    case 'insert_category':
        $place_id = $_GET['place_id'];
        $name = $_GET['name'];
        insert_category($place_id, $name);
        break;
    case 'add_category':
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "");
        $name = isset($_GET["name"]) ? $_GET["name"] : (isset($_POST["name"]) ? $_POST["name"] : "");
        $super_category = isset($_GET["super_category"]) ? $_GET["super_category"] : (isset($_POST["super_category"]) ? $_POST["super_category"] : "");
        $category_type = isset($_GET["category_type"]) ? $_GET["category_type"] : (isset($_POST["category_type"]) ? $_POST["category_type"] : "1");
        $category_home = isset($_GET["category_home"]) ? $_GET["category_home"] : (isset($_POST["category_home"]) ? $_POST["category_home"] : "0");
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "");
        if ($img != "") {
            if (valid_image($img) == 'false') {
                echo -1;
                break;
            }
        }
        add_category($place_id, $name, $img, $super_category, $category_type, $category_home);
        break;

    case 'update_category':
        $cat_id = $_GET['cat_id'];
        $status = $_GET['status'];
        $name = $_GET['name'];
        $category_type = isset($_GET["category_type"]) ? $_GET["category_type"] : (isset($_POST["category_type"]) ? $_POST["category_type"] : "1");
        $category_home = isset($_GET["category_home"]) ? $_GET["category_home"] : (isset($_POST["category_home"]) ? $_POST["category_home"] : "0");
        update_category($cat_id, $name, $status, $category_type, $category_home);
        break;
    case 'set_category_image':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $category_id = isset($_GET["category_id"]) ? $_GET["category_id"] : (isset($_POST["category_id"]) ? $_POST["category_id"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        set_category_image($img, $category_id);
        break;
    case 'select_category':
        $place_id = $_GET['place_id'];
        select_Category($place_id);
        break;
    case 'delete_category':
        $cat_id = $_GET['cat_id'];
        delete_cat($cat_id);
        break;
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//M  E  N  U
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ 
    case 'menu_concat_options'://CONSUMIDO
        $parameters = new stdClass();
        $parameters->place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        $result = menu_concat_options($parameters);
        print json_encode($result);
        break;
    case 'get_category_menu'://CONSUMIDO
        $parameters = new stdClass();
        $parameters->category_id = isset($_GET["category_id"]) ? $_GET["category_id"] : (isset($_POST["category_id"]) ? $_POST["category_id"] : "0");
        
        $result = get_category_menu($parameters);
        print json_encode($result);
        break;
    case 'create_product':
        $parameters = new stdClass();
        $parameters->category_id = isset($_GET["category_id"]) ? $_GET["category_id"] : (isset($_POST["category_id"]) ? $_POST["category_id"] : "");
        $parameters->img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "");
        $parameters->description = isset($_GET["description"]) ? $_GET["description"] : (isset($_POST["description"]) ? $_POST["description"] : "");
        $parameters->price = isset($_GET["price"]) ? $_GET["price"] : (isset($_POST["price"]) ? $_POST["price"] : "0");
        $parameters->menu_price = isset($_GET["menu_price"]) ? $_GET["menu_price"] : (isset($_POST["menu_price"]) ? $_POST["menu_price"] : "0");
        $parameters->name = isset($_GET["name"]) ? $_GET["name"] : (isset($_POST["name"]) ? $_POST["name"] : "");
        $parameters->tipo_menu = isset($_GET["tipo_menu"]) ? $_GET["tipo_menu"] : (isset($_POST["tipo_menu"]) ? $_POST["tipo_menu"] : "3");
        if ($parameters->img != 0) {
            if (valid_image($parameters->img) == 'false') {
                echo -1;
                break;
            }
        }
        $res = insert_menu($parameters);
        break;
    case 'view_whatsapp_clicks':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $whatsapp_clicks = view_whatsapp_clicks($parameters);
        print json_encode($whatsapp_clicks);
        break;  
    case 'get_menu_items':
        $parameters = new stdClass();
        $parameters->menu_id = $_GET["menu_id"];
        $menu_detail = get_menu_items($parameters);
        print json_encode($menu_detail);
        break;
    case 'add_whatsapp_click'://CONSUMIDO
        $parameters = new stdClass();
        $parameters->id = $_GET["id"];
        add_whatsapp_click($parameters);
        break;    
    case 'import_menu'://CONSUMIDO
        $parameters = new stdClass();
        $parameters->menu_data = $_POST["menu_data"];
        $parameters->category_id = $_POST['category_id'];
        import_menu2($parameters);
        break;
    case 'insert_menu':
        $category_id = isset($_GET["category_id"]) ? $_GET["category_id"] : (isset($_POST["category_id"]) ? $_POST["category_id"] : "0");
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $description = isset($_GET["description"]) ? $_GET["description"] : (isset($_POST["description"]) ? $_POST["description"] : "0");
        $price = isset($_GET["price"]) ? $_GET["price"] : (isset($_POST["price"]) ? $_POST["price"] : "0");
        $menu_price = isset($_GET["menu_price"]) ? $_GET["menu_price"] : (isset($_POST["menu_price"]) ? $_POST["menu_price"] : "0");
        $conversion = isset($_GET["conversion"]) ? $_GET["conversion"] : (isset($_POST["conversion"]) ? $_POST["conversion"] : "0");
        $status = isset($_GET["status"]) ? $_GET["status"] : (isset($_POST["status"]) ? $_POST["status"] : "0");
        $name = isset($_GET["name"]) ? $_GET["name"] : (isset($_POST["name"]) ? $_POST["name"] : "0");
        $tipo_menu = isset($_GET["tipo_menu"]) ? $_GET["tipo_menu"] : (isset($_POST["tipo_menu"]) ? $_POST["tipo_menu"] : "0");
        $menu_points = isset($_GET["menu_points"]) ? $_GET["menu_points"] : (isset($_POST["menu_points"]) ? $_POST["menu_points"] : "0");
        $menuInventario = isset($_GET["menuInventario"]) ? $_GET["menuInventario"] : (isset($_POST["menuInventario"]) ? $_POST["menuInventario"] : "0");
        if ($img != 0) {
            if (valid_image($img) == 'false') {
                echo -1;
                break;
            }
        }
        insert_menu($category_id, $name, $description, $price, $img, $status, $tipo_menu, $menu_price, $conversion, $menu_points,$menuInventario);
        break;

    case 'delete_image_menu':
        $menu_id = isset($_GET["menu_id"]) ? $_GET["menu_id"] : (isset($_POST["menu_id"]) ? $_POST["menu_id"] : "0");
        delete_image_menu($menu_id);
        break;

    case 'select_menu':
        $place_id = $_GET["place_id"];
        select_menu($place_id);
        break;
    case 'select_product':
        $parameters = new stdClass();
        $parameters->id = $_GET["id"];
        $product = select_product($parameters);
        print json_encode($product);
        break;
    case 'update_menu':
        $category_id = isset($_GET["category_id"]) ? $_GET["category_id"] : (isset($_POST["category_id"]) ? $_POST["category_id"] : "0");
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $description = isset($_GET["description"]) ? $_GET["description"] : (isset($_POST["description"]) ? $_POST["description"] : "0");
        $price = isset($_GET["price"]) ? $_GET["price"] : (isset($_POST["price"]) ? $_POST["price"] : "0");
        $menu_price = isset($_GET["menu_price"]) ? $_GET["menu_price"] : (isset($_POST["menu_price"]) ? $_POST["menu_price"] : "0");
        $conversion = isset($_GET["conversion"]) ? $_GET["conversion"] : (isset($_POST["conversion"]) ? $_POST["conversion"] : "0");
        $status = isset($_GET["status"]) ? $_GET["status"] : (isset($_POST["status"]) ? $_POST["status"] : "0");
        $name = isset($_GET["name"]) ? $_GET["name"] : (isset($_POST["name"]) ? $_POST["name"] : "0");
        $menu_id = isset($_GET["menu_id"]) ? $_GET["menu_id"] : (isset($_POST["menu_id"]) ? $_POST["menu_id"] : "0");
        $tipo_menu = isset($_GET["tipo_menu"]) ? $_GET["tipo_menu"] : (isset($_POST["tipo_menu"]) ? $_POST["tipo_menu"] : "0");
        $menuStock = isset($_GET["menuStock"]) ? $_GET["menuStock"] : (isset($_POST["menuStock"]) ? $_POST["menuStock"] : "0");
        $menu_points = isset($_GET["menu_points"]) ? $_GET["menu_points"] : (isset($_POST["menu_points"]) ? $_POST["menu_points"] : "0");
        update_menu($menu_id, $category_id, $name, $description, $price, $img, $status, $tipo_menu, $menu_price, $conversion, $menu_points,$menuStock);
        break;
    case 'select_rest_menu':
        $place_id = $_GET["place_id"];
        select_rest_menu($place_id);
        break;
    case 'select_menu_rest':
        $place_id = $_GET["place_id"];
        $tipo_menu = $_GET["tipo_menu"];
        select_menu_rest($place_id, $tipo_menu);
        break;
    case 'getCatMenu':
        $placeId = $_GET['place_id'];
        getCatMenu($placeId);
        break;
    case 'select_full_menu':
        $placeId = $_GET['place_id'];
        select_full_menu($placeId);
        break;
    case 'get_search_menu':
        $placeId = $_GET['place_id'];
        $description = $_GET['description'];
        get_search_menu($placeId, $description);
        break;
    case'delete_menu':
        $menu_id = $_GET['menu_id'];
        delete_menu($menu_id);
        break;
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//U  S  E  R    S  E  A  R  C  H  S 
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ 
//    case 'insert_search':
//        $place_id = $_GET['place_id'];
//        $user_id = $_GET['user_id'];
//        $search_string = $_GET['search_string'];
//        insert_search2($place_id, $user_id, $search_string);
//        break;
    case 'select_searchs':
        $place_id = $_GET['place_id'];
        $user_id = $_GET['user_id'];
        select_searchs($place_id, $user_id);
        break;
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//I  M  A  G  E  S 
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ 
    case 'insert_image':
        $menu_id = isset($_GET["menu_id"]) ? $_GET["menu_id"] : (isset($_POST["menu_id"]) ? $_POST["menu_id"] : "0");
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        insert_image($menu_id, $img);
        break;
    case 'insert_image':
        $image = isset($_FILES["$image_id"]) ? $_FILES["$image_id"] : (isset($_FILES["$image_id"]) ? $_FILES["$image_id"] : "0");
        delete_Image($image_id);
        break;
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//B  I  L  L  S
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    case 'untrack_order':
        $parameters = new stdClass();
        $parameters->bill_id=isset($_GET["bill_id"]) ? $_GET["bill_id"] : (isset($_POST["bill_id"]) ? $_POST["bill_id"] : "");
        $result = untrack_order($parameters);
        print json_encode($result);
        break;
    case 'get_user_orders':
        $parameters = new stdClass();
        $parameters->bill_username=isset($_GET["bill_username"]) ? $_GET["bill_username"] : (isset($_POST["bill_username"]) ? $_POST["bill_username"] : "");
        $parameters->place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        $orders = get_user_orders($parameters);
        print json_encode($orders);
        break;
    case 'track_id_orders':
        $parameters = new stdClass();
        $parameters->track_id=isset($_GET["track_id"]) ? $_GET["track_id"] : (isset($_POST["track_id"]) ? $_POST["track_id"] : "");
        $parameters->place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        $orders = track_id_orders($parameters);
        print json_encode($orders);
        break;
    case 'create_order':
        $parameters = new stdClass();
        $parameters->bill_points = isset($_GET["bill_points"]) ? $_GET["bill_points"] : (isset($_POST["bill_points"]) ? $_POST["bill_points"] : "0");
        $parameters->longitud = isset($_GET["longitud"]) ? $_GET["longitud"] : (isset($_POST["longitud"]) ? $_POST["longitud"] : "y");
        $parameters->latitud = isset($_GET["latitud"]) ? $_GET["latitud"] : (isset($_POST["latitud"]) ? $_POST["latitud"] : "x");
        $parameters->store_id = isset($_GET["store_id"]) ? $_GET["store_id"] : (isset($_POST["store_id"]) ? $_POST["store_id"] : "0");
        $parameters->nombre = isset($_GET["nombre"]) ? $_GET["nombre"] : (isset($_POST["nombre"]) ? $_POST["nombre"] : "");
        $parameters->telefono1 = isset($_GET["telefono1"]) ? $_GET["telefono1"] : (isset($_POST["telefono1"]) ? $_POST["telefono1"] : "");
        $parameters->email = isset($_GET["email"]) ? $_GET["email"] : (isset($_POST["email"]) ? $_POST["email"] : "");
        $parameters->direccion = isset($_GET["direccion"]) ? $_GET["direccion"] : (isset($_POST["direccion"]) ? $_POST["direccion"] : "");
        $parameters->RTN = isset($_GET["RTN"]) ? $_GET["RTN"] : (isset($_POST["RTN"]) ? $_POST["RTN"] : "");
        $parameters->tipo_pago = isset($_GET["tipo_pago"]) ? $_GET["tipo_pago"] : (isset($_POST["tipo_pago"]) ? $_POST["tipo_pago"] : "0");
        $parameters->bill_username=isset($_GET["bill_username"]) ? $_GET["bill_username"] : (isset($_POST["bill_username"]) ? $_POST["bill_username"] : "");
        $parameters->username=isset($_GET["username"]) ? $_GET["username"] : (isset($_POST["username"]) ? $_POST["username"] : "100015899701211");
        $parameters->track_id=isset($_GET["track_id"]) ? $_GET["track_id"] : (isset($_POST["track_id"]) ? $_POST["track_id"] : "none");
        $parameters->comment = isset($_GET["comment"]) ? $_GET["comment"] : (isset($_POST["comment"]) ? $_POST["comment"] : "");
        $parameters->qty = isset($_GET["qty"]) ? $_GET["qty"] : (isset($_POST["qty"]) ? $_POST["qty"] : "1");
        $parameters->price = isset($_GET["price"]) ? $_GET["price"] : (isset($_POST["price"]) ? $_POST["price"] : "0");
        $parameters->place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        $parameters->menu_id = isset($_GET["menu_id"]) ? $_GET["menu_id"] : (isset($_POST["menu_id"]) ? $_POST["menu_id"] : "0");
        $parameters->bill_token = isset($_GET["bill_token"]) ? $_GET["bill_token"] : (isset($_POST["bill_token"]) ? $_POST["bill_token"] : "");
        $bill_id = create_order($parameters);
        echo $bill_id;
        break;
    case 'insert_Bill':
        $desk_id = $_GET["desk_id"];
        insert_bill($desk_id);
        break;
	case 'updateBalance':
		$bill_id = $_GET["bill_id"];
        updateBalance($bill_id);
        break;
	break;	
	case 'get_bill_images';
	    $bill_id = $_GET["bill_id"];
	    get_bill_images($bill_id);
	break;
	case 'delete_image_bill':
		  $imgId = $_GET["imgId"];
		  delete_image_bill($imgId );
	break;
    case 'insert_Bill_qr':
        $desk_id = $_GET["desk_id"];
        $place_loc = $_GET["place_loc"];
        $username = isset($_GET["username"]) ? $_GET["username"] : (isset($_POST["username"]) ? $_POST["username"] : "");
        //echo 'bill qr '.$username;
        insert_bill_qr($desk_id, $place_loc, $username);
        break;
    case 'update_Bill':
        $status = $_GET["status"];
        $bill_id = $_GET["bill_id"];
        update_bill($status, $bill_id);
        break;
    case 'update_bill_home_order':
        $bill_id = $_GET['bill_id'];
        $longitud = $_GET['longitud'];
        $latitud = $_GET['latitud'];
        $nombre = $_GET['nombre'];
        $telefono1 = $_GET['telefono1'];
        $email = $_GET['email'];
        $direccion = $_GET['direccion'];
        $rtn = isset($_GET["rtn"]) ? $_GET["rtn"] : (isset($_POST["rtn"]) ? $_POST["rtn"] : "");
        $bill_token = isset($_GET["bill_token"]) ? $_GET["bill_token"] : (isset($_POST["bill_token"]) ? $_POST["bill_token"] : "");
        $place_loc_id = $_GET['place_loc_id'];
        $tipo_pago = isset($_GET["tipo_pago"]) ? $_GET["tipo_pago"] : (isset($_POST["tipo_pago"]) ? $_POST["tipo_pago"] : "0");
        $uuid = $_GET['uuid'];
        $username = isset($_GET["username"]) ? $_GET["username"] : (isset($_POST["username"]) ? $_POST["username"] : "");
        $track_id = isset($_GET["track_id"]) ? $_GET["track_id"] : (isset($_POST["track_id"]) ? $_POST["track_id"] : "none");
        $bill_points = isset($_GET["bill_points"]) ? $_GET["bill_points"] : (isset($_POST["bill_points"]) ? $_POST["bill_points"] : -1);
        $deliveryDate = isset($_GET["deliveryDate"]) ? $_GET["deliveryDate"] : (isset($_POST["deliveryDate"]) ? $_POST["deliveryDate"] : 0);
		$balance = isset($_GET["balance"]) ? $_GET["balance"] : (isset($_POST["balance"]) ? $_POST["balance"] : 0);
        update_bill_home_order($bill_id, $longitud, $latitud, $nombre, $telefono1, $email, $direccion, $tipo_pago, $place_loc_id, $uuid, $rtn, $deliveryDate,$balance, $username, $track_id, $bill_points, $bill_token);
        break;
	case 'insert_bill_images':
		$img = $_FILES["img"];
		$bill_id = isset($_GET["bill_id"]) ? $_GET["bill_id"] : (isset($_POST["bill_id"]) ? $_POST["bill_id"] : "0");
		insert_bill_images($bill_id,$img);
	break;
        case 'insert_bill_refImage':
        $img = $_FILES["img"];
        $bill_id = isset($_GET["bill_id"]) ? $_GET["bill_id"] : (isset($_POST["bill_id"]) ? $_POST["bill_id"] : "0");
        insert_bill_refImage($bill_id,$img);
    break;
    case 'update_Bill_Header':
        $bill_id = $_GET['bill_id'];
        $nombre = $_GET['nombrePed'];
        $telefono1 = $_GET['telPed'];
        $email = $_GET['mailPed'];
        $direccion = $_GET['addrPed'];
        $rtn = isset($_GET["rtnPed"]) ? $_GET["rtnPed"] : (isset($_POST["rtnPed"]) ? $_POST["rtnPed"] : "");
        $deliveryDate = isset($_GET["deliveryPed"]) ? $_GET["deliveryPed"] : (isset($_POST["deliveryPed"]) ? $_POST["deliveryPed"] : 0);
        update_Bill_Header($bill_id, $nombre, $telefono1, $email, $direccion, $rtn, $deliveryDate);
        break;

    case 'update_bill_details':
        $status = $_GET["status"];
        $bill_id = $_GET["bill_id"];
        update_bill_details($status, $bill_id);
        break;
    case 'select_bill_id':
        $bill_id = $_GET["bill_id"];
        $pl_id = $_GET["pl_id"];
        select_bill_id($bill_id, $pl_id);
        break;
    case 'select_Bill':
        $place_loc_id = $_GET["place_loc_id"];
        select_bill($place_loc_id);
        break;
    case 'get_bill':
        $bill_id = $_GET["bill_id"];
        select_bill_by_id($bill_id);
        break;
    case 'insert_visitor':
        $user_id = $_GET['user_id'];
        $place_id = $_GET['place_id'];
        insert_visitor($user_id, $place_id);
        break;
    case 'insert_Bill_Pass':
        $desk_id = $_GET["desk_id"];
        $place_loc = $_GET["place_loc"];
        $passkey = isset($_GET["passkey"]) ? $_GET["passkey"] : (isset($_POST["passkey"]) ? $_POST["passkey"] : "0");
        insert_Bill_Pass($desk_id, $place_loc, $passkey);
        break;
    case 'dismiss_homeDelivery':
        $bill_id = $_GET["bill_id"];
        dismiss_homeDelivery($bill_id);
        break;
    case 'update_motorista':
        $bill_id = $_GET["bill_id"];
        $motorista = $_GET["motorista"];
        update_motorista($bill_id, $motorista);
        break;
    case 'update_bill_Image':
        $file = isset($_FILES["file"]) ? $_FILES["file"] : (isset($_FILES["file"]) ? $_FILES["file"] : "0");
        $bill_detail_id = isset($_GET["bill_detail_id"]) ? $_GET["bill_detail_id"] : (isset($_POST["bill_detail_id"]) ? $_POST["bill_detail_id"] : "0");
        update_bill_Image($file, $bill_detail_id);
        break;
    case 'delete_Bill':
        $bill_id = $_GET["bill_id"];
        echo '0';
        //delete_Bill($bill_id);
        break;
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//B  I  L  L  S    D  E  T  A  I  L  S
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ 
    case 'insert_Bill_Detail':
        $file = isset($_FILES["file"]) ? $_FILES["file"] : (isset($_FILES["file"]) ? $_FILES["file"] : "0");
        $menu_id = isset($_GET["menu_id"]) ? $_GET["menu_id"] : (isset($_POST["menu_id"]) ? $_POST["menu_id"] : "0");
        $bill_id = isset($_GET["bill_id"]) ? $_GET["bill_id"] : (isset($_POST["bill_id"]) ? $_POST["bill_id"] : "0");
        $option_id = isset($_GET["option_id"]) ? $_GET["option_id"] : (isset($_POST["option_id"]) ? $_POST["option_id"] : "0");
        $username = isset($_GET["username"]) ? $_GET["username"] : (isset($_POST["username"]) ? $_POST["username"] : "0");
        $comment = isset($_GET["comment"]) ? $_GET["comment"] : (isset($_POST["comment"]) ? $_POST["comment"] : "0");
        $qty = isset($_GET["qty"]) ? $_GET["qty"] : (isset($_POST["qty"]) ? $_POST["qty"] : "0");
        $price = isset($_GET["price"]) ? $_GET["price"] : (isset($_POST["price"]) ? $_POST["price"] : "0");
        $cncOptions = isset($_GET["cncOptions"]) ? $_GET["cncOptions"] : (isset($_POST["cncOptions"]) ? $_POST["cncOptions"] : "0");
        insert_Bill_Detail($menu_id, $bill_id, $option_id, $username, $comment, $qty, $price, $cncOptions, $file);
        break;
    case 'update_bill_detail':
        $bill_detail_id = $_GET["bill_detail_id"];
        $menu_id = $_GET["menu_id"];
        $bill_id = $_GET["bill_id"];
        $option_id = $_GET["option_id"];
        $comment = $_GET["comment"];
        $qty = $_GET["qty"];
        $price = $_GET["price"];
        $cncOptions = isset($_GET["cncOptions"]) ? $_GET["cncOptions"] : (isset($_POST["cncOptions"]) ? $_POST["cncOptions"] : "0");
        update_bill_detail($bill_detail_id, $menu_id, $bill_id, $option_id, $comment, $qty, $price, $cncOptions);
        break;
    case 'selectPlaceLocByBil':
        $bill_id = $_GET["bill_id"];
        selectPlaceLocByBil($bill_id);
        break;
    case 'update_bill_status_cancel':
        $bill_status_id = $_GET["bill_detail_id"];
        update_bill_status_cancel($bill_status_id);
        break;
    case 'update_bill_status':
        $bill_detail_id = $_GET["bill_detail_id"];
        $status = $_GET["status"];
        update_bill_status($bill_detail_id, $status);
        break;
    case 'select_bill_detail':
        $status = $_GET["status"];
        select_bill_detail($status);
        break;
    case 'select_bill_detailById':
        $billId = $_GET["billId"];
        select_bill_detailById($billId);
        break;
    case 'getBillByPlace':
        $status = $_GET["status"];
        $place_location = $_GET["place_location"];
        getBillByPlace($status, $place_location);
        break;
    case 'updateBillDetail':
        $status = $_GET["status"];
        $idBill = $_GET["idBill"];
        updateBillDetail($status, $idBill);
        break;
    case 'selectDomicilio':
        $status = $_GET["status"];
        $place_id = $_GET["place_id"];
        selectDomicilio($place_id, $status);
        break;
    case 'select_domicilio_place':
        $admin_id = $_GET["admin_id"];
        select_domicilio_place($admin_id);
        break;
    case 'selectDomiciliouuid':
        $uuid = $_GET["uuid"];
        selectDomiciliouuid($uuid);
        break;
    case 'queryBill':
        $idBill = $_GET["bill_id"];
        queryBill($idBill);
        break;
    case 'select_all_domicilio_place':
        $place_id = $_GET["place_id"];
        select_all_domicilio_place($place_id);
        break;
    case 'select_all_domicilio_union':
        $admin_id = $_GET["admin_id"];
        select_all_domicilio_union($admin_id);
        break;
    case 'select_historial_domicilio_place':
        $place_id = $_GET["place_id"];
        select_historial_domicilio_place($place_id);
        break;
    case 'getOtherPlaces':
        $place_loc_id = $_GET["place_loc_id"];
        getOtherPlaces($place_loc_id);
        break;
    case 'transfer':
        $place_loc_id = $_GET["place_loc_id"];
        $bill_id = $_GET["bill_id"];
        transfer($place_loc_id, $bill_id);
        break;
    case 'delete_bill_detail':
        $bill_detail_id = $_GET["bill_detail_id"];
        delete_bill_detail($bill_detail_id);
        break;
    case 'suppress_img':
        $bill_detail_id = $_GET["bill_detail_id"];
        suppress_img($bill_detail_id);
        break;
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//P  R  O  M  O  S
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ 
    case 'select_promotions'://CONSUMIDO
        $parameters = new stdClass();
        $parameters->place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        
        $result = select_promotions($parameters);
        print json_encode($result);
        break;

    case 'username_cupon_redeems'://CONSUMIDO
        $parameters = new stdClass();
        $parameters->customer_username = isset($_GET["customer_username"]) ? $_GET["customer_username"] : (isset($_POST["customer_username"]) ? $_POST["customer_username"] : "");
        $parameters->cupon_code = isset($_GET["cupon_code"]) ? $_GET["cupon_code"] : (isset($_POST["cupon_code"]) ? $_POST["cupon_code"] : "");
        
        $result = username_cupon_redeems($parameters);
        print json_encode($result);
        break;

    case 'insert_cupon_redeem'://CONSUMIDO
        $parameters = new stdClass();
        $parameters->customer_email = isset($_GET["customer_email"]) ? $_GET["customer_email"] : (isset($_POST["customer_email"]) ? $_POST["customer_email"] : "");
        $parameters->customer_name = isset($_GET["customer_name"]) ? $_GET["customer_name"] : (isset($_POST["customer_name"]) ? $_POST["customer_name"] : "");
        $parameters->customer_phone = isset($_GET["customer_phone"]) ? $_GET["customer_phone"] : (isset($_POST["customer_phone"]) ? $_POST["customer_phone"] : "");
        $parameters->customer_username = isset($_GET["customer_username"]) ? $_GET["customer_username"] : (isset($_POST["customer_username"]) ? $_POST["customer_username"] : "");
        $parameters->cupon_code = isset($_GET["cupon_code"]) ? $_GET["cupon_code"] : (isset($_POST["cupon_code"]) ? $_POST["cupon_code"] : "");
        $parameters->cupon_name = isset($_GET["cupon_name"]) ? $_GET["cupon_name"] : (isset($_POST["cupon_name"]) ? $_POST["cupon_name"] : "");
        $parameters->place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        $parameters->place_location_id = isset($_GET["place_location_id"]) ? $_GET["place_location_id"] : (isset($_POST["place_location_id"]) ? $_POST["place_location_id"] : "0");
        
        $result = insert_cupon_redeem($parameters);
        print json_encode($result);
        break;

    case 'getmyplaceid':
    $place_location = isset($_GET["place_location"]) ? $_GET["place_location"] : (isset($_POST["place_location"]) ? $_POST["place_location"] : "0");
    global $con;
    $prequery = "SELECT place_id FROM place_location where place_location_id = '$place_location'";
    $presth = mysqli_query($con, $prequery);
    while ($rPre = mysqli_fetch_assoc($presth)) {
       echo $rPre['place_id'];
    }
    break;

    case 'delete_cupon_code':
        $parameters = new stdClass();
        $parameters->cupon_code = $_GET["cupon_code"];
        delete_cupon_code($parameters);
        break;

    case 'switch_cupon_code':
        $parameters = new stdClass();
        $parameters->cupon_code = $_GET["cupon_code"];
        $parameters->cupon_status = $_GET["cupon_status"];
        switch_cupon_code($parameters);
        break;

    case 'set_cupon_description':
        $parameters = new stdClass();
        $parameters->cupon_code = $_GET["cupon_code"];
        $parameters->cupon_description = $_GET["cupon_description"];
        set_cupon_description($parameters);
        break;

    case 'set_cupon_name':
        $parameters = new stdClass();
        $parameters->cupon_code = $_GET["cupon_code"];
        $parameters->cupon_name = $_GET["cupon_name"];
        set_cupon_name($parameters);
        break;

    case 'set_cupon_cant':
        $parameters = new stdClass();
        $parameters->cupon_code = $_GET["cupon_code"];
        $parameters->cupon_cant = $_GET["cupon_cant"];
        set_cupon_cant($parameters);
        break;

    case 'update_valid_thru':
        $parameters = new stdClass();
        $parameters->valid_thru = isset($_GET["valid_thru"]) ? $_GET["valid_thru"] : (isset($_POST["valid_thru"]) ? $_POST["valid_thru"] : "");
        $parameters->cupon_code = isset($_GET["cupon_code"]) ? $_GET["cupon_code"] : (isset($_POST["cupon_code"]) ? $_POST["cupon_code"] : "");
        update_valid_thru($parameters);
        break;

    case 'set_cupon_image':
        $parameters = new stdClass();
        $parameters->img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $parameters->cupon_code = isset($_GET["cupon_code"]) ? $_GET["cupon_code"] : (isset($_POST["cupon_code"]) ? $_POST["cupon_code"] : "0");

        if (valid_image($parameters->img) == 'false') {
            echo -1;
            break;
        }
        set_cupon_image($parameters);
        break;
    case 'next_cupon_code'://CONSUMIDO
        $parameters = new stdClass();
        $parameters->place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        
        $result = generate_cupon_code($parameters);
        print json_encode($result);
        break;
    case 'scan_cupon_code'://CONSUMIDO
        $parameters = new stdClass();
        $parameters->cupon_code = isset($_GET["cupon_code"]) ? $_GET["cupon_code"] : (isset($_POST["cupon_code"]) ? $_POST["cupon_code"] : "0");
        $result = scan_cupon_code($parameters);
        print json_encode($result);
        break;
    case 'select_cupon_code'://CONSUMIDO
        $parameters = new stdClass();
        $parameters->place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        
        $result = select_cupon_code($parameters);
        print json_encode($result);
        break;

    case 'select_cupon_code_uuid'://CONSUMIDO
        $parameters = new stdClass();
        $parameters->place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        $parameters->uuid = isset($_GET["uuid"]) ? $_GET["uuid"] : (isset($_POST["uuid"]) ? $_POST["uuid"] : "0");
        
        $result = select_cupon_code_uuid($parameters);
        print json_encode($result);
        break;
    case 'create_cupon'://CONSUMIDO
        $parameters = new stdClass();
        $parameters->place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        $parameters->cupon_name = isset($_GET["cupon_name"]) ? $_GET["cupon_name"] : (isset($_POST["cupon_name"]) ? $_POST["cupon_name"] : "");
        $parameters->cupon_description = isset($_GET["cupon_description"]) ? $_GET["cupon_description"] : (isset($_POST["cupon_description"]) ? $_POST["cupon_description"] : "");
        $parameters->valid_thru = isset($_GET["valid_thru"]) ? $_GET["valid_thru"] : (isset($_POST["valid_thru"]) ? $_POST["valid_thru"] : "2018-12-31");
        $parameters->valid_time = isset($_GET["valid_time"]) ? $_GET["valid_time"] : (isset($_POST["valid_time"]) ? $_POST["valid_time"] : "01:01:00");
        $parameters->cupon_points = isset($_GET["cupon_points"]) ? $_GET["cupon_points"] : (isset($_POST["cupon_points"]) ? $_POST["cupon_points"] : "0");
        $parameters->cupon_type = isset($_GET["cupon_type"]) ? $_GET["cupon_type"] : (isset($_POST["cupon_type"]) ? $_POST["cupon_type"] : "1");
          $parameters->cupon_cant = isset($_GET["cupon_cant"]) ? $_GET["cupon_cant"] : (isset($_POST["cupon_cant"]) ? $_POST["cupon_cant"] : "0");
        $parameters->cupon_id_departamento = isset($_GET["cupon_id_departamento"]) ? $_GET["cupon_id_departamento"] : (isset($_POST["cupon_id_departamento"]) ? $_POST["cupon_id_departamento"] : "0");
        ///$parameters->cupon_code = isset($_GET["cupon_code"]) ? $_GET["cupon_code"] : (isset($_POST["cupon_code"]) ? $_POST["cupon_code"] : "");
        $parameters->img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "");
        if ($parameters->img != "") {
            if (valid_image($parameters->img) == 'false') {
                echo -1;
                break;
            }
        }
        $result = create_cupon($parameters);
        print json_encode($result);
        break;
    case'login_place_loc':
        $place_loc_id = isset($_GET["place_loc_id"]) ? $_GET["place_loc_id"] : (isset($_POST["place_loc_id"]) ? $_POST["place_loc_id"] : "0");
        $passkey = isset($_GET["passkey"]) ? $_GET["passkey"] : (isset($_POST["passkey"]) ? $_POST["passkey"] : "0");
        login_place_loc($place_loc_id, $passkey);
        break;
    case'login_personalized':
        $place_loc_id = isset($_GET["place_loc_id"]) ? $_GET["place_loc_id"] : (isset($_POST["place_loc_id"]) ? $_POST["place_loc_id"] : "0");
        $passkey = isset($_GET["passkey"]) ? $_GET["passkey"] : (isset($_POST["passkey"]) ? $_POST["passkey"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        login_place_loc($place_loc_id, $passkey, $place_id);
        break;
    case'insert_promo':
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $title = isset($_GET["title"]) ? $_GET["title"] : (isset($_POST["title"]) ? $_POST["title"] : "0");
        $description = isset($_GET["description"]) ? $_GET["description"] : (isset($_POST["description"]) ? $_POST["description"] : "0");
        $type = isset($_GET["type"]) ? $_GET["type"] : (isset($_POST["type"]) ? $_POST["type"] : "0");
        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        insert_promo($place_id, $img, $title, $description, $type);
        break;
    case'update_promo':
        $promo_id = isset($_GET["promo_id"]) ? $_GET["promo_id"] : (isset($_POST["promo_id"]) ? $_POST["promo_id"] : "0");
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $title = isset($_GET["title"]) ? $_GET["title"] : (isset($_POST["title"]) ? $_POST["title"] : "0");
        $description = isset($_GET["description"]) ? $_GET["description"] : (isset($_POST["description"]) ? $_POST["description"] : "0");
        $type = isset($_GET["type"]) ? $_GET["type"] : (isset($_POST["type"]) ? $_POST["type"] : "0");
        update_promo($promo_id, $img, $title, $description, $type);
        break;
    case'getPromos':
        $place_id = $_GET["place_id"];
        selectPromo($place_id);
        break;
    case'getFiltPromos':
        $filt = $_GET["filt"];
        getFiltPromos($filt);
        break;
    case'selectAllPromo':
        $place_id = $_GET["place_id"];
        selectAllPromo($place_id);
        break;
    case'select_ferby_promos':
        select_ferby_promos();
        break;
    case'delete_promo':
        $promo_id = isset($_GET["promo_id"]) ? $_GET["promo_id"] : (isset($_POST["promo_id"]) ? $_POST["promo_id"] : "0");
        delete_promotion($promo_id);
        break;
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//F  U  N  C  T  I  O  N       S  E  R  V  I  C  E  S
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    case 'Notification_placeid':
        $place_id = $_GET["place_id"];
        Notification_placeid($place_id);
        break;
    case 'massive_notifications_place':
        $place_id = $_GET["place_id"];
        $message = $_GET["message"];
        massive_notifications_place($place_id, $message);
        break;
    case 'massive_emails_place':
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        $message = isset($_GET["message"]) ? $_GET["message"] : (isset($_POST["message"]) ? $_POST["message"] : "0");
        $subject = isset($_GET["subject"]) ? $_GET["subject"] : (isset($_POST["subject"]) ? $_POST["subject"] : "0");
        $image = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $logo = isset($_GET["logo"]) ? $_GET["logo"] : (isset($_POST["logo"]) ? $_POST["logo"] : "0");
        massive_emails_place($place_id, $message, $image, $subject, $logo);
        break;

    case 'update_place_token':
        $parameters = new stdClass();
        $parameters->uuid = $_GET["uuid"];
        $parameters->token = $_GET["token"];
        $parameters->place_id = $_GET["place_id"];
        $parameters->platform = $_GET["platform"];
        echo update_place_token($parameters);
        break;

    case 'push_place_tokens':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->body = $_GET["body"];
        $parameters->title = $_GET["title"];
        echo push_place_tokens($parameters);
        break;

    case 'select_conv_bam':
        $store = isset($_GET["store"]) ? $_GET["store"] : (isset($_POST["store"]) ? $_POST["store"] : "");
        select_conv_bam($store);
        break;

    case 'sendCustomEmail':
        $email = isset($_GET["email"]) ? $_GET["email"] : (isset($_POST["email"]) ? $_POST["email"] : "0");
        $message = isset($_GET["message"]) ? $_GET["message"] : (isset($_POST["message"]) ? $_POST["message"] : "0");
        $name = isset($_GET["name"]) ? $_GET["name"] : (isset($_POST["name"]) ? $_POST["name"] : "0");
        $phone = isset($_GET["phone"]) ? $_GET["phone"] : (isset($_POST["phone"]) ? $_POST["phone"] : "0");
        sendCustomEmail($email, $message, $name, $phone);
        break;

    case 'getAllServices':
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        $tipo_menu = isset($_GET["tipo_menu"]) ? $_GET["tipo_menu"] : (isset($_POST["tipo_menu"]) ? $_POST["tipo_menu"] : "0");
        getAllServices($place_id, $tipo_menu);
        break;
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//C   H   A   T
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬   
    case 'getConversations':
        $user_id = $_GET["user_id"];
        getConversations($user_id);
        break;
    case 'getMessages':
        $conv_id = $_GET["conv_id"];
        getMessages($conv_id);
        break;
    case 'sendMessage':
        $message = $_GET["message"];
        $sender = $_GET["sender"];
        $id_conv = $_GET["id_conver"];
        sendMessage($message, $sender, $id_conv);
        break;
    case 'selectOnline':
        $place_loc_id = $_GET["place_loc_id"];
        selectOnline($place_loc_id);
        break;
    case 'startChat':
        $emitter = $_GET["emitter"];
        $receptor = $_GET["receptor"];
        startChat($emitter, $receptor);
        break;
    case 'updateOnlinePlace':
        $username = $_GET["username"];
        $value = $_GET["value"];
        updateOnlinePlace($username, $value);
        break;
    case 'updateLastSeen':
        $user_id = $_GET["user_id"];
        updateLastSeen($user_id);
        break;
    case 'deleteChat':
        $id_conv = $_GET["id_conver"];
        deleteChat($id_conv);
        break;
    case 'updateRead':
        $userID = $_GET["userID"];
        $id_conv = $_GET["id_conv"];
        updateRead($userID, $id_conv);
        break;
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//P  E  R  S  O  N  A  L  I  Z  E
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬  

 
    case 'set_rate_app_playstore':
        $parameters = new stdClass();
        $parameters->place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        $parameters->rate_app_playstore = isset($_GET["rate_app_playstore"]) ? $_GET["rate_app_playstore"] : (isset($_POST["rate_app_playstore"]) ? $_POST["rate_app_playstore"] : "");
        $result = set_rate_app_playstore($parameters);
        print json_encode($result);
        break;        

    case 'set_img_rate_app':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        $result = set_img_rate_app($img, $place_id);
        print json_encode($result);
        break;   

    case 'switch_show_rate_app':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->show_rate_app = $_GET["show_rate_app"];
        $result = switch_show_rate_app($parameters);
        print json_encode($result);
        break;    

    case 'set_rate_app_text':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->rate_app_text = $_GET["rate_app_text"];
        $result = set_rate_app_text($parameters);
        print json_encode($result);
        break;
 
    case 'set_subscription_link':
        $parameters = new stdClass();
        $parameters->place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        $parameters->subscription_link = isset($_GET["subscription_link"]) ? $_GET["subscription_link"] : (isset($_POST["subscription_link"]) ? $_POST["subscription_link"] : "");
        $result = set_subscription_link($parameters);
        print json_encode($result);
        break;        

    case 'set_img_subscription_link':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        $result = set_img_subscription_link($img, $place_id);
        print json_encode($result);
        break;   

    case 'switch_show_subscription_link':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->show_subscription_link = $_GET["show_subscription_link"];
        $result = switch_show_subscription_link($parameters);
        print json_encode($result);
        break;    

    case 'set_subscription_link_text':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->subscription_link_text = $_GET["subscription_link_text"];
        $result = set_subscription_link_text($parameters);
        print json_encode($result);
        break;


    case 'set_img_reservar':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        $result = set_img_reservar($img, $place_id);
        print json_encode($result);
        break;   
        
    case 'switch_show_reservar':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->show_reservar = $_GET["show_reservar"];
        $result = switch_show_reservar($parameters);
        print json_encode($result);
        break;             

    case 'set_help_link':
        $parameters = new stdClass();
        $parameters->place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        $parameters->help_link = isset($_GET["help_link"]) ? $_GET["help_link"] : (isset($_POST["help_link"]) ? $_POST["help_link"] : "");
        $result = set_help_link($parameters);
        print json_encode($result);
        break;        

    case 'set_img_help_link':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        $result = set_img_help_link($img, $place_id);
        print json_encode($result);
        break;   

    case 'switch_show_help_link':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->show_help_link = $_GET["show_help_link"];
        $result = switch_show_help_link($parameters);
        print json_encode($result);
        break;    


    case 'set_instagram_username':
        $parameters = new stdClass();
        $parameters->place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        $parameters->instagram_username = isset($_GET["instagram_username"]) ? $_GET["instagram_username"] : (isset($_POST["instagram_username"]) ? $_POST["instagram_username"] : "");
        $result = set_instagram_username($parameters);
        print json_encode($result);
        break;

    case 'set_img_instagram':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        $result = set_img_instagram($img, $place_id);
        print json_encode($result);
        break;         

    case 'switch_show_instagram':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->show_instagram = $_GET["show_instagram"];
        $result = switch_show_instagram($parameters);
        print json_encode($result);
        break;

    case 'set_img_track_orders':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        $result = set_img_track_orders($img, $place_id);
        print json_encode($result);
        break;

    case 'switch_show_track_orders':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->show_track_orders = $_GET["show_track_orders"];
        $result = switch_show_track_orders($parameters);
        print json_encode($result);
        break;   

    case 'set_redeem_name':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->redeem_name = $_GET["redeem_name"];
        $result = set_redeem_name($parameters);
        print json_encode($result);
        break;  
        
    case 'set_fcm_key':
        $parameters = new stdClass();
        $parameters->place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        $parameters->fcm_key = isset($_GET["fcm_key"]) ? $_GET["fcm_key"] : (isset($_POST["fcm_key"]) ? $_POST["fcm_key"] : "");
        $result = set_fcm_key($parameters);
        print json_encode($result);
        break;                    

    case 'insert_sale':
        $bill_id = $_GET["bill_id"];
        $qty = $_GET["qty"];
        insert_sale($qty, $bill_id);
        break;
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//O  P  T  I  O  N  S 
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    case 'get_options':
        $place_id = $_GET["place_id"];
        get_options($place_id);
        break;
    case 'set_option_param':
        $parameters = new stdClass();
        $parameters->cod_option = $_GET["cod_option"];
        $parameters->option_param = $_GET["option_param"];
        $result = set_option_param($parameters);
        print json_encode($result);
        break;
    case 'add_option':
        $parameters = new stdClass();
        $parameters->option_name = isset($_GET["option_name"]) ? $_GET["option_name"] : (isset($_POST["option_name"]) ? $_POST["option_name"] : "");
        $parameters->option_price = isset($_GET["option_price"]) ? $_GET["option_price"] : (isset($_POST["option_price"]) ? $_POST["option_price"] : "0");
        $parameters->option_param = isset($_GET["option_param"]) ? $_GET["option_param"] : (isset($_POST["option_param"]) ? $_POST["option_param"] : "");
        $parameters->menu_id = isset($_GET["menu_id"]) ? $_GET["menu_id"] : (isset($_POST["menu_id"]) ? $_POST["menu_id"] : "");
        $parameters->group = isset($_GET["group"]) ? $_GET["group"] : (isset($_POST["group"]) ? $_POST["group"] : "");
        $parameters->option_stock = isset($_GET["option_stock"]) ? $_GET["option_stock"] : (isset($_POST["option_stock"]) ? $_POST["option_stock"] : "0");
        $parameters->img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "");
        if ($parameters->img != "") {
            if (valid_image($parameters->img) == 'false') {
                echo -1;
                break;
            }
        }
        $result = add_option($parameters);
        print json_encode($result);
        break;
    case 'select_options':
        $place_id = $_GET["place_id"];
        select_options($place_id);
        break;
    case 'select_option':
        $id_menu = $_GET["id_menu"];
        select_option($id_menu);
        break;
    case 'update_option':
        $optionId = $_GET["optionId"];
        $name = $_GET["name"];
        $price = $_GET["price"];
        $group = $_GET["group"];
        $optionConv = $_GET["optionConv"];
        $inventory = $_GET["inventory"];
        update_option($name, $optionId, $group, $price, $optionConv, $inventory);
        break;
    case 'insert_option':
        $name = $_GET["name"];
        $price = $_GET["price"];
        $menu_id = $_GET["menu_id"];
        $group = $_GET["group"];
        $optionConv = $_GET["optionConv"];
        $inventory = $_GET["inventory"];
        insert_option($name, $menu_id, $group, $price, $optionConv,$inventory);
        break;
    case 'delete_option':
        $optionId = $_GET["optionId"];
        delete_option($optionId);
        break;
    case 'delete_menu_options':
        $menu_id = $_GET["menu_id"];
        delete_menu_options($menu_id);
        break;
    case 'insert_excel':
        $excel = $_GET["excel"];
        $menu_id = $_GET["menu_id"];
        $group = $_GET["group"];
        insert_excel($excel, $menu_id, $group);
        break;
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//I  M  A  G   E   S 
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    case 'insert_images':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $menu_id = isset($_GET["menu_id"]) ? $_GET["menu_id"] : (isset($_POST["menu_id"]) ? $_POST["menu_id"] : "0");
        $mylabel = isset($_GET["mylabel"]) ? $_GET["mylabel"] : (isset($_POST["mylabel"]) ? $_POST["mylabel"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        insert_galley_image($menu_id, $img, $mylabel);
        break;
     


    case 'set_img_shop':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        $result = set_img_shop($img, $place_id);
        print json_encode($result);
        break;

    case 'set_img_addon_puntos':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        $result = set_img_addon_puntos($img, $place_id);
        print json_encode($result);
        break;

    case 'set_img_addon_check_in':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        $result = set_img_addon_check_in($img, $place_id);
        print json_encode($result);
        break;

    case 'set_img_locations':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        $result = set_img_locations($img, $place_id);
        print json_encode($result);
        break;

    case 'set_img_coupons':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        $result = set_img_coupons($img, $place_id);
        print json_encode($result);
        break;

    case 'set_img_coupons':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        $result = set_img_coupons($img, $place_id);
        print json_encode($result);
        break;

    case 'set_img_promos':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        $result = set_img_promos($img, $place_id);
        print json_encode($result);
        break;

    case 'set_img_events':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        $result = set_img_events($img, $place_id);
        print json_encode($result);
        break;
        
    case 'set_promo_img':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        $result = set_promo_img($img, $place_id);
        print json_encode($result);
        break;

    case 'set_messenger_img':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        set_messenger_img($img, $place_id);
        break;

    case 'set_facebook_img':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        set_facebook_img($img, $place_id);
        break;

    case 'set_phone_img':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        set_phone_img($img, $place_id);
        break;

    case 'set_business_phone':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->business_phone = $_GET["business_phone"];
        set_business_phone($parameters);
        break;
    case 'set_name_app':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->name_app = $_GET["name_app"];
        set_name_app($parameters);
        break;
    case 'set_facebook_id':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->facebook_id = $_GET["facebook_id"];
        set_facebook_id($parameters);
        break;

    case 'set_business_logo':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        set_business_logo($img, $place_id);
        break;

    case 'switch_desk':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->desk_order = $_GET["desk_order"];
        switch_desk($parameters);
        break;

    case 'set_desk_text':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->desk_text = $_GET["desk_text"];
        set_desk_text($parameters);
        break;

    case 'set_desk_img':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        set_desk_img($img, $place_id);
        break;

    case 'switch_pick':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->pick_order = $_GET["pick_order"];
        switch_pick($parameters);
        break;

    case 'set_pick_text':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->pick_text = $_GET["pick_text"];
        set_pick_text($parameters);
        break;

    case 'set_pick_img':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        set_pick_img($img, $place_id);
        break;

    case 'switch_home':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->home_order = $_GET["home_order"];
        switch_home($parameters);
        break;

    case 'set_home_text':
        $parameters = new stdClass();
        $parameters->place_id = $_GET["place_id"];
        $parameters->home_text = $_GET["home_text"];
        set_home_text($parameters);
        break;

    case 'set_home_img':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        set_home_img($img, $place_id);
        break;


    case 'set_background_app':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        set_background_app($img, $place_id);
        break;
    case 'set_background1':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        set_background1($img, $place_id);
        break;
    case 'set_background2':
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");

        if (valid_image($img) == 'false') {
            echo -1;
            break;
        }
        set_background2($img, $place_id);
        break;
    case 'set_button_color_theme':
        $place_id = $_GET["place_id"];
        $button_color_theme = $_GET["button_color_theme"];
        set_button_color_theme($place_id, $button_color_theme);
        break;
    case 'set_home_square_color':
        $place_id = $_GET["place_id"];
        $home_square_color = $_GET["home_square_color"];
        set_home_square_color($place_id, $home_square_color);
        break;
    case 'select_images':
        $menu_id = isset($_GET["menu_id"]) ? $_GET["menu_id"] : (isset($_POST["menu_id"]) ? $_POST["menu_id"] : "0");
        select_galley_image($menu_id);
        break;
    case 'delete_images':
        $image_id = $_GET["image_id"];
        delete_galley_image($image_id);
        break;
    case 'select_image':
        $menu_id = $_GET["menu_id"];
        select_image($menu_id);
        break;
    case 'select_place_images':
        $place_id = $_GET["place_id"];
        select_place_images($place_id);
        break;
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//R  E  P  O  R  T  S
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    case 'cupon_redeems_report':
        $parameters = new stdClass();
        $parameters->place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        $result = cupon_redeems_report($parameters);
        print json_encode($result);
        break;
    case 'reporte_de_ventas':
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        reporte_de_ventas($place_id);
    break;
    case 'pointsTransactions':
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        pointsTransactions($place_id);
    break;
    case 'checkInsTransactions':
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        checkInsTransactions($place_id);
    break;

//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//Q  R       C   O   D   E   S 
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    case 'insert_qr_catalog' :
        $title = isset($_GET["title"]) ? $_GET["title"] : (isset($_POST["title"]) ? $_POST["title"] : "0");
        $desc = isset($_GET["desc"]) ? $_GET["desc"] : (isset($_POST["desc"]) ? $_POST["desc"] : "0");
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");

        insert_qr_catalog($title, $desc, $img, $place_id);
        break;

    case 'update_qr_catalog' :
        $title = isset($_GET["title"]) ? $_GET["title"] : (isset($_POST["title"]) ? $_POST["title"] : "0");
        $desc = isset($_GET["desc"]) ? $_GET["desc"] : (isset($_POST["desc"]) ? $_POST["desc"] : "0");
        $img = isset($_FILES["img"]) ? $_FILES["img"] : (isset($_FILES["img"]) ? $_FILES["img"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        $status = isset($_GET["status"]) ? $_GET["status"] : (isset($_POST["status"]) ? $_POST["status"] : "0");
        $reg_id = isset($_GET["reg_id"]) ? $_GET["reg_id"] : (isset($_POST["reg_id"]) ? $_POST["reg_id"] : "0");
        update_qr_catalog($title, $desc, $img, $place_id, $status, $reg_id);
        break;

    case 'delete_qr_catalog':
        $reg_id = isset($_GET["reg_id"]) ? $_GET["reg_id"] : (isset($_POST["reg_id"]) ? $_POST["reg_id"] : "0");
        delete_qr_catalog($reg_id);
        break;

    case 'select_qr_catalog':
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        select_qr_catalog($place_id);
        break;

    case 'select_logo_qr':
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        select_logo_qr($place_id);
        break;

    case 'select_prd_qr':
        $reg_id = isset($_GET["reg_id"]) ? $_GET["reg_id"] : (isset($_POST["reg_id"]) ? $_POST["reg_id"] : "0");
        select_prd_qr($reg_id);
        break;
 
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//E  V  E  N  T  O  S
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    case 'insert_new_ev_user':
        $name = isset($_GET["name"]) ? $_GET["name"] : (isset($_POST["name"]) ? $_POST["name"] : "0");
        insert_new_ev_user($name);
    break;

    case 'select_event_posts':
        $limit = isset($_GET["limit"]) ? $_GET["limit"] : (isset($_POST["limit"]) ? $_POST["limit"] : "0");
        select_event_posts($limit);
    break;

    case 'insert_post_img':
    $img = $_FILES["file"];
    $txt = isset($_GET["txt"]) ? $_GET["txt"] : (isset($_POST["txt"]) ? $_POST["txt"] : "0");
    $id = isset($_GET["id"]) ? $_GET["id"] : (isset($_POST["id"]) ? $_POST["id"] : "0");
    insert_post_img($img,$txt,$id);
    break;
    case 'insert_post_text':
    $txt = isset($_GET["txt"]) ? $_GET["txt"] : (isset($_POST["txt"]) ? $_POST["txt"] : "0");
    $id = isset($_GET["id"]) ? $_GET["id"] : (isset($_POST["id"]) ? $_POST["id"] : "0");
    insert_post_text($txt,$id);
    break;

    case "select_my_post":
    $id = isset($_GET["id"]) ? $_GET["id"] : (isset($_POST["id"]) ? $_POST["id"] : "0");
    select_my_post($id);
    break;

    case "delete_post":
    $id = isset($_GET["id"]) ? $_GET["id"] : (isset($_POST["id"]) ? $_POST["id"] : "0");
    delete_post($id);
    break;

    case 'love_post'://CONSUMIDO
    $parameters = new stdClass();
    $parameters->id = $_GET["id"];
    print love_post($parameters);
    break;  

    case 'dislove_post'://CONSUMIDO
    $parameters = new stdClass();
    $parameters->id = $_GET["id"];
    print dislove_post($parameters);
    break;  

//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//R  E  F  E  R  R  A  L  S
//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
case 'countReferidos'://CONSUMIDO
    $phoneNumber = isset($_GET["phoneNumber"]) ? $_GET["phoneNumber"] : (isset($_POST["phoneNumber"]) ? $_POST["phoneNumber"] : "0");
    countReferidos($phoneNumber);
    
    break; 
    case 'create_contacts_referred'://CONSUMIDO
        $uuid = isset($_GET["uuid"]) ? $_GET["uuid"] : (isset($_POST["uuid"]) ? $_POST["uuid"] : "0");
        $contact_username = isset($_GET["contact_username"]) ? $_GET["contact_username"] : (isset($_POST["contact_username"]) ? $_POST["contact_username"] : "0");
        $refnumber = isset($_GET["refnumber"]) ? $_GET["refnumber"] : (isset($_POST["refnumber"]) ? $_POST["refnumber"] : "0");
        $place_id = isset($_GET["place_id"]) ? $_GET["place_id"] : (isset($_POST["place_id"]) ? $_POST["place_id"] : "0");
        create_contacts_referred($uuid, $contact_username, $refnumber, $place_id);
    break; 
}