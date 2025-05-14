/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import { 
	useBlockProps, 
    withColors,
    InspectorControls,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
    __experimentalUseGradient
} from '@wordpress/block-editor';
import SplideCarousel from './splide-carousel';
import CarouselInspectorPanel from './carousel-inspector-panel';
import LayoutStyles from './layout-styles';

import './editor.scss';

function getColorCSSVar(attribute, customAttribute, varName) {
	if (attribute && !customAttribute) {
		return { [varName]: `var(--wp--preset--color--${attribute})` };
	}
	if (!attribute && customAttribute) {
		return { [varName]: customAttribute };
	}
	return {};
}

function Edit(props) {
	const { attributes, setAttributes, 
		progressColor, setProgressColor, 
		paginationColor, setPaginationColor, 
		arrowsColor, setArrowsColor, 
		arrowsBackgroundColor, setArrowsBackgroundColor, 
		counterColor, setCounterColor, 
		isSelected, clientId, className, name,
		__unstableLayoutClassNames: layoutClassNames } = props;

	const { template } = attributes;
	const spacingProps = useSpacingProps( attributes );

	const blockProps = useBlockProps({
		className: clsx(
			className,
			template && `template-${template}`,
			layoutClassNames
		),
		style: {
			...spacingProps.style,
			...getColorCSSVar(attributes.paginationColor, attributes.customPaginationColor, '--grx--color--pagination'),
			...getColorCSSVar(attributes.arrowsColor, attributes.customArrowsColor, '--grx--color--arrows'),
			...getColorCSSVar(attributes.arrowsBackgroundColor, attributes.customArrowsBackgroundColor, '--grx--color--arrows-bg'),
			...getColorCSSVar(attributes.progressColor, attributes.customProgressColor, '--grx--color--progress'),
			...getColorCSSVar(attributes.counterColor, attributes.customCounterColor, '--grx--color--counter')
		}
	});
	
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	function resetAllColors() {
		setProgressColor(undefined);
		setPaginationColor(undefined);
		setArrowsColor(undefined);
		setArrowsBackgroundColor(undefined);
		setCounterColor(undefined);
	}
	
	return (
		<>
			{ isSelected && (
				<>
				<CarouselInspectorPanel
					attributes={attributes}
					setAttributes={setAttributes}
					name={name}
				/>
				
				<InspectorControls group="color">
					
					<ColorGradientSettingsDropdown
						__experimentalIsRenderedInSidebar
						settings={[
							{
								colorValue: paginationColor?.color,
								label: __('Pagination'),
								onColorChange: setPaginationColor,
								clearable: true,
								resetAllFilter: () => resetAllColors(),
							},
							{
								colorValue: arrowsColor?.color,
								label: __('Arrows Text'),
								onColorChange: setArrowsColor,
								clearable: true,
								resetAllFilter: () => resetAllColors(),
							},
							{
								colorValue: arrowsBackgroundColor?.color,
								label: __('Arrows Background'),
								onColorChange: setArrowsBackgroundColor,
								clearable: true,
								resetAllFilter: () => resetAllColors(),
							},
							{
								colorValue: progressColor?.color,
								label: __('Progress Bar'),
								onColorChange: setProgressColor,
								clearable: true,
								resetAllFilter: () => resetAllColors(),
							},
							{
								colorValue: counterColor?.color,
								label: __('Counter Bar'),
								onColorChange: setCounterColor,
								clearable: true,
								resetAllFilter: () => resetAllColors(),
							}
						]}
						panelId={clientId}
						{...colorGradientSettings}
					/>
					
				</InspectorControls>
				</>
			)}
			<LayoutStyles attributes={attributes} clientId={clientId} />
			
			<section {...blockProps}>
				<SplideCarousel
					props={props}
				>
				</SplideCarousel>
			</section>
	
		</>
	);
}

export default withColors({ 
	progressColor: 'color',
	paginationColor: 'color',
	arrowsColor: 'color',
	arrowsBackgroundColor: 'color',
	counterColor: 'color'
})(Edit);