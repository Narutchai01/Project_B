import { dbMG } from "./DatabaseMG";
import User from "./User";
const bcrypt = require('bcrypt');
import { dbname } from '../server'
import { Request, Response } from "express";



class LoginController extends User  {
    constructor(email: string, password: string) {
        super(email, password, '');
    }
    private async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
    async login() {
        try {
            const user = await dbMG.getClient().db(dbname).collection('users').findOne({ 'data.email': this.getEmail()});
            if (user) {
                const result = await this.comparePassword(this.getPassword(), user.data.password);
                if (result) {
                    return user;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    public async logout(req: Request, res: Response) {
        try {
            const token = req.cookies.token;
            if (!token) {
                res.status(401).send('unauthorized');
            }
            res.clearCookie('token');
        }
        catch (err) {
            console.log(err);
        }
    }
    register(): Promise<any> {
        throw new Error("Method not implemented.");
    }
}

export default LoginController;