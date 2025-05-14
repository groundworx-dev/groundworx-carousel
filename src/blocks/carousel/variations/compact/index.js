import { __ } from '@wordpress/i18n';

const variation = {
    name: 'compact',
    title: __('Carousel Compact'),
    attributes: { 
        template: 'compact',
        splideOptions: {
            type: 'loop',
            autoplay: false,
            pagination: false,
            arrows: true,
            mediaQuery: 'min',
            omitEnd: true,
            focus: 'center',
            trimSpace: false,
            breakpoints: {
                tablet: {
                    type: 'slide',
                    perPage: 3
                }
            }
		}
    },
    isDefault: false,
    scope: ['block', 'inserter', 'transform'],
    isActive: blockAttributes => blockAttributes.template === 'compact'
};

export default variation;
