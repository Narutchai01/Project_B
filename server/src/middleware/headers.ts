import { Request, Response, NextFunction } from 'express';

class authservice {
    async headers(req: Request, res: Response, next: NextFunction) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    }
}

export const auth = new authservice().headers;