const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

async function compressImages() {
  console.log('🖼️  Starting image compression...\n');

  const patterns = [
    'public/paslon/**/*.{jpg,jpeg,png}',
    'public/jurusan/**/*.{jpg,jpeg,png}',
    'public/simulasi/**/*.{jpg,jpeg,png}',
    'public/steps/**/*.{jpg,jpeg,png}',
    'public/info/**/*.{jpg,jpeg,png}',
    'src/assets/**/*.{jpg,jpeg,png}'
  ];

  let totalBefore = 0;
  let totalAfter = 0;
  let count = 0;

  for (const pattern of patterns) {
    const files = glob.sync(pattern);
    
    for (const file of files) {
      try {
        const before = fs.statSync(file).size;
        totalBefore += before;

        // Check if it's a PNG or JPG
        const ext = path.extname(file).toLowerCase();
        
        if (ext === '.png') {
          await sharp(file)
            .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
            .png({ quality: 80, progressive: true })
            .toFile(file + '.tmp');
        } else if (ext === '.jpg' || ext === '.jpeg') {
          await sharp(file)
            .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 85, progressive: true })
            .toFile(file + '.tmp');
        }

        const after = fs.statSync(file + '.tmp').size;
        
        // Replace original
        fs.unlinkSync(file);
        fs.renameSync(file + '.tmp', file);
        totalAfter += after;

        const reduction = ((before - after) / before * 100).toFixed(1);
        console.log(`✓ ${path.basename(file)}`);
        console.log(`  ${(before / 1024).toFixed(2)} KB → ${(after / 1024).toFixed(2)} KB (${reduction}% reduction)\n`);
        count++;
      } catch (error) {
        console.log(`✗ ${file}: ${error.message}\n`);
      }
    }
  }

  const saved = totalBefore - totalAfter;
  const reduction = ((saved / totalBefore) * 100).toFixed(1);
  
  console.log('\n📊 Summary:');
  console.log(`  Files processed: ${count}`);
  console.log(`  Before: ${(totalBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  After: ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Saved: ${(saved / 1024 / 1024).toFixed(2)} MB (${reduction}% reduction)\n`);
}

compressImages().catch(error => console.error('Error:', error));

