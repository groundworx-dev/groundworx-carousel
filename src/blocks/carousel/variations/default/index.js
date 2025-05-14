import { __ } from '@wordpress/i18n';

const variation = {
    name: 'default',
    title: __('Carousel'),
    attributes: { 
        template: 'default',
        splideOptions: {
            type: 'slide',
            pagination: false,
            arrows: true,
            mediaQuery: 'min',
            omitEnd: true,
            trimSpace: false
		}
    },
    isDefault: true,
    scope: ['block', 'inserter', 'transform'],
    isActive: blockAttributes => blockAttributes.template === 'default'
};

export default variation;