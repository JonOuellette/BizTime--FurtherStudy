const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");

router.get('/', async (req, res, next) =>  {
    try {
        const results = await db.query(`SELECT * FROM invoices`);
        return res.json({ invoices: results.rows})
    } catch(e){
        return next(e)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const invoiceRes = await db.query(`SELECT * FROM invoices WHERE id = $1`, [id]);
        if (invoiceRes.rows.length === 0) {
            throw new ExpressError(`Can't find invoice with id ${id}`, 404);
        }

        const invoice = invoiceRes.rows[0];
        const companyRes = await db.query(`SELECT code, name, description FROM companies WHERE code = $1`, [invoice.comp_code]);
        invoice.company = companyRes.rows[0];

        return res.json({ invoice: invoice });
    } catch(e) {
        return next(e);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { comp_code, amt } = req.body;
        const result = await db.query(
            `INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [comp_code, amt]
        );
        return res.status(201).json({ invoice: result.rows[0] });
    } catch(e) {
        return next(e);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amt, paid } = req.body;
        let paidDate = null;

        const currentInvoice = await db.query(`SELECT paid FROM invoices WHERE id = $1`, [id]);
        if (currentInvoice.rows.length === 0) {
            throw new ExpressError(`Can't find invoice with id ${id}`, 404);
        }

        if (paid && !currentInvoice.rows[0].paid) {
            paidDate = new Date();
        } else if (!paid) {
            paidDate = null;
        } else {
            paidDate = currentInvoice.rows[0].paid_date;
        }

        const result = await db.query(
            `UPDATE invoices SET amt = $1, paid = $2, paid_date = $3 WHERE id = $4 RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [amt, paid, paidDate, id]
        );

        return res.json({ invoice: result.rows[0] });
    } catch(e) {
        return next(e);
    }
});


router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await db.query(`DELETE FROM invoices WHERE id = $1 RETURNING id`, [id]);
        if (result.rows.length === 0) {
            throw new ExpressError(`Can't find invoice with id ${id}`, 404);
        }
        return res.json({ status: "deleted" });
    } catch(e) {
        return next(e);
    }
});


module.exports = router;