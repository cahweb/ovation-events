<?php
/**
 * Plugin Name: Ovation Events Widget
 * Description: A widget for displaying ticketed events from OvationTix for the UCF CAH School of Performing Arts, in a variety of configurations.
 * Author: Mike W. Leavitt
 * Version: 1.0.0
 * 
 * @author Mike W. Leavitt
 * @version 1.0.0
 */

// Define some constants
define( 'SPA_EVENTS__VERSION', '1.0.1' );
define( 'SPA_EVENTS__PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'SPA_EVENTS__PLUGIN_DIR_URL', plugin_dir_url( __FILE__ ) );

// Require the file with most of our logic.
require_once 'includes/class-spa-events-setup.php';

// Register activation and deactivation hooks. In the SPA_Events_Setup
// object, those are both empty, but they might not always be.
register_activation_hook( __FILE__, array( "SPA_Events_Setup", 'activate' ) );
register_deactivation_hook( __FILE__, array( "SPA_Events_Setup", 'deactivate' ) );

// Add the setup action to the plugins_loaded WordPress hook.
add_action( 'plugins_loaded', array( 'SPA_Events_Setup', 'setup' ), 10, 0 );
?>