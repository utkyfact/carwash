import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

/**
 * Import ifadelerini günceller
 */
function updateImports(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    
    // DataContext yolunu güncelle
    let updatedContent = content.replace(
      /import\s+\{([^}]+)\}\s+from\s+['"]\.\.\/context\/DataContext['"];/g,
      'import {$1} from \'../redux/compat/DataContextCompat\';'
    );
    
    // OrderContext yolunu güncelle
    updatedContent = updatedContent.replace(
      /import\s+\{([^}]+)\}\s+from\s+['"]\.\.\/context\/OrderContext['"];/g,
      'import {$1} from \'../redux/compat/OrderContextCompat\';'
    );
    
    // Sadece değişiklik varsa dosyayı yaz
    if (content !== updatedContent) {
      writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ Güncellendi: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (err) {
    console.error(`❌ Hata: ${filePath} dosyası güncellenirken hata oluştu:`, err);
    return false;
  }
}

/**
 * Dizindeki tüm .jsx dosyalarını işler
 */
function processDirectory(dir) {
  const files = readdirSync(dir);
  let updatedCount = 0;
  
  for (const file of files) {
    const filePath = join(dir, file);
    const stats = statSync(filePath);
    
    if (stats.isDirectory()) {
      // Alt dizinleri işle, components ve pages klasörlerini kontrol et
      if (file === 'components' || file === 'pages') {
        updatedCount += processDirectory(filePath);
      }
    } else if (stats.isFile() && (file.endsWith('.jsx') || file.endsWith('.js'))) {
      // .jsx ve .js dosyalarını işle
      if (updateImports(filePath)) {
        updatedCount++;
      }
    }
  }
  
  return updatedCount;
}

// Ana klasörden başla
const rootDir = './src';
console.log('🔍 Context import yollarını güncelleme işlemi başlatılıyor...');
const totalUpdated = processDirectory(rootDir);
console.log(`✨ İşlem tamamlandı! ${totalUpdated} dosya güncellendi.`); 