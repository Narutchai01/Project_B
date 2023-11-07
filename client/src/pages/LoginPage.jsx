import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"



const LoginPage = () => {


    const navigate = useNavigate()

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
            // console.log(LoginData);
            await axios.post('http://localhost:8080/api/login', LoginData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(res => {
                    navigate(`/${res.data.result.username}`)
                })
                .catch(err => {
                    // navigate('/Register')
                    console.log(err);
                })
        }
        catch (err) {
            console.log(err);
        }
    }


    return (
        <>
            <div className="flex w-screen h-screen ">
                <div className="bg-red-600 w-[983px]">
                </div>
                <div>
                    <div className="flex flex-col justify-center items-center h-screen text-center w-[497px]">
                        <div className="flex flex-col justify-center items-center">
                            <h1 className="text-5xl font-bold text-gray-700 mb-10 ">Login</h1>
                            <form className="flex flex-col justify-center items-center border-gray-900 border-[1px] p-[50px] rounded-lg">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
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
                                    onClick={handelLogin}
                                >
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginPage
