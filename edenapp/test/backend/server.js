// server.js ~ GJ 9/19/26 1800 
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser, getAccount, updateAccount } from './services/accountService.js';
import { JWT_SECRET } from './services/jwtSecret.js';

dotenv.config();

const app = express();
// Restricts cross-origin requests to the known frontend origin
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
});


// Requires a valid bearer token belonging to the :id in the route (IDOR prevention).
function requireOwnAccount(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
        return res.status(401).json({ error: 'Missing authentication token' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (String(decoded.user_id) !== String(req.params.id)) {
            return res.status(403).json({ error: 'You do not have access to this account' });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

app.get('/api/account/:id', requireOwnAccount, async(req, res) => {
    try {
        const user = await getAccount(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching account:", error);
        res.status(error.status || 500).json({ error: error.status ? error.message : "Internal Server Error" });
    }
});

app.put('/api/account/:id', requireOwnAccount, async(req, res) => {
    try {
        const user = await updateAccount(req.params.id, req.body);
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error updating account:", error);
        res.status(error.status || 500).json({error: error.status ? error.message : "Internal Server Error" });
    }
})

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

// Confirms client-side token removal
app.post('/api/logout', (req, res) => {
    res.status(200).json({ message: 'Logged out successfully!' });
});


