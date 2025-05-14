import { __ } from '@wordpress/i18n';
import { BaseControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalVStack as VStack, __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

import { ColumnControl, WidthControl } from '@groundworx/components';

export default function OptionWidthLayoutPanelItem({
	options = {},
	onChange,
	label = __('Carousel Item Size'),
	hasValue = () => false,
	onDeselect = () => {},
	breakpoint = null
}) {
	const { perPage, fixedWidth } = options;

    useEffect(() => {
        if (perPage === undefined && fixedWidth === undefined) {
            setManualValue(undefined);
            setAutoValue(undefined);
        }
    }, [perPage, fixedWidth]);
    
	const [manualValue, setManualValue] = useState(perPage);
	const [autoValue, setAutoValue] = useState(fixedWidth);
	const [isManual, setIsManual] = useState(() => {
		if (typeof perPage === 'number') return true;
		if (typeof fixedWidth === 'string') return false;
		return true;
	});

	useEffect(() => {
		if (typeof perPage === 'number') {
			setIsManual(true);
			setManualValue(perPage);
		} else if (typeof fixedWidth === 'string') {
			setIsManual(false);
			setAutoValue(fixedWidth);
		}
	}, [perPage, fixedWidth]);

	const updateManual = (val) => {
		const parsed = parseInt(val, 10);
		if (val === '' || isNaN(parsed)) {
			setManualValue(undefined);
			onChange({ perPage: undefined, fixedWidth: undefined });
		} else {
			setManualValue(parsed);
			onChange({ perPage: parsed, fixedWidth: undefined });
		}
	};

	const updateAuto = (val) => {
		setAutoValue(val);
		onChange({ perPage: undefined, fixedWidth: val });
	};

	const handleModeToggle = (val) => {
		const newIsManual = val === 'manual';
		setIsManual(newIsManual);
		onChange({
			perPage: newIsManual ? manualValue : undefined,
			fixedWidth: newIsManual ? undefined : autoValue,
		});
	};

	return (
		<ToolsPanelItem
			label={label}
			hasValue={hasValue}
			onDeselect={onDeselect}
			isShownByDefault
		>
			<BaseControl as="legend">
				<VStack spacing={4}>
					<ToggleGroupControl
						label={__('Carousel item position')}
						value={isManual ? 'manual' : 'auto'}
						onChange={handleModeToggle}
						isBlock
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					>
						<ToggleGroupControlOption value="auto" label={__('Auto')} />
						<ToggleGroupControlOption value="manual" label={__('Manual')} />
					</ToggleGroupControl>

					{isManual ? (
						<ColumnControl
							label={__('Slides to show')}
							value={manualValue}
							onChange={updateManual}
							min={1}
							max={10}
							help={typeof manualValue === 'undefined' ? __('Inherit') : ''}
						/>
					) : (
						<WidthControl
							label={__('Minimum slide width')}
							value={autoValue}
							onChange={updateAuto}
							help={typeof autoValue === 'undefined' ? __('Inherit') : ''}
						/>
					)}
				</VStack>
			</BaseControl>
		</ToolsPanelItem>
	);
}
