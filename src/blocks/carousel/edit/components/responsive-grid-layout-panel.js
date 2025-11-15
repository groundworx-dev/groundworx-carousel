import { __ } from '@wordpress/i18n';
import { __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalVStack as VStack } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { WidthControl, ColumnControl } from '@groundworx/components';

export default function ResponsiveGridLayoutPanel({ options = {}, onChange, defaults = {} }) {
	const { columnCount, minimumColumnWidth } = options;
	const { columnCount: defaultColumnCount, minimumColumnWidth: defaultMinimumColumnWidth } = defaults;

	const [isManual, setIsManual] = useState(() => {
		if (typeof columnCount === 'number') return true;
		if (typeof minimumColumnWidth === 'string') return false;
		if (typeof defaultColumnCount === 'number') return true;
		return true;
	});

	const [manualValue, setManualValue] = useState(columnCount ?? defaultColumnCount);
	const [autoValue, setAutoValue] = useState(minimumColumnWidth ?? defaultMinimumColumnWidth);

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
			setManualValue(defaultColumnCount);
			setAutoValue(defaultMinimumColumnWidth);
			
			if (defaultColumnCount !== undefined || defaultMinimumColumnWidth !== undefined) {
				onChange({
					type: 'grid',
					columnCount: defaultColumnCount,
					minimumColumnWidth: defaultMinimumColumnWidth,
				});
			}
		}
	}, [columnCount, minimumColumnWidth, defaultColumnCount, defaultMinimumColumnWidth]);

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
			const defaultWidth = autoValue || '300px';
			setAutoValue(defaultWidth);
			onChange({
				...options,
				type: 'grid',
				columnCount: undefined,
				minimumColumnWidth: defaultWidth,
			});
		}
	};

	return (
		<VStack spacing={4}>
			<ToggleGroupControl
				label={__('Grid item position', 'groundworx-carousel')}
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
					label={__('Columns', 'groundworx-carousel')}
					min={1}
					max={10}
					value={manualValue}
					onChange={updateManual}
				/>
			) : (
				<WidthControl
					label={__('Minimum column width', 'groundworx-carousel')}
					value={autoValue}
					onChange={updateAuto}
				/>
			)}
		</VStack>
	);
}