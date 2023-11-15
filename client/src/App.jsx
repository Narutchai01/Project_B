import './App.css'
import { Routes,Route } from 'react-router-dom'
// import { useState } from 'react'

import LandingPage from './pages/LandingPage'
import Homepage from './pages/Homepage'
// import Game from './pages/Game'
import Leaderboard from './pages/Leaderboard'
import Account from './pages/Account'


const App = () => {

  // // gamestate NONE, WAITING_TO_START, INPROGRESS, WINNING, LOSING
  // const [stage, setStage] = useState('NONE')

  // // toggle gameObject
  // const [gameStart, setGameStart] = useState(false)
  // const [gameObj, setGameObj] = useState(<Game setAppState={setStage}/>)
  // const toggleGameObj = () => {
  //   setGameStart(!gameStart)
  //   if(gameStart) setGameObj(<Game setAppState={setStage}/>)
  //   else setGameObj()
  // }


  return (
    <>
      {/* <div>{stage}</div>
      <button onClick={toggleGameObj}>Toggle</button>
      {gameObj} */}
      <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/:username' element={<Homepage/>} />
        <Route path='/leaderboard/:mode' element={<Leaderboard/>} />
        <Route path='/account/:username/:mode' element={<Account/>} />
      </Routes>
    </>
  )
}

export default App
