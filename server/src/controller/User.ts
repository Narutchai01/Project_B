class User {
    private id: string;
    private email: string;
    private password: string;
    private username: string;
    constructor(id: string, email: string, password: string, username: string) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.username = username;
    }
    getId(): string {
        return this.id;
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
}

export default User;