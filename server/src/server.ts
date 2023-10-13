import express, { Response, Request } from "express";
import { MongoClient, ObjectId } from "mongodb";
const app = express();
import { json } from "body-parser";
import { config } from "./config";
const PORT = config.port;
const DB_URL = config.DB_URL;
app.use(json());
import { User } from "./TypeOf";
const client = new MongoClient(DB_URL);
const bcrypt = require('bcrypt');
const encrypt = bcrypt.hashSync("myPassword", 10);
const jwt = require('jsonwebtoken');




app.post('/register', async (req: Request, res: Response) => {
    const user: User = req.body;
    await client.connect();

    const Token = jwt.sign(user, config.JWT_SECRET);
    await client.db("test").collection("devices").insertOne({
        id: new ObjectId(),
        username: user.username,
        password: encrypt,
        email: user.email,
        Token: Token
    });
    await client.close();
    res.status(201).json({
        user: user,
        token: Token
    });
});


app.post('/login', async (req: Request, res: Response) => {
    await client.connect();
    const user: User = req.body;
    const userFromDb = await client.db("test").collection("devices").findOne({ username: user.username });
    if (userFromDb) {
        const isPasswordCorrect = bcrypt.compareSync(user.password, userFromDb.password);
        if (isPasswordCorrect) {
            const Token = jwt.sign(user, config.JWT_SECRET);
            await client.db("test").collection("devices").updateOne({ username: user.username }, { $set: { Token: Token } });
            await client.close();
            res.status(200).json({
                user: userFromDb,
                token: Token
            });
        } else {
            res.status(401).json({
                message: "Password is incorrect"
            });
        }
    } else {
        res.status(404).json({
            message: "User not found"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});





