// import 
import LoginController from './controller/LoginController';
const cors = require('cors');
import express from 'express';
const bcrypt = require('bcrypt');
import { config } from './config';
import { json } from 'body-parser';
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { header } = require('./middleware/headers');
import { dbMG } from './controller/DatabaseMG';
import RegisterController from './controller/RegisterController';

//define
const app = express();
const PORT = config.port || 3000;
const URL = config.DB_URL;
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
    const { username, password, email } = req.body;
    const registerController = new RegisterController(username, password, email);
    const result = await registerController;
    await dbMG.getClient().db(dbname).collection('users').insertOne(result);
    res.send(result);
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const loginController = new LoginController(email, password);
        const result = await loginController.login();
        if (!result) {
            res.status(404).send('user not found');
        }
        const token = jwt.sign({ id: result._id }, secret, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000, sameSite: 'none', secure: true });
        res.status(200).send({ result: result, token: token });
    }
    catch (err) {
        console.log(err);
    }
});

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});