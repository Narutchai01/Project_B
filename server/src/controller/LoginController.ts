import { dbMG } from "./DatabaseMG";
import User from "./User";
const bcrypt = require('bcrypt');
import { dbname } from '../server'



class LoginController {
    private email: string;
    private password: string;
    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
    private async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
    async login() {
        try {
            const user = await dbMG.getClient().db(dbname).collection('users').findOne({ email: this.email });
            if (!user) {
                return false;
            }
            const result = await this.comparePassword(this.password, user.password);
            if (!result) {
                return false;
            }
            return new User(user.email, user.password, user.username);
        }
        catch (err) {
            console.log(err);
        }
    }
}

export default LoginController;