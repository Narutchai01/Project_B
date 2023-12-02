import { useState } from "react"
import axios from "axios"
import "./SignUpPage.css"

const SignUpPage = ({ setSignUpPage, setLoginPage, setCubeFocus }) => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  const [SignUp, setSignUp] = useState({
    username: ''
    , email: ''
    , password: ''
  })

  const handleChange = (e) => {
    setSignUp({ ...SignUp, [e.target.name]: e.target.value })
  }

  const handelSignUp = (e) => {
    e.preventDefault()
    const createNewUser = {
      username: SignUp.username
      , email: SignUp.email
      , password: SignUp.password
    }
    axios.post("http://localhost:8080/api/register", createNewUser)
    
    setSignUpPage(false)
    setLoginPage(true)
    setCubeFocus("login")

    setEmail('')
    setUsername('')
    setPassword('')
  }

  return (
    <>
      <div className="sign-up-page">
        <div className="sign-up-form-container">
          <h2 className="">SignUp</h2>
          <form onSubmit={handelSignUp}>
          <div className="input-container">
            <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => {handleChange; setEmail(e.target.value)}} />
            <input type="text" name="username" placeholder="Username" value={username} onChange={(e) => {handleChange; setUsername(e.target.value)}} />
            <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => {handleChange; setPassword(e.target.value)}} />
          </div>
          <button type="submit">
              Create Account
          </button>
          </form>
        </div>
      </div>
    </>
  )}

export default SignUpPage
