# ADN Lab Firebase Data Connect - DNA Testing Platform

This repository contains the Firebase Data Connect schema, mutations, and queries for the ADN Lab DNA testing platform.

## 📋 Overview

The ADN Lab platform manages a complete DNA testing workflow including:

- **User Management**: Role-based access control for customers, staff, technicians, managers, and admins
- **Service Catalog**: DNA testing services with pricing and specifications
- **Booking System**: Appointment scheduling with time slots and staff assignment
- **Sample Management**: Sample collection tracking and processing
- **Testing Workflow**: Test execution, result generation, and verification
- **Payment Processing**: Payment tracking and refund management
- **Feedback System**: Customer feedback and rating collection
- **Notifications**: Real-time notifications for users and staff

## 🗄️ Database Schema

### Core Entities

1. **Users & Roles**
   - `Role`: System roles with permissions
   - `User`: Customer and staff profiles with role assignments

2. **Services & Inventory**
   - `DnaService`: Available DNA testing services
   - `Kit`: Sample collection kits inventory

3. **Booking & Scheduling**
   - `TimeSlot`: Available appointment time slots
   - `Booking`: Customer bookings with service selections
   - `BookingItem`: Junction table for booking services

4. **Testing Workflow**
   - `Sample`: Collected samples for testing
   - `TestResult`: Test results and reports

5. **Business Operations**
   - `Payment`: Payment processing and tracking
   - `Feedback`: Customer feedback and ratings
   - `Notification`: System notifications

## 🚀 Setup Instructions

### 1. Deploy Schema

```bash
# Navigate to the server directory
cd server

# Deploy the Data Connect schema
firebase deploy --only dataconnect
```

### 2. Initialize Data

Run the initialization script to populate default data:

```bash
# Generate initialization mutations
node scripts/init-roles.js

# Copy the output and execute in Firebase Console > Data Connect > GraphQL Playground
```

### 3. Configure Authentication

Ensure Firebase Authentication is configured with the following providers:
- Email/Password
- Google (optional)
- Phone (optional)

### 4. Set Permissions

The schema uses Firebase Auth integration:
- All operations require `@auth(level: USER)`
- Role-based permissions are managed through the `Role` table
- User roles are assigned via the `User.roleId` field

## 📝 API Usage

### Mutations

#### User Management
```graphql
# Create or update user profile
mutation {
  CreateOrUpdateUser(
    fullname: "John Doe"
    email: "john@example.com"
    phone: "+1234567890"
    authProvider: "email"
  ) {
    id
    fullname
  }
}
```

#### Booking Creation
```graphql
# Create a new booking
mutation {
  CreateBooking(
    id: "booking-123"
    userId: "user-123"
    collectionMethod: "at_home"
    totalAmount: 299.99
    timeSlotId: "slot-123"
  ) {
    id
    status
  }
}
```

#### Service Management
```graphql
# Create DNA service
mutation {
  CreateDnaService(
    id: "paternity-test"
    name: "Paternity Test"
    description: "Determine biological relationship"
    price: 299.99
    durationDays: 5
    sampleType: "Saliva"
    atHomeAvailable: true
    kitCost: 25.00
  ) {
    id
    name
  }
}
```

### Queries

#### Get Available Services
```graphql
query {
  GetDnaServices {
    id
    name
    description
    price
    durationDays
    sampleType
    atHomeAvailable
  }
}
```

#### Get User Bookings
```graphql
query {
  GetMyBookings {
    id
    status
    totalAmount
    timeSlot {
      slotDate
      startTime
    }
    createdAt
  }
}
```

#### Get Available Time Slots
```graphql
query {
  GetAvailableTimeSlots(slotDate: "2024-01-15") {
    id
    startTime
    endTime
    maxCapacity
    currentBookings
    staff {
      fullname
    }
  }
}
```

## 🔐 Security & Permissions

### Role-Based Access Control

- **Customer**: Book services, view own results, manage profile
- **Staff**: Process samples, manage appointments, collect samples
- **Technician**: Conduct tests, update results, quality control
- **Manager**: Verify results, manage staff, view analytics
- **Admin**: Full system access, user management, system settings

### Authentication Requirements

All operations require authenticated users. Anonymous access is not permitted for sensitive health data.

### Data Privacy

- Personal health information is protected
- Users can only access their own data
- Staff access is role-restricted
- All operations are logged for audit purposes

## 📊 Analytics & Reporting

### Available Reports

1. **Booking Statistics**: Volume, status distribution, revenue
2. **Service Popularity**: Most requested services, trends
3. **Staff Performance**: Processing times, workload distribution
4. **Customer Satisfaction**: Ratings, feedback analysis
5. **Revenue Analysis**: Monthly/quarterly financial reports

### Query Examples

```graphql
# Get booking statistics
query {
  GetBookingStats {
    id
    status
    totalAmount
    createdAt
  }
}

# Get service popularity
query {
  GetServicePopularity {
    service {
      name
    }
    quantity
  }
}
```

## 🔧 Development

### Schema Updates

1. Modify `schema/schema.gql`
2. Update mutations in `connector/mutations.gql`
3. Update queries in `connector/queries.gql`
4. Deploy changes: `firebase deploy --only dataconnect`

### Adding New Features

1. **New Entity**: Add table definition to schema
2. **Relationships**: Define foreign keys with `@ref`
3. **Mutations**: Create CRUD operations
4. **Queries**: Add data retrieval operations
5. **Permissions**: Update role permissions as needed

### Testing

```bash
# Test schema validation
firebase dataconnect:sql:diff

# Test in GraphQL playground
# Firebase Console > Data Connect > GraphQL Playground
```

## 📁 File Structure

```
server/
├── dataconnect/
│   ├── dataconnect.yaml          # Data Connect configuration
│   ├── connector/
│   │   ├── connector.yaml        # Connector configuration
│   │   ├── mutations.gql         # All mutation operations
│   │   └── queries.gql           # All query operations
│   └── schema/
│       └── schema.gql            # Database schema definition
├── scripts/
│   ├── init-roles.js             # Database initialization script
│   └── migrate-users.js          # User migration utilities
└── README.md                     # This file
```

## 🤝 Contributing

1. Follow GraphQL best practices
2. Maintain backward compatibility
3. Update documentation for schema changes
4. Test all mutations and queries
5. Follow security guidelines for health data

## 📄 License

This project is proprietary to ADN Lab. All rights reserved.

## 🆘 Support

For technical support:
- Review Firebase Data Connect documentation
- Check GraphQL playground for syntax errors
- Verify authentication setup
- Contact the development team for assistance
