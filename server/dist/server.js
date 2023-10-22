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
exports.dbname = void 0;
// import 
const LoginController_1 = __importDefault(require("./controller/LoginController"));
const cors = require('cors');
const express_1 = __importDefault(require("express"));
const bcrypt = require('bcrypt');
const config_1 = require("./config");
const body_parser_1 = require("body-parser");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const DatabaseMG_1 = require("./controller/DatabaseMG");
const RegisterController_1 = __importDefault(require("./controller/RegisterController"));
const auth_1 = require("./middleware/auth");
//define
const app = (0, express_1.default)();
const PORT = config_1.config.port || 3000;
exports.dbname = 'test';
const secret = config_1.config.JWT_SECRET;
// use
app.use((0, body_parser_1.json)());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());
// app.use(cors(header));
// connect to db
DatabaseMG_1.dbMG.connectTODB();
// routes
app.post('/api/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email } = req.body;
        const registerController = new RegisterController_1.default(username, password, email);
        const result = yield registerController;
        yield DatabaseMG_1.dbMG.getClient().db(exports.dbname).collection('users').insertOne(result);
        res.status(200).send(result);
    }
    catch (err) {
        console.log(err);
    }
}));
app.post('/api/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const loginController = new LoginController_1.default(email, password);
        const result = yield loginController.login();
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
}));
app.get('/api/:username', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.params;
    const result = yield DatabaseMG_1.dbMG.getClient().db(exports.dbname).collection('users').findOne(username);
    res.status(200).send(result);
}));
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
