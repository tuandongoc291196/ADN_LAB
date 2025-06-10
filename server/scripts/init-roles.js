#!/usr/bin/env node

/**
 * Initialize Database with Default Data for DNA Testing Platform
 * Run this script after deploying the schema to populate initial data
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
      'view_own_orders',
      'provide_feedback'
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
      'manage_lab_operations',
      'collect_samples'
    ])
  },
  {
    id: 'technician',
    name: 'technician',
    description: 'Lab technician focused on testing and analysis',
    permissions: JSON.stringify([
      'view_services',
      'process_samples',
      'conduct_tests',
      'update_test_results',
      'manage_lab_equipment',
      'quality_control'
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
      'view_analytics',
      'verify_results'
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
      'audit_logs',
      'manage_services',
      'financial_reports'
    ])
  }
];

const dnaServices = [
  {
    id: 'paternity-test',
    name: 'Paternity Test',
    description: 'Determine biological relationship between alleged father and child',
    price: 299.99,
    durationDays: 5,
    sampleType: 'Saliva',
    atHomeAvailable: true,
    kitCost: 25.00
  },
  {
    id: 'ancestry-dna',
    name: 'Ancestry DNA Analysis',
    description: 'Trace your ethnic origins and find relatives',
    price: 149.99,
    durationDays: 10,
    sampleType: 'Saliva',
    atHomeAvailable: true,
    kitCost: 15.00
  },
  {
    id: 'health-screening',
    name: 'Genetic Health Screening',
    description: 'Screen for genetic predispositions to health conditions',
    price: 399.99,
    durationDays: 14,
    sampleType: 'Blood',
    atHomeAvailable: false,
    kitCost: 0.00
  },
  {
    id: 'carrier-screening',
    name: 'Carrier Screening',
    description: 'Test for genetic conditions that could be passed to children',
    price: 199.99,
    durationDays: 7,
    sampleType: 'Saliva',
    atHomeAvailable: true,
    kitCost: 20.00
  },
  {
    id: 'pharmacogenomics',
    name: 'Pharmacogenomics Testing',
    description: 'Determine how genes affect response to medications',
    price: 249.99,
    durationDays: 12,
    sampleType: 'Cheek Swab',
    atHomeAvailable: true,
    kitCost: 18.00
  },
  {
    id: 'wellness-dna',
    name: 'Wellness DNA Profile',
    description: 'Personalized nutrition and fitness recommendations based on genetics',
    price: 179.99,
    durationDays: 8,
    sampleType: 'Saliva',
    atHomeAvailable: true,
    kitCost: 15.00
  }
];

const sampleKits = [
  { id: 'kit-001', amount: 50 },
  { id: 'kit-002', amount: 30 },
  { id: 'kit-003', amount: 25 },
  { id: 'kit-004', amount: 40 },
  { id: 'kit-005', amount: 35 }
];

console.log('=== ADN Lab Database Initialization ===\n');

console.log('# ====== ROLE INITIALIZATION ======\n');
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

console.log('# ====== DNA SERVICES INITIALIZATION ======\n');
dnaServices.forEach(service => {
  console.log(`# Create ${service.name} service`);
  console.log('mutation {');
  console.log('  dnaService_insert(data: {');
  console.log(`    id: "${service.id}"`);
  console.log(`    name: "${service.name}"`);
  console.log(`    description: "${service.description}"`);
  console.log(`    price: ${service.price}`);
  console.log(`    durationDays: ${service.durationDays}`);
  console.log(`    sampleType: "${service.sampleType}"`);
  console.log(`    atHomeAvailable: ${service.atHomeAvailable}`);
  console.log(`    kitCost: ${service.kitCost}`);
  console.log('    active: true');
  console.log('  }) {');
  console.log('    id');
  console.log('    name');
  console.log('  }');
  console.log('}\n');
});

console.log('# ====== SAMPLE KITS INITIALIZATION ======\n');
sampleKits.forEach(kit => {
  console.log(`# Create sample kit ${kit.id}`);
  console.log('mutation {');
  console.log('  kit_insert(data: {');
  console.log(`    id: "${kit.id}"`);
  console.log(`    amount: ${kit.amount}`);
  console.log('    status: "available"');
  console.log('  }) {');
  console.log('    id');
  console.log('    status');
  console.log('  }');
  console.log('}\n');
});

console.log('# ====== SAMPLE TIME SLOTS (Example for next 7 days) ======\n');
const today = new Date();
for (let i = 1; i <= 7; i++) {
  const slotDate = new Date(today);
  slotDate.setDate(today.getDate() + i);
  const dateStr = slotDate.toISOString().split('T')[0];
  
  // Morning slots
  console.log(`# Create morning time slots for ${dateStr}`);
  for (let hour = 9; hour <= 11; hour++) {
    const slotId = `slot-${dateStr}-${hour}00`;
    console.log('mutation {');
    console.log('  timeSlot_insert(data: {');
    console.log(`    id: "${slotId}"`);
    console.log(`    slotDate: "${dateStr}"`);
    console.log(`    startTime: "${hour.toString().padStart(2, '0')}:00"`);
    console.log(`    endTime: "${(hour + 1).toString().padStart(2, '0')}:00"`);
    console.log('    maxCapacity: 5');
    console.log('    currentBookings: 0');
    console.log('    available: true');
    console.log('  }) {');
    console.log('    id');
    console.log('    slotDate');
    console.log('  }');
    console.log('}\n');
  }
  
  // Afternoon slots
  console.log(`# Create afternoon time slots for ${dateStr}`);
  for (let hour = 14; hour <= 16; hour++) {
    const slotId = `slot-${dateStr}-${hour}00`;
    console.log('mutation {');
    console.log('  timeSlot_insert(data: {');
    console.log(`    id: "${slotId}"`);
    console.log(`    slotDate: "${dateStr}"`);
    console.log(`    startTime: "${hour.toString().padStart(2, '0')}:00"`);
    console.log(`    endTime: "${(hour + 1).toString().padStart(2, '0')}:00"`);
    console.log('    maxCapacity: 5');
    console.log('    currentBookings: 0');
    console.log('    available: true');
    console.log('  }) {');
    console.log('    id');
    console.log('    slotDate');
    console.log('  }');
    console.log('}\n');
  }
}

console.log('=== Instructions ===');
console.log('1. Copy the mutations above section by section');
console.log('2. Go to your Firebase Console > Data Connect > GraphQL Playground');
console.log('3. Paste and execute each mutation group:');
console.log('   - Start with ROLES');
console.log('   - Then DNA SERVICES'); 
console.log('   - Then SAMPLE KITS');
console.log('   - Finally TIME SLOTS');
console.log('4. Verify data is created successfully');
console.log('\nAlternatively, use the Firebase Data Connect SDK in your application.');
console.log('\n=== Post-Setup Tasks ===');
console.log('1. Create admin user account');
console.log('2. Assign staff roles to appropriate users');
console.log('3. Configure notification templates');
console.log('4. Set up payment processing integration');
console.log('5. Configure email/SMS services for notifications');
