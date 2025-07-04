import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Pet Adoption API',
            version: '1.0.0',
            description: 'API para sistema de adopción de mascotas',
            contact: {
                name: 'API Support',
                email: 'support@petadoption.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Servidor de desarrollo'
            },
            {
                url: 'https://your-production-url.com',
                description: 'Servidor de producción'
            }
        ],
        tags: [
            {
                name: 'Users',
                description: 'Endpoints para gestión de usuarios'
            },
            {
                name: 'Pets',
                description: 'Endpoints para gestión de mascotas'
            },
            {
                name: 'Adoptions',
                description: 'Endpoints para gestión de adopciones'
            },
            {
                name: 'Sessions',
                description: 'Endpoints para gestión de sesiones'
            },
            {
                name: 'Mocks',
                description: 'Endpoints para datos de prueba'
            }
        ]
    },
    apis: [
        './src/routes/*.js',
        './src/controllers/*.js'
    ]
};

const specs = swaggerJSDoc(options);

export { specs, swaggerUi };