import GameBoard from "./GameBoard"
import axios from "axios"
import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"

import './GamePage.css'


const GamePage = () => {

  const { mode, username } = useParams()
  const [stage, setStage] = useState('NONE')
  const [time, setTime] = useState(0)

  useEffect(() => {
    let interval;
    if (stage === 'INPROGRESS') {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1)
      })
    }
    return () => clearInterval(interval)
  }, [stage, time])


  let minutes = Math.floor((time % 360000) / 6000);
  let seconds = Math.floor((time % 6000) / 100);
  let milliseconds = Math.floor((time % 100));



  var gameDifficulty = {
    beginner: {
      size: 5,
      mine: 22
    },
    intermediate: {
      size: 7,
      mine: 60
    },
    expert: {
      size: 9,
      mine: 111
    }
  }

  // toggle gameObject
  const [gameStart, setGameStart] = useState(false)
  const [gameObj, setGameObj] = useState(<GameBoard size={gameDifficulty[mode].size} mineNum={gameDifficulty[mode].mine} setAppState={setStage} />)
  const toggleGameObj = () => {
    setGameStart(!gameStart)
    if (gameStart) setGameObj(<GameBoard size={gameDifficulty[mode].size} mineNum={gameDifficulty[mode].mine} setAppState={setStage} />)
    else setGameObj()
  }



  useEffect(() => {

    if (stage === 'LOSING' || stage === 'WINNING') {
      axios.post('http://localhost:8080/api/records', {
        username: username,
        gameMode: mode,
        stageTus: stage,
        time: {
          minutes: minutes,
          seconds: seconds,
          milliseconds: milliseconds
        }
      })
    }
  }, [stage, username, mode, time, minutes, seconds, milliseconds])

  return (
    <>
      <div>{stage}</div>
      <div>{mode}</div>
      <div>{time}</div>
      <button onClick={toggleGameObj}>Toggle</button>
      <div className="game-container">
        {gameObj}
      </div>
    </>
  )
}

export default GamePage
