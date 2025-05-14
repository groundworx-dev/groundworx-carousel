/**
 * WordPress dependencies
 */
import { __experimentalGetGapCSSValue as getGapCSSValue } from '@wordpress/block-editor';

import { getBreakpoints } from '@groundworx/utils';

export default function LayoutStyles({ attributes, clientId }) {
	const { breakpoints: layoutBreakpoints = {}, style } = attributes;
	
	const blockGap = attributes.style?.spacing?.blockGap;

	const fallbackValue = 'var(--wp--style--block-gap, 0px)';
	let row = fallbackValue;
	let column = fallbackValue;

	if (blockGap) {
		row = typeof blockGap === 'string'
			? getGapCSSValue(blockGap)
			: getGapCSSValue(blockGap?.top) || fallbackValue;

		column = typeof blockGap === 'string'
			? getGapCSSValue(blockGap)
			: getGapCSSValue(blockGap?.left) || fallbackValue;
	}

	const gapValue = row === column ? row : `${row} ${column}`;

	const sortedBreakpoints = Object.entries(layoutBreakpoints).sort(([a], [b]) => {
		return getBreakpoints.resolve(a) - getBreakpoints.resolve(b);
	});

	const rules = sortedBreakpoints.map(([breakpointKey, data]) => {
		const minWidth = getBreakpoints.get(breakpointKey);

		if (!minWidth || !data?.layout || data.layout.type !== 'grid') return '';

		const { sameHeight, layout } = data;
		const { columnCount, minimumColumnWidth } = layout;
		const baseSelector = `#block-${clientId} > .splide:not(.is-active) > .splide__wrapper > .splide__track > .splide__list`;
		const declarations = [`gap: ${gapValue};`];

		if (sameHeight) {
			declarations.push(
				`grid-auto-rows: minmax(0,1fr);`
			);
		}

		if (minimumColumnWidth) {
			declarations.push(
				`grid-template-columns: repeat(auto-fill, minmax(min(${minimumColumnWidth}, 100%), 1fr));`,
				`container-type: inline-size;`
			);
		} else if (columnCount) {
			declarations.push(
				`grid-template-columns: repeat(${parseInt(columnCount)}, minmax(0, 1fr));`
			);
		}

		return `@media (min-width: ${minWidth}) {
			${baseSelector} {
				display: grid;
				${declarations.join('\n')}
			}
		}`;
	});

	return (
		<style>
			{rules.join('\n')}
		</style>
	);
}
