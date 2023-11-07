
abstract class User {
    private email: string;
    private password: string;
    private username: string;
    constructor(email: string, password: string, username: string) {
        this.email = email;
        this.password = password;
        this.username = username;
    }
    getEmail(): string {
        return this.email;
    }
    getPassword(): string {
        return this.password;
    }
    getUsername(): string {
        return this.username;
    }
    abstract login(): Promise<any>;
    abstract register(): Promise<any>;
    
}
export default User;