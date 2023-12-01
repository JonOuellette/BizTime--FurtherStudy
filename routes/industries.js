const express = require("express");
const db = require("../db");
const router = express.Router();

// POST /industries - Add a new industry
router.post('/', async (req, res, next) => {
    try {
        const { code, industry, company_code } = req.body;
        const result = await db.query(`INSERT INTO industries (code, industry, company_code) VALUES ($1, $2, $3) RETURNING code, industry, company_code`, [code, industry, company_code]);
        return res.status(201).json({ industry: result.rows[0] });
    } catch (e) {
        return next(e);
    }
});

// GET /industries - List all industries
router.get('/', async (req, res, next) => {
    try {
        const result = await db.query(`SELECT * FROM industries`);
        return res.json({ industries: result.rows });
    } catch (e) {
        return next(e);
    }
});

module.exports = router;
