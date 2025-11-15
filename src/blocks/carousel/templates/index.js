import { __ } from '@wordpress/i18n';

/**
 * Default templates provided by the carousel block
 */
const DEFAULT_TEMPLATES = [
	{
		label: __('Default', 'groundworx-carousel'),
		value: 'default'
	},
	{
		label: __('Default Alt', 'groundworx-carousel'),
		value: 'default-alt'
	},
	{
		label: __('Simple', 'groundworx-carousel'),
		value: 'simple'
	},
	{
		label: __('Simple Left', 'groundworx-carousel'),
		value: 'simple-left'
	},
	{
		label: __('Simple Right', 'groundworx-carousel'),
		value: 'simple-right'
	},
	{
		label: __('Overlay', 'groundworx-carousel'),
		value: 'overlay'
	},
	{
		label: __('Overlay Alt', 'groundworx-carousel'),
		value: 'overlay-alt'
	},
	{
		label: __('Partial Overlay', 'groundworx-carousel'),
		value: 'partial-overlay'
	},
	{
		label: __('Partial Overlay Alt', 'groundworx-carousel'),
		value: 'partial-overlay-alt'
	}
];

/**
 * Get available templates with developer hooks applied
 * 
 * Developers can:
 * 1. Add new templates
 * 2. Remove default templates
 * 3. Modify template labels
 * 4. Replace templates entirely
 * 
 * @example
 * // Add a custom template
 * wp.hooks.addFilter(
 *     'groundworx.carousel.templates',
 *     'my-theme/add-split-template',
 *     (templates) => [
 *         ...templates,
 *         { label: 'Split View', value: 'split' }
 *     ]
 * );
 * 
 * @example
 * // Remove default templates
 * wp.hooks.addFilter(
 *     'groundworx.carousel.templates',
 *     'my-theme/remove-compact',
 *     (templates) => templates.filter(t => t.value !== 'compact')
 * );
 * 
 * @example
 * // Replace all templates
 * wp.hooks.addFilter(
 *     'groundworx.carousel.templates',
 *     'my-theme/custom-only',
 *     () => [
 *         { label: 'Custom Template', value: 'custom' }
 *     ]
 * );
 * 
 * @returns {Array} Array of template objects with label and value
 */
export function getAvailableTemplates() {
	// Apply filter to allow developers to modify templates
	const templates = wp.hooks.applyFilters(
		'groundworx.carousel.templates',
		DEFAULT_TEMPLATES
	);

	// Ensure we always have at least one template
	if (!templates || templates.length === 0) {
		console.warn('No carousel templates available. Falling back to default.');
		return [{ label: __('Default', 'groundworx-carousel'), value: 'default' }];
	}

	return templates;
}

/**
 * Apply template-specific classes to carousel wrapper
 * 
 * @param {string} template - Template value
 * @param {Object} attributes - Block attributes
 * @returns {Array} Array of class names
 */
export function getTemplateClasses(template, attributes) {
	const classes = [`template-${template}`];

	// Apply filter to allow developers to modify classes
	return wp.hooks.applyFilters(
		'groundworx.carousel.templateClasses',
		classes,
		template,
		attributes
	);
}