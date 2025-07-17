const fs = require('fs');
const path = require('path');

const placeholderImages = [
  'hero-meal-plan.jpg',
  'web-platform.jpg',
  'ios-platform.jpg',
  'android-platform.jpg',
  'how-it-works-hero.jpg',
  'video-thumbnail.jpg',
  'step-1.jpg',
  'step-2.jpg',
  'step-3.jpg',
];

const avatarImages = ['avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg'];

const publicDir = path.join(process.cwd(), 'public');
const imagesDir = path.join(publicDir, 'images');
const avatarsDir = path.join(publicDir, 'avatars');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log('✓ Created images directory');
}
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
  console.log('✓ Created avatars directory');
}

const createImagePlaceholder = (filename, width = 800, height = 600) => {
  const name = filename.replace(/\.[^/.]+$/, '');
  const displayName = name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#e5e7eb"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#6b7280" text-anchor="middle" dy=".3em">${displayName}</text>
</svg>`;
};

const createAvatarPlaceholder = filename => {
  const name = filename.replace(/\.[^/.]+$/, '');
  const letter = name.slice(-1).toUpperCase();

  return `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="100" fill="#3b82f6"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="72" fill="white" text-anchor="middle" dy=".3em">${letter}</text>
</svg>`;
};

console.log('🎨 Generating placeholder images...\n');

placeholderImages.forEach(filename => {
  const svgContent = createImagePlaceholder(filename);
  const filePath = path.join(imagesDir, filename.replace('.jpg', '.svg'));
  fs.writeFileSync(filePath, svgContent);
  console.log(`✓ Created: /images/${filename.replace('.jpg', '.svg')}`);
});

console.log('');

avatarImages.forEach(filename => {
  const svgContent = createAvatarPlaceholder(filename);
  const filePath = path.join(avatarsDir, filename.replace('.jpg', '.svg'));
  fs.writeFileSync(filePath, svgContent);
  console.log(`✓ Created: /avatars/${filename.replace('.jpg', '.svg')}`);
});

console.log('\n🎉 All placeholder images created successfully!');
console.log(`📁 Images location: ${imagesDir}`);
console.log(`📁 Avatars location: ${avatarsDir}`);
