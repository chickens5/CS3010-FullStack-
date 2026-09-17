// server.js ~ GJ 9/16/26 1330 
import express from 'express';
import cors from 'cors';
import { registerUser, loginUser, getAccount } from './services/accountService.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/account/:id', async(req, res) => {
    try {
        const user = await getAccount(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching account:", error);
        res.status(error.status || 500).json({ error: error.status ? error.message : "Internal Server Error" });
    }
});

// Registers account
app.post('/api/register', async(req,res) => {
    try {
        const userData = req.body;
        const newUser = await registerUser(userData);
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error registering account due to", error);
        res.status(error.status || 500).json({ error: error.status ? error.message : "Internal server Error" });
    }
});

app.post('/api/login', async(req, res) => {
    try {
        const loginData = req.body;
        const loggedInUser = await loginUser(loginData);
        res.status(200).json(loggedInUser);
    } catch (error) {
        console.log("Error logging in", error);
        res.status(error.status || 500).json({ error: error.status ? error.message : "Internal srvr error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
});


