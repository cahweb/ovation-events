<?php
/**
 * A class intended to set-up the SPA Events Widget plugin and get everything registered.
 * 
 * @author Mike W. Leavitt
 * @version 1.0.0
 */

ini_set('display_errors', 1);

if( !class_exists( 'SPA_Events_Setup' ) ) {
    class SPA_Events_Setup
    {
        // Set the version number, which we'll use when registering
        // scripts
        private static $plugin_name = "ovation_events", $plugin_version = SPA_EVENTS__VERSION;

        private function __construct() {} // Prevents instantiation


        /**
         * Adds the various actions and things we'll need to get the
         * plugin's functionality working properly
         *
         * @return void
         */
        public static function setup()
        {
            self::_register_shortcode();

            // Registers the scripts/styles. I attached this to the
            // wp_loaded hook rather than wp_enqueue_scripts because
            // I was running into problems with execution order--
            // WordPress would try to enqueue my script before it was
            // registered.
            add_action( 'wp_loaded', array( __CLASS__, 'register_scripts' ), 10, 0 );

            // Adds my conditional script load function (defined below)
            add_action( 'the_posts', array( __CLASS__, 'maybe_load_scripts' ), 10, 1 );
        }


        /**
         * Called when the plugin is activated. Empty for now.
         *
         * @return void
         */
        public static function activate()
        {
            return;
        }

        /**
         * Called when the plugin is deactivated. Empty for now.
         *
         * @return void
         */
        public static function deactivate()
        {
            return;
        }


        /**
         * Checks through the posts in the current page's WP_Query for
         * any instances of our defined shortcode, and loads our scripts
         * and styles if it finds at least one. This keeps the scripts
         * from being loaded unnecessarily, on every page.
         *
         * @param array $posts  The posts in the WP_Query global object
         * 
         * @return void
         */
        public static function maybe_load_scripts( $posts = array() )
        {
            foreach( $posts as $post ) {
                if( stripos( $post->post_content, '[ovation' ) !== false ) {
                    self::_load_scripts();
                    self::_load_styles();
                    break; // If it's there once, that's all we need, so we'll break out.
                }
            }

            return $posts;
        }


        /**
         * Handles our shortcode, so WordPress knows what to do with it.
         *
         * @param array $atts The attributes from the shortcode.
         * 
         * @return string The HTML to replace the shortcode with.
         */
        public static function events_shortcode( $atts = array() ) : string
        {
            // Extract the shortcode attributes to their own variables
            // and set defaults
            $data = shortcode_atts( array(
                    'format' => 'card',
                    'blurb' => 'false',
                    'filter' => 'theatre music gallery celebrates visual'
                ), $atts);

            $data['blurb'] = $data['blurb'] == 'true' ? true : false;

            $data['filter'] = explode( ' ', $data['filter'] );

            $ref = array(
                'theatre' => 'Theatre UCF',
                'music' => 'UCF Music',
                'gallery' => 'UCF Art Gallery',
                'celebrates' => 'UCF Celebrates',
                'visual' => 'Visual Arts'
            );

            $filter = array();
            foreach( $data['filter'] as $keyword ) {
                $filter[] = $ref[$keyword];
            }

            if( in_array( 'visual', $data['filter'] ) && !in_array('gallery', $data['filter'] ) ) {
                $filter[] = $ref['gallery'];
            }

            $data['filter'] = $filter;

            // Return the output of our HTML generating function
            return self::_vue_app_base( $data );
        }


        /**
         * Register our JavaScript and CSS files.
         *
         * @return void
         */
        public static function register_scripts()
        {
            // Storing the plugin name and the version, for less verbose
            // and repetitive typing.
            $name = self::$plugin_name;
            $ver = self::$plugin_version;

            // Register Axios, which we us in the script itself.
            wp_register_script( 'axios', 'https://unpkg.com/axios/dist/axios.min.js', array(), '', true );

            // Register the Vue chunk JS file (which I think acts kind of)
            // like a header file, of sorts, for the Vue stuff that soon
            // will exist. Listing Axios as a dependency
            wp_register_script( "${name}_chunk", SPA_EVENTS__PLUGIN_DIR_URL . 'dist/js/chunk_events-widget.js', array( 'axios' ), $ver, true );

            // Register the main JS script which does all the heavy
            // lifting. List the chunk file as a dependency.
            wp_register_script( "${name}_main", SPA_EVENTS__PLUGIN_DIR_URL . 'dist/js/events-widget.js', array( "${name}_chunk" ), $ver, true );

            // Register the app's CSS sheet.
            wp_register_style( "${name}_style", SPA_EVENTS__PLUGIN_DIR_URL . 'dist/css/events-widget.css', array(), $ver, 'all' );
        }


        /**
         * Handles adding the shortcode and telling it which
         * function to use to handle it.
         * 
         * Yes, I could have done this as easily in 
         * SPA_Event_Setup::setup(), but I didn't. Deal with it. B|
         *
         * @return void
         */
        private static function _register_shortcode()
        {
            add_shortcode( 'ovation', array( __CLASS__, 'events_shortcode') );
        }


        /**
         * Generates the HTML that will take the place of our shortcode.
         *
         * @return string
         */
        private static function _vue_app_base( array $data ) : string
        {
            // Start an output buffer, because I hate giant stacks of
            // echo statements.
            ob_start();
            ?>

            <input type="hidden" id="vueOptions" value="<?= htmlentities( json_encode( $data ) ) ?>">
            <div id="vueApp"></div>
            
            <?php
            return ob_get_clean(); // Return the buffered HTML
        }


        /**
         * Load our scripts. 
         * 
         * Called from SPA_Events_Setup::maybe_load_scripts().
         *
         * @return void
         */
        private static function _load_scripts()
        {
            // The plugin name, for the sake of brevity.
            $name = self::$plugin_name;

            // Enqueue our main script. Because of the dependencies we
            // listed when we registered them, we only need to call this
            // one, and the others will be loaded first.
            wp_enqueue_script( "${name}_main" );

            // Pass some data to our front-end JavaScript
            wp_localize_script( "${name}_main", 'wpVars',
                array(
                    // The URL for admin-ajax.php
                    'ajaxUrl' => admin_url( 'admin-ajax.php' ),
                    // Our nonce, for security's sake
                    'security' => wp_create_nonce( 'spa-events-ajax' )
                )
            );
        }


        /**
         * Load our stylesheet.
         * 
         * Called from SPA_Events_Setup::maybe_load_scripts().
         *
         * @return void
         */
        private static function _load_styles()
        {
            // Enqueue the style.
            wp_enqueue_style( self::$plugin_name . "_style" );
        }
    }
}
?>