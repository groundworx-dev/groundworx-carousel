<?php
defined( 'ABSPATH' ) || exit;

/**
 * Server-side rendering of the `groundworx/slide` block.
 *
 * @package WordPress
 */

/**
 * Registers the `groundworx/slide` block on server.
 */

function groundworx_carousel_register_block_slide() {
	register_block_type_from_metadata(
		__DIR__
	);
}
add_action( 'init', 'groundworx_carousel_register_block_slide' );