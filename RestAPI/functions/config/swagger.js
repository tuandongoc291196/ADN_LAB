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

- **Payment Processing**: Support for multiple payment gateways (MOMO, VNPAY, ZALOPAY)
- **User Management**: Complete user account and profile management
- **DNA Services**: Management of DNA testing services and collection methods
- **Authentication**: Secure access control with role-based permissions

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
