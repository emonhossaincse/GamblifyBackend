const User = require('../models/UserModel');
const BogApiService = require('../services/BogApiService');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Get users with pagination
const getUsers = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const searchRegExp = new RegExp('.*' + search + ".*", 'i');

        const filter = {
            $or: [
                { username: { $regex: searchRegExp } },
                { remote_id: { $regex: searchRegExp } },
                { phoneEmail: { $regex: searchRegExp } },
            ]
        };

        const totalUsers = await User.countDocuments(filter);
        const totalPages = Math.ceil(totalUsers / limit);
        const skip = (page - 1) * limit;

        const users = await User.find(filter)
            .skip(skip)
            .limit(limit);

        res.status(200).send({
            message: 'Users Found',
            users,
            totalPages,
            currentPage: page,
            totalUsers,
        });
    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const createPlayerResponse = await BogApiService.createPlayer(username, password);

        if (!createPlayerResponse.error || createPlayerResponse.error == 0) {
            const newUser = new User({
                remote_id: createPlayerResponse.response.id,
                username: username,
                password: password,
                token: createPlayerResponse.response.token, // Store the token
            });
            await newUser.save();
            return res.status(200).json({ message: 'User created successfully'});
        } else {
            return res.status(500).json(createPlayerResponse);
        }
    } catch (error) {
        console.error('Error creating player:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// View a user by ID
const viewUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User found', user });
    } catch (error) {
        next(error);
    }
};

// Update a user by ID
const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        next(error);
    }
};

// Delete a user by ID
const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ status: false, message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: false, message: 'Invalid credentials' });
        }

        // Generate an API token for the user
        const token = crypto.randomBytes(32).toString('hex');

        // Update user's token in the database
        user.token = token;
        await user.save();

        // Return a successful login response with token
        return res.status(200).json({
            status: true,
            message: 'Login successful',
            balance: user.balance,
            session_id: user.session_id,
            token: token,
        });
    } catch (error) {
        console.error('Error during login:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const countUsers = async (req, res, next) => {
    try {
        const userCount = await User.countDocuments();
        res.status(200).json({ success: true, count: userCount });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getUsers,
    createUser,
    viewUser,
    updateUser,
    deleteUser,
    login,
    countUsers
};
