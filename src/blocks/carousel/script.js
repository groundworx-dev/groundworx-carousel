import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/splide-core.min.css';

import { mountCounter, mountProgressBar } from './utils/carousel';
import { ARROW_STYLES, PAGINATION_STYLES } from './utils/carousel-ui';
import { getBreakpoints } from '@groundworx/utils';

/**
 * Resolve named breakpoints to pixel values for frontend
 */
function resolveBreakpointsForFrontend(options) {
	if (!options.breakpoints) return options;
	
	const resolved = { ...options };
	const pixelBreakpoints = {};
	
	for (const [name, config] of Object.entries(options.breakpoints)) {
		const pixelValue = getBreakpoints.resolve(name);
		if (pixelValue !== null) {
			pixelBreakpoints[pixelValue] = config;
		}
	}
	
	resolved.breakpoints = pixelBreakpoints;
	return resolved;
}

/**
 * Get the resolved value for a specific option at the current viewport
 */
function getResolvedOption(options, optionName) {
	const width = window.innerWidth;
	let value = options[optionName];
	
	if (options.breakpoints) {
		const sortedBreakpoints = Object.keys(options.breakpoints)
			.map(bp => parseInt(bp))
			.sort((a, b) => a - b);
		
		for (const bp of sortedBreakpoints) {
			if (width >= bp && options.breakpoints[bp][optionName] !== undefined) {
				value = options.breakpoints[bp][optionName];
			}
		}
	}
	
	return value;
}

/**
 * Update feature classes based on current breakpoint
 */
function updateFeatureClasses(el, options) {
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

document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('[data-splide].splide').forEach((el) => {
		const datasetOptions = el.dataset.splide ? JSON.parse(el.dataset.splide) : {};
		
		// Resolve named breakpoints to pixel values
		const options = resolveBreakpointsForFrontend(datasetOptions);
		
		// Initial feature classes
		updateFeatureClasses(el, options);

		let splide = new Splide(el, options);

		const mountSplide = () => {
			if (splide && splide.destroy) {
				splide.destroy(true);
			}
			
			// Get arrow path from data attribute
			const arrowStyle = el.dataset.arrow || 'chevron';
			const arrowData = ARROW_STYLES[arrowStyle] || ARROW_STYLES.chevron;
			
			// Add arrowPath to options
			const splideOptionsWithArrow = {
				...options,
				arrowPath: arrowData.path
			};
			
			splide = new Splide(el, splideOptionsWithArrow);

			splide.on('overflow', (isOverflow) => {
				el.classList.toggle('is-overflow', isOverflow);
				
				if (!isOverflow) {
					splide.go(0);
					splide.options = {
						arrows: false,
						pagination: false,
						drag: false,
						clones: 0,
					};
				}
			});

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
				mountCounter(splide, el);
				mountProgressBar(splide, el);
				updateFeatureClasses(el, options);
			});

			splide.mount();
		};

		// Initial mount
		mountSplide();

		// Fully remount on resize
		let resizeTimeout;
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				updateFeatureClasses(el, options);
				mountSplide();
			}, 150);
		});
	});
});