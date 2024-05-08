const express = require('express');
const UserController = require('../controller/UserController');
const userRouter = express.Router();


// Get all users
userRouter.get('/', UserController.getUsers);
userRouter.get('/count', UserController.countUsers);

// Create a new user
userRouter.post('/', UserController.createUser);

// View a user by ID
userRouter.get('/:id', UserController.viewUser);

// Update a user by ID
userRouter.put('/:id', UserController.updateUser);
userRouter.post('/login', UserController.login);

// Delete a user by ID
userRouter.delete('/:id', UserController.deleteUser);

module.exports = userRouter;
