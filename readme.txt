=== Groundworx Carousel ===
Contributors: alexandrie
Tags: block, carousel, slider, gutenberg, responsive
Plugin URI: https://wordpress.org/plugins/groundworx-carousel
Author URI: https://groundworx.dev
Donate link: https://ko-fi.com/groundworx
GitHub URI: https://github.com/groundworx-dev/groundworx-carousel
Requires at least: 6.5
Tested up to: 6.8.1
Requires PHP: 8.2
Stable tag: 1.0.2
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

1. Sleek and responsive front-end carousel layout
2. Responsive settings per breakpoint in block editor
3. Customize design with native WordPress controls
4. Grid layout with mobile-first carousel fallback

== Changelog ==

= 1.0.2 =
* Fixed: Breakpoint configuration loading from plugin path.

= 1.0.1 =
* Fixed file exclusions for packaging.
* Updated metadata for WordPress.org compliance.

= 1.0.0 =
* Initial release.

== Frequently Asked Questions ==

= Can I use custom blocks inside each slide? =  
Yes, the Carousel block supports all inner blocks inside each `Slide` block.

= Does it support touch and swipe? =  
Yes. Splide.js provides full touch/swipe navigation on mobile and tablet.

== Upgrade Notice ==

= 1.0.2 =
Fixes a bug with breakpoint configuration. Recommended for all users.

= 1.0.0 =  
First stable release of the Groundworx Carousel block.

== Developer Notes ==

= Supported Breakpoints for Carousel Fallback =

Groundworx Carousel allows you to disable the carousel and fall back to a grid layout at a specific breakpoint by passing `destroy: true` inside `splideOptions.breakpoints`.

The supported breakpoint keys are:

- `tablet`
- `laptop`
- `desktop`

These follow a **mobile-first, breakpoint-and-up** model. For example, using `tablet` will apply the fallback from `tablet` size and up.

You can also use these breakpoints to provide default values for `splideOptions` settings — such as `perPage`, `gap`, or `arrows` — at different screen sizes.  
**Important:** Once the carousel is destroyed via `destroy: true`, it cannot be reactivated at larger breakpoints. All subsequent settings will be ignored.

You can register custom variations using `wp.blocks.registerBlockVariation()` and define breakpoint-specific `splideOptions`.

For full code examples, refer to the GitHub repository:  
https://github.com/groundworx-dev/groundworx-carousel#example-variations

== Source Code ==
The unminified source code is publicly available at:
https://github.com/groundworx-dev/groundworx-carousel

== About ==

Groundworx Carousel is part of the Groundworx Block Suite — a modular collection of high-performance, design-focused blocks built for modern WordPress development.

Created and maintained by Johanne Courtright, a WordPress developer and UI/UX specialist with a passion for accessible, customizable interfaces.

Visit https://groundworx.dev for more blocks, documentation, and upcoming releases.
