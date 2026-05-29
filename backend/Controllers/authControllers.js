import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Helper to generate a unique appID
const generateAppID = async () => {
    let id;
    let isUnique = false;
    while (!isUnique) {
        id = Math.floor(10000000 + Math.random() * 90000000).toString(); // 8 digits
        const exists = await User.findOne({ appID: id });
        if (!exists) isUnique = true;
    }
    return id;
};

// REGISTER
export const registerUser = async (req, res) => {
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            return res.status(400).json({ message: "Name and password are required" });
        }

        const appID = await generateAppID();
        const hashedPassword = await bcrypt.hash(password, 10);
        const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}${appID}`;

        const user = await User.create({
            name,
            appID,
            password: hashedPassword,
            avatar
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "7d" }
        );

        res.status(201).json({
            _id: user._id,
            name: user.name,
            appID: user.appID,
            avatar: user.avatar,
            token
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// LOGIN
export const loginUser = async (req, res) => {
    try {
        const { appID, password } = req.body;

        const user = await User.findOne({ appID });

        if (!user) {
            return res.status(400).json({ message: "Invalid App ID" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "7d" }
        );

        res.status(200).json({
            _id: user._id,
            name: user.name,
            appID: user.appID,
            avatar: user.avatar,
            token
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET USER SEARCH (To add contacts)
export const findUserByAppID = async (req, res) => {
    try {
        const { appID } = req.params;
        const user = await User.findOne({ appID }).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};