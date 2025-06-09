#!/usr/bin/env node

/**
 * Initialize Role Table with Default Roles
 * Run this script after deploying the schema to populate default roles
 */

const roles = [
  {
    id: 'customer',
    name: 'customer',
    description: 'Standard customer with basic access to services',
    permissions: JSON.stringify([
      'view_services',
      'book_appointments',
      'view_own_results',
      'update_own_profile',
      'view_own_orders'
    ])
  },
  {
    id: 'staff',
    name: 'staff',
    description: 'Lab staff member with operational access',
    permissions: JSON.stringify([
      'view_services',
      'manage_appointments',
      'process_samples',
      'update_test_results',
      'view_all_orders',
      'manage_lab_operations'
    ])
  },
  {
    id: 'manager',
    name: 'manager',
    description: 'Manager with administrative and operational oversight',
    permissions: JSON.stringify([
      'view_services',
      'manage_appointments',
      'manage_staff',
      'view_reports',
      'manage_lab_operations',
      'approve_results',
      'manage_services',
      'view_analytics'
    ])
  },
  {
    id: 'admin',
    name: 'admin',
    description: 'System administrator with full access',
    permissions: JSON.stringify([
      'full_access',
      'manage_users',
      'manage_roles',
      'system_settings',
      'view_all_data',
      'manage_security',
      'audit_logs'
    ])
  }
];

console.log('=== ADN Lab Role Initialization ===\n');
console.log('Use these GraphQL mutations to initialize roles in your Data Connect:\n');

roles.forEach(role => {
  console.log(`# Create ${role.name} role`);
  console.log('mutation {');
  console.log('  role_insert(data: {');
  console.log(`    id: "${role.id}"`);
  console.log(`    name: "${role.name}"`);
  console.log(`    description: "${role.description}"`);
  console.log(`    permissions: """${role.permissions}"""`);
  console.log('    isActive: true');
  console.log('  }) {');
  console.log('    id');
  console.log('    name');
  console.log('  }');
  console.log('}\n');
});

console.log('=== Instructions ===');
console.log('1. Copy the mutations above');
console.log('2. Go to your Firebase Console > Data Connect > GraphQL Playground');
console.log('3. Paste and execute each mutation');
console.log('4. Verify roles are created successfully');
console.log('\nAlternatively, use the Firebase Data Connect SDK in your application to create these roles programmatically.');
