import GameBoard from "./GameBoard"
import axios from "axios"
import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"

import './GamePage.css'
import { IoMenu } from "react-icons/io5";
import { MdHome } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";
import { MdOutlineRestartAlt } from "react-icons/md";

const GamePage = () => {
    const gameDifficulty = {
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

  const { mode, username } = useParams()
  const [state, setState] = useState('NONE')
  const [time, setTime] = useState(0)
  const [flagNum, setFlagNum] = useState(0)


  let totalRevealedCell = 0
  const addTotalRevealedCell = (num) => {
    totalRevealedCell += num
  }


  let gameData = {
    setTime: setTime,
    setAppState: setState,
    setFlagNum: setFlagNum,
    size: gameDifficulty[mode].size,
    mineNum: gameDifficulty[mode].mine,
    addTotalRevealedCell: addTotalRevealedCell
  }

  // toggle gameObject
  const [gameStart, setGameStart] = useState(false)
  const [gameObj, setGameObj] = useState(<GameBoard gameData={gameData} />)
  const toggleGameObj = () => {
    setGameStart(!gameStart)
    if (gameStart) setGameObj(<GameBoard gameData={gameData} />)
    else {
      setGameObj()
      setTime(0)
      setState('NONE')
      setFlagNum(0)
    }
  }

  useEffect(() => {

    if (state === 'LOSING' || state === 'WINNING') {
      axios.post('http://localhost:8080/api/records', {
        username: username,
        gameMode: mode,
        stageTus: state,
        time: {
          minutes: Math.floor(time/60),
          seconds: (time % 60),
        },
        tileRevealed: (totalRevealedCell / (Math.pow(gameData.size, 2) * 6)) * 100
      })
    }
  }, [state, username, mode, time, totalRevealedCell])

  return (
    <>
    <div className="gamepage">
      <div className="widget-contanier">
        <div className="flag">
          FLAG: {flagNum}
        </div>
        <div className="menu">
          <IoMenu/>
          <div className="dropdown-content">
            <div className="content-container">
              <button><MdHome/></button>
              <button><MdAccountCircle/></button>
              <button><MdOutlineRestartAlt/></button>
            </div>
            <hr className="line"></hr>
          </div>
        </div>
        <div className="time">
          {(Math.floor(time/60)).toString().padStart(2, '0')}:{(time % 60).toString().padStart(2, 0)}
        </div>
      </div>
      <div className="game-container">
        {gameObj}
      </div>
    </div>
    </>
  )
}

export default GamePage
