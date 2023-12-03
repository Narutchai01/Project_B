import { useEffect, useState, useRef } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, RoundedBox, Text } from '@react-three/drei'
import { a } from '@react-spring/three'

import MineCube from '../components/MineCube'
import { init } from '../util/Init'


class GameFunc {
  constructor(setFlagText, startTimer, stopTimer, addTotalRevealedCell) {
    this.setFlagText = setFlagText
    this.startTimer = startTimer
    this.stopTimer = stopTimer
    this.addTotalRevealedCell = addTotalRevealedCell
  }
}

const GameBoard = ({ gameData }) => {
  const size = gameData.size
  const mineNum = gameData.mineNum
  const dict = init(size, mineNum)

  const setFlagText = (num) => {
    gameData.setFlagNum(num)
  }

  let secondsOfTime = 0
  let interval = null
  const timer = () => {
    secondsOfTime++
    gameData.setTime(secondsOfTime)
  }
  const startTimer = () => {
    interval = setInterval(timer, 1000)
  }
  const stopTimer = () => {
    clearInterval(interval)
    interval = null
  }

  let GameFunction = new GameFunc(setFlagText, startTimer, stopTimer, gameData.addTotalRevealedCell)

  return (
    <>
      <Canvas>
        <ambientLight intensity={1} color={'ligntblue'} />
        <pointLight intensity={240} color={'red'} position={[size * 2, size * 2, size * 2]} />
        <pointLight intensity={360} color={'purple'} position={[-size * 2, -size * 2, -size * 2]} />
        <OrbitControls enablePan={false} minDistance={size} maxDistance={size * 2} />
        <MineCube size={size} dict={dict} mineNum={mineNum} GameFunc={GameFunction} setAppState={gameData.setAppState} />
      </Canvas>
    </>
  )
}

export default GameBoard
