<?php
defined( 'ABSPATH' ) || exit;
$template     			= $attributes['template'] ?? "default";

$style = Groundworx_Carousel_Block::get_color_css_vars( $attributes );

$wrapper_attributes = get_block_wrapper_attributes([
	'class' => "template-{$template}",
	'style' => $style
]);

$unique_id = wp_unique_id( 'splide-' );
$options = $attributes['splideOptions'] ?? [];

$block_type     = WP_Block_Type_Registry::get_instance()->get_registered( $block->name );
$carousel_support = $block_type->supports['groundworx']['carousel'] ?? [];

$arrow_style = $carousel_support['arrowStyle'] ?? '';
$pagination_style = $attributes['paginationStyle'] ?? $carousel_support['paginationStyle'] ?? 'circle';

$data_attrs = [
	'id'              => $unique_id,
	'class'           => 'splide',
	'aria-label'      => 'Interactive content',
	'data-splide'     => wp_json_encode( $options ),
	'data-arrow'      => $arrow_style ?? null,
	'data-pagination' => $pagination_style ?? null,
];
?>

<section <?php echo $wrapper_attributes; ?>>
	<div <?php echo Groundworx_Carousel_Block::render_html_attributes( $data_attrs ); ?>>
		<div class="splide__wrapper">
			<div class="splide__arrows"></div>
			<ul class="splide__pagination"></ul>
		
			<div class="splide__track">
				<ul class="splide__list">
					<?php 
					foreach ( $block->inner_blocks as $inner_block ) {
						echo wp_kses_post( $inner_block->render() );
					}
					?>
				</ul>
			</div>
		</div>
	</div>
</section>
