import clsx from 'clsx';
import { 
    useBlockProps,
    useInnerBlocksProps
} from '@wordpress/block-editor';

/**
 * Save function for the block.
 * This defines the structure that gets saved to the post content.
 */
export default function save({ attributes }) {
    const { minHeight } = attributes;
    
    const blockProps = useBlockProps.save({
        className: clsx(
            'splide__slide'
        ),
        style: {
            minHeight: minHeight || undefined
        }
    });
    
    const innerBlockProps = useInnerBlocksProps.save(blockProps);

    return (
        <li {...innerBlockProps} />
    );
}