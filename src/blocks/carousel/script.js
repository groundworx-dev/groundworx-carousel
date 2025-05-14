import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/splide-core.min.css';

import { mountCounter, mountProgressBar, mountArrowPath } from './utils/carousel';
import { PAGINATION_SHAPES } from './utils/carousel-ui';

import { getBreakpoints } from '@groundworx/utils';

function resolveBreakpoints(options = {}, mapBreakpoints = null) {
	if (!options.breakpoints) return options;

	const resolvedBreakpoints = {};

	for (const key in options.breakpoints) {
		let breakpointValue = getBreakpoints.resolve(key);

		if (breakpointValue === null) continue;

		if (typeof mapBreakpoints === 'object' && mapBreakpoints[key] !== undefined) {
			breakpointValue = parseInt(mapBreakpoints[key]);
		} else if (typeof mapBreakpoints === 'function') {
			breakpointValue = parseInt(mapBreakpoints(key, breakpointValue));
		}

		if (!isNaN(breakpointValue)) {
			resolvedBreakpoints[breakpointValue] = options.breakpoints[key];
		}
	}

	return {
		...options,
		breakpoints: resolvedBreakpoints,
	};
}

document.addEventListener('DOMContentLoaded', () => {
	const mapBreakpoints = getBreakpoints.all();

	document.querySelectorAll('[data-splide].splide').forEach((el) => {
		const datasetOptions = el.dataset.splide ? JSON.parse(el.dataset.splide) : {};
		const options = resolveBreakpoints(datasetOptions, mapBreakpoints);


		let splide = new Splide(el, options);

		const mountSplide = () => {
			if (splide && splide.destroy) {
				splide.destroy(true);
			}
			
			// Create fresh instance
			splide = new Splide(el, options);

			splide.on('overflow', (isOverflow) => {
				el.classList.toggle('is-overflow', isOverflow);
				
				if (!isOverflow) {
					splide.go( 0 );
					splide.options = {
						focus: undefined,
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

					item.button.innerHTML = PAGINATION_SHAPES[paginationStyle] || PAGINATION_SHAPES.circle;
				});
			});

			splide.on('mounted', () => {
				mountArrowPath(splide, el);
				mountCounter(splide, el);
				mountProgressBar(splide, el);
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
				mountSplide();
			}, 150);
		});
	});
});
