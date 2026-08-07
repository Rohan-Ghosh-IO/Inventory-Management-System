import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication Microservice API Specification',
      version: '1.0.0',
      description: 'Production-grade Authentication Service handling User Registration, Authentication, Password Management, and JWT Management',
    },
    servers: [
      {
        url: 'http://localhost:5001/api/v1',
        description: 'Development Auth Microservice Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Provide JWT token as "Bearer <token>"',
        },
      },
    },
    paths: {
      '/auth/register': {
        post: {
          summary: 'Register a new user account',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', example: 'john.doe@example.com' },
                    password: { type: 'string', example: 'Password@123' },
                    role: { type: 'string', enum: ['ADMIN', 'USER'], default: 'USER' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  example: {
                    success: true,
                    message: 'User registered successfully',
                    data: {
                      id: '413f437b-d415-44a2-8d16-445714183982',
                      name: 'John Doe',
                      email: 'john.doe@example.com',
                      role: 'USER',
                    },
                    timestamp: '2026-08-07T10:00:00.000Z',
                  },
                },
              },
            },
            400: { description: 'Validation Error' },
            409: { description: 'Email already exists' },
            500: { description: 'Internal Server Error' },
          },
        },
      },
      '/auth/login': {
        post: {
          summary: 'Authenticate user and obtain JWT access token',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'admin@inventory.com' },
                    password: { type: 'string', example: 'Admin@123456' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful, returns JWT token and user profile',
              content: {
                'application/json': {
                  example: {
                    success: true,
                    message: 'Login successful',
                    data: {
                      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                      user: {
                        id: '413f437b-d415-44a2-8d16-445714183982',
                        name: 'Admin User',
                        email: 'admin@inventory.com',
                        role: 'ADMIN',
                      },
                    },
                    timestamp: '2026-08-07T10:00:00.000Z',
                  },
                },
              },
            },
            400: { description: 'Validation Error' },
            401: { description: 'Invalid email or password credentials' },
            500: { description: 'Internal Server Error' },
          },
        },
      },
      '/auth/me': {
        get: {
          summary: 'Fetch profile of current authenticated user',
          tags: ['Authentication', 'Profile'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'User profile retrieved successfully',
              content: {
                'application/json': {
                  example: {
                    success: true,
                    message: 'Current user profile fetched successfully',
                    data: {
                      id: '413f437b-d415-44a2-8d16-445714183982',
                      name: 'Admin User',
                      email: 'admin@inventory.com',
                      role: 'ADMIN',
                      createdAt: '2026-08-01T00:00:00.000Z',
                      updatedAt: '2026-08-07T10:00:00.000Z',
                    },
                    timestamp: '2026-08-07T10:00:00.000Z',
                  },
                },
              },
            },
            401: { description: 'Unauthorized or invalid JWT' },
            500: { description: 'Internal Server Error' },
          },
        },
      },
      '/auth/change-password': {
        post: {
          summary: 'Change password for authenticated user',
          tags: ['Authentication', 'Profile'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['currentPassword', 'newPassword'],
                  properties: {
                    currentPassword: { type: 'string', example: 'Admin@123456' },
                    newPassword: { type: 'string', example: 'NewSecret@1234' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Password changed successfully',
              content: {
                'application/json': {
                  example: {
                    success: true,
                    message: 'Password changed successfully',
                    timestamp: '2026-08-07T10:00:00.000Z',
                  },
                },
              },
            },
            400: { description: 'Validation Error or New password must be different from current password' },
            401: { description: 'Incorrect current password or Unauthorized' },
            500: { description: 'Internal Server Error' },
          },
        },
      },
      '/auth/logout': {
        post: {
          summary: 'Logout user session',
          tags: ['Authentication'],
          responses: {
            200: {
              description: 'Logged out successfully',
              content: {
                'application/json': {
                  example: {
                    success: true,
                    message: 'Logged out successfully',
                    timestamp: '2026-08-07T10:00:00.000Z',
                  },
                },
              },
            },
          },
        },
      },
      '/health': {
        get: {
          summary: 'Health check endpoint',
          tags: ['Health'],
          responses: {
            200: { description: 'Service is healthy' },
          },
        },
      },
    },
  },
  apis: [],
};

export const authSwaggerSpec = swaggerJsdoc(options);
