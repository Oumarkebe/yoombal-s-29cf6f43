
import fs from 'fs';

const filesToCheck = [
    'c:/Mes Sites Web/Yoombal-s/src/pages/Subscriptions.tsx',
    'c:/Mes Sites Web/Yoombal-s/src/components/subscription/PlanCard.tsx',
    'c:/Mes Sites Web/Yoombal-s/src/pages/premium/MySubscriptions.tsx',
    'c:/Mes Sites Web/Yoombal-s/src/pages/Profile.tsx',
    'c:/Mes Sites Web/Yoombal-s/src/components/premium/PremiumFeatureGate.tsx',
    'c:/Mes Sites Web/Yoombal-s/src/components/ai/AIAssistant.tsx',
    'c:/Mes Sites Web/Yoombal-s/src/pages/Pricing.tsx'
];

const legacyFiles = [
    'c:/Mes Sites Web/Yoombal-s/src/pages/premium/SubscriptionShop.tsx',
    'c:/Mes Sites Web/Yoombal-s/src/hooks/useUserPremiumSubscriptions.ts'
];

console.log('🔍 Starting Final Verification...\n');

// 1. Check New Files Exist
console.log('📂 Checking Critical Files:');
let allExist = true;
filesToCheck.forEach(f => {
    if (fs.existsSync(f)) {
        console.log(`  ✅ Found: ${f.split('/').pop()}`);
    } else {
        console.log(`  ❌ MISSING: ${f}`);
        allExist = false;
    }
});

// 2. Check Legacy Files Deleted
console.log('\n🗑️ Checking Legacy Cleanup:');
let allDeleted = true;
legacyFiles.forEach(f => {
    if (!fs.existsSync(f)) {
        console.log(`  ✅ Deleted: ${f.split('/').pop()}`);
    } else {
        console.log(`  ❌ STILL EXISTS: ${f}`);
        allDeleted = false;
    }
});

// 3. Scan for Legacy Hook Usage
console.log('\n🔎 Scanning for legacy usage (useUserPremiumSubscriptions):');
let cleanCode = true;
filesToCheck.forEach(f => {
    if (fs.existsSync(f)) {
        const content = fs.readFileSync(f, 'utf-8');
        if (content.includes('useUserPremiumSubscriptions')) {
            console.log(`  ❌ FOUND LEGACY HOOK IN: ${f.split('/').pop()}`);
            cleanCode = false;
        }
    }
});
if (cleanCode) console.log('  ✅ No legacy hook usage found in key files.');


console.log('\n-----------------------------------');
if (allExist && allDeleted && cleanCode) {
    console.log('🎉 VERIFICATION PASSED: System is ready!');
} else {
    console.log('⚠️ VERIFICATION FAILED: Please review issues above.');
}
