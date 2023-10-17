// import 
const cors = require('cors');
import express from 'express';
import { MongoClient } from 'mongodb';
const bcrypt = require('bcrypt');
import { config } from './config';
import { json } from 'body-parser';
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');


//define
const app = express();
const PORT = config.port || 3000;
const URL = config.DB_URL;
const client = new MongoClient(URL);
const dbanem = 'test';
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
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// connect to db
try {
    client.connect();
    console.log('connected to db');
}
catch (err) {
    console.log(err);
}


// routes

app.post('/api/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const user = {
            email,
            password: await bcrypt.hash(password, 10),
            username
        }
        await client.db(dbanem).collection('users').insertOne(user);
        await client.close();
        res.status(200).json({
            message: 'user created',
        });

    }
    catch (err) {
        res.status(401).json({ message: 'something went wrong' });
    }
});


app.post('/api/login', async (req, res) => {

    try {
        const { email, password } = req.body;
        const user: any = await client.db(dbanem).collection('users').findOne({ email });
        const matchPassword = await bcrypt.compare(password, user.password)
        if (!matchPassword) {
            res.status(401).json({ message: 'wrong password' });
        }

        const token = jwt.sign({ email }, secret, { expiresIn: '1h' })
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 10000
        });
        res.status(200).json({ message: 'user logged in', token });
    }
    catch (err) {
        res.status(401).json({ message: 'something went wrong' });
    }
});




app.get('/api/verify', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({ message: 'not authorized' });
        }
        else {
            res.status(200).json({ message: 'authorized' });
        }

        const decodedToken = jwt.verify(token, secret);
        const dataUser = await client.db(dbanem).collection('users').findOne();
        res.status(200).json({ message: 'authorized', decodedToken, dataUser });
    } 
    catch (err) {
        res.status(401).json({ message: 'not authorized' });
    }
}
);

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);

});