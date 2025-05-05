# Groundworx Carousel Block

A powerful and responsive carousel block built with Splide.js and fully integrated into the WordPress block editor.

[Website](https://groundworx.dev) • [License: GPLv2 or later](https://www.gnu.org/licenses/gpl-2.0.html)

---

## Features

- Native Gutenberg block support  
- Slide, loop, or fade transition types  
- Responsive controls for each breakpoint  
- Arrow and pagination customization  
- Progress bar and slide counter support  
- Grid fallback layout when carousel is disabled  
- Modern, accessible, and lightweight

Perfect for building galleries, content sliders, testimonials, product showcases, and more.

---

## Installation

1. Upload the plugin to `/wp-content/plugins/` or install it via the WordPress admin.
2. Activate it through the “Plugins” menu.
3. Add the **Carousel** block from the Block Editor.
4. Insert any blocks you want inside each slide.
5. Customize settings via the block sidebar.

---

## Screenshots

1. Carousel block in the editor  
2. Inspector Controls with options  
3. Responsive layout with flexible slide content

---

## Frequently Asked Questions

### Can I use custom blocks inside each slide?

Yes. The Carousel block supports all Gutenberg inner blocks inside each `Slide`.

### Does it support touch/swipe?

Absolutely — Splide.js handles full touch/swipe behavior on mobile and tablet.

### Can I disable the carousel for specific breakpoints?

Yes. You can “destroy” the carousel at selected breakpoints and switch to a grid layout.

---

## Developer Notes

### Can I register custom block variations?

Yes. The block supports `wp.blocks.registerBlockVariation()` for variations like style presets. You can pass Splide options directly in the `splideOptions` attribute.

Note: `supports` (e.g., `arrowStyle`) cannot be modified via variations. Use `blocks.registerBlockType` filters for those.

#### Example:

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
