interface User {
    id?: string;
    username: string;
    password: string;
    email: string;
    token?: string;
}

export { User };