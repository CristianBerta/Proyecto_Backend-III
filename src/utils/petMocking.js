import mongoose from 'mongoose';

const petNames = [
    'Buddy', 'Luna', 'Max', 'Bella', 'Charlie', 'Lucy', 'Rocky', 'Daisy', 
    'Cooper', 'Molly', 'Bailey', 'Sadie', 'Duke', 'Chloe', 'Bear', 'Sophie', 
    'Tucker', 'Lola', 'Jack', 'Zoe', 'Oliver', 'Lily', 'Zeus', 'Mia', 
    'Bentley', 'Nala', 'Toby', 'Coco', 'Jax', 'Ruby'
];

const species = ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'turtle', 'guinea pig'];

//Funcion fecha de nacimiento
const generateRandomBirthDate = () => {
    const currentYear = new Date().getFullYear();
    const randomYear = currentYear - Math.floor(Math.random() * 5);
    const randomMonth = Math.floor(Math.random() * 12);
    const randomDay = Math.floor(Math.random() * 28) + 1;
    return new Date(randomYear, randomMonth, randomDay);
};

//Funcion mascota mock
export const generateMockPet = (index = 0) => {
    const name = petNames[Math.floor(Math.random() * petNames.length)];
    const specie = species[Math.floor(Math.random() * species.length)];
    const birthDate = generateRandomBirthDate();
    
    return {
        _id: new mongoose.Types.ObjectId(),
        name: `${name}${index > 0 ? index : ''}`,
        specie: specie,
        birthDate: birthDate,
        adopted: false,
        owner: null,
        image: null,
        __v: 0
    };
};

//Funcion múltiples mascotas
export const generateMockPets = (count = 10) => {
    const pets = [];
    
    for (let i = 0; i < count; i++) {
        const pet = generateMockPet(i);
        pets.push(pet);
    }
    
    return pets;
};