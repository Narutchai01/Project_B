import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import './LoginPage.css'


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
      await axios.post('http://localhost:8080/api/login', LoginData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        },
      }).then(res => {
        navigate(`/${res.data.result.username}`)
      }).catch(err => {
        console.log(err);
      })
    }
    catch (err) {
      console.log(err);
    }
  }


  return (
    <>
      <div className="login-page">
        <h1 className="">Login</h1>
        <form>
          <input type="email" name="email" placeholder="Email" className="" onChange={handleChange}/>
          <input type="password" name="password" placeholder="Password" className="" onChange={handleChange} />
          <button type="submit" className="" onClick={handelLogin}>
            Login
          </button>
        </form>
      </div>
    </>
  )}

export default LoginPage
