import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');
import { config } from '../config';
const secret = config.JWT_SECRET;


export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send('unauthorized');
        }
        const decoded = jwt.verify(token, secret);
        console.log(decoded);
        next();
    }
    catch (err) {
        console.log(err);
        res.status(401).send('unauthorized');
    }
}