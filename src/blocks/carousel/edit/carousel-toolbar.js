import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { arrowLeft, arrowRight } from '@wordpress/icons';
import { useDispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

const CarouselToolbar = ({ clientId, instance, currentIndex }) => {
	const { insertBlock } = useDispatch(blockEditorStore);

	const slides = instance?.Components?.Slides?.get?.({ excludeClones: true }) ?? [];
	const totalSlides = slides.length;
	const shouldRenderSplideNav = totalSlides > 0;

	const goToSlide = (index) => {
		if (!instance || !slides[index]) return;

		instance.go(index);

		// Sync block selection
		const blockOrder = wp.data.select(blockEditorStore).getBlockOrder(clientId);
		const targetBlockId = blockOrder[index];
		if (targetBlockId) {
			wp.data.dispatch(blockEditorStore).selectBlock(targetBlockId);
		}
	};

	const addSlide = () => {
		const newSlide = createBlock('groundworx/slide');
		insertBlock(newSlide, totalSlides, clientId);
	};

	return (
		<>
			<ToolbarGroup label={__('Slides')}>
				{shouldRenderSplideNav && (
					<>
						<ToolbarButton
							icon={arrowLeft}
							label={__('Previous Slide')}
							onClick={() => goToSlide(Math.max(0, currentIndex - 1))}
							disabled={currentIndex <= 0}
						/>
						{slides.map((_, index) => (
							<ToolbarButton
								key={index}
								isPressed={index === currentIndex}
								label={__('Slide %d').replace('%d', index + 1)}
								onClick={() => goToSlide(index)}
							>
								{index + 1}
							</ToolbarButton>
						))}
						<ToolbarButton
							icon={arrowRight}
							label={__('Next Slide')}
							onClick={() => goToSlide(Math.min(totalSlides - 1, currentIndex + 1))}
							disabled={currentIndex >= totalSlides - 1}
						/>
					</>
				)}
				<ToolbarButton
					variant="primary"
					label={__('Add Slide to Carousel')}
					onClick={addSlide}
				>
					{__('Add Slide')}
				</ToolbarButton>
			</ToolbarGroup>
		</>
	);
};

export default CarouselToolbar;
