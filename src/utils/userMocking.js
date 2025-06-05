import { createHash } from '../utils/index.js';
import mongoose from 'mongoose';

const firstNames = [
    'Juan', 'María', 'Carlos', 'Ana', 'Pedro', 'Sofía', 'Diego', 'Valeria', 
    'Luis', 'Camila', 'Roberto', 'Isabella', 'Fernando', 'Gabriela', 'Miguel', 
    'Daniela', 'Alejandro', 'Andrea', 'Ricardo', 'Natalia'
];

const lastNames = [
    'García', 'Rodríguez', 'López', 'Martínez', 'González', 'Pérez', 'Sánchez', 
    'Ramírez', 'Cruz', 'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Reyes', 
    'Morales', 'Jiménez', 'Herrera', 'Medina', 'Castro'
];

const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'email.com'];

//Funcion email único
const generateEmail = (firstName, lastName, index) => {
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const randomNum = Math.floor(Math.random() * 1000);
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}${randomNum}@${domain}`;
};

//Funcion usuario mock
export const generateMockUser = async (index = 0) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = generateEmail(firstName, lastName, index);
    const roles = ['user', 'admin'];
    const role = roles[Math.floor(Math.random() * roles.length)];
    
    const hashedPassword = await createHash('coder123');
    
    return {
        _id: new mongoose.Types.ObjectId(),
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: hashedPassword,
        role: role,
        pets: [],
        __v: 0
    };
};

//Funcion múltiples usuarios
export const generateMockUsers = async (count = 50) => {
    const users = [];
    
    for (let i = 0; i < count; i++) {
        const user = await generateMockUser(i);
        users.push(user);
    }
    
    return users;
};