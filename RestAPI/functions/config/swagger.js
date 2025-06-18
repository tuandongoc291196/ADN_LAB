const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ADN LAB API',
      version: '1.0.0',
      description: `
# ADN LAB API Documentation

Welcome to the ADN LAB API documentation. This API provides comprehensive access to DNA laboratory services, payment processing, and user management.

## Features

- **🧬 DNA Testing Services**: Comprehensive DNA analysis and testing services
- **💳 Payment Processing**: Support for multiple payment gateways (MOMO, VNPAY, ZALOPAY)
- **👥 User Management**: Complete user account and profile management
- **🔐 Role-Based Access**: Secure access control with role-based permissions
- **📅 Appointment Booking**: Schedule and manage DNA testing appointments
- **⏰ Time Slot Management**: Efficient time slot allocation and tracking

## Quick Start

1. **Authentication**: Obtain a JWT token through Firebase Authentication
2. **Base URL**: Use the appropriate base URL for your environment
3. **Headers**: Include \`Authorization: Bearer <token>\` for authenticated endpoints
4. **Content-Type**: Use \`application/json\` for request bodies

## Payment Integration

This API supports three major payment gateways in Vietnam:
- **MOMO**: Mobile money payments
- **VNPAY**: Vietnam's leading payment gateway
- **ZALOPAY**: Digital wallet payments

## Rate Limiting

- **Authenticated Users**: 1000 requests per hour
- **Public Endpoints**: 100 requests per hour

## Response Format

All API responses follow a consistent format:
\`\`\`json
{
  "statusCode": 200,
  "status": "success",
  "message": "Operation completed successfully",
  "data": { ... }
}
\`\`\`

## Error Handling

Error responses include detailed information:
\`\`\`json
{
  "statusCode": 400,
  "message": "Invalid request",
  "error": "Detailed error description"
}
\`\`\`

## Authentication

This API uses Firebase Authentication. Most endpoints require authentication at the USER level.
Include the JWT token in the Authorization header as: \`Bearer <your-jwt-token>\`

## Base URLs

- **Development**: http://localhost:5001/su25-swp391-g8/us-central1/app
- **Production**: https://app-bggwpxm32a-uc.a.run.app

## Rate Limiting

API requests are subject to rate limiting to ensure fair usage and system stability.

## Error Handling

All endpoints return consistent error responses with appropriate HTTP status codes and descriptive error messages.

## Support

For technical support or questions about this API, please contact:
- Email: support@adnlab.vn
- Website: https://adnlab.vn

*Last updated: June 2025*
      `,
      contact: {
        name: 'ADN LAB Support Team',
        email: 'support@adnlab.vn',
        url: 'https://adnlab.vn'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5001/su25-swp391-g8/us-central1/app',
        description: 'Development server'
      },
      {
        url: 'https://app-bggwpxm32a-uc.a.run.app',
        description: 'Production server'
      }
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints'
      },
      {
        name: 'Payments',
        description: 'Payment management endpoints for MOMO, VNPAY, and ZALOPAY'
      },
      {
        name: 'Users',
        description: 'User management endpoints'
      },
      {
        name: 'Services',
        description: 'DNA services and collection methods endpoints'
      },
      {
        name: 'Roles',
        description: 'Role management endpoints for user access control'
      },
      {
        name: 'Time Slots',
        description: 'Time slot management endpoints for appointment scheduling'
      },
      {
        name: 'Bookings',
        description: 'Booking management endpoints for appointment booking'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Firebase Authentication JWT token'
        }
      },
      schemas: {
        Payment: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Payment ID',
              example: 'PAY_12345'
            },
            totalAmount: {
              type: 'number',
              description: 'Total payment amount in VND',
              example: 50000
            },
            paymentChoice: {
              type: 'string',
              enum: ['MOMO', 'VNPAY', 'ZALOPAY'],
              description: 'Payment method chosen',
              example: 'VNPAY'
            },
            status: {
              type: 'string',
              enum: ['pending', 'completed', 'failed', 'refunded'],
              description: 'Payment status',
              example: 'completed'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Payment creation timestamp',
              example: '2024-12-06T10:30:00.000Z'
            }
          }
        },
        PaymentRequest: {
          type: 'object',
          required: ['totalAmount', 'paymentChoice'],
          properties: {
            totalAmount: {
              type: 'number',
              minimum: 1000,
              description: 'Total payment amount in VND (minimum 1,000 VND)',
              example: 50000
            },
            paymentChoice: {
              type: 'string',
              enum: ['MOMO', 'VNPAY', 'ZALOPAY'],
              description: 'Payment method: MOMO, VNPAY, or ZALOPAY',
              example: 'VNPAY'
            }
          }
        },
        PaymentResponse: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'number',
              description: 'HTTP status code',
              example: 200
            },
            payUrl: {
              type: 'string',
              description: 'Payment URL to redirect user for payment',
              example: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...'
            },
            message: {
              type: 'string',
              description: 'Response message',
              example: 'Payment URL generated successfully'
            }
          }
        },
        RefundResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Refund operation success status',
              example: true
            },
            message: {
              type: 'string',
              description: 'Response message',
              example: 'Payment refunded successfully'
            },
            data: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'Payment entry ID',
                  example: 'PAY_12345'
                },
                refundedAt: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Refund timestamp',
                  example: '2024-12-06T10:30:00.000Z'
                },
                status: {
                  type: 'string',
                  description: 'Updated status after refund',
                  example: 'refunded'
                }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'number',
              description: 'HTTP status code',
              example: 400
            },
            message: {
              type: 'string',
              description: 'Error message',
              example: 'totalAmount is required'
            },
            error: {
              type: 'string',
              description: 'Detailed error description',
              example: 'Missing required parameter'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
              example: 'user_12345'
            },
            fullname: {
              type: 'string',
              description: 'Full name of the user',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address',
              example: 'john.doe@example.com'
            },
            accountStatus: {
              type: 'string',
              description: 'Account status',
              example: 'active'
            },
            role: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'Role ID',
                  example: 'role_123'
                },
                name: {
                  type: 'string',
                  description: 'Role name',
                  example: 'customer'
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp',
              example: '2024-12-06T10:30:00.000Z'
            },
            lastLogin: {
              type: 'string',
              format: 'date-time',
              description: 'Last login timestamp',
              example: '2024-12-06T15:45:00.000Z'
            }
          }
        },
        UserRequest: {
          type: 'object',
          required: ['userId'],
          properties: {
            userId: {
              type: 'string',
              description: 'User ID to retrieve',
              example: 'user_12345'
            }
          }
        },
        UsersResponse: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'number',
              description: 'HTTP status code',
              example: 200
            },
            status: {
              type: 'string',
              description: 'Response status',
              example: 'success'
            },
            message: {
              type: 'string',
              description: 'Response message',
              example: 'Users retrieved successfully'
            },
            data: {
              type: 'object',
              properties: {
                users: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/User'
                  }
                }
              }
            }
          }
        },
        Service: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Service ID',
              example: 'service_123'
            },
            title: {
              type: 'string',
              description: 'Service title',
              example: 'DNA Analysis'
            },
            description: {
              type: 'string',
              description: 'Brief service description',
              example: 'Basic DNA analysis service'
            },
            fullDescription: {
              type: 'string',
              description: 'Complete service description',
              example: 'Comprehensive DNA analysis including genetic markers and ancestry information'
            },
            price: {
              type: 'number',
              description: 'Service price in VND',
              example: 500000
            },
            duration: {
              type: 'string',
              description: 'Service duration',
              example: '5-7 days'
            },
            category: {
              type: 'string',
              description: 'Service category',
              example: 'DNA Testing'
            },
            serviceType: {
              type: 'string',
              description: 'Type of service',
              example: 'laboratory'
            },
            hasLegalValue: {
              type: 'boolean',
              description: 'Whether service has legal value',
              example: true
            },
            icon: {
              type: 'string',
              description: 'Service icon',
              example: 'dna-icon'
            },
            participants: {
              type: 'string',
              description: 'Required participants',
              example: '1-2 people'
            },
            requiredDocuments: {
              type: 'string',
              description: 'Required documents',
              example: 'ID card, consent form'
            },
            procedures: {
              type: 'string',
              description: 'Service procedures',
              example: 'Sample collection, analysis, report generation'
            },
            featured: {
              type: 'boolean',
              description: 'Whether service is featured',
              example: false
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Service creation timestamp',
              example: '2024-12-06T10:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Service last update timestamp',
              example: '2024-12-06T12:30:00.000Z'
            }
          }
        },
        ServiceCollectionMethod: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Method ID',
              example: 'method_123'
            },
            serviceId: {
              type: 'string',
              description: 'Associated service ID',
              example: 'service_123'
            },
            methodId: {
              type: 'string',
              description: 'Collection method ID',
              example: 'collect_123'
            },
            methodTitle: {
              type: 'string',
              description: 'Collection method title',
              example: 'Saliva Collection'
            },
            methodDescription: {
              type: 'string',
              description: 'Method description',
              example: 'Non-invasive saliva sample collection'
            },
            methodIcon: {
              type: 'string',
              description: 'Method icon',
              example: 'saliva-icon'
            },
            methodColor: {
              type: 'string',
              description: 'Method color code',
              example: '#FF5733'
            },
            methodNote: {
              type: 'string',
              description: 'Additional method notes',
              example: 'Avoid eating 30 minutes before collection'
            },
            methodProcess: {
              type: 'string',
              description: 'Collection process details',
              example: 'Spit into provided container'
            },
            allowedFor: {
              type: 'string',
              description: 'Who can use this method',
              example: 'All ages'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Method creation timestamp',
              example: '2024-12-06T10:30:00.000Z'
            }
          }
        },
        ServiceRequest: {
          type: 'object',
          required: ['serviceId'],
          properties: {
            serviceId: {
              type: 'string',
              description: 'Service ID to retrieve',
              example: 'service_123'
            }
          }
        },
        ServicesResponse: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'number',
              description: 'HTTP status code',
              example: 200
            },
            status: {
              type: 'string',
              description: 'Response status',
              example: 'success'
            },
            message: {
              type: 'string',
              description: 'Response message',
              example: 'Services and methods retrieved successfully'
            },
            data: {
              type: 'object',
              properties: {
                dnaServices: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Service'
                  }
                },
                serviceCollectionMethods: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/ServiceCollectionMethod'
                  }
                }
              }
            }
          }
        },
        Role: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Role ID',
              example: 'admin'
            },
            name: {
              type: 'string',
              description: 'Role name',
              example: 'Administrator'
            },
            description: {
              type: 'string',
              description: 'Role description',
              example: 'Full system access with administrative privileges'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Role creation timestamp',
              example: '2024-12-06T10:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Role last update timestamp',
              example: '2024-12-06T12:30:00.000Z'
            }
          }
        },
        RoleRequest: {
          type: 'object',
          required: ['roleId'],
          properties: {
            roleId: {
              type: 'string',
              description: 'Role ID to retrieve',
              example: 'admin'
            }
          }
        },
        CreateRoleRequest: {
          type: 'object',
          required: ['id', 'name', 'description'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique role ID',
              example: 'manager'
            },
            name: {
              type: 'string',
              description: 'Role name',
              example: 'Manager'
            },
            description: {
              type: 'string',
              description: 'Role description',
              example: 'Manager role with limited administrative access'
            }
          }
        },
        UpdateRoleRequest: {
          type: 'object',
          required: ['roleId', 'name', 'description'],
          properties: {
            roleId: {
              type: 'string',
              description: 'Role ID to update',
              example: 'manager'
            },
            name: {
              type: 'string',
              description: 'Updated role name',
              example: 'Senior Manager'
            },
            description: {
              type: 'string',
              description: 'Updated role description',
              example: 'Senior manager role with extended privileges'
            }
          }
        },
        DeleteRoleRequest: {
          type: 'object',
          required: ['roleId'],
          properties: {
            roleId: {
              type: 'string',
              description: 'Role ID to delete',
              example: 'manager'
            }
          }
        },
        RolesResponse: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'number',
              description: 'HTTP status code',
              example: 200
            },
            status: {
              type: 'string',
              description: 'Response status',
              example: 'success'
            },
            message: {
              type: 'string',
              description: 'Response message',
              example: 'Roles retrieved successfully'
            },
            data: {
              type: 'object',
              properties: {
                roles: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Role'
                  }
                }
              }
            }
          }
        },
        TimeSlot: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Time slot ID',
              example: 'slot_12345'
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Date of the time slot',
              example: '2024-12-06'
            },
            time: {
              type: 'string',
              description: 'Time of the slot',
              example: '09:00'
            },
            isAvailable: {
              type: 'boolean',
              description: 'Whether the time slot is available',
              example: false
            },
            staffId: {
              type: 'string',
              description: 'Assigned staff ID',
              example: 'staff_123'
            },
            serviceId: {
              type: 'string',
              description: 'Associated service ID',
              example: 'service_123'
            }
          }
        },
        TimeSlotRequest: {
          type: 'object',
          required: ['timeSlotId'],
          properties: {
            timeSlotId: {
              type: 'string',
              description: 'Time slot ID to retrieve',
              example: 'slot_12345'
            }
          }
        },
        TimeSlotsResponse: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'number',
              description: 'HTTP status code',
              example: 200
            },
            status: {
              type: 'string',
              description: 'Response status',
              example: 'success'
            },
            message: {
              type: 'string',
              description: 'Response message',
              example: 'Time slots retrieved successfully'
            },
            data: {
              type: 'object',
              properties: {
                timeSlots: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/TimeSlot'
                  }
                }
              }
            }
          }
        },
        Booking: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Booking ID',
              example: 'booking_12345'
            },
            userId: {
              type: 'string',
              description: 'User ID who made the booking',
              example: 'user_12345'
            },
            serviceId: {
              type: 'string',
              description: 'Booked service ID',
              example: 'service_123'
            },
            timeSlotId: {
              type: 'string',
              description: 'Booked time slot ID',
              example: 'slot_12345'
            },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'completed', 'cancelled'],
              description: 'Booking status',
              example: 'confirmed'
            },
            bookingDate: {
              type: 'string',
              format: 'date-time',
              description: 'When the booking was made',
              example: '2024-12-06T10:30:00.000Z'
            },
            appointmentDate: {
              type: 'string',
              format: 'date',
              description: 'Date of the appointment',
              example: '2024-12-10'
            },
            notes: {
              type: 'string',
              description: 'Additional booking notes',
              example: 'Special instructions for sample collection'
            },
            totalAmount: {
              type: 'number',
              description: 'Total booking amount',
              example: 500000
            }
          }
        },
        BookingRequest: {
          type: 'object',
          required: ['bookingId'],
          properties: {
            bookingId: {
              type: 'string',
              description: 'Booking ID to retrieve',
              example: 'booking_12345'
            }
          }
        },
        CreateBookingRequest: {
          type: 'object',
          required: ['userId', 'serviceId', 'timeSlotId'],
          properties: {
            userId: {
              type: 'string',
              description: 'User ID making the booking',
              example: 'user_12345'
            },
            serviceId: {
              type: 'string',
              description: 'Service ID to book',
              example: 'service_123'
            },
            timeSlotId: {
              type: 'string',
              description: 'Time slot ID to book',
              example: 'slot_12345'
            },
            notes: {
              type: 'string',
              description: 'Optional booking notes',
              example: 'Special instructions for sample collection'
            }
          }
        },
        BookingsResponse: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'number',
              description: 'HTTP status code',
              example: 200
            },
            status: {
              type: 'string',
              description: 'Response status',
              example: 'success'
            },
            message: {
              type: 'string',
              description: 'Response message',
              example: 'Bookings retrieved successfully'
            },
            data: {
              type: 'object',
              properties: {
                bookings: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Booking'
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        BadRequest: {
          description: 'Bad request - Invalid input parameters',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        Unauthorized: {
          description: 'Unauthorized - Invalid or missing authentication token',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  statusCode: {
                    type: 'number',
                    example: 401
                  },
                  message: {
                    type: 'string',
                    example: 'Unauthorized access'
                  },
                  error: {
                    type: 'string',
                    example: 'Invalid or missing authentication token'
                  }
                }
              }
            }
          }
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  statusCode: {
                    type: 'number',
                    example: 404
                  },
                  message: {
                    type: 'string',
                    example: 'Resource not found'
                  },
                  error: {
                    type: 'string',
                    example: 'The requested resource does not exist'
                  }
                }
              }
            }
          }
        },
        Forbidden: {
          description: 'Forbidden - Insufficient permissions',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  statusCode: {
                    type: 'number',
                    example: 403
                  },
                  message: {
                    type: 'string',
                    example: 'Forbidden access'
                  },
                  error: {
                    type: 'string',
                    example: 'Insufficient permissions to access this resource'
                  }
                }
              }
            }
          }
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  statusCode: {
                    type: 'number',
                    example: 500
                  },
                  message: {
                    type: 'string',
                    example: 'Internal server error'
                  },
                  error: {
                    type: 'string',
                    example: 'An unexpected error occurred'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: [__dirname + '/../index.js', __dirname + '/../controllers/**/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
  swaggerUi,
  swaggerDocs
};
