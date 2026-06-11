const path = require('path');
const fs = require('fs');

const sourcePath = path.join(__dirname, '../public/images/logo/light_logo.png');
const outputDir = path.join(__dirname, '../public/images/logo');

const sizes = [48, 72, 96, 128, 192, 384, 512, 1024];

async function generate() {
  console.log('Reading source image:', sourcePath);

  // Dynamically import Jimp to support both CommonJS and ES Module versions of Jimp (v0 and v1)
  let Jimp;
  try {
    const jimpModule = await import('jimp');
    Jimp = jimpModule.Jimp || jimpModule.default || jimpModule;
  } catch (err) {
    Jimp = require('jimp');
  }

  for (const size of sizes) {
    const destName = size === 1024 ? 'maskable_icon.png' : `maskable_icon_x${size}.png`;
    const destPath = path.join(outputDir, destName);

    console.log(`Resizing to ${size}x${size}...`);

    const image = await Jimp.read(sourcePath);

    if (typeof image.resize === 'function') {
      try {
        // Jimp v0 style or Jimp v1 compatibility layer
        image.resize(size, size);
      } catch (resizeErr) {
        // Jimp v1 style
        image.resize({ w: size, h: size });
      }
    } else {
      image.resize({ w: size, h: size });
    }

    if (typeof image.writeAsync === 'function') {
      await image.writeAsync(destPath);
    } else if (typeof image.write === 'function') {
      await image.write(destPath);
    } else {
      throw new Error('Could not find write method on Jimp image object');
    }

    console.log(`Saved: ${destName}`);
  }
  console.log('All maskable icons generated successfully!');

  // Generate favicons of size 16x16 and 32x32
  const faviconOutputDir = path.join(__dirname, '../public/images/app-icon');
  const faviconSizes = [16, 32];
  console.log('Generating favicons...');
  for (const size of faviconSizes) {
    const destName = `favicon-${size}.png`;
    const destPath = path.join(faviconOutputDir, destName);
    
    console.log(`Resizing favicon to ${size}x${size}...`);
    const image = await Jimp.read(sourcePath);
    
    if (typeof image.resize === 'function') {
      try {
        image.resize(size, size);
      } catch (resizeErr) {
        image.resize({ w: size, h: size });
      }
    } else {
      image.resize({ w: size, h: size });
    }

    if (typeof image.writeAsync === 'function') {
      await image.writeAsync(destPath);
    } else if (typeof image.write === 'function') {
      await image.write(destPath);
    } else {
      throw new Error('Could not find write method on Jimp image object');
    }
    console.log(`Saved favicon: ${destName}`);
  }
  console.log('All favicons generated successfully!');
}

generate().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
