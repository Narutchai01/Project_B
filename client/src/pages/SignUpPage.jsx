import { useState } from "react"
import axios from "axios"


const SignUpPage = ({setSignUpPage,setLoginPage}) => {

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
    axios.post('http://localhost:8080/api/register', createNewUser)
    console.log(SignUp)
    setSignUpPage(false)
    setLoginPage(true)
  }

  return (
    <>
      <h1 className="">SignUp</h1>
      <form className="" onSubmit={handelSignUp}>
        <input type="email" name="email" placeholder="Email" className="" onChange={handleChange} />
        <input type="text" name="username" placeholder="Username" className="" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" className="" onChange={handleChange} />
        <button type="submit" className="" >
            Create Account
        </button>
      </form>
    </>
  )}

export default SignUpPage
