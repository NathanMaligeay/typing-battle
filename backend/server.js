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


app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, password FROM users');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users', error);
        res.status(500).send('Server error');
    }
});

// app.post('/users', async (req,res) => {
//     try {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10)
//     const user = ({name: req.body.name, password: hashedPassword})
//     users.push(user);
//     res.status(201).send();
//     } catch {
//         res.status(500).send();
//     }
// })

app.post('/users', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
        res.status(201).send('User created');
    } catch (error) {
        console.error('Error creating user', error);
        res.status(500).send('Server error');
    }
});

// app.post('/users/login', async (req, res) => {
//     const user = users.find(user => user.name == req.body.name);
//     if (user == null) {
//         return res.status(400).send("Cannot find user.")
//     } try {
//         if (await bcrypt.compare(req.body.password, user.password)) {
//             res.send("Success");
//         } else {
//             res.send("Not allowed");
//         }
//     } catch {
//         res.status(500).send();
//     }
// })

// Route to log in a user
app.post('/users/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }
    
    try {
        const result = await pool.query('SELECT password FROM users WHERE username = $1', [username]);
        const user = result.rows[0];
        
        if (!user) {
            return res.status(400).send('Cannot find user');
        }
        
        if (await bcrypt.compare(password, user.password)) {
            res.send('Login successful');
        } else {
            res.status(400).send('Invalid credentials');
        }
    } catch (error) {
        console.error('Error logging in user', error);
        res.status(500).send('Server error');
    }
});



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


