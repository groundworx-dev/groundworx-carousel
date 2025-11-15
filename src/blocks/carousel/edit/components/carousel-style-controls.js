import { __ } from '@wordpress/i18n';
import { SelectControl, ToggleControl } from '@wordpress/components';
import { __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';
import { ARROW_STYLES, PAGINATION_STYLES } from './../../utils/carousel-ui';

export function ArrowStyleControl({ value, onChange, hasValue, onDeselect }) {
	const options = Object.keys(ARROW_STYLES).map(key => ({
		label: ARROW_STYLES[key].label,
		value: key
	}));

	const safeValue = value && ARROW_STYLES[value] ? value : Object.keys(ARROW_STYLES)[0];

	return (
		<ToolsPanelItem
			label={__('Arrow Style', 'groundworx-carousel')}
			hasValue={hasValue}
			onDeselect={onDeselect}
			isShownByDefault={true}
		>
			<SelectControl
				label={__('Arrow Style', 'groundworx-carousel')}
				value={safeValue}
				onChange={onChange}
				options={options}
				help={__('Choose the arrow icon style for carousel navigation', 'groundworx-carousel')}
				__nextHasNoMarginBottom
			/>
			<div style={{ 
				marginTop: '12px', 
				padding: '12px', 
				background: '#f0f0f0', 
				borderRadius: '4px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}}>
				<svg 
					width="40" 
					height="40" 
					viewBox="0 0 40 40" 
					style={{ fill: 'currentColor' }}
				>
					<path d={ARROW_STYLES[safeValue].path} />
				</svg>
			</div>
		</ToolsPanelItem>
	);
}

export function PaginationStyleControl({ value, onChange, hasValue, onDeselect }) {
	const options = Object.keys(PAGINATION_STYLES).map(key => ({
		label: PAGINATION_STYLES[key].label,
		value: key
	}));

	const safeValue = value && PAGINATION_STYLES[value] ? value : Object.keys(PAGINATION_STYLES)[0];

	return (
		<ToolsPanelItem
			label={__('Pagination Style', 'groundworx-carousel')}
			hasValue={hasValue}
			onDeselect={onDeselect}
			isShownByDefault={true}
		>
			<SelectControl
				label={__('Pagination Style', 'groundworx-carousel')}
				value={safeValue}
				onChange={onChange}
				options={options}
				help={__('Choose the pagination indicator style', 'groundworx-carousel')}
				__nextHasNoMarginBottom
			/>
			
			{safeValue !== 'number' && (
				<div style={{ 
					marginTop: '12px', 
					padding: '12px', 
					background: '#f0f0f0', 
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: '8px'
				}}>
					{[1, 2, 3].map(i => (
						<span 
							key={i}
							style={{ 
								opacity: i === 2 ? 1 : 0.5,
								display: 'flex',
								alignItems: 'center'
							}}
							dangerouslySetInnerHTML={{ __html: PAGINATION_STYLES[safeValue].svg }}
						/>
					))}
				</div>
			)}
			{safeValue === 'number' && (
				<div style={{ 
					marginTop: '12px', 
					padding: '12px', 
					background: '#f0f0f0', 
					borderRadius: '4px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: '8px',
					fontSize: '14px',
					fontWeight: 'bold'
				}}>
					<span style={{ opacity: 0.5 }}>1</span>
					<span>2</span>
					<span style={{ opacity: 0.5 }}>3</span>
				</div>
			)}
		</ToolsPanelItem>
	);
}