<?php
/**
 * Plugin Name: Groundworx Carousel
 * Description: A powerful and responsive carousel block built with Splide and Gutenberg.
 * Version: 1.0.1
 * Author: Johanne Courtright
 * Plugin URI: https://github.com/groundworx-dev/groundworx-carousel
 * Author URI: https://groundworx.dev 
 * Requires at least: 6.5
 * Tested up to: 6.8
 * Requires PHP: 8.2
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

defined( 'ABSPATH' ) || exit;

define( 'GROUNDWORX_CAROUSEL_VERSION', '1.0.0' );
define( 'GROUNDWORX_CAROUSEL_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'GROUNDWORX_CAROUSEL_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

class Groundworx_Carousel_Loader {

	/**
	 * Initialize the loader
	 */
	public static function init() {
		require_once GROUNDWORX_CAROUSEL_PLUGIN_DIR . 'inc/utils.php';
		add_action( 'init', [ __CLASS__, 'register_blocks' ], 5 );
	}

	/**
	 * Register all block.php files under build/blocks/*
	 */
	public static function register_blocks() {
		$block_paths = glob( GROUNDWORX_CAROUSEL_PLUGIN_DIR . 'build/blocks/**/block.php' );

		if ( $block_paths ) {
			foreach ( $block_paths as $block ) {
				if ( is_file( $block ) ) {
					require_once $block;
				}
			}
		}
	}

	/**
	 * Return array of all block paths by handle
	 */
	public static function get_blocks() {
		$blocks = [];
		$paths = glob( GROUNDWORX_CAROUSEL_PLUGIN_DIR . 'build/blocks/*' );

		foreach ( $paths as $block ) {
			$handle = basename( $block );
			$blocks[ $handle ] = $block;
		}

		return $blocks;
	}
}

Groundworx_Carousel_Loader::init();