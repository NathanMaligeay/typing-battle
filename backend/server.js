const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('./db'); // Import the database connection
const cors = require('cors');  // Import CORS middleware
const app = express();
const PORT = 8080;

app.use(cors({
    origin: 'http://localhost:3000', // Replace with the URL of your frontend
    credentials: true,  // Allow cookies, if necessary
}));

app.use(express.json());

// récupère tous les utilisateurs
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT user_id, username, password FROM users');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users', error);
        res.status(500).send('Server error');
    }
});

//permet de register un nouveau utilisateur, et le connecte
app.post('/users', async (req, res) => {
    const { username, password } = req.body;
    
    try {

        const result = await pool.query('SELECT username from users WHERE username = $1', [username]);
        if (result.rows.length > 0) {
            return res.json({message: 'This username is already taken.'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
        return res.json({registration: true, message: 'User successfully created', username: username})
    } catch (error) {
        console.error('Error creating user', error);
        res.status(500).send('Server error');
    }
});


// Route to log in a user
app.post('/users/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];
        if (!user) {
            return res.status(400).send('Cannot find user');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (isPasswordValid) {
            res.json({login: true, message: 'Login successful', username: user.username});
        } else {
            res.json({login: false, message: 'Wrong credentials'});
        }
    } catch (error) {
        console.error('Error logging in user', error);
        res.status(500).send('Server error');
    }
});

//Route to fetch #games for a user 
app.get('/games/user', async (req, res) => {
    const {username} = req.query;

    if (!username) return res.status(400).send('User is required');

    try {
        const result = await pool.query('SELECT COUNT(*) AS count, SUM(games.words_typed) AS total_words_typed, AVG(games.words_typed) as mean_words_typed, AVG(games.accuracy) as mean_accuracy, AVG(games.score) as mean_score FROM games JOIN users ON games.user_id = users.user_id WHERE users.username = $1', [username])
        const count = result.rows[0].count;
        const total_words_typed = result.rows[0].total_words_typed ? result.rows[0].total_words_typed : 0;
        const mean_words_typed = result.rows[0].mean_words_typed ? parseFloat(result.rows[0].mean_words_typed).toFixed(2) : 0;
        const mean_accuracy = result.rows[0].mean_accuracy ? parseFloat(result.rows[0].mean_accuracy).toFixed(2) : 0
        const mean_score = result.rows[0].mean_score ? parseFloat(result.rows[0].mean_score).toFixed(2) : 0
        return res.status(200).json({count, total_words_typed, mean_words_typed, mean_accuracy, mean_score});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

//Route to post game info for a user
app.post('/games/user', async (req, res) => {
    const {username, wordsTyped, accuracy, score} = req.body;
    if (!username) return res.status(400).send('User is required');
    try {
        const result = await pool.query('SELECT user_id FROM users WHERE username = $1', [username]);
        const user_id = result.rows[0].user_id;
        await pool.query('INSERT INTO games (user_id, words_typed, accuracy, score) VALUES ($1, $2, $3, $4)', [user_id, wordsTyped, accuracy, score]);
        return res.json({message: 'Game info sucessfully posted'});
    } catch (error) {
        console.error('Error posting game info', error);
        res.status(500).send('Server error');
    }
})

//Route to fetch all games info for a user 
app.get('/games/all/user', async (req, res) => {
    const {username} = req.query;

    if (!username) return res.status(400).send('User is required');

    try {
        const result = await pool.query('SELECT game_id, words_typed, accuracy, score FROM games JOIN users ON games.user_id = users.user_id WHERE users.username = $1', [username])
        return res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


