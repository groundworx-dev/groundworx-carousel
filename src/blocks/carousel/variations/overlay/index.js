import { __ } from '@wordpress/i18n';

const variation = {
    name: 'overlay',
    title: __('Carousel Overlay'),
    attributes: { 
        template: 'overlay',
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
    isActive: blockAttributes => blockAttributes.template === 'overlay'
};

export default variation;
