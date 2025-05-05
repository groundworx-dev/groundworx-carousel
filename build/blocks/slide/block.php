<?php
/**
 * Server-side rendering of the `groundworx/slide` block.
 *
 * @package WordPress
 */

/**
 * Registers the `groundworx/slide` block on server.
 */

function register_block_groundworx_slide() {
	register_block_type_from_metadata(
		__DIR__
	);
}
add_action( 'init', 'register_block_groundworx_slide' );