/**
import { Router } from 'express';
import usersController from '../controllers/users.controller.js';

const router = Router();

router.get('/',usersController.getAllUsers);

router.get('/:uid',usersController.getUser);
router.put('/:uid',usersController.updateUser);
router.delete('/:uid',usersController.deleteUser);


export default router;
*/

import { Router } from 'express';
import usersController from '../controllers/users.controller.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del usuario
 *           example: "64a7b8c9d1e2f3a4b5c6d7e8"
 *         first_name:
 *           type: string
 *           description: Nombre del usuario
 *           example: "Juan"
 *         last_name:
 *           type: string
 *           description: Apellido del usuario
 *           example: "Pérez"
 *         email:
 *           type: string
 *           format: email
 *           description: Email único del usuario
 *           example: "juan.perez@example.com"
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *           example: "password123"
 *         role:
 *           type: string
 *           description: Rol del usuario
 *           default: "user"
 *           example: "user"
 *         pets:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: ID de la mascota
 *                 example: "64a7b8c9d1e2f3a4b5c6d7e9"
 *           description: Array de mascotas del usuario
 *           default: []
 *     UserUpdate:
 *       type: object
 *       properties:
 *         first_name:
 *           type: string
 *           description: Nombre del usuario
 *           example: "Juan Carlos"
 *         last_name:
 *           type: string
 *           description: Apellido del usuario
 *           example: "Pérez González"
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *           example: "juan.carlos@example.com"
 *         role:
 *           type: string
 *           description: Rol del usuario
 *           example: "admin"
 *     ApiResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         payload:
 *           type: object
 *           description: Datos de respuesta
 *         message:
 *           type: string
 *           description: Mensaje de respuesta
 *     ApiError:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "error"
 *         error:
 *           type: string
 *           description: Mensaje de error
 *   parameters:
 *     UserId:
 *       name: uid
 *       in: path
 *       required: true
 *       description: ID único del usuario
 *       schema:
 *         type: string
 *         example: "64a7b8c9d1e2f3a4b5c6d7e8"
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Users]
 *     description: Recupera la lista completa de usuarios registrados en el sistema
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *             examples:
 *               success:
 *                 value:
 *                   status: "success"
 *                   payload: [
 *                     {
 *                       "_id": "64a7b8c9d1e2f3a4b5c6d7e8",
 *                       "first_name": "Juan",
 *                       "last_name": "Pérez",
 *                       "email": "juan.perez@example.com",
 *                       "role": "user",
 *                       "pets": []
 *                     }
 *                   ]
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/', usersController.getAllUsers);

/**
 * @swagger
 * /api/users/{uid}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     tags: [Users]
 *     description: Recupera la información de un usuario específico mediante su ID
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     responses:
 *       200:
 *         description: Usuario encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 payload:
 *                   $ref: '#/components/schemas/User'
 *             examples:
 *               success:
 *                 value:
 *                   status: "success"
 *                   payload:
 *                     _id: "64a7b8c9d1e2f3a4b5c6d7e8"
 *                     first_name: "Juan"
 *                     last_name: "Pérez"
 *                     email: "juan.perez@example.com"
 *                     role: "user"
 *                     pets: []
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               notFound:
 *                 value:
 *                   status: "error"
 *                   error: "User not found"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/:uid', usersController.getUser);

/**
 * @swagger
 * /api/users/{uid}:
 *   put:
 *     summary: Actualiza un usuario
 *     tags: [Users]
 *     description: Actualiza la información de un usuario específico
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *           examples:
 *             updateUser:
 *               value:
 *                 first_name: "Juan Carlos"
 *                 last_name: "Pérez González"
 *                 email: "juan.carlos@example.com"
 *                 role: "admin"
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "User updated"
 *             examples:
 *               success:
 *                 value:
 *                   status: "success"
 *                   message: "User updated"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               notFound:
 *                 value:
 *                   status: "error"
 *                   error: "User not found"
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.put('/:uid', usersController.updateUser);

/**
 * @swagger
 * /api/users/{uid}:
 *   delete:
 *     summary: Elimina un usuario
 *     tags: [Users]
 *     description: Elimina un usuario específico del sistema
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "User deleted"
 *             examples:
 *               success:
 *                 value:
 *                   status: "success"
 *                   message: "User deleted"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               notFound:
 *                 value:
 *                   status: "error"
 *                   error: "User not found"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete('/:uid', usersController.deleteUser);

export default router;