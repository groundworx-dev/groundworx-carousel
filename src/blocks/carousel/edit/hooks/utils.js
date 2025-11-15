import { useState, useEffect, useMemo } from '@wordpress/element';
import { getBreakpoints } from '@groundworx/utils';

function getEditorCanvasElement() {
	const iframe = document.querySelector('iframe[name="editor-canvas"]');
	if (iframe?.contentDocument?.body) return iframe.contentDocument.body;
	return document.querySelector('.editor-styles-wrapper');
}

function getEditorCanvasWidth() {
	const el = getEditorCanvasElement();
	return el?.getBoundingClientRect?.().width || window.innerWidth;
}

export function useCarouselBreakpoint(splideOptions, visibleBreakpoints = ['tablet', 'laptop', 'desktop']) {
	const [canvasWidth, setCanvasWidth] = useState(() => getEditorCanvasWidth());

	useEffect(() => {
		const updateWidth = () => {
			setCanvasWidth(getEditorCanvasWidth());
		};

		updateWidth();

		const resizeObserver = new ResizeObserver(updateWidth);
		const target = getEditorCanvasElement();

		if (target) {
			resizeObserver.observe(target);
		}

		return () => resizeObserver.disconnect();
	}, []);

	const activeBreakpoint = getActiveBreakpoint(canvasWidth, visibleBreakpoints);
	
	const resolvedOptions = useMemo(() => {
		return resolveSplideOptions(splideOptions, canvasWidth);
	}, [splideOptions, canvasWidth]);

	return {
		canvasWidth,
		activeBreakpoint,
		resolvedOptions
	};
}

function getActiveBreakpoint(width, breakpoints) {
	const sorted = breakpoints
		.map(bp => ({ name: bp, value: getBreakpoints.resolve(bp) }))
		.filter(bp => bp.value !== null)
		.sort((a, b) => a.value - b.value);

	for (let i = sorted.length - 1; i >= 0; i--) {
		if (width >= sorted[i].value) {
			return sorted[i].name;
		}
	}
	
	return 'default';
}

export function resolveSplideOptions(splideOptions, canvasWidth) {
	if (!splideOptions.breakpoints) {
		const transformed = transformFocusOption(splideOptions);
		return transformed;
	}

	const resolved = { ...splideOptions };
	const breakpoints = {};

	const adjustment = window.innerWidth - canvasWidth;

	for (const [name, config] of Object.entries(splideOptions.breakpoints)) {
		const breakpointValue = getBreakpoints.resolve(name);
		
		if (breakpointValue !== null) {
			const transformedConfig = transformFocusOption(config);
			breakpoints[breakpointValue + adjustment] = transformedConfig;
		}
	}

	resolved.breakpoints = breakpoints;
	
	const transformed = transformFocusOption(resolved);
	return transformed;
}

function transformFocusOption(options) {
	const transformed = { ...options };
	
	if ('focus' in transformed) {
		const focusValue = transformed.focus;
		if (focusValue === undefined || focusValue === 'off') {
			delete transformed.focus;
		} else if (focusValue === 'null') {
			transformed.focus = undefined;
		} else if (focusValue === 'center') {
			transformed.focus = 'center';
		}
	}
	return transformed;
}

export function getColorCSSVar(attribute, customAttribute, varName) {
	if (attribute && !customAttribute) {
		return { [varName]: `var(--wp--preset--color--${attribute})` };
	}
	if (!attribute && customAttribute) {
		return { [varName]: customAttribute };
	}
	return {};
}