import { petsService, usersService } from "../services/index.js";
import { generateMockUsers } from "../utils/userMocking.js";
import { generateMockPets } from "../utils/petMocking.js";

const getMockingPets = async (req, res) => {
    const mockPets = [];
    
    for (let i = 1; i <= 10; i++) {
        const species = ['dog', 'cat', 'bird', 'rabbit', 'hamster'];
        const names = ['Buddy', 'Luna', 'Max', 'Bella', 'Charlie', 'Lucy', 'Rocky', 'Daisy', 'Cooper', 'Molly'];
        
        const mockPet = {
            name: names[Math.floor(Math.random() * names.length)] + i,
            specie: species[Math.floor(Math.random() * species.length)],
            birthDate: new Date(2020 + Math.floor(Math.random() * 4), 
                              Math.floor(Math.random() * 12), 
                              Math.floor(Math.random() * 28) + 1),
            adopted: false,
            owner: null,
            image: null
        };
        
        mockPets.push(mockPet);
    }
    
    res.send({ status: "success", payload: mockPets });
};

const getMockingUsers = async (req, res) => {
    try {
        //50 usuarios (Mongo)
        const mockUsers = await generateMockUsers(50);
        res.send({ status: "success", payload: mockUsers });
    } catch (error) {
        console.error('Error generating mock users:', error);
        res.status(500).send({ status: "error", error: "Failed to generate mock users" });
    }
};

const generateData = async (req, res) => {
    try {
        const { users, pets } = req.body;
        
        //Validar parametros
        if (!users && !pets) {
            return res.status(400).send({ 
                status: "error", 
                error: "At least one parameter (users or pets) is required" 
            });
        }
        
        //Validar numeros positivos
        if ((users && (typeof users !== 'number' || users < 0)) || 
            (pets && (typeof pets !== 'number' || pets < 0))) {
            return res.status(400).send({ 
                status: "error", 
                error: "Parameters must be positive numbers" 
            });
        }
        
        const results = {
            usersInserted: 0,
            petsInserted: 0,
            insertedUsers: [],
            insertedPets: []
        };
        
        //Generar e insertar usuarios
        if (users && users > 0) {
            console.log(`Generating ${users} users...`);
            const mockUsers = await generateMockUsers(users);
            
            for (const user of mockUsers) {
                try {
                    const { _id, __v, ...userToInsert } = user;
                    const insertedUser = await usersService.create(userToInsert);
                    results.insertedUsers.push(insertedUser);
                    results.usersInserted++;
                } catch (error) {
                    console.error('Error inserting user:', error);
                    // Continuar con el siguiente usuario
                }
            }
        }
        
        //Generar e insertar mascotas
        if (pets && pets > 0) {
            console.log(`Generating ${pets} pets...`);
            const mockPets = generateMockPets(pets);
            
            for (const pet of mockPets) {
                try {
                    const { _id, __v, ...petToInsert } = pet;
                    const insertedPet = await petsService.create(petToInsert);
                    results.insertedPets.push(insertedPet);
                    results.petsInserted++;
                } catch (error) {
                    console.error('Error inserting pet:', error);
                }
            }
        }
        
        res.send({ 
            status: "success", 
            message: `Data generated successfully. Users: ${results.usersInserted}, Pets: ${results.petsInserted}`,
            data: {
                usersInserted: results.usersInserted,
                petsInserted: results.petsInserted,
                users: results.insertedUsers,
                pets: results.insertedPets
            }
        });
        
    } catch (error) {
        console.error('Error generating data:', error);
        res.status(500).send({ 
            status: "error", 
            error: "Failed to generate and insert data" 
        });
    }
};

export default {
    getMockingPets,
    getMockingUsers,
    generateData
};