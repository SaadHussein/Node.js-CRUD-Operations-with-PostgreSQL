const express = require('express');
const db = require('./db/db');

const app = express();

app.use(express.json());

app.get('/employees', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM employees');
        console.log(result);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/employees/:id', async (req, res) => {
    try {
        const id = +req.params.id;
        console.log(id);
        const result = await db.query('SELECT * FROM employees WHERE emp_no = $1', [id]);
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Id Not Found...!');
    }
});

app.post('/addEmployee', async (req, res) => {
    try {
        const date = new Date();
        console.log(date.toISOString());
        const { first_name, last_name, gender, emp_no } = req.body;
        const result = await db.query('INSERT INTO employees (first_name, last_name, gender, emp_no, birth_date, hire_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [first_name, last_name, gender, emp_no, date, date]);
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.send('Can not add User.');
    }
});

app.put('/employees/:id', async (req, res) => {
    try {
        const id = +req.params.id;
        const { first_name, last_name } = req.body;
        console.log(id, first_name, last_name);
        const result = await db.query('UPDATE employees SET first_name = $1, last_name = $2 WHERE emp_no = $3 RETURNING *', [first_name, last_name, id]);
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Id Not Found...!');
    }
});

app.delete('/deleteEmployee/:id', async (req, res) => {
    try {
        const id = +req.params.id;
        await db.query('DELETE FROM employees WHERE emp_no = $1', [id]);
        res.send(`Employee Deleted Successfully`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Id Not Found...!');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});