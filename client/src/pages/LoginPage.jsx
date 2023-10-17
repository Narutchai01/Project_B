import { useState } from "react"
import axios from "axios"

const LoginPage = () => {


    const axiosInstance = axios.create({
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        },
    })

    const [Login, setLogin] = useState(
        {
            email: ''
            , password: ''
        })

    const handleChange = (e) => {
        setLogin({ ...Login, [e.target.name]: e.target.value })
    }

    const handelLogin = async (e) => {
        try {
            e.preventDefault()
            const LoginData = {
                email: Login.email
                , password: Login.password
            }
            console.log(LoginData);
            await axios.post('http://localhost:8080/api/login', LoginData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                })
        }
        catch (err) {
            console.log(err);
        }
    }

    const getToken = () => {
        try {
            axios.get('http://localhost:8080/api/verify', axiosInstance)
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                })
        }
        catch (err) {
            console.log(err);
        }
    }



    return (
        <>
            <h1>Login</h1>
            <form onSubmit={handelLogin}>
                <input type="text" name='email' placeholder="email" onChange={handleChange} />
                <input type="text" name="password" placeholder="password" onChange={handleChange} />
                <button type="submit">Login</button>
            </form>
            <button onClick={getToken}>GetToken</button>
        </>
    )
}

export default LoginPage
