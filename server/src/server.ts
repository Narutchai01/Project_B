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
        const { username, password, email } = req.body;
        const registerController = new RegisterController(username, password, email);
        const result = await registerController;
        await dbMG.getClient().db(dbname).collection('users').insertOne(result);
        res.status(200).send(result);
    }
    catch (err) {
        console.log(err);
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const loginController = new LoginController(email, password);
        const result = await loginController.login();
        if (!result) {
            res.status(401).send('unauthorized');
        }
        const token = jwt.sign({ result }, secret);
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        res.status(200).send({
            result: result,
        });
    }
    catch (err) {
        console.log(err);
    }
});

app.get('/api/:username', auth, async (req, res) => {
    const username = req.params;
    const result = await dbMG.getClient().db(dbname).collection('users').findOne(username);
    res.status(200).send(result);
});


app.get('/api/logout', (req, res) => { 
    const token = req.cookies.token;
    if (!token) {
        res.status(401).send('unauthorized');
    }
    res.clearCookie('token');
});



app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});