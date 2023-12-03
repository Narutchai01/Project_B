import { useEffect, useState, useRef } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, RoundedBox, Text } from '@react-three/drei'
import { a } from '@react-spring/three'

import Flag from './Flag'
import { runFuncOnCells } from '../util/Init'





//BUTTON-----------------------------------------------------------------

const Button = ({ position, GameData, SideProp }) => {
  let cord = []
  cord[SideProp.fixedCord[0]] = SideProp.fixedCord[1]
  cord[SideProp.pCord[0]] = position[0] * SideProp.flippedCord[SideProp.pCord[0]]
  cord[SideProp.pCord[1]] = position[1] * SideProp.flippedCord[SideProp.pCord[1]]
  let name = cord.toString()
  let thisCell = GameData.dict.get(name)

  let revealPosition = [position[0], position[1], position[2] - 0.05]
  let [flagged, setFlag] = useState(false)
  let isMined = thisCell.isMined

  const revealAllMines = () => {
    GameData.dict.forEach((cell, name) => {
      if (cell.isMined) GameData.setReveal(name)
      GameData.dict.get(name).isRevealed = true
    })
  }

  const revealCells = (cord) => {
    let revealedCellNum = 0
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
      revealedCellNum++

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
    return revealedCellNum
  }

  const losing = () => {
    revealAllMines()
    GameData.setGameState('LOSING')
  }

  const isWinning = () => {
    let result = true
    GameData.dict.forEach(cell => {
      if (!cell.isMined && !cell.isRevealed) return result = false
    })
    return result
  }

  const winning = () => {
    GameData.setGameState('WINNING')
  }


  const onClickFunc = () => {
    if (GameData.gameState == 'WAITING_TO_START') GameData.setGameState('INPROGRESS')
    else if (flagged || thisCell.isRevealed || GameData.gameState != 'INPROGRESS') return
    if (isMined) {
      losing()
      return
    }

    GameData.GameFunc.addTotalRevealedCell(revealCells(cord))

    if (isWinning()) {
      winning()
      return
    }
  }


  const [pinFlag, setPinFlag] = useState();

  const onContextFunc = () => {
    if (thisCell.isRevealed || GameData.gameState != 'INPROGRESS' || (GameData.flagNum == 0 && flagged == false)) return

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

class GameData {
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

const MineCube = ({ size, dict, mineNum, GameFunc, setAppState }) => {
  const offset = ((size - 1) % 2) / 2
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
      GameFunc.startTimer()
      setAppState(gameState)
    }
    if (gameState == 'WINNING' || gameState == 'LOSING') {
      GameFunc.stopTimer()
      setAppState(gameState)
    }
  }, [gameState])

  const [flagNum, setFlagNum] = useState(mineNum)

  useEffect(() => {
    GameFunc.setFlagText(flagNum)
  }, [flagNum])


  let Data = new GameData(dict, size, isReveal, handleSetReveal, gameState, setGameState, flagNum, setFlagNum, GameFunc)
  let side1Prop = new SideProp([size / 2, offset, -offset], [0, 1.57, 0], [0, fixedCord], [2, 1], [1, 1, -1])
  let side2Prop = new SideProp([-size / 2, offset, offset], [0, -1.57, 0], [0, -fixedCord], [2, 1], [1, 1, 1])
  let side3Prop = new SideProp([offset, size / 2, offset], [-1.57, 0, 0], [1, fixedCord], [0, 2], [1, 1, -1])
  let side4Prop = new SideProp([offset, -size / 2, -offset], [1.57, 0, 0], [1, -fixedCord], [0, 2], [1, 1, 1])
  let side5Prop = new SideProp([offset, offset, size / 2], [0, 0, 0], [2, fixedCord], [0, 1], [1, 1, 1])
  let side6Prop = new SideProp([-offset, -offset, -size / 2], [3.14, 0, 3.14], [2, -fixedCord], [0, 1], [-1, 1, 1])

  return (
    <mesh onClick={(e) => { e.stopPropagation() }} onContextMenu={(e) => { e.stopPropagation() }} >
      <boxGeometry attach='geometry' args={[size, size, size]} />
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

export default MineCube
