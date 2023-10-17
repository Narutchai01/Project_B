"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import 
const cors = require('cors');
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const bcrypt = require('bcrypt');
const config_1 = require("./config");
const body_parser_1 = require("body-parser");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
//define
const app = (0, express_1.default)();
const PORT = config_1.config.port || 3000;
const URL = config_1.config.DB_URL;
const client = new mongodb_1.MongoClient(URL);
const dbanem = 'test';
const secret = config_1.config.JWT_SECRET;
// use
app.use((0, body_parser_1.json)());
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
app.post('/api/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, username } = req.body;
        const user = {
            email,
            password: yield bcrypt.hash(password, 10),
            username
        };
        yield client.db(dbanem).collection('users').insertOne(user);
        yield client.close();
        res.status(200).json({
            message: 'user created',
        });
    }
    catch (err) {
        res.status(401).json({ message: 'something went wrong' });
    }
}));
app.post('/api/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield client.db(dbanem).collection('users').findOne({ email });
        const matchPassword = yield bcrypt.compare(password, user.password);
        if (!matchPassword) {
            res.status(401).json({ message: 'wrong password' });
        }
        const token = jwt.sign({ email }, secret, { expiresIn: '1h' });
        res.status(200).json({ message: 'user logged in', token });
        ;
    }
    catch (err) {
        res.status(401).json({ message: 'something went wrong' });
    }
}));
app.get('/api/verify', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const verify = jwt.verify(token, secret);
        if (!verify) {
            res.status(401).json({ message: 'user not verified' });
        }
        console.log(verify);
        const getUser = yield client.db(dbanem).collection('users').findOne();
        res.status(200).json({ message: 'user verified', getUser });
    }
    catch (err) {
        res.status(401).json({ message: 'something went wrong' });
    }
}));
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});
