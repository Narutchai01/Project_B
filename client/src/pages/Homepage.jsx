import axios from "axios"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Canvas, useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { HiMiniUserCircle } from "react-icons/hi2";

import './Homepage.css';


const Cube = () => {

  const navigate = useNavigate()
  const [LeaderboardHover, setLeaderboardhover] = useState(false)
  const { username } = useParams()
  const [User, setUser] = useState({})

  

  console.log(User);
  useEffect(() => {
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
  getUser()
  },[username])

  return (
    <mesh rotation={[0.8, -0.785, 0]}>
      <ambientLight intensity={0.2} color='blue' />
      <ambientLight intensity={0.2} color='white' />
      <pointLight intensity={8} color='lightblue' position={[1.8, 2, 2]} />
      <pointLight intensity={6} color='purple' position={[2, -3, 1.8]} />
      <mesh>
        <boxGeometry attach={'geometry'} args={[2, 2, 2]} />
        <meshStandardMaterial attach={'material'} color={'white'} />
        <Text onClick={() => { navigate(`/${username}/leaderboard/beginner`) }}
          color={LeaderboardHover ? 'black' : 'white'}
          position={[0.1, 1.01, 0.1]} scale={[0.4, 0.4, 0.4]}
          rotation={[-1.57, 0, 0.784]}
          onPointerEnter={() => { setLeaderboardhover(true) }}
          onPointerLeave={() => { setLeaderboardhover(false) }}>
          Leaderboard
        </Text>
      </mesh>
    </mesh>
  )
}

const Homepage = () => {

  const { username } = useParams()
  // const [User, setUser] = useState({})

  return (
    <>
      <div className="homepage">
        <div className="account" >
          <Link to={`/account/${username}/beginner`}>
            <h1><HiMiniUserCircle className="account-pic" /></h1>
          </Link>
        </div>
        <div className="Box">
          <Canvas>
            <Cube />
          </Canvas>
        </div>
        <div className="difficulty">
              <Link to={`/${username}/gamepage/beginner`}>
                <h3>Beginner</h3>
              </Link>
              <Link to={`/${username}/gamepage/intermediate`}>
                <h3>Intermediate</h3>
              </Link>
              <Link to={`/${username}/gamepage/expert`}>
                <h3>Expert</h3>
              </Link>
        </div>
        <hr className="Line"></hr>
      </div>
    </>
  )

}

export default Homepage
