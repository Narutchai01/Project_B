import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"


const Register = () => {

    const [Register, setRegister] = useState({
        username: ''
        , email: ''
        , password: ''
    })

    const navigate = useNavigate()

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
        axios.post('http://localhost:8080/api/register', createNewUser).then(
            navigate('/Login')
        )
        console.log(Register);
    }

    return (
        <>
            <div className="flex w-screen h-screen container">
                <div className="flex flex-col justify-center items-center h-screen text-center w-[497px]">
                    <div className="flex flex-col justify-center items-center">
                        <h1 className="text-5xl font-bold text-gray-700 mb-10 ">Register</h1>
                        <form className="flex flex-col justify-center items-center border-gray-900 border-[1px] p-[50px] rounded-lg">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="w-[300px] h-[50px] border-2 border-gray-700 rounded-md px-5 mb-5"
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                className="w-[300px] h-[50px] border-2 border-gray-700 rounded-md px-5 mb-5"
                                onChange={handleChange}
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="w-[300px] h-[50px] border-2 border-gray-700 rounded-md px-5 mb-5"
                                onChange={handleChange}
                            />
                            <button
                                type="submit"
                                className="w-[300px] h-[50px] bg-red-600 text-white font-bold rounded-md"
                                onClick={handelRegister}
                            >
                                Login
                            </button>
                        </form>
                    </div>
                </div>
                <div className="w-[983px]">
                </div>
            </div>
        </>
    )
}

export default Register
