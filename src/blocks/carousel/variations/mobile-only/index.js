import { __ } from '@wordpress/i18n';

const variation = {
    name: 'mobile-only',
    title: __('Carousel Mobile only'),
    attributes: { 
        template: 'mobile-only',
        splideOptions: {
            type: 'loop',
            perPage: 3,
            autoplay: false,
            pagination: true,
            arrows: true,
            mediaQuery: 'min',
            omitEnd: true,
            focus: 'center',
            trimSpace: false,
            breakpoints: {
                tablet: {
                    destroy: true
                }
            }
		}
    },
    isDefault: false,
    scope: ['block', 'inserter', 'transform'],
    isActive: blockAttributes => blockAttributes.template === 'mobile-only'
};

export default variation;