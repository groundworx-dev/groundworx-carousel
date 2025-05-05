=== Groundworx Carousel Block ===
Contributors: johannecourtright  
Tags: block, carousel, slider, gutenberg, responsive, splide  
Plugin URI: https://groundworx.dev  
Author URI: https://groundworx.dev 
Requires at least: 6.5  
Tested up to: 6.5.2  
Requires PHP: 8.2  
Stable tag: 1.0.0  
License: GPLv2 or later  
License URI: https://www.gnu.org/licenses/gpl-2.0.html  

A powerful and responsive carousel block built with Splide.js and fully integrated into the WordPress block editor.

== Description ==

Groundworx Carousel is a flexible Gutenberg block that allows you to display slides with any inner blocks. It's built on top of the lightweight Splide.js library and supports responsive options, breakpoint-based layouts, and advanced design controls.

**Features:**

- Native Gutenberg block support
- Slide, loop, or fade transition types
- Responsive controls for each breakpoint
- Arrow and pagination customization
- Progress bar and slide counter support
- Grid fallback layout when carousel is disabled
- Modern, accessible, and lightweight

Perfect for building galleries, content sliders, testimonials, product showcases, and more.

== Installation ==

1. Upload the plugin to the `/wp-content/plugins/` directory or install it via the WordPress admin panel.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Add the **Carousel** block in the Block Editor.
4. Add any block(s) you want inside each slide.
5. Customize carousel behavior via the block settings panel.

== Screenshots ==

1. The Carousel block in the block editor
2. Carousel options in Inspector Controls
3. Responsive layout and per-slide content

== Changelog ==

= 1.0.0 =
* Initial release.

== Frequently Asked Questions ==

= Can I use custom blocks inside each slide? =  
Yes, the Carousel block supports all inner blocks inside each `Slide` block.

= Does it support touch and swipe? =  
Yes. Splide.js provides full touch/swipe navigation on mobile and tablet.

= Can I disable the carousel for a specific breakpoint? =  
Absolutely. You can "destroy" the carousel at selected breakpoints and apply a grid layout instead.

== Upgrade Notice ==

= 1.0.0 =  
First stable release of the Groundworx Carousel block.

== Developer Notes ==

= Can I add my own block variations? =  
Yes. The Carousel block is built with extensibility in mind. You can register your own block variations using `wp.blocks.registerBlockVariation()` in JavaScript. All Splide options are passed as-is through the `splideOptions` attribute.

However, `supports` (such as `arrowStyle` or `paginationStyle`) cannot be set via variation definition. To customize those, you must use a filter like `blocks.registerBlockType`.

Example (variation):

```js
wp.blocks.registerBlockVariation('groundworx/carousel', {
    name: 'minimal-style',
    title: 'Minimal Style',
    attributes: {
        template: 'minimal',
        splideOptions: {
            type: 'fade',
            arrows: true,
            pagination: false
        }
    },
    isDefault: false
});

```

== About ==

Groundworx Carousel is part of the Groundworx Block Suite — a modular collection of high-performance, design-focused blocks built for modern WordPress development.

Created and maintained by Johanne Courtright, a WordPress developer and UI/UX specialist with a passion for accessible, customizable interfaces.

Visit https://groundworx.dev for more blocks, documentation, and upcoming releases.