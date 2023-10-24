import './App.css'
import { Routes,Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Register from './pages/Register'
import Homepage from './pages/Homepage'
import Rootpage from './pages/Rootpage'
import { useState } from 'react'

import Game from './Game'


const App = () => {

  // gamestate NONE, WAITING_TO_START, INPROGRESS, WINNING, LOSING
  const [stage, setStage] = useState('NONE')

  // toggle gameObject
  const [gameStart, setGameStart] = useState(false)
  const [gameObj, setGameObj] = useState(<Game setAppState={setStage}/>)
  const toggleGameObj = () => {
    setGameStart(!gameStart)
    if(gameStart) setGameObj(<Game setAppState={setStage}/>)
    else setGameObj()
  }


  return (
    <>
      {/* <div>{stage}</div>
      <button onClick={toggleGameObj}>Toggle</button>
      {gameObj} */}
      <Routes>
        <Route path='/' element={<Rootpage/>} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Register" element={<Register />} />
        <Route path='/:username' element={<Homepage/>} />
      </Routes>
    </>
  )
}

export default App
