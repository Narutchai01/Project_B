import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"


const Homepage = () => {

    const { username } = useParams()
    const [user, setUser] = useState({})

    const fetchUser = async () => {
        const res = await axios.get(`http://localhost:8080/api/${username}`, { withCredentials: true })
        setUser(res.data)
    }    

    useEffect(() => {
        
        fetchUser()
    },)

    console.log(user);

    return (
        <>
            <h1>{user._id}</h1>
            <h1>{user.email}</h1>
            <h1>{user.username}</h1>
        </>
    )
}

export default Homepage
