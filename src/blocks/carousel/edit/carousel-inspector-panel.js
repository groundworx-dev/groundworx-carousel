import { __, sprintf } from '@wordpress/i18n';
import { InspectorControls, __experimentalGetGapCSSValue as getGapCSSValue } from '@wordpress/block-editor';
import { __experimentalToolsPanel as ToolsPanel, __experimentalToolsPanelItem as ToolsPanelItem, TabPanel, SelectControl, ToggleControl } from '@wordpress/components';
import { useEffect, useState, useMemo } from '@wordpress/element';
import { getBlockType } from '@wordpress/blocks';

import { useToolsPanelDropdownMenuProps, getBreakpoints } from '@groundworx/utils';
import { ColumnControl } from '@groundworx/components';
import { mobile, largeMobile, tablet, largeTablet, laptop, desktop, largeDesktop } from '@groundworx/icons';

import { useSplideOptions, useBreakpointLayout } from './hooks/use-responsive-state';
import { ResponsiveToggleControl, ResponsiveSelectControl, ResponsiveRangeControl, ResponsiveMultiControl } from './components/responsive-controls';
import { ArrowStyleControl, PaginationStyleControl } from './components/carousel-style-controls';
import ResponsiveGridLayoutPanel from './components/responsive-grid-layout-panel';
import OptionWidthLayoutPanel from './components/option-width-layout-panel';
import { getAvailableTemplates } from './../templates';

const DEFAULT_VALUES = {
	type: { default: 'slide', breakpoint: undefined },
	focus: { default: '', breakpoint: undefined },
	rewind: { default: false, breakpoint: undefined },
	omitEnd: { default: false, breakpoint: undefined },
	trimSpace: { default: false, breakpoint: undefined },
	autoplay: { default: false, breakpoint: undefined },
	pagination: { default: false, breakpoint: undefined },
	arrows: { default: false, breakpoint: undefined },
	perPage: { default: 1, breakpoint: undefined },
	fixedWidth: { default: undefined, breakpoint: undefined },
	perMove: { default: 1, breakpoint: undefined },
	progressBar: { default: false, breakpoint: undefined },
	counter: { default: false, breakpoint: undefined },
	destroy: { default: false, breakpoint: undefined },
};

const GRID_DEFAULT_VALUES = {
	columnCount: { default: 3, breakpoint: undefined },
	minimumColumnWidth: { default: undefined, breakpoint: undefined },
	type: { default: 'grid', breakpoint: undefined },
	sameHeight: { default: false, breakpoint: undefined }
};

export default function CarouselInspectorPanel({ attributes, setAttributes, name }) {
	const { style } = attributes;
	
	const splideState = useSplideOptions(attributes, setAttributes, DEFAULT_VALUES);
	const layoutState = useBreakpointLayout(attributes, setAttributes);

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();
	const blockType = getBlockType(name);
	const visibleBreakpoints = blockType?.supports?.groundworx?.breakpoints || [];
	
	const [resettingTab, setResettingTab] = useState(null);

	const breakpointLabels = Object.keys(getBreakpoints.all()).reduce((acc, key) => {
		acc[key] = key.replace(/-/g, ' ').split(' ')
			.map(w => w.charAt(0).toUpperCase() + w.slice(1))
			.join(' ');
		return acc;
	}, {});

	const breakpointTabs = [
		{ name: 'default', icon: mobile, title: __('Default', 'groundworx-carousel') },
		...visibleBreakpoints.map((key) => ({
			name: key,
			icon: {
				'large-mobile': largeMobile,
				'tablet': tablet,
				'large-tablet': largeTablet,
				'laptop': laptop,
				'desktop': desktop,
				'large-desktop': largeDesktop
			}[key] || mobile,
			title: breakpointLabels[key] || key,
		})),
	];

	useEffect(() => {
		const blockGap = style?.spacing?.blockGap;
		if (blockGap === undefined) return;

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
		
		if (splideState.get('gap') !== gapValue) {
			splideState.set('gap', 'default', gapValue);
		}
	}, [style?.spacing?.blockGap]);

	const isBreakpointDestroyed = (breakpoint) => {
		if (breakpoint === 'default') return false;

		const destroyedAt = visibleBreakpoints.find(
			bp => splideState.get('destroy', bp) === true
		);

		if (!destroyedAt) return false;

		const destroyIndex = visibleBreakpoints.indexOf(destroyedAt);
		const currentIndex = visibleBreakpoints.indexOf(breakpoint);

		return currentIndex >= destroyIndex;
	};

	const getFirstDestroyedBreakpoint = () => {
		return visibleBreakpoints.find(bp => splideState.get('destroy', bp) === true);
	};

	const currentDestroyValue = useMemo(() => {
		const destroyed = getFirstDestroyedBreakpoint();
		return destroyed || 'never';
	}, [attributes.splideOptions, visibleBreakpoints]);

	const availableTemplates = getAvailableTemplates();

	const breakpointIconMap = {
		'large-mobile': largeMobile,
		'tablet': tablet,
		'large-tablet': largeTablet,
		'laptop': laptop,
		'desktop': desktop,
		'large-desktop': largeDesktop
	};

	const destroyOptions = [
		{ 
			label: __('Never (Always Carousel)', 'groundworx-carousel'),
			value: 'never',
			icon: mobile
		},
		...visibleBreakpoints.map(breakpoint => {
			const label = breakpoint
				.split('-')
				.map(word => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ');
			
			return {
				label: sprintf(__('At %s', 'groundworx-carousel'), label),
				value: breakpoint,
				icon: breakpointIconMap[breakpoint] || mobile
			};
		})
	];

	return (
		<InspectorControls>
			<ToolsPanel 
				label={__('Layout', 'groundworx-carousel')} 
				dropdownMenuProps={dropdownMenuProps}
				className="carousel-layout-panel"
			>
				<ToolsPanelItem
					label={__('Template', 'groundworx-carousel')}
					hasValue={() => attributes.template && attributes.template !== 'default'}
					onDeselect={() => setAttributes({ template: 'default' })}
					isShownByDefault
				>
					<SelectControl
						label={__('Template', 'groundworx-carousel')}
						value={attributes.template || 'default'}
						onChange={(value) => setAttributes({ template: value })}
						options={availableTemplates}
						help={__('Choose the layout structure for your carousel', 'groundworx-carousel')}
						__nextHasNoMarginBottom
					/>
				</ToolsPanelItem>

				<ArrowStyleControl
					value={attributes.arrowStyle || 'chevron'}
					onChange={(value) => setAttributes({ arrowStyle: value })}
					hasValue={() => !!attributes.arrowStyle && attributes.arrowStyle !== 'chevron'}
					onDeselect={() => setAttributes({ arrowStyle: 'chevron' })}
				/>

				<PaginationStyleControl
					value={attributes.paginationStyle || 'circleOutline'}
					onChange={(value) => setAttributes({ paginationStyle: value })}
					hasValue={() => !!attributes.paginationStyle && attributes.paginationStyle !== 'circleOutline'}
					onDeselect={() => setAttributes({ paginationStyle: 'circleOutline' })}
				/>

				<ToolsPanelItem
					label={__('Disable Carousel At', 'groundworx-carousel')}
					hasValue={() => {
						return visibleBreakpoints.some(bp => 
							splideState.get('destroy', bp) !== undefined
						);
					}}
					onDeselect={() => {
						visibleBreakpoints.forEach(bp => {
							splideState.set('destroy', bp, undefined);
						});
					}}
					isShownByDefault
				>
					<SelectControl
						label={__('Disable Carousel At', 'groundworx-carousel')}
						value={currentDestroyValue}
						onChange={(value) => {
							if (!value) return;
							
							const updated = { ...attributes.splideOptions };
							const breakpoints = { ...(updated.breakpoints || {}) };
							
							Object.keys(breakpoints).forEach(bp => {
								const bpData = { ...breakpoints[bp] };
								delete bpData.destroy;
								
								if (Object.keys(bpData).length === 0) {
									delete breakpoints[bp];
								} else {
									breakpoints[bp] = bpData;
								}
							});
							
							if (value !== 'never') {
								const bpData = { ...(breakpoints[value] || {}) };
								bpData.destroy = true;
								breakpoints[value] = bpData;
							}
							
							if (Object.keys(breakpoints).length === 0) {
								delete updated.breakpoints;
							} else {
								updated.breakpoints = breakpoints;
							}
							
							setAttributes({ splideOptions: updated });
							
							if (value !== 'never') {
								const layoutBreakpoints = { ...(attributes.breakpoints || {}) };
								
								const destroyIndex = visibleBreakpoints.indexOf(value);
								const destroyedBreakpoints = visibleBreakpoints.slice(destroyIndex);
								
								destroyedBreakpoints.forEach((bp, index) => {
									const isFirst = index === 0;
									
									if (isFirst) {
										layoutBreakpoints[bp] = {
											layout: {
												type: GRID_DEFAULT_VALUES.type.default,
												columnCount: GRID_DEFAULT_VALUES.columnCount.default,
												minimumColumnWidth: GRID_DEFAULT_VALUES.minimumColumnWidth.default
											},
											sameHeight: GRID_DEFAULT_VALUES.sameHeight.default
										};
										
									} else {
										layoutBreakpoints[bp] = {
											layout: {
												columnCount: undefined,
												minimumColumnWidth: undefined
											},
											sameHeight: undefined
										};
									}
								});
								
								Object.keys(layoutBreakpoints).forEach(bp => {
									
									if (layoutBreakpoints[bp].sameHeight === undefined) {
										delete layoutBreakpoints[bp].sameHeight;
									}
									
									const layoutKeys = Object.keys(layoutBreakpoints[bp].layout || {});
									const allUndefined = layoutKeys.every(k => layoutBreakpoints[bp].layout[k] === undefined);
									
									if (allUndefined) {
										delete layoutBreakpoints[bp].layout;
									}
									
									if (Object.keys(layoutBreakpoints[bp]).length === 0) {
										delete layoutBreakpoints[bp];
									}
								});
								
								setAttributes({ breakpoints: layoutBreakpoints });
							}
						}}
						options={destroyOptions.map(option => ({
							label: option.label,
							value: option.value
						}))}
						help={__('Convert carousel to grid layout at larger screens', 'groundworx-carousel')}
						__nextHasNoMarginBottom
					/>
				</ToolsPanelItem>
			</ToolsPanel>

			<TabPanel className="splide-breakpoint-tabs" tabs={breakpointTabs}>
				{(tab) => {
					const breakpoint = tab.name;
					const isDefault = breakpoint === 'default';
					const isDestroyed = isBreakpointDestroyed(breakpoint);
					const firstDestroyed = getFirstDestroyedBreakpoint();
					const isFirstDestroy = breakpoint === firstDestroyed;

					return (
						<ToolsPanel 
							key={breakpoint} 
							label={tab.title} 
							dropdownMenuProps={dropdownMenuProps}
							resetAll={() => {
								const keysToReset = Object.keys(DEFAULT_VALUES);
								splideState.resetAll(keysToReset, breakpoint);
							}}
						>
							{!isDestroyed && (
								<>
									{splideState.get('type', breakpoint) !== 'fade' && (
										<ResponsiveSelectControl
											label={__('Type', 'groundworx-carousel')}
											attribute="type"
											breakpoint={breakpoint}
											splideState={splideState}
											options={[
												{ label: __('Slide', 'groundworx-carousel'), value: 'slide' },
												{ label: __('Loop', 'groundworx-carousel'), value: 'loop' }
											]}
										/>
									)}

									{splideState.get('type', breakpoint) !== 'fade' && (
										<ResponsiveSelectControl
											label={__('Focus', 'groundworx-carousel')}
											attribute="focus"
											breakpoint={breakpoint}
											splideState={splideState}
											options={[
												{ label: __('Off', 'groundworx-carousel'), value: isDefault ? '' : 'null' },
												{ label: __('Center', 'groundworx-carousel'), value: 'center' }
											]}
										/>
									)}

									{splideState.get('type', breakpoint) !== 'fade' && (
										<ResponsiveMultiControl
											label={__('Carousel Item Size', 'groundworx-carousel')}
											attributes={['perPage', 'fixedWidth']}
											breakpoint={breakpoint}
											splideState={splideState}
											ControlComponent={OptionWidthLayoutPanel}
											options={{
												perPage: splideState.get('perPage', breakpoint),
												fixedWidth: splideState.get('fixedWidth', breakpoint),
											}}
											defaults={{
												perPage: isDefault 
													? DEFAULT_VALUES.perPage.default 
													: splideState.get('perPage', 'default'),
												fixedWidth: isDefault
													? DEFAULT_VALUES.fixedWidth.default
													: splideState.get('fixedWidth', 'default'),
											}}
											isResetting={resettingTab === breakpoint}
											onChange={({ perPage, fixedWidth }) => {
												
												if (typeof perPage === 'number' && perPage >= 1) {
													const rootFixedWidth = splideState.get('fixedWidth', 'default');
													
													if (breakpoint !== 'default' && rootFixedWidth) {
														splideState.setMultiple({ perPage, fixedWidth: 0 }, breakpoint);
													} else {
														splideState.setMultiple({ perPage, fixedWidth: undefined }, breakpoint);
													}
												} else if (typeof fixedWidth === 'string' && fixedWidth.length > 0) {
													const rootPerPage = splideState.get('perPage', 'default');
													
													if (breakpoint !== 'default' && rootPerPage) {
														splideState.setMultiple({ perPage: 0, fixedWidth }, breakpoint);
													} else {
														splideState.setMultiple({ perPage: undefined, fixedWidth }, breakpoint);
													}
												} else {
													splideState.setMultiple({ perPage, fixedWidth }, breakpoint);
												}
											}}
											onDeselect={() => {
												splideState.setMultiple({
													perPage: splideState.getDefault('perPage', breakpoint),
													fixedWidth: splideState.getDefault('fixedWidth', breakpoint)
												}, breakpoint);
												setResettingTab(breakpoint);
												setTimeout(() => setResettingTab(null), 20);
											}}
										/>
									)}

									{splideState.get('type', breakpoint) !== 'fade' && (
										<ResponsiveRangeControl
											label={__('Slides Per Move', 'groundworx-carousel')}
											attribute="perMove"
											breakpoint={breakpoint}
											splideState={splideState}
											ControlComponent={ColumnControl}
											min={1}
											max={10}
										/>
									)}

									<ResponsiveToggleControl
										label={__('Rewind', 'groundworx-carousel')}
										attribute="rewind"
										breakpoint={breakpoint}
										splideState={splideState}
									/>

									<ResponsiveToggleControl
										label={__('Omit End', 'groundworx-carousel')}
										attribute="omitEnd"
										breakpoint={breakpoint}
										splideState={splideState}
									/>

									<ResponsiveToggleControl
										label={__('Trim Space', 'groundworx-carousel')}
										attribute="trimSpace"
										breakpoint={breakpoint}
										splideState={splideState}
									/>

									<ResponsiveToggleControl
										label={__('Autoplay', 'groundworx-carousel')}
										attribute="autoplay"
										breakpoint={breakpoint}
										splideState={splideState}
									/>

									<ResponsiveToggleControl
										label={__('Pagination', 'groundworx-carousel')}
										attribute="pagination"
										breakpoint={breakpoint}
										splideState={splideState}
									/>

									<ResponsiveToggleControl
										label={__('Arrows', 'groundworx-carousel')}
										attribute="arrows"
										breakpoint={breakpoint}
										splideState={splideState}
									/>

									<ResponsiveToggleControl
										label={__('Progress Bar', 'groundworx-carousel')}
										attribute="progressBar"
										breakpoint={breakpoint}
										splideState={splideState}
									/>

									<ResponsiveToggleControl
										label={__('Counter', 'groundworx-carousel')}
										attribute="counter"
										breakpoint={breakpoint}
										splideState={splideState}
									/>
								</>
							)}

							{isDestroyed && (
								<>
									<ToolsPanelItem
										label={__('Grid Layout', 'groundworx-carousel')}
										hasValue={() => {
											const columnCount = layoutState.getLayout(breakpoint, 'columnCount');
											const minimumColumnWidth = layoutState.getLayout(breakpoint, 'minimumColumnWidth');
											
											if (isFirstDestroy) {
												return columnCount !== GRID_DEFAULT_VALUES.columnCount.default || 
												       minimumColumnWidth !== GRID_DEFAULT_VALUES.minimumColumnWidth.default;
											} else {
												return columnCount !== undefined || minimumColumnWidth !== undefined;
											}
										}}
										onDeselect={() => {
											if (isFirstDestroy) {
												layoutState.setLayoutMultiple(breakpoint, {
													type: GRID_DEFAULT_VALUES.type.default,
													columnCount: GRID_DEFAULT_VALUES.columnCount.default,
													minimumColumnWidth: GRID_DEFAULT_VALUES.minimumColumnWidth.default
												});
											} else {
												layoutState.setLayoutMultiple(breakpoint, {
													columnCount: undefined,
													minimumColumnWidth: undefined
												});
											}
										}}
										isShownByDefault
									>
										<ResponsiveGridLayoutPanel
											options={(() => {
												const opts = layoutState.breakpoints?.[breakpoint]?.layout || {};
												return opts;
											})()}
											onChange={(newLayout) => {
												layoutState.setLayoutMultiple(breakpoint, newLayout);
											}}
											defaults={isFirstDestroy ? {
												columnCount: GRID_DEFAULT_VALUES.columnCount.default,
												minimumColumnWidth: GRID_DEFAULT_VALUES.minimumColumnWidth.default
											} : {
												columnCount: GRID_DEFAULT_VALUES.columnCount.breakpoint,
												minimumColumnWidth: GRID_DEFAULT_VALUES.minimumColumnWidth.breakpoint
											}}
											isFirstDestroy={isFirstDestroy}
										/>
									</ToolsPanelItem>

									<ToolsPanelItem
										label={__('Equal Row Height', 'groundworx-carousel')}
										hasValue={() => {
											const sameHeight = layoutState.breakpoints?.[breakpoint]?.sameHeight;
											
											if (isFirstDestroy) {
												return sameHeight !== GRID_DEFAULT_VALUES.sameHeight.default && sameHeight !== undefined;
											} else {
												return sameHeight !== undefined;
											}
										}}
										onDeselect={() => {
											const updated = { ...layoutState.breakpoints };
											if (updated[breakpoint]) {
												if (isFirstDestroy) {
													updated[breakpoint] = {
														...updated[breakpoint],
														sameHeight: GRID_DEFAULT_VALUES.sameHeight.default
													};
												} else {
													delete updated[breakpoint].sameHeight;
													if (Object.keys(updated[breakpoint]).length === 0) {
														delete updated[breakpoint];
													}
												}
											}
											setAttributes({ breakpoints: updated });
										}}
										isShownByDefault
									>
										<ToggleControl
											label={__('Equal Row Height', 'groundworx-carousel')}
											checked={!!layoutState.breakpoints?.[breakpoint]?.sameHeight}
											onChange={(val) => {
												const updated = { ...layoutState.breakpoints };
												const bpData = { ...(updated[breakpoint] || {}) };
												if (val) {
													bpData.sameHeight = true;
												} else {
													delete bpData.sameHeight;
												}
												updated[breakpoint] = bpData;
												setAttributes({ breakpoints: updated });
											}}
											help={
												layoutState.breakpoints?.[breakpoint]?.sameHeight
													? __('Enabled', 'groundworx-carousel')
													: __('Disabled', 'groundworx-carousel')
											}
										/>
									</ToolsPanelItem>
								</>
							)}
						</ToolsPanel>
					);
				}}
			</TabPanel>
		</InspectorControls>
	);
}