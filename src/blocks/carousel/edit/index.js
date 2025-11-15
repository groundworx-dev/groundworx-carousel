import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import { useBlockProps, withColors, InspectorControls, __experimentalGetSpacingClassesAndStyles as useSpacingProps, __experimentalUseGradient } from '@wordpress/block-editor';
import SplideCarousel from './splide-carousel';
import CarouselInspectorPanel from './carousel-inspector-panel';
import LayoutStyles from './layout-styles';

import MultiColorControl from './components/multi-color-control';
import SingleColorControl from './components/single-color-control';
import { getColorCSSVar } from './hooks/utils';

import './../editor.scss';

function Edit(props) {
	const { attributes, setAttributes, 
		progressColor, setProgressColor, 
		progressBackgroundColor, setProgressBackgroundColor, 
		
		paginationColor, setPaginationColor, 
		paginationBackgroundColor, setPaginationBackgroundColor,
		paginationBorderColor, setPaginationBorderColor,

		paginationInactiveColor, setPaginationInactiveColor, 
		paginationInactiveBackgroundColor, setPaginationInactiveBackgroundColor,
		paginationInactiveBorderColor, setPaginationInactiveBorderColor,

		arrowsColor, setArrowsColor, 
		arrowsBackgroundColor, setArrowsBackgroundColor, 
		arrowsBorderColor, setArrowsBorderColor, 
		
		counterColor, setCounterColor, 
		isSelected, clientId, className, name,
		__unstableLayoutClassNames: layoutClassNames } = props;

	const { template, paginationStyle } = attributes;

	const spacingProps = useSpacingProps( attributes );

	const blockProps = useBlockProps({
		className: clsx(
			className,
			template && `template-${template}`,
			{ 'is-pagination-number': paginationStyle === 'number' },
			layoutClassNames
		),
		style: {
			...spacingProps.style,
			
			...getColorCSSVar(attributes.paginationColor, attributes.customPaginationColor, '--gwx--color--pagination'),
			...getColorCSSVar(attributes.paginationBackgroundColor, attributes.customPaginationBackgroundColor, '--gwx--background-color--pagination'),
			...getColorCSSVar(attributes.paginationBorderColor, attributes.customPaginationBorderColor, '--gwx--border-color--pagination'),

			...getColorCSSVar(attributes.paginationInactiveColor, attributes.customPaginationInactiveColor, '--gwx--color--inactive-pagination'),
			...getColorCSSVar(attributes.paginationInactiveBackgroundColor, attributes.customPaginationInactiveBackgroundColor, '--gwx--background-color--inactive-pagination'),
			...getColorCSSVar(attributes.paginationInactiveBorderColor, attributes.customPaginationInactiveBorderColor, '--gwx--border-color--inactive-pagination'),
	
			...getColorCSSVar(attributes.arrowsColor, attributes.customArrowsColor, '--gwx--color--arrows'),
			...getColorCSSVar(attributes.arrowsBackgroundColor, attributes.customArrowsBackgroundColor, '--gwx--background-color--arrows'),
			...getColorCSSVar(attributes.arrowsBorderColor, attributes.customArrowsBorderColor, '--gwx--border-color--arrows'),

			...getColorCSSVar(attributes.progressColor, attributes.customProgressColor, '--gwx--color--progress'),
			...getColorCSSVar(attributes.progressBackgroundColor, attributes.customProgressBackgroundColor, '--gwx--background-color--progress'),
			...getColorCSSVar(attributes.counterColor, attributes.customCounterColor, '--gwx--color--counter')
		}
	});
	
	const arrowColors = [
        { 
            key: 'text', 
            label: __('Text', 'groundworx-carousel'), 
            value: arrowsColor, 
            setValue: setArrowsColor
        },
        { 
            key: 'background', 
            label: __('Background', 'groundworx-carousel'), 
            value: arrowsBackgroundColor, 
            setValue: setArrowsBackgroundColor 
        },
        { 
            key: 'border', 
            label: __('Border', 'groundworx-carousel'), 
            value: arrowsBorderColor, 
            setValue: setArrowsBorderColor 
        },
    ];

	const activePaginationColors = [
        { 
            key: 'Text', 
            label: __('Text', 'groundworx-carousel'), 
            value: paginationColor, 
            setValue: setPaginationColor
        },
        { 
            key: 'background', 
            label: __('Background', 'groundworx-carousel'), 
            value: paginationBackgroundColor, 
            setValue: setPaginationBackgroundColor
        },
		{
            key: 'border', 
            label: __('Border', 'groundworx-carousel'), 
            value: paginationBorderColor, 
            setValue: setPaginationBorderColor 
		}
	];

	const inactivePaginationColors = [
		{ 
            key: 'text', 
            label: __('Text', 'groundworx-carousel'), 
            value: paginationInactiveColor, 
            setValue: setPaginationInactiveColor 
        },
        { 
            key: 'background', 
            label: __('Background', 'groundworx-carousel'), 
            value: paginationInactiveBackgroundColor, 
            setValue: setPaginationInactiveBackgroundColor
        },
		{
            key: 'border', 
            label: __('Border', 'groundworx-carousel'), 
            value: paginationInactiveBorderColor, 
            setValue: setPaginationInactiveBorderColor 
		}
    ];

	const progressColors = [
        { 
            key: 'foreground', 
            label: __('Foreground', 'groundworx-carousel'), 
            value: progressColor, 
            setValue: setProgressColor 
        },
        { 
            key: 'background', 
            label: __('Background', 'groundworx-carousel'), 
            value: progressBackgroundColor, 
            setValue: setProgressBackgroundColor 
        },
    ];

	function resetAllColors() {
        setProgressColor(undefined);
        setProgressBackgroundColor(undefined);
        setPaginationColor(undefined);
        setPaginationInactiveColor(undefined);
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
					
					<MultiColorControl
						label={ __('Arrow', 'groundworx-carousel') }
						colors={ arrowColors }
						clientId={ clientId }
						resetAllFilter={ resetAllColors }
					/>

					<MultiColorControl
						label={ __('Active Pagination', 'groundworx-carousel') }
						colors={ activePaginationColors }
						clientId={ clientId }
						resetAllFilter={ resetAllColors }
					/>

					<MultiColorControl
						label={ __('Inactive Pagination', 'groundworx-carousel') }
						colors={ inactivePaginationColors }
						clientId={ clientId }
						resetAllFilter={ resetAllColors }
					/>

					<MultiColorControl
						label={ __('Progress Bar', 'groundworx-carousel') }
						colors={ progressColors }
						clientId={ clientId }
						resetAllFilter={ resetAllColors }
					/>
					
					<SingleColorControl
						label={ __('Counter', 'groundworx-carousel') }
						colorValue={ counterColor }
						setValue={ setCounterColor }
						clientId={ clientId }
						resetAllFilter={ resetAllColors }
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
	progressBackgroundColor: 'backgroundColor',
	
	paginationColor: 'color',
	paginationBackgroundColor: 'color',
	paginationBorderColor: 'color',
	
	paginationInactiveColor: 'color',
	paginationInactiveBackgroundColor: 'color',
	paginationInactiveBorderColor: 'color',
	
	arrowsColor: 'color',
	arrowsBackgroundColor: 'backgroundColor',
	arrowsBorderColor: 'color',
	counterColor: 'color'
})(Edit);