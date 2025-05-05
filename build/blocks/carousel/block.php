<?php
/**
 * Server-side rendering of the `groundworx/carousel` block.
 *
 * @package WordPress
 */

class Groundworx_Carousel_Block {

	public function register() {
		add_action( 'init', [ $this, 'register_block' ] );
		add_filter( 'render_block', [ $this, 'filter_block_content' ], 10, 2 );
	}

	public function register_block() {
		register_block_type_from_metadata( __DIR__ );
	}

	public static function get_color_css_vars( $attributes ) {
		$css = '';

		$css .= self::get_css_var_color( $attributes['paginationColor'] ?? '', 			$attributes['customPaginationColor'] ?? '', 		'grx--color--pagination' );
		$css .= self::get_css_var_color( $attributes['arrowsColor'] ?? '',     			$attributes['customArrowsColor'] ?? '',     		'grx--color--arrows' );
		$css .= self::get_css_var_color( $attributes['arrowsBackgroundColor'] ?? '', 	$attributes['customArrowsBackgroundColor'] ?? '',   'grx--color--arrows-bg' );
		$css .= self::get_css_var_color( $attributes['progressColor'] ?? '',   			$attributes['customProgressColor'] ?? '',   		'grx--color--progress' );
		$css .= self::get_css_var_color( $attributes['counterColor'] ?? '',    			$attributes['customCounterColor'] ?? '',    		'grx--color--counter' );

		return $css;
	}

	private static function get_css_var_color( $preset, $custom, $var_name ) {
		if ( $preset ) {
			return "--{$var_name}: var(--wp--preset--color--{$preset});";
		}
		if ( $custom ) {
			return "--{$var_name}: {$custom};";
		}
		return '';
	}

	public function generate_grid_styles( $unique_classname, $breakpoints, $block_gap = null ) {
		$rules = [];
		$fallback_gap = 'var(--wp--style--block-gap, 0px)';
		$gap_value = $fallback_gap;

		if ( is_string( $block_gap ) ) {
			if ( ! preg_match( '%[\\(&=}]|/\*%', $block_gap ) ) {
				if ( str_starts_with( $block_gap, 'var:preset|spacing|' ) ) {
					$slug = substr( $block_gap, strrpos( $block_gap, '|' ) + 1 );
					$gap_value = 'var(--wp--preset--spacing--' . sanitize_title( $slug ) . ')';
				} else {
					$gap_value = $block_gap;
				}
			}
		} elseif ( is_array( $block_gap ) ) {
			$top = $block_gap['top'] ?? null;
			$left = $block_gap['left'] ?? null;
			$row = $fallback_gap;
			$column = $fallback_gap;

			if ( is_string( $top ) && ! preg_match( '%[\\(&=}]|/\*%', $top ) ) {
				if ( str_starts_with( $top, 'var:preset|spacing|' ) ) {
					$slug = substr( $top, strrpos( $top, '|' ) + 1 );
					$row = 'var(--wp--preset--spacing--' . sanitize_title( $slug ) . ')';
				} else {
					$row = $top;
				}
			}

			if ( is_string( $left ) && ! preg_match( '%[\\(&=}]|/\*%', $left ) ) {
				if ( str_starts_with( $left, 'var:preset|spacing|' ) ) {
					$slug = substr( $left, strrpos( $left, '|' ) + 1 );
					$column = 'var(--wp--preset--spacing--' . sanitize_title( $slug ) . ')';
				} else {
					$column = $left;
				}
			}

			$gap_value = ( $row === $column ) ? $row : "$row $column";
		}

		if ( $gap_value === 0 ) {
			$gap_value = '0px';
		}

		foreach ( $breakpoints as $breakpoint => $data ) {
			$breakpoint = Groundworx_Breakpoints::get( $breakpoint );
			if ( empty( $data['layout'] ) || $data['layout']['type'] !== 'grid' ) continue;

			$layout = $data['layout'];
			$declarations = [ 'gap' => $gap_value ];

			if ( ! empty( $layout['minimumColumnWidth'] ) ) {
				$declarations['grid-template-columns'] = sprintf(
					'repeat(auto-fill, minmax(min(%s, 100%%), 1fr))',
					$layout['minimumColumnWidth']
				);
				$declarations['container-type'] = 'inline-size';
			} elseif ( ! empty( $layout['columnCount'] ) ) {
				$declarations['grid-template-columns'] = sprintf(
					'repeat(%d, minmax(0, 1fr))',
					intval( $layout['columnCount'] )
				);
			}

			if ( ! empty( $data['sameHeight'] ) ) {
				$declarations['grid-auto-rows'] = 'minmax(0,1fr)';
			}

			$rules[$breakpoint] = [
				'rules_group'  => "@media (min-width: {$breakpoint})",
				'selector'     => ".{$unique_classname} > .splide:not(.is-active) .splide__list",
				'declarations' => $declarations,
			];
		}

		uksort( $rules, fn( $a, $b ) => intval( $a ) <=> intval( $b ) );

		$css = wp_style_engine_get_stylesheet_from_css_rules( $rules );
		if ( $css ) {
			$style_handle = wp_unique_id( 'groundworx-carousel-style-' );
			wp_register_style( $style_handle, false );
			wp_enqueue_style( $style_handle );
			wp_add_inline_style( $style_handle, $css );
		}
	}

	public function filter_block_content( $block_content, $block ) {
		if ( isset( $block['blockName'] ) && str_contains( $block['blockName'], 'groundworx/carousel' ) ) {
			$unique_classname = wp_unique_id( 'groundworx-' );
			$breakpoints = $block['attrs']['breakpoints'] ?? [];
			$block_gap = $block['attrs']['style']['spacing']['blockGap'] ?? null;

			$this->generate_grid_styles( $unique_classname, $breakpoints, $block_gap );

			$processor = new WP_HTML_Tag_Processor( $block_content );
			$processor->next_tag();
			$processor->add_class( $unique_classname );
			$block_content = $processor->get_updated_html();
		}
		return $block_content;
	}

	public static function render_html_attributes( array $attributes ): string {
		$output = '';
		foreach ( $attributes as $key => $value ) {
			if ( is_bool( $value ) ) {
				if ( $value ) $output .= sprintf( ' %s', esc_attr( $key ) );
				continue;
			}
			if ( $value !== null ) {
				$output .= sprintf( ' %s="%s"', esc_attr( $key ), esc_attr( $value ) );
			}
		}
		return $output;
	}
}

$groundworx_carousel_block = new Groundworx_Carousel_Block();
$groundworx_carousel_block->register();