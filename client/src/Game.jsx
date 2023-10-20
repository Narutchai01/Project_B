import { React, useEffect, useState, useRef } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, RoundedBox, Text } from '@react-three/drei'
import { a } from '@react-spring/three'
import './Game.css'


class Cell {
  constructor(isMined, adjacentMines, isRevealed = false, isFlagged = false ) {
    this.isMined = isMined
    this.adjacentMines = adjacentMines
    this.isRevealed = isRevealed
    this.isFlagged = isFlagged
  }
}



const initMines = (dict, size, mineNum) => {
  const maxCord = Math.floor(size/2)
  let minedCell = new Cell(true, '')
  let temp = [0, 0, 0]
  for (let i = 0; i < mineNum; i++) {
    let fixedCord = Math.floor(Math.random() * 3)
    temp[fixedCord] = (maxCord + 1) * (Math.round(Math.random()) ? 1 : -1)
    
    for (let j = 0; j < 3; j++) {
      if (j != fixedCord)
        temp[j] = Math.floor(Math.random() * size) - maxCord
    }
    
    if (dict.has(temp.toString())) {
      i--
      continue
    }
    dict.set(temp.toString(), minedCell)
  }
}

const runFuncOnCells = (dict, size, inputFunction) => {
  const maxCord = Math.floor(size/2)
  let temp = [0, 0, 0]
  const CUBE_SIDE_NUM = 6

  for (let i = 0; i < CUBE_SIDE_NUM; i++) {
    let fixedCord = i % 3
    if (i % 2 == 0) temp[fixedCord] = maxCord + 1
    else temp[fixedCord] = -maxCord - 1
    
    for (let j = -maxCord; j <= maxCord; j++) {
      for (let k = -maxCord; k <= maxCord; k++) {
        switch (fixedCord) {
          case 0:
            temp[1] = j
            temp[2] = k
            break
          case 1:
            temp[0] = j
            temp[2] = k
            break
          case 2:
            temp[0] = j
            temp[1] = k
            break
        }
        inputFunction(dict, temp)
      }
    }
  }
}

const createNonMinedCells = (dict, cord) => {
  let sCord = cord.toString()
  if (!dict.has(sCord)) {
    let nonMinedCell = new Cell(false, '')
    dict.set(sCord, nonMinedCell)
  }
}

const createAdjencyMineNum = (dict, cord) => {
  let sCord = cord.toString()
  if (dict.get(sCord).isMined) return
  
  let mineSum = 0
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      for (let k = -1; k < 2; k++) {
        let adjCord = [cord[0] + i, cord[1] + j, cord[2] + k]
        let sAdjCord = adjCord.toString()
        if (!dict.has(sAdjCord)) continue
        if (dict.get(sAdjCord).isMined) mineSum++
      }
    }
  }
  if (mineSum > 0) dict.get(sCord).adjacentMines = mineSum.toString()
}

const init = (size, mineNum) => {
  let dict = new Map()
  
  initMines(dict, size, mineNum)
  
  runFuncOnCells(dict, size, createNonMinedCells)
  runFuncOnCells(dict, size, createAdjencyMineNum)
  
  return dict
}


//SPIKE

const Spike = ({ rotation, position }) => {
  return (
    <mesh rotation={rotation} position={position} >
      <cylinderBufferGeometry attach='geometry' args={[0.05, 0.075, 0.04]} />
      <meshLambertMaterial attach='material' color={'#737373'} />
    </mesh>
  )
}

//MINE---------------------------------------------------------------

const Mine = ({ size = 1, rotation }) => {
  return (
    <mesh scale={[size, size, size]} rotation={[0, 0, 0]} position={[0,0,0.05]}>
      <mesh>
        <sphereBufferGeometry args={[0.25, 24, 24]} />
        <meshStandardMaterial color={"#737373"} />
      </mesh>
    </mesh>
  )
}

//FLAG---------------------------------------------------------------

const Flag = ({ size, rotation }) => {

  return (
    <mesh scale={[size, size, size]} rotation={[0, 0, rotation]}>
      <mesh rotation={[1.57, 0, 0]} position={[0, 0, 0.2]} >
        <cylinderBufferGeometry attach='geometry' args={[0.02, 0.02, 0.4]} />
        <meshLambertMaterial attach='material' color={'#737373'} />
      </mesh>
      <mesh position={[0.1, 0.045, 0.34]} rotation={[0, 0, 0.4]} >
        <boxBufferGeometry attach='geometry' args={[0.2, 0.01, 0.1]} />
        <meshStandardMaterial attach='material' color='orange' />
      </mesh>
    </mesh>
  )
}

//BUTTON-----------------------------------------------------------------

const Button = ({ position, GameData, SideProp }) => {
  let cord = []
  cord[SideProp.fixedCord[0]] = SideProp.fixedCord[1]
  cord[SideProp.pCord[0]] = position[0] * SideProp.flippedCord[SideProp.pCord[0]]
  cord[SideProp.pCord[1]] = position[1] * SideProp.flippedCord[SideProp.pCord[1]]
  let name = cord.toString()
  let thisCell = GameData.dict.get(name)
  
  let revealPosition = [position[0], position[1], position[2]-0.05]
  let [flagged, setFlag] = useState(false)
  let isMined = thisCell.isMined
  

  const revealAllMines = () => {
    GameData.dict.forEach((cell, name) => {
      if (cell.isMined) GameData.setReveal(name)
      GameData.dict.get(name).isRevealed = true
    })
  }
  
  const revealCells = (cord) => {
    const stack = []
    stack.push(cord)

    let tempCord = []

    while (stack.length > 0) {
      const curCord = stack.pop()
      const curCellName = curCord.toString()
      const curCell = GameData.dict.get(curCellName)
      
      if (curCell.isRevealed || (curCell.isFlagged && curCell.isMined)) continue
      
      GameData.setReveal(curCellName)
      curCell.isRevealed = true
      
      if (curCell.adjacentMines != '') continue
      
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          for (let k = -1; k <= 1; k++) {
            tempCord = [curCord[0] + i, curCord[1] + j, curCord[2] + k]
            if (tempCord == curCord) continue
            
            let tempCordName = tempCord.toString()
            if (!GameData.dict.has(tempCordName) || stack.includes(tempCordName)) continue
            
            stack.push(tempCord)
            
          }
        }
      }

    }
  }
  
  const losing = () => {
    revealAllMines()
    GameData.setGameState('LOSING')
    console.log('losing')
  }
  
  const isWinning = () => {
    let result = true
    GameData.dict.forEach(cell => {
      if (!cell.isMined && !cell.isRevealed) return result = false
    })
    return result
  }
  
  const winning = () => {
    console.log('winning')
    GameData.setGameState('WINNING')
  }
  
  
  const onClickFunc = () => {
    if (GameData.gameState == 'WAITING_TO_START') GameData.setGameState('INPROGRESS')
    if (flagged || thisCell.isRevealed || GameData.gameState != 'INPROGRESS') return
    if (isMined) {
      losing()
      return
    }
    
    revealCells(cord)
    
    if (isWinning()) {
      winning()
      return
    }
  }
  
  
  
  const [pinFlag, setPinFlag] = useState();

  const onContextFunc = () => {
    if (thisCell.isRevealed || GameData.gameState != 'INPROGRESS'  || (GameData.flagNum == 0 && flagged == false)) return 
    
    if (!flagged) {
      GameData.setFlagNum(GameData.flagNum - 1)
      setPinFlag(<Flag size={1.5} rotation={Math.random() * 6.28} />)
    }
    else {
      GameData.setFlagNum(GameData.flagNum + 1)
      setPinFlag()
    }
    setFlag(!flagged)
    thisCell.isFlagged = flagged
  }
  
  
  return (
    <a.mesh onClick={(e) => { e.stopPropagation(); onClickFunc() }} onContextMenu={(e) => { e.stopPropagation(); onContextFunc() }} position={GameData.isReveal[name] ? revealPosition : position}>
      <RoundedBox args={[0.97, 0.97, 0.14]} radius={0.05} >
        <meshLambertMaterial attach='material' needUpdate={true} color={GameData.isReveal[name] ? isMined ? 'pink' : 'darkgray' : flagged ? '#fbc286' : 'lightgray'} />
      </RoundedBox>
      <Text scale={GameData.isReveal[name] ? [0.4, 0.4, 0.4] : [0, 0, 0]} position={[0, 0, 0.071]}>
        {thisCell.adjacentMines}
      </Text>
      {pinFlag}
    </a.mesh>
  )
}

//SIDE---------------------------------------------------------------

const createButtons = (num) => {
  let table = []
  let offset = Math.floor(num / 2)
  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      table[(num * i) + j] = [i - offset, j - offset, 0]
    }
  }
  return table
}

const Side = ({ SideProp, GameData }) => {
  
  const buttons = createButtons(GameData.size).map((cords, i) =>
    (<Button key={i} position={cords} GameData={GameData} SideProp={SideProp} />)
  )

  return (
    <mesh position={SideProp.position} rotation={SideProp.rotation}>
      {buttons}
    </mesh>
  )
}

//BOX---------------------------------------------------------------

const generateChildId = (size) => {
  let idList = []
  runFuncOnCells(idList, size, (list, cord) => {
    list.push(cord.toString())
  })
  return idList
}

const generateInitialStates = (ids) => {
  const initialStates = {}
  ids.forEach(id => {
    initialStates[id] = false
  })
  return initialStates
}

class SideProp {
  constructor(position, rotation, fixedCord, pCord, flippedCord) {
    this.position = position
    this.rotation = rotation
    this.fixedCord = fixedCord
    this.pCord = pCord
    this.flippedCord = flippedCord
  }
}

class GameData{
  constructor(dict, size, isReveal, setReveal, gameState, setGameState, flagNum, setFlagNum, GameFunc) {
    this.dict = dict
    this.size = size
    this.isReveal = isReveal
    this.setReveal = setReveal
    this.gameState = gameState
    this.setGameState = setGameState
    this.flagNum = flagNum
    this.setFlagNum = setFlagNum
    this.GameFunc = GameFunc
  }
}

const Box = ({ dict, size, mineNum, GameFunc, setAppState }) => {
  const offset = ((size-1)%2)/2
  const fixedCord = Math.floor(size / 2) + 1
  
  const childIds = generateChildId(size)
  const [isReveal, setReveal] = useState(generateInitialStates(childIds))
  
  const handleSetReveal = (childId) => {
    setReveal(prevState => ({
      ...prevState,
      [childId]: true,
    }))
  }
  
  const [gameState, setGameState] = useState('WAITING_TO_START')
  
  const firstRender1 = useRef(true)
  useEffect(() => {
    if (firstRender1.current) {
      firstRender1.current = false
      setAppState(gameState)
      return
    }
    if (gameState == 'INPROGRESS') {
      console.log('start')
      GameFunc.startTimer()
      setAppState(gameState)
    }
    if (gameState == 'WINNING' || gameState == 'LOSING' ) {
      console.log('stop')
      GameFunc.stopTimer()
      setAppState(gameState)
    }
  }, [gameState])
  
  const [flagNum, setFlagNum] = useState(mineNum)
  
  useEffect(() => {
    GameFunc.setFlagText(flagNum)
  }, [flagNum])
  
  
  let Data = new GameData(dict, size, isReveal, handleSetReveal, gameState, setGameState, flagNum, setFlagNum, GameFunc)
  let side1Prop = new SideProp([ size / 2,  offset, -offset],  [0, 1.57, 0],  [0, fixedCord],  [2, 1], [1, 1, -1])
  let side2Prop = new SideProp([-size / 2,  offset,  offset],  [0, -1.57, 0], [0, -fixedCord], [2, 1], [1, 1, 1])
  let side3Prop = new SideProp([ offset,  size / 2,  offset],  [-1.57, 0, 0],  [1, fixedCord],  [0, 2], [1, 1, -1])
  let side4Prop = new SideProp([ offset, -size / 2, -offset],  [1.57, 0, 0], [1, -fixedCord], [0, 2], [1, 1, 1])
  let side5Prop = new SideProp([ offset,  offset,  size / 2 ], [0, 0, 0],     [2, fixedCord],  [0, 1], [1, 1, 1])
  let side6Prop = new SideProp([-offset, -offset, -size / 2],  [3.14, 0, 3.14],  [2, -fixedCord], [0, 1], [-1, 1, 1])
  
  return (
    <mesh onClick={(e) => { e.stopPropagation() }} onContextMenu={(e) => {e.stopPropagation() }} >
      <boxBufferGeometry attach='geometry' args={[size, size, size]} />
      <meshStandardMaterial attach='material' color='gray' />
      <Side GameData={Data} SideProp={side1Prop} />
      <Side GameData={Data} SideProp={side2Prop} />
      <Side GameData={Data} SideProp={side3Prop} />
      <Side GameData={Data} SideProp={side4Prop} />
      <Side GameData={Data} SideProp={side5Prop} />
      <Side GameData={Data} SideProp={side6Prop} />
    </mesh> 
  )
}

//GAMEBOARD---------------------------------------------------------------

class GameFunc {
  constructor(setFlagText, startTimer, stopTimer, setIconText){
    this.setFlagText = setFlagText
    this.startTimer = startTimer
    this.stopTimer = stopTimer
    this.setIconText = setIconText
  }
}

const GameBoard = ({ size, mineNum, setAppState }) => {
  const flagElem = document.querySelector('.flag')
  const timeElem = document.querySelector('.time')

  const setFlagText = (num) => {
    if (num < 100) num = '0' + num
    if (num < 10) num = '00' + num
    flagElem.innerHTML = num
  }

  let secondsOfTime = 0
  let interval = null
  const timer = () => {
    secondsOfTime++

    let minutes = Math.floor(secondsOfTime / 60)
    let seconds = secondsOfTime % 60
    if (minutes < 10) minutes = '0' + minutes
    if (seconds < 10) seconds = '0' + seconds

    timeElem.innerHTML = minutes + ':' + seconds
  }
  const startTimer = () => {
    interval = setInterval(timer, 1000)
  }
  const stopTimer = () => {
    clearInterval(interval)
    interval = null
  }

  let dict = init(size, mineNum)
  let GameFunction = new GameFunc(setFlagText, startTimer, stopTimer)

  return (
    <>
      <ambientLight intensity={0.5} color={'lightblue'} />
      <OrbitControls enablePan={false} />
      <pointLight intensity={0.4} color={'red'} position={[size*2, size*2, size]} />
      <pointLight intensity={0.7} color={'purple'} position={[-size*2, -size, -size*2]} />
      <Box size={size} dict={dict} mineNum={mineNum} GameFunc={GameFunction} setAppState={setAppState} />
    </>
  )
}

//---------------------------------------------------------------

const Game = ({ setAppState }) => {
  
  return (
    <>
      <div className='gameBar'>
        <div className='gameBarComponent flagNumber'>
          <div className='flag'>000</div>
        </div>
        <div className='gameBarComponent resetButton'>
          <span className='material-symbols-rounded'></span>
        </div>
        <div className='gameBarComponent timer'>
          <div className='time'>00:00</div>
        </div>
      </div>
      <div className='game'>
        <div className='canvas'>
          <Canvas>
            <GameBoard size={5} mineNum={20} setAppState={setAppState}/>
          </Canvas>
        </div>
      </div>
    </>
  )
}

export default Game
