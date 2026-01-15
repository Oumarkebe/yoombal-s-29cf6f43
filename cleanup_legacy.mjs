
import fs from 'fs';

const filesToDelete = [
    'c:/Mes Sites Web/Yoombal-s/src/pages/premium/SubscriptionShop.tsx',
    'c:/Mes Sites Web/Yoombal-s/src/hooks/useUserPremiumSubscriptions.ts'
];

console.log('🗑️ Starting Cleanup...');

filesToDelete.forEach(f => {
    if (fs.existsSync(f)) {
        try {
            fs.unlinkSync(f);
            console.log(`  ✅ Deleted: ${f.split('/').pop()}`);
        } catch (e) {
            console.error(`  ❌ Error deleting ${f}:`, e.message);
        }
    } else {
        console.log(`  ⚠️ Already gone: ${f.split('/').pop()}`);
    }
});
console.log('Cleanup complete.');
