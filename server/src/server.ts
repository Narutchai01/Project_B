// import 
import LoginController from './controller/LoginController';
const cors = require('cors');
import express, { response, request, NextFunction } from 'express';
const bcrypt = require('bcrypt');
import { config } from './config';
import { json } from 'body-parser';
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
import { dbMG } from './controller/DatabaseMG';
import RegisterController from './controller/RegisterController';
import { auth } from './middleware/auth';


//define
const app = express();
const PORT = config.port || 3000;
export const dbname = 'test';
const secret = config.JWT_SECRET;


// use
app.use(json());
app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true,
    }
));
app.use(cookieParser());
// app.use(cors(header));

// connect to db
dbMG.connectTODB();



// routes
app.post('/api/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const registerController = new RegisterController(email, password, username);
        const result = await registerController.register();
        if (!result) {
            res.status(400).send('bad request');
            return false;
        }
        await dbMG.getClient().db(dbname).collection('users').insertOne({
            data: result,
        });
        res.status(200).send(result);
    }
    catch (err) {
        dbMG.connectTODB();
        console.log(err);
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const loginController = new LoginController(email, password);
        const result = await loginController.login();
        if (result) {
            const token = jwt.sign({ email: result.email }, secret, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });
            res.status(200).send(result);
        }
        else {
            res.status(401).send('unauthorized');
        }
    }
    catch (err) {
        dbMG.connectTODB();
        console.log(err);
    }
});


app.get('/api/logout', auth, async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401).send('unauthorized');
        }
        res.clearCookie('token');
        res.status(200).send('logout');
    }
    catch (err) {
        dbMG.connectTODB();
        console.log(err);
    }
});

<<<<<<< Updated upstream

app.get('/api/:user',async (req, res) => {
    const username = req.params.user;
    try{
=======
app.get('/api/users', async (req, res) => {
    try {
        const users = await dbMG.getClient().db(dbname).collection('users').find().toArray();
        res.status(200).send(users);
    }
    catch (err) {
        dbMG.connectTODB();
        console.log(err);
    }
});

app.get('/api/showscore', async (req, res) => {
    try {
        const result = await dbMG.getClient().db(dbname).collection('records').find().toArray();
        if (!result) {
            res.status(400).send('bad request');
            return false;
        }
        res.status(200).send(result);
    } catch (error) {
        dbMG.connectTODB();
        console.log(error);
    }
});

app.get('/api/:username', async (req, res) => {
    const username = req.params.username;
    try {
>>>>>>> Stashed changes
        const user = await dbMG.getClient().db(dbname).collection('users').findOne({
            'data.username': username,        });
        if(!user){
            res.status(404).send('user not found');
            return false;
        }
        res.status(200).send(user);
    }
    catch(err){
        console.log(err);
    }
});

<<<<<<< Updated upstream
=======
app.post('/api/records', async (req, res) => {
    try {
        const { username, gameMode, time } = req.body;
        const recordsController = new RecordsController(gameMode, username, time);
        if (!recordsController) {
            res.status(400).send('bad request');
            return false;
        }
        const result = await dbMG.getClient().db(dbname).collection('records').insertOne(recordsController);
        res.status(200).send(result);

    } catch (error) {

        dbMG.connectTODB();
        console.log(error);

    }
});

app.get('/api/showscore/:mode', async (req, res) => {
    try {

        const mode = req.params.mode;
        const result = await dbMG.getClient().db(dbname).collection('records').find({ gameMode: mode }).toArray();
        if (!result) {
            res.status(400).send('bad request');
            return false;
        }
        res.status(200).send(result);
    } catch (error) {
        dbMG.connectTODB();
        console.log(error);

    }
});

app.get('/api/showscore/:username/:mode', async (req, res) => {
    try {
        const username = req.params.username;
        const mode = req.params.mode;
        const result = await dbMG.getClient().db(dbname).collection('records').find({ username: username, gameMode: mode }).toArray();
        if (!result) {
            res.status(400).send('bad request');
            return false;
        }
        res.status(200).send(result);
    } catch (error) {
        dbMG.connectTODB();
        console.log(error);

    }
});



>>>>>>> Stashed changes
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});