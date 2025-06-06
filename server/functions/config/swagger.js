const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ADN LAB API',
      version: '1.0.0',
      description: 'API documentation for ADN LAB payment system',
      contact: {
        name: 'ADN LAB Support',
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
      }
    ],
    components: {
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
