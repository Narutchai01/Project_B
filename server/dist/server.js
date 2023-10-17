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
const cors = require("cors");
const express_1 = __importDefault(require("express"));
const bcrypt = require("bcrypt");
const config_1 = require("./config");
const body_parser_1 = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
//define
const app = (0, express_1.default)();
const PORT = config_1.config.port || 3000;
const dbanem = "test";
const secret = config_1.config.JWT_SECRET;
// use
app.use((0, body_parser_1.json)());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(cookieParser());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// connect to db
// try {
//   client.connect();
//   console.log("connected to db");
// } catch (err) {
//   console.log(err);
// }
// routes
app.post("/api/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, username } = req.body;
        const user = {
            email,
            password: yield bcrypt.hash(password, 10),
            username,
        };
        res.status(200).json({
            message: "user created",
        });
    }
    catch (err) {
        res.status(401).json({ message: "something went wrong" });
    }
}));
app.post("/api/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const token = jwt.sign({ email }, secret, { expiresIn: "1h" });
        res.cookie("token", "12", { httpOnly: true });
        res.status(200).json({ message: "user logged in", token });
    }
    catch (err) {
        res.status(401).json({ message: "something went wrong" });
    }
}));
app.get("/api/verify", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authToken = req.cookies.token;
        const verifyToken = jwt.verify(authToken, secret);
        if (verifyToken) {
            //   const getUser = await client.db(dbanem).collection("users").findOne();
            //   res.status(200).json({ message: "user verified", getUser });
        }
        else {
            res.status(401).json({ message: "user not verified" });
        }
    }
    catch (_a) {
        res.status(401).json({ message: "user not verified" });
    }
}));
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});
