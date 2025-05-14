import { __ } from '@wordpress/i18n';
import clsx from 'clsx';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import './editor.scss';

export default function Edit() {
  const blockProps = useBlockProps({
    className: clsx(
        'inner-content splide__slide'
    )
  });

  const innerBlockProps = useInnerBlocksProps(blockProps);

  return <li {...innerBlockProps} />;
}
