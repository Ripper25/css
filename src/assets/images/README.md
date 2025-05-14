# Image Assets for CCS Application

## About Page Full-Screen Hero Image

The About page design requires an image to be placed in the center section of the full-page hero design.

too much input

1. Place your image file in this directory (`src/assets/images/`)
2. Name it something descriptive like `about-hero.jpg` or `team-member.jpg`
3. Then update the About.tsx file to use this image:

```tsx
// In src/pages/About.tsx
// Replace the placeholder div with this:
<div className="hidden md:block md:w-1/3">
  <img
    src="/src/assets/images/your-image-filename.jpg"
    alt="CCS Team Member"
    className="h-full w-full object-cover"
  />
</div>
```

The image should ideally:
- Be in portrait orientation
- Have dimensions that work well in a full-height layout (approximately 500px wide by 100vh tall)
- Show a professional setting that aligns with the CCS mission
- Have a blue tint/overlay to match the design

### Image Optimization

For best performance:
- Compress the image before adding it to the project
- Consider using WebP format for better compression
- Keep the file size under 300KB if possible

### Note on Layout

The About page now features:
1. A full-screen hero section with the three-column layout shown in the design
2. The MainLayout wrapper that provides navigation and routing
3. The Values and Clients sections below the hero (visible when scrolling down)
