import express from 'express';
import { pool } from './db.js'
import session from 'express-session';
import { hashPassword, comparePassword } from './components/hash.js';
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Your React app's address
    credentials: false,               // Allows the browser to store/send cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
const PORT = 3000;

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const result = await pool.query('SELECT id, username, password, name FROM user_accounts WHERE username = $1', [username]);
    const user = result.rows[0];

    if (user && await comparePassword(password, user.password)) {
        req.session.user = {
            user_id: user.id,
            name: user.name
        };

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: { name: user.name } 
        });
    } else {
        res.status(400).json({ success: false, message: "Invalid credentials" });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on the port ${PORT}`);
});