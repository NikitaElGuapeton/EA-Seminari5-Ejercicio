
import { BOOK_TAGS } from '../models/Book';

// Función que crea un parámetro para los IDs de MongoDB.
// La usamos en las rutas que necesitan recibir un ID por la URL.

const objectIdParameter = (name: string) => ({
    // Nombre del parámetro que recibirá la ruta.
    name,

    // Indica que el parámetro forma parte de la URL.
    in: 'path',

    // El ID es obligatorio para poder hacer la petición.
    required: true,

    // Definimos el tipo de dato y comprobamos que tenga
    // el formato de un ObjectId de MongoDB (24 caracteres hexadecimales).
    schema: {
        type: 'string',
        pattern: '^[0-9a-fA-F]{24}$'
    }
});


// Respuesta que utilizaremos cuando no se encuentre
// el autor o libro que estamos buscando.
const notFoundResponse = {
    description: 'Resource not found',

    content: {
        'application/json': {
            // Utilizamos el esquema MessageResponse definido
            // al final del documento.
            schema: {
                $ref: '#/components/schemas/MessageResponse'
            }
        }
    }
};


// Respuesta que utilizaremos cuando haya un error interno
// del servidor.
const serverErrorResponse = {
    description: 'Internal server error',

    content: {
        'application/json': {
            // Utilizamos el esquema ErrorResponse definido
            // en la sección de components.
            schema: {
                $ref: '#/components/schemas/ErrorResponse'
            }
        }
    }
};


// Documento principal de Swagger.
// Aquí definimos toda la documentación de nuestra API.
const swaggerDocument = {

    // Versión de OpenAPI que estamos utilizando.
    openapi: '3.0.0',

    // Información general de nuestra API.
    info: {
        // Nombre que aparecerá en Swagger.
        title: 'Library API',

        // Versión de nuestra API.
        version: '1.0.0',

        // Pequeña descripción de lo que hace la API.
        description: 'API for managing authors and books.'
    },


    // Dirección donde está funcionando nuestro servidor.
    // En nuestro caso, en local y utilizando el puerto 1337.
    servers: [
        {
            url: 'http://localhost:1337',
            description: 'Local server'
        }
    ],


    // Organizamos los endpoints en diferentes grupos
    // para que sea más fácil encontrarlos en Swagger.
    tags: [
        {
            name: 'Authors',
            description: 'Author management'
        },
        {
            name: 'Books',
            description: 'Book management'
        },
        {
            name: 'Health',
            description: 'Service health'
        }
    ],


    // En "paths" definimos todas las rutas disponibles
    // en nuestra API y qué operaciones se pueden realizar.
    paths: {

        // -------------------------------------------------
        // PING
        // -------------------------------------------------

        '/ping': {

            // GET /ping se utiliza para comprobar
            // si el servidor está funcionando correctamente.
            get: {
                tags: ['Health'],
                summary: 'Check service availability',

                responses: {

                    // Si todo funciona correctamente,
                    // devolvemos un código 200.
                    '200': {
                        description: 'Service is available',

                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',

                                    // Definimos el contenido de la respuesta.
                                    properties: {
                                        hello: {
                                            type: 'string',
                                            example: 'world'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },


        // -------------------------------------------------
        // AUTORES
        // -------------------------------------------------

        '/authors': {

            // GET /authors devuelve todos los autores.
            get: {
                tags: ['Authors'],
                summary: 'List all authors',

                responses: {

                    // Si la petición funciona, devolvemos
                    // la lista de autores con código 200.
                    '200': {
                        description: 'Authors returned',

                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',

                                    properties: {
                                        authors: {
                                            type: 'array',

                                            // Cada elemento del array
                                            // tiene la estructura Author.
                                            items: {
                                                $ref: '#/components/schemas/Author'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },

                    // Si ocurre un error interno del servidor.
                    '500': serverErrorResponse
                }
            },


            // POST /authors sirve para crear un nuevo autor.
            post: {
                tags: ['Authors'],
                summary: 'Create an author',

                // Indicamos que la petición necesita
                // recibir información en formato JSON.
                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            // El autor que recibimos debe seguir
                            // la estructura AuthorInput.
                            schema: {
                                $ref: '#/components/schemas/AuthorInput'
                            }
                        }
                    }
                },

                responses: {

                    // Código 201 = autor creado correctamente.
                    '201': {
                        description: 'Author created',

                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',

                                    properties: {
                                        author: {
                                            $ref: '#/components/schemas/Author'
                                        }
                                    }
                                }
                            }
                        }
                    },

                    // Error porque los datos enviados
                    // no cumplen las validaciones.
                    '422': {
                        description: 'Validation error'
                    },

                    // Error interno del servidor.
                    '500': serverErrorResponse
                }
            }
        },


        // -------------------------------------------------
        // AUTORES POR ID
        // -------------------------------------------------

        // En esta ruta usamos {authorId} porque necesitamos
        // indicar qué autor queremos consultar, modificar o eliminar.
        '/authors/{authorId}': {

            // Reutilizamos la función creada al principio
            // para comprobar que el ID tiene formato correcto.
            parameters: [
                objectIdParameter('authorId')
            ],


            // GET /authors/{authorId}
            // Busca un autor concreto por su ID.
            get: {
                tags: ['Authors'],
                summary: 'Get an author',

                responses: {
                    // Autor encontrado.
                    '200': {
                        description: 'Author returned'
                    },

                    // El ID de MongoDB no tiene un formato válido.
                    '400': {
                        description: 'Invalid MongoDB id'
                    },

                    // No se ha encontrado el autor.
                    '404': notFoundResponse,

                    // Error interno.
                    '500': serverErrorResponse
                }
            },


            // PUT /authors/{authorId}
            // Sirve para modificar un autor existente.
            put: {
                tags: ['Authors'],
                summary: 'Update an author',

                // Datos que enviamos para actualizar el autor.
                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthorInput'
                            }
                        }
                    }
                },

                responses: {

                    // Autor actualizado correctamente.
                    '200': {
                        description: 'Author updated'
                    },

                    // ID incorrecto.
                    '400': {
                        description: 'Invalid MongoDB id'
                    },

                    // Autor no encontrado.
                    '404': notFoundResponse,

                    // Los datos enviados no pasan la validación.
                    '422': {
                        description: 'Validation error'
                    },

                    // Error interno.
                    '500': serverErrorResponse
                }
            },


            // DELETE /authors/{authorId}
            // Sirve para eliminar un autor.
            delete: {
                tags: ['Authors'],
                summary: 'Delete an author',

                responses: {

                    // 204 significa que se ha eliminado correctamente
                    // y no se devuelve contenido en la respuesta.
                    '204': {
                        description: 'Author deleted'
                    },

                    // ID incorrecto.
                    '400': {
                        description: 'Invalid MongoDB id'
                    },

                    // Autor no encontrado.
                    '404': notFoundResponse,

                    // Error interno.
                    '500': serverErrorResponse
                }
            }
        },


        // -------------------------------------------------
        // LIBROS
        // -------------------------------------------------

        '/books': {

            // GET /books devuelve todos los libros.
            get: {
                tags: ['Books'],
                summary: 'List all books',

                responses: {

                    // Los libros se han obtenido correctamente.
                    '200': {
                        description: 'Books returned'
                    },

                    // Error interno del servidor.
                    '500': serverErrorResponse
                }
            },


            // POST /books crea un nuevo libro.
            post: {
                tags: ['Books'],
                summary: 'Create a book',

                // Información necesaria para crear el libro.
                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/BookInput'
                            }
                        }
                    }
                },

                responses: {

                    // Libro creado correctamente.
                    '201': {
                        description: 'Book created'
                    },

                    // Los datos enviados no son válidos.
                    '422': {
                        description: 'Validation error'
                    },

                    // Error interno.
                    '500': serverErrorResponse
                }
            }
        },


        // -------------------------------------------------
        '/books/{bookId}/tags': {
            parameters: [objectIdParameter('bookId')],
            post: {
                tags: ['Books'],
                summary: 'Add a tag to a book',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/BookTagInput' }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Tag added; returns the updated book with authors' },
                    '400': { description: 'Invalid MongoDB id' },
                    '404': notFoundResponse,
                    '422': { description: 'Validation error' },
                    '500': serverErrorResponse
                }
            },
            put: {
                tags: ['Books'],
                summary: 'Replace a book\'s tags',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/BookTagsInput' }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Tags replaced; returns the updated book with authors' },
                    '400': { description: 'Invalid MongoDB id' },
                    '404': notFoundResponse,
                    '422': { description: 'Validation error' },
                    '500': serverErrorResponse
                }
            }
        },

        '/books/{bookId}/tags/{tag}': {
            parameters: [
                objectIdParameter('bookId'),
                {
                    name: 'tag',
                    in: 'path',
                    required: true,
                    schema: { type: 'string', enum: BOOK_TAGS }
                }
            ],
            delete: {
                tags: ['Books'],
                summary: 'Remove a tag from a book',
                responses: {
                    '200': { description: 'Tag removed; returns the updated book with authors' },
                    '400': { description: 'Invalid MongoDB id' },
                    '404': notFoundResponse,
                    '422': { description: 'Invalid tag' },
                    '500': serverErrorResponse
                }
            }
        },

        // LIBROS POR ID
        // -------------------------------------------------

        '/books/{bookId}': {

            // Comprobamos que el ID del libro
            // tenga el formato correcto.
            parameters: [
                objectIdParameter('bookId')
            ],


            // GET /books/{bookId}
            // Busca un libro concreto.
            get: {
                tags: ['Books'],
                summary: 'Get a book',

                responses: {

                    // Libro encontrado.
                    '200': {
                        description: 'Book returned'
                    },

                    // ID incorrecto.
                    '400': {
                        description: 'Invalid MongoDB id'
                    },

                    // Libro no encontrado.
                    '404': notFoundResponse,

                    // Error interno.
                    '500': serverErrorResponse
                }
            },


            // PUT /books/{bookId}
            // Modifica un libro existente.
            put: {
                tags: ['Books'],
                summary: 'Update a book',

                // Datos que enviamos para actualizar el libro.
                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/BookInput'
                            }
                        }
                    }
                },

                responses: {

                    // Libro actualizado correctamente.
                    '200': {
                        description: 'Book updated'
                    },

                    // ID incorrecto.
                    '400': {
                        description: 'Invalid MongoDB id'
                    },

                    // Libro no encontrado.
                    '404': notFoundResponse,

                    // Datos incorrectos.
                    '422': {
                        description: 'Validation error'
                    },

                    // Error interno.
                    '500': serverErrorResponse
                }
            },


            // DELETE /books/{bookId}
            // Elimina un libro por su ID.
            delete: {
                tags: ['Books'],
                summary: 'Delete a book',

                responses: {

                    // Libro eliminado correctamente.
                    '204': {
                        description: 'Book deleted'
                    },

                    // ID incorrecto.
                    '400': {
                        description: 'Invalid MongoDB id'
                    },

                    // Libro no encontrado.
                    '404': notFoundResponse,

                    // Error interno.
                    '500': serverErrorResponse
                }
            }
        }
    },


    // -------------------------------------------------
    // COMPONENTS / SCHEMAS
    // -------------------------------------------------

    // Aquí definimos las estructuras de datos que utilizamos
    // en las diferentes rutas de la API.
    // De esta forma podemos reutilizarlas mediante $ref.
    components: {

        schemas: {

            // Estructura que tiene un autor cuando
            // lo recibimos desde la base de datos.
            Author: {
                type: 'object',

                properties: {
                    // ID generado por MongoDB.
                    _id: {
                        type: 'string',
                        example: '507f1f77bcf86cd799439011'
                    },

                    // Nombre del autor.
                    name: {
                        type: 'string',
                        example: 'Gabriel Garcia Marquez'
                    }
                }
            },


            // Datos necesarios para crear o actualizar un autor.
            // En este caso solo necesitamos el nombre.
            AuthorInput: {
                type: 'object',

                required: ['name'],

                properties: {
                    name: {
                        type: 'string',
                        example: 'Gabriel Garcia Marquez'
                    }
                }
            },


            // Estructura completa de un libro.
            Book: {
                type: 'object',

                properties: {

                    // ID generado por MongoDB.
                    _id: {
                        type: 'string',
                        example: '507f1f77bcf86cd799439012'
                    },

                    // Título del libro.
                    title: {
                        type: 'string',
                        example: 'One Hundred Years of Solitude'
                    },

                    // ID del autor del libro.
                    author: {
                        type: 'string',
                        example: '507f1f77bcf86cd799439011'
                    },

                    // Fecha en la que se creó el libro.
                    createdAt: {
                        type: 'string',
                        format: 'date-time'
                    },

                    // Fecha de la última actualización.
                    updatedAt: {
                        type: 'string',
                        format: 'date-time'
                    }
                }
            },


            // Datos necesarios para crear o modificar un libro.
            BookInput: {
                type: 'object',

                // Para crear un libro necesitamos obligatoriamente
                // el título y el ID del autor.
                required: ['title', 'author'],

                properties: {

                    // Título del libro.
                    title: {
                        type: 'string',
                        example: 'One Hundred Years of Solitude'
                    },

                    // ID del autor relacionado con el libro.
                    author: {
                        type: 'string',

                        // Comprobamos que sea un ObjectId de MongoDB.
                        pattern: '^[0-9a-fA-F]{24}$',

                        example: '507f1f77bcf86cd799439011'
                    }
                }
            },

            BookTagInput: {
                type: 'object',
                required: ['tag'],
                additionalProperties: false,
                properties: {
                    tag: {
                        type: 'string',
                        enum: BOOK_TAGS,
                        example: BOOK_TAGS[0]
                    }
                }
            },

            BookTagsInput: {
                type: 'object',
                required: ['tags'],
                additionalProperties: false,
                properties: {
                    tags: {
                        type: 'array',
                        items: {
                            type: 'string',
                            enum: BOOK_TAGS
                        },
                        example: [BOOK_TAGS[1], BOOK_TAGS[2]]
                    }
                }
            },


            // Estructura utilizada cuando un recurso no se encuentra.
            MessageResponse: {
                type: 'object',

                properties: {
                    message: {
                        type: 'string',
                        example: 'not found'
                    }
                }
            },


            // Estructura utilizada para devolver
            // información sobre errores internos.
            ErrorResponse: {
                type: 'object',

                properties: {
                    error: {}
                }
            }
        }
    }
};


// Exportamos el documento de Swagger para poder utilizarlo
// desde el servidor principal de la aplicación.
export default swaggerDocument;

