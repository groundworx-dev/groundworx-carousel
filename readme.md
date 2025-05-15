# Groundworx Carousel Block

A powerful and responsive carousel block built with Splide.js and fully integrated into the WordPress block editor.

[Website](https://groundworx.dev) • [Plugin Repo](https://github.com/groundworx-dev/groundworx-carousel) • [License: GPLv2 or later](https://www.gnu.org/licenses/gpl-2.0.html)  
[![Support on Ko-fi](https://img.shields.io/badge/Ko--fi-Support%20Groundworx-ff5f5f?logo=ko-fi&logoColor=white&style=flat-square)](https://ko-fi.com/groundworx)


---

## Features

- Native Gutenberg block support  
- Slide, loop, or fade transition types  
- Responsive controls for each breakpoint  
- Arrow and pagination customization  
- Progress bar and slide counter support  
- Grid fallback layout when carousel is disabled  
- Modern, accessible, and lightweight

Perfect for galleries, testimonials, product showcases, hero sliders, and more.

---

## Installation

1. Upload the plugin to `/wp-content/plugins/` or install it via the WordPress admin.
2. Activate it through the **Plugins** menu.
3. Add the **Carousel** block in the Block Editor.
4. Insert any blocks you want inside each slide.
5. Customize carousel behavior via the block settings panel.

---

## FAQ

### Can I use custom blocks inside each slide?

Yes. The Carousel block supports all Gutenberg inner blocks inside each `Slide`.

### Does it support touch/swipe?

Absolutely — Splide.js handles full touch/swipe behavior on mobile and tablet.

### Can I disable the carousel at certain breakpoints?

Yes. You can “destroy” the carousel at specific breakpoints (like `tablet`, `laptop`, or `desktop`) and fall back to a grid layout.  
See **Developer Notes** below for more.

---

## Developer Notes

### Registering custom block variations

You can register block variations using `wp.blocks.registerBlockVariation()` and pass Splide config options via the `splideOptions` attribute.

> ⚠️ Once `destroy: true` is set for a breakpoint, the carousel cannot be reactivated at larger breakpoints.

### Supported breakpoints:

- `tablet`
- `laptop`
- `desktop`


### Example Variations
These follow a mobile-first, **breakpoint-and-up** model.

#### Example: Disable at `tablet`

```js
wp.blocks.registerBlockVariation('groundworx/carousel', {
  name: 'up-to-tablet',
  title: 'Carousel / Grid Tablet',
  attributes: {
    template: 'up-to-tablet',
    splideOptions: {
      type: 'loop',
      perPage: 1,
      focus: 'center',
      breakpoints: {
        tablet: {
          destroy: true
        }
      }
    }
  },
  scope: ['block', 'inserter', 'transform'],
  isActive: blockAttributes => blockAttributes.template === 'up-to-tablet'
});
```

#### Example: Disable at `laptop`, modify at `tablet`
```js
wp.blocks.registerBlockVariation('groundworx/carousel', {
  name: 'up-to-laptop',
  title: 'Carousel / Grid Laptop',
  attributes: {
    template: 'up-to-laptop',
    splideOptions: {
      type: 'loop',
      perPage: 1,
      focus: 'center',
      breakpoints: {
        tablet: {
          perPage: 2,
          arrows: false
        },
        laptop: {
          destroy: true
        }
      }
    }
  },
  scope: ['block', 'inserter', 'transform'],
  isActive: blockAttributes => blockAttributes.template === 'up-to-laptop'
});
```

#### Example: Disable at `desktop`
```js
wp.blocks.registerBlockVariation('groundworx/carousel', {
  name: 'up-to-desktop',
  title: 'Carousel / Grid Desktop',
  attributes: {
    template: 'up-to-desktop',
    splideOptions: {
      type: 'loop',
      fixedWidth: "300px",
      focus: 'center',
      breakpoints: {
        desktop: {
          destroy: true
        }
      }
    }
  },
  scope: ['block', 'inserter', 'transform'],
  isActive: blockAttributes => blockAttributes.template === 'up-to-desktop'
});
```
