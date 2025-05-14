import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps, store as blockEditorStore } from '@wordpress/block-editor';
import { useEffect, useRef, useState, cloneElement } from '@wordpress/element';
import { useSelect, dispatch } from '@wordpress/data';
import { getBlockType } from '@wordpress/blocks';
import { store as blocksStore } from '@wordpress/blocks';

import Splide from '@splidejs/splide';
import { getBreakpoints } from '@groundworx/utils';

import { mountCounter, mountProgressBar, mountArrowPath } from './../utils/carousel'
import { PAGINATION_SHAPES } from './../utils/carousel-ui';
import CarouselToolbar from './carousel-toolbar';

// Helpers
function getEditorCanvasWidth() {
	const iframe = document.querySelector('iframe[name="editor-canvas"]');
	return iframe?.contentDocument?.body?.getBoundingClientRect().width || window.innerWidth;
}

function getEditorAdjustment() {
	return window.innerWidth - getEditorCanvasWidth();
}

function resolveBreakpoints(options = {}, mapBreakpoints = null) {
	if (!options.breakpoints) return options;
	const resolvedBreakpoints = {};

	for (const key in options.breakpoints) {
		let breakpointValue = getBreakpoints.resolve(key);
		if (typeof mapBreakpoints === 'object' && mapBreakpoints[key] !== undefined) {
			breakpointValue = parseInt(mapBreakpoints[key]);
		} else if (typeof mapBreakpoints === 'function') {
			breakpointValue = parseInt(mapBreakpoints(key, breakpointValue));
		}
		if (!isNaN(breakpointValue)) {
			resolvedBreakpoints[breakpointValue] = options.breakpoints[key];
		}
	}

	return { ...options, breakpoints: resolvedBreakpoints };
}

function createForcedOptions(splideOptions, adjustment = 0) {
	return {
		...splideOptions,
		breakpoints: resolveBreakpoints(splideOptions, getBreakpoints.all(adjustment)).breakpoints,
	};
}

// Force Editor Safe Options
function forceEditorSafeOptions(splide) {
	const current = splide.options || {};

	splide.options = {
		...current,
		type: current.type === 'loop' || current.type === 'fade' ? 'slide' : current.type,
		drag: false,
		swipe: false,
		clones: 0,
		keyboard: false,
		autoplay: false,
		dragMinThreshold: 9999
	};
}

const DEFAULT_BLOCK = {
	name: 'groundworx/slide'
};

// Main Component
export default function SplideCarousel({ props = {} }) {
	const { attributes, clientId, name, isSelected } = props;
	const { splideOptions } = attributes;

	const blockType = getBlockType(name);
	const carouselSupport = blockType?.supports?.groundworx?.carousel || {};

	const [currentIndex, setCurrentIndex] = useState(0);
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

	const slides = (Array.isArray(innerBlocksProps.children) ? innerBlocksProps.children : [innerBlocksProps.children])
		.filter(Boolean)
		.map((child) => <>{cloneElement(child)}</>);

	// Mount Splide
	useEffect(() => {
		const el = splideWrapperRef.current;
		if (!el) return;

		const adjustment = getEditorAdjustment();

		const initialOptions = createForcedOptions(attributes.splideOptions, adjustment);
		
		if (!splideInstanceRef.current) {
			const splide = new Splide(el, initialOptions);
			splideInstanceRef.current = splide;

			splide.on('mounted', () => {
				forceEditorSafeOptions(splide);
			});
			
			splide.mount();
			
		} else {
			splideInstanceRef.current.refresh();
		}

		const list = el.querySelector('.splide__list');
		const observer = list ? new MutationObserver((mutationsList) => {
			let addedSlideNode = null;

			for (const mutation of mutationsList) {
				for (const node of mutation.addedNodes) {
					if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('splide__slide')) {
						addedSlideNode = node;
						break;
					}
				}
				if (addedSlideNode) break;
			}

			if (addedSlideNode && splideInstanceRef.current) {
				const slides = Array.from(list.querySelectorAll('.splide__slide'));
				const newIndex = slides.indexOf(addedSlideNode);

				splideInstanceRef.current.refresh();
			}
		}) : null;

		if (observer && list) {
			observer.observe(list, { childList: true });
		}

		// Clean up
		return () => {
			if (observer) observer.disconnect();
		};

	}, []);

	function createAndMountSplide(el, attributes, adjustment = 0) {
		const options = createForcedOptions(attributes.splideOptions, adjustment);
		const splide = new Splide(el, options);
		
		splide.on('pagination:mounted', function (data) {
			const paginationStyle = el.dataset.pagination || 'circle';
			data.list.classList.add('splide__pagination--custom');

			data.items.forEach(function (item) {
				if (paginationStyle === 'number') {
					item.button.textContent = String(item.page + 1);
					return;
				}

				item.button.innerHTML = PAGINATION_SHAPES[paginationStyle] || PAGINATION_SHAPES.circle;
			});
		});
		
		splide.on('move', (newIndex) => {
			setCurrentIndex(newIndex);
		});

		splide.on('mounted', () => {
			forceEditorSafeOptions(splide);
			mountArrowPath(splide, el);
			mountCounter(splide, el);
			mountProgressBar(splide, el);
			setSplideInstance(splide);
		});
		
		splide.mount();

		return splide;
	}

	// Watch splideOptions (live changes)
	useEffect(() => {
		const el = splideWrapperRef.current;
		if (!el) return;

		const adjustment = getEditorAdjustment();

		if (splideInstanceRef.current) {
			splideInstanceRef.current.destroy(true);
		}

		splideInstanceRef.current = createAndMountSplide(el, attributes, adjustment);
	}, [attributes.splideOptions]);

	// Resize observer
	useEffect(() => {
		const el = splideWrapperRef.current;
		if (!el || !splideInstanceRef.current) return;
	
		let previousContainerWidth = getEditorCanvasWidth();
		let timeoutId = null;
	
		const resizeObserver = new ResizeObserver(() => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				const newContainerWidth = getEditorCanvasWidth();
				if (newContainerWidth !== previousContainerWidth) {
					splideInstanceRef.current.destroy(true);
					splideInstanceRef.current = createAndMountSplide(el, attributes, getEditorAdjustment());
					previousContainerWidth = newContainerWidth;
				} else {
					splideInstanceRef.current.refresh();
				}
			}, 100);
		});
	
		resizeObserver.observe(el);
		return () => {
			clearTimeout(timeoutId);
			resizeObserver.disconnect();
		};
	}, [attributes.splideOptions]);
	

	// Sync selected block in editor
	const selectedBlockClientId = useSelect((select) => select(blockEditorStore).getSelectedBlockClientId(), []);
	const slideIndex = useSelect((select) => {
		const { getBlock, getBlockRootClientId } = select(blockEditorStore);
		const block = getBlock(clientId);
		if (!block || !block.innerBlocks?.length) return -1;
	
		let selectedId = selectedBlockClientId;
	
		// Climb up the tree until we find a direct child of the carousel
		while (selectedId) {
			const parentId = getBlockRootClientId(selectedId);
			if (parentId === clientId) {
				break; // found a direct child of carousel (a slide)
			}
			selectedId = parentId;
		}
	
		return block.innerBlocks.findIndex((inner) => inner.clientId === selectedId);
	}, [selectedBlockClientId]);

	useEffect(() => {
		const splide = splideInstanceRef.current;
	
		if (!splide || slideIndex < 0) return;
	
		// Don't proceed if destroyed
		if (splide.state.is(Splide.STATES.DESTROYED)) return;
	
		splide.go(slideIndex);
	
	}, [slideIndex]);

	useEffect(() => {
		const el = splideWrapperRef.current;
		if (!el) return;
	
		const handleClick = (event) => {
			const block = wp.data.select('core/block-editor').getBlock(clientId);
			if (!block?.innerBlocks?.length) return;
	
			const slideElements = Array.from(el.querySelectorAll('.splide__slide'));
			const clickedSlide = event.target.closest('.splide__slide');
			if (!clickedSlide || !slideElements.includes(clickedSlide)) {
				dispatch('core/block-editor').selectBlock(clientId);
				return;
			}
		};
	
		el.addEventListener('click', handleClick);
		return () => el.removeEventListener('click', handleClick);
	}, []);

	const arrowStyle = attributes.arrowStyle || carouselSupport.arrowStyle || 'chevron';
	const paginationStyle = attributes.paginationStyle || carouselSupport.paginationStyle || 'circle';

	const splideBlockProps = {
		ref: splideWrapperRef,
		className: 'splide',
		'aria-label': __('Carousel Preview'),
		'data-arrow': arrowStyle,
		'data-pagination': paginationStyle,
	};
	// Render
	return (
		<>
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
			<CarouselToolbar clientId={clientId} instance={splideInstance} currentIndex={currentIndex} />
		</>
	);
}
