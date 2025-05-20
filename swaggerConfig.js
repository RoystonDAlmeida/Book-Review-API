const swaggerJSDoc = require('swagger-jsdoc');
require('dotenv').config(); // To access PORT from .env

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Book Review API',
        version: '1.0.0',
        description: 'A RESTful API for a basic Book Review system. This API allows users to register, login, manage books, and submit reviews for them. All protected routes require JWT authentication.',
        license: {
            name: 'MIT', // Or your preferred license
            url: 'https://opensource.org/licenses/MIT',
        },
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT || 5000}/api`,
            description: 'Development server (local)',
        },
    ],
    components: {
        schemas: {

            // --- User Schemas ---

            User: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '605c724f02dd3a3c78c89999' },
                    username: { type: 'string', example: 'johndoe' },
                    email: { type: 'string', format: 'email', example: 'johndoe@example.com' },
                    createdAt: { type: 'string', format: 'date-time' }
                }
            },

            UserInput: {
                type: 'object',
                required: ['username', 'email', 'password'],
                properties: {
                    username: { type: 'string', example: 'johndoe' },
                    email: { type: 'string', format: 'email', example: 'johndoe@example.com' },
                    password: { type: 'string', format: 'password', example: 'strongpassword123' }
                }
            },

            LoginInput: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email', example: 'test@example.com' },
                    password: { type: 'string', format: 'password', example: 'password123' }
                }
            },

            AuthToken: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '605c724f02dd3a3c78c89999' },
                    username: { type: 'string', example: 'johndoe' },
                    email: { type: 'string', format: 'email', example: 'johndoe@example.com' },
                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
                }
            },

            // --- Book Schemas ---

            Book: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '605c724f02dd3a3c78c8a1b2' },
                    title: { type: 'string', example: 'The Lord of the Rings' },
                    author: { type: 'string', example: 'J.R.R. Tolkien' },
                    genre: { type: 'string', example: 'Fantasy' },
                    isbn: { type: 'string', example: '978-0618260274' },
                    publicationYear: { type: 'integer', example: 1954 },
                    addedBy: { $ref: '#/components/schemas/User' },
                    createdAt: { type: 'string', format: 'date-time' }
                }
            },

            BookInput: {
                type: 'object',
                required: ['title', 'author', 'genre', 'isbn', 'publicationYear'],
                properties: {
                    title: { type: 'string', example: 'The Hitchhiker\'s Guide to the Galaxy' },
                    author: { type: 'string', example: 'Douglas Adams' },
                    genre: { type: 'string', example: 'Science Fiction' },
                    isbn: { type: 'string', example: '0345391802' },
                    publicationYear: { type: 'integer', example: 1979 }
                }
            },

            BookIdWithDetails: {
                type: 'object',
                properties: {
                    book: { $ref: '#/components/schemas/Book' },
                    averageRating: { type: 'number', format: 'float', example: 4.5 },
                    reviews: {
                        type: 'object',
                        properties: {
                            currentPage: { type: 'integer', example: 1 },
                            totalPages: { type: 'integer', example: 2 },
                            totalReviews: { type: 'integer', example: 7 },
                            data: { type: 'array', items: { $ref: '#/components/schemas/Review' } }
                        }
                    }
                }
            },

            PaginatedBooks: {
                type: 'object',
                properties: {
                    currentPage: { type: 'integer' },
                    totalPages: { type: 'integer' },
                    totalBooks: { type: 'integer' },
                    books: { type: 'array', items: { $ref: '#/components/schemas/Book' } }
                }
            },

            // --- Review Schemas ---

            UserPartialForReview: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '682b720faab5e3b913a21ef1' },
                    username: { type: 'string', example: 'Royston' }
                }
            },

            BookPartialForReview: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '682b7f81caa77a6dfac230d6' },
                    title: { type: 'string', example: "The Hitchhiker's Guide to the Galaxy" }
                }
            },

            Review: {
                type: 'object',
                required: ['_id', 'book', 'user', 'rating', 'comment', 'createdAt', 'updatedAt'],
                properties: {
                    _id: { type: 'string', example: '682c8bead1d34899178d26ff' },
                    book: {
                        // Based on the PUT /reviews/{id} 200 OK example which is more complete.
                        // Note: The POST /books/{bookId}/reviews 201 example shows book as a string ID.
                        // This schema represents the potentially more populated version returned by some endpoints.
                        $ref: '#/components/schemas/BookPartialForReview'
                    },
                    user: {
                        $ref: '#/components/schemas/UserPartialForReview'
                    },
                    rating: {
                        type: 'integer',
                        example: 4,
                        description: 'Rating from 1 to 5'
                    },
                    comment: {
                        type: 'string',
                        example: 'After a second read, I enjoyed it even more!'
                    },
                    createdAt: { type: 'string', format: 'date-time', example: '2025-05-20T14:04:26.999Z' },
                    updatedAt: { type: 'string', format: 'date-time', example: '2025-05-20T14:06:49.232Z' },
                    __v: { type: 'integer', example: 0, description: 'Mongoose version key' }
                }
            },

            // Adjusted Review schema based on POST 201 response example
            ReviewPostResponse: {
                type: 'object',
                required: ['_id', 'book', 'user', 'rating', 'comment', 'createdAt', 'updatedAt'],
                properties: {
                    _id: { type: 'string', example: '682c8bead1d34899178d26ff' },
                    book: {
                        // Based on the POST /books/{bookId}/reviews 201 example
                        type: 'string',
                        example: '682b7f81caa77a6dfac230d6',
                        description: 'The ID of the book the review is for'
                    },
                    user: {
                        $ref: '#/components/schemas/UserPartialForReview' // User is still a partial object
                    },
                    rating: {
                        type: 'integer',
                        example: 5,
                        description: 'Rating from 1 to 5'
                    },
                    comment: { type: 'string', example: 'This book was a fantastic read, highly recommended!' },
                    createdAt: { type: 'string', format: 'date-time', example: '2025-05-20T14:04:26.999Z' },
                    updatedAt: { type: 'string', format: 'date-time', example: '2025-05-20T14:04:27.010Z' },
                    __v: { type: 'integer', example: 0, description: 'Mongoose version key' }
                }
            },

            ReviewInput: {
                type: 'object',
                required: ['rating', 'comment'],
                properties: {
                    rating: { type: 'integer', minimum: 1, maximum: 5, example: 5, description: 'Rating from 1 to 5' },
                    comment: { type: 'string', example: 'This book was a fantastic read, highly recommended!' }
                }
            },

            // --- Error Schemas ---

            Error: { type: 'object', properties: { message: { type: 'string' } } },
            ValidationError: { type: 'object', properties: { errors: { type: 'array', items: { type: 'object', properties: { type: { type: 'string'}, msg: { type: 'string'}, path: {type: 'string'}, location: {type: 'string'} } } } } }
        },
        securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
    },
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;