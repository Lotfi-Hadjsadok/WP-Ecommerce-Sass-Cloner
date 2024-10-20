<?php

/**
 * Ajax functions
 */

define('CLONER_WEBSITE_ID', 5);


add_action('wp_ajax_nopriv_register_user_as_subscriber', 'register_user_as_subscriber');
add_action('wp_ajax_register_user_as_subscriber', 'register_user_as_subscriber');
function register_user_as_subscriber()
{
    if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'subsite_registration')) {
        wp_send_json_error('Invalid nonce', 403);
        exit;
    }
    $email = sanitize_email($_POST['email']);
    $name = sanitize_text_field($_POST['display_name']);
    $phone = sanitize_text_field($_POST['phone']);
    $password = sanitize_text_field($_POST['password']);

    $existing_user_id = email_exists($email);

    if ($existing_user_id) {
        // User exists, retrieve the user ID
        $user_id = $existing_user_id;
        $user = new WP_User($user_id);
        wp_send_json_error(array(
            'message' => 'Cet email est déja utilisé',
        ));
    }


    $user_data = array(
        'user_login'    => $email,
        'user_pass'     =>  $password,
        'user_email'    => $email,
        'display_name'  => $name,
        'role'          => ''
    );

    $user_id = wp_insert_user($user_data);
    update_user_meta($user_id, 'phone', $phone);
    update_user_meta($user_id, 'client_registration_step', 2);

    // $rand = rand(100000, 999999);
    // update_user_meta($user_id, 'email_validation_code', $rand);

    switch_to_blog(1);
    $user = new WP_User($user_id);
    $user->set_role('subscriber');
    restore_current_blog();

    wp_set_auth_cookie($user_id, true);
    wp_send_json_success($user);
}



add_action('wp_ajax_create_subsite', 'create_subsite');
function create_subsite()
{
    if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'subsite_registration')) {
        wp_send_json_error('Invalid nonce', 403);
        exit;
    }

    $user = wp_get_current_user();
    $email = $user->user_email;
    $subdomain = sanitize_text_field($_POST['subdomain']) . '.';
    $title = sanitize_text_field($_POST['title']);


    $network = get_network();

    $data = array(
        'email' => $email,
        'domain' => $subdomain . $network->domain,
        'newdomain' => $subdomain . $network->domain,
        'path' => $network->path,
        'title' => $title,
        'from_site_id' => CLONER_WEBSITE_ID,
        'keep_users' => 0,
        'copy_files' => 'yes',
        'network_id' => 1,
        'public' => 1
    );

    $response = MUCD_Duplicate::duplicate_site($data);
    if (isset($response['error'])) {
        wp_send_json_error('Sous domaine déja utilisé.');
    } else {
        $site_id = $response['site_id'];
        switch_to_blog($site_id);
        $user = wp_get_current_user();
        $user_id = $user->ID;
        wp_set_current_user($user_id);
        wp_set_auth_cookie($user_id, true);
        do_action('wp_login', $user->user_login, $user);
        restore_current_blog();

        $end_date = date('Y-m-d H:i:s', strtotime('+7 days'));

        update_blog_option($site_id, 'cod_subscription_end_date', $end_date);


        remove_user_from_blog($user_id, 1);
        wp_send_json_success(
            array(
                'message' => 'Redirection vers ' . $subdomain . $network->domain,
                'url' => (is_ssl() ? 'https://' : 'http://') . $subdomain . $network->domain
            )
        );
    }
}


add_action('wp', function () {});
