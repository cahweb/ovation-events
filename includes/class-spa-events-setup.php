<?php
/**
 * A class intended to set-up the SPA Events Widget plugin and get everything registered.
 * 
 * @author Mike W. Leavitt
 * @version 1.0.0
 */

if( !class_exists( 'SPA_Events_Setup' ) ) {
    class SPA_Events_Setup
    {
        private static $plugin_name = "spa_events", $plugin_version = SPA_EVENTS__VERSION;

        private function __construct() {} // Prevents instantiation


        public static function setup()
        {
            self::_register_shortcode();

            add_action( 'wp_ajax_spa_events', array( __CLASS__, 'handle_ajax' ), 10, 0 );
            add_action( 'wp_ajax_nopriv_spa_events', array( __CLASS__, 'handle_ajax' ), 10, 0 );
            add_action( 'wp_loaded', array( __CLASS__, 'register_scripts' ), 10, 0 );
            add_action( 'the_posts', array( __CLASS__, 'maybe_load_scripts' ), 10, 1 );
        }


        public static function activate()
        {
            return;
        }

        
        public static function deactivate()
        {
            return;
        }


        public static function maybe_load_scripts( $posts = array() )
        {
            foreach( $posts as $post ) {
                if( stripos( $post->post_content, '[spa_events' ) !== false ) {
                    self::_load_scripts();
                    self::_load_styles();
                    break; // If it's there once, that's all we need, so we'll break out.
                }
            }

            return $posts;
        }


        public static function events_shortcode( $atts = array() ) : string
        {
            extract( shortcode_atts( array(
                    'format' => 'card',
                    'title' => 'Upcoming Events'
                ), $atts)
            );

            $_SESSION['format'] = $format;
            $_SESSION['app-heading'] = $title;

            return self::_vue_app_base();
        }


        public static function handle_ajax()
        {
            check_ajax_referer( 'spa-events-ajax', 'nonce' );

            $response = array();

            if( isset( $_SESSION['format'] ) && !empty( $_SESSION['format'] ) ) {
                $format = $_SESSION['format'];
                $response['format'] = $format;
            }
            if( isset( $_SESSION['app-heading'] ) && !empty( $_SESSION['app-heading'] ) ) {
                $appHeading = $_SESSION['app-heading'];
                $response['appHeading'] = $appHeading;
            }

            if( ( !isset( $_SESSION['format'] ) && !isset( $_SESSION['app-heading'] ) ) || ( empty( $_SESSION['format'] ) && emtpy( $_SESSION['app-heading'] ) ) ) {
                $response['code'] = -1;
                $response['error'] = "A server error occurred.";
            }
            else {
                $response['code'] = 1;
            }

            echo json_encode( $response );

            die();
        }


        public static function register_scripts()
        {
            $name = self::$plugin_name;
            $ver = self::$plugin_version;

            wp_register_script( 'axios', 'https://unpkg.com/axios/dist/axios.min.js', array(), '', true );

            wp_register_script( "${name}_chunk", SPA_EVENTS__PLUGIN_DIR_URL . 'dist/js/chunk_events-widget.js', array( 'axios' ), $ver, true );
            wp_register_script( "${name}_main", SPA_EVENTS__PLUGIN_DIR_URL . 'dist/js/events-widget.js', array( "${name}_chunk" ), $ver, true );

            wp_register_style( "${name}_style", SPA_EVENTS__PLUGIN_DIR_URL . 'dist/css/events-widget.css', array(), $ver, 'all' );
        }


        private static function _register_shortcode()
        {
            add_shortcode( 'spa_events', array( __CLASS__, 'events_shortcode') );
        }


        private static function _vue_app_base() : string
        {

            ob_start();
            ?>

            <div id="vueApp"></div>

            <?php
            return ob_get_clean();
        }


        private static function _load_scripts()
        {
            $name = self::$plugin_name;

            wp_enqueue_script( "${name}_main" );

            wp_localize_script( "${name}_main", 'wpVars',
                array(
                    'ajaxUrl' => admin_url( 'admin-ajax.php' ),
                    'security' => wp_create_nonce( 'spa-events-ajax' )
                )
            );
        }


        private static function _load_styles()
        {
            wp_enqueue_style( self::$plugin_name . "_style" );
        }
    }
}
?>