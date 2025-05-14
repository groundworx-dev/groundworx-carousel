import { __ } from '@wordpress/i18n';
import { __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalVStack as VStack } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

import { WidthControl, ColumnControl } from '@groundworx/components';

export default function ResponsiveGridLayoutPanel({ options = {}, onChange }) {
	const { columnCount, minimumColumnWidth } = options;

	const [isManual, setIsManual] = useState(() => {
		if (typeof columnCount === 'number') return true;
		if (typeof minimumColumnWidth === 'string') return false;
		return true; // fallback mode
	});

	const [manualValue, setManualValue] = useState(columnCount);
	const [autoValue, setAutoValue] = useState(minimumColumnWidth);

	// Sync values when external options change (like reset/inherit)
	useEffect(() => {
		if (typeof columnCount === 'number') {
			setIsManual(true);
			setManualValue(columnCount);
			setAutoValue(undefined);
		} else if (typeof minimumColumnWidth === 'string') {
			setIsManual(false);
			setAutoValue(minimumColumnWidth);
			setManualValue(undefined);
		} else {
			// Reset/inherit fallback
			setManualValue(undefined);
			setAutoValue(undefined);
		}
	}, [columnCount, minimumColumnWidth]);

	const updateManual = (val) => {
		const parsed = parseInt(val, 10);
		setManualValue(parsed);
		onChange({
			...options,
			type: 'grid',
			columnCount: parsed,
			minimumColumnWidth: undefined,
		});
	};

	const updateAuto = (val) => {
		setAutoValue(val);
		onChange({
			...options,
			type: 'grid',
			columnCount: undefined,
			minimumColumnWidth: val,
		});
	};

	const handleModeToggle = (val) => {
		const nextIsManual = val === 'manual';
		setIsManual(nextIsManual);

		if (nextIsManual) {
			onChange({
				...options,
				type: 'grid',
				columnCount: manualValue,
				minimumColumnWidth: undefined,
			});
		} else {
			onChange({
				...options,
				type: 'grid',
				columnCount: undefined,
				minimumColumnWidth: autoValue,
			});
		}
	};

	return (
		<VStack spacing={4}>
			<ToggleGroupControl
				label={__('Grid item position')}
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
					label={__('Columns')}
					min={1}
					max={10}
					value={manualValue}
					onChange={updateManual}
				/>
			) : (
				<WidthControl
					label={__('Minimum column width')}
					value={autoValue}
					onChange={updateAuto}
				/>
			)}
		</VStack>
	);
}
