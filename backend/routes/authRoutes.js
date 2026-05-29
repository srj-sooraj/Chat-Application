import express from "express";

import {
    registerUser,
    loginUser,
    findUserByAppID
} from "../Controllers/authControllers.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user/:appID", findUserByAppID);

export default router;