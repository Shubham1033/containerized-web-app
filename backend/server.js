const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// Database connection via environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Table auto-creation on startup
const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS records (
        id SERIAL PRIMARY KEY,
        data VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Database table 'records' is ready.");
  } catch (err) {
    console.error("Error creating table:", err);
  }
};
initDb();

// Healthcheck endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// POST endpoint -> Insert record
app.post('/records', async (req, res) => {
  try {
    const { data } = req.body;
    const result = await pool.query(
      'INSERT INTO records (data) VALUES ($1) RETURNING *',
      [data]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET endpoint -> Fetch records
app.get('/records', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM records ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});