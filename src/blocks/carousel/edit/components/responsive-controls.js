import { __ } from '@wordpress/i18n';
import { __experimentalToolsPanelItem as ToolsPanelItem,	ToggleControl, SelectControl } from '@wordpress/components';

export function ResponsiveToggleControl({ label, attribute, breakpoint = 'default', splideState, help = null }) {
	const { get, set, has, reset } = splideState;
	const isDefault = breakpoint === 'default';
	const value = get(attribute, breakpoint);
	const isInherited = !isDefault && value === undefined;

	return (
		<ToolsPanelItem
			label={label}
			hasValue={() => has(attribute, breakpoint)}
			onDeselect={() => reset(attribute, breakpoint)}
			isShownByDefault
		>
			<ToggleControl
				label={label}
				checked={!!value}
				onChange={(val) => set(attribute, breakpoint, val)}
				help={
					help || (
						isInherited
							? __('Inherit', 'groundworx-carousel')
							: value
								? __('Enabled', 'groundworx-carousel')
								: __('Disabled', 'groundworx-carousel')
					)
				}
				className={isInherited ? 'is-inherited' : ''}
			/>
		</ToolsPanelItem>
	);
}

export function ResponsiveSelectControl({ label, attribute, breakpoint = 'default', splideState, options = [], showInherit = true }) {
	const { get, set, has, reset } = splideState;
	const isDefault = breakpoint === 'default';
	const value = get(attribute, breakpoint);

	const selectOptions = [
		...(isDefault || !showInherit ? [] : [{ label: __('Inherit', 'groundworx-carousel'), value: '' }]),
		...options
	];

	return (
		<ToolsPanelItem
			label={label}
			hasValue={() => has(attribute, breakpoint)}
			onDeselect={() => reset(attribute, breakpoint)}
			isShownByDefault
		>
			<SelectControl
				label={label}
				value={value || ''}
				onChange={(val) => set(attribute, breakpoint, val || undefined)}
				options={selectOptions}
			/>
		</ToolsPanelItem>
	);
}

export function ResponsiveRangeControl({ label, attribute, breakpoint = 'default', splideState, ControlComponent, ...controlProps }) {
	const { get, set, has, reset } = splideState;
	const value = get(attribute, breakpoint);

	return (
		<ToolsPanelItem
			label={label}
			hasValue={() => has(attribute, breakpoint)}
			onDeselect={() => reset(attribute, breakpoint)}
			isShownByDefault
		>
			<ControlComponent
				label={label}
				value={value}
				onChange={(val) => set(attribute, breakpoint, val)}
				{...controlProps}
			/>
		</ToolsPanelItem>
	);
}

export function ResponsiveMultiControl({ label, attributes, breakpoint = 'default', splideState, ControlComponent, onDeselect, ...controlProps }) {
	const { get, has } = splideState;

	return (
		<ToolsPanelItem
			label={label}
			hasValue={() => attributes.some(attr => has(attr, breakpoint))}
			onDeselect={onDeselect}
			isShownByDefault
		>
			<ControlComponent
				{...controlProps}
			/>
		</ToolsPanelItem>
	);
}