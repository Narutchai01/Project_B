import { useState } from "react"
import axios from "axios"




const Register = () => {

    const [Register, setRegister] = useState({
        username: ''
        , email: ''
        , password: ''
    })


    const handleChange = (e) => {
        setRegister({ ...Register, [e.target.name]: e.target.value })
    }

    const handelRegister = (e) => {
        e.preventDefault()
        const createNewUser = {
            username: Register.username
            , email: Register.email
            , password: Register.password
        }
        axios.post('http://localhost:8080/api/register', createNewUser)
        console.log(Register);
    }

    return (
        <>
            <h1>Register</h1>
            <form onSubmit={handelRegister} >
                <input type="text" placeholder="username" name="username" onChange={handleChange} />
                <input type="text" placeholder="email" name="email" onChange={handleChange}/>
                <input type="text" placeholder="password" name="password" onChange={handleChange}/>
                <button type="submit">Register</button>
            </form>
        </>
    )
}

export default Register
