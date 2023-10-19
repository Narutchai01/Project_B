import { dbMG } from "./DatabaseMG";
const bcrypt = require('bcrypt');
import { dbname } from '../server'



class LoginController {
    private email: string;
    private password: string;
    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
    async login() {
        const user = await dbMG.getClient().db(dbname).collection('users').findOne({ email: this.email })
        if (!user) {
            return user;
        }
        const matchPassWord = await bcrypt.compare(this.password, user.password);
        if (!matchPassWord) {
            return matchPassWord;
        }
        return user;
    }
}

export default LoginController;