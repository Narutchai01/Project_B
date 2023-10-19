const bcrypt = require('bcrypt');
import User from "./User";


class RegisterController {
    private username: string;
    private password: string;
    private email: string;
    constructor(username: string, password: string , email: string) {
        this.username = username;
        this.password = bcrypt.hashSync(password, 10);
        this.email = email;
    }
}

export  default RegisterController;