require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const Redis = require('redis');
const { ethers } = require('ethers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Redis setup
const redisClient = Redis.createClient({
    url: process.env.REDIS_URL
});

// Web3 setup
const provider = new ethers.providers.JsonRpcProvider(process.env.WEB3_PROVIDER);
const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    process.env.CONTRACT_ABI,
    provider
);

// Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, walletAddress } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await pool.query(
            'INSERT INTO users (email, password, wallet_address) VALUES ($1, $2, $3) RETURNING *',
            [email, hashedPassword, walletAddress]
        );
        
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/donations/record', async (req, res) => {
    try {
        const { userId, bloodType } = req.body;
        const user = await pool.query('SELECT wallet_address FROM users WHERE id = $1', [userId]);
        
        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const walletAddress = user.rows[0].wallet_address;
        const tx = await contract.mintDonationNFT(walletAddress, bloodType);
        await tx.wait();
        
        const result = await pool.query(
            'INSERT INTO donations (user_id, blood_type, transaction_hash) VALUES ($1, $2, $3) RETURNING *',
            [userId, bloodType, tx.hash]
        );
        
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/donations/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await pool.query('SELECT wallet_address FROM users WHERE id = $1', [userId]);
        
        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const tokens = await contract.getDonorTokens(user.rows[0].wallet_address);
        const donations = await Promise.all(
            tokens.map(async (tokenId) => {
                const record = await contract.getDonationRecord(tokenId);
                return {
                    tokenId: tokenId.toString(),
                    ...record
                };
            })
        );
        
        res.json(donations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/benefits/use', async (req, res) => {
    try {
        const { tokenId, benefitType } = req.body;
        const tx = await contract.useBenefit(tokenId, benefitType);
        await tx.wait();
        
        const result = await pool.query(
            'INSERT INTO benefit_usage (token_id, benefit_type, transaction_hash) VALUES ($1, $2, $3) RETURNING *',
            [tokenId, benefitType, tx.hash]
        );
        
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 