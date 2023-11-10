import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"


const Homepage = () => {

    const {username} = useParams()
    const [User, setUser] = useState({})

    const getUser = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/${username}`).then(res => {
                setUser(res.data)
            })
            console.log(res.data);
        }
        catch (err) {
            console.log(err);
        }
    }

    console.log(User);
    useEffect(() => {
        getUser()
    })

    return (
        <>
        <h1>{User.email}</h1>
        </>
    )

}

export default Homepage
