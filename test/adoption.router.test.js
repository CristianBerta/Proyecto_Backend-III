import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import mongoose from 'mongoose';
import userModel from '../src/models/User.js';
import petModel from '../src/models/Pet.js';
import adoptionModel from '../src/models/Adoption.js';

describe('Adoption Router - Tests Funcionales', () => {
    let testUser;
    let testPet;
    let testAdoption;
    let adoptedPet;

    before(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/adoptionapp_test');
        }
    });

    beforeEach(async () => {
        await userModel.deleteMany({});
        await petModel.deleteMany({});
        await adoptionModel.deleteMany({});

        testUser = await userModel.create({
            first_name: 'Juan',
            last_name: 'Pérez',
            email: 'juan.test@example.com',
            password: 'password123',
            role: 'user',
            pets: []
        });

        testPet = await petModel.create({
            name: 'Buddy',
            specie: 'Dog',
            birthDate: new Date('2020-01-01'),
            adopted: false,
            image: 'buddy.jpg'
        });

        adoptedPet = await petModel.create({
            name: 'Adopted Pet',
            specie: 'Cat',
            birthDate: new Date('2019-01-01'),
            adopted: true,
            owner: testUser._id,
            image: 'adopted.jpg'
        });

        testAdoption = await adoptionModel.create({
            owner: testUser._id,
            pet: adoptedPet._id
        });
    });

    afterEach(async () => {
        await userModel.deleteMany({});
        await petModel.deleteMany({});
        await adoptionModel.deleteMany({});
    });

    after(async () => {
        await mongoose.connection.close();
    });

    describe('GET /api/adoptions', () => {
        it('debería obtener todas las adopciones exitosamente', async () => {
            const response = await request(app)
                .get('/api/adoptions')
                .expect(200);

            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.be.an('array');
            expect(response.body.payload).to.have.lengthOf.greaterThan(0);
            expect(response.body.payload[0]).to.have.property('owner');
            expect(response.body.payload[0]).to.have.property('pet');
        });

        it('debería retornar un array vacío cuando no hay adopciones', async () => {
            await adoptionModel.deleteMany({});

            const response = await request(app)
                .get('/api/adoptions')
                .expect(200);

            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.be.an('array');
            expect(response.body.payload).to.have.lengthOf(0);
        });

        it('debería manejar errores del servidor', async () => {
            //Simular error cerrando la conexión
            await mongoose.connection.close();

            const response = await request(app)
                .get('/api/adoptions');

            expect(response.status).to.equal(500);
            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.exist;

            //Reconectar para otros tests
            await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/adoptionapp_test');
        });
    });

    describe('GET /api/adoptions/:aid', () => {
        it('debería obtener una adopción específica por ID', async () => {
            const response = await request(app)
                .get(`/api/adoptions/${testAdoption._id}`)
                .expect(200);

            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.have.property('_id');
            expect(response.body.payload._id.toString()).to.equal(testAdoption._id.toString());
            expect(response.body.payload).to.have.property('owner');
            expect(response.body.payload).to.have.property('pet');
        });

        it('debería retornar 404 cuando la adopción no existe', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();

            const response = await request(app)
                .get(`/api/adoptions/${nonExistentId}`)
                .expect(404);

            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.equal('Adoption not found');
        });

        it('debería validar IDs con formato inválido', async () => {
            const invalidId = 'invalid-id';

            const response = await request(app)
                .get(`/api/adoptions/${invalidId}`);

            expect(response.status).to.be.oneOf([400, 500]);
            expect(response.body.status).to.equal('error');
        });

        it('debería manejar errores del servidor al buscar adopción', async () => {
            await mongoose.connection.close();

            const response = await request(app)
                .get(`/api/adoptions/${testAdoption._id}`);

            expect(response.status).to.equal(500);
            expect(response.body.status).to.equal('error');

            await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/adoptionapp_test');
        });
    });

    describe('POST /api/adoptions/:uid/:pid', () => {
        it('debería crear una nueva adopción exitosamente', async () => {
            const response = await request(app)
                .post(`/api/adoptions/${testUser._id}/${testPet._id}`)
                .expect(200);

            expect(response.body.status).to.equal('success');
            expect(response.body.message).to.equal('Pet adopted');

            const newAdoption = await adoptionModel.findOne({
                owner: testUser._id,
                pet: testPet._id
            });
            expect(newAdoption).to.exist;

            const updatedUser = await userModel.findById(testUser._id);
            expect(updatedUser.pets.map(pet => pet._id.toString())).to.include(testPet._id.toString());

            const updatedPet = await petModel.findById(testPet._id);
            expect(updatedPet.adopted).to.be.true;
            expect(updatedPet.owner.toString()).to.equal(testUser._id.toString());
        });

        it('debería retornar 404 cuando el usuario no existe', async () => {
            const nonExistentUserId = new mongoose.Types.ObjectId();

            const response = await request(app)
                .post(`/api/adoptions/${nonExistentUserId}/${testPet._id}`)
                .expect(404);

            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.equal('user Not found');
        });

        it('debería retornar 404 cuando la mascota no existe', async () => {
            const nonExistentPetId = new mongoose.Types.ObjectId();

            const response = await request(app)
                .post(`/api/adoptions/${testUser._id}/${nonExistentPetId}`)
                .expect(404);

            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.equal('Pet not found');
        });

        it('debería retornar 400 cuando la mascota ya está adoptada', async () => {
            const response = await request(app)
                .post(`/api/adoptions/${testUser._id}/${adoptedPet._id}`)
                .expect(400);

            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.equal('Pet is already adopted');
        });

        it('debería validar IDs de usuario inválidos', async () => {
            const invalidUserId = 'invalid-user-id';

            const response = await request(app)
                .post(`/api/adoptions/${invalidUserId}/${testPet._id}`);

            expect(response.status).to.be.oneOf([400, 500]);
            expect(response.body.status).to.equal('error');
        });

        it('debería validar IDs de mascota inválidos', async () => {
            const invalidPetId = 'invalid-pet-id';

            const response = await request(app)
                .post(`/api/adoptions/${testUser._id}/${invalidPetId}`);

            expect(response.status).to.be.oneOf([400, 500]);
            expect(response.body.status).to.equal('error');
        });

        it('debería manejar errores del servidor durante la creación', async () => {
            await mongoose.connection.close();

            const response = await request(app)
                .post(`/api/adoptions/${testUser._id}/${testPet._id}`);

            expect(response.status).to.equal(500);
            expect(response.body.status).to.equal('error');

            await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/adoptionapp_test');
        });

        it('debería mantener integridad de datos durante la adopción', async () => {
            const response = await request(app)
                .post(`/api/adoptions/${testUser._id}/${testPet._id}`)
                .expect(200);

            expect(response.body.status).to.equal('success');

            //Verificar que todos los datos se actualizaron correctamente
            const updatedUser = await userModel.findById(testUser._id);
            const updatedPet = await petModel.findById(testPet._id);
            const createdAdoption = await adoptionModel.findOne({
                owner: testUser._id,
                pet: testPet._id
            });

            expect(updatedUser.pets.map(pet => pet._id.toString())).to.include(testPet._id.toString());
            expect(updatedPet.adopted).to.be.true;
            expect(updatedPet.owner.toString()).to.equal(testUser._id.toString());
            expect(createdAdoption).to.exist;
        });
    });

    describe('Casos de prueba adicionales', () => {
        it('debería validar que un usuario no puede adoptar la misma mascota dos veces', async () => {
            //Primera adopción
            await request(app)
                .post(`/api/adoptions/${testUser._id}/${testPet._id}`)
                .expect(200);

            //Segunda adopción (debería fallar)
            const response = await request(app)
                .post(`/api/adoptions/${testUser._id}/${testPet._id}`)
                .expect(400);

            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.equal('Pet is already adopted');
        });

        it('debería permitir que diferentes usuarios adopten diferentes mascotas', async () => {
            const secondUser = await userModel.create({
                first_name: 'María',
                last_name: 'García',
                email: 'maria.test@example.com',
                password: 'password123',
                role: 'user',
                pets: []
            });

            const secondPet = await petModel.create({
                name: 'Whiskers',
                specie: 'Cat',
                birthDate: new Date('2021-01-01'),
                adopted: false,
                image: 'whiskers.jpg'
            });

            const firstResponse = await request(app)
                .post(`/api/adoptions/${testUser._id}/${testPet._id}`)
                .expect(200);

            const secondResponse = await request(app)
                .post(`/api/adoptions/${secondUser._id}/${secondPet._id}`)
                .expect(200);

            expect(firstResponse.body.status).to.equal('success');
            expect(secondResponse.body.status).to.equal('success');

            const adoptions = await adoptionModel.find({});
            expect(adoptions).to.have.lengthOf(3); // 2 nuevas + 1 del setup
        });

        it('debería mantener integridad referencial entre colecciones', async () => {
            await request(app)
                .post(`/api/adoptions/${testUser._id}/${testPet._id}`)
                .expect(200);

            const adoption = await adoptionModel.findOne({
                owner: testUser._id,
                pet: testPet._id
            });

            const user = await userModel.findById(testUser._id);
            const pet = await petModel.findById(testPet._id);

            expect(adoption.owner.toString()).to.equal(testUser._id.toString());
            expect(adoption.pet.toString()).to.equal(testPet._id.toString());
            expect(user.pets.map(pet => pet._id.toString())).to.include(testPet._id.toString());
            expect(pet.owner.toString()).to.equal(testUser._id.toString());
        });

        it('debería manejar adopciones múltiples del mismo usuario', async () => {
            const secondPet = await petModel.create({
                name: 'Rex',
                specie: 'Dog',
                birthDate: new Date('2021-05-01'),
                adopted: false,
                image: 'rex.jpg'
            });

            await request(app)
                .post(`/api/adoptions/${testUser._id}/${testPet._id}`)
                .expect(200);

            await request(app)
                .post(`/api/adoptions/${testUser._id}/${secondPet._id}`)
                .expect(200);

            const updatedUser = await userModel.findById(testUser._id);
            const userPetIds = updatedUser.pets.map(pet => pet._id.toString());
            
            expect(userPetIds).to.include(testPet._id.toString());
            expect(userPetIds).to.include(secondPet._id.toString());
            expect(updatedUser.pets).to.have.lengthOf(2);
        });
    });
});