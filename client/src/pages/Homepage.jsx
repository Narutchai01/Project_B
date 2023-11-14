import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import './Homepage.css'
import { HiMiniUserCircle } from "react-icons/hi2";


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
        <div className="Menu">
            <div className="Account" >
                <a href="/account/:username/:mode"> 
                    <HiMiniUserCircle className="AccountPic"/>
                </a>
                
            </div>
            <div className="Box">

            </div>
            <div className="Difficulty">
                <h1>
                    Beginner
                </h1>
                <h1>
                    Intermediate
                </h1>
                <h1>
                    Expert
                </h1>
            </div>
            <hr className="Line"></hr>
        </div>

        </>
    )

}

export default Homepage
