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
app.use(cors());
app.use(cookieParser());


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
        res.status(200).json({ message: 'user logged in', token });
        ;

    }
    catch (err) {
        res.status(401).json({ message: 'something went wrong' });
    }
});

app.get('/api/verify', async (req, res) => {
    try {
        const authHeader:any = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const verify = jwt.verify(token, secret);
        if (!verify) {
            res.status(401).json({ message: 'user not verified' });
        }
        console.log(verify);
        
        const getUser = await client.db(dbanem).collection('users').findOne();
        res.status(200).json({ message: 'user verified', getUser });
    }
    catch (err) {
        res.status(401).json({ message: 'something went wrong' });
    }
});

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);

});