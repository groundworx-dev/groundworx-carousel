import { __ } from '@wordpress/i18n';
import clsx from 'clsx';
import { useBlockProps, useInnerBlocksProps, InspectorControls, BlockControls, store as blockEditorStore  } from '@wordpress/block-editor';
import { __experimentalToolsPanelItem as ToolsPanelItem, ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { WidthControl } from '@groundworx/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

import './editor.scss';

export default function Edit( { attributes, setAttributes, clientId } ) {
  const { minHeight } = attributes;
  
  const { insertBlock } = useDispatch(blockEditorStore);
  
  const { carouselClientId, slideIndex, totalSlides } = useSelect((select) => {
    const { getBlockParents, getBlock } = select('core/block-editor');

    const parents = getBlockParents(clientId);
    const carouselId = parents[parents.length - 1];
    const carousel = getBlock(carouselId);
    
    const slideIndex = carousel?.innerBlocks?.findIndex(b => b.clientId === clientId) ?? -1;
    
    return {
      carouselClientId: carouselId,
      slideIndex: slideIndex,
      totalSlides: carousel?.innerBlocks?.length ?? 0
    };
  }, [clientId]);

  const addSlide = () => {
    const newSlide = createBlock('groundworx/slide');
    insertBlock(newSlide, slideIndex + 1, carouselClientId);
  };
  
  const blockProps = useBlockProps({
    className: clsx(
        'inner-content splide__slide'
    ),
    style: {
        minHeight: minHeight || undefined
    }
  });

  const innerBlockProps = useInnerBlocksProps(blockProps);

  return <>
    <BlockControls>
			<ToolbarGroup label={__('Slides', 'groundworx-carousel')}>
				<ToolbarButton
					variant="primary"
					label={__('Add Slide to Carousel', 'groundworx-carousel')}
					onClick={addSlide}
				>
					{__('Add Slide', 'groundworx-carousel')}
				</ToolbarButton>
			</ToolbarGroup>
		</BlockControls>
    <InspectorControls group="dimensions">
      <ToolsPanelItem
        hasValue={() => !!minHeight}
        label={__('Min Height', 'groundworx-carousel')}
        onDeselect={() => setAttributes({ minHeight: undefined })}
        resetAllFilter={() => setAttributes({ minHeight: undefined })}
        isShownByDefault={true}
        panelId={clientId}
      >
        <WidthControl
          label={__('Minimum Height', 'groundworx-carousel')}
          value={minHeight}
          onChange={(value) => setAttributes({ minHeight: value })}
        />
      </ToolsPanelItem>
    </InspectorControls>
    <li {...innerBlockProps} />
  </>;
}