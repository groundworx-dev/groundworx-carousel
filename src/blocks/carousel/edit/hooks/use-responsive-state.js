import { useCallback } from '@wordpress/element';

export function useResponsiveState(attributes, setAttributes, attributePath, defaults = {}) {
	
	const source = attributes[attributePath] || {};

	const get = useCallback((key, breakpoint = 'default') => {
		if (breakpoint === 'default') {
			return source[key];
		}
		return source?.breakpoints?.[breakpoint]?.[key];
	}, [source]);

	const getResolved = useCallback((key, breakpoint = 'default') => {
		if (breakpoint === 'default') {
			return source[key];
		}
		const breakpointValue = source?.breakpoints?.[breakpoint]?.[key];
		if (breakpointValue !== undefined) {
			return breakpointValue;
		}
		return source[key];
	}, [source]);

	const set = useCallback((key, breakpoint = 'default', value) => {
		const source = attributes[attributePath] || {};
		const updated = { ...source };

		if (breakpoint === 'default') {
			if (value === undefined) {
				delete updated[key];
			} else {
				updated[key] = value;
			}
		} else {
			const breakpoints = { ...(updated.breakpoints || {}) };
			const breakpointData = { ...(breakpoints[breakpoint] || {}) };

			if (value === undefined) {
				delete breakpointData[key];
			} else {
				breakpointData[key] = value;
			}

			if (Object.keys(breakpointData).length === 0) {
				delete breakpoints[breakpoint];
			} else {
				breakpoints[breakpoint] = breakpointData;
			}

			if (Object.keys(breakpoints).length === 0) {
				delete updated.breakpoints;
			} else {
				updated.breakpoints = breakpoints;
			}
		}

		setAttributes({ [attributePath]: updated });
	}, [attributes, setAttributes, attributePath]);

	const has = useCallback((key, breakpoint = 'default') => {
		const currentValue = get(key, breakpoint);
		const defaultValue = breakpoint === 'default' 
			? defaults[key]?.default 
			: defaults[key]?.breakpoint;
		
		return currentValue !== undefined && currentValue !== defaultValue;
	}, [get, defaults]);

	const reset = useCallback((key, breakpoint = 'default') => {
		const defaultValue = breakpoint === 'default'
			? defaults[key]?.default
			: defaults[key]?.breakpoint;
		
		set(key, breakpoint, defaultValue);
	}, [set, defaults]);

	const setMultiple = useCallback((values, breakpoint = 'default') => {
		const source = attributes[attributePath] || {};
		let updated = { ...source };

		Object.entries(values).forEach(([key, value]) => {
			
			if (breakpoint === 'default') {
				if (value === undefined) {
					delete updated[key];
				} else {
					updated[key] = value;
				}
			} else {
				const breakpoints = { ...(updated.breakpoints || {}) };
				const breakpointData = { ...(breakpoints[breakpoint] || {}) };

				if (value === undefined) {
					delete breakpointData[key];
				} else {
					breakpointData[key] = value;
				}

				if (Object.keys(breakpointData).length === 0) {
					delete breakpoints[breakpoint];
				} else {
					breakpoints[breakpoint] = breakpointData;
				}

				if (Object.keys(breakpoints).length === 0) {
					delete updated.breakpoints;
				} else {
					updated.breakpoints = breakpoints;
				}
			}
		});

		setAttributes({ [attributePath]: updated });
	}, [attributes, setAttributes, attributePath]);

	const resetAll = useCallback((keys, breakpoint = 'default') => {
		const values = {};
		keys.forEach(key => {
			const defaultValue = breakpoint === 'default'
				? defaults[key]?.default
				: defaults[key]?.breakpoint;
			values[key] = defaultValue;
		});
		setMultiple(values, breakpoint);
	}, [defaults, setMultiple]);

	const getDefault = useCallback((key, breakpoint = 'default') => {
		if (!defaults[key]) return undefined;
		return breakpoint === 'default' ? defaults[key].default : defaults[key].breakpoint;
	}, [defaults]);

	return {
		get,
		getResolved,
		set,
		has,
		reset,
		resetAll,
		getDefault,
		setMultiple,
		source
	};
}

export function useSplideOptions(attributes, setAttributes, defaults) {
	return useResponsiveState(attributes, setAttributes, 'splideOptions', defaults);
}

export function useBreakpointLayout(attributes, setAttributes) {
	const breakpoints = attributes.breakpoints || {};

	const getLayout = useCallback((breakpoint, key) => {
		return breakpoints?.[breakpoint]?.layout?.[key];
	}, [breakpoints]);

	const setLayout = useCallback((breakpoint, key, value) => {
		const updated = { ...breakpoints };
		const breakpointData = { ...(updated[breakpoint] || {}) };
		const layout = { ...(breakpointData.layout || {}) };

		if (value === undefined) {
			delete layout[key];
		} else {
			layout[key] = value;
		}

		if (Object.keys(layout).length === 0) {
			delete breakpointData.layout;
			if (Object.keys(breakpointData).length === 0) {
				delete updated[breakpoint];
			} else {
				updated[breakpoint] = breakpointData;
			}
		} else {
			breakpointData.layout = layout;
			updated[breakpoint] = breakpointData;
		}

		setAttributes({ breakpoints: updated });
	}, [breakpoints, setAttributes]);

	const setLayoutMultiple = useCallback((breakpoint, values) => {
		const updated = { ...breakpoints };
		const breakpointData = { ...(updated[breakpoint] || {}) };
		const layout = { ...(breakpointData.layout || {}), ...values };

		breakpointData.layout = layout;
		updated[breakpoint] = breakpointData;

		setAttributes({ breakpoints: updated });
	}, [breakpoints, setAttributes]);

	return {
		getLayout,
		setLayout,
		setLayoutMultiple,
		breakpoints
	};
}