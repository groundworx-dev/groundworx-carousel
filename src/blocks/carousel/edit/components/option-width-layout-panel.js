import { __ } from '@wordpress/i18n';
import { BaseControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption,	__experimentalVStack as VStack } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

import { ColumnControl, WidthControl } from '@groundworx/components';

export default function OptionWidthLayoutPanel({ options = {}, onChange, defaults = {}, isResetting = false }) {
	const { perPage, fixedWidth } = options;
	const { perPage: defaultPerPage, fixedWidth: defaultFixedWidth } = defaults;

	const [manualValue, setManualValue] = useState(perPage);
	const [autoValue, setAutoValue] = useState(fixedWidth);
	const [isManual, setIsManual] = useState(() => {
		if (typeof perPage === 'number') return true;
		if (typeof fixedWidth === 'string') return false;
		return true;
	});
	const [userToggledMode, setUserToggledMode] = useState(false);

	useEffect(() => {
		setManualValue(typeof perPage === 'number' ? perPage : undefined);
		setAutoValue(typeof fixedWidth === 'string' ? fixedWidth : undefined);
	}, [perPage, fixedWidth]);

	useEffect(() => {
		if (!isResetting) return;
	
		const defaultIsManual = typeof defaultPerPage === 'number';
		const defaultIsAuto = typeof defaultFixedWidth === 'string';
	
		if (defaultIsManual) setIsManual(true);
		else if (defaultIsAuto) setIsManual(false);
	
		setUserToggledMode(false);
	}, [isResetting, defaultPerPage, defaultFixedWidth]);
	
	const updateManual = (val) => {
		const parsed = parseInt(val, 10);
		const final = isNaN(parsed) ? undefined : parsed;
		setManualValue(final);
		onChange({ perPage: final, fixedWidth: undefined });
	};

	const updateAuto = (val) => {
		setAutoValue(val);
		onChange({ perPage: undefined, fixedWidth: val });
	};

	const handleModeToggle = (val) => {
		const isNowManual = val === 'manual';
		setIsManual(isNowManual);
		setUserToggledMode(true);
		onChange({
			perPage: isNowManual ? (manualValue ?? 1) : undefined,
			fixedWidth: isNowManual ? undefined : (autoValue ?? '300px'),
		});
	};

	return (
		<BaseControl as="fieldset">
			<VStack spacing={4}>
				<ToggleGroupControl
					label={__('Carousel item position', 'groundworx-carousel')}
					value={isManual ? 'manual' : 'auto'}
					onChange={handleModeToggle}
					isBlock
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				>
					<ToggleGroupControlOption value="auto" label={__('Auto', 'groundworx-carousel')} />
					<ToggleGroupControlOption value="manual" label={__('Manual', 'groundworx-carousel')} />
				</ToggleGroupControl>

				{isManual ? (
					<ColumnControl
						label={__('Slides to show', 'groundworx-carousel')}
						value={manualValue}
						onChange={updateManual}
						min={1}
						max={10}
						help={typeof manualValue === 'undefined' ? __('Inherit', 'groundworx-carousel') : ''}
					/>
				) : (
					<WidthControl
						label={__('Minimum slide width', 'groundworx-carousel')}
						value={autoValue}
						onChange={updateAuto}
						help={typeof autoValue === 'undefined' ? __('Inherit', 'groundworx-carousel') : ''}
					/>
				)}
			</VStack>
		</BaseControl>
	);
}