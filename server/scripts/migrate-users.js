#!/usr/bin/env node

/**
 * User Migration Script - Update existing users to use new role system
 * This script helps migrate from the old role/roleString system to the new Role table
 */

console.log('=== User Role Migration Script ===\n');

console.log('Step 1: Update existing users based on their roleString');
console.log('Execute these mutations to migrate existing users:\n');

const roleMappings = [
  { oldRole: 'customer', newRoleId: 'customer' },
  { oldRole: 'staff', newRoleId: 'staff' },
  { oldRole: 'manager', newRoleId: 'manager' },
  { oldRole: 'admin', newRoleId: 'admin' }
];

roleMappings.forEach(mapping => {
  console.log(`# Migrate users with roleString: "${mapping.oldRole}"`);
  console.log('mutation {');
  console.log('  user_updateMany(');
  console.log(`    where: { roleString: { eq: "${mapping.oldRole}" } }`);
  console.log('    data: {');
  console.log(`      roleId: "${mapping.newRoleId}"`);
  console.log('    }');
  console.log('  ) {');
  console.log('    count');
  console.log('  }');
  console.log('}\n');
});

console.log('Step 2: Update admin users based on isAdmin flag');
console.log(`# Set admin role for users with isAdmin: true`);
console.log('mutation {');
console.log('  user_updateMany(');
console.log('    where: { isAdmin: { eq: true } }');
console.log('    data: {');
console.log('      roleId: "admin"');
console.log('      roleString: "admin"');
console.log('    }');
console.log('  ) {');
console.log('    count');
console.log('  }');
console.log('}\n');

console.log('Step 3: Verify migration');
console.log('# Check users by role');
console.log('query {');
console.log('  customers: users(where: { roleId: { eq: "customer" } }) {');
console.log('    id');
console.log('    fullname');
console.log('    roleString');
console.log('  }');
console.log('  staff: users(where: { roleId: { eq: "staff" } }) {');
console.log('    id');
console.log('    fullname');
console.log('    roleString');
console.log('  }');
console.log('  managers: users(where: { roleId: { eq: "manager" } }) {');
console.log('    id');
console.log('    fullname');
console.log('    roleString');
console.log('  }');
console.log('  admins: users(where: { roleId: { eq: "admin" } }) {');
console.log('    id');
console.log('    fullname');
console.log('    roleString');
console.log('  }');
console.log('}\n');

console.log('=== Migration Instructions ===');
console.log('1. First run init-roles.js to create the role table');
console.log('2. Execute the mutations above in Firebase GraphQL Playground');
console.log('3. Verify the migration with the verification query');
console.log('4. Update your client code to use the new role system');
console.log('5. Keep legacy fields for backward compatibility during transition');
