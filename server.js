const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const colors = require('@colors/colors');
const app = express();
app.use(cors());
app.use(bodyParser.json());
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cruds',
});
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/api/get', (req, res) => {
    const sqlGet = 'SELECT * FROM student';
        db.query(sqlGet, (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send({
                         'message': 'Error', 
                         'status': 500, 
                         'success': false 
                        });
                } else {
                   if(result.length>0){
                    res.status(200).send({
                        'message': 'Success', 
                        'status': 200, 
                        'success': true, 
                        'data': result
                    });
                   }else{
                    res.status(404).send({
                        'message': 'No Data Found', 
                        'status': 404, 
                        'success': true, 
                    });
                   }
                }
          
            
        });
    
});
app.post('/api/insert', (req, res) => {
    const { name, email } = req.body;
    if(!name || !email){
        return res.status(400).send({
            'message': 'All fields are required', 
            'status': 400, 
            'success': false
        });
    }
    const checkQuery = 'SELECT * FROM student WHERE email = ?';
    db.query(checkQuery, [email], (err, result) => {
        if(err){
            console.log(err);
        }else{
            if(result.length > 0){
                return res.status(409).send({
                    'message': 'Email already exists', 
                    'status': 409, 
                    'success': false
                });
            }
        }
        const sqlInsert = 'INSERT INTO student (name, email) VALUES (?,?)';
        db.query(sqlInsert, [name, email], (err, result) => {
            if (err) {  
                console.log(err,);
            } else {
                res.status(200).send({
                    'message': 'Data inserted successfully', 
                    'status': 200, 
                    'success': true
                });
            }
        });
    });
    
});
//update Api 
app.put('/api/update/:id', (req, res) => {
    const { name, email } = req.body;
    const { id } = req.params;
    if(!name || !email){
        return res.status(400).send({
            'message': 'All fields are required', 
            'status': 400, 
            'success': false
        });
    }
    const checkQuery = 'SELECT * FROM student WHERE email = ? AND id != ?';
    db.query(checkQuery, [email, id], (err, result) => {
        if(err){
            console.log(err);
        }else{
            if(result.length > 0){
                return res.status(409).send({
                    'message': 'Email already exists', 
                    'status': 409, 
                    'success': false
                });
            }
        }
        const sqlUpdate = 'UPDATE student SET name = ?, email = ? WHERE id = ?';
    db.query(sqlUpdate, [name, email, id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({
                'message': 'Error', 
                'status': 500, 
                'success': false
            });
        } else {
            res.status(200).send({
                'message': 'Data updated successfully', 
                'status': 200, 
                'success': true
            });
        }
    });
    });
    
});
//delete Api
app.delete('/api/delete/:id', (req, res) => {
    const { id } = req.params;
    const sqlDelete = 'DELETE FROM student WHERE id = ?';
    db.query(sqlDelete, [id], (err, result) => {
        if (err) {  
            console.log(err);
            res.status(500).send({
                'message': 'Error', 
                'status': 500, 
                'success': false
            });
        } else {
            res.status(200).send({
                'message': 'Data deleted successfully', 
                'status': 200, 
                'success': true
            });
        }
    });
})
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}` .red);
});