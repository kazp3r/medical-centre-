const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json()); // Дозволяє серверу читати JSON-дані
app.use(cors());         // Дозволяє запити з різних джерел

// --- 1. Налаштування підключення до MySQL ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '20122006',
    database: 'medical_center'
});

db.connect(err => {
    if (err) {
        console.error('Помилка підключення:', err);
        return;
    }
    console.log('Є контакт! Підключено до бази medical_center.');
});

// --- 2. Ендпоінт: Отримати список усіх пацієнтів (READ) ---
app.get('/patients', (req, res) => {
    const sql = 'SELECT * FROM patients';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// --- 3. Ендпоінт: Додати нового пацієнта (CREATE) ---
app.post('/patients', (req, res) => {
    const { first_name, last_name, phone } = req.body;
    const sql = 'INSERT INTO patients (first_name, last_name, phone) VALUES (?, ?, ?)';
    
    db.query(sql, [first_name, last_name, phone], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Пацієнта додано!', id: result.insertId });
    });
});

// --- 4. Ендпоінт: Оновити номер телефону пацієнта (UPDATE) ---
app.put('/patients/:id', (req, res) => {
    const { phone } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE patients SET phone = ? WHERE patient_id = ?';
    
    db.query(sql, [phone, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Дані оновлено' });
    });
});

// --- 5. Ендпоінт: Видалити пацієнта (DELETE) ---
app.delete('/patients/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM patients WHERE patient_id = ?';
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Пацієнта видалено з бази' });
    });
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});
// ТЕСТ PR