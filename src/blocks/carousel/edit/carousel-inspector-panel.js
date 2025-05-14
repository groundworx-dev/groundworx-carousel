import { __ } from '@wordpress/i18n';
import { InspectorControls, __experimentalGetGapCSSValue as getGapCSSValue } from '@wordpress/block-editor';
import { __experimentalToolsPanel as ToolsPanel, __experimentalToolsPanelItem as ToolsPanelItem, TabPanel, ToggleControl, SelectControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { getBlockType } from '@wordpress/blocks';

import { useToolsPanelDropdownMenuProps, getBreakpoints } from '@groundworx/utils';
import { ColumnControl } from '@groundworx/components';
import { mobile, largeMobile, tablet, largeTablet, laptop, desktop, largeDesktop } from '@groundworx/icons';

import ResponsiveGridLayoutPanel from './responsive-grid-layout-panel';
import OptionWidthLayoutPanel from './option-width-layout-panel';

const DEFAULT_VALUES = {
	type: { default: 'slide', breakpoint: undefined },
	focus: { default: false, breakpoint: undefined },
	rewind: { default: false, breakpoint: undefined },
	autoplay: { default: false, breakpoint: undefined },
	pagination: { default: false, breakpoint: undefined },
	arrows: { default: false, breakpoint: undefined },
	perPage: { default: 1, breakpoint: undefined },
	fixedWidth: { default: undefined, breakpoint: undefined },
	perMove: { default: 1, breakpoint: undefined },
	progressBar: { default: false, breakpoint: undefined },
	counter: { default: false, breakpoint: undefined },
	splide: { default: 'chevron', breakpoint: undefined },
	sameHeight: { default: false, breakpoint: undefined },
	columnCount: { default: 1, breakpoint: undefined },
	minimumColumnWidth: { default: undefined, breakpoint: undefined }
};

const DEFAULT_SPLIDE_OPTIONS = Object.fromEntries(
	Object.entries(DEFAULT_VALUES)
		.filter(([key]) => key in DEFAULT_VALUES)
		.map(([key, obj]) => [key, obj.default])
);

function mergeSplideDefaults(splideOptions = {}) {
	return {
		...DEFAULT_SPLIDE_OPTIONS,
		...splideOptions,
	};
}

function getResponsiveValue(source, key, tab) {
	if (tab === 'default') return source[key];
	return source?.breakpoints?.[tab]?.[key];
}

function getResponsiveDefaultValue(key, tab) {
	const def = DEFAULT_VALUES[key];
	if (!def) return undefined;
	return tab === 'default' ? def.default : def.breakpoint;
}

function hasResponsiveValue(source, key, tab) {
	const currentValue = getResponsiveValue(source, key, tab);
	const defaultValue = getResponsiveDefaultValue(key, tab);
	return currentValue !== undefined && currentValue !== defaultValue;
}

function setResponsiveValue(source, key, tab, value) {
	const updated = { ...source };

	if (tab === 'default') {
		if (value === undefined) {
			delete updated[key];
		} else {
			updated[key] = value;
		}
	} else {
		const breakpoints = { ...(updated.breakpoints || {}) };
		const tabData = { ...(breakpoints[tab] || {}) };

		if (value === undefined) {
			delete tabData[key];
		} else {
			tabData[key] = value;
		}

		if (Object.keys(tabData).length === 0) {
			delete breakpoints[tab];
		} else {
			breakpoints[tab] = tabData;
		}

		updated.breakpoints = breakpoints;
	}

	return updated;
}

function getBreakpointValue(source, key, tab) {
	if (tab === 'default') return undefined;
	return source?.[tab]?.[key];
}

function setBreakpointValue(source, key, tab, value) {
	const updated = { ...source };
	const tabData = { ...(updated[tab] || {}) };

	if (value === undefined) {
		delete tabData[key];
	} else {
		tabData[key] = value;
	}

	if (Object.keys(tabData).length === 0) {
		delete updated[tab];
	} else {
		updated[tab] = tabData;
	}

	return updated;
}

function hasBreakpointValue(source, key, tab, defaultValue, fallbackTab = null) {
	const currentValue = source?.[tab]?.[key];
	const compareValue = defaultValue ?? getResponsiveDefaultValue(key, fallbackTab || tab);
	return currentValue !== undefined && currentValue !== compareValue;
}

export default function CarouselInspectorPanel({ attributes, setAttributes, name }) {

	const { breakpoints = {}, style } = attributes;

	const rawOptions = attributes.splideOptions || {};
	const splideOptions = mergeSplideDefaults(rawOptions);

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();
	const blockType = getBlockType(name);
	const visibleBreakpoints = blockType?.supports?.groundworx?.breakpoints || [];
	
	const [resettingTab, setResettingTab] = useState(null);

	const generateLabels = (bp) =>
		Object.keys(bp).reduce((acc, key) => {
			acc[key] = key
				.replace(/-/g, ' ')
				.split(' ')
				.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
				.join(' ');
			return acc;
		}, {});

	const aliases = generateLabels(getBreakpoints.all());
	
	const breakpointTabs = [
		{ 
			name: 'default', 
			icon: mobile, 
			title: __('Default') 
		},
		...visibleBreakpoints.map((key) => ({
			name: key,
			icon: (
				key === 'large-mobile' ? largeMobile :
				key === 'tablet' ? tablet :
				key === 'large-tablet' ? largeTablet :
				key === 'laptop' ? laptop :
				key === 'desktop' ? desktop :
				key === 'large-desktop' ? largeDesktop :
				null
			),
			title: __( (aliases[key] || key).replace(/^./, str => str.toUpperCase()) ),
		})),
	];

	// Set gap on slides
	useEffect(() => {
		const blockGap = style?.spacing?.blockGap;
		if (blockGap !== undefined) {
			const fallback = 'var(--wp--style--block-gap, 1rem)';
			let column = fallback;
			let row = fallback;
			if (typeof blockGap === 'string' || typeof blockGap === 'number') {
				column = row = getGapCSSValue(blockGap);
			} else {
				row = getGapCSSValue(blockGap?.top) ?? fallback;
				column = getGapCSSValue(blockGap?.left) ?? fallback;
			}
			let gapValue = row === column ? row : `${row} ${column}`;
			if (gapValue === '0' || gapValue === 0) gapValue = '0px';
			if (splideOptions.gap !== gapValue) {
				setAttributes({ splideOptions: { ...splideOptions, gap: gapValue } });
			}
		}
	}, [style?.spacing?.blockGap]);

	useEffect(() => {
		const all = [['default', splideOptions], ...Object.entries(splideOptions.breakpoints || {})];
		all.forEach(([key, settings]) => {
			let desired = undefined;
			if (settings?.focus === 'center') desired = false;
			else if (settings?.focus) desired = true;
			if (settings?.trimSpace !== desired) {
				const updated = setResponsiveValue(splideOptions, 'trimSpace', key, desired);
				setAttributes({ splideOptions: updated });
			}
		});
	}, [splideOptions]);

	function isBreakpointDestroyed(splideOptions, tabName, visibleBreakpoints) {
		if (tabName === 'default') return false;

		const destroyAt = visibleBreakpoints.find(
			(bp) => getResponsiveValue(splideOptions, 'destroy', bp) === true
		);

		if (!destroyAt) return false;

		const destroyIndex = visibleBreakpoints.indexOf(destroyAt);
		const currentIndex = visibleBreakpoints.indexOf(tabName);

		// Only return true for this and larger breakpoints
		return currentIndex >= destroyIndex;
	}

	function getFirstDestroyedBreakpoint(splideOptions, visibleBreakpoints) {
		return visibleBreakpoints.find(
			(bp) => getResponsiveValue(splideOptions, 'destroy', bp) === true
		);
	}

	function setLayoutValue(breakpoints, tab, key, value) {
		const next = { ...breakpoints };
		const layout = { ...(next[tab]?.layout || {}) };
	
		if (value === undefined) {
			delete layout[key];
		} else {
			layout[key] = value;
		}
	
		if (Object.keys(layout).length === 0) {
			if (next[tab]) {
				delete next[tab].layout;
				if (Object.keys(next[tab]).length === 0) {
					delete next[tab];
				}
			}
		} else {
			next[tab] = {
				...(next[tab] || {}),
				layout,
			};
		}
	
		return next;
	}

	function setMultipleResponsiveValues(source, tab, updates = {}) {
		const updated = { ...source };
		const isDefault = tab === 'default';

		if (isDefault) {
			for (const key in updates) {
				if (updates[key] === undefined) {
					delete updated[key];
				} else {
					updated[key] = updates[key];
				}
			}
		} else {
			const breakpoints = { ...(updated.breakpoints || {}) };
			const tabData = { ...(breakpoints[tab] || {}) };
	
			for (const key in updates) {
				if (updates[key] === undefined) {
					delete tabData[key];
				} else {
					tabData[key] = updates[key];
				}
			}

			if (Object.keys(tabData).length === 0) {
				delete breakpoints[tab];
			} else {
				breakpoints[tab] = tabData;
			}
	
			updated.breakpoints = breakpoints;
		}
	
		return updated;
	}
	

	function hasLayoutOverride(breakpoints, tab, key, fallbackTab = null) {
		const current = breakpoints?.[tab]?.layout?.[key];
		const fallback = getResponsiveDefaultValue(key, fallbackTab || tab);
		return current !== undefined && current !== fallback;
	}

	function resetLayoutValues(breakpoints, tab, keys = [], fallbackTab = null) {
		let updated = { ...breakpoints };
		for (const key of keys) {
			const fallback = getResponsiveDefaultValue(key, fallbackTab || tab);
			updated = setLayoutValue(updated, tab, key, fallback);
		}
		return updated;
	}

	return (
		<InspectorControls>
			<TabPanel className="splide-breakpoint-tabs" tabs={breakpointTabs}>
				{(tab) => {
					const tabName = tab.name;
					const isDefault = tabName === 'default';
					//const isDestroyed = !isDefault && getResponsiveValue(splideOptions.breakpoints, 'destroy', tabName);
					const isDestroyed = isBreakpointDestroyed(splideOptions, tabName, visibleBreakpoints);
					const firstDestroyed = getFirstDestroyedBreakpoint(splideOptions, visibleBreakpoints);
					const isFirstDestroy = tabName === firstDestroyed;

					return (
						<ToolsPanel key={tabName} label={tab.title} dropdownMenuProps={dropdownMenuProps}>
							{ !isDestroyed ? (
								<>
									
									{ splideOptions.type !== 'fade' && (
										<>
											<ToolsPanelItem
												label={__('Type')}
												hasValue={() => hasResponsiveValue(splideOptions, 'type', tabName)}
												onDeselect={() => setAttributes({ splideOptions: setResponsiveValue(splideOptions, 'type', tabName, getResponsiveDefaultValue('type', tabName)) })}
												isShownByDefault
											>
												<SelectControl
													label={__('Type')}
													value={getResponsiveValue(splideOptions, 'type', tabName) || ''}
													onChange={(val) => setAttributes({ splideOptions: setResponsiveValue(splideOptions, 'type', tabName, val || undefined) })}
													options={[
														...(!isDefault ? [{ label: 'Inherit', value: '' }] : []),
														{ label: 'Slide', value: 'slide' },
														{ label: 'Loop', value: 'loop' }
													]}
												/>
											</ToolsPanelItem>

											<ToolsPanelItem
												label={__('Focus')}
												hasValue={() => hasResponsiveValue(splideOptions, 'focus', tabName)}
												onDeselect={() => setAttributes({ splideOptions: setResponsiveValue(splideOptions, 'focus', tabName, getResponsiveDefaultValue('focus', tabName)) })}
												isShownByDefault
											>
												<SelectControl
													label={__('Focus')}
													value={getResponsiveValue(splideOptions, 'focus', tabName) || ''}
													onChange={(val) => setAttributes({ splideOptions: setResponsiveValue(splideOptions, 'focus', tabName, val || undefined) })}
													options={[
														...(isDefault ? [] :[{ label: 'Inherit', value: "" }]),
														...(isDefault ? [{ label: 'Off', value: "" }] : [{ label: 'Off', value: "null" }]),
														{ label: 'Center', value: 'center' },
													]}
												/>
											</ToolsPanelItem>

											<ToolsPanelItem
												label={__('Carousel Item Size')}
												hasValue={() =>
													hasResponsiveValue(splideOptions, 'perPage', tabName) ||
													hasResponsiveValue(splideOptions, 'fixedWidth', tabName)
												}
												onDeselect={() => {
													const next = setMultipleResponsiveValues(splideOptions, tabName, {
														perPage: getResponsiveDefaultValue('perPage', tabName),
														fixedWidth: getResponsiveDefaultValue('fixedWidth', tabName),
													});
													setAttributes({ splideOptions: next });
													setResettingTab(tabName);
													setTimeout(() => setResettingTab(null), 20); // short delay to ensure it gets picked up
												}}
												
												isShownByDefault
											>
											
											<OptionWidthLayoutPanel
												options={{
													perPage: getResponsiveValue(splideOptions, 'perPage', tabName),
													fixedWidth: getResponsiveValue(splideOptions, 'fixedWidth', tabName),
												}}
												defaults={{
													perPage:
														tabName === 'default'
															? getResponsiveDefaultValue('perPage', tabName)
															: splideOptions?.perPage,
													fixedWidth:
														tabName === 'default'
															? getResponsiveDefaultValue('fixedWidth', tabName)
															: splideOptions?.fixedWidth,
												}}
												isResetting={resettingTab === tabName}
												onChange={({ perPage, fixedWidth }) => {
													let next = setResponsiveValue(splideOptions, 'perPage', tabName, perPage);
													next = setResponsiveValue(next, 'fixedWidth', tabName, fixedWidth);
													setAttributes({ splideOptions: next });
												}}
											/>

											</ToolsPanelItem>

											<ToolsPanelItem
												label={__('Slides Per Move')}
												hasValue={() => hasResponsiveValue(splideOptions, 'perMove', tabName)}
												onDeselect={() => setAttributes({ splideOptions: setResponsiveValue(splideOptions, 'perMove', tabName, getResponsiveDefaultValue('perMove', tabName)) })}
												isShownByDefault
											>
												<ColumnControl
													label={__('Slides Per Move')}
													value={getResponsiveValue(splideOptions, 'perMove', tabName)}
													onChange={(val) => setAttributes({ splideOptions: setResponsiveValue(splideOptions, 'perMove', tabName, val) })}
													min={1}
													max={10}
												/>
											</ToolsPanelItem>
										</>
									)}
									{ getResponsiveValue(splideOptions, 'rewind', tabName) !== 'loop' && splideOptions.type !== 'loop' && (
										<>
											<ToolsPanelItem
												label={__('Rewind')}
												hasValue={() => hasResponsiveValue(splideOptions, 'rewind', tabName)}
												onDeselect={() => setAttributes({ splideOptions: setResponsiveValue(splideOptions, 'rewind', tabName, getResponsiveDefaultValue('rewind', tabName)) })}
												isShownByDefault
											>
												<ToggleControl
													label={__('Rewind')}
													checked={!!getResponsiveValue(splideOptions, 'rewind', tabName)}
													onChange={(val) => setAttributes({ splideOptions: setResponsiveValue(splideOptions, 'rewind', tabName, val) })}
													help={
														!isDefault && typeof getResponsiveValue(splideOptions, 'rewind', tabName) === 'undefined'
															? __('Inherit')
															: getResponsiveValue(splideOptions, 'rewind', tabName)
															? __('Enabled')
															: __('Disabled')
													}
													className={
														!isDefault && typeof getResponsiveValue(splideOptions, 'rewind', tabName) === 'undefined'
															? 'is-inherited'
															: ''
													}
												/>
											</ToolsPanelItem>
										</>
									)}
									<ToolsPanelItem
										label={__('Autoplay')}
										hasValue={() => hasResponsiveValue(splideOptions, 'autoplay', tabName)}
										onDeselect={() => setAttributes({ splideOptions: setResponsiveValue(splideOptions, 'autoplay', tabName, getResponsiveDefaultValue('autoplay', tabName)) })}
										isShownByDefault
									>
										<ToggleControl
											label={__('Autoplay')}
											checked={!!getResponsiveValue(splideOptions, 'autoplay', tabName)}
											onChange={(val) => setAttributes({ splideOptions: setResponsiveValue(splideOptions, 'autoplay', tabName, val) })}
											help={
												!isDefault && typeof getResponsiveValue(splideOptions, 'autoplay', tabName) === 'undefined'
													? __('Inherit')
													: getResponsiveValue(splideOptions, 'autoplay', tabName)
													? __('Enabled')
													: __('Disabled')
											}
											className={
												!isDefault && typeof getResponsiveValue(splideOptions, 'autoplay', tabName) === 'undefined'
													? 'is-inherited'
													: ''
											}
										/>
									</ToolsPanelItem>

									<ToolsPanelItem
										label={__('Pagination')}
										hasValue={() => hasResponsiveValue(splideOptions, 'pagination', tabName)}
										onDeselect={() => setAttributes({ splideOptions: setResponsiveValue(splideOptions, 'pagination', tabName, getResponsiveDefaultValue('pagination', tabName)) })}
										isShownByDefault
									>
										<ToggleControl
											label={__('Pagination')}
											checked={!!getResponsiveValue(splideOptions, 'pagination', tabName)}
											onChange={(val) => setAttributes({ splideOptions: setResponsiveValue(splideOptions, 'pagination', tabName, val) })}
											help={
												!isDefault && typeof getResponsiveValue(splideOptions, 'pagination', tabName) === 'undefined'
													? __('Inherit')
													: getResponsiveValue(splideOptions, 'pagination', tabName)
													? __('Enabled')
													: __('Disabled')
											}
											className={
												!isDefault && typeof getResponsiveValue(splideOptions, 'pagination', tabName) === 'undefined'
													? 'is-inherited'
													: ''
											}
										/>
									</ToolsPanelItem>

									<ToolsPanelItem
										label={__('Arrows')}
										hasValue={() => hasResponsiveValue(splideOptions, 'arrows', tabName)}
										onDeselect={() => setAttributes({ splideOptions: setResponsiveValue(splideOptions, 'arrows', tabName, getResponsiveDefaultValue('arrows', tabName)) })}
										isShownByDefault
									>
										<ToggleControl
											label={__('Arrows')}
											checked={!!getResponsiveValue(splideOptions, 'arrows', tabName)}
											onChange={(val) => setAttributes({ splideOptions: setResponsiveValue(splideOptions, 'arrows', tabName, val) })}
											help={
												!isDefault && typeof getResponsiveValue(splideOptions, 'arrows', tabName) === 'undefined'
													? __('Inherit')
													: getResponsiveValue(splideOptions, 'arrows', tabName)
													? __('Enabled')
													: __('Disabled')
											}
											className={
												!isDefault && typeof getResponsiveValue(splideOptions, 'arrows', tabName) === 'undefined'
													? 'is-inherited'
													: ''
											}
										/>
									</ToolsPanelItem>

									<ToolsPanelItem
										label={__('Progress Bar')}
										hasValue={() => hasResponsiveValue(splideOptions, 'progressBar', tabName)}
										onDeselect={() => setAttributes({ splideOptions: setResponsiveValue(splideOptions, 'progressBar', tabName, getResponsiveDefaultValue('progressBar', tabName)) })}
										isShownByDefault
									>
										<ToggleControl
											label={__('Progress Bar')}
											checked={!!getResponsiveValue(splideOptions, 'progressBar', tabName)}
											onChange={(val) => setAttributes({ splideOptions: setResponsiveValue(splideOptions, 'progressBar', tabName, val) })}
											help={
												!isDefault && typeof getResponsiveValue(splideOptions, 'progressBar', tabName) === 'undefined'
													? __('Inherit')
													: getResponsiveValue(splideOptions, 'progressBar', tabName)
													? __('Enabled')
													: __('Disabled')
											}
											className={
												!isDefault && typeof getResponsiveValue(splideOptions, 'progressBar', tabName) === 'undefined'
													? 'is-inherited'
													: ''
											}
										/>
									</ToolsPanelItem>

									<ToolsPanelItem
										label={__('Counter')}
										hasValue={() => hasResponsiveValue(splideOptions, 'counter', tabName)}
										onDeselect={() => setAttributes({ splideOptions: setResponsiveValue(splideOptions, 'counter', tabName, getResponsiveDefaultValue('counter', tabName)) })}
										isShownByDefault
									>
										<ToggleControl
											label={__('Counter')}
											checked={!!getResponsiveValue(splideOptions, 'counter', tabName)}
											onChange={(val) => setAttributes({ splideOptions: setResponsiveValue(splideOptions, 'counter', tabName, val) })}
											help={
												!isDefault && typeof getResponsiveValue(splideOptions, 'counter', tabName) === 'undefined'
													? __('Inherit')
													: getResponsiveValue(splideOptions, 'counter', tabName)
													? __('Enabled')
													: __('Disabled')
											}
											className={
												!isDefault && typeof getResponsiveValue(splideOptions, 'counter', tabName) === 'undefined'
													? 'is-inherited'
													: ''
											}
										/>
									</ToolsPanelItem>
								</>
							) : (
								<>
									<ToolsPanelItem
										label={__('Grid Layout')}
										hasValue={() =>
											hasLayoutOverride(breakpoints, tabName, 'columnCount', isFirstDestroy ? 'default' : tabName) ||
											hasLayoutOverride(breakpoints, tabName, 'minimumColumnWidth', isFirstDestroy ? 'default' : tabName)
										}
										onDeselect={() => {
											const fallback = isFirstDestroy ? 'default' : tabName;
											const resetKeys = ['columnCount', 'minimumColumnWidth'];
											const updated = resetLayoutValues(breakpoints, tabName, resetKeys, fallback);
											setAttributes({ breakpoints: updated });
										}}
										isShownByDefault
									>
										<ResponsiveGridLayoutPanel
											options={breakpoints?.[tabName]?.layout || {}}
											onChange={(newLayout) => {
												setAttributes({
													breakpoints: {
														...breakpoints,
														[tabName]: {
															...(breakpoints?.[tabName] || {}),
															layout: newLayout,
														},
													},
												});
											}}
										/>
									</ToolsPanelItem>

									<ToolsPanelItem
										label={__('Equal Row Height')}
										hasValue={() =>
											hasBreakpointValue(
												breakpoints,
												'sameHeight',
												tabName,
												undefined,
												isFirstDestroy ? 'default' : null
											)
										}
										onDeselect={() => {
											const value = getResponsiveDefaultValue('sameHeight', isFirstDestroy ? 'default' : tabName);
											const updated = setBreakpointValue(breakpoints, 'sameHeight', tabName, value);
											setAttributes({ breakpoints: updated });
										}}
										isShownByDefault
									>
										<ToggleControl
											label={__('Equal Row Height')}
											checked={!!getBreakpointValue(breakpoints, 'sameHeight', tabName)}
											onChange={(val) => {
												const updated = setBreakpointValue(breakpoints, 'sameHeight', tabName, val);
												setAttributes({ breakpoints: updated });
											}}
											help={
												tabName !== 'default' && typeof getBreakpointValue(breakpoints, 'sameHeight', tabName) === 'undefined'
													? __('Inherit')
													: getBreakpointValue(breakpoints, 'sameHeight', tabName)
														? __('Enabled')
														: __('Disabled')
											}
											className={
												tabName !== 'default' && typeof getBreakpointValue(breakpoints, 'sameHeight', tabName) === 'undefined'
													? 'is-inherited'
													: ''
											}
										/>
									</ToolsPanelItem>

								</>
							)}
						</ToolsPanel>
					)
				}}
			</TabPanel>
		</InspectorControls>
	
	);
}
