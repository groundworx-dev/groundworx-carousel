import { __ } from '@wordpress/i18n';

export const ARROW_STYLES = {
	arrow: {
		label: __('Arrow', 'groundworx-carousel'),
		path: "M37.14,20c0-0.07,0-0.14-0.01-0.22s-0.03-0.15-0.06-0.22c-0.01-0.05-0.02-0.09-0.03-0.14c-0.01-0.02-0.02-0.04-0.03-0.06c-0.03-0.07-0.07-0.13-0.12-0.19c-0.04-0.06-0.08-0.12-0.13-0.18c-0.02-0.02-0.02-0.04-0.04-0.06l-9.27-9.32c-0.58-0.59-1.54-0.59-2.12-0.01c-0.59,0.58-0.59,1.53-0.01,2.12l6.73,6.76H4.86c-0.83,0-1.5,0.67-1.5,1.5s0.67,1.5,1.5,1.5h27.18l-6.73,6.76c-0.58,0.59-0.58,1.54,0.01,2.12c0.29,0.29,0.67,0.44,1.06,0.44c0.38,0,0.77-0.15,1.06-0.44l9.27-9.32c0.02-0.02,0.02-0.04,0.04-0.05c0.05-0.05,0.09-0.12,0.13-0.18s0.08-0.13,0.12-0.19c0.01-0.02,0.03-0.04,0.03-0.06c0.02-0.04,0.02-0.09,0.03-0.14c0.02-0.08,0.05-0.15,0.06-0.23C37.14,20.14,37.14,20.07,37.14,20z"
	},
	chevron: {
		label: __('Chevron', 'groundworx-carousel'),
		path: "M16.74,36l-3.48-3.48L25.79,20L13.26,7.48L16.74,4l16,16L16.74,36z"
	},
	chevronRounded: {
		label: __('Chevron Rounded', 'groundworx-carousel'),
		path: "M15.89,36c-0.59,0-1.17-0.23-1.62-0.68c-0.89-0.89-0.89-2.35,0-3.23L26.38,20L14.27,7.9c-0.89-0.89-0.89-2.35,0-3.23c0.89-0.89,2.35-0.89,3.23,0l13.7,13.7c0.43,0.43,0.68,1.01,0.68,1.62s-0.25,1.19-0.68,1.62l-13.7,13.7C17.06,35.77,16.48,36,15.89,36z"
	},
	halfArrow: {
		label: __('Half Arrow', 'groundworx-carousel'),
		path: "M35.64,21.41H4.86c-0.83,0-1.5-0.67-1.5-1.5s0.67-1.5,1.5-1.5h27.18l-6.73-6.76c-0.58-0.59-0.58-1.54,0.01-2.12s1.54-0.58,2.12,0.01l9.27,9.32c0.43,0.43,0.55,1.07,0.32,1.63C36.79,21.05,36.25,21.41,35.64,21.41z"
	},
	play: {
		label: __('Play', 'groundworx-carousel'),
		path: "M32.34,20L15.16,36V4L32.34,20z"
	},
	playRounded: {
		label: __('Play Rounded', 'groundworx-carousel'),
		path: "M32.46,21.89l-14.4,13.42c-1.65,1.53-4.34,0.36-4.34-1.88V6.58c0-2.26,2.68-3.43,4.34-1.88l14.4,13.42C33.56,19.13,33.56,20.87,32.46,21.89z"
	},
	sharpChevron: {
		label: __('Sharp Chevron', 'groundworx-carousel'),
		path: "M16.75,36h4.45l9.58-16.01L21.21,4h-4.46l9.55,15.99l-9.56,16L16.75,36z"
	},
	thinChevron: {
		label: __('Thin Chevron', 'groundworx-carousel'),
		path: "M17.1,36l-2.2-2.2L28.69,20L14.9,6.2L17.1,4l16,16L17.1,36z"
	},
	thinChevronRounded: {
		label: __('Thin Chevron Rounded', 'groundworx-carousel'),
		path: "M16.73,36c-0.37,0-0.75-0.14-1.03-0.43c-0.57-0.57-0.57-1.49,0-2.06L29.21,20L15.7,6.49c-0.57-0.57-0.57-1.49,0-2.06s1.49-0.57,2.06,0L32.3,18.97c0.27,0.27,0.43,0.64,0.43,1.03s-0.16,0.76-0.43,1.03L17.76,35.57C17.48,35.86,17.1,36,16.73,36z"
	},
	triangle: {
		label: __('Triangle', 'groundworx-carousel'),
		path: "M39.5,20l-32,16V4L39.5,20z"
	},
	triangleRounded: {
		label: __('Triangle Rounded', 'groundworx-carousel'),
		path: "M37.78,22.38L11.09,35.72c-1.76,0.89-3.84-0.41-3.84-2.38V6.66c0-1.97,2.08-3.25,3.84-2.38l26.69,13.34C39.73,18.59,39.73,21.4,37.78,22.38z"
	}
};

export const PAGINATION_STYLES = {
	circle: {
		label: __('Circle', 'groundworx-carousel'),
		svg: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" role="presentation" focusable="false" fill="currentColor">
			<path d="M 8 3 A 5 5 0 1 1 8 13 A 5 5 0 1 1 8 3" />
		</svg>`
	},
	square: {
		label: __('Square', 'groundworx-carousel'),
		svg: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" role="presentation" focusable="false" fill="currentColor">
			<path d="M 3 3 L 13 3 L 13 13 L 3 13 Z" />
		</svg>`
	},
	diamond: {
		label: __('Diamond', 'groundworx-carousel'),
		svg: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" role="presentation" focusable="false" fill="currentColor">
			<path d="M 8 2 L 14 8 L 8 14 L 2 8 Z"  />
		</svg>`
	},
	rectangle: {
		label: __('Rectangle', 'groundworx-carousel'),
		svg: `<svg width="48" height="16" viewBox="0 0 48 16" xmlns="http://www.w3.org/2000/svg" role="presentation" focusable="false" fill="currentColor">
			<path d="M 4 6 L 44 6 L 44 10 L 4 10 Z" />
		</svg>`
	},
	circleOutline: {
		label: __('Circle Outline', 'groundworx-carousel'),
		svg: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" role="presentation" focusable="false" stroke-width="1" stroke="currentColor" fill="transparent">
			<path d="M 8 3 A 5 5 0 1 1 8 13 A 5 5 0 1 1 8 3" />
		</svg>`
	},
	squareOutline: {
		label: __('Square Outline', 'groundworx-carousel'),
		svg: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" role="presentation" focusable="false" stroke-width="1" stroke="currentColor" fill="transparent">
			<path d="M 3 3 L 13 3 L 13 13 L 3 13 Z" />
		</svg>`
	},
	diamondOutline: {
		label: __('Diamond Outline', 'groundworx-carousel'),
		svg: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" role="presentation" focusable="false" stroke-width="1" stroke="currentColor" fill="transparent">
			<path d="M 8 2 L 14 8 L 8 14 L 2 8 Z" />
		</svg>`
	},
	rectangleOutline: {
		label: __('Rectangle Outline', 'groundworx-carousel'),
		svg: `<svg width="48" height="16" viewBox="0 0 48 16" xmlns="http://www.w3.org/2000/svg" role="presentation" focusable="false" stroke-width="1" stroke="currentColor" fill="transparent">
			<path d="M 4 6 L 44 6 L 44 10 L 4 10 Z" />
		</svg>`
	},
	number: {
		label: __('Number', 'groundworx-carousel'),
		svg: null
	}
};