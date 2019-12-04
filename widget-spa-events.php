<?php
/**
 * Plugin Name: SPA Events Widget
 * Description: A widget for displaying ticketed events from OvationTix for the UCF CAH School of Performing Arts, in a variety of configurations.
 * Author: Mike W. Leavitt
 * Version: 0.0.1
 * 
 * @author Mike W. Leavitt
 * @version 1.0.0
 */

define( 'SPA_EVENTS__VERSION', '1.0.0' );
define( 'SPA_EVENTS__PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'SPA_EVENTS__PLUGIN_DIR_URL', plugin_dir_url( __FILE__ ) );

session_start();

require_once 'includes/class-spa-events-setup.php';

register_activation_hook( __FILE__, array( "SPA_Events_Setup", 'activate' ) );
register_deactivation_hook( __FILE__, array( "SPA_Events_Setup", 'deactivate' ) );

add_action( 'plugins_loaded', array( 'SPA_Events_Setup', 'setup' ), 10, 0 );
?>