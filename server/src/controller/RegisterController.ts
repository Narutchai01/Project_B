const bcrypt = require('bcrypt');
import User from "./User";


class RegisterController extends User{  
    constructor(email: string, password: string, username: string) {
        super(email, password, username);
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
    public async register(): Promise<any> {
        try {
            const hashedPassword = await this.hashPassword(this.getPassword());
            const result = {
                email: this.getEmail(),
                password: hashedPassword,
                username: this.getUsername(),
            }
            return result;
        }
        catch (err) {
            console.log(err);
        }
    }
    login(): Promise<any> {
        throw new Error("Method not implemented.");
    }
}

export  default RegisterController;