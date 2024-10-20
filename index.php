<?php

/**
 * Plugin Name: Client Registration
 * Plugin URI:  https://www.facebook.com/lotfihadjsadok.dev
 * Author: Lotfi Hadjsadok
 * Author URI: https://www.facebook.com/lotfihadjsadok.dev
 * Description: Client registration for CODPower.
 * Version:     0.1.1
 */



require_once plugin_dir_path(__FILE__) . 'cloner/multisite-clone-duplicator.php';
require_once plugin_dir_path(__FILE__) . 'cloner/lib/duplicate.php';

require_once plugin_dir_path(__FILE__) . 'inc/ajax-functions.php';

add_action('wp_enqueue_scripts', 'client_registration_scripts', 10);

function client_registration_scripts()
{
    wp_enqueue_script('client_registration_script', plugin_dir_url(__FILE__) . '/build/index.js', [], false, true);
    $step = get_user_meta(get_current_user_id(), 'client_registration_step', true);
    wp_localize_script('client_registration_script', 'RegisterScript', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce'    => wp_create_nonce('subsite_registration'),
        'step'    =>  $step
    ));
}


add_shortcode('client_registration', 'client_registration_display');

function client_registration_display()
{
    return '<div id="registration-wizard"></div>';
}




add_action('after_setup_theme', 'remove_admin_bar');
function remove_admin_bar()
{
    if (!current_user_can('administrator') && !is_admin()) {
        show_admin_bar(false);
    }
}


add_action('wp', 'subscription_ended');
function subscription_ended()
{
    $subscription_end_date = get_option('cod_subscription_end_date');
    if ($subscription_end_date && date('Y-m-d H:i:s') >= $subscription_end_date) {
        die('ended');
    }
}
