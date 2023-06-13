const db = require("../models");
const User = db.user;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



// API for user registration
exports.register = async (req, res) => {
    try {
        console.log('called register');

        const { name, email, password, role } = req.body;

        if (password.length < 8) {
            return res.status(400).json({ message: 'Password should be at least 8 characters long' });
        }

        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'User with the same email already exists' });
        }

        // Generate unique userId
        const userId = await generateUserId();

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            userId,
            name,
            email,
            password: hashedPassword,
            role,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', userId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// API for user login
exports.login = async (req, res) => {
    try {
        console.log('called login');

        const { email, password } = req.body;

        // Validate email format
        if (!email || !email.match(/^\S+@\S+\.\S+$/)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (!password || password.length < 8) {
            return res.status(400).json({ message: 'Password should be at least 8 characters long' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate and sign a JWT token
        const token = jwt.sign({ userId: user.userId, role: user.role }, 'workluge-secret-key', { expiresIn: '24h' });

        res.status(200).json({ message: 'Login successful',role: user.role, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// API to delete user
exports.deleteUser = async (req, res) => {
    try {
        console.log('called delete user');

        const { userId } = req.params;
        const user = await User.findOne({ userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(user._id);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// API to get all users
exports.getAllUsers = async (req, res) => {
    try {
        console.log('called get all users');

        const users = await User.find();

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Function to generate unique user ID
async function generateUserId() {
    const lastuser = await User.findOne({}, {}, { sort: { userId: -1 } });

    if (lastuser) {
        const lastId = parseInt(lastuser.userId);
        return (lastId + 1).toString().padStart(4, "0");
    }

    return "0001";
}
