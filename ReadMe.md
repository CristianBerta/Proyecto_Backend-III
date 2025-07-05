# 🐾 Pets Adoption API

API RESTful para sistema de adopción de mascotas desarrollada con Node.js, Express y MongoDB. Incluye documentación completa con Swagger, tests funcionales y contenedor Docker.

## 🚀 Características

- **API RESTful** completa para gestión de adopciones
- **Documentación Swagger** interactiva
- **Tests funcionales** completos
- **Autenticación JWT** con cookies
- **Base de datos MongoDB** con Mongoose
- **Contenedor Docker** listo para producción
- **Arquitectura modular** con controllers, services y repositories

## 📋 Tabla de Contenidos

- [Instalación](#instalación)
- [Uso con Docker](#uso-con-docker)
- [Desarrollo Local](#desarrollo-local)
- [API Endpoints](#api-endpoints)
- [Documentación](#documentación)
- [Tests](#tests)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías](#tecnologías)
- [Contribución](#contribución)

## 🐳 Uso con Docker

### Opción 1: Usar imagen desde DockerHub

```bash
docker run -p 8080:8080 cristianberta/pets-adoption-api:latest
```

**🔗 Imagen en DockerHub:** [https://hub.docker.com/r/cristianberta/pets-adoption-api](https://hub.docker.com/r/cristianberta/pets-adoption-api)

### Opción 2: Construir imagen localmente

```bash
git clone https://github.com/CristianBerta/Proyecto_Backend-III.git
cd Proyecto_Backend-III

docker build -t pets-adoption-api .

docker run -p 8080:8080 pets-adoption-api
```

### Verificar que funciona

Una vez que el contenedor esté corriendo, visita:
- **API Documentation:** http://localhost:8080/api-docs
- **Health Check:** http://localhost:8080/api/pets

## 💻 Desarrollo Local

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- MongoDB (local o Atlas)

### Instalación

```bash
git clone https://github.com/CristianBerta/Proyecto_Backend-III
cd Proyecto_Backend-III

npm install

npm run dev

npm start
```

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (opcional):

```env
PORT=8080
MONGODB_URI=mongodb+srv://cristian:######!@cluster0.ehtm7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=######
NODE_ENV=development
```

## 🛠️ API Endpoints

### Usuarios (`/api/users`)
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:uid` - Obtener usuario por ID
- `POST /api/users` - Crear nuevo usuario
- `PUT /api/users/:uid` - Actualizar usuario
- `DELETE /api/users/:uid` - Eliminar usuario

### Mascotas (`/api/pets`)
- `GET /api/pets` - Obtener todas las mascotas
- `GET /api/pets/:pid` - Obtener mascota por ID
- `POST /api/pets` - Crear nueva mascota
- `PUT /api/pets/:pid` - Actualizar mascota
- `DELETE /api/pets/:pid` - Eliminar mascota
- `POST /api/pets/:pid/image` - Subir imagen de mascota

### Adopciones (`/api/adoptions`)
- `GET /api/adoptions` - Obtener todas las adopciones
- `GET /api/adoptions/:aid` - Obtener adopción por ID
- `POST /api/adoptions/:uid/:pid` - Crear nueva adopción

### Sesiones (`/api/sessions`)
- `POST /api/sessions/register` - Registrar usuario
- `POST /api/sessions/login` - Iniciar sesión
- `GET /api/sessions/current` - Usuario actual
- `POST /api/sessions/logout` - Cerrar sesión

### Mocks (`/api/mocks`)
- `GET /api/mocks/mockingpets` - Generar mascotas de prueba
- `GET /api/mocks/mockingusers` - Generar usuarios de prueba
- `POST /api/mocks/generateData` - Generar datos de prueba

## 📚 Documentación

### Swagger UI
Accede a la documentación interactiva en: http://localhost:8080/api-docs

La documentación incluye:
- Descripción completa de todos los endpoints
- Esquemas de datos
- Ejemplos de peticiones y respuestas
- Posibilidad de probar la API directamente

### Postman Collection
Para importar en Postman, exporta la documentación desde Swagger UI.

## 🧪 Tests

### Ejecutar todos los tests
```bash
npm test
```

### Ejecutar tests específicos
```bash
npm run test:adoption

npm run test:coverage

npm run test:watch
```

### Cobertura de Tests
Los tests cubren:
- ✅ Todos los endpoints de adopciones
- ✅ Casos de éxito y error
- ✅ Validación de datos
- ✅ Autenticación y autorización

## 📁 Estructura del Proyecto

```
src/
├── controllers/          # Controladores de las rutas
│   ├── adoptions.controller.js
│   ├── pets.controller.js
│   ├── sessions.controller.js
│   └── users.controller.js
├── dao/                  # Data Access Objects
│   ├── models/          # Modelos de MongoDB
│   └── dto/             # Data Transfer Objects
├── repository/          # Capa de repositorio
├── routes/              # Definición de rutas
├── services/            # Lógica de negocio
├── utils/               # Utilidades y helpers
├── app.js               # Configuración principal
└── swagger.config.js    # Configuración de Swagger

test/                    # Tests funcionales
├── adoption.router.test.js
└── ...

public/                  # Archivos estáticos
└── img/                # Imágenes subidas
```

## 🛠️ Tecnologías

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB

### Autenticación
- **JWT** - JSON Web Tokens
- **bcrypt** - Hashing de contraseñas
- **cookie-parser** - Manejo de cookies

### Documentación y Tests
- **Swagger** - Documentación de API
- **Mocha** - Framework de testing
- **Chai** - Librería de assertions
- **Supertest** - Testing HTTP
- **NYC** - Coverage de código

### DevOps
- **Docker** - Contenedorización
- **DockerHub** - Registro de imágenes
- **nodemon** - Desarrollo con hot-reload

## 🚀 Deployment

### Docker Commands

```bash
docker build -t pets-adoption-api .

docker run -p 8080:8080 pets-adoption-api

docker run -d -p 8080:8080 --name pets-api pets-adoption-api

docker logs pets-api

docker stop pets-api
```

### Subir a DockerHub

```bash
docker tag pets-adoption-api cristianberta/pets-adoption-api:latest

docker push cristianberta/pets-adoption-api:latest
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia ISC.

## 👥 Autor

Desarrollado como proyecto de Backend III con fines educativos.

---

## 📞 Soporte

Si tienes alguna pregunta o problema:

1. **Documentación API:** http://localhost:8080/api-docs
2. **Issues:** [GitHub Issues](https://github.com/CristianBerta/Proyecto_Backend-III)
3. **DockerHub:** [https://hub.docker.com/r/cristianberta/pets-adoption-api](https://hub.docker.com/r/cristianberta/pets-adoption-api)

---