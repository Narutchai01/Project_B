import { useState } from "react"
import axios from "axios"
import "./SignUpPage.css"

const SignUpPage = ({ setSignUpPage, setLoginPage, setCubeFocus }) => {

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

    console.log(SignUp)
    
    setSignUpPage(false)
    setLoginPage(true)
    setCubeFocus("login")
  }

  return (
    <>
      <div className="sign-up-page">
        <div className="sign-up-form-container">
          <h2 className="">SignUp</h2>
          <form className="">
          <div className="input-container">
            <input type="email" name="email" placeholder="Email" className="" onChange={handleChange} />
            <input type="text" name="username" placeholder="Username" className="" onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" className="" onChange={handleChange} />
          </div>
          <button type="submit" className="" onClick={handelSignUp}>
              Create Account
          </button>
          </form>
        </div>
      </div>
    </>
  )}

export default SignUpPage
