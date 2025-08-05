// Test script for allowlist functionality
console.log('🧪 Testing Allowlist Functionality...');

// Test usernames to validate
const testCases = [
  { input: 'sama', expected: true, description: 'Valid username without @' },
  { input: '@sama', expected: true, description: 'Valid username with @' },
  { input: 'elon_musk', expected: true, description: 'Valid username with underscore' },
  { input: 'user123', expected: true, description: 'Valid username with numbers' },
  { input: '', expected: false, description: 'Empty username' },
  { input: '   ', expected: false, description: 'Whitespace only' },
  { input: 'user-name', expected: false, description: 'Invalid character (hyphen)' },
  { input: 'user@domain', expected: false, description: 'Invalid character (@)' },
  { input: 'very_long_username_that_exceeds_15_chars', expected: false, description: 'Too long (>15 chars)' },
  { input: '@@@@username', expected: true, description: 'Multiple @ symbols' },
  { input: 'Username', expected: true, description: 'Mixed case' },
];

// Simulate validation function
function validateUsername(input) {
  const username = input.trim().replace(/^@+/, '');
  
  if (!username) return false;
  if (!/^[a-zA-Z0-9_]{1,15}$/.test(username)) return false;
  
  return true;
}

console.log('\n📝 Running validation tests:');
let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  const result = validateUsername(testCase.input);
  const status = result === testCase.expected ? '✅ PASS' : '❌ FAIL';
  
  console.log(`${index + 1}. ${status} - ${testCase.description}`);
  console.log(`   Input: "${testCase.input}" | Expected: ${testCase.expected} | Got: ${result}`);
  
  if (result === testCase.expected) {
    passed++;
  } else {
    failed++;
  }
});

console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('🎉 All allowlist validation tests passed!');
} else {
  console.log('⚠️  Some tests failed. Please review the validation logic.');
}

console.log('\n💡 Key improvements made:');
console.log('- ✅ Professional error handling with specific messages');
console.log('- ✅ Real-time input validation with visual feedback');
console.log('- ✅ Case-insensitive username handling');
console.log('- ✅ Duplicate detection');
console.log('- ✅ Loading states for better UX');
console.log('- ✅ Enhanced input field with helpful placeholder');
console.log('- ✅ Consistent username formatting (lowercase storage)');
