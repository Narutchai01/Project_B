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
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const app = (0, express_1.default)();
const body_parser_1 = require("body-parser");
const config_1 = require("./config");
const PORT = config_1.config.port;
const DB_URL = config_1.config.DB_URL;
app.use((0, body_parser_1.json)());
const client = new mongodb_1.MongoClient(DB_URL);
const bcrypt = require('bcrypt');
const encrypt = bcrypt.hashSync("myPassword", 10);
const jwt = require('jsonwebtoken');
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    yield client.connect();
    const Token = jwt.sign(user, config_1.config.JWT_SECRET);
    yield client.db("test").collection("devices").insertOne({
        id: new mongodb_1.ObjectId(),
        username: user.username,
        password: encrypt,
        email: user.email,
        Token: Token
    });
    yield client.close();
    res.status(201).json({
        user: user,
        token: Token
    });
}));
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield client.connect();
    const user = req.body;
    const userFromDb = yield client.db("test").collection("devices").findOne({ username: user.username });
    if (userFromDb) {
        const isPasswordCorrect = bcrypt.compareSync(user.password, userFromDb.password);
        if (isPasswordCorrect) {
            const Token = jwt.sign(user, config_1.config.JWT_SECRET);
            yield client.db("test").collection("devices").updateOne({ username: user.username }, { $set: { Token: Token } });
            yield client.close();
            res.status(200).json({
                user: userFromDb,
                token: Token
            });
        }
        else {
            res.status(401).json({
                message: "Password is incorrect"
            });
        }
    }
    else {
        res.status(404).json({
            message: "User not found"
        });
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
