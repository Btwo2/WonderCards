const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const memoryRoutes = require('./routes/memoryRoutes');
const Save = require('./models/save');


// Load environment variables
dotenv.config({ path: './config/.env' });

// Check if MONGODB_URI is loaded
if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env');
  process.exit(1);
}

// Initialize Express app
const app = express();

// Middleware
//app.use(cors()); // Allow cross-origin requests
app.use(cors({ allowedHeaders: ['Content-Type', 'Authorization']}));

// 3. Middleware especial para requisições OPTIONS (pré-flight)
app.options('*', cors()); // 👈 Responde imediatamente a pré-flight

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes); // Ensure this line exists
app.use('/api/memory', memoryRoutes);


// Connect to MongoDB
let db;
connectDB().then(connection => {
  db = connection;
});

// Default Route
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

app.get('/api/memory/games/:id', async (req, res) => {
  try {
    console.log('Fetching game data for ID:', req.params.id); // Debugging log
    const game = await Save.find({ userID: req.params.id });
    if (!game) return res.status(404).json({ error: "Game not found" });
    res.json(game);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// get all users
app.get('/api/memory/games', async (req, res) => {
  try {
    const games = await Save.find();
    res.json(games);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
