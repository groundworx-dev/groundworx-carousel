# Groundworx Carousel Block

[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/gpl-2.0)
[![WordPress](https://img.shields.io/badge/WordPress-6.5%2B-blue.svg)](https://wordpress.org/)
[![PHP](https://img.shields.io/badge/PHP-8.2%2B-purple.svg)](https://php.net/)
[![Splide.js](https://img.shields.io/badge/Splide.js-4.x-green.svg)](https://splidejs.com/)

A powerful and responsive carousel block built with Splide.js and fully integrated into the WordPress block editor. Create stunning carousels with professional templates, advanced responsive controls, and seamless touch support.

[**Website**](https://groundworx.dev) • [**WordPress Plugin**](https://wordpress.org/plugins/groundworx-carousel/) • [**Support**](https://ko-fi.com/groundworx)

---

## ✨ Features

### 🎨 Nine Professional Design Templates

Choose from carefully designed templates for different content styles:

- **Default / Default-Alt** - Classic carousel layouts with external navigation
- **Simple / Simple-Left / Simple-Right** - Minimalist designs with flexible content positioning  
- **Overlay / Overlay-Alt** - Modern overlaid content with gradient backgrounds
- **Partial Overlay / Partial Overlay-Alt** - Split layouts with balanced content presentation

### 📱 Advanced Responsive System

- **8 breakpoint levels** - Mobile/default (0-374px), phone (375px+), large-phone (480px+), tablet (680px+), large-tablet (960px+), laptop (1080px+), desktop (1280px+), large-desktop (1440px+)
- **Per-breakpoint configuration** - Control carousel behavior at each screen size independently
- **Responsive grid fallback** - Destroy the carousel at any breakpoint and display slides as a grid
- **Mobile-first with inheritance** - Settings cascade from mobile to larger screens
- **Touch/swipe gestures** - Full mobile and tablet touch support powered by Splide.js
- **Precise responsive control** - Fine-tune carousel behavior across all device sizes

### 🎯 Carousel Modes & Transitions

- **Slide** - Classic horizontal sliding carousel
- **Loop** - Infinite continuous scrolling with clones
- **Fade** - Smooth crossfade transitions between slides

### ⚙️ Flexible Display Options

- Multiple slides per page (responsive)
- Variable or fixed slide widths
- Center mode with focus control
- Customizable gap spacing
- Autoplay with interval and pause-on-hover
- Rewind or loop behaviors
- Auto-height adjustment

### 🎚️ Navigation & UI Controls

**11 Arrow Styles:**
- arrow, chevron, chevronRounded, halfArrow, play, playRounded, sharpChevron, thinChevron, thinChevronRounded, triangle, triangleRounded

**9 Pagination Styles:**
- circle, circleOutline, square, squareOutline, diamond, diamondOutline, rectangle, rectangleOutline, number

**Additional Features:**
- Progress bar indicator
- Slide counter display (e.g., "3 / 10")
- Per-breakpoint visibility controls
- Full color customization for all UI elements

### 🎨 Advanced Color Controls

Customize every UI element with independent color pickers:

- **Arrows** - text, background, border colors
- **Active Pagination** - text, background, border colors
- **Inactive Pagination** - text, background, border colors
- **Progress Bar** - foreground and background colors
- **Counter** - text color

### ♿ Accessibility First

- ARIA labels and semantic HTML
- Keyboard navigation support
- Screen reader friendly
- WCAG 2.1 AA compliant
- Focus management

### 🎭 Works With Any Block

- Core Image block
- Core Paragraph block
- Core Heading block
- Core Group block
- Core Cover block
- Core Buttons block
- Custom blocks from other plugins
- Your own custom blocks

### 🔧 Developer Features

- Block variations support
- Custom Splide.js options via attributes
- Extensible template system with WordPress hooks
- Breakpoint configuration via JSON
- React hooks for responsive state management
- CSS custom properties integration
- Well-documented code structure

---

## 📦 Installation

### Automatic (WordPress Admin)

1. Log in to your WordPress admin dashboard
2. Navigate to **Plugins > Add New**
3. Search for **"Groundworx Carousel"**
4. Click **Install Now** and then **Activate**

### Manual Installation

1. Download the latest release from [WordPress.org](https://wordpress.org/plugins/groundworx-carousel/) or [GitHub Releases](https://github.com/groundworx-dev/groundworx-carousel/releases)
2. Upload the ZIP file via **Plugins > Add New > Upload Plugin**
3. Activate the plugin

### Development Installation

```bash
# Clone the repository
git clone https://github.com/groundworx-dev/groundworx-carousel.git

# Navigate to the plugin directory
cd groundworx-carousel

# Install dependencies
npm install
# or
yarn install

# Build the plugin
npm run build
# or  
yarn build

# For development with watch mode
npm run start
# or
yarn start
```

---

## 🚀 Quick Start

1. **Add the block** - In the block editor, click `+` and search for "Carousel" or find it under "Design"
2. **Choose a template** - Select from 9 professional templates or start with default
3. **Add content** - Insert any WordPress blocks as slides (images, text, groups, etc.)
4. **Configure settings** - Use the sidebar panel to customize carousel behavior
5. **Set responsive options** - Configure per-breakpoint settings for optimal display
6. **Customize styling** - Choose arrow/pagination styles and set colors
7. **Preview and publish** - Test your carousel and publish when ready

---

## 📖 Usage Examples

### Basic Image Carousel

```html
<!-- wp:groundworx/carousel {"splideOptions":{"type":"loop","perPage":1,"arrows":true,"pagination":true}} -->
  <!-- wp:groundworx/slide -->
    <!-- wp:image -->
    <figure class="wp-block-image"><img src="image1.jpg" alt="Slide 1"/></figure>
    <!-- /wp:image -->
  <!-- /wp:groundworx/slide -->
  
  <!-- wp:groundworx/slide -->
    <!-- wp:image -->
    <figure class="wp-block-image"><img src="image2.jpg" alt="Slide 2"/></figure>
    <!-- /wp:image -->
  <!-- /wp:groundworx/slide -->
<!-- /wp:groundworx/carousel -->
```

### Responsive Grid Fallback

Destroy the carousel at tablet breakpoint and display as a grid:

```javascript
{
  "template": "default",
  "splideOptions": {
    "type": "loop",
    "perPage": 1,
    "arrows": true,
    "pagination": true
  },
  "breakpoints": {
    "tablet": {
      "layout": {
        "type": "grid",
        "columnCount": 3
      }
    }
  }
}
```

### Auto-Width Carousel with Center Mode

```javascript
{
  "splideOptions": {
    "type": "loop",
    "fixedWidth": "300px",
    "focus": "center",
    "gap": "1rem",
    "arrows": true
  }
}
```

---

## 🎨 Templates

Version 2.0 includes 9 professionally designed templates:

| Template | Description |
|----------|-------------|
| `default` | Classic layout with standard navigation |
| `default-alt` | Alternative classic layout |
| `simple` | Minimalist design, center-aligned content |
| `simple-left` | Minimalist with left-aligned content |
| `simple-right` | Minimalist with right-aligned content |
| `overlay` | Content overlaid on images with gradient |
| `overlay-alt` | Alternative overlay design |
| `partial-overlay` | Split layout with partial overlay |
| `partial-overlay-alt` | Alternative partial overlay |

### Adding Custom Templates

Use the `groundworx.carousel.templates` filter:

```javascript
wp.hooks.addFilter(
  'groundworx.carousel.templates',
  'my-theme/add-custom-template',
  (templates) => [
    ...templates,
    {
      label: 'My Custom Template',
      value: 'my-custom'
    }
  ]
);
```

Then add your styles:

```css
.template-my-custom .splide__slide {
  /* Your custom styles */
}
```

---

## 🔧 Developer Guide

### Block Variations

Register custom carousel variations:

```javascript
wp.blocks.registerBlockVariation('groundworx/carousel', {
  name: 'carousel-to-tablet',
  title: 'Carousel / Grid Tablet',
  attributes: {
    template: 'default',
    splideOptions: {
      type: 'loop',
      perPage: 1,
      arrows: true,
      pagination: true
    },
    breakpoints: {
      tablet: {
        layout: {
          type: 'grid',
          columnCount: 3
        }
      }
    }
  },
  scope: ['block', 'inserter', 'transform']
});
```

### Breakpoints

7 configurable responsive breakpoints plus mobile/default base following a mobile-first approach:

- **Mobile/Default**: 0-374px (base configuration)
- **phone**: 375px and up
- **large-phone**: 480px and up
- **tablet**: 680px and up
- **large-tablet**: 960px and up
- **laptop**: 1080px and up
- **desktop**: 1280px and up
- **large-desktop**: 1440px and up

Settings cascade from mobile to larger screens (mobile-first approach). You can configure carousel behavior independently at each breakpoint or let settings inherit from smaller breakpoints.

### Splide.js Options

All [Splide.js options](https://splidejs.com/guides/options/) are supported via the `splideOptions` attribute:

```javascript
{
  type: 'loop',           // 'slide', 'loop', or 'fade'
  perPage: 3,             // Number of slides per page
  fixedWidth: '300px',    // Fixed width for each slide
  gap: '1rem',            // Space between slides
  autoplay: true,         // Enable autoplay
  interval: 3000,         // Autoplay interval (ms)
  speed: 800,             // Transition speed (ms)
  rewind: true,           // Enable rewind
  arrows: true,           // Show/hide arrows
  pagination: true,       // Show/hide pagination
  focus: 'center',        // Center mode
  autoHeight: true        // Adjust height to current slide
}
```

### CSS Custom Properties

```css
/* Arrow Colors */
--gwx--color--arrows
--gwx--background-color--arrows
--gwx--border-color--arrows

/* Active Pagination Colors */
--gwx--color--pagination
--gwx--background-color--pagination
--gwx--border-color--pagination

/* Inactive Pagination Colors */
--gwx--color--inactive-pagination
--gwx--background-color--inactive-pagination
--gwx--border-color--inactive-pagination

/* Progress Bar Colors */
--gwx--color--progress
--gwx--background-color--progress

/* Counter Color */
--gwx--color--counter
```

### React Hooks

The plugin provides React hooks for responsive state management:

```javascript
import { useResponsiveState, useSplideOptions } from './hooks/use-responsive-state';

// Generic responsive state management
const splideState = useResponsiveState(attributes, setAttributes, 'splideOptions', defaults);

// Specifically for splideOptions
const splideState = useSplideOptions(attributes, setAttributes, defaults);

// API
splideState.get(key, breakpoint)         // Get value at breakpoint
splideState.getResolved(key, breakpoint) // Get resolved value with inheritance
splideState.set(key, breakpoint, value)  // Set value at breakpoint
splideState.has(key, breakpoint)         // Check if explicitly set
splideState.reset(key, breakpoint)       // Reset to default
```

---

## 📊 Requirements

- **WordPress**: 6.5 or higher
- **PHP**: 8.2 or higher
- **Browser**: Modern browsers with ES6+ support
- **Dependencies**: 
  - Splide.js 4.x (included)
  - @groundworx/components 1.x (included)
  - @groundworx/foundation 1.x (included)
  - @groundworx/utils 1.x (included)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Changelog

### 2.0.0 - November 12, 2024

**Major Update - Complete Redesign**

- Added 9 professional design templates
- Introduced comprehensive responsive control system with 8 breakpoint levels (mobile/default + 7 configurable breakpoints)
- Added responsive grid fallback option at any breakpoint
- New advanced color controls for all UI elements
- Added 11 arrow style options and 9 pagination style options
- Implemented progress bar and slide counter
- Enhanced responsive system with inheritance
- Extensible template system via WordPress hooks
- React hooks for responsive state management
- Performance optimizations
- Accessibility improvements

See [CHANGELOG.md](CHANGELOG.md) for full version history.

---

## 📄 License

This project is licensed under the GPL v2 or later - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

- **Built with**: [Splide.js](https://splidejs.com/) by Naotoshi Fujita
- **Developer**: Johanne Courtright
- **Company**: Groundworx Agency LLC
- **Website**: [groundworx.dev](https://groundworx.dev)
- **Support**: [Ko-fi](https://ko-fi.com/groundworx)

---

## 🔗 Links

- [WordPress Plugin Directory](https://wordpress.org/plugins/groundworx-carousel/)
- [Documentation](https://github.com/groundworx-dev/groundworx-carousel#readme)
- [Issue Tracker](https://github.com/groundworx-dev/groundworx-carousel/issues)
- [Groundworx Core](https://groundworx.dev)
- [Splide.js Documentation](https://splidejs.com/)

---

## 💬 Support

For support, feature requests, or bug reports:

- **GitHub Issues**: https://github.com/groundworx-dev/groundworx-carousel/issues
- **WordPress Forums**: https://wordpress.org/support/plugin/groundworx-carousel/
- **Website**: https://groundworx.dev
- **Ko-fi**: https://ko-fi.com/groundworx

---

Made with ❤️ by [Groundworx](https://groundworx.dev)