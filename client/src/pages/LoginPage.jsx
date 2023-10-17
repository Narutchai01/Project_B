import { useState } from "react"
import axios from "axios"

const LoginPage = () => {

    const [Login, setLogin] = useState(
        {
            email: ''
            , password: ''
        })

    const handleChange = (e) => {
        setLogin({ ...Login, [e.target.name]: e.target.value })
    }

    const handelLogin = (e) => {
        try{
            e.preventDefault()
            const LoginData = {
                email: Login.email
                , password: Login.password
            }
            console.log(LoginData);
            axios.post('http://localhost:8080/api/login', LoginData)
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                })
        }
        catch(err){
            console.log(err);
        }
    }

    const getToken = () => {
        try{
            axios.get('http://localhost:8080/api/verify')
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                })
        }
        catch(err){
            console.log(err);
        }
    }

    

    return (
        <>
            <h1>Login</h1>
            <form onSubmit={handelLogin}>
                <input type="text" name='email' placeholder="email" onChange={handleChange} />
                <input type="text" name="password" placeholder="password" onChange={handleChange}/>
                <button type="submit">Login</button>
            </form>
            <button onClick={getToken}>GetToken</button>
        </>
    )
}

export default LoginPage
