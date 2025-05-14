/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import variations from './variations';
import example from './example';

import { Icon } from '@wordpress/icons';
const carousel = (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
		<g>
			<path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.5" d="M13.67,18.07H9.73c-0.71,0-1.28-0.57-1.28-1.28V7.85c0-0.71,0.57-1.28,1.28-1.28h3.94
				c0.71,0,1.28,0.57,1.28,1.28v8.94C14.95,17.5,14.38,18.07,13.67,18.07z"/>
			<path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.5" d="M8.45,16.57H5.23c-0.71,0-1.28-0.57-1.28-1.28V9.35c0-0.71,0.57-1.28,1.28-1.28h3.22V16.57z"/>
			<path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.5" d="M18.17,16.57h-3.22v-8.5h3.22c0.71,0,1.28,0.57,1.28,1.28v5.94C19.45,16,18.88,16.57,18.17,16.57z"/>
		</g>
	</svg>
);
	
import './style.scss';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */

registerBlockType( metadata.name, {
	icon: <Icon icon={ carousel } />, 

	/**
	 * @see ./edit.js
	 */
	edit: Edit,
	/**
	 * @see ./save.js
	 */
	save,
	variations,
	example
} );
