import express from 'express';
import { pool } from './db.js'
import session from 'express-session';
import { hashPassword, comparePassword } from './components/hash.js';
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cors());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
const PORT = 3000;

app.post('/register', async (req, res) => {
    const { username, password, confirm, name } = req.body;

    if (!username || !password || !name) {
        return res.status(400).json({ success: false, message: "Missing fields" });
    }
    if (password !== confirm) {
        return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const checkUser = await pool.query('SELECT * FROM user_accounts WHERE username = $1', [username]);
    if (checkUser.rows.length > 0) {
        return res.status(400).json({ success: false, message: "Username already exists" });
    }

    const hashedPassword = await hashPassword(password);

    await pool.query(
        'INSERT INTO user_accounts (username, password, name) VALUES($1, $2, $3)', 
        [username, hashedPassword, name]
    );

    res.status(200).json({ success: true, message: "Registered successfully" });
});

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