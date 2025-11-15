import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps, BlockControls } from '@wordpress/block-editor';
import { getBlockType, createBlock, store as blocksStore } from '@wordpress/blocks';
import { useEffect, useRef, useState, cloneElement } from '@wordpress/element';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { useSelect, dispatch } from '@wordpress/data';

import Splide from '@splidejs/splide';

import { mountCounter, mountProgressBar } from './../utils/carousel'
import { ARROW_STYLES, PAGINATION_STYLES } from './../utils/carousel-ui';

import { useCarouselBreakpoint } from './hooks/utils';

function getResolvedOption(options, optionName) {
	const width = window.innerWidth;
	
	let value = options[optionName];
	
	if (options.breakpoints) {
		const sortedBreakpoints = Object.keys(options.breakpoints)
			.map(bp => parseInt(bp))
			.sort((a, b) => a - b);
		
		for (const bp of sortedBreakpoints) {
			if (width >= bp && options.breakpoints[bp] && options.breakpoints[bp][optionName] !== undefined) {
				value = options.breakpoints[bp][optionName];
			}
		}
	}
	
	return value;
}

function updateFeatureClasses(el, options) {
	if (!el || !options) return;
	
	const features = {
		'arrows': getResolvedOption(options, 'arrows'),
		'pagination': getResolvedOption(options, 'pagination'),
		'counter': getResolvedOption(options, 'counter'),
		'progressBar': getResolvedOption(options, 'progressBar')
	};
	
	Object.keys(features).forEach(feature => {
		const className = `splide--has-${feature.toLowerCase()}`;
		if (features[feature] === true) {
			el.classList.add(className);
		} else {
			el.classList.remove(className);
		}
	});
}

function forceEditorSafeOptions(splide) {
	const current = splide.options || {};
	const isLoop = current.type === 'loop';

	splide.options = {
		...current,
		clones: isLoop ? 1 : 0,
		drag: false,
		swipe: false,
		keyboard: false,
		autoplay: false,
		dragMinThreshold: 9999
	};
	
	if (isLoop && splide.root) {
		const clones = splide.root.querySelectorAll('.splide__slide--clone');
		clones.forEach((clone) => {
			clone.style.opacity = '0.5';
			clone.style.cursor = 'pointer';
			clone.style.pointerEvents = 'auto';
		});
	}
}

const DEFAULT_BLOCK = {
	name: 'groundworx/slide'
};

export default function SplideCarousel({ props = {} }) {
	const { attributes, clientId, name } = props;
	const { splideOptions } = attributes;

	const blockType = getBlockType(name);
	const carouselSupport = blockType?.supports?.groundworx?.carousel || {};
	const visibleBreakpoints = blockType?.supports?.groundworx?.breakpoints || [];

	const { canvasWidth, activeBreakpoint, resolvedOptions } = useCarouselBreakpoint(
		splideOptions,
		visibleBreakpoints
	);

	const [splideInstance, setSplideInstance] = useState(null);

	const blockProps = useBlockProps();

	const { hasSlideVariations } = useSelect( ( select ) => {
		const slideVariations = select( blocksStore ).getBlockVariations(
			'groundworx/slide',
			'inserter'
		);
		return {
			hasSlideVariations: slideVariations.length > 0,
		};
	}, [] );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		renderAppender: false,
		defaultBlock: DEFAULT_BLOCK,
		directInsert: ! hasSlideVariations,
		template: [ [ 'groundworx/slide' ] ],
		templateInsertUpdatesSelection: true,
		__unstableDisableLayoutClassNames: true,
		renderBlockWrapper: false,
		orientation: 'horizontal',
	} );

	const splideWrapperRef = useRef(null);
	const splideInstanceRef = useRef(null);
	const prevBreakpointsRef = useRef(null);
	const lastNavigatedIndexRef = useRef(-1);

	const { innerBlocks } = useSelect((select) => {
		const block = select('core/block-editor').getBlock(clientId);
		return {
			innerBlocks: block?.innerBlocks || []
		};
	}, [clientId]);

	const slides = (Array.isArray(innerBlocksProps.children) ? innerBlocksProps.children : [innerBlocksProps.children])
		.filter(Boolean)
		.map((child) => <>{cloneElement(child)}</>);
		
	const slideCountRef = useRef(slides.length);
	const slideContentRef = useRef(JSON.stringify(slides));

	useEffect(() => {
		const currentContent = JSON.stringify(slides);
		const contentChanged = slideContentRef.current !== currentContent;
		const countChanged = slideCountRef.current !== slides.length;

		if ((contentChanged || countChanged) && splideInstance) {
			slideContentRef.current = currentContent;
			slideCountRef.current = slides.length;
			
			setTimeout(() => {
				splideInstance.refresh();
			}, 100);
		}
	}, [slides, splideInstance]);

	const breakpointsChanged = (prev, current) => {
		if (!prev && !current) return false;
		if (!prev || !current) return true;
		return JSON.stringify(prev) !== JSON.stringify(current);
	};

	useEffect(() => {
		const el = splideWrapperRef.current;
		if (!el) return;

		const needsRemount = !splideInstanceRef.current || 
			breakpointsChanged(prevBreakpointsRef.current, resolvedOptions.breakpoints);

		if (needsRemount) {
			if (splideInstanceRef.current) {
				splideInstanceRef.current.destroy(true);
				splideInstanceRef.current = null;
			}

			const arrowStyle = attributes.arrowStyle || 'chevron';
			const arrowData = ARROW_STYLES[arrowStyle] || ARROW_STYLES.chevron;
			
			const splideOptionsWithArrow = {
				...resolvedOptions,
				arrowPath: arrowData.path
			};

			const splide = new Splide(el, splideOptionsWithArrow);
			
			splide.on('pagination:mounted', function (data) {
				const paginationStyle = el.dataset.pagination || 'circle';
				data.list.classList.add('splide__pagination--custom');

				data.items.forEach(function (item) {
					if (paginationStyle === 'number') {
						item.button.textContent = String(item.page + 1);
						return;
					}

					const style = PAGINATION_STYLES[paginationStyle] || PAGINATION_STYLES.circle;
					if (style && style.svg) {
						item.button.innerHTML = style.svg;
					}
				});
			});
			
			splide.on('mounted', () => {
				forceEditorSafeOptions(splide);
				mountCounter(splide, el);
				mountProgressBar(splide, el);
				updateFeatureClasses(el, resolvedOptions);
				setSplideInstance(splide);
			});

			splide.on('click', (e) => {
				lastNavigatedIndexRef.current = e.index;
				splide.go(e.index);
			});
			
			splide.mount();
			splideInstanceRef.current = splide;

			prevBreakpointsRef.current = resolvedOptions.breakpoints;
		} else {
			const splide = splideInstanceRef.current;
			if (splide && !splide.state.is(Splide.STATES.DESTROYED)) {
				const { breakpoints, ...otherOptions } = resolvedOptions;
				Object.assign(splide.options, otherOptions);
				forceEditorSafeOptions(splide);
				splide.refresh();

				mountCounter(splide, el);
				mountProgressBar(splide, el);
				updateFeatureClasses(el, resolvedOptions);
			}
		}

		return () => {
			if (splideInstanceRef.current) {
				splideInstanceRef.current.destroy(true);
				splideInstanceRef.current = null;
			}
		};
	}, [resolvedOptions]);

	useEffect(() => {
		if (splideInstanceRef.current && splideWrapperRef.current) {
			splideInstanceRef.current.destroy(true);
			splideInstanceRef.current = null;
			
			const el = splideWrapperRef.current;
			const arrowStyle = attributes.arrowStyle || 'chevron';
			const arrowData = ARROW_STYLES[arrowStyle] || ARROW_STYLES.chevron;
			
			const splideOptionsWithArrow = {
				...resolvedOptions,
				arrowPath: arrowData.path
			};
			
			const splide = new Splide(el, splideOptionsWithArrow);
			
			splide.on('pagination:mounted', function (data) {
				const paginationStyle = el.dataset.pagination || 'circle';
				data.list.classList.add('splide__pagination--custom');

				data.items.forEach(function (item) {
					if (paginationStyle === 'number') {
						item.button.textContent = String(item.page + 1);
						return;
					}

					const style = PAGINATION_STYLES[paginationStyle] || PAGINATION_STYLES.circle;
					if (style && style.svg) {
						item.button.innerHTML = style.svg;
					}
				});
			});
			
			splide.on('mounted', () => {
				forceEditorSafeOptions(splide);
				mountCounter(splide, el);
				mountProgressBar(splide, el);
				updateFeatureClasses(el, resolvedOptions);
				setSplideInstance(splide);
			});

			splide.on('click', (e) => {
				lastNavigatedIndexRef.current = e.index;
				splide.go(e.index);
			});
			
			splide.mount();
			splideInstanceRef.current = splide;
		}
	}, [attributes.arrowStyle, attributes.paginationStyle]);

	useEffect(() => {
		const el = splideWrapperRef.current;
		if (!el) return;
	
		const handleClick = (event) => {
			const block = wp.data.select('core/block-editor').getBlock(clientId);
			if (!block?.innerBlocks?.length) return;
	
			const clickedSlide = event.target.closest('.splide__slide');
			if (!clickedSlide) return;
			
			if (clickedSlide.classList.contains('splide__slide--clone')) {
				const cloneBlockId = clickedSlide.getAttribute('data-block');
				
				if (cloneBlockId) {
					const realBlock = block.innerBlocks.find(inner => inner.clientId === cloneBlockId);
					if (realBlock) {
						dispatch('core/block-editor').selectBlock(cloneBlockId);
						event.stopPropagation();
						return;
					}
				}
			}
			
			const slideElements = Array.from(el.querySelectorAll('.splide__slide:not(.splide__slide--clone)'));
			if (!slideElements.includes(clickedSlide)) {
				dispatch('core/block-editor').selectBlock(clientId);
				return;
			}
		};
	
		el.addEventListener('click', handleClick, true);
		return () => el.removeEventListener('click', handleClick, true);
	}, [clientId]);

	useEffect(() => {
		if (!splideInstance) return;

		const unsubscribe = wp.data.subscribe(() => {
			const carouselBlock = wp.data.select('core/block-editor').getBlock(clientId);
			if (!carouselBlock?.innerBlocks?.length) return;

			const selectedIndex = carouselBlock.innerBlocks.findIndex(child =>
				wp.data.select('core/block-editor').isBlockSelected(child.clientId)
			);

			if (selectedIndex >= 0 && selectedIndex !== lastNavigatedIndexRef.current) {
				lastNavigatedIndexRef.current = selectedIndex;
				
				const listViewOpen = !!document.querySelector('.block-editor-list-view');
				
				if (listViewOpen && splideInstance.options.type === 'loop') {
					splideInstance.options.type = 'slide';
					splideInstance.options.rewind = true;
					splideInstance.refresh();
					
					setTimeout(() => {
						splideInstance.go(selectedIndex);
					}, 50);
				} else {
					splideInstance.go(selectedIndex);
					
					setTimeout(() => {
						splideInstance.refresh();
					}, 100);
				}
			}
		});

		return () => {
			unsubscribe();
		};
	}, [splideInstance, clientId]);

	const splideBlockProps = {
		ref: splideWrapperRef,
		className: 'splide',
		'aria-label': __('Carousel Preview', 'groundworx-carousel'),
		'data-arrow': attributes.arrowStyle || 'chevron',
		'data-pagination': attributes.paginationStyle || 'circle',
	};

	return (
		<>
			<BlockControls>
				<ToolbarGroup label={__('Slides', 'groundworx-carousel')}>
					<ToolbarButton
						variant="primary"
						label={__('Add Slide to Carousel', 'groundworx-carousel')}
						onClick={() => {
							const newSlide = createBlock('groundworx/slide');
							dispatch('core/block-editor').insertBlock(newSlide, innerBlocks.length, clientId);
						}}
					>
						{__('Add Slide', 'groundworx-carousel')}
					</ToolbarButton>
				</ToolbarGroup>
			</BlockControls>
			<div {...splideBlockProps}>
				<div class="splide__wrapper">
					<div class="splide__arrows" />
					<ul class="splide__pagination" />
					<div className="splide__track">
						<ul className="splide__list">
							{slides}
						</ul>
					</div>
				</div>
			</div>
		</>
	);
}