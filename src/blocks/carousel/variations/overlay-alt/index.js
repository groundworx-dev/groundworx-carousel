import { __ } from '@wordpress/i18n';

const variation = {
    name: 'overlay-alt',
    title: __('Carousel Overlay Alt'),
    attributes: { 
        template: 'overlay-alt',
        splideOptions: {
            type: 'loop',
            autoplay: false,
            pagination: false,
            arrows: true,
            mediaQuery: 'min',
            omitEnd: true,
            focus: 'center',
            trimSpace: false
		}
    },
    isDefault: false,
    scope: ['block', 'inserter', 'transform'],
    isActive: blockAttributes => blockAttributes.template === 'overlay-alt'
};

export default variation;
